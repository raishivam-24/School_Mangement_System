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
    <div className="min-h-screen bg-canvas text-slate-800 selection:bg-brand-sky-light selection:text-brand-sky-dark">
      {/* ========================================================================= */}
      {/* 1. PUBLIC TOP HEADER */}
      {/* ========================================================================= */}
      <header className="h-20 border-b border-slate-100 bg-surface/80 backdrop-blur-md sticky top-0 z-30 px-6 sm:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-sky flex items-center justify-center text-white shadow-glow-sky">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-800">
            School<span className="text-brand-sky-dark">Hub</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2.5 rounded-full text-sm font-bold text-slate-600 hover:text-slate-900 transition-all"
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-sky-light text-brand-sky-dark text-xs font-extrabold tracking-wide uppercase shadow-sm"
        >
          <Sparkles className="w-4 h-4" /> Next-Gen Multi-Tenant School SaaS
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight"
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
          className="text-lg text-slate-500 max-w-2xl mx-auto font-medium"
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
            className="px-8 py-4 rounded-2xl bg-surface border border-slate-200 text-slate-700 font-bold text-base hover:bg-slate-50 transition-all shadow-card"
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
          <div className="bg-surface p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-sky-light text-brand-sky-dark flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Student & Academics</h3>
            <p className="text-sm text-slate-500">
              Preserve complete multi-year enrollment history, class rosters, subjects, and teacher
              assignments effortlessly.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-yellow-light text-brand-yellow-dark flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Attendance & Exams</h3>
            <p className="text-sm text-slate-500">
              1-click daily attendance sheets, subject exam schedules, automated grade calculation, and
              instant report cards.
            </p>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-slate-100 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-mint-light text-brand-mint-dark flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Fee Invoices & Receipts</h3>
            <p className="text-sm text-slate-500">
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
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-500 font-medium">
            Choose the perfect plan for your school. Upgrade or cancel anytime.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-3 bg-surface p-1.5 rounded-full border border-slate-200 shadow-sm mt-4">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                !isAnnual ? 'bg-brand-sky-dark text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                isAnnual ? 'bg-brand-sky-dark text-white shadow-sm' : 'text-slate-500'
              }`}
            >
              Annually <span className="text-[10px] text-brand-yellow font-extrabold">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* BASIC */}
          <div className="bg-surface p-8 rounded-3xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                Basic Starter
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">
                  ${isAnnual ? '299' : '29'}
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              <p className="text-xs text-slate-500">For small schools up to 500 students.</p>

              <ul className="space-y-3 pt-4 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint" /> Up to 500 Students
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint" /> Daily Attendance Marking
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint" /> Class Timetables
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-mint" /> School Announcements
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenRegister('BASIC')}
              className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all"
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
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-sky-light text-brand-sky-dark">
                Professional Academy
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">
                  ${isAnnual ? '999' : '99'}
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              <p className="text-xs text-slate-500">For medium to large institutions.</p>

              <ul className="space-y-3 pt-4 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-sky" /> Up to 2,500 Students
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-sky" /> Fee Management & Invoices
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-sky" /> Exams, Marks & Report Cards
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-sky" /> Homework Grading
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-sky" /> Advanced Financial Reports
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
          <div className="bg-surface p-8 rounded-3xl border border-slate-200 shadow-soft flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-lilac-light text-brand-lilac-dark">
                Enterprise Multi-Campus
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900">
                  ${isAnnual ? '2999' : '299'}
                </span>
                <span className="text-sm font-semibold text-slate-400">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
              <p className="text-xs text-slate-500">For large school networks and chains.</p>

              <ul className="space-y-3 pt-4 text-xs font-semibold text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-lilac" /> Up to 10,000 Students
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-lilac" /> Custom Subdomain & Branding
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-lilac" /> Audit Logs & Security
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-lilac" /> Dedicated Account Manager
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleOpenRegister('ENTERPRISE')}
              className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200 transition-all"
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
              className="bg-surface w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 p-8 relative my-8"
            >
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 absolute top-6 right-6"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="mb-6 space-y-1">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-brand-sky-light text-brand-sky-dark uppercase">
                  Register on {selectedPlan} Plan
                </span>
                <h3 className="text-2xl font-black text-slate-900">Set Up Your School</h3>
                <p className="text-xs text-slate-500">
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School Name
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. St. Xavier High School"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  </div>

                  {/* School Code */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School Code / Slug
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. STX-DELHI"
                        value={formData.schoolCode}
                        onChange={(e) =>
                          setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })
                        }
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* School Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      School Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder="info@school.edu"
                        value={formData.schoolEmail}
                        onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  </div>

                  {/* School Phone */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.schoolPhone}
                        onChange={(e) => setFormData({ ...formData, schoolPhone: e.target.value })}
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    School Administrator Account
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Admin Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Father Thomas"
                          value={formData.adminName}
                          onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Admin Login Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="admin@school.edu"
                          value={formData.adminEmail}
                          onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Password (min 8 characters)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={formData.adminPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, adminPassword: e.target.value })
                        }
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
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
