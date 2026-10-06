/**
 * @file SuperAdminPage.tsx
 * @description Super Admin Platform Dashboard with School Tenants, MRR revenue metrics, and SaaS plans.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  DollarSign,
  ArrowUpRight,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react';

export const SuperAdminPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample School Tenants
  const [schools] = useState([
    {
      id: 'sch_1',
      name: 'Delhi Public Academy',
      code: 'DPA-DELHI',
      email: 'admin@dpa.edu',
      students: 1248,
      teachers: 72,
      plan: 'PRO',
      mrr: 99,
      status: 'ACTIVE',
      joinedDate: 'Jan 2026',
    },
    {
      id: 'sch_2',
      name: 'Greenwood International School',
      code: 'GW-MUMBAI',
      email: 'admin@greenwood.edu',
      students: 840,
      teachers: 45,
      plan: 'BASIC',
      mrr: 29,
      status: 'ACTIVE',
      joinedDate: 'Feb 2026',
    },
    {
      id: 'sch_3',
      name: 'St. Xavier High School',
      code: 'STX-DELHI',
      email: 'admin@stxavier.edu',
      students: 3100,
      teachers: 140,
      plan: 'ENTERPRISE',
      mrr: 299,
      status: 'ACTIVE',
      joinedDate: 'Mar 2026',
    },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-brand-sky-light text-brand-sky-dark uppercase tracking-wider">
            SaaS Platform Administration
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-1">Platform Overview</h2>
        </div>
      </div>

      {/* 4 Platform Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Total Schools</span>
          <p className="text-3xl font-extrabold text-slate-800">42</p>
          <span className="text-[11px] font-bold text-brand-mint-dark bg-brand-mint-light px-2 py-0.5 rounded-full mt-2 inline-block">
            +4 this month
          </span>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">
            Platform Students
          </span>
          <p className="text-3xl font-extrabold text-slate-800">18,421</p>
          <span className="text-[11px] font-bold text-brand-sky-dark mt-2 inline-block">
            Across all tenants
          </span>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Monthly SaaS MRR</span>
          <p className="text-3xl font-extrabold text-brand-mint-dark">₹24,50,000</p>
          <span className="text-[11px] font-bold text-brand-mint-dark bg-brand-mint-light px-2 py-0.5 rounded-full mt-2 inline-block">
            +18.4% YoY
          </span>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-slate-100 shadow-soft">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Active Trials</span>
          <p className="text-3xl font-extrabold text-brand-yellow-dark">7</p>
          <span className="text-[11px] font-bold text-slate-400 mt-2 inline-block">
            Expiring in 14 days
          </span>
        </div>
      </div>

      {/* Registered School Tenants Table */}
      <div className="bg-surface rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-base">Registered School Tenants</h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search school name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6">School Tenant</th>
                <th className="py-4 px-6">Code</th>
                <th className="py-4 px-6">Students</th>
                <th className="py-4 px-6">Teachers</th>
                <th className="py-4 px-6">Subscription Plan</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
              {schools.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-brand-sky-light text-brand-sky-dark font-black flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-slate-600">{s.code}</td>
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {s.students.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-900">{s.teachers}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-lilac-light text-brand-lilac-dark">
                      {s.plan} (₹{(s.mrr * 250).toLocaleString('en-IN')}/mo)
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-brand-mint-light text-brand-mint-dark">
                      ACTIVE
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-slate-400 hover:text-slate-700 p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
