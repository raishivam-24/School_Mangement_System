/**
 * @file subscriptions.routes.ts
 * @description Public and Admin subscription plans and pricing routes for the Landing Page.
 */

import { Router, Request, Response } from 'express';
import { ApiResponse } from '../../utils/apiResponse.js';

const router = Router();

export const SUBSCRIPTION_PLANS = [
  {
    id: 'BASIC',
    name: 'Basic School Starter',
    description: 'Perfect for small schools and pre-schools getting started.',
    monthlyPrice: 29,
    annualPrice: 299,
    maxStudents: 500,
    features: [
      'Up to 500 Students',
      'Student & Teacher Profiles',
      'Daily Attendance Marking',
      'Class Timetable Scheduling',
      'Basic School Announcements',
      'Email Support',
    ],
  },
  {
    id: 'PRO',
    name: 'Professional Academy',
    popular: true,
    description: 'Ideal for medium to large schools requiring full academic & finance automation.',
    monthlyPrice: 99,
    annualPrice: 999,
    maxStudents: 2500,
    features: [
      'Up to 2,500 Students',
      'All Basic Features',
      'Fee Structures & Invoice Generation',
      'Online & Cash Payment Receipts',
      'Homework, Assignments & Grading',
      'Examinations, Marks & Report Cards',
      'Advanced Attendance & Revenue Reports',
      'Priority Support',
    ],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise Multi-Campus',
    description: 'Full-scale enterprise solution for high-capacity institutions & chains.',
    monthlyPrice: 299,
    annualPrice: 2999,
    maxStudents: 10000,
    features: [
      'Up to 10,000 Students',
      'All Professional Features',
      'Custom School Subdomain & Branding',
      'Automated Parent SMS & Email Alerts',
      'Audit Trail & Security Logs',
      'Dedicated Account Manager',
      '99.9% Uptime SLA',
    ],
  },
];

// Public endpoint for SaaS Landing Page pricing table
router.get('/plans', (req: Request, res: Response) => {
  return ApiResponse.success(res, SUBSCRIPTION_PLANS, 'Subscription plans fetched');
});

export const subscriptionRoutes = router;
