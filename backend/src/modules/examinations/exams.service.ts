/**
 * @file exams.service.ts
 * @description Examination and Results domain service.
 * Handles exam scheduling, batch marks entry, grade calculations, and student report card generation.
 */

import { prisma } from '../../db/prisma.js';
import { AppError } from '../../utils/apiError.js';
import {
  CreateExamInput,
  AddExamSubjectInput,
  SubmitExamMarksInput,
} from './exams.schema.js';
import { ExamStatus } from '@prisma/client';

export class ExamsService {
  /**
   * Helper to compute Grade letter from percentage score
   */
  private static calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  /**
   * Create new Examination term
   */
  static async createExam(schoolId: string, input: CreateExamInput) {
    return prisma.exam.create({
      data: {
        schoolId,
        academicYearId: input.academicYearId,
        name: input.name,
        term: input.term,
        startDate: new Date(input.startDate),
        endDate: new Date(input.endDate),
        status: ExamStatus.UPCOMING,
      },
      include: {
        academicYear: { select: { name: true } },
      },
    });
  }

  /**
   * List all exams in the school
   */
  static async listExams(schoolId: string, academicYearId?: string) {
    return prisma.exam.findMany({
      where: {
        schoolId,
        ...(academicYearId && { academicYearId }),
      },
      include: {
        academicYear: { select: { id: true, name: true } },
        _count: { select: { subjects: true } },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  /**
   * Add a subject schedule under an exam
   */
  static async addExamSubject(
    schoolId: string,
    examId: string,
    input: AddExamSubjectInput
  ) {
    const exam = await prisma.exam.findFirst({ where: { id: examId, schoolId } });
    if (!exam) throw AppError.notFound('Exam not found');

    const existing = await prisma.examSubject.findUnique({
      where: {
        examId_classId_subjectId: {
          examId,
          classId: input.classId,
          subjectId: input.subjectId,
        },
      },
    });
    if (existing) {
      throw AppError.conflict('This subject is already scheduled for this class in this exam');
    }

    return prisma.examSubject.create({
      data: {
        examId,
        classId: input.classId,
        subjectId: input.subjectId,
        examDate: new Date(input.examDate),
        startTime: input.startTime,
        endTime: input.endTime,
        maxMarks: input.maxMarks,
        passMarks: input.passMarks,
        roomNumber: input.roomNumber,
      },
      include: {
        class: { select: { name: true } },
        subject: { select: { name: true, code: true } },
      },
    });
  }

  /**
   * Get complete exam details with all scheduled subjects
   */
  static async getExamDetails(schoolId: string, examId: string) {
    const exam = await prisma.exam.findFirst({
      where: { id: examId, schoolId },
      include: {
        academicYear: true,
        subjects: {
          include: {
            class: true,
            subject: true,
            _count: { select: { results: true } },
          },
          orderBy: { examDate: 'asc' },
        },
      },
    });

    if (!exam) throw AppError.notFound('Exam not found');
    return exam;
  }

  /**
   * Submit or update batch marks for students in an exam subject
   */
  static async submitMarks(
    schoolId: string,
    input: SubmitExamMarksInput,
    actorUserId: string
  ) {
    const examSubject = await prisma.examSubject.findUnique({
      where: { id: input.examSubjectId },
      include: { exam: true },
    });

    if (!examSubject || examSubject.exam.schoolId !== schoolId) {
      throw AppError.notFound('Exam subject not found');
    }

    const maxMarks = Number(examSubject.maxMarks);

    return prisma.$transaction(async (tx) => {
      for (const entry of input.marks) {
        if (entry.marksObtained > maxMarks) {
          throw AppError.badRequest(
            `Marks obtained (${entry.marksObtained}) cannot exceed max marks (${maxMarks})`
          );
        }

        const percentage = (entry.marksObtained / maxMarks) * 100;
        const grade = ExamsService.calculateGrade(percentage);

        await tx.examResult.upsert({
          where: {
            examSubjectId_studentId: {
              examSubjectId: input.examSubjectId,
              studentId: entry.studentId,
            },
          },
          create: {
            examSubjectId: input.examSubjectId,
            studentId: entry.studentId,
            marksObtained: entry.marksObtained,
            grade,
            remarks: entry.remarks || null,
          },
          update: {
            marksObtained: entry.marksObtained,
            grade,
            remarks: entry.remarks || null,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          schoolId,
          userId: actorUserId,
          action: 'EXAM_MARKS_SUBMITTED',
          entity: 'ExamSubject',
          entityId: input.examSubjectId,
          details: { studentCount: input.marks.length },
        },
      });

      return { success: true, count: input.marks.length };
    });
  }

  /**
   * Generate comprehensive Student Report Card for an Exam
   */
  static async getStudentReportCard(schoolId: string, examId: string, studentId: string) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, schoolId },
      include: {
        enrollments: {
          where: { status: 'ACTIVE' },
          include: { class: true, section: true },
        },
      },
    });

    if (!student) throw AppError.notFound('Student not found');

    const exam = await prisma.exam.findFirst({
      where: { id: examId, schoolId },
      include: { academicYear: true },
    });

    if (!exam) throw AppError.notFound('Exam not found');

    // Fetch all results for this student in this exam
    const results = await prisma.examResult.findMany({
      where: {
        studentId,
        examSubject: { examId },
      },
      include: {
        examSubject: {
          include: { subject: true },
        },
      },
    });

    let totalMaxMarks = 0;
    let totalMarksObtained = 0;
    let hasFailed = false;

    const subjectBreakdown = results.map((r) => {
      const maxMarks = Number(r.examSubject.maxMarks);
      const passMarks = Number(r.examSubject.passMarks);
      const obtained = Number(r.marksObtained);

      totalMaxMarks += maxMarks;
      totalMarksObtained += obtained;
      if (obtained < passMarks) hasFailed = true;

      return {
        subjectName: r.examSubject.subject.name,
        subjectCode: r.examSubject.subject.code,
        maxMarks,
        passMarks,
        marksObtained: obtained,
        grade: r.grade,
        isPassed: obtained >= passMarks,
        remarks: r.remarks,
      };
    });

    const percentage =
      totalMaxMarks > 0 ? Math.round((totalMarksObtained / totalMaxMarks) * 100 * 10) / 10 : 0;
    const overallGrade = ExamsService.calculateGrade(percentage);

    return {
      exam: {
        id: exam.id,
        name: exam.name,
        term: exam.term,
        academicYear: exam.academicYear.name,
      },
      student: {
        id: student.id,
        admissionNo: student.admissionNo,
        fullName: `${student.firstName} ${student.lastName}`,
        class: student.enrollments[0]?.class?.name || '-',
        section: student.enrollments[0]?.section?.name || '-',
      },
      subjects: subjectBreakdown,
      summary: {
        totalMaxMarks,
        totalMarksObtained,
        percentage,
        overallGrade,
        resultStatus: hasFailed ? 'FAIL' : 'PASS',
      },
    };
  }
}
