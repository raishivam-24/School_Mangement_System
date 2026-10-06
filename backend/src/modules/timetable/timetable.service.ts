/**
 * @file timetable.service.ts
 * @description Timetable schedule service for classes, sections, and teachers.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import { CreateTimetableEntryInput } from './timetable.schema.js';
import { Prisma } from '@prisma/client';

export class TimetableService {
  /**
   * Create a new timetable entry
   */
  static async createEntry(schoolId: string, input: CreateTimetableEntryInput) {
    return prisma.timetable.create({
      data: {
        schoolId,
        academicYearId: input.academicYearId,
        classId: input.classId,
        sectionId: input.sectionId,
        subjectId: input.subjectId,
        teacherId: input.teacherId || null,
        dayOfWeek: input.dayOfWeek,
        periodNumber: input.periodNumber,
        startTime: input.startTime,
        endTime: input.endTime,
        roomNumber: input.roomNumber || null,
      },
      include: {
        subject: { select: { name: true, code: true } },
        teacher: { include: { user: { select: { name: true } } } },
        class: { select: { name: true } },
        section: { select: { name: true } },
      },
    });
  }

  /**
   * Get weekly timetable grouped by day of week
   */
  static async getTimetable(
    schoolId: string,
    filters: {
      classId?: string;
      sectionId?: string;
      teacherId?: string;
      academicYearId?: string;
    }
  ) {
    const where: Prisma.TimetableWhereInput = { schoolId };

    if (filters.classId) where.classId = filters.classId;
    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.teacherId) where.teacherId = filters.teacherId;
    if (filters.academicYearId) where.academicYearId = filters.academicYearId;

    const entries = await prisma.timetable.findMany({
      where,
      orderBy: [{ dayOfWeek: 'asc' }, { periodNumber: 'asc' }],
      include: {
        subject: { select: { id: true, name: true, code: true } },
        teacher: { include: { user: { select: { id: true, name: true } } } },
        class: { select: { id: true, name: true } },
        section: { select: { id: true, name: true } },
      },
    });

    // Group by Day of Week
    const schedule: Record<string, typeof entries> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
    };

    entries.forEach((entry) => {
      if (schedule[entry.dayOfWeek]) {
        schedule[entry.dayOfWeek].push(entry);
      }
    });

    return schedule;
  }

  /**
   * Delete a timetable entry
   */
  static async deleteEntry(schoolId: string, id: string) {
    const entry = await prisma.timetable.findFirst({ where: { id, schoolId } });
    if (!entry) throw AppError.notFound('Timetable entry not found');

    await prisma.timetable.delete({ where: { id } });
    return { success: true };
  }
}
