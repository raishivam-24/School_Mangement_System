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
  Cloud,
} from 'lucide-react';
import { StorageTester } from '../components/features/storage/StorageTester';
import { AvatarUploader } from '../components/common/AvatarUploader';

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
          <h1 className="text-2xl font-bold text-primary">Library Catalog & Book Issues</h1>
          <p className="text-sm text-secondary">Search library inventory, monitor issued books and due dates.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent-blue text-white font-semibold text-sm shadow-card hover:bg-brand-sky-dark transition-all">
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      <div className="bg-surface rounded-3xl p-6 border border-border shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Book Details</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Category</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">ISBN</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted">Availability</th>
                <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {books.map((b, i) => (
                <tr key={i} className="hover:bg-surface-raised/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent-blue-subtle text-accent-blue flex items-center justify-center font-bold">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-primary">{b.title}</p>
                        <p className="text-xs text-muted font-medium">By {b.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-semibold text-secondary">{b.category}</td>
                  <td className="py-4 px-4 text-xs font-mono text-muted">{b.isbn}</td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-green-subtle text-accent-green">
                      {b.available} / {b.total} Available
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="px-4 py-1.5 rounded-full bg-surface-raised hover:bg-slate-200 text-secondary text-xs font-bold transition-all">
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
        <h1 className="text-2xl font-bold text-primary">Messages & In-App Chat</h1>
        <p className="text-sm text-secondary">Communicate directly with staff, teachers, and parents.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
        {/* Left Contacts List */}
        <div className="bg-surface rounded-3xl p-4 border border-border shadow-card flex flex-col">
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-3 py-2 bg-surface-raised border border-border rounded-full text-xs"
            />
          </div>
          <div className="space-y-2 flex-1 overflow-y-auto">
            {['Amit Sharma (Math)', 'Dr. Priya Patel (Science)', 'Sunita Rao (English)', 'Rajesh Nair (CS)'].map((c, i) => (
              <div
                key={i}
                className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                  i === 0 ? 'bg-accent-blue-subtle text-accent-blue font-bold' : 'hover:bg-surface-raised text-secondary'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-accent-blue text-white flex items-center justify-center font-bold text-xs">
                  {c.charAt(0)}
                </div>
                <div className="text-xs truncate">
                  <p className="font-semibold truncate">{c}</p>
                  <p className="text-[10px] text-muted">Active today</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Box */}
        <div className="md:col-span-2 bg-surface rounded-3xl p-6 border border-border shadow-card flex flex-col justify-between">
          {/* Header */}
          <div className="pb-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-blue text-white flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <h3 className="font-bold text-sm text-primary">Amit Sharma</h3>
              <p className="text-xs text-accent-green font-medium">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 py-4 space-y-3 overflow-y-auto">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-md p-3.5 rounded-2xl text-xs ${
                    m.isMe
                      ? 'bg-accent-blue text-white rounded-br-none'
                      : 'bg-surface-raised text-primary rounded-bl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  <span className={`text-[9px] block mt-1 text-right ${m.isMe ? 'text-sky-100' : 'text-muted'}`}>
                    {m.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="pt-3 border-t border-border flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-surface-raised border border-border rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
            />
            <button
              type="submit"
              className="w-10 h-10 rounded-full bg-accent-blue text-white flex items-center justify-center shadow-card hover:bg-brand-sky-dark transition-all"
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
          <h1 className="text-2xl font-bold text-primary">Analytics & Institutional Reports</h1>
          <p className="text-sm text-secondary">Generate compliance, academic, and financial exports in PDF/Excel.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTemplates.map((r, i) => (
          <div key={i} className="bg-surface rounded-3xl p-6 border border-border shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-accent-violet-subtle text-accent-violet flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-primary">{r.title}</h3>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">{r.freq}</span>
                </div>
              </div>
              <p className="text-xs text-secondary leading-relaxed">{r.desc}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-end gap-3">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-blue text-white text-xs font-bold shadow-card hover:bg-brand-sky-dark transition-all">
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
  const { user, setUser } = useAuth();
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

  const handleAvatarChange = (newUrl: string | null) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, avatarUrl: newUrl };
      try {
        localStorage.setItem('schoolhub_user', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setProfileSuccess(newUrl ? 'Profile photo uploaded to Cloudflare R2 and updated!' : 'Profile photo removed.');
    setTimeout(() => setProfileSuccess(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-primary">My Profile</h1>
        <p className="text-sm text-secondary">Manage your account credentials, avatar picture, and school details.</p>
      </div>

      {profileSuccess && (
        <div className="p-3.5 rounded-2xl bg-accent-green-subtle/50 text-accent-green border border-accent-green/30 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{profileSuccess}</span>
        </div>
      )}

      <div className="bg-surface rounded-3xl p-8 border border-border shadow-card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-border">
          {/* Real Cloudflare R2 Avatar Uploader */}
          <AvatarUploader
            currentAvatarUrl={user?.avatarUrl}
            onAvatarChange={handleAvatarChange}
            size="lg"
            fallbackName={user?.name}
            allowDelete={true}
          />

          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-primary">{user?.name}</h2>
            <p className="text-xs text-muted">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
                {user?.role.replace('_', ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-600 border border-orange-500/20">
                ☁️ R2 Profile Storage
              </span>
            </div>
            <p className="text-[11px] text-muted mt-2">
              Hover over or click your avatar to upload a high-resolution profile picture stored securely in Cloudflare R2.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-xs">
          <div className="p-4 rounded-2xl bg-surface-raised border border-border">
            <span className="text-muted font-bold block mb-1">Associated School</span>
            <span className="font-semibold text-primary">{user?.school?.name || 'Platform Super Admin'}</span>
          </div>
          <div className="p-4 rounded-2xl bg-surface-raised border border-border">
            <span className="text-muted font-bold block mb-1">Account Status</span>
            <span className="font-semibold text-accent-green">ACTIVE & VERIFIED</span>
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
  const [activeTab, setActiveTab] = useState<'storage' | 'general'>('storage');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings & Integrations</h1>
        <p className="text-sm text-secondary">Manage cloud infrastructure, security credentials, and system preferences.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab('storage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'storage'
              ? 'bg-orange-500/15 text-orange-600 border border-orange-500/30'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <Cloud className="w-4 h-4" />
          <span>Cloudflare R2 Storage</span>
        </button>

        <button
          onClick={() => setActiveTab('general')}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'general'
              ? 'bg-accent-blue-subtle text-accent-blue border border-accent-blue/30'
              : 'text-secondary hover:text-primary hover:bg-surface-raised'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>General & Security</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'storage' ? (
        <StorageTester />
      ) : (
        <div className="bg-surface rounded-3xl p-6 border border-border shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-primary">Email Notifications</h3>
              <p className="text-xs text-muted">Receive daily digest of attendance and fee payments.</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-brand-sky rounded" />
          </div>

          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="text-sm font-bold text-primary">Two-Factor Authentication (2FA)</h3>
              <p className="text-xs text-muted">Require OTP confirmation for administrator logins.</p>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-brand-sky rounded" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-primary">Dark Mode (Beta)</h3>
              <p className="text-xs text-muted">Switch from pastel daylight theme to night contrast.</p>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-brand-sky rounded" />
          </div>
        </div>
      )}
    </div>
  );
};
