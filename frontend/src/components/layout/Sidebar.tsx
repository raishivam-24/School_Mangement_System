/**
 * @file Sidebar.tsx
 * @description Dynamic, Role-Aware Left Sidebar with soft pastel pill active states and Lucide icons.
 * Matches the reference design with Menu & Other sections.
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  DollarSign,
  Bell,
  Calendar,
  BookOpen,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Building2,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  name: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Define dynamic menu items based on Role
  const getNavItems = (): NavItem[] => {
    if (!user) return [];

    if (user.role === 'SUPER_ADMIN') {
      return [
        { name: 'Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Schools', to: '/admin/schools', icon: Building2 },
        { name: 'Subscriptions', to: '/admin/subscriptions', icon: DollarSign },
        { name: 'Reports', to: '/reports', icon: FileText },
      ];
    }

    if (user.role === 'TEACHER') {
      return [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { name: 'My Classes', to: '/academics', icon: BookOpen },
        { name: 'Students', to: '/students', icon: GraduationCap },
        { name: 'Attendance', to: '/attendance', icon: CalendarCheck },
        { name: 'Timetable', to: '/timetable', icon: Clock },
        { name: 'Notice', to: '/announcements', icon: Bell },
        { name: 'Calendar', to: '/calendar', icon: Calendar },
      ];
    }

    if (user.role === 'STUDENT') {
      return [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { name: 'My Subjects', to: '/my-subjects', icon: BookOpen },
        { name: 'Timetable', to: '/timetable', icon: Clock },
        { name: 'Attendance', to: '/attendance', icon: CalendarCheck },
        { name: 'Fees & Invoices', to: '/finance', icon: DollarSign },
        { name: 'Notice', to: '/announcements', icon: Bell },
        { name: 'Calendar', to: '/calendar', icon: Calendar },
      ];
    }

    if (user.role === 'PARENT') {
      return [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { name: 'Child Subjects', to: '/my-subjects', icon: BookOpen },
        { name: 'Timetable', to: '/timetable', icon: Clock },
        { name: 'Attendance', to: '/attendance', icon: CalendarCheck },
        { name: 'Fees & Invoices', to: '/finance', icon: DollarSign },
        { name: 'Notice', to: '/announcements', icon: Bell },
        { name: 'Calendar', to: '/calendar', icon: Calendar },
      ];
    }

    // Default: SCHOOL_ADMIN
    return [
      { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { name: 'Teachers', to: '/teachers', icon: Users },
      { name: 'Students', to: '/students', icon: GraduationCap },
      { name: 'Attendance', to: '/attendance', icon: CalendarCheck },
      { name: 'Finance', to: '/finance', icon: DollarSign },
      { name: 'Notice', to: '/announcements', icon: Bell },
      { name: 'Calendar', to: '/calendar', icon: Calendar },
      { name: 'Library', to: '/library', icon: BookOpen },
      { name: 'Message', to: '/messages', icon: MessageSquare },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-surface border-r border-slate-100 flex flex-col justify-between py-6 px-4 shrink-0 min-h-screen">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-sky flex items-center justify-center text-white shadow-glow-sky">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              School<span className="text-brand-sky-dark">Hub</span>
            </h1>
            {user?.school && (
              <p className="text-xs text-slate-400 font-medium truncate max-w-[130px]">
                {user.school.name}
              </p>
            )}
          </div>
        </div>

        {/* Section: MENU */}
        <div className="mb-6">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-3">
            MENU
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-brand-sky-light text-brand-sky-dark font-semibold shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Section: OTHER */}
        <div>
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 mb-3">
            OTHER
          </p>
          <div className="space-y-1">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-sky-light text-brand-sky-dark font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-brand-sky-light text-brand-sky-dark font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`
              }
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-medium text-sm text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all text-left cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Pill at Bottom */}
      {user && (
        <div className="mt-6 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-lilac-light text-brand-lilac-dark flex items-center justify-center font-bold text-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-sky-light text-brand-sky-dark">
              {user.role.replace('_', ' ')}
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
