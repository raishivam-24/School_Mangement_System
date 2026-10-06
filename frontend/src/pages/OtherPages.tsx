/**
 * @file OtherPages.tsx
 * @description Dedicated components for remaining navigation modules (Library, Messages, Reports, Profile, Settings, Subscriptions).
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  MessageSquare,
  FileText,
  User,
  Settings,
  DollarSign,
  Send,
  Search,
  Plus,
  Download,
  Shield,
  Bell,
  CheckCircle2,
} from 'lucide-react';

/* ========================================================================= */
/* 1. LIBRARY PAGE                                                           */
/* ========================================================================= */
export const LibraryPage: React.FC = () => {
  const books = [
    { title: 'Concepts of Physics (Vol 1)', author: 'H.C. Verma', isbn: '978-8177091878', category: 'Physics', available: 14, total: 20 },
    { title: 'Higher Algebra', author: 'Hall & Knight', isbn: '978-9351762560', category: 'Mathematics', available: 8, total: 15 },
    { title: 'Organic Chemistry', author: 'Morrison & Boyd', isbn: '978-8131704813', category: 'Chemistry', available: 5, total: 10 },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0060935467', category: 'Literature', available: 12, total: 12 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Library Catalog & Book Issues</h1>
          <p className="text-sm text-slate-500">Search library inventory, monitor issued books and due dates.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-sky text-white font-semibold text-sm shadow-soft hover:bg-brand-sky-dark transition-all">
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Book Details</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Category</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">ISBN</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400">Availability</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.map((b, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-sky-light text-brand-sky-dark flex items-center justify-center font-bold">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{b.title}</p>
                        <p className="text-xs text-slate-400 font-medium">By {b.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-semibold text-slate-600">{b.category}</td>
                  <td className="py-4 px-4 text-xs font-mono text-slate-400">{b.isbn}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-mint-light text-brand-mint-dark">
                      {b.available} / {b.total} Available
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all">
                      Issue Book
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

/* ========================================================================= */
/* 2. MESSAGES PAGE                                                          */
/* ========================================================================= */
export const MessagesPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: 'Amit Sharma', role: 'Teacher', text: 'Good morning, please review the revised math test questions.', time: '09:15 AM', isMe: false },
    { sender: 'You', role: 'Admin', text: 'Thanks Amit, reviewing them now and approving.', time: '09:20 AM', isMe: true },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'You', role: 'Admin', text: input, time: 'Just now', isMe: true }]);
    setInput('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Messages & In-App Chat</h1>
        <p className="text-sm text-slate-500">Communicate directly with staff, teachers, and parents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Left Contacts List */}
        <div className="bg-surface rounded-3xl p-4 border border-slate-100 shadow-card flex flex-col">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs"
            />
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {['Amit Sharma (Math)', 'Dr. Priya Patel (Science)', 'Sunita Rao (English)', 'Rajesh Nair (CS)'].map((c, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                  i === 0 ? 'bg-brand-sky-light text-brand-sky-dark font-bold' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-brand-sky text-white flex items-center justify-center font-bold text-xs">
                  {c.charAt(0)}
                </div>
                <div className="text-xs truncate">
                  <p className="font-semibold truncate">{c}</p>
                  <p className="text-[10px] text-slate-400">Active today</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Box */}
        <div className="md:col-span-2 bg-surface rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
          {/* Header */}
          <div className="pb-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-sky text-white flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800">Amit Sharma</h3>
              <p className="text-xs text-brand-mint-dark font-medium">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 py-4 space-y-3 overflow-y-auto">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs ${
                    m.isMe
                      ? 'bg-brand-sky text-white rounded-br-none'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block mt-1 text-right ${m.isMe ? 'text-sky-100' : 'text-slate-400'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-brand-sky text-white flex items-center justify-center shadow-soft hover:bg-brand-sky-dark transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 3. REPORTS PAGE                                                           */
/* ========================================================================= */
export const ReportsPage: React.FC = () => {
  const reportTemplates = [
    { title: 'Student Academic Performance Report', desc: 'Detailed grade breakdown by class, section, and term.', freq: 'Quarterly' },
    { title: 'Attendance Analytics & Defaulters', desc: 'Monthly attendance trends and students below 75% threshold.', freq: 'Monthly' },
    { title: 'Fee Collection & Overdue Summary', desc: 'Reconciliation of collected fees, concessions, and pending dues.', freq: 'Weekly' },
    { title: 'Teacher Workload & Syllabus Progress', desc: 'Track chapter completion and assigned lecture hours.', freq: 'Bi-Weekly' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Analytics & Institutional Reports</h1>
          <p className="text-sm text-slate-500">Generate compliance, academic, and financial exports in PDF/Excel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((r, i) => (
          <div key={i} className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-brand-lilac-light text-brand-lilac-dark flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">{r.title}</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{r.freq}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-end gap-3">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-sky text-white text-xs font-bold shadow-soft hover:bg-brand-sky-dark transition-all">
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 4. PROFILE PAGE                                                           */
/* ========================================================================= */
export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
        <p className="text-sm text-slate-500">Manage your account credentials and personal information.</p>
      </div>

      <div className="bg-surface rounded-3xl p-8 border border-slate-100 shadow-card">
        <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-brand-sky to-brand-lilac p-1 shadow-md">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150'}
              alt="Avatar"
              className="w-full h-full rounded-2xl object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-sky-light text-brand-sky-dark">
              {user?.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-bold block mb-1">Associated School</span>
            <span className="font-semibold text-slate-800">{user?.school?.name || 'Platform Super Admin'}</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 font-bold block mb-1">Account Status</span>
            <span className="font-semibold text-brand-mint-dark">ACTIVE & VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 5. SETTINGS PAGE                                                          */
/* ========================================================================= */
export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Platform Settings</h1>
        <p className="text-sm text-slate-500">Configure notifications, security policies, and school preferences.</p>
      </div>

      <div className="bg-surface rounded-3xl p-6 border border-slate-100 shadow-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Email Notifications</h3>
            <p className="text-xs text-slate-400">Receive daily digest of attendance and fee payments.</p>
          </div>
          <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-sky rounded" />
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Two-Factor Authentication (2FA)</h3>
            <p className="text-xs text-slate-400">Require OTP confirmation for administrator logins.</p>
          </div>
          <input type="checkbox" className="w-5 h-5 accent-brand-sky rounded" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Dark Mode (Beta)</h3>
            <p className="text-xs text-slate-400">Switch from pastel daylight theme to night contrast.</p>
          </div>
          <input type="checkbox" className="w-5 h-5 accent-brand-sky rounded" />
        </div>
      </div>
    </div>
  );
};
