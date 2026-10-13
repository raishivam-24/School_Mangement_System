/**
 * @file NotificationDropdown.tsx
 * @description Senior-developer notifications bell popover with sound toggle,
 * unread badges, category filters, quick read/dismiss, and deep-link routing.
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Volume2,
  VolumeX,
  BookOpen,
  DollarSign,
  CalendarCheck,
  Megaphone,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  Trash2,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { cn } from '../../lib/utils';
import type { NotificationType } from '../../types/notification.types';

function formatTimeAgo(isoDate: string): string {
  try {
    const diffMs = Date.now() - new Date(isoDate).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;
    return new Date(isoDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

function getNotificationVisuals(type: NotificationType) {
  switch (type) {
    case 'ACADEMIC':
      return {
        icon: BookOpen,
        colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
        label: 'Academic',
      };
    case 'FEE':
      return {
        icon: DollarSign,
        colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        label: 'Fee & Billing',
      };
    case 'ATTENDANCE':
      return {
        icon: CalendarCheck,
        colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
        label: 'Attendance',
      };
    case 'ANNOUNCEMENT':
      return {
        icon: Megaphone,
        colorClass: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
        badgeClass: 'bg-violet-500/15 text-violet-400 border-violet-500/20',
        label: 'Notice',
      };
    case 'ALERT':
    case 'WARNING':
      return {
        icon: AlertTriangle,
        colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
        label: 'Urgent Alert',
      };
    case 'SUCCESS':
      return {
        icon: CheckCircle2,
        colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        label: 'Success',
      };
    default:
      return {
        icon: Info,
        colorClass: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
        label: 'Update',
      };
  }
}

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'ACADEMIC' | 'FEE' | 'ALERT'>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    soundEnabled,
    toggleSound,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filtered notifications for display
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeFilter === 'UNREAD') return !n.isRead;
      if (activeFilter === 'ACADEMIC') return n.type === 'ACADEMIC';
      if (activeFilter === 'FEE') return n.type === 'FEE';
      if (activeFilter === 'ALERT') return n.type === 'ALERT' || n.type === 'WARNING';
      return true;
    });
  }, [notifications, activeFilter]);

  const handleNotificationClick = (item: { id: string; isRead: boolean; link?: string | null }) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
    if (item.link) {
      setIsOpen(false);
      navigate(item.link);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        title="Notifications"
        aria-label="View notifications"
        aria-expanded={isOpen}
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center transition-all relative cursor-pointer',
          'bg-surface-raised border border-border text-secondary',
          'hover:bg-surface hover:text-primary hover:border-border-dark hover:shadow-sm',
          isOpen && 'border-accent-blue/50 text-accent-blue bg-surface ring-2 ring-accent-blue/20'
        )}
      >
        <Bell className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-12 text-accent-blue')} />

        {/* Dynamic Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center px-1 rounded-full bg-rose-500 text-[10px] font-black text-white shadow-sm ring-2 ring-canvas animate-in fade-in zoom-in duration-150">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2.5 w-[390px] sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl bg-surface/95 backdrop-blur-2xl border border-border shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between bg-surface-raised/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">
                        {unreadCount} new
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-muted">Stay up to date with school activities</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Sound Chime Toggle */}
                <button
                  onClick={toggleSound}
                  title={soundEnabled ? 'Mute notification sound' : 'Enable notification sound'}
                  className={cn(
                    'p-1.5 rounded-lg border text-xs transition-colors cursor-pointer',
                    soundEnabled
                      ? 'border-border text-secondary hover:text-primary hover:bg-surface'
                      : 'border-rose-500/30 text-rose-400 bg-rose-500/10'
                  )}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Mark All Read */}
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    title="Mark all as read"
                    className="flex items-center gap-1 text-[11px] font-semibold text-accent-blue hover:text-accent-blue/80 px-2 py-1 rounded-lg hover:bg-accent-blue/10 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Read all</span>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="px-3 py-2 border-b border-border/60 bg-surface/30 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              {(
                [
                  { id: 'ALL', label: 'All' },
                  { id: 'UNREAD', label: `Unread (${unreadCount})` },
                  { id: 'ACADEMIC', label: 'Academics' },
                  { id: 'FEE', label: 'Fees' },
                  { id: 'ALERT', label: 'Urgent' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all whitespace-nowrap cursor-pointer',
                    activeFilter === tab.id
                      ? 'bg-accent-blue text-white shadow-xs font-semibold'
                      : 'text-muted hover:text-primary hover:bg-surface-raised'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notifications Scroll List */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-border/40 divide-dashed">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 px-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-surface-raised border border-border flex items-center justify-center mx-auto mb-3 text-muted">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <p className="text-sm font-semibold text-primary">All caught up!</p>
                  <p className="text-xs text-muted mt-1">No notifications matching the current filter.</p>
                </div>
              ) : (
                filteredNotifications.map((item) => {
                  const visuals = getNotificationVisuals(item.type);
                  const Icon = visuals.icon;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={cn(
                        'p-3.5 transition-colors relative flex items-start gap-3 cursor-pointer group',
                        item.isRead ? 'hover:bg-surface-raised/50 opacity-80' : 'bg-accent-blue/5 hover:bg-accent-blue/10'
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-xs',
                          visuals.colorClass
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={cn('text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border', visuals.badgeClass)}>
                            {visuals.label}
                          </span>
                          <span className="text-[10px] text-muted font-medium">{formatTimeAgo(item.createdAt)}</span>
                          {!item.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-blue ml-auto shrink-0" />
                          )}
                        </div>

                        <h4 className={cn('text-xs font-bold leading-snug truncate', item.isRead ? 'text-primary' : 'text-primary font-black')}>
                          {item.title}
                        </h4>

                        <p className="text-[11px] text-muted leading-relaxed line-clamp-2 mt-0.5">
                          {item.message}
                        </p>

                        {item.link && (
                          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-accent-blue group-hover:translate-x-0.5 transition-transform">
                            <span>View details</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>

                      {/* Quick Action Buttons on hover */}
                      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!item.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(item.id);
                            }}
                            title="Mark as read"
                            className="p-1 rounded-md text-muted hover:text-accent-blue hover:bg-surface-raised transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(item.id);
                          }}
                          title="Delete notification"
                          className="p-1 rounded-md text-muted hover:text-rose-500 hover:bg-surface-raised transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-border bg-surface-raised/40 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="w-full py-2 px-3 rounded-xl bg-surface border border-border text-xs font-semibold text-primary hover:bg-surface-raised hover:border-border-dark flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>Open Notification Center</span>
                <ArrowRight className="w-3.5 h-3.5 text-accent-blue" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
