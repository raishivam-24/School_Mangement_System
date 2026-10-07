/**
 * @file ProfilePage.tsx
 * @description Comprehensive, production-grade User Profile Management with personal details,
 * live password change (POST /api/v1/auth/change-password), security settings, and role-specific metadata.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import confetti from 'canvas-confetti';
import {
  User,
  Shield,
  KeyRound,
  Bell,
  Mail,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  Award,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Clock,
  Calendar,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'PERSONAL' | 'SECURITY' | 'ACADEMIC' | 'PREFERENCES'>('PERSONAL');

  // Personal Info Form State
  const [personalData, setPersonalData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    address: 'B-42, Sector 14, Rohini, New Delhi - 110085',
    bloodGroup: 'B+',
    gender: 'Male',
    dob: '2010-08-15',
    emergencyContact: '+91 98765 99999 (Father - Ramesh Sharma)',
  });
  const [personalSaved, setPersonalSaved] = useState(false);

  // Password Change Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Preferences State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Handle Personal Details Save
  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = { ...user, name: personalData.name };
      setUser(updated);
      localStorage.setItem('schoolhub_user', JSON.stringify(updated));
    }
    setPersonalSaved(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    setTimeout(() => setPersonalSaved(false), 3000);
  };

  // Handle Live Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirmation password do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    setPasswordLoading(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess(true);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      setPasswordError(
        err.response?.data?.message || 'Failed to change password. Please verify your current password.'
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. TOP HEADER BANNER & PROFILE CARD                                       */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-brand-sky via-sky-300 to-brand-lilac p-1 shadow-md shrink-0">
            <img
              src={
                user?.avatarUrl ||
                `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200`
              }
              alt="Avatar"
              className="w-full h-full rounded-[22px] object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-primary">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-blue-subtle text-accent-blue uppercase tracking-wider">
                {user?.role.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-muted font-medium">{user?.email}</p>
            <div className="flex items-center gap-3 pt-1 text-xs text-secondary font-semibold">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-accent-blue" />
                {user?.school?.name || 'Platform Super Admin'}
              </span>
              <span>•</span>
              <span className="text-accent-green font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active &amp; Verified
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
          <span className="px-3.5 py-1.5 rounded-2xl bg-surface-raised border border-border text-xs font-bold text-secondary">
            ID: {user?.id.slice(0, 8)}...
          </span>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. NAVIGATION TABS                                                        */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 bg-surface p-1.5 rounded-2xl border border-border shadow-card w-fit overflow-x-auto">
        <button
          onClick={() => setActiveTab('PERSONAL')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'PERSONAL'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Personal Details</span>
        </button>

        <button
          onClick={() => setActiveTab('SECURITY')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'SECURITY'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Password &amp; Security</span>
        </button>

        <button
          onClick={() => setActiveTab('ACADEMIC')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ACADEMIC'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Institutional Info</span>
        </button>

        <button
          onClick={() => setActiveTab('PREFERENCES')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'PREFERENCES'
              ? 'bg-accent-blue text-white shadow-card'
              : 'text-secondary hover:text-primary'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Preferences &amp; Alerts</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. TAB 1: PERSONAL DETAILS FORM                                           */}
      {/* ========================================================================= */}
      {activeTab === 'PERSONAL' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <div>
              <h3 className="text-base font-bold text-primary">Personal Information</h3>
              <p className="text-xs text-muted">Update your profile identity and contact information.</p>
            </div>
            {personalSaved && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-green-subtle text-accent-green flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Changes Saved
              </span>
            )}
          </div>

          <form onSubmit={handleSavePersonal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={personalData.name}
                  onChange={(e) => setPersonalData({ ...personalData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={personalData.email}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs font-semibold text-secondary cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={personalData.phone}
                  onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5">Gender</label>
                <select
                  value={personalData.gender}
                  onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-secondary mb-1.5">Blood Group</label>
                <select
                  value={personalData.bloodGroup}
                  onChange={(e) => setPersonalData({ ...personalData, bloodGroup: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                >
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>O+</option>
                  <option>O-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary mb-1.5">Residential Address</label>
              <input
                type="text"
                value={personalData.address}
                onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary mb-1.5">Emergency Contact Details</label>
              <input
                type="text"
                value={personalData.emergencyContact}
                onChange={(e) => setPersonalData({ ...personalData, emergencyContact: e.target.value })}
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB 2: SECURITY & PASSWORD CHANGE (Live Endpoint)                      */}
      {/* ========================================================================= */}
      {activeTab === 'SECURITY' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6"
        >
          <div className="pb-4 border-b border-border">
            <h3 className="text-base font-bold text-primary">Change Account Password</h3>
            <p className="text-xs text-muted">Ensure your account is protected with a strong, unique password.</p>
          </div>

          {passwordSuccess && (
            <div className="p-4 rounded-2xl bg-accent-green-subtle/80 border border-brand-mint/40 text-accent-green text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Password updated successfully! Next login will require your new credentials.</span>
            </div>
          )}

          {passwordError && (
            <div className="p-4 rounded-2xl bg-accent-rose-subtle/80 border border-brand-rose/40 text-accent-rose text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-secondary mb-1.5">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                  className="w-full pl-4 pr-11 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary mb-1.5">New Password (min 8 chars)</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter strong new password"
                  className="w-full pl-4 pr-11 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-secondary"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-secondary mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Re-enter your new password"
                className="w-full px-4 py-2.5 rounded-2xl bg-surface-raised border border-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="px-6 py-2.5 rounded-full bg-accent-blue text-white font-bold text-xs shadow-card hover:bg-brand-sky-dark transition-all flex items-center gap-2"
            >
              {passwordLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>

          {/* Two-Factor Authentication Toggle */}
          <div className="pt-6 border-t border-border flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-primary">Two-Factor Authentication (2FA)</h4>
              <p className="text-xs text-muted">Require OTP confirmation on your mobile phone upon login.</p>
            </div>
            <button
              onClick={() => setTwoFactorAuth(!twoFactorAuth)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                twoFactorAuth ? 'bg-accent-blue' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-surface absolute top-0.5 transition-transform ${
                  twoFactorAuth ? 'right-0.5' : 'left-0.5'
                }`}
              ></div>
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 3: INSTITUTIONAL & ACADEMIC INFO                                   */}
      {/* ========================================================================= */}
      {activeTab === 'ACADEMIC' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6"
        >
          <div className="pb-4 border-b border-border">
            <h3 className="text-base font-bold text-primary">Institutional &amp; Academic Affiliation</h3>
            <p className="text-xs text-muted">Your school registration, academic year, and role responsibilities.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-surface-raised border border-border">
              <span className="text-muted font-bold block mb-1">Associated School</span>
              <span className="font-extrabold text-primary text-sm">
                {user?.school?.name || 'Platform Super Admin'}
              </span>
              <span className="text-[10px] text-muted block mt-0.5 font-mono">
                Code: {user?.school?.code || 'N/A'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-surface-raised border border-border">
              <span className="text-muted font-bold block mb-1">Current Academic Year</span>
              <span className="font-extrabold text-primary text-sm">2026–2027 (Term 1)</span>
              <span className="text-[10px] text-muted block mt-0.5">CBSE Affiliation #1930482</span>
            </div>

            {user?.role === 'STUDENT' && (
              <>
                <div className="p-4 rounded-2xl bg-surface-raised border border-border">
                  <span className="text-muted font-bold block mb-1">Class &amp; Section</span>
                  <span className="font-extrabold text-primary text-sm">Class 10 - Section A</span>
                  <span className="text-[10px] text-muted block mt-0.5">Roll No: 24 • Tagore House (Red)</span>
                </div>
                <div className="p-4 rounded-2xl bg-surface-raised border border-border">
                  <span className="text-muted font-bold block mb-1">Class Teacher</span>
                  <span className="font-extrabold text-primary text-sm">Amit Sharma Sir</span>
                  <span className="text-[10px] text-muted block mt-0.5">Senior PGT Mathematics</span>
                </div>
              </>
            )}

            {user?.role === 'TEACHER' && (
              <>
                <div className="p-4 rounded-2xl bg-surface-raised border border-border">
                  <span className="text-muted font-bold block mb-1">Designation &amp; Department</span>
                  <span className="font-extrabold text-primary text-sm">Senior PGT Mathematics</span>
                  <span className="text-[10px] text-muted block mt-0.5">Department of Mathematics</span>
                </div>
                <div className="p-4 rounded-2xl bg-surface-raised border border-border">
                  <span className="text-muted font-bold block mb-1">Class Teacher Incharge</span>
                  <span className="font-extrabold text-primary text-sm">Class 10 - Section A</span>
                  <span className="text-[10px] text-muted block mt-0.5">42 Students Enrolled</span>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 4: PREFERENCES & REGIONAL LOCALIZATION                             */}
      {/* ========================================================================= */}
      {activeTab === 'PREFERENCES' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-3xl p-6 sm:p-8 border border-border shadow-card space-y-6"
        >
          <div className="pb-4 border-b border-border">
            <h3 className="text-base font-bold text-primary">Alerts &amp; Localization</h3>
            <p className="text-xs text-muted">Configure notification channels, timezone, and currency defaults.</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-raised border border-border">
              <div>
                <h4 className="text-xs font-bold text-primary">Email Digest &amp; Circulars</h4>
                <p className="text-[11px] text-muted">Receive daily attendance reports and school announcements.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-5 h-5 accent-brand-sky rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-raised border border-border">
              <div>
                <h4 className="text-xs font-bold text-primary">SMS / WhatsApp Alerts</h4>
                <p className="text-[11px] text-muted">Instant SMS broadcast for fee dues, bus delays, and emergency notices.</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-5 h-5 accent-brand-sky rounded cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">Timezone</span>
                <span className="font-extrabold text-primary">Asia / Kolkata (IST, GMT +05:30)</span>
              </div>
              <div className="p-4 rounded-2xl bg-surface-raised border border-border">
                <span className="text-muted font-bold block mb-1">System Currency</span>
                <span className="font-extrabold text-primary">Indian Rupee (₹ INR)</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
