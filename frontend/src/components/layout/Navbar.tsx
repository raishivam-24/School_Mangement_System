/**
 * @file Navbar.tsx
 * @description Top Header Navigation Bar with rounded search pill, quick action buttons, and user profile badge.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, MessageSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-surface/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search Input Pill */}
      <div className="relative w-80 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-full text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-sky/30 focus:border-brand-sky transition-all"
        />
      </div>

      {/* Quick Action Icons & Profile Badge */}
      <div className="flex items-center gap-4">
        {/* Messages */}
        <button
          title="Messages"
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all relative"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-sky absolute top-2.5 right-2.5"></span>
        </button>

        {/* Notifications */}
        <button
          title="Notifications"
          className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all relative"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-brand-rose absolute top-2.5 right-2.5"></span>
        </button>

        {/* User Profile Info Chip */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">{user?.name || 'Guest'}</p>
            <p className="text-xs text-slate-400 font-medium capitalize mt-1">
              {user?.role.toLowerCase().replace('_', ' ') || 'User'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-sky to-brand-lilac p-0.5 shadow-sm">
            <img
              src={
                user?.avatarUrl ||
                `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120`
              }
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
