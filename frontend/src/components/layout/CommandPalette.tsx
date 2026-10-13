/**
 * @file CommandPalette.tsx
 * @description Senior-developer interactive Command Palette & Global Search Modal.
 * Activated via keyboard shortcut (Cmd+K / Ctrl+K) or clicking the Navbar Search bar.
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarCheck,
  DollarSign,
  Bell,
  Clock,
  Award,
  BookOpen,
  MessageSquare,
  FileText,
  Settings,
  User,
  PlusCircle,
  Radio,
  X,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'Navigation' | 'Quick Actions' | 'Academic & Records';
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
  action?: () => void;
  keywords?: string[];
}

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Define searchable commands
  const commands: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      {
        id: 'nav-dashboard',
        title: 'Dashboard Overview',
        subtitle: 'Key metrics, charts, and activity summaries',
        category: 'Navigation',
        icon: LayoutDashboard,
        to: '/dashboard',
        keywords: ['home', 'stats', 'analytics', 'kpi'],
      },
      {
        id: 'nav-notifications',
        title: 'Notifications Center',
        subtitle: 'All in-app alerts, circulars, and system warnings',
        category: 'Navigation',
        icon: Bell,
        to: '/notifications',
        keywords: ['alerts', 'bell', 'messages', 'broadcast'],
      },
      {
        id: 'nav-attendance',
        title: 'Roll Call Attendance',
        subtitle: 'Daily student attendance ledger and absence tracking',
        category: 'Academic & Records',
        icon: CalendarCheck,
        to: '/attendance',
        keywords: ['absent', 'present', 'roll call', 'tracking'],
      },
      {
        id: 'nav-subjects',
        title: 'My Subjects & Classroom',
        subtitle: 'Digital worksheets, study notes, and syllabus progress',
        category: 'Academic & Records',
        icon: BookOpen,
        to: '/my-subjects',
        keywords: ['homework', 'notes', 'curriculum', 'files'],
      },
      {
        id: 'nav-students',
        title: 'Student Directory',
        subtitle: 'Admissions, profiles, parent contacts, and roll numbers',
        category: 'Navigation',
        icon: Users,
        to: '/students',
        keywords: ['directory', 'profiles', 'enrollment'],
      },
      {
        id: 'nav-teachers',
        title: 'Faculty & Teachers',
        subtitle: 'Staff listings, departments, and class allocations',
        category: 'Navigation',
        icon: GraduationCap,
        to: '/teachers',
        keywords: ['faculty', 'staff', 'instructors'],
      },
      {
        id: 'nav-finance',
        title: 'Fee Collection & Invoices',
        subtitle: 'Student fee receipts, pending dues, and online UPI payments',
        category: 'Academic & Records',
        icon: DollarSign,
        to: '/finance',
        keywords: ['fee', 'money', 'billing', 'receipt', 'upi'],
      },
      {
        id: 'nav-exams',
        title: 'Exams & Date Sheets',
        subtitle: 'CBSE examination schedules, grading scales, and marks entry',
        category: 'Academic & Records',
        icon: Award,
        to: '/exams',
        keywords: ['test', 'marks', 'grading', 'report card', 'cbse'],
      },
      {
        id: 'nav-timetable',
        title: 'Class Timetable',
        subtitle: 'Weekly schedule grid, periods, and room allocations',
        category: 'Academic & Records',
        icon: Clock,
        to: '/timetable',
        keywords: ['schedule', 'periods', 'routine'],
      },
      {
        id: 'nav-announcements',
        title: 'School Notice Board',
        subtitle: 'Circulars, press releases, and campus announcements',
        category: 'Navigation',
        icon: Radio,
        to: '/announcements',
        keywords: ['circular', 'notice', 'news', 'press'],
      },
      {
        id: 'nav-library',
        title: 'Campus Library Catalog',
        subtitle: 'Search books, issue records, and author directories',
        category: 'Academic & Records',
        icon: BookOpen,
        to: '/library',
        keywords: ['books', 'isbn', 'catalog', 'borrow'],
      },
      {
        id: 'nav-messages',
        title: 'In-App Messages',
        subtitle: 'Teacher-parent communication and staff chat',
        category: 'Navigation',
        icon: MessageSquare,
        to: '/messages',
        keywords: ['chat', 'inbox', 'conversation'],
      },
      {
        id: 'nav-reports',
        title: 'Institutional Reports',
        subtitle: 'Export CSV attendance registers and fee collection ledgers',
        category: 'Navigation',
        icon: FileText,
        to: '/reports',
        keywords: ['csv', 'export', 'download', 'audit'],
      },
      {
        id: 'nav-settings',
        title: 'Platform Settings',
        subtitle: 'Dark mode theme, 2FA security, and notification channels',
        category: 'Navigation',
        icon: Settings,
        to: '/settings',
        keywords: ['theme', 'dark mode', 'password', 'security'],
      },
      {
        id: 'nav-profile',
        title: 'My User Profile',
        subtitle: 'Contact details, avatar, and account role information',
        category: 'Navigation',
        icon: User,
        to: '/profile',
        keywords: ['account', 'user', 'me'],
      },
    ];

    // Quick action shortcuts
    list.unshift(
      {
        id: 'act-broadcast',
        title: 'Broadcast Announcement / Alert',
        subtitle: 'Send instant notice or push alert to whole school',
        category: 'Quick Actions',
        icon: PlusCircle,
        to: '/notifications',
        keywords: ['send', 'alert', 'push', 'broadcast', 'urgent'],
      },
      {
        id: 'act-attendance',
        title: 'Take Class Roll Call',
        subtitle: 'Quickly mark present and absent students for today',
        category: 'Quick Actions',
        icon: CalendarCheck,
        to: '/attendance',
        keywords: ['roll call', 'mark', 'present'],
      }
    );

    return list;
  }, []);

  // Filter commands by query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter((cmd) => {
      const matchTitle = cmd.title.toLowerCase().includes(q);
      const matchSub = cmd.subtitle?.toLowerCase().includes(q);
      const matchKeywords = cmd.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchSub || matchKeywords;
    });
  }, [commands, query]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          executeCommand(filteredCommands[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  const executeCommand = (cmd: CommandItem) => {
    onClose();
    if (cmd.action) {
      cmd.action();
    } else if (cmd.to) {
      navigate(cmd.to);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md">
          {/* Backdrop click dismiss */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Palette Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="relative w-full max-w-2xl bg-surface/95 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]"
          >
            {/* Search Input Bar */}
            <div className="p-4 border-b border-border flex items-center gap-3 bg-surface-raised/40">
              <Search className="w-5 h-5 text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Search pages, attendance, subjects, fees, or quick actions..."
                className="w-full bg-transparent text-sm text-primary placeholder:text-muted focus:outline-none"
              />
              {query ? (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 rounded-md text-muted hover:text-primary transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold text-muted bg-surface-raised border border-border rounded">
                  ESC
                </kbd>
              )}
            </div>

            {/* Results List */}
            <div className="overflow-y-auto max-h-[460px] p-2 space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="py-12 text-center text-muted">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold">No results found for "{query}"</p>
                  <p className="text-xs mt-1">Try searching for "attendance", "exams", "fees", or "homework".</p>
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <div
                      key={cmd.id}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={cn(
                        'flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer group',
                        isSelected
                          ? 'bg-accent-blue text-white shadow-xs'
                          : 'text-primary hover:bg-surface-raised'
                      )}
                    >
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors',
                          isSelected
                            ? 'bg-white/20 border-white/30 text-white'
                            : 'bg-surface-raised border-border text-muted group-hover:text-primary'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn('text-sm font-bold truncate leading-tight', isSelected ? 'text-white' : 'text-primary')}>
                            {cmd.title}
                          </p>
                          <span
                            className={cn(
                              'text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0',
                              isSelected
                                ? 'bg-white/20 text-white border-white/20'
                                : 'bg-surface text-muted border-border'
                            )}
                          >
                            {cmd.category}
                          </span>
                        </div>
                        {cmd.subtitle && (
                          <p className={cn('text-xs truncate mt-0.5', isSelected ? 'text-white/80' : 'text-muted')}>
                            {cmd.subtitle}
                          </p>
                        )}
                      </div>

                      <ArrowRight
                        className={cn(
                          'w-4 h-4 shrink-0 transition-transform',
                          isSelected ? 'text-white translate-x-1' : 'text-muted opacity-0 group-hover:opacity-100'
                        )}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2.5 border-t border-border bg-surface-raised/40 flex items-center justify-between text-[11px] text-muted">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">↓</kbd> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-surface border border-border rounded text-[10px]">↵</kbd> to select
                </span>
              </div>
              <span className="flex items-center gap-1 font-semibold text-accent-blue">
                <Sparkles className="w-3 h-3" /> SchoolHub Quick Command
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
