/**
 * @file auth.service.ts
 * @description Authentication service handling login, refresh token generation & rotation, logout, and password change.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import { comparePassword, hashPassword } from '../../utils/password.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt.js';
import {
  LoginInput,
  ChangePasswordInput,
  RegisterSchoolInput,
  CreateSubscriptionOrderInput,
} from './auth.schema.js';
import { razorpayInstance, verifyRazorpaySignature } from '../../config/razorpay.js';
import { env } from '../../config/env.js';
import crypto from 'crypto';

export class AuthService {
  /**
   * Authenticate user credentials and return access + refresh tokens
   */
  static async login(input: LoginInput, ipAddress?: string, userAgent?: string) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: {
        school: {
          select: { id: true, name: true, code: true, status: true, logoUrl: true },
        },
      },
    });

    if (!user) {
      throw AppError.unauthorized('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw AppError.forbidden('Your account is currently inactive or suspended');
    }

    // Check school status if tenant-owned user
    if (user.school && user.school.status === 'SUSPENDED') {
      throw AppError.forbidden('Your school account is suspended. Contact administrator.');
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password');
    }

    // Generate JWT tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    // Store hashed refresh token in database for session tracking & revocation
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // Update last login timestamp and write audit log
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        schoolId: user.schoolId,
        userId: user.id,
        action: 'USER_LOGIN',
        entity: 'User',
        entityId: user.id,
        ipAddress,
        userAgent,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
        school: user.school,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Rotate refresh token and issue new access token
   */
  static async refreshTokens(rawRefreshToken: string) {
    try {
      const decoded = verifyRefreshToken(rawRefreshToken);
      const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

      const storedToken = await prisma.refreshToken.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        throw AppError.unauthorized('Invalid or expired refresh token');
      }

      // Revoke current refresh token (rotation)
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });

      const user = storedToken.user;
      if (user.status !== 'ACTIVE') {
        throw AppError.unauthorized('User is no longer active');
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
      };

      const newAccessToken = signAccessToken(tokenPayload);
      const newRefreshToken = signRefreshToken(tokenPayload);

      const newTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.refreshToken.create({
        data: {
          userId: user.id,
          tokenHash: newTokenHash,
          expiresAt,
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw AppError.unauthorized('Invalid refresh token');
    }
  }

  /**
   * Revoke active refresh token on logout
   */
  static async logout(rawRefreshToken?: string) {
    if (rawRefreshToken) {
      const tokenHash = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revoked: true },
      });
    }
  }

  /**
   * Get authenticated user profile with linked sub-profiles
   */
  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        avatarUrl: true,
        phone: true,
        lastLoginAt: true,
        school: {
          select: {
            id: true,
            name: true,
            code: true,
            status: true,
            logoUrl: true,
            website: true,
            email: true,
            phone: true,
          },
        },
        teacherProfile: true,
        studentProfile: {
          include: {
            enrollments: {
              where: { status: 'ACTIVE' },
              include: {
                academicYear: true,
                class: true,
                section: true,
              },
            },
          },
        },
        parentProfile: {
          include: {
            students: true,
          },
        },
      },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    return user;
  }

  /**
   * Change user password
   */
  static async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw AppError.notFound('User not found');
    }

    const isMatch = await comparePassword(input.currentPassword, user.passwordHash);
    if (!isMatch) {
      throw AppError.badRequest('Current password is incorrect');
    }

    const newPasswordHash = await hashPassword(input.newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash },
    });

    // Revoke all existing refresh tokens for security
    await prisma.refreshToken.updateMany({
      where: { userId },
      data: { revoked: true },
    });

    return { message: 'Password updated successfully' };
  }

  /**
   * Self-Service School Registration from Public Landing Page
  /**
   * Helper to retrieve subscription pricing
   */
  static getPlanPrice(plan: string, billingCycle: string): number {
    if (plan === 'ENTERPRISE') return billingCycle === 'ANNUALLY' ? 249990 : 24999;
    if (plan === 'PRO') return billingCycle === 'ANNUALLY' ? 79990 : 7999;
    if (plan === 'BASIC') return billingCycle === 'ANNUALLY' ? 24990 : 2499;
    return 0;
  }

  /**
   * Public Razorpay configuration for client checkout
   */
  static getPaymentConfig() {
    return {
      razorpayKeyId: env.RAZORPAY_KEY_ID || null,
      isConfigured: Boolean(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET),
    };
  }

  /**
   * Create Razorpay order for school registration subscription
   */
  static async createSubscriptionOrder(input: CreateSubscriptionOrderInput) {
    if (!razorpayInstance || !env.RAZORPAY_KEY_ID) {
      throw AppError.badRequest('Razorpay gateway is not configured on the server');
    }

    const priceInRupees = AuthService.getPlanPrice(input.plan, input.billingCycle);
    if (priceInRupees <= 0) {
      throw AppError.badRequest('Invalid plan or price for order creation');
    }

    const amountInPaise = Math.round(priceInRupees * 100);

    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `sub_${Date.now().toString().slice(-8)}`,
      notes: {
        plan: input.plan,
        billingCycle: input.billingCycle,
      },
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: env.RAZORPAY_KEY_ID,
      plan: input.plan,
      billingCycle: input.billingCycle,
    };
  }

  /**
   * Self-Service School Registration from Public Landing Page
   * Atomically creates the School Tenant, School Admin user, default Academic Year,
   * sets up Subscription, and issues authentication tokens.
   */
  static async registerSchool(
    input: RegisterSchoolInput,
    ipAddress?: string,
    userAgent?: string
  ) {
    const existingCode = await prisma.school.findUnique({
      where: { code: input.schoolCode.toUpperCase() },
    });
    if (existingCode) {
      throw AppError.conflict(`School code "${input.schoolCode}" is already in use`);
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: input.adminEmail.toLowerCase() },
    });
    if (existingUser) {
      throw AppError.conflict(`Admin email "${input.adminEmail}" is already registered`);
    }

    // Verify Razorpay payment signature if payment was submitted
    if (input.razorpayOrderId && input.razorpayPaymentId && input.razorpaySignature) {
      const isValid = verifyRazorpaySignature(
        input.razorpayOrderId,
        input.razorpayPaymentId,
        input.razorpaySignature
      );
      if (!isValid) {
        throw AppError.badRequest('Invalid Razorpay payment signature');
      }
    }

    const adminPasswordHash = await hashPassword(input.adminPassword);

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create School Tenant
      const maxStudents = input.plan === 'ENTERPRISE' ? 10000 : input.plan === 'PRO' ? 2500 : 500;
      const school = await tx.school.create({
        data: {
          name: input.schoolName,
          code: input.schoolCode.toUpperCase(),
          email: input.schoolEmail.toLowerCase(),
          phone: input.schoolPhone || null,
          address: input.schoolAddress || null,
          status: 'ACTIVE',
          maxStudents,
        },
      });

      // 2. Create School Admin User
      const adminUser = await tx.user.create({
        data: {
          schoolId: school.id,
          name: input.adminName,
          email: input.adminEmail.toLowerCase(),
          passwordHash: adminPasswordHash,
          role: 'SCHOOL_ADMIN',
          phone: input.schoolPhone || null,
        },
      });

      // 3. Create initial Academic Year
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      await tx.academicYear.create({
        data: {
          schoolId: school.id,
          name: `${currentYear}-${nextYear}`,
          startDate: new Date(`${currentYear}-04-01`),
          endDate: new Date(`${nextYear}-03-31`),
          isCurrent: true,
        },
      });

      // 4. Create initial School Subscription
      const endDate = new Date();
      if (input.billingCycle === 'ANNUALLY') {
        endDate.setDate(endDate.getDate() + 365);
      } else {
        endDate.setDate(endDate.getDate() + 30);
      }

      const planAmount = AuthService.getPlanPrice(input.plan, input.billingCycle);
      const isPaid = Boolean(input.razorpayPaymentId);
      const subscriptionStatus = isPaid ? 'ACTIVE' : (input.isTrial ? 'TRIALING' : 'ACTIVE');

      await tx.schoolSubscription.create({
        data: {
          schoolId: school.id,
          plan: input.plan,
          status: subscriptionStatus,
          amount: planAmount,
          billingCycle: input.billingCycle,
          startDate: new Date(),
          endDate,
          nextBillingDate: endDate,
        },
      });

      // 5. If paid via Razorpay, generate paid platform invoice record
      if (isPaid) {
        await tx.platformInvoice.create({
          data: {
            schoolId: school.id,
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            amount: planAmount,
            status: 'PAID',
            dueDate: new Date(),
            paidAt: new Date(),
            paymentMethod: 'RAZORPAY',
          },
        });
      }

      // 6. Audit Log
      await tx.auditLog.create({
        data: {
          schoolId: school.id,
          userId: adminUser.id,
          action: 'SELF_SERVICE_SCHOOL_REGISTERED',
          entity: 'School',
          entityId: school.id,
          details: {
            plan: input.plan,
            schoolCode: school.code,
            schoolName: school.name,
            razorpayPaymentId: input.razorpayPaymentId || null,
            razorpayOrderId: input.razorpayOrderId || null,
          },
          ipAddress,
          userAgent,
        },
      });

      return { school, adminUser };
    });

    // 6. Issue Authentication Tokens for immediate login
    const tokenPayload = {
      userId: result.adminUser.id,
      email: result.adminUser.email,
      role: result.adminUser.role,
      schoolId: result.school.id,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.refreshToken.create({
      data: {
        userId: result.adminUser.id,
        tokenHash,
        expiresAt,
      },
    });

    return {
      school: result.school,
      user: {
        id: result.adminUser.id,
        email: result.adminUser.email,
        name: result.adminUser.name,
        role: result.adminUser.role,
        school: {
          id: result.school.id,
          name: result.school.name,
          code: result.school.code,
          status: result.school.status,
        },
      },
      accessToken,
      refreshToken,
    };
  }
}
