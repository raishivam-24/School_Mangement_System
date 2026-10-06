/**
 * @file announcements.service.ts
 * @description Announcements service for broadcasting messages across school roles.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import { CreateAnnouncementInput, UpdateAnnouncementInput } from './announcements.schema.js';
import { AudienceType, Prisma, UserRole } from '@prisma/client';

export class AnnouncementsService {
  /**
   * Create and publish announcement
   */
  static async createAnnouncement(
    schoolId: string,
    authorUserId: string,
    input: CreateAnnouncementInput
  ) {
    return prisma.announcement.create({
      data: {
        schoolId,
        authorId: authorUserId,
        title: input.title,
        content: input.content,
        targetAudience: input.targetAudience,
        targetClassId: input.targetClassId || null,
        priority: input.priority,
        isPublished: true,
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });
  }

  /**
   * List announcements tailored for the viewing user role
   */
  static async listAnnouncements(schoolId: string, userRole: UserRole) {
    const where: Prisma.AnnouncementWhereInput = {
      schoolId,
      isPublished: true,
    };

    if (userRole !== UserRole.SCHOOL_ADMIN && userRole !== UserRole.SUPER_ADMIN) {
      const allowedAudiences: AudienceType[] = [AudienceType.ALL];
      if (userRole === UserRole.TEACHER) allowedAudiences.push(AudienceType.TEACHERS);
      if (userRole === UserRole.STUDENT) allowedAudiences.push(AudienceType.STUDENTS);
      if (userRole === UserRole.PARENT) allowedAudiences.push(AudienceType.PARENTS);

      where.targetAudience = { in: allowedAudiences };
    }

    return prisma.announcement.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });
  }

  /**
   * Update or unpublish announcement
   */
  static async updateAnnouncement(
    schoolId: string,
    id: string,
    input: UpdateAnnouncementInput
  ) {
    const announcement = await prisma.announcement.findFirst({ where: { id, schoolId } });
    if (!announcement) throw AppError.notFound('Announcement not found');

    return prisma.announcement.update({
      where: { id },
      data: input,
    });
  }

  /**
   * Delete announcement
   */
  static async deleteAnnouncement(schoolId: string, id: string) {
    const announcement = await prisma.announcement.findFirst({ where: { id, schoolId } });
    if (!announcement) throw AppError.notFound('Announcement not found');

    await prisma.announcement.delete({ where: { id } });
    return { success: true };
  }
}
