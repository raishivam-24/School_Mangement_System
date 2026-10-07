/**
 * @file LandingPage.tsx
 * @description Public SaaS Landing Page with Pricing cards and Self-Service School Registration Modal.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  School,
  GraduationCap,
  CalendarCheck,
  DollarSign,
  ShieldCheck,
  X,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Building2,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { registerSchool } = useAuth();
  const navigate = useNavigate();

  const [isAnnual, setIsAnnual] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'BASIC' | 'PRO' | 'ENTERPRISE'>('PRO');

  // Form State
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    schoolEmail: '',
    schoolPhone: '',
    schoolAddress: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenRegister = (plan: 'BASIC' | 'PRO' | 'ENTERPRISE') => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await registerSchool({
        ...formData,
        plan: selectedPlan,
        billingCycle: isAnnual ? 'ANNUALLY' : 'MONTHLY',
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setShowModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary selection:bg-accent-blue-subtle selection:text-accent-blue">
      {/* ========================================================================= */}
      {/* 1. PUBLIC TOP HEADER */}
      {/* ========================================================================= */}
      <header className="h-20 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center text-white shadow-glow-sky">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-primary">
            School<span className="text-accent-blue">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full text-sm font-bold text-secondary hover:text-primary transition-all"
          >
            Sign In
          </Link>
          <button
            onClick={() => handleOpenRegister('PRO')}
            className="px-5 py-2.5 rounded-full text-sm font-bold bg-brand-sky-dark text-white hover:bg-sky-600 transition-all shadow-sm flex items-center gap-2"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 px-6 text-center max-w-5xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue-subtle text-accent-blue text-xs font-extrabold tracking-wide uppercase shadow-sm"
        >
          <Sparkles className="w-4 h-4" /> Next-Gen Multi-Tenant School SaaS
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-primary tracking-tight leading-tight"
        >
          All-in-One Platform to <br />
          <span className="bg-gradient-to-r from-brand-sky-dark via-sky-500 to-brand-lilac-dark bg-clip-text text-transparent">
            Automate Your Entire School
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-secondary max-w-2xl mx-auto font-medium"
        >
          From daily student attendance and interactive exam report cards to tuition fee collection
          and class schedules — manage everything in one beautiful pastel dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={() => handleOpenRegister('PRO')}
            className="px-8 py-4 rounded-2xl bg-brand-sky-dark text-white font-bold text-base shadow-glow-sky hover:bg-sky-600 transition-all flex items-center gap-2"
          >
            Register Your School <ArrowRight className="w-5 h-5" />
          </button>
          <Link
            to="/login"
            className="px-8 py-4 rounded-2xl bg-surface border border-border text-secondary font-bold text-base hover:bg-surface-raised transition-all shadow-card"
          >
            Explore Live Demo
          </Link>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 3. KEY FEATURES GRID */}
      {/* ========================================================================= */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface p-8 rounded-3xl border border-border shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-blue-subtle text-accent-blue flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-primary">Student & Academics</h3>
            <p className="text-sm text-secondary">
              Preserve complete multi-year enrollment history, class rosters, subjects, and teacher
              assignments effortlessly.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-border shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-amber-subtle text-accent-amber flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-primary">Attendance & Exams</h3>
            <p className="text-sm text-secondary">
              1-click daily attendance sheets, subject exam schedules, automated grade calculation, and
              instant report cards.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-border shadow-card space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-green-subtle text-accent-green flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-primary">Fee Invoices & Receipts</h3>
            <p className="text-sm text-secondary">
              Itemized fee breakdowns, bulk invoice generation for classes, installment payment
              collections, and instant receipt numbering.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRICING PLANS TABLE */}
      {/* ========================================================================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-primary">
            Simple, Transparent Pricing
          </h2>
          <p className="text-secondary font-medium">
            Choose the perfect plan for your school. Upgrade or cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-3 bg-surface p-1.5 rounded-full border border-border shadow-sm mt-4">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                !isAnnual ? 'bg-brand-sky-dark text-white shadow-sm' : 'text-secondary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAnnual ? 'bg-brand-sky-dark text-white shadow-sm' : 'text-secondary'
              }`}
            >
              Annually <span className="text-[10px] text-accent-amber font-extrabold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* BASIC */}
          <div className="bg-surface p-8 rounded-3xl border border-border shadow-card flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-surface-raised text-secondary">
                Basic Starter
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary">
                  ₹{isAnnual ? '24,999' : '2,499'}
                </span>
                <span className="text-sm font-semibold text-muted">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              <p className="text-xs text-secondary">For small schools up to 500 students.</p>

              <ul className="space-y-3 pt-4 text-xs font-semibold text-secondary">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-green" /> Up to 500 Students
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-green" /> Daily Attendance Marking
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-green" /> Class Timetables
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-green" /> School Announcements
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenRegister('BASIC')}
              className="w-full py-3.5 rounded-2xl bg-surface-raised text-primary font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Choose Basic
            </button>
          </div>

          {/* PRO (Highlighted) */}
          <div className="bg-surface p-8 rounded-3xl border-2 border-brand-sky shadow-glow-sky flex flex-col justify-between space-y-8 relative">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-extrabold bg-brand-sky-dark text-white uppercase tracking-wider shadow-sm">
              Most Popular
            </span>

            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-blue-subtle text-accent-blue">
                Professional Academy
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary">
                  ₹{isAnnual ? '79,999' : '7,999'}
                </span>
                <span className="text-sm font-semibold text-muted">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              <p className="text-xs text-secondary">For medium to large institutions.</p>

              <ul className="space-y-3 pt-4 text-xs font-semibold text-secondary">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-blue" /> Up to 2,500 Students
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-blue" /> Fee Management & Invoices
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-blue" /> Exams, Marks & Report Cards
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-blue" /> Homework Grading
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-blue" /> Advanced Financial Reports
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenRegister('PRO')}
              className="w-full py-3.5 rounded-2xl bg-brand-sky-dark text-white font-bold text-sm shadow-sm hover:bg-sky-600 transition-all"
            >
              Start 14-Day Free Trial
            </button>
          </div>

          {/* ENTERPRISE */}
          <div className="bg-surface p-8 rounded-3xl border border-border shadow-card flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-violet-subtle text-accent-violet">
                Enterprise Multi-Campus
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary">
                  ₹{isAnnual ? '2,49,999' : '24,999'}
                </span>
                <span className="text-sm font-semibold text-muted">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              <p className="text-xs text-secondary">For large school networks and chains.</p>

              <ul className="space-y-3 pt-4 text-xs font-semibold text-secondary">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-violet" /> Up to 10,000 Students
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-violet" /> Custom Subdomain & Branding
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-violet" /> Audit Logs & Security
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-accent-violet" /> Dedicated Account Manager
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenRegister('ENTERPRISE')}
              className="w-full py-3.5 rounded-2xl bg-surface-raised text-primary font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Contact Enterprise
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SELF-SERVICE ONBOARDING MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface w-full max-w-xl rounded-3xl shadow-2xl border border-border p-8 relative my-8"
            >
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center text-secondary hover:bg-slate-200 absolute top-6 right-6"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6 space-y-1">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-accent-blue-subtle text-accent-blue uppercase">
                  Register on {selectedPlan} Plan
                </span>
                <h3 className="text-2xl font-black text-primary">Set Up Your School</h3>
                <p className="text-xs text-secondary">
                  Instant account setup. No credit card required for trial.
                </p>
              </div>

              {error && (
                <div className="p-3 mb-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* School Name */}
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1">
                      School Name
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. St. Xavier High School"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  </div>

                  {/* School Code */}
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1">
                      School Code / Slug
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. STX-DELHI"
                        value={formData.schoolCode}
                        onChange={(e) =>
                          setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })
                        }
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* School Email */}
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1">
                      School Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="info@school.edu"
                        value={formData.schoolEmail}
                        onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  </div>

                  {/* School Phone */}
                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.schoolPhone}
                        onChange={(e) => setFormData({ ...formData, schoolPhone: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-4">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                    School Administrator Account
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary mb-1">
                        Admin Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Father Thomas"
                          value={formData.adminName}
                          onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-secondary mb-1">
                        Admin Login Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="admin@school.edu"
                          value={formData.adminEmail}
                          onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-secondary mb-1">
                      Password (min 8 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={formData.adminPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, adminPassword: e.target.value })
                        }
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-raised border border-border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3.5 rounded-2xl bg-brand-sky-dark text-white font-bold text-sm shadow-glow-sky hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Creating School...' : 'Complete Registration & Enter Dashboard'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
