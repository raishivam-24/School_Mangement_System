/**
 * @file Sidebar.tsx
 * @description Production dark sidebar with theme-aware active states, glow effects,
 * and role-based navigation. Uses CSS design tokens for automatic theme adaptation.
 */

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
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
        { name: 'Students', to: '/students', icon: Users },
        { name: 'Attendance', to: '/attendance', icon: CalendarCheck },
        { name: 'Timetable', to: '/timetable', icon: Clock },
        { name: 'Finance', to: '/finance', icon: DollarSign },
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
        { name: 'Finance', to: '/finance', icon: DollarSign },
        { name: 'Notice', to: '/announcements', icon: Bell },
        { name: 'Calendar', to: '/calendar', icon: Calendar },
      ];
    }

    // SCHOOL_ADMIN (default)
    return [
      { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { name: 'Students', to: '/students', icon: Users },
      { name: 'Teachers', to: '/teachers', icon: GraduationCap },
      { name: 'Academics', to: '/academics', icon: BookOpen },
      { name: 'Attendance', to: '/attendance', icon: CalendarCheck },
      { name: 'Finance', to: '/finance', icon: DollarSign },
      { name: 'Timetable', to: '/timetable', icon: Clock },
      { name: 'Notice', to: '/announcements', icon: Bell },
      { name: 'Calendar', to: '/calendar', icon: Calendar },
      { name: 'Library', to: '/library', icon: BookOpen },
      { name: 'Message', to: '/messages', icon: MessageSquare },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-sidebar flex flex-col h-screen py-5 px-3 shrink-0 border-r border-border transition-colors duration-200">
      <div className="flex-1 overflow-y-auto space-y-6 pr-0.5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-blue flex items-center justify-center text-white shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-primary tracking-tight flex items-center gap-1.5">
              School<span className="text-accent-blue">Hub</span>
            </h1>
            {user?.school && (
              <p className="text-[11px] text-muted font-medium truncate">
                {user.school.name}
              </p>
            )}
          </div>
        </div>

        {/* Section: MENU */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase px-3 mb-2">
            MENU
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 cursor-pointer group',
                    isActive
                      ? 'bg-accent-blue/10 text-accent-blue font-semibold shadow-xs'
                      : 'text-secondary hover:text-primary hover:bg-sidebar-hover'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        'w-[18px] h-[18px] transition-colors',
                        isActive ? 'text-accent-blue' : 'text-muted group-hover:text-primary'
                      )}
                    />
                    <span>{item.name}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-blue" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Section: OTHER */}
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] text-muted uppercase px-3 mb-2">
            OTHER
          </p>
          <div className="space-y-0.5">
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer group',
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue font-semibold shadow-xs'
                    : 'text-secondary hover:text-primary hover:bg-sidebar-hover'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <User className={cn('w-[18px] h-[18px]', isActive ? 'text-accent-blue' : 'text-muted group-hover:text-primary')} />
                  <span>Profile</span>
                </>
              )}
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all cursor-pointer group',
                  isActive
                    ? 'bg-accent-blue/10 text-accent-blue font-semibold shadow-xs'
                    : 'text-secondary hover:text-primary hover:bg-sidebar-hover'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Settings className={cn('w-[18px] h-[18px]', isActive ? 'text-accent-blue' : 'text-muted group-hover:text-primary')} />
                  <span>Settings</span>
                </>
              )}
            </NavLink>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all text-left cursor-pointer group"
            >
              <LogOut className="w-[18px] h-[18px] text-muted group-hover:text-red-500" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Card at Bottom — always anchored at bottom of screen, no page scrolling needed */}
      {user && (
        <div className="pt-3 border-t border-border mt-auto shrink-0">
          <div className="p-3 rounded-xl bg-surface-raised border border-border flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent-violet/15 text-accent-violet flex items-center justify-center font-bold text-sm ring-1 ring-accent-violet/30 shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-semibold text-primary truncate leading-tight">{user.name}</p>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-blue/10 text-accent-blue mt-1">
                {user.role.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
