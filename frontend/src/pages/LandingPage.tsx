/**
 * @file LandingPage.tsx
 * @description Next-Gen SchoolHub Landing Page inspired by modern Framer / Cloves aesthetic.
 * Features:
 * - Dynamic blue-to-whitish sky gradient background with atmospheric lighting
 * - Scroll-driven 3D tilt & zoom-in emerging dashboard mockup (via Framer Motion useScroll + useSpring)
 * - Staggered text reveals and floating parallax badge pills
 * - Interactive stakeholder role explorer (Principal, Teachers, Students, Parents)
 * - Creative Bento-grid feature suite with scroll reveals
 * - Real metrics and verified school testimonials
 * - Transparent pricing with monthly/annual toggle
 * - Full 2-Step Registration & official Razorpay checkout integration
 */

import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { openRazorpayModal } from '../utils/razorpay';
import confetti from 'canvas-confetti';
import dashboardImg from '../assets/image.png';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building2,
  GraduationCap,
  CalendarCheck,
  CreditCard,
  Smartphone,
  Landmark,
  Check,
  ChevronDown,
  Star,
  Users,
  Layers,
  Award,
  Zap,
  Lock,
  X,
  User,
  ShieldCheck,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { registerSchool } = useAuth();
  const navigate = useNavigate();

  // Reference for scroll-driven 3D dashboard reveal
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Smooth springs for high-end Framer-like physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });

  // 3D Perspective Transformations on Scroll
  const dashboardRotateX = useTransform(smoothProgress, [0, 0.45], [16, 0]);
  const dashboardScale = useTransform(smoothProgress, [0, 0.45], [0.86, 1.05]);
  const dashboardY = useTransform(smoothProgress, [0, 0.45], [40, -30]);
  const dashboardOpacity = useTransform(smoothProgress, [0, 0.15], [0.9, 1]);

  // Floating Cards Parallax
  const cardFloat1 = useTransform(smoothProgress, [0, 0.5], [15, -45]);
  const cardFloat2 = useTransform(smoothProgress, [0, 0.5], [-15, 35]);

  // Navigation & UI States
  const [isAnnual, setIsAnnual] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [selectedPlan, setSelectedPlan] = useState<'BASIC' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [paymentOption, setPaymentOption] = useState<'PAY_NOW' | 'TRIAL'>('PAY_NOW');
  const [activeRole, setActiveRole] = useState<'PRINCIPAL' | 'TEACHER' | 'STUDENT' | 'PARENT'>('PRINCIPAL');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Registration Form State
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

  const planInfo = {
    BASIC: {
      name: 'Basic Starter',
      monthly: 2499,
      annual: 24990,
      students: 'Up to 500 Students',
      description: 'Ideal for independent pre-schools and primary academies.',
      features: [
        'Classes 1 to 5 Management',
        'Section & Subject Allocations',
        'Attendance Tracking & Daily Logs',
        'Basic Fee Invoicing & Receipts',
        'Admin & Teacher Portal Access',
        'Email Support',
      ],
    },
    PRO: {
      name: 'Professional Campus',
      monthly: 7999,
      annual: 79990,
      students: 'Up to 2,500 Students',
      description: 'The standard choice for full K-12 and CBSE affiliated schools.',
      popular: true,
      features: [
        'Complete Classes 1 to 12 Management',
        '1-Click CBSE Starter Kit & Timetable Engine',
        'Instant Razorpay Fee Settlements & UPI',
        'Examination & Report Card Generator',
        'Dedicated Student & Parent Portals',
        'Notice Board Broadcasts (SMS & Email)',
        'Priority Phone & WhatsApp Support',
      ],
    },
    ENTERPRISE: {
      name: 'Enterprise Multi-Campus',
      monthly: 24999,
      annual: 249990,
      students: 'Up to 10,000 Students',
      description: 'Built for large educational trusts, chains & university colleges.',
      features: [
        'Unlimited Classes & Multi-Branch Campuses',
        'Custom Domain & School Brand Whitelabeling',
        'Advanced Financial Ledgers & Audit Logs',
        'Custom Cloudflare R2 / AWS S3 Integration',
        'Dedicated Cloud Database Cluster',
        '24/7 Dedicated Account Manager & SLA',
      ],
    },
  };

  const handleOpenRegister = (plan: 'BASIC' | 'PRO' | 'ENTERPRISE') => {
    setSelectedPlan(plan);
    setModalStep(1);
    setPaymentOption('PAY_NOW');
    setError(null);
    setShowModal(true);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.schoolName.trim() || !formData.schoolCode.trim() || !formData.schoolEmail.trim()) {
      setError('Please provide school name, code, and official email.');
      return;
    }
    if (!formData.adminName.trim() || !formData.adminEmail.trim() || !formData.adminPassword || formData.adminPassword.length < 8) {
      setError('Please enter a valid administrator name, email, and password (min 8 chars).');
      return;
    }
    setError(null);
    setModalStep(2);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let paymentPayload: {
        razorpayOrderId?: string;
        razorpayPaymentId?: string;
        razorpaySignature?: string;
        isTrial?: boolean;
      } = {};

      if (paymentOption === 'PAY_NOW') {
        const orderRes = await api.post('/auth/subscription-order', {
          plan: selectedPlan,
          billingCycle: isAnnual ? 'ANNUALLY' : 'MONTHLY',
        });
        const orderData = orderRes.data?.data;
        if (!orderData?.orderId || !orderData?.keyId) {
          throw new Error('Failed to initialize Razorpay payment order.');
        }

        const rzpResponse = await openRazorpayModal({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: formData.schoolName || 'SchoolHub ERP',
          description: `${planInfo[selectedPlan].name} Subscription (${isAnnual ? 'Annually' : 'Monthly'})`,
          order_id: orderData.orderId,
          prefill: {
            name: formData.adminName,
            email: formData.adminEmail,
            contact: formData.schoolPhone,
          },
          theme: {
            color: '#2563eb',
          },
        });

        paymentPayload = {
          razorpayOrderId: rzpResponse.razorpay_order_id,
          razorpayPaymentId: rzpResponse.razorpay_payment_id,
          razorpaySignature: rzpResponse.razorpay_signature,
        };
      } else {
        paymentPayload = {
          isTrial: true,
        };
      }

      await registerSchool({
        ...formData,
        plan: selectedPlan,
        billingCycle: isAnnual ? 'ANNUALLY' : 'MONTHLY',
        ...paymentPayload,
      });

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      setShowModal(false);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message ||
        err.message ||
        'Registration failed. Please check inputs.'
      );
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      q: 'Is SchoolHub compliant with CBSE, ICSE, and State Board guidelines?',
      a: 'Yes! SchoolHub comes pre-configured with the CBSE grading schema, Term 1 & Term 2 report cards, periodic assessments, and standardized attendance metrics right out of the box.',
    },
    {
      q: 'How does the Razorpay fee collection integration work for parents?',
      a: 'Parents receive real-time fee breakdown invoices on their portal. They can pay in seconds using UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit cards, or NetBanking. Payments settle directly into the school’s account with instant digital receipts generated automatically.',
    },
    {
      q: 'Can we migrate existing student and teacher records from Excel?',
      a: 'Absolutely. We provide standard CSV/Excel bulk upload templates for students, teachers, classes, and fee structures. Most campuses migrate their complete database within under an hour.',
    },
    {
      q: 'What is the 1-Click CBSE Starter Kit?',
      a: 'Brand new registered schools can initialize Classes 1 through 10 (Sections A & B) along with 6 Core Subjects (Mathematics, Science, English, Social Science, Hindi, Computer Science) in one single click, saving hours of manual setup.',
    },
    {
      q: 'Is there a free trial before making payment?',
      a: 'Yes. You can choose to pay and activate immediately with instant invoice generation, or test the entire platform with our risk-free 14-day free trial.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. BLUE-TO-WHITISH SKY GRADIENT HERO SECTION WITH SCROLL-DRIVEN 3D ZOOM */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        className="relative pt-6 pb-28 sm:pb-44 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#215cf3] via-[#3b82f6] via-45% via-[#93c5fd] via-75% via-[#e0f2fe] via-90% to-[#FDFEFE]"
      >
        {/* Sky Ambient Light Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-white/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[350px] bg-sky-200/30 blur-[100px] rounded-full pointer-events-none" />

        {/* Subtle dot matrix overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1.2px,transparent_1.2px)] [background-size:24px_24px]" />

        {/* --- FLOATING PILL NAVBAR --- */}
        <nav className="relative z-40 max-w-5xl mx-auto mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/95 backdrop-blur-md rounded-full px-4 sm:px-6 py-2.5 sm:py-3 shadow-2xl flex items-center justify-between border border-white/60"
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                School<span className="text-blue-600">Hub</span>
              </span>
            </Link>

            {/* Menu Links */}
            <div className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#stakeholders" className="hover:text-blue-600 transition-colors">Portals</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-blue-600 transition-colors">Schools</a>
              <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            </div>

            {/* Nav Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-all rounded-full"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={() => handleOpenRegister('PRO')}
                className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </nav>

        {/* --- HERO CENTER HEADINGS & CTAS --- */}
        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Badge Pill with smooth pop-in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-xs font-semibold shadow-inner"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-powered operations for modern schools</span>
          </motion.div>

          {/* Staggered Smooth Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white drop-shadow-xs"
          >
            Automate workflows <br className="hidden sm:inline" />
            with <span className="underline decoration-white/40 decoration-wavy decoration-2">SchoolHub</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-normal leading-relaxed"
          >
            Connect attendance, academic timetables, CBSE examinations, and instant Razorpay fee collections into one beautifully unified operating system.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <button
              type="button"
              onClick={() => handleOpenRegister('PRO')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-950 hover:bg-black text-white text-sm font-bold shadow-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#dashboard-preview"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white text-sm font-semibold transition-all text-center shadow-xs"
            >
              Explore Live Preview
            </a>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="pt-3 flex items-center justify-center gap-3 text-xs text-white/90"
          >
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-amber-400 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-slate-900 shadow-xs">DPS</div>
              <div className="w-7 h-7 rounded-full bg-emerald-400 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-slate-900 shadow-xs">KV</div>
              <div className="w-7 h-7 rounded-full bg-rose-400 border-2 border-blue-600 flex items-center justify-center text-[10px] font-bold text-slate-900 shadow-xs">STX</div>
            </div>
            <span>Trusted by <strong>250+ Premier CBSE &amp; ICSE Campuses</strong></span>
          </motion.div>
        </div>

        {/* --- SCROLL-DRIVEN 3D ZOOMING DASHBOARD MOCKUP --- */}
        <div id="dashboard-preview" className="relative z-30 max-w-6xl mx-auto mt-14 sm:mt-24 [perspective:1400px]">
          <motion.div
            style={{
              rotateX: dashboardRotateX,
              scale: dashboardScale,
              y: dashboardY,
              opacity: dashboardOpacity,
              transformStyle: 'preserve-3d',
            }}
            className="relative rounded-2xl sm:rounded-3xl border border-white/60 bg-white/95 shadow-[0_30px_100px_-20px_rgba(30,58,138,0.35)] p-2 sm:p-3 overflow-hidden backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_40px_120px_-15px_rgba(30,58,138,0.45)]"
          >
            {/* Mac Traffic Controls & Browser Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/90 rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400 shadow-xs" />
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-xs" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-xs" />
                <span className="text-[11px] font-semibold text-slate-400 ml-2 hidden sm:inline">SchoolHub Cloud OS</span>
              </div>

              {/* URL Pill */}
              <div className="px-5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-mono text-slate-600 flex items-center gap-2 shadow-xs">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>schoolhub.edu/campus/cbse-portal</span>
              </div>

              <div className="flex items-center gap-1 text-slate-400 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
                <span className="text-[11px] font-semibold text-slate-600 hidden sm:inline">Live Sync</span>
              </div>
            </div>

            {/* High-Res Dashboard Screenshot */}
            <div className="relative rounded-b-xl sm:rounded-b-2xl overflow-hidden bg-slate-100 group">
              <img
                src={dashboardImg}
                alt="SchoolHub Real-Time Dashboard Interface"
                className="w-full h-auto object-cover object-top rounded-b-xl sm:rounded-b-2xl shadow-inner transition-transform duration-700 group-hover:scale-[1.01]"
              />

              {/* Subtle Bottom Light Fade */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
            </div>

            {/* --- CREATIVE FLOATING CARDS (Parallax Motion) --- */}
            <motion.div
              style={{ y: cardFloat1 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -left-6 top-1/4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl items-center gap-3 text-left max-w-xs z-30"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">1-Click Starter Kit</span>
                <span className="text-[11px] text-slate-500 block">Classes 1–10 &amp; CBSE Subjects seeded in 1 second.</span>
              </div>
            </motion.div>

            <motion.div
              style={{ y: cardFloat2 }}
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -right-6 top-1/3 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-2xl items-center gap-3 text-left max-w-xs z-30"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Razorpay Settlements</span>
                <span className="text-[11px] text-slate-500 block">Instant UPI, QR &amp; Cards with real-time receipts.</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="hidden md:flex absolute right-12 -bottom-6 p-3.5 rounded-2xl bg-slate-950 text-white shadow-2xl items-center gap-3 z-30 border border-slate-800"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                98%
              </div>
              <div>
                <span className="text-xs font-bold block">CBSE Attendance Radar</span>
                <span className="text-[10px] text-slate-400 block">Automated alerts on threshold drops</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE METRICS & IMPACT TICKER */}
      {/* ========================================================================= */}
      <section className="py-12 border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 shadow-xs"
          >
            <span className="text-3xl sm:text-4xl font-black text-slate-950 block">250+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Active Campuses</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 shadow-xs"
          >
            <span className="text-3xl sm:text-4xl font-black text-blue-600 block">1,80,000+</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Students &amp; Parents</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 shadow-xs"
          >
            <span className="text-3xl sm:text-4xl font-black text-emerald-600 block">99.4%</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Fee Recovery Rate</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 shadow-xs"
          >
            <span className="text-3xl sm:text-4xl font-black text-slate-950 block">15 hrs</span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 block">Saved / Teacher Weekly</span>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE STAKEHOLDER ROLE EXPLORER */}
      {/* ========================================================================= */}
      <section id="stakeholders" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-4"
        >
          <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            Engineered for Every Role
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            One platform. Dedicated experiences for everyone.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            SchoolHub breaks down data silos by empowering principals, educators, learners, and families with purpose-built workflows.
          </p>

          {/* Interactive Role Switcher Pills */}
          <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200 gap-1.5 mt-4">
            {(
              [
                { id: 'PRINCIPAL', label: 'School Admin & Principal', icon: Building2 },
                { id: 'TEACHER', label: 'Teachers & Faculty', icon: GraduationCap },
                { id: 'STUDENT', label: 'Students', icon: User },
                { id: 'PARENT', label: 'Parents', icon: Users },
              ] as const
            ).map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRole(role.id)}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRole === role.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <role.icon className="w-3.5 h-3.5" />
                <span>{role.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stakeholder Details Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-card grid md:grid-cols-2 gap-8 items-center"
          >
            <div className="space-y-6">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block">
                {activeRole === 'PRINCIPAL' && 'Leadership Command Center'}
                {activeRole === 'TEACHER' && 'Classroom Acceleration Suite'}
                {activeRole === 'STUDENT' && 'Personalized Learning Workspace'}
                {activeRole === 'PARENT' && 'Real-Time Transparency & Fee Settlement'}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {activeRole === 'PRINCIPAL' && '360° Real-time visibility over academic health and financial ledgers.'}
                {activeRole === 'TEACHER' && 'Mark attendance in 10 seconds and generate CBSE report cards effortlessly.'}
                {activeRole === 'STUDENT' && 'Track homework, view daily period schedules, and monitor exam preparation.'}
                {activeRole === 'PARENT' && 'Pay school fees via instant UPI, view marks, and never miss an announcement.'}
              </h3>

              <div className="space-y-3">
                {activeRole === 'PRINCIPAL' && [
                  '1-Click Starter Kit auto-populating Classes 1-10 with CBSE curricula',
                  'Instant Razorpay payment gateway integration with platform audit logs',
                  'Teacher timetable allocation with collision & conflict prevention',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}

                {activeRole === 'TEACHER' && [
                  'Batch attendance marking with automated 75% CBSE defaulter calculations',
                  'Homework & assignment distributions with submission tracking',
                  'Instant entry of Periodic Tests & Term Exams with automated grading',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}

                {activeRole === 'STUDENT' && [
                  'Live period schedule indicating ongoing classrooms and teachers',
                  'Upcoming exam countdowns with complete chapter syllabus previews',
                  'Personalized academic attendance gauge keeping you compliant (>75%)',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}

                {activeRole === 'PARENT' && [
                  'Instant Razorpay checkout for quarterly dues via Google Pay, PhonePe & Cards',
                  'Verified digital receipt generation with downloadable PDF proofs',
                  'Direct teacher remarks and official circular notice broadcasts',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleOpenRegister('PRO')}
                  className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Experience as {activeRole === 'PRINCIPAL' ? 'School Leader' : activeRole === 'TEACHER' ? 'Teacher' : activeRole === 'STUDENT' ? 'Student' : 'Parent'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Visual Preview for Role */}
            <div className="relative rounded-2xl bg-white border border-slate-200 p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {activeRole[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      {activeRole === 'PRINCIPAL' && 'Delhi Public Academy • Leadership Suite'}
                      {activeRole === 'TEACHER' && 'Dr. Priya Patel • Grade 10 Science Faculty'}
                      {activeRole === 'STUDENT' && 'Rahul Sharma • Roll STU-2026 (Class 10-A)'}
                      {activeRole === 'PARENT' && 'Mr. Ramesh Sharma (Parent of Rahul)'}
                    </h5>
                    <span className="text-[10px] text-slate-400">Status: Verified SchoolHub Account</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  Active
                </span>
              </div>

              {/* Sample Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {activeRole === 'PRINCIPAL' ? 'Total Enrolled' : activeRole === 'TEACHER' ? 'Classes Assigned' : activeRole === 'STUDENT' ? 'Current Attendance' : 'Pending Tuition Dues'}
                  </span>
                  <span className="text-lg font-black text-slate-900 block mt-0.5">
                    {activeRole === 'PRINCIPAL' ? '3,420 Students' : activeRole === 'TEACHER' ? '5 Sections' : activeRole === 'STUDENT' ? '88.4% (Safe)' : '₹0 (All Cleared)'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">
                    {activeRole === 'PRINCIPAL' ? 'Fee Collection' : activeRole === 'TEACHER' ? 'Today Attendance' : activeRole === 'STUDENT' ? 'Term Average' : 'Next Payment Due'}
                  </span>
                  <span className="text-lg font-black text-blue-600 block mt-0.5">
                    {activeRole === 'PRINCIPAL' ? '₹1.84 Cr (96.2%)' : activeRole === 'TEACHER' ? '138 / 142 Marked' : activeRole === 'STUDENT' ? '91.2% (Top 5%)' : '15 Nov 2026'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {activeRole === 'PRINCIPAL' && 'Automated system reports are generated and emailed every Monday 07:00 AM.'}
                  {activeRole === 'TEACHER' && 'Period 2 Physics Lab starts in 15 minutes in Science Lab 1.'}
                  {activeRole === 'STUDENT' && 'Maths Mock Test scheduled in 8 days. Chapter 1-5 revision notes available.'}
                  {activeRole === 'PARENT' && 'All quarterly fees cleared. Official receipt #REC-2026-941 available to download.'}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ========================================================================= */}
      {/* 4. CREATIVE BENTO-GRID FEATURE SHOWCASE */}
      {/* ========================================================================= */}
      <section id="features" className="py-20 sm:py-28 bg-slate-50/70 border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
              Modern Campus Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Everything required to run a high-performing campus.
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Designed from first principles to eradicate paper files, fragmented spreadsheets, and lost fee installments.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento 1: Large Academic Structure */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2 p-8 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between hover:shadow-lg transition-all group"
            >
              <div className="space-y-4 max-w-md">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Instant Academic Structure &amp; CBSE Timetables
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Generate Class 1 to 12 sections in 1 click. Our conflict-detection engine ensures no teacher is double-booked across periods, while room capacities are strictly enforced.
                </p>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 grid grid-cols-3 gap-3 text-center">
                <div className="p-2">
                  <span className="text-base font-extrabold text-slate-900 block">Class 1 to 12</span>
                  <span className="text-[11px] text-slate-500">Dual Sections A &amp; B</span>
                </div>
                <div className="p-2 border-x border-slate-200">
                  <span className="text-base font-extrabold text-blue-600 block">0 Clashes</span>
                  <span className="text-[11px] text-slate-500">Auto Timetable Engine</span>
                </div>
                <div className="p-2">
                  <span className="text-base font-extrabold text-emerald-600 block">1-Click</span>
                  <span className="text-[11px] text-slate-500">CBSE Curriculum Seed</span>
                </div>
              </div>
            </motion.div>

            {/* Bento 2: Razorpay Payments */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl bg-slate-950 text-white shadow-xl flex flex-col justify-between hover:scale-[1.01] transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-emerald-400 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  Frictionless Razorpay Checkout
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Support instant UPI (Google Pay, PhonePe, Paytm), RuPay &amp; NetBanking. Eliminate unverified bank deposit slips.
                </p>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Quarterly Tuition Invoices</span>
                  <span className="font-bold text-emerald-400">Instant</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>SSL Encryption</span>
                  <span className="font-bold text-white">256-Bit</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Digital Receipts</span>
                  <span className="font-bold text-white">Automated</span>
                </div>
              </div>
            </motion.div>

            {/* Bento 3: Attendance Radar */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Smart Attendance Radar
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  One-tap period attendance with instant 75% CBSE compliance checks and automated absent alerts to guardians.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-600">
                <span>Safe Attendance Benchmark &gt; 75%</span>
              </div>
            </motion.div>

            {/* Bento 4: Examinations & Marksheets */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  CBSE Grading &amp; Transcripts
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Automate aggregate calculation, GPA conversions, rank positions, and tamper-proof marksheet transcripts.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-violet-600">
                <span>QR-Verified Digital Transcripts</span>
              </div>
            </motion.div>

            {/* Bento 5: Multi-Tenant Data Isolation */}
            <motion.div
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-card flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Strict Multi-Tenant Isolation
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  Each school operates inside a cryptographically isolated tenant partition. Zero data cross-contamination.
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-rose-600">
                <span>Enterprise Cloudflare &amp; AWS Backed</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VERIFIED SCHOOL TESTIMONIALS */}
      {/* ========================================================================= */}
      <section id="testimonials" className="py-20 sm:py-28 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            Real School Impact
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Trusted by the educators shaping tomorrow.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            See how administrators and principals across India transitioned away from messy legacy software to SchoolHub.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'Before SchoolHub, reconciling fee checks and bank receipts took our accounts department two full weeks every quarter. With the Razorpay integration, 95% of parents pay via UPI directly. It revolutionized our finances.',
              author: 'Dr. Shalini Mukherjee',
              role: 'Principal, Delhi Public Academy',
              badge: '3,200 Students',
              rating: 5,
            },
            {
              quote:
                'The 1-Click CBSE Starter Kit saved us weeks of initial configuration. Setting up Classes 1 to 10 with sections, subjects, and timetables happened in an afternoon. Our teachers love the 10-second period attendance.',
              author: 'Rajesh Verma',
              role: 'Director of Academics, St. Xavier’s High',
              badge: 'CBSE Affiliated',
              rating: 5,
            },
            {
              quote:
                'As a parent, having Rahul’s homework deadlines, timetable, and report card right on my phone is amazing. Being able to pay quarterly fees via Google Pay in 20 seconds and get a verified receipt immediately is seamless.',
              author: 'Meera Nambiar',
              role: 'Parent of Class 10 Scholar',
              badge: 'Parent Portal User',
              rating: 5,
            },
          ].map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-card flex flex-col justify-between hover:shadow-md transition-all space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{t.author}</h5>
                  <span className="text-[11px] text-slate-500 block">{t.role}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                  {t.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. TRANSPARENT PRICING & TIER SELECTION */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 sm:py-28 bg-slate-950 text-white relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-3xl mx-auto space-y-4"
          >
            <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white/10 text-blue-400 border border-white/15">
              Predictable Campus Investment
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Transparent plans. Zero hidden surprises.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Every plan includes unlimited teachers, administrators, automated database backups, and Razorpay fee collection capability.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`text-xs font-bold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
                Billed Monthly
              </span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-7 rounded-full bg-slate-800 p-1 transition-all relative border border-slate-700 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-blue-500 transition-all ${
                    isAnnual ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
                  Billed Annually
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Save 20%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {(['BASIC', 'PRO', 'ENTERPRISE'] as const).map((key, idx) => {
              const plan = planInfo[key];
              const price = isAnnual ? plan.annual : plan.monthly;
              const isPopular = 'popular' in plan && plan.popular;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className={`p-8 sm:p-10 rounded-3xl flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'bg-blue-600 text-white shadow-2xl scale-105 border-2 border-blue-400/60 z-20'
                      : 'bg-white/5 border border-white/10 hover:border-white/20 text-white'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                      Most Popular For Schools
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-extrabold">{plan.name}</h4>
                      <p className={`text-xs mt-1 ${isPopular ? 'text-blue-100' : 'text-slate-400'}`}>
                        {plan.description}
                      </p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl sm:text-5xl font-black">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        <span className={`text-xs font-medium ${isPopular ? 'text-blue-200' : 'text-slate-400'}`}>
                          / {isAnnual ? 'year' : 'month'}
                        </span>
                      </div>
                      <span className={`text-xs font-bold block mt-1.5 ${isPopular ? 'text-blue-100' : 'text-slate-300'}`}>
                        {plan.students}
                      </span>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-white/10">
                      {plan.features.map((feat, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isPopular ? 'text-white' : 'text-blue-400'}`} />
                          <span className={isPopular ? 'text-blue-50' : 'text-slate-300'}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      type="button"
                      onClick={() => handleOpenRegister(key)}
                      className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer ${
                        isPopular
                          ? 'bg-white text-blue-700 hover:bg-blue-50'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      <span>Choose {plan.name}</span>
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (Accordion) */}
      {/* ========================================================================= */}
      <section id="faq" className="py-20 sm:py-28 max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4 mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need to know about setting up SchoolHub on your campus.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. HIGH-CONVERSION CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white p-8 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white/15 border border-white/20">
              Transform Your Campus Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Ready to elevate your school with SchoolHub?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base font-normal">
              Register in under 60 seconds. Auto-provision CBSE classes, set up fees, and invite your faculty seamlessly.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenRegister('PRO')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-900 font-extrabold text-sm shadow-xl hover:bg-blue-50 transition-all active:scale-95 cursor-pointer"
              >
                Register Your School Now
              </button>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all"
              >
                Existing User Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 9. CORPORATE FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-200 bg-slate-50 py-12 px-4 sm:px-6 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-sm text-slate-900">
              School<span className="text-blue-600">Hub</span>
            </span>
            <span className="text-slate-400">| Complete School Operating System</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#testimonials" className="hover:text-slate-900">Schools</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
            <Link to="/login" className="hover:text-slate-900">Sign In</Link>
          </div>

          <div className="text-slate-400">
            &copy; {new Date().getFullYear()} SchoolHub ERP. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 10. TWO-STEP REGISTRATION & RAZORPAY CHECKOUT MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8 relative overflow-hidden text-slate-900"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Progress Steps Header */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    modalStep === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'
                  }`}
                >
                  {modalStep === 1 ? '1' : <Check className="w-4 h-4" />}
                </div>
                <div className="h-0.5 flex-1 bg-slate-200 relative">
                  <div
                    className={`h-full bg-blue-600 transition-all duration-300 ${
                      modalStep === 2 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    modalStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  2
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* --- STEP 1: School & Admin Credentials --- */}
              {modalStep === 1 && (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Register Your School</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Step 1 of 2: Create your school tenant and root administrator credentials.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Official School Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        placeholder="e.g. Delhi Public Academy"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">School Code *</label>
                        <input
                          type="text"
                          required
                          value={formData.schoolCode}
                          onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                          placeholder="e.g. DPA-DELHI"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Official Email *</label>
                        <input
                          type="email"
                          required
                          value={formData.schoolEmail}
                          onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                          placeholder="admin@school.edu"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.schoolPhone}
                          onChange={(e) => setFormData({ ...formData, schoolPhone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Campus City</label>
                        <input
                          type="text"
                          value={formData.schoolAddress}
                          onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                          placeholder="e.g. New Delhi"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        Administrator Access
                      </span>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Admin Full Name *</label>
                          <input
                            type="text"
                            required
                            value={formData.adminName}
                            onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                            placeholder="Dr. Shalini Mukherjee"
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Admin Email *</label>
                            <input
                              type="email"
                              required
                              value={formData.adminEmail}
                              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                              placeholder="principal@school.edu"
                              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Password * (Min 8)</label>
                            <input
                              type="password"
                              required
                              minLength={8}
                              value={formData.adminPassword}
                              onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                              placeholder="••••••••"
                              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <span>Continue to Plan &amp; Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* --- STEP 2: Plan Review & Razorpay Checkout --- */}
              {modalStep === 2 && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Subscription &amp; Checkout</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Step 2 of 2: Review your plan and complete Razorpay digital checkout.
                    </p>
                  </div>

                  {/* Plan Summary Card */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Tier</span>
                      <h4 className="text-base font-extrabold text-slate-900">{planInfo[selectedPlan].name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{planInfo[selectedPlan].students}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block">
                        {isAnnual ? 'Billed Annually (-20%)' : 'Billed Monthly'}
                      </span>
                      <span className="text-2xl font-black text-blue-600">
                        ₹{(isAnnual ? planInfo[selectedPlan].annual : planInfo[selectedPlan].monthly).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Options (Pay Now vs Free Trial) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Subscription Activation</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => setPaymentOption('PAY_NOW')}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          paymentOption === 'PAY_NOW'
                            ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-bold text-slate-900">Pay via Razorpay</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">Instant active subscription with official receipt.</p>
                      </div>

                      <div
                        onClick={() => setPaymentOption('TRIAL')}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          paymentOption === 'TRIAL'
                            ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span className="text-xs font-bold text-slate-900">14-Day Free Trial</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">No payment required today. Full features unlocked.</p>
                      </div>
                    </div>
                  </div>

                  {/* Razorpay Banner (When Pay Now is selected) */}
                  {paymentOption === 'PAY_NOW' && (
                    <div className="p-4 rounded-2xl bg-white border border-blue-200 space-y-3.5 shadow-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold text-slate-900">Razorpay Payment Gateway</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase tracking-wider">
                          Live Integration
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <Smartphone className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                          <span className="text-[11px] font-bold text-slate-900 block">Instant UPI</span>
                          <span className="text-[9px] text-slate-400 block">GPay, PhonePe, Paytm</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <CreditCard className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                          <span className="text-[11px] font-bold text-slate-900 block">Cards</span>
                          <span className="text-[9px] text-slate-400 block">Visa, Mastercard, RuPay</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                          <Landmark className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                          <span className="text-[11px] font-bold text-slate-900 block">Net Banking</span>
                          <span className="text-[9px] text-slate-400 block">50+ Indian Banks</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        Clicking the button below opens the secure Razorpay Checkout modal to authenticate payment.
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Secured with Razorpay 256-Bit SSL Bank-Grade Encryption</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setModalStep(1)}
                      className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
                    >
                      {loading ? (
                        'Opening Razorpay Checkout...'
                      ) : paymentOption === 'PAY_NOW' ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>
                            Pay ₹{(isAnnual ? planInfo[selectedPlan].annual : planInfo[selectedPlan].monthly).toLocaleString('en-IN')} via Razorpay
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>Start 14-Day Free Trial</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
