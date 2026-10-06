/**
 * @file seed.ts
 * @description Database Seeder for initializing Platform Super Admin, Demo School Tenant,
 * Academic structure, Teachers, Students, Enrollments, and Financial samples.
 */

import { UserRole, SchoolStatus, SubscriptionPlan, Gender, AttendanceStatus, ExamStatus, InvoiceStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/db/prisma.js';

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Seed Platform Super Admin
  const superAdminPasswordHash = await bcrypt.hash('SuperAdmin@Secure123!', 12);
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
  console.log(`✅ Seeded Demo School: ${school.name} (Code: ${school.code})`);

  // 3. Seed School Subscription
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

  // 4. Seed School Admin User
  const schoolAdminPasswordHash = await bcrypt.hash('Admin@Secure123!', 12);
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
    where: { schoolId_name: { schoolId: school.id, name: 'Class 10' } },
    update: {},
    create: {
      schoolId: school.id,
      name: 'Class 10',
      numericOrder: 10,
    },
  });

  const sectionA = await prisma.section.upsert({
    where: { classId_name: { classId: class10.id, name: 'A' } },
    update: {},
    create: {
      schoolId: school.id,
      classId: class10.id,
      name: 'A',
      roomNumber: 'Room 101',
    },
  });

  const sectionB = await prisma.section.upsert({
    where: { classId_name: { classId: class10.id, name: 'B' } },
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
    where: { schoolId_code: { schoolId: school.id, code: 'MATH101' } },
    update: {},
    create: {
      schoolId: school.id,
      name: 'Mathematics',
      code: 'MATH101',
      type: 'CORE',
    },
  });

  const scienceSubject = await prisma.subject.upsert({
    where: { schoolId_code: { schoolId: school.id, code: 'SCI101' } },
    update: {},
    create: {
      schoolId: school.id,
      name: 'Science',
      code: 'SCI101',
      type: 'CORE',
    },
  });

  // 8. Seed Teacher
  const teacherPasswordHash = await bcrypt.hash('Teacher@Secure123!', 12);
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
    where: { schoolId_employeeId: { schoolId: school.id, employeeId: 'TCH-001' } },
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

  // Assign Teacher to Math for Class 10
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

  // 9. Seed Student & Enrollment
  const studentPasswordHash = await bcrypt.hash('Student@Secure123!', 12);
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
    where: { schoolId_admissionNo: { schoolId: school.id, admissionNo: 'ADM-2026-001' } },
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
  console.log(`✅ Seeded Demo Student: ${student.firstName} ${student.lastName} in ${class10.name}-${sectionA.name}`);

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

  const invoice = await prisma.feeInvoice.create({
    data: {
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

  await prisma.feePayment.create({
    data: {
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
  await prisma.announcement.create({
    data: {
      schoolId: school.id,
      authorId: schoolAdmin.id,
      title: 'Welcome to Academic Year 2026-2027',
      content: 'We welcome all students and staff back to school for an exciting new term!',
      priority: 'HIGH',
      isPublished: true,
    },
  });

  console.log('\n🎉 Database Seeding Completed Successfully!\n');
  console.log('====================================================');
  console.log('🔑 TEST LOGIN CREDENTIALS:');
  console.log('👑 Super Admin: superadmin@platform.com  | SuperAdmin@Secure123!');
  console.log('🏫 School Admin: admin@dpa.edu          | Admin@Secure123!');
  console.log('👨‍🏫 Teacher:     amit.sharma@dpa.edu    | Teacher@Secure123!');
  console.log('🎓 Student:     rahul.sharma@dpa.edu   | Student@Secure123!');
  console.log('====================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
