/**
 * @file subscription.service.ts
 * @description API service for SaaS subscription tiers, plans, and checkout simulation.
 */

import { api } from '../lib/api';

export interface SubscriptionPlanItem {
  id: 'BASIC' | 'PRO' | 'ENTERPRISE';
  name: string;
  popular?: boolean;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  maxStudents: number;
  features: string[];
}

export const subscriptionService = {
  /** Get all available subscription plans */
  getPlans: async (): Promise<SubscriptionPlanItem[]> => {
    const res = await api.get('/subscriptions/plans');
    return res.data?.data || [];
  },

  /** Checkout / Upgrade school subscription plan */
  checkout: async (data: { schoolId: string; plan: string; billingCycle: 'MONTHLY' | 'ANNUAL' }): Promise<any> => {
    const res = await api.post('/subscriptions/checkout', data);
    return res.data?.data;
  },
};
