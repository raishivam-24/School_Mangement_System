/**
 * @file NotificationContext.tsx
 * @description Senior-developer real-time notification engine with synthesized audio chimes,
 * unread counter management, browser desktop push notifications, and global state sync.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from '../services/notification.service';
import type {
  NotificationItem,
  CreateNotificationPayload,
} from '../types/notification.types';
import { useUIStore } from '../store/useUIStore';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  soundEnabled: boolean;
  browserPushEnabled: boolean;
  playChime: () => void;
  toggleSound: () => void;
  toggleBrowserPush: () => Promise<boolean>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  dispatchNotification: (payload: CreateNotificationPayload) => Promise<NotificationItem>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

/**
 * Synthesizes a clean 2-tone chime using Web Audio API (zero external mp3 assets needed)
 */
function playWebAudioChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.08, now);
    masterGain.connect(ctx.destination);

    // Tone 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.connect(masterGain);

    // Tone 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.08);
    osc2.connect(masterGain);

    // Volume envelope
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc1.start(now);
    osc1.stop(now + 0.08);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.35);

    setTimeout(() => {
      ctx.close().catch(() => {});
    }, 500);
  } catch {
    // AudioContext blocked or not allowed
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCountState] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('schoolhub_sound_enabled') !== 'false';
  });
  const [browserPushEnabled, setBrowserPushEnabled] = useState<boolean>(() => {
    return typeof Notification !== 'undefined' && Notification.permission === 'granted';
  });

  const isInitialMount = useRef(true);
  const setStoreUnread = useUIStore((state) => state.setUnreadCount);

  // Play chime helper
  const playChime = useCallback(() => {
    if (soundEnabled) {
      playWebAudioChime();
    }
  }, [soundEnabled]);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('schoolhub_sound_enabled', String(next));
      if (next) playWebAudioChime();
      return next;
    });
  }, []);

  // Request browser desktop notification permission
  const toggleBrowserPush = useCallback(async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') return false;

    if (Notification.permission === 'granted') {
      setBrowserPushEnabled(false);
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setBrowserPushEnabled(granted);
      if (granted) {
        new Notification('SchoolHub Notifications Enabled 🔔', {
          body: 'You will receive real-time alerts for homework, exam schedules, and attendance updates.',
          icon: '/favicon.ico',
        });
      }
      return granted;
    } catch {
      return false;
    }
  }, []);

  // Sync state & UI store
  const updateUnreadState = useCallback(
    (count: number) => {
      setUnreadCountState(count);
      setStoreUnread(count);
    },
    [setStoreUnread]
  );

  // Refresh notifications list from server/cache
  const refreshNotifications = useCallback(async () => {
    try {
      const res = await notificationService.getNotifications({ limit: 30 });
      setNotifications(res.notifications);
      const count = res.meta.unreadCount;

      // If new unread item arrived after mount, play chime
      if (!isInitialMount.current && count > unreadCount) {
        playChime();
      }

      updateUnreadState(count);
    } catch {
      // ignore
    } finally {
      setLoading(false);
      isInitialMount.current = false;
    }
  }, [playChime, unreadCount, updateUnreadState]);

  // Initial load + periodic polling (every 40 seconds)
  useEffect(() => {
    refreshNotifications();

    const interval = setInterval(() => {
      refreshNotifications();
    }, 40000);

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  // Mark single as read
  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      updateUnreadState(Math.max(0, unreadCount - 1));
      await notificationService.markAsRead(id);
    },
    [unreadCount, updateUnreadState]
  );

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    updateUnreadState(0);
    await notificationService.markAllAsRead();
  }, [updateUnreadState]);

  // Delete notification
  const deleteNotification = useCallback(
    async (id: string) => {
      const target = notifications.find((n) => n.id === id);
      const wasUnread = target ? !target.isRead : false;

      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (wasUnread) {
        updateUnreadState(Math.max(0, unreadCount - 1));
      }
      await notificationService.deleteNotification(id);
    },
    [notifications, unreadCount, updateUnreadState]
  );

  // Dispatch / broadcast notification
  const dispatchNotification = useCallback(
    async (payload: CreateNotificationPayload) => {
      const created = await notificationService.createNotification(payload);
      setNotifications((prev) => [created, ...prev]);
      updateUnreadState(unreadCount + 1);

      // Play feedback chime
      playChime();

      // Show native OS notification if permission granted
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification(payload.title, {
            body: payload.message,
            icon: '/favicon.ico',
          });
        } catch {
          // ignore
        }
      }

      return created;
    },
    [playChime, unreadCount, updateUnreadState]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        soundEnabled,
        browserPushEnabled,
        playChime,
        toggleSound,
        toggleBrowserPush,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        dispatchNotification,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
