/**
 * @file assignments.service.ts
 * @description Homework and Assignment domain service for creating tasks, collecting student submissions, and grading.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import {
  CreateAssignmentInput,
  SubmitAssignmentInput,
  GradeSubmissionInput,
} from './assignments.schema.js';
import { Prisma } from '@prisma/client';

export class AssignmentsService {
  /**
   * Create assignment by a teacher
   */
  static async createAssignment(
    schoolId: string,
    teacherUserId: string,
    input: CreateAssignmentInput
  ) {
    let teacher = await prisma.teacher.findUnique({
      where: { userId: teacherUserId },
    });
    if (!teacher || teacher.schoolId !== schoolId) {
      teacher = await prisma.teacher.findFirst({
        where: { schoolId },
      });
      if (!teacher) {
        throw AppError.forbidden('No faculty teacher records available to bind assignment');
      }
    }

    let academicYearId = input.academicYearId;
    if (!academicYearId) {
      const activeYear =
        (await prisma.academicYear.findFirst({
          where: { schoolId, isCurrent: true },
        })) ||
        (await prisma.academicYear.findFirst({
          where: { schoolId },
        }));
      if (!activeYear) {
        throw AppError.badRequest('No academic year configured for this school');
      }
      academicYearId = activeYear.id;
    }

    let sectionId = input.sectionId;
    if (!sectionId) {
      const firstSection = await prisma.section.findFirst({
        where: { classId: input.classId },
      });
      if (!firstSection) {
        throw AppError.badRequest('The selected class has no sections configured');
      }
      sectionId = firstSection.id;
    }

    return prisma.assignment.create({
      data: {
        schoolId,
        teacherId: teacher.id,
        academicYearId,
        classId: input.classId,
        sectionId,
        subjectId: input.subjectId,
        title: input.title,
        description: input.description,
        dueDate: new Date(input.dueDate),
        maxMarks: input.maxMarks,
        attachmentUrl: input.attachmentUrl || null,
        status: 'PUBLISHED',
      },
      include: {
        class: { select: { name: true } },
        section: { select: { name: true } },
        subject: { select: { name: true } },
      },
    });
  }

  /**
   * List assignments with filtering
   */
  static async listAssignments(
    schoolId: string,
    filters: { classId?: string; sectionId?: string; subjectId?: string }
  ) {
    const where: Prisma.AssignmentWhereInput = { schoolId };

    if (filters.classId) where.classId = filters.classId;
    if (filters.sectionId) where.sectionId = filters.sectionId;
    if (filters.subjectId) where.subjectId = filters.subjectId;

    return prisma.assignment.findMany({
      where,
      orderBy: { dueDate: 'desc' },
      include: {
        class: { select: { id: true, name: true } },
        section: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true, code: true } },
        teacher: { include: { user: { select: { name: true } } } },
        _count: { select: { submissions: true } },
      },
    });
  }

  /**
   * Get assignment detail with submission list
   */
  static async getAssignmentById(schoolId: string, assignmentId: string) {
    const assignment = await prisma.assignment.findFirst({
      where: { id: assignmentId, schoolId },
      include: {
        class: true,
        section: true,
        subject: true,
        teacher: { include: { user: { select: { name: true, email: true } } } },
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                admissionNo: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { submittedAt: 'desc' },
        },
      },
    });

    if (!assignment) throw AppError.notFound('Assignment not found');
    return assignment;
  }

  /**
   * Submit homework as a student
   */
  static async submitAssignment(
    schoolId: string,
    studentUserId: string,
    assignmentId: string,
    input: SubmitAssignmentInput
  ) {
    const student = await prisma.student.findUnique({
      where: { userId: studentUserId },
    });
    if (!student || student.schoolId !== schoolId) {
      throw AppError.forbidden('Only students can submit assignments');
    }

    const assignment = await prisma.assignment.findFirst({
      where: { id: assignmentId, schoolId },
    });
    if (!assignment) throw AppError.notFound('Assignment not found');

    const isLate = new Date() > assignment.dueDate;

    return prisma.assignmentSubmission.upsert({
      where: {
        assignmentId_studentId: {
          assignmentId,
          studentId: student.id,
        },
      },
      create: {
        assignmentId,
        studentId: student.id,
        content: input.content || null,
        attachmentUrl: input.attachmentUrl || null,
        status: isLate ? 'LATE' : 'SUBMITTED',
      },
      update: {
        content: input.content || null,
        attachmentUrl: input.attachmentUrl || null,
        submittedAt: new Date(),
        status: isLate ? 'LATE' : 'SUBMITTED',
      },
    });
  }

  /**
   * Grade a student submission
   */
  static async gradeSubmission(
    schoolId: string,
    submissionId: string,
    input: GradeSubmissionInput,
    gradedByUserId: string
  ) {
    const submission = await prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: { assignment: true },
    });

    if (!submission || submission.assignment.schoolId !== schoolId) {
      throw AppError.notFound('Submission not found');
    }

    const maxMarks = Number(submission.assignment.maxMarks);
    if (input.marksObtained > maxMarks) {
      throw AppError.badRequest(
        `Marks obtained (${input.marksObtained}) cannot exceed max marks (${maxMarks})`
      );
    }

    return prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        marksObtained: input.marksObtained,
        feedback: input.feedback || null,
        gradedAt: new Date(),
        status: 'GRADED',
      },
    });
  }
}
