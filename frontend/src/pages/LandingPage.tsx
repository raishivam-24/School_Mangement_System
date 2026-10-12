/**
 * @file LandingPage.tsx
 * @description Premium SchoolHub Landing Page inspired by Cloves Framer aesthetic.
 *
 * Design pillars:
 * - Soft blue-lavender luminous hero gradient with radial glows
 * - Masked-text headline reveal (translateY + clip) with staggered lines
 * - Scroll-driven dashboard rise: translateY + scale + opacity tied to scroll progress
 * - Diverse per-section animations: horizontal slides, scale pops, counter ticks
 * - Generous whitespace, restrained shadows, polished Inter typography
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useInView,
} from 'framer-motion';
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
  BarChart3,
  BookOpen,
  Bell,
  Globe,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════════════════════ */

// Masked text reveal — each line slides up from behind a clip boundary
const lineReveal = {
  hidden: { y: '110%', opacity: 0 },
  visible: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.85,
      delay: 0.1 + i * 0.13,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// Gentle fade-up for supporting copy
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Scale pop for cards
const scalePop = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Horizontal slide from left
const slideFromLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Horizontal slide from right
const slideFromRight = {
  hidden: { opacity: 0, x: 50 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ═══════════════════════════════════════════════════════════════════════════════
   ANIMATED COUNTER COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
const AnimatedCounter: React.FC<{
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}> = ({ target, suffix = '', prefix = '', decimals = 0, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target * Math.pow(10, decimals)) / Math.pow(10, decimals));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, duration, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {decimals > 0 ? count.toFixed(decimals) : count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   SECTION HEADING COMPONENT (Consistent masked-text reveal)
   ═══════════════════════════════════════════════════════════════════════════════ */
const SectionHeading: React.FC<{
  badge: string;
  badgeColor?: string;
  title: string;
  subtitle?: string;
}> = ({ badge, badgeColor = 'bg-blue-50 text-blue-600 border-blue-100', title, subtitle }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="text-center max-w-3xl mx-auto space-y-5">
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`inline-block text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border ${badgeColor}`}
      >
        {badge}
      </motion.span>

      <div className="overflow-hidden">
        <motion.h2
          initial={{ y: '100%', opacity: 0 }}
          animate={isInView ? { y: '0%', opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-[2.75rem] lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
        >
          {title}
        </motion.h2>
      </div>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN LANDING PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */
export const LandingPage: React.FC = () => {
  const { registerSchool } = useAuth();
  const navigate = useNavigate();

  /* ─── Scroll-Driven Dashboard Rise ─── */
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  // Dashboard: starts cleanly peaking in viewport, rises and scales smoothly on scroll
  const dashY = useTransform(smoothProgress, [0, 0.45], [30, -25]);
  const dashScale = useTransform(smoothProgress, [0, 0.45], [0.97, 1.02]);
  const dashOpacity = useTransform(smoothProgress, [0, 0.08], [0.85, 1]);

  // Hero text: subtle parallax upward as user scrolls
  const heroTextY = useTransform(smoothProgress, [0, 0.4], [0, -40]);

  // Navbar becomes solid on scroll
  const [navSolid, setNavSolid] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setNavSolid(v > 0.02);
  });

  /* ─── UI States ─── */
  const [isAnnual, setIsAnnual] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2>(1);
  const [selectedPlan, setSelectedPlan] = useState<'BASIC' | 'PRO' | 'ENTERPRISE'>('PRO');
  const [paymentOption, setPaymentOption] = useState<'PAY_NOW' | 'TRIAL'>('PAY_NOW');
  const [activeRole, setActiveRole] = useState<'PRINCIPAL' | 'TEACHER' | 'STUDENT' | 'PARENT'>('PRINCIPAL');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

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

  /* ─── Plan Info ─── */
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

  /* ─── Registration Handlers ─── */
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

  /* ─── FAQ Data ─── */
  const faqs = [
    {
      q: 'Is SchoolHub compliant with CBSE, ICSE, and State Board guidelines?',
      a: 'Yes! SchoolHub comes pre-configured with the CBSE grading schema, Term 1 & Term 2 report cards, periodic assessments, and standardized attendance metrics right out of the box.',
    },
    {
      q: 'How does the Razorpay fee collection integration work for parents?',
      a: "Parents receive real-time fee breakdown invoices on their portal. They can pay in seconds using UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit cards, or NetBanking. Payments settle directly into the school's account with instant digital receipts generated automatically.",
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

  /* ─── Stakeholder Role Data ─── */
  const roleData = {
    PRINCIPAL: {
      tagline: 'Leadership Command Center',
      headline: '360° Real-time visibility over academic health and financial ledgers.',
      features: [
        '1-Click Starter Kit auto-populating Classes 1-10 with CBSE curricula',
        'Instant Razorpay payment gateway integration with platform audit logs',
        'Teacher timetable allocation with collision & conflict prevention',
      ],
      cta: 'School Leader',
      mockup: {
        name: 'Delhi Public Academy • Leadership Suite',
        stat1Label: 'Total Enrolled',
        stat1Value: '3,420 Students',
        stat2Label: 'Fee Collection',
        stat2Value: '₹1.84 Cr (96.2%)',
        insight: 'Automated system reports are generated and emailed every Monday 07:00 AM.',
      },
    },
    TEACHER: {
      tagline: 'Classroom Acceleration Suite',
      headline: 'Mark attendance in 10 seconds and generate CBSE report cards effortlessly.',
      features: [
        'Batch attendance marking with automated 75% CBSE defaulter calculations',
        'Homework & assignment distributions with submission tracking',
        'Instant entry of Periodic Tests & Term Exams with automated grading',
      ],
      cta: 'Teacher',
      mockup: {
        name: 'Dr. Priya Patel • Grade 10 Science Faculty',
        stat1Label: 'Classes Assigned',
        stat1Value: '5 Sections',
        stat2Label: 'Today Attendance',
        stat2Value: '138 / 142 Marked',
        insight: 'Period 2 Physics Lab starts in 15 minutes in Science Lab 1.',
      },
    },
    STUDENT: {
      tagline: 'Personalized Learning Workspace',
      headline: 'Track homework, view daily period schedules, and monitor exam preparation.',
      features: [
        'Live period schedule indicating ongoing classrooms and teachers',
        'Upcoming exam countdowns with complete chapter syllabus previews',
        'Personalized academic attendance gauge keeping you compliant (>75%)',
      ],
      cta: 'Student',
      mockup: {
        name: 'Rahul Sharma • Roll STU-2026 (Class 10-A)',
        stat1Label: 'Current Attendance',
        stat1Value: '88.4% (Safe)',
        stat2Label: 'Term Average',
        stat2Value: '91.2% (Top 5%)',
        insight: 'Maths Mock Test scheduled in 8 days. Chapter 1-5 revision notes available.',
      },
    },
    PARENT: {
      tagline: 'Real-Time Transparency & Fee Settlement',
      headline: 'Pay school fees via instant UPI, view marks, and never miss an announcement.',
      features: [
        'Instant Razorpay checkout for quarterly dues via Google Pay, PhonePe & Cards',
        'Verified digital receipt generation with downloadable PDF proofs',
        'Direct teacher remarks and official circular notice broadcasts',
      ],
      cta: 'Parent',
      mockup: {
        name: 'Mr. Ramesh Sharma (Parent of Rahul)',
        stat1Label: 'Pending Tuition Dues',
        stat1Value: '₹0 (All Cleared)',
        stat2Label: 'Next Payment Due',
        stat2Value: '15 Nov 2026',
        insight: 'All quarterly fees cleared. Official receipt #REC-2026-941 available to download.',
      },
    },
  };

  /* ─── Feature Cards for Bento Grid ─── */
  const featureCards = [
    {
      icon: Layers,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      title: 'Instant Academic Structure & CBSE Timetables',
      desc: 'Generate Class 1 to 12 sections in 1 click. Our conflict-detection engine ensures no teacher is double-booked across periods.',
      large: true,
      stats: [
        { label: 'Dual Sections A & B', value: 'Class 1 to 12' },
        { label: 'Auto Timetable Engine', value: '0 Clashes' },
        { label: 'CBSE Curriculum Seed', value: '1-Click' },
      ],
    },
    {
      icon: CreditCard,
      iconBg: 'bg-white/10',
      iconColor: 'text-emerald-400',
      title: 'Frictionless Razorpay Checkout',
      desc: 'Support instant UPI (Google Pay, PhonePe, Paytm), RuPay & NetBanking. Eliminate unverified bank deposit slips.',
      dark: true,
      details: [
        { label: 'Quarterly Tuition Invoices', value: 'Instant' },
        { label: 'SSL Encryption', value: '256-Bit' },
        { label: 'Digital Receipts', value: 'Automated' },
      ],
    },
    {
      icon: CalendarCheck,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      title: 'Smart Attendance Radar',
      desc: 'One-tap period attendance with instant 75% CBSE compliance checks and automated absent alerts to guardians.',
      tag: 'Safe Attendance Benchmark > 75%',
      tagColor: 'text-amber-600',
    },
    {
      icon: Award,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      title: 'CBSE Grading & Transcripts',
      desc: 'Automate aggregate calculation, GPA conversions, rank positions, and tamper-proof marksheet transcripts.',
      tag: 'QR-Verified Digital Transcripts',
      tagColor: 'text-violet-600',
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-600',
      title: 'Strict Multi-Tenant Isolation',
      desc: 'Each school operates inside a cryptographically isolated tenant partition. Zero data cross-contamination.',
      tag: 'Enterprise Cloudflare & AWS Backed',
      tagColor: 'text-rose-600',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFEFE] text-slate-900 selection:bg-blue-600 selection:text-white antialiased overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          1. HERO SECTION — Blue-Lavender Gradient + Scroll-Driven Dashboard
          ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background: '#2f70ec',
          backgroundImage: `
            radial-gradient(ellipse 90% 60% at 50% -10%, rgba(255, 255, 255, 0.28) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 15% 30%, rgba(165, 180, 252, 0.25) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 85% 30%, rgba(147, 197, 253, 0.25) 0%, transparent 55%),
            radial-gradient(rgba(255, 255, 255, 0.18) 1.2px, transparent 1.2px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 28px 28px',
        }}
      >
        {/* Soft bottom fade transitioning smoothly into white */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#FDFEFE] via-[#FDFEFE]/40 to-transparent pointer-events-none z-10" />

        {/* ── Floating Pill Navbar ── */}
        <nav className="sticky top-3 z-50 max-w-5xl mx-auto pt-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-full px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between border transition-all duration-500 ${
              navSolid
                ? 'bg-white/95 backdrop-blur-xl border-slate-200/80 shadow-xl'
                : 'bg-white/80 backdrop-blur-md border-white/60 shadow-2xl'
            }`}
          >
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                School<span className="text-blue-600">Hub</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
              <a href="#stakeholders" className="hover:text-blue-600 transition-colors">Portals</a>
              <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="hover:text-blue-600 transition-colors">Schools</a>
              <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-[13px] font-bold text-slate-700 hover:text-blue-600 transition-all rounded-full"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={() => handleOpenRegister('PRO')}
                className="px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-[13px] font-bold transition-all shadow-md active:scale-[0.97] cursor-pointer flex items-center gap-1.5"
              >
                <span>Get started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </nav>

        {/* ── Hero Content (Higher, refined proportions, masked reveal) ── */}
        <motion.div
          style={{ y: heroTextY }}
          className="relative z-20 max-w-3xl mx-auto text-center mt-10 sm:mt-14 space-y-4"
        >
          {/* Badge pill */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-white text-xs font-semibold shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-powered operations for modern schools</span>
          </motion.div>

          {/* Headline with masked reveal per line */}
          <div className="space-y-1">
            {['Automate workflows', 'with SchoolHub'].map((line, i) => (
              <div key={i} className="overflow-hidden">
                <motion.div
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={lineReveal}
                >
                  <h1 className="text-3xl sm:text-[2.85rem] md:text-[3.5rem] lg:text-[3.75rem] font-extrabold tracking-tight leading-[1.12] text-white drop-shadow-sm">
                    {line}
                  </h1>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Supporting copy */}
          <motion.p
            custom={0.35}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-sm sm:text-base text-white/90 max-w-lg mx-auto leading-relaxed font-normal"
          >
            Connect attendance, academic timetables, CBSE examinations, and instant Razorpay fee collections into one beautifully unified operating system.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            custom={0.5}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1"
          >
            <button
              type="button"
              onClick={() => handleOpenRegister('PRO')}
              className="px-8 py-3.5 rounded-full bg-slate-950 hover:bg-black text-white text-xs sm:text-sm font-bold shadow-2xl transition-all active:scale-[0.97] cursor-pointer flex items-center justify-center gap-2 group border border-white/15"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#dashboard-preview"
              className="px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white text-xs sm:text-sm font-semibold transition-all text-center"
            >
              Explore Live Preview
            </a>
          </motion.div>

          {/* Social Proof Strip */}
          <motion.div
            custom={0.65}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="pt-1 flex items-center justify-center gap-2.5 text-xs text-white/90"
          >
            <div className="flex -space-x-1.5">
              {['DPS', 'KV', 'STX'].map((code, i) => (
                <div
                  key={code}
                  className={`w-6 h-6 rounded-full border border-white/60 flex items-center justify-center text-[9px] font-extrabold text-slate-900 shadow-sm ${
                    i === 0 ? 'bg-amber-300' : i === 1 ? 'bg-emerald-300' : 'bg-rose-300'
                  }`}
                >
                  {code}
                </div>
              ))}
            </div>
            <span className="font-medium">Trusted by <strong>250+ Premier CBSE &amp; ICSE Campuses</strong></span>
          </motion.div>
        </motion.div>

        {/* ── Scroll-Driven Dashboard Rise ── */}
        <div id="dashboard-preview" className="relative z-20 max-w-6xl mx-auto mt-8 sm:mt-12">
          <motion.div
            style={{
              y: dashY,
              scale: dashScale,
              opacity: dashOpacity,
            }}
            className="relative rounded-2xl sm:rounded-3xl border border-white/60 bg-white/95 shadow-[0_24px_80px_-12px_rgba(20,40,90,0.35)] p-2 sm:p-3 overflow-hidden backdrop-blur-xl"
          >
            {/* Browser Chrome */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/90 rounded-t-xl sm:rounded-t-2xl">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-semibold text-slate-400 ml-2 hidden sm:inline">SchoolHub Cloud OS</span>
              </div>
              <div className="px-5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-mono text-slate-500 flex items-center gap-2 shadow-xs">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>schoolhub.edu/campus/cbse-portal</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">Live Sync</span>
              </div>
            </div>

            {/* Dashboard Screenshot */}
            <div className="relative rounded-b-xl sm:rounded-b-2xl overflow-hidden bg-slate-50">
              <img
                src={dashboardImg}
                alt="SchoolHub Real-Time Dashboard Interface"
                className="w-full h-auto object-cover object-top rounded-b-xl sm:rounded-b-2xl"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/30 to-transparent pointer-events-none" />
            </div>

            {/* Floating Feature Pill — Left */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -left-4 top-1/4 p-3.5 rounded-2xl bg-white/95 backdrop-blur-lg border border-slate-200/80 shadow-xl items-center gap-3 max-w-[240px] z-30"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">1-Click Starter Kit</span>
                <span className="text-[10px] text-slate-500 block leading-snug">Classes 1–10 &amp; CBSE Subjects seeded instantly.</span>
              </div>
            </motion.div>

            {/* Floating Feature Pill — Right */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -right-4 top-1/3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-lg border border-slate-200/80 shadow-xl items-center gap-3 max-w-[240px] z-30"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-4.5 h-4.5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Razorpay Settlements</span>
                <span className="text-[10px] text-slate-500 block leading-snug">Instant UPI, QR &amp; Cards with real-time receipts.</span>
              </div>
            </motion.div>

            {/* Bottom Dark Pill */}
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
              className="hidden md:flex absolute right-8 -bottom-4 p-3 rounded-2xl bg-slate-950 text-white shadow-xl items-center gap-3 z-30 border border-slate-800"
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

      {/* ── Brand Marquee Strip ── */}
      <section className="py-10 border-b border-slate-100 bg-white overflow-hidden">
        <p className="text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">
          Trusted by leading educational boards &amp; 250+ institutions
        </p>
        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
            className="flex items-center gap-12 whitespace-nowrap shrink-0"
          >
            {[
              'Delhi Public School',
              'CBSE Affiliated',
              'St. Xavier\'s High School',
              'ICSE Board Certified',
              'Kendriya Vidyalaya',
              'The Heritage Academy',
              'DAV Public School',
              'Bishop Cotton Academy',
              'Delhi Public School',
              'CBSE Affiliated',
              'St. Xavier\'s High School',
              'ICSE Board Certified',
              'Kendriya Vidyalaya',
              'The Heritage Academy',
              'DAV Public School',
              'Bishop Cotton Academy',
            ].map((name, i) => (
              <span key={i} className="text-sm font-extrabold text-slate-400/80 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                {name}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          2. METRICS STRIP — Animated counters on viewport entry
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-14 border-b border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: 250, suffix: '+', label: 'Active Campuses', color: 'text-slate-950' },
            { value: 180000, suffix: '+', label: 'Students & Parents', color: 'text-blue-600', prefix: '' },
            { value: 99.4, suffix: '%', label: 'Fee Recovery Rate', color: 'text-emerald-600', decimals: 1 },
            { value: 15, suffix: ' hrs', label: 'Saved / Teacher Weekly', color: 'text-slate-950' },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              custom={idx * 0.08}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={scalePop}
              className="p-5 rounded-2xl bg-slate-50/60 border border-slate-200/50 text-center"
            >
              <span className={`text-3xl sm:text-4xl font-black ${metric.color} block`}>
                <AnimatedCounter
                  target={metric.value}
                  suffix={metric.suffix}
                  prefix={metric.prefix}
                  decimals={metric.decimals || 0}
                />
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1.5 block">
                {metric.label}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          3. STAKEHOLDER ROLE EXPLORER — Horizontal slide transitions
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="stakeholders" className="py-24 sm:py-32 max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Engineered for Every Role"
          title="One platform. Dedicated experiences for everyone."
          subtitle="SchoolHub breaks down data silos by empowering principals, educators, learners, and families with purpose-built workflows."
        />

        {/* Role Switcher Pills */}
        <div className="flex justify-center mt-10 mb-14">
          <div className="inline-flex p-1.5 rounded-full bg-slate-100 border border-slate-200 gap-1 flex-wrap justify-center">
            {([
              { id: 'PRINCIPAL' as const, label: 'School Admin', icon: Building2 },
              { id: 'TEACHER' as const, label: 'Teachers', icon: GraduationCap },
              { id: 'STUDENT' as const, label: 'Students', icon: User },
              { id: 'PARENT' as const, label: 'Parents', icon: Users },
            ]).map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setActiveRole(role.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRole === role.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/80'
                }`}
              >
                <role.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{role.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Role Detail Card — horizontal slide animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="p-8 sm:p-12 rounded-3xl bg-slate-50 border border-slate-200/70 grid md:grid-cols-2 gap-10 items-center"
          >
            {/* Text Side */}
            <div className="space-y-6">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block">
                {roleData[activeRole].tagline}
              </span>
              <h3 className="text-2xl sm:text-[1.7rem] font-extrabold text-slate-900 leading-snug">
                {roleData[activeRole].headline}
              </h3>
              <div className="space-y-3">
                {roleData[activeRole].features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => handleOpenRegister('PRO')}
                className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-[0.97]"
              >
                <span>Experience as {roleData[activeRole].cta}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mockup Side */}
            <div className="relative rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                    {activeRole[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{roleData[activeRole].mockup.name}</h5>
                    <span className="text-[10px] text-slate-400">Status: Verified SchoolHub Account</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">Active</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">{roleData[activeRole].mockup.stat1Label}</span>
                  <span className="text-base font-black text-slate-900 block mt-0.5">{roleData[activeRole].mockup.stat1Value}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">{roleData[activeRole].mockup.stat2Label}</span>
                  <span className="text-base font-black text-blue-600 block mt-0.5">{roleData[activeRole].mockup.stat2Value}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{roleData[activeRole].mockup.insight}</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          4. BENTO-GRID FEATURES — Staggered scale pop-in
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 sm:py-32 bg-slate-50/60 border-t border-slate-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          <SectionHeading
            badge="Modern Campus Architecture"
            badgeColor="bg-emerald-50 text-emerald-600 border-emerald-100"
            title="Everything required to run a high-performing campus."
            subtitle="Designed from first principles to eradicate paper files, fragmented spreadsheets, and lost fee installments."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featureCards.map((card, idx) => (
              <motion.div
                key={idx}
                custom={idx * 0.07}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                variants={scalePop}
                className={`p-8 rounded-3xl flex flex-col justify-between transition-all group ${
                  card.large ? 'md:col-span-2' : ''
                } ${
                  card.dark
                    ? 'bg-slate-950 text-white shadow-xl hover:shadow-2xl'
                    : 'bg-white border border-slate-200/70 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl ${card.iconBg} ${card.iconColor} flex items-center justify-center`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-extrabold ${card.dark ? 'text-white' : 'text-slate-900'}`}>
                    {card.title}
                  </h3>
                  <p className={`text-sm leading-relaxed ${card.dark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {card.desc}
                  </p>
                </div>

                {/* Stats row for large card */}
                {card.stats && (
                  <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/60 grid grid-cols-3 gap-3 text-center">
                    {card.stats.map((stat, i) => (
                      <div key={i} className={`p-2 ${i > 0 && i < card.stats!.length ? 'border-l border-slate-200' : ''}`}>
                        <span className="text-sm font-extrabold text-slate-900 block">{stat.value}</span>
                        <span className="text-[10px] text-slate-500">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Details for dark card */}
                {card.details && (
                  <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    {card.details.map((d, i) => (
                      <div key={i} className="flex justify-between text-slate-300">
                        <span>{d.label}</span>
                        <span className="font-bold text-emerald-400">{d.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tag for small cards */}
                {card.tag && (
                  <div className={`mt-6 flex items-center gap-2 text-xs font-bold ${card.tagColor}`}>
                    <span>{card.tag}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          5. TESTIMONIALS — Alternating slide-in directions
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 sm:py-32 max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Real School Impact"
          title="Trusted by the educators shaping tomorrow."
          subtitle="See how administrators and principals across India transitioned away from messy legacy software to SchoolHub."
        />

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {[
            {
              quote: 'Before SchoolHub, reconciling fee checks and bank receipts took our accounts department two full weeks every quarter. With the Razorpay integration, 95% of parents pay via UPI directly. It revolutionized our finances.',
              author: 'Dr. Shalini Mukherjee',
              role: 'Principal, Delhi Public Academy',
              badge: '3,200 Students',
            },
            {
              quote: 'The 1-Click CBSE Starter Kit saved us weeks of initial configuration. Setting up Classes 1 to 10 with sections, subjects, and timetables happened in an afternoon. Our teachers love the 10-second period attendance.',
              author: 'Rajesh Verma',
              role: 'Director of Academics, St. Xavier\'s High',
              badge: 'CBSE Affiliated',
            },
            {
              quote: 'As a parent, having Rahul\'s homework deadlines, timetable, and report card right on my phone is amazing. Being able to pay quarterly fees via Google Pay in 20 seconds and get a verified receipt immediately is seamless.',
              author: 'Meera Nambiar',
              role: 'Parent of Class 10 Scholar',
              badge: 'Parent Portal User',
            },
          ].map((t, idx) => (
            <motion.div
              key={idx}
              custom={idx * 0.1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={idx % 2 === 0 ? slideFromLeft : slideFromRight}
              className="p-7 rounded-3xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-[13px] leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/50 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{t.author}</h5>
                  <span className="text-[11px] text-slate-500 block">{t.role}</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">
                  {t.badge}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          6. PRICING — Scale-in cards
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 sm:py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full bg-white/10 text-blue-400 border border-white/15"
            >
              Predictable Campus Investment
            </motion.span>

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: '100%', opacity: 0 }}
                whileInView={{ y: '0%', opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-3xl sm:text-5xl font-extrabold tracking-tight"
              >
                Transparent plans. Zero hidden surprises.
              </motion.h2>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-slate-400 text-sm sm:text-base leading-relaxed"
            >
              Every plan includes unlimited teachers, administrators, automated database backups, and Razorpay fee collection capability.
            </motion.p>

            {/* Monthly / Annual Toggle */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`text-xs font-bold transition-colors ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>
                Billed Monthly
              </span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className="w-14 h-7 rounded-full bg-slate-800 p-1 transition-all relative border border-slate-700 cursor-pointer"
              >
                <div className={`w-5 h-5 rounded-full bg-blue-500 transition-all ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold transition-colors ${isAnnual ? 'text-white' : 'text-slate-500'}`}>
                  Billed Annually
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Save 20%
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {(['BASIC', 'PRO', 'ENTERPRISE'] as const).map((key, idx) => {
              const plan = planInfo[key];
              const price = isAnnual ? plan.annual : plan.monthly;
              const isPopular = 'popular' in plan && plan.popular;

              return (
                <motion.div
                  key={key}
                  custom={idx * 0.1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={scalePop}
                  className={`p-8 sm:p-10 rounded-3xl flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'bg-blue-600 text-white shadow-2xl scale-[1.03] border-2 border-blue-400/60 z-20'
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
                      <p className={`text-xs mt-1.5 ${isPopular ? 'text-blue-100' : 'text-slate-400'}`}>
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
                      className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-[0.97] cursor-pointer ${
                        isPopular
                          ? 'bg-white text-blue-700 hover:bg-blue-50'
                          : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                      }`}
                    >
                      Choose {plan.name}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          7. FAQ — Accordion with smooth height animation
          ═══════════════════════════════════════════════════════════════════════ */}
      <section id="faq" className="py-24 sm:py-32 max-w-4xl mx-auto px-4 sm:px-6">
        <SectionHeading
          badge="Got Questions?"
          badgeColor="bg-slate-100 text-slate-700 border-slate-200"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about setting up SchoolHub on your campus."
        />

        <div className="space-y-3 mt-14">
          {faqs.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <motion.div
                key={idx}
                custom={idx * 0.06}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-shadow hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-[15px] text-slate-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          8. FINAL CTA BANNER
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 text-white p-10 sm:p-16 text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_50%)] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <span className="inline-block text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full bg-white/15 border border-white/20">
              Transform Your Campus Today
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to elevate your school with SchoolHub?
            </h2>
            <p className="text-blue-100 text-sm sm:text-base font-normal">
              Register in under 60 seconds. Auto-provision CBSE classes, set up fees, and invite your faculty seamlessly.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleOpenRegister('PRO')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-blue-900 font-extrabold text-sm shadow-xl hover:bg-blue-50 transition-all active:scale-[0.97] cursor-pointer"
              >
                Register Your School Now
              </button>
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all text-center"
              >
                Existing User Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          9. FOOTER
          ═══════════════════════════════════════════════════════════════════════ */}
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
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-slate-900 transition-colors">Schools</a>
            <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
            <Link to="/login" className="hover:text-slate-900 transition-colors">Sign In</Link>
          </div>

          <div className="text-slate-400">
            &copy; {new Date().getFullYear()} SchoolHub ERP. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════════
          10. REGISTRATION & CHECKOUT MODAL
          ═══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8 relative overflow-hidden text-slate-900"
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Progress */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${modalStep === 1 ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}>
                  {modalStep === 1 ? '1' : <Check className="w-4 h-4" />}
                </div>
                <div className="h-0.5 flex-1 bg-slate-200 relative">
                  <div className={`h-full bg-blue-600 transition-all duration-300 ${modalStep === 2 ? 'w-full' : 'w-0'}`} />
                </div>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${modalStep === 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                  2
                </div>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* STEP 1 */}
              {modalStep === 1 && (
                <form onSubmit={handleProceedToPayment} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Register Your School</h3>
                    <p className="text-xs text-slate-500 mt-1">Step 1 of 2: Create your school tenant and root administrator credentials.</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Official School Name *</label>
                      <input type="text" required value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} placeholder="e.g. Delhi Public Academy" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">School Code *</label>
                        <input type="text" required value={formData.schoolCode} onChange={(e) => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })} placeholder="e.g. DPA-DELHI" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Official Email *</label>
                        <input type="email" required value={formData.schoolEmail} onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })} placeholder="admin@school.edu" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                        <input type="tel" value={formData.schoolPhone} onChange={(e) => setFormData({ ...formData, schoolPhone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">Campus City</label>
                        <input type="text" value={formData.schoolAddress} onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })} placeholder="e.g. New Delhi" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Administrator Access</span>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">Admin Full Name *</label>
                          <input type="text" required value={formData.adminName} onChange={(e) => setFormData({ ...formData, adminName: e.target.value })} placeholder="Dr. Shalini Mukherjee" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Admin Email *</label>
                            <input type="email" required value={formData.adminEmail} onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })} placeholder="principal@school.edu" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Password * (Min 8)</label>
                            <input type="password" required minLength={8} value={formData.adminPassword} onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })} placeholder="••••••••" className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button type="submit" className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97]">
                      <span>Continue to Plan &amp; Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2 */}
              {modalStep === 2 && (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Subscription &amp; Checkout</h3>
                    <p className="text-xs text-slate-500 mt-1">Step 2 of 2: Review your plan and complete Razorpay digital checkout.</p>
                  </div>

                  {/* Plan Summary */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Tier</span>
                      <h4 className="text-base font-extrabold text-slate-900">{planInfo[selectedPlan].name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{planInfo[selectedPlan].students}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 block">{isAnnual ? 'Billed Annually (-20%)' : 'Billed Monthly'}</span>
                      <span className="text-2xl font-black text-blue-600">
                        ₹{(isAnnual ? planInfo[selectedPlan].annual : planInfo[selectedPlan].monthly).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Subscription Activation</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        onClick={() => setPaymentOption('PAY_NOW')}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          paymentOption === 'PAY_NOW' ? 'bg-blue-50/70 border-blue-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
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
                          paymentOption === 'TRIAL' ? 'bg-blue-50/70 border-blue-500 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
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

                  {/* Razorpay Banner */}
                  {paymentOption === 'PAY_NOW' && (
                    <div className="p-4 rounded-2xl bg-white border border-blue-200 space-y-3.5 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-xs font-bold text-slate-900">Razorpay Payment Gateway</span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 uppercase tracking-wider">Live</span>
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
                      className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.97]"
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
