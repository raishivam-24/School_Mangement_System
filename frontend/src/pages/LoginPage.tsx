/**
 * @file LoginPage.tsx
 * @description Login page with School Search Autocomplete Dropdown and 1-click Demo Account Pills.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import {
  Sparkles,
  School,
  Mail,
  Lock,
  ArrowRight,
  Search,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Users,
} from 'lucide-react';

interface SchoolItem {
  id: string;
  name: string;
  code: string;
  logoUrl?: string;
}

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // School Search Dropdown State
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<SchoolItem | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await api.get(`/schools/public${searchQuery ? `?search=${searchQuery}` : ''}`);
        if (res.data?.data) {
          setSchools(res.data.data);
        }
      } catch {
        // Ignore background fetch error
      }
    };

    fetchSchools();
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      if (user.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Quick fill helper for testing
  const quickFill = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-6 selection:bg-brand-sky-light selection:text-brand-sky-dark">
      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-brand-sky flex items-center justify-center text-white shadow-glow-sky">
          <Sparkles className="w-6 h-6" />
        </div>
        <span className="text-3xl font-black text-slate-800 tracking-tight">
          School<span className="text-brand-sky-dark">Hub</span>
        </span>
      </Link>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface p-8 sm:p-10 rounded-4xl border border-slate-100 shadow-soft space-y-6"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-400 font-medium">
            Search for your school and enter your credentials to log in.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-600">
            {error}
          </div>
        )}

        {/* 1. School Selector Dropdown (Optional / Interactive Search) */}
        <div className="relative">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Your School (Optional Search)
          </label>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-all text-xs"
          >
            <div className="flex items-center gap-2.5 truncate">
              <School className="w-4 h-4 text-slate-400 shrink-0" />
              <span className={selectedSchool ? 'font-bold text-slate-800' : 'text-slate-400'}>
                {selectedSchool ? selectedSchool.name : 'Select or search your school...'}
              </span>
            </div>
            <span className="text-slate-400 text-[10px]">▼</span>
          </div>

          {/* Autocomplete Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-slate-200 rounded-2xl shadow-xl z-20 p-2 space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search school name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1">
                {schools.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSelectedSchool(s);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-brand-sky-light hover:text-brand-sky-dark font-medium flex items-center justify-between"
                  >
                    <span className="truncate">{s.name}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono">{s.code}</span>
                  </button>
                ))}
                {schools.length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-3">No schools found</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-sky"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-brand-sky-dark text-white font-bold text-sm shadow-glow-sky hover:bg-sky-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 3. Quick Demo Pills for Instant Testing */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            ⚡ Quick Demo Fill:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => quickFill('superadmin@platform.com', 'SuperAdmin@Secure123!')}
              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-brand-sky-light text-slate-700 hover:text-brand-sky-dark font-bold text-[11px] transition-all flex items-center gap-1.5 justify-center"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-brand-sky-dark" /> Super Admin
            </button>

            <button
              type="button"
              onClick={() => quickFill('admin@dpa.edu', 'Admin@Secure123!')}
              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-brand-yellow-light text-slate-700 hover:text-brand-yellow-dark font-bold text-[11px] transition-all flex items-center gap-1.5 justify-center"
            >
              <School className="w-3.5 h-3.5 text-brand-yellow-dark" /> School Admin
            </button>

            <button
              type="button"
              onClick={() => quickFill('amit.sharma@dpa.edu', 'Teacher@Secure123!')}
              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-brand-mint-light text-slate-700 hover:text-brand-mint-dark font-bold text-[11px] transition-all flex items-center gap-1.5 justify-center"
            >
              <Users className="w-3.5 h-3.5 text-brand-mint-dark" /> Teacher
            </button>

            <button
              type="button"
              onClick={() => quickFill('rahul.sharma@dpa.edu', 'Student@Secure123!')}
              className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-brand-lilac-light text-slate-700 hover:text-brand-lilac-dark font-bold text-[11px] transition-all flex items-center gap-1.5 justify-center"
            >
              <GraduationCap className="w-3.5 h-3.5 text-brand-lilac-dark" /> Student
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 font-medium">
            Don't have a school account yet?{' '}
            <Link to="/" className="text-brand-sky-dark font-bold hover:underline">
              Register School
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
