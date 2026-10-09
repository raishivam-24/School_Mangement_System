/**
 * @file FinancePage.tsx
 * @description Role-Aware School Finance & Fee Portal.
 * - Students & Parents strictly see their personal fee ledger, installment schedule,
 *   downloadable payment receipts, itemized CBSE fee structure, and online UPI payment portal.
 * - Administrators & Accountants see school-wide revenue metrics, collection rates,
 *   bulk invoice tools, and the master student ledger.
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { SchoolAdminFinanceView, StudentPersonalFeesView } from '../components/features/finance';

export const FinancePage: React.FC = () => {
  const { user } = useAuth();

  // If user is a Student or Parent, strictly render their personal fee & receipt view
  if (user?.role === 'STUDENT' || user?.role === 'PARENT') {
    return <StudentPersonalFeesView user={user} />;
  }

  // School Admins, Accountants, and Super Admins see the master ledger & revenue analytics
  return <SchoolAdminFinanceView user={user} />;
};
