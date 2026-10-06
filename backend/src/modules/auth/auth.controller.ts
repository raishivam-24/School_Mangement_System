/**
 * @file auth.controller.ts
 * @description Authentication controller for handling HTTP requests, cookie assignment, and responses.
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
import { setAuthCookies, clearAuthCookies } from '../../utils/jwt.js';

export class AuthController {
  /**
   * Login user & set HttpOnly cookies
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('User-Agent');

      const result = await AuthService.login(req.body, ip, userAgent);

      // Set HttpOnly Cookies
      setAuthCookies(res, result.accessToken, result.refreshToken);

      return ApiResponse.success(res, {
        user: result.user,
        accessToken: result.accessToken, // Also return in body for mobile apps / Postman tests
      }, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Self-Service Register School from landing page
   */
  static async registerSchool(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('User-Agent');

      const result = await AuthService.registerSchool(req.body, ip, userAgent);

      setAuthCookies(res, result.accessToken, result.refreshToken);

      return ApiResponse.created(
        res,
        {
          school: result.school,
          user: result.user,
          accessToken: result.accessToken,
        },
        'School registered successfully. Welcome to your platform!'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh JWT tokens via cookie or request body
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!rawToken) {
        return res.status(401).json({
          success: false,
          error: { code: 'REFRESH_TOKEN_REQUIRED', message: 'Refresh token not found' },
        });
      }

      const tokens = await AuthService.refreshTokens(rawToken);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

      return ApiResponse.success(res, {
        accessToken: tokens.accessToken,
      }, 'Token refreshed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout user and clear cookies
   */
  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
      await AuthService.logout(rawToken);
      clearAuthCookies(res);

      return ApiResponse.success(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current authenticated user profile
   */
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getCurrentUser(req.user!.userId);
      return ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update password
   */
  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.changePassword(req.user!.userId, req.body);
      clearAuthCookies(res);
      return ApiResponse.success(res, result, 'Password changed successfully. Please login again.');
    } catch (error) {
      next(error);
    }
  }
}
