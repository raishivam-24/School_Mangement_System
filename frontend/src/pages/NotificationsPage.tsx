/**
 * @file NotificationsPage.tsx
 * @description Senior-developer comprehensive Notification Center & Dispatcher Page.
 * Features live date grouping, search, audio chimes, native desktop push notifications,
 * bulk actions, and teacher/admin broadcast dispatch modal.
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  Bell,
  CheckCheck,
  Volume2,
  VolumeX,
  Smartphone,
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
  Search,
  Filter,
  PlusCircle,
  Radio,
  Send,
  X,
  Sparkles,
  ShieldAlert,
  Download,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';
import type { NotificationType, NotificationCategory } from '../types/notification.types';

function formatDisplayDate(isoDate: string): string {
  try {
    const d = new Date(isoDate);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Recent';
  }
}

function getVisuals(type: NotificationType) {
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
        label: 'Announcement',
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

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    soundEnabled,
    browserPushEnabled,
    playChime,
    toggleSound,
    toggleBrowserPush,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    dispatchNotification,
  } = useNotifications();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NotificationCategory>('ALL');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dispatch Form State
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState<NotificationType>('ACADEMIC');
  const [newTarget, setNewTarget] = useState<'ALL' | 'TEACHERS' | 'STUDENTS' | 'PARENTS'>('ALL');
  const [newLink, setNewLink] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Category filter
      if (selectedCategory === 'UNREAD' && n.isRead) return false;
      if (selectedCategory === 'ACADEMIC' && n.type !== 'ACADEMIC') return false;
      if (selectedCategory === 'FEE' && n.type !== 'FEE') return false;
      if (selectedCategory === 'ATTENDANCE' && n.type !== 'ATTENDANCE') return false;
      if (selectedCategory === 'ANNOUNCEMENT' && n.type !== 'ANNOUNCEMENT') return false;
      if (selectedCategory === 'ALERT' && n.type !== 'ALERT' && n.type !== 'WARNING') return false;

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchMsg = n.message.toLowerCase().includes(q);
        if (!matchTitle && !matchMsg) return false;
      }

      return true;
    });
  }, [notifications, selectedCategory, searchQuery]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: typeof filteredNotifications } = {};
    for (const item of filteredNotifications) {
      const dateKey = formatDisplayDate(item.createdAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    }
    return groups;
  }, [filteredNotifications]);

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter((n) => !n.isRead).length,
      academics: notifications.filter((n) => n.type === 'ACADEMIC').length,
      urgent: notifications.filter((n) => n.type === 'ALERT' || n.type === 'WARNING').length,
    };
  }, [notifications]);

  // Send Test Notification
  const handleSendTest = async () => {
    await dispatchNotification({
      title: 'Real-Time Notification Chime Test 🔔',
      message: 'Synthesized Web Audio alert fired successfully. Sound channels and push indicators verified.',
      type: 'SUCCESS',
      link: '/notifications',
    });
    showToast('Test notification sent with audio chime!');
  };

  // Submit Dispatch
  const handleDispatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    setIsDispatching(true);
    try {
      await dispatchNotification({
        title: newTitle.trim(),
        message: newMessage.trim(),
        type: newType,
        targetAudience: newTarget,
        link: newLink.trim() || null,
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      setIsDispatchModalOpen(false);
      setNewTitle('');
      setNewMessage('');
      setNewLink('');
      showToast('Notification broadcast dispatched across campus!');
    } catch {
      showToast('Failed to dispatch notification.');
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-surface border border-accent-blue/30 text-primary shadow-xl text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-accent-blue" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-accent-blue/10 text-accent-blue">
              <Bell className="w-6 h-6" />
            </span>
            Notifications &amp; Campus Alerts
          </h1>
          <p className="text-sm text-muted mt-1">
            Real-time activity logs, homework assignments, online fee receipts, and school broadcast alerts.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleSendTest}
            className="px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-secondary hover:text-primary hover:bg-surface-raised transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-accent-blue" />
            <span>Test Chime</span>
          </button>

          {(user?.role === 'SCHOOL_ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'TEACHER') && (
            <button
              onClick={() => setIsDispatchModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-accent-blue text-white text-xs font-bold hover:bg-accent-blue/90 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Broadcast Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted font-medium">Total Alerts</p>
            <p className="text-xl font-bold text-primary">{stats.total}</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted font-medium">Unread Messages</p>
            <p className="text-xl font-bold text-rose-400">{stats.unread}</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted font-medium">Academic Tasks</p>
            <p className="text-xl font-bold text-primary">{stats.academics}</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border shadow-card flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted font-medium">Urgent Notices</p>
            <p className="text-xl font-bold text-primary">{stats.urgent}</p>
          </div>
        </div>
      </div>

      {/* Preferences & Channel Status Banner */}
      <div className="bg-surface rounded-2xl p-4 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-blue/10 text-accent-blue shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary">Notification Channels</h4>
            <p className="text-xs text-muted">
              Configure Web Audio synthesizer chimes and browser push notification delivery.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className={cn(
              'px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer',
              soundEnabled
                ? 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue'
                : 'bg-surface-raised border-border text-muted hover:text-primary'
            )}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Sound {soundEnabled ? 'Enabled' : 'Muted'}</span>
          </button>

          {/* Browser Push Permission Toggle */}
          <button
            onClick={toggleBrowserPush}
            className={cn(
              'px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer',
              browserPushEnabled
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-surface-raised border-border text-muted hover:text-primary'
            )}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Desktop Push: {browserPushEnabled ? 'Active' : 'Enable'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts by title or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-surface-raised border border-border text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
          />
        </div>

        {/* Bulk Action Buttons */}
        <div className="flex items-center gap-2 justify-end">
          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllAsRead();
                showToast('All notifications marked as read.');
              }}
              className="px-3 py-2 rounded-xl border border-border bg-surface-raised text-xs font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-accent-blue" />
              <span>Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(
          [
            { id: 'ALL', label: 'All Alerts' },
            { id: 'UNREAD', label: `Unread (${stats.unread})` },
            { id: 'ACADEMIC', label: 'Homework & Academics' },
            { id: 'FEE', label: 'Fee Payments' },
            { id: 'ATTENDANCE', label: 'Attendance' },
            { id: 'ANNOUNCEMENT', label: 'Circulars' },
            { id: 'ALERT', label: 'Urgent Alerts' },
          ] as const
        ).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-xl font-medium text-xs whitespace-nowrap transition-all cursor-pointer',
              selectedCategory === cat.id
                ? 'bg-accent-blue text-white shadow-xs font-semibold'
                : 'bg-surface border border-border text-secondary hover:text-primary hover:bg-surface-raised'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grouped Notifications List */}
      <div className="space-y-6">
        {Object.keys(groupedNotifications).length === 0 ? (
          <div className="py-20 text-center bg-surface rounded-3xl border border-border p-8">
            <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-border flex items-center justify-center mx-auto mb-3 text-muted">
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-primary">No Notifications Found</h3>
            <p className="text-xs text-muted mt-1 max-w-sm mx-auto">
              There are no campus alerts matching your active filter criteria. Check back later for updates.
            </p>
          </div>
        ) : (
          Object.entries(groupedNotifications).map(([dateKey, items]) => (
            <div key={dateKey} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-muted">{dateKey}</span>
                <div className="flex-1 h-px bg-border/60" />
              </div>

              <div className="space-y-2.5">
                {items.map((item) => {
                  const visuals = getVisuals(item.type);
                  const Icon = visuals.icon;

                  return (
                    <motion.div
                      layout
                      key={item.id}
                      className={cn(
                        'p-4 rounded-2xl border transition-all flex items-start gap-4 group',
                        item.isRead
                          ? 'bg-surface border-border opacity-85 hover:opacity-100 hover:border-border-dark'
                          : 'bg-surface border-accent-blue/30 shadow-xs ring-1 ring-accent-blue/10'
                      )}
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-xs',
                          visuals.colorClass
                        )}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={cn('text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border', visuals.badgeClass)}>
                            {visuals.label}
                          </span>
                          <span className="text-xs text-muted font-medium">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {!item.isRead && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-blue/15 text-accent-blue border border-accent-blue/20">
                              NEW
                            </span>
                          )}
                        </div>

                        <h3 className={cn('text-sm font-bold text-primary leading-snug', !item.isRead && 'font-black')}>
                          {item.title}
                        </h3>

                        <p className="text-xs text-muted leading-relaxed mt-1">
                          {item.message}
                        </p>

                        {item.link && (
                          <div className="mt-2.5">
                            <button
                              onClick={() => {
                                if (!item.isRead) markAsRead(item.id);
                                navigate(item.link!);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-blue hover:text-accent-blue/80 cursor-pointer"
                            >
                              <span>View Associated Record</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => markAsRead(item.id)}
                          title={item.isRead ? 'Marked as read' : 'Mark as read'}
                          className={cn(
                            'p-2 rounded-xl transition-colors cursor-pointer',
                            item.isRead
                              ? 'text-muted hover:text-primary hover:bg-surface-raised'
                              : 'text-accent-blue bg-accent-blue/10 hover:bg-accent-blue/20'
                          )}
                        >
                          <Check className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            deleteNotification(item.id);
                            showToast('Notification deleted.');
                          }}
                          title="Delete notification"
                          className="p-2 rounded-xl text-muted hover:text-rose-500 hover:bg-surface-raised transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Broadcast Modal (Teachers & Admins) */}
      <AnimatePresence>
        {isDispatchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-accent-blue/10 text-accent-blue">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-primary">Dispatch Campus Broadcast</h3>
                    <p className="text-xs text-muted">Broadcast in-app alert and sound chimes to school users.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="p-1 rounded-lg text-muted hover:text-primary hover:bg-surface-raised cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleDispatchSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
                      Alert Category
                    </label>
                    <select
                      value={newType}
                      onChange={(e) => setNewType(e.target.value as NotificationType)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
                    >
                      <option value="ACADEMIC">Academic / Homework</option>
                      <option value="FEE">Fee Notice</option>
                      <option value="ATTENDANCE">Attendance Warning</option>
                      <option value="ANNOUNCEMENT">General Circular</option>
                      <option value="ALERT">Urgent Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
                      Target Audience
                    </label>
                    <select
                      value={newTarget}
                      onChange={(e) => setNewTarget(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
                    >
                      <option value="ALL">Entire Campus (All Users)</option>
                      <option value="STUDENTS">Students &amp; Parents</option>
                      <option value="TEACHERS">Faculty &amp; Teachers Only</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
                    Alert Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Science Fair Project Submissions Due Tomorrow"
                    className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
                    Message Body
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Provide clear instructions, deadlines, or details for students and staff..."
                    className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
                    Action Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="e.g. /my-subjects or /finance or /attendance"
                    className="w-full px-3 py-2 rounded-xl bg-surface-raised border border-border text-xs text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue/30"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isDispatching}
                    className="px-5 py-2 rounded-xl bg-accent-blue text-white text-xs font-bold hover:bg-accent-blue/90 shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isDispatching ? 'Dispatching...' : 'Dispatch Broadcast'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
