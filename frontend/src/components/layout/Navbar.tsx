/**
 * @file Navbar.tsx
 * @description Top navigation bar with search, theme toggle, notifications, and user profile.
 * Uses CSS design tokens for automatic theme adaptation.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Search Input */}
      <div className="relative w-80 max-w-md">
        <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search..."
          className={cn(
            'w-full pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all',
            'bg-surface-raised border border-border',
            'text-primary placeholder:text-muted',
            'focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:border-accent-blue'
          )}
        />
      </div>

      {/* Right side: Theme Toggle, Actions, Profile */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Messages */}
        <button
          title="Messages"
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-all relative cursor-pointer',
            'bg-surface-raised border border-border text-secondary',
            'hover:bg-surface hover:text-primary hover:border-border-dark hover:shadow-sm'
          )}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-accent-blue absolute top-2 right-2 ring-2 ring-surface"></span>
        </button>

        {/* Notifications */}
        <button
          title="Notifications"
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center transition-all relative cursor-pointer',
            'bg-surface-raised border border-border text-secondary',
            'hover:bg-surface hover:text-primary hover:border-border-dark hover:shadow-sm'
          )}
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-accent-rose absolute top-2 right-2 ring-2 ring-surface"></span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-border mx-1" />

        {/* User Profile Chip */}
        <div className="flex items-center gap-3 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-primary leading-none">{user?.name || 'Guest'}</p>
            <p className="text-xs text-muted font-medium capitalize mt-1">
              {user?.role.toLowerCase().replace('_', ' ') || 'User'}
            </p>
          </div>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-violet p-0.5 shadow-sm">
            <img
              src={
                user?.avatarUrl ||
                `https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120`
              }
              alt="Avatar"
              className="w-full h-full rounded-[10px] object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
