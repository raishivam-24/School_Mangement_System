
/**
 * @file seed.ts
 * @description Database seeder for the platform admin, demo school,
 * academic structure, teachers, students, parents, enrollments and samples.
 */

import {
  UserRole,
  SchoolStatus,
  SubscriptionPlan,
  Gender,
  AttendanceStatus,
  ExamStatus,
  InvoiceStatus,
  PaymentMethod,
} from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/db/prisma.js';

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Seed Platform Super Admin
  const superAdminPasswordHash = await bcrypt.hash(
    'SuperAdmin@Secure123!',
    12,
  );

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@platform.com' },
    update: {},
    create: {
      email: 'superadmin@platform.com',
      passwordHash: superAdminPasswordHash,
      name: 'Platform Super Admin',
      role: UserRole.SUPER_ADMIN,
    },
  });

  console.log(`✅ Seeded Super Admin: ${superAdmin.email}`);

  // 2. Seed Demo School Tenant
  const school = await prisma.school.upsert({
    where: { code: 'DPA-DELHI' },
    update: {},
    create: {
      name: 'Delhi Public Academy',
      code: 'DPA-DELHI',
      email: 'info@dpa.edu',
      phone: '+91 98765 43210',
      address: 'Sector 14, Rohini, New Delhi',
      website: 'https://dpa.edu',
      status: SchoolStatus.ACTIVE,
      maxStudents: 2000,
    },
  });

  console.log(
    `✅ Seeded Demo School: ${school.name} (Code: ${school.code})`,
  );

  // 3. Seed School Subscription
  const existingSub = await prisma.schoolSubscription.findFirst({
    where: { schoolId: school.id },
  });

  if (!existingSub) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 365);

    await prisma.schoolSubscription.create({
      data: {
        schoolId: school.id,
        plan: SubscriptionPlan.PRO,
        status: 'ACTIVE',
        amount: 99.0,
        billingCycle: 'ANNUALLY',
        startDate: new Date(),
        endDate,
        nextBillingDate: endDate,
      },
    });
  }

  // 4. Seed School Admin User
  const schoolAdminPasswordHash = await bcrypt.hash(
    'Admin@Secure123!',
    12,
  );

  const schoolAdmin = await prisma.user.upsert({
    where: { email: 'admin@dpa.edu' },
    update: {},
    create: {
      schoolId: school.id,
      email: 'admin@dpa.edu',
      passwordHash: schoolAdminPasswordHash,
      name: 'Rajesh Malhotra',
      role: UserRole.SCHOOL_ADMIN,
    },
  });

  console.log(`✅ Seeded School Admin: ${schoolAdmin.email}`);

  // 5. Seed Academic Year
  const academicYear = await prisma.academicYear.upsert({
    where: {
      schoolId_name: {
        schoolId: school.id,
        name: '2026-2027',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      name: '2026-2027',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2027-03-31'),
      isCurrent: true,
    },
  });

  // 6. Seed Classes & Sections
  const class10 = await prisma.class.upsert({
    where: {
      schoolId_name: {
        schoolId: school.id,
        name: 'Class 10',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      name: 'Class 10',
      numericOrder: 10,
    },
  });

  const sectionA = await prisma.section.upsert({
    where: {
      classId_name: {
        classId: class10.id,
        name: 'A',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      classId: class10.id,
      name: 'A',
      roomNumber: 'Room 101',
    },
  });

  const sectionB = await prisma.section.upsert({
    where: {
      classId_name: {
        classId: class10.id,
        name: 'B',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      classId: class10.id,
      name: 'B',
      roomNumber: 'Room 102',
    },
  });

  // 7. Seed Subjects
  const mathSubject = await prisma.subject.upsert({
    where: {
      schoolId_code: {
        schoolId: school.id,
        code: 'MATH101',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      name: 'Mathematics',
      code: 'MATH101',
      type: 'CORE',
    },
  });

  const scienceSubject = await prisma.subject.upsert({
    where: {
      schoolId_code: {
        schoolId: school.id,
        code: 'SCI101',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      name: 'Science',
      code: 'SCI101',
      type: 'CORE',
    },
  });

  // 8. Seed Teacher
  const teacherPasswordHash = await bcrypt.hash(
    'Teacher@Secure123!',
    12,
  );

  const teacherUser = await prisma.user.upsert({
    where: { email: 'amit.sharma@dpa.edu' },
    update: {},
    create: {
      schoolId: school.id,
      email: 'amit.sharma@dpa.edu',
      passwordHash: teacherPasswordHash,
      name: 'Amit Sharma',
      role: UserRole.TEACHER,
    },
  });

  const teacher = await prisma.teacher.upsert({
    where: {
      schoolId_employeeId: {
        schoolId: school.id,
        employeeId: 'TCH-001',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      userId: teacherUser.id,
      employeeId: 'TCH-001',
      designation: 'Senior Mathematics Teacher',
      qualification: 'M.Sc. Mathematics, B.Ed.',
      gender: Gender.MALE,
      phone: '+91 98111 22334',
    },
  });

  // Assign Teacher to Mathematics for Class 10
  await prisma.classSubject.upsert({
    where: {
      classId_subjectId: {
        classId: class10.id,
        subjectId: mathSubject.id,
      },
    },
    update: { teacherId: teacher.id },
    create: {
      schoolId: school.id,
      classId: class10.id,
      subjectId: mathSubject.id,
      teacherId: teacher.id,
    },
  });

  // 9. Seed Student
  const studentPasswordHash = await bcrypt.hash(
    'Student@Secure123!',
    12,
  );

  const studentUser = await prisma.user.upsert({
    where: { email: 'rahul.sharma@dpa.edu' },
    update: {},
    create: {
      schoolId: school.id,
      email: 'rahul.sharma@dpa.edu',
      passwordHash: studentPasswordHash,
      name: 'Rahul Sharma',
      role: UserRole.STUDENT,
    },
  });

  const student = await prisma.student.upsert({
    where: {
      schoolId_admissionNo: {
        schoolId: school.id,
        admissionNo: 'ADM-2026-001',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      userId: studentUser.id,
      admissionNo: 'ADM-2026-001',
      firstName: 'Rahul',
      lastName: 'Sharma',
      dateOfBirth: new Date('2010-05-15'),
      gender: Gender.MALE,
      bloodGroup: 'B+',
      emergencyContact: '+91 99999 88888',
      address: 'Flat 402, Sunshine Heights, New Delhi',
    },
  });

  await prisma.enrollment.upsert({
    where: {
      studentId_academicYearId: {
        studentId: student.id,
        academicYearId: academicYear.id,
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      studentId: student.id,
      academicYearId: academicYear.id,
      classId: class10.id,
      sectionId: sectionA.id,
      rollNumber: '1001',
      status: 'ACTIVE',
    },
  });

  console.log(
    `✅ Seeded Demo Student: ${student.firstName} ${student.lastName} in ${class10.name}-${sectionA.name}`,
  );

  // 9.1 Seed Parent User and Profile
  const parentPasswordHash = await bcrypt.hash('Parent@123', 12);

  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@school.com' },
    update: {
      schoolId: school.id,
      passwordHash: parentPasswordHash,
      name: 'Rahul Sharma Parent',
      role: UserRole.PARENT,
    },
    create: {
      schoolId: school.id,
      email: 'parent@school.com',
      passwordHash: parentPasswordHash,
      name: 'Rahul Sharma Parent',
      role: UserRole.PARENT,
    },
  });

  const parent = await prisma.parent.upsert({
    where: { userId: parentUser.id },
    update: {
      schoolId: school.id,
      relationship: 'FATHER',
      phone: '+91 99999 88888',
      address: 'Flat 402, Sunshine Heights, New Delhi',
    },
    create: {
      schoolId: school.id,
      userId: parentUser.id,
      relationship: 'FATHER',
      phone: '+91 99999 88888',
      address: 'Flat 402, Sunshine Heights, New Delhi',
    },
  });

  await prisma.student.update({
    where: { id: student.id },
    data: { parentId: parent.id },
  });

  console.log(`✅ Seeded Demo Parent: ${parentUser.email}`);

  // 10. Seed Sample Attendance
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.upsert({
    where: {
      sectionId_date: {
        sectionId: sectionA.id,
        date: today,
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      academicYearId: academicYear.id,
      classId: class10.id,
      sectionId: sectionA.id,
      date: today,
      takenById: teacherUser.id,
      remarks: 'Morning assembly on time',
    },
  });

  await prisma.attendanceRecord.upsert({
    where: {
      attendanceId_studentId: {
        attendanceId: attendance.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      attendanceId: attendance.id,
      studentId: student.id,
      status: AttendanceStatus.PRESENT,
    },
  });

  // 11. Seed Fee Structure, Invoice & Payment
  const feeStructure = await prisma.feeStructure.create({
    data: {
      schoolId: school.id,
      academicYearId: academicYear.id,
      classId: class10.id,
      name: 'Term 1 Tuition & Lab Fee 2026',
      totalAmount: 25000.0,
      frequency: 'QUARTERLY',
      items: {
        create: [
          { name: 'Tuition Fee', amount: 18000.0 },
          { name: 'Computer & Science Lab', amount: 5000.0 },
          { name: 'Sports & Activities', amount: 2000.0 },
        ],
      },
    },
  });

  const invoice = await prisma.feeInvoice.upsert({
    where: { invoiceNumber: 'INV-2026-00001' },
    update: {},
    create: {
      schoolId: school.id,
      academicYearId: academicYear.id,
      studentId: student.id,
      feeStructureId: feeStructure.id,
      invoiceNumber: 'INV-2026-00001',
      totalAmount: 25000.0,
      paidAmount: 15000.0,
      balanceAmount: 10000.0,
      dueDate: new Date('2026-10-15'),
      status: InvoiceStatus.PARTIAL,
    },
  });

  await prisma.feePayment.upsert({
    where: { receiptNumber: 'REC-2026-00001' },
    update: {},
    create: {
      schoolId: school.id,
      feeInvoiceId: invoice.id,
      studentId: student.id,
      receiptNumber: 'REC-2026-00001',
      amount: 15000.0,
      paymentMethod: PaymentMethod.UPI,
      transactionRef: 'UPI/20260928/83728372',
      remarks: 'Part payment received via UPI',
    },
  });

  // 12. Seed Announcement
  const existingAnnouncement = await prisma.announcement.findFirst({
    where: {
      schoolId: school.id,
      title: 'Welcome to Academic Year 2026-2027',
    },
  });

  if (!existingAnnouncement) {
    await prisma.announcement.create({
      data: {
        schoolId: school.id,
        authorId: schoolAdmin.id,
        title: 'Welcome to Academic Year 2026-2027',
        content:
          'We welcome all students and staff back to school for an exciting new term!',
        priority: 'HIGH',
        isPublished: true,
      },
    });
  }

  // 13. Seed Core Academic Subjects
  const englishSubject = await prisma.subject.upsert({
    where: {
      schoolId_code: {
        schoolId: school.id,
        code: 'ENG101',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      name: 'English Language & Literature',
      code: 'ENG101',
      type: 'CORE',
    },
  });

  const sstSubject = await prisma.subject.upsert({
    where: {
      schoolId_code: {
        schoolId: school.id,
        code: 'SST101',
      },
    },
    update: {},
    create: {
      schoolId: school.id,
      name: 'Social Science',
      code: 'SST101',
      type: 'CORE',
    },
  });

  // 14. Seed Examinations
  const midTermExam = await prisma.exam.upsert({
    where: { id: 'exam-midterm-2026' },
    update: {},
    create: {
      id: 'exam-midterm-2026',
      schoolId: school.id,
      academicYearId: academicYear.id,
      name: 'Mid-Term Examination 2026',
      term: 'Term 1',
      startDate: new Date('2026-10-15'),
      endDate: new Date('2026-10-25'),
      status: ExamStatus.ONGOING,
    },
  });

  await prisma.exam.upsert({
    where: { id: 'exam-pa1-2026' },
    update: {},
    create: {
      id: 'exam-pa1-2026',
      schoolId: school.id,
      academicYearId: academicYear.id,
      name: 'Periodic Assessment 1 (PA-1)',
      term: 'Quarter 1',
      startDate: new Date('2026-08-10'),
      endDate: new Date('2026-08-18'),
      status: ExamStatus.COMPLETED,
    },
  });

  // Exam Subjects Schedule for Class 10
  const subMath = await prisma.examSubject.upsert({
    where: {
      examId_classId_subjectId: {
        examId: midTermExam.id,
        classId: class10.id,
        subjectId: mathSubject.id,
      },
    },
    update: {},
    create: {
      examId: midTermExam.id,
      classId: class10.id,
      subjectId: mathSubject.id,
      examDate: new Date('2026-10-15T09:00:00Z'),
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      maxMarks: 100.0,
      passMarks: 33.0,
      roomNumber: 'Hall 101',
    },
  });

  const subSci = await prisma.examSubject.upsert({
    where: {
      examId_classId_subjectId: {
        examId: midTermExam.id,
        classId: class10.id,
        subjectId: scienceSubject.id,
      },
    },
    update: {},
    create: {
      examId: midTermExam.id,
      classId: class10.id,
      subjectId: scienceSubject.id,
      examDate: new Date('2026-10-17T09:00:00Z'),
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      maxMarks: 100.0,
      passMarks: 33.0,
      roomNumber: 'Science Lab 2',
    },
  });

  const subEng = await prisma.examSubject.upsert({
    where: {
      examId_classId_subjectId: {
        examId: midTermExam.id,
        classId: class10.id,
        subjectId: englishSubject.id,
      },
    },
    update: {},
    create: {
      examId: midTermExam.id,
      classId: class10.id,
      subjectId: englishSubject.id,
      examDate: new Date('2026-10-20T09:00:00Z'),
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      maxMarks: 100.0,
      passMarks: 33.0,
      roomNumber: 'Hall 102',
    },
  });

  const subSst = await prisma.examSubject.upsert({
    where: {
      examId_classId_subjectId: {
        examId: midTermExam.id,
        classId: class10.id,
        subjectId: sstSubject.id,
      },
    },
    update: {},
    create: {
      examId: midTermExam.id,
      classId: class10.id,
      subjectId: sstSubject.id,
      examDate: new Date('2026-10-22T09:00:00Z'),
      startTime: '09:00 AM',
      endTime: '12:00 PM',
      maxMarks: 100.0,
      passMarks: 33.0,
      roomNumber: 'Room 103',
    },
  });

  // Seed Exam Results for Rahul Sharma
  await prisma.examResult.upsert({
    where: {
      examSubjectId_studentId: {
        examSubjectId: subMath.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      examSubjectId: subMath.id,
      studentId: student.id,
      marksObtained: 88.0,
      grade: 'A2',
      remarks: 'Strong conceptual clarity in Geometry and Algebra.',
    },
  });

  await prisma.examResult.upsert({
    where: {
      examSubjectId_studentId: {
        examSubjectId: subSci.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      examSubjectId: subSci.id,
      studentId: student.id,
      marksObtained: 93.0,
      grade: 'A1',
      remarks:
        'Outstanding experimental application and physics problem solving.',
    },
  });

  await prisma.examResult.upsert({
    where: {
      examSubjectId_studentId: {
        examSubjectId: subEng.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      examSubjectId: subEng.id,
      studentId: student.id,
      marksObtained: 85.0,
      grade: 'A2',
      remarks: 'Expressive prose and excellent comprehension skills.',
    },
  });

  await prisma.examResult.upsert({
    where: {
      examSubjectId_studentId: {
        examSubjectId: subSst.id,
        studentId: student.id,
      },
    },
    update: {},
    create: {
      examSubjectId: subSst.id,
      studentId: student.id,
      marksObtained: 79.0,
      grade: 'B1',
      remarks: 'Good grasp of Indian History & Contemporary World.',
    },
  });

  console.log('\n🎉 Database Seeding Completed Successfully!\n');
  console.log('====================================================');
  console.log('🔑 TEST LOGIN CREDENTIALS:');
  console.log(
    '👑 Super Admin: superadmin@platform.com | SuperAdmin@Secure123!',
  );
  console.log('🏫 School Admin: admin@dpa.edu | Admin@Secure123!');
  console.log('👨‍🏫 Teacher: amit.sharma@dpa.edu | Teacher@Secure123!');
  console.log(
    '🎓 Student: rahul.sharma@dpa.edu | Student@Secure123!',
  );
  console.log('👨‍👩‍👦 Parent: parent@school.com | Parent@123');
  console.log('====================================================\n');
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
