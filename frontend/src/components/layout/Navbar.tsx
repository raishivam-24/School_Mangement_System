/**
 * @file Navbar.tsx
 * @description Top navigation bar with Command Palette search, theme toggle,
 * senior-dev notification dropdown with sound chimes, and user profile.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Search, MessageSquare } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { CommandPalette } from './CommandPalette';
import { cn } from '../../lib/utils';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Cmd+K / Ctrl+K shortcut listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 bg-surface/80 backdrop-blur-xl border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
        {/* Search Input Button (Triggers Command Palette) */}
        <div
          onClick={() => setIsCommandPaletteOpen(true)}
          className={cn(
            'relative w-80 max-w-md cursor-pointer group select-none',
            'transition-all duration-150'
          )}
        >
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 group-hover:text-primary transition-colors" />
          <div
            className={cn(
              'w-full pl-10 pr-12 py-2 rounded-xl text-xs transition-all flex items-center',
              'bg-surface-raised border border-border text-muted',
              'group-hover:border-border-dark group-hover:text-primary group-hover:bg-surface'
            )}
          >
            <span>Search or jump to...</span>
            <kbd className="ml-auto pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-surface px-1.5 font-mono text-[10px] font-medium text-muted">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right side: Theme Toggle, Messages, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* In-App Messages */}
          <button
            onClick={() => navigate('/messages')}
            title="Messages"
            aria-label="View messages"
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center transition-all relative cursor-pointer',
              'bg-surface-raised border border-border text-secondary',
              'hover:bg-surface hover:text-primary hover:border-border-dark hover:shadow-sm'
            )}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-accent-blue absolute top-2 right-2 ring-2 ring-surface"></span>
          </button>

          {/* Senior-Dev Notifications Dropdown */}
          <NotificationDropdown />

          {/* Divider */}
          <div className="w-px h-8 bg-border mx-1" />

          {/* User Profile Chip */}
          <div
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 pl-1 cursor-pointer group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-primary group-hover:text-accent-blue transition-colors leading-none">
                {user?.name || 'Guest'}
              </p>
              <p className="text-xs text-muted font-medium capitalize mt-1">
                {user?.role.toLowerCase().replace('_', ' ') || 'User'}
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-blue to-accent-violet p-0.5 shadow-sm group-hover:scale-105 transition-transform">
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

      {/* Global Command Palette Search Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
};
