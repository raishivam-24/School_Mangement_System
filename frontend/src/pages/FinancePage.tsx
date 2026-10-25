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
import {
  SchoolAdminFinanceView,
  StudentPersonalFeesView,
  ParentFeeLedgerView,
} from '../components/features/finance';

export const FinancePage: React.FC = () => {
  const { user } = useAuth();

  if (user?.role === 'PARENT') {
    return <ParentFeeLedgerView user={user} />;
  }

  if (user?.role === 'STUDENT') {
    return <StudentPersonalFeesView user={user} />;
  }

  return <SchoolAdminFinanceView user={user} />;
};
