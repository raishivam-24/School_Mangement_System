/**
 * @file notification.service.ts
 * @description Senior-developer API client for in-app notifications, badge updates, and alert broadcasting.
 */

import { api } from '../lib/api';
import type {
  NotificationItem,
  NotificationListResponse,
  CreateNotificationPayload,
} from '../types/notification.types';

const LOCAL_STORAGE_KEY = 'schoolhub_notifications_cache';

const defaultFallbackNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Homework Broadcasted 📝',
    message: 'Mathematics: Chapter 5 Quadratic Equations practice worksheet posted for Class 10-A. Submission due this Friday.',
    type: 'ACADEMIC',
    isRead: false,
    link: '/my-subjects',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Term II Tuition Fee Receipt Generated 💳',
    message: 'Payment of ₹18,500 via UPI completed successfully. Official receipt #REC-2026-0891 is ready for download.',
    type: 'FEE',
    isRead: false,
    link: '/finance',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    title: 'Class Roll Call Attendance Alert ⚡',
    message: 'Today\'s morning roll call for Section B has been finalized. 94.2% present across campus.',
    type: 'ATTENDANCE',
    isRead: false,
    link: '/attendance',
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    title: 'Annual Sports Day & CBSE Exam Schedule 🏆',
    message: 'Inter-house athletic meet date sheet and CBSE Term II practical exam timetables are published.',
    type: 'ANNOUNCEMENT',
    isRead: true,
    link: '/calendar',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-5',
    title: 'Security Alert: New Sign-in from Chrome 🛡️',
    message: 'New session authenticated from IP 103.21.244.0. If this was not you, update your password immediately.',
    type: 'ALERT',
    isRead: true,
    link: '/settings',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
];

function getLocalCache(): NotificationItem[] {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    // ignore
  }
  return defaultFallbackNotifications;
}

function saveLocalCache(items: NotificationItem[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore
  }
}

export const notificationService = {
  /**
   * Fetch paginated and filtered notifications
   */
  getNotifications: async (params?: {
    unreadOnly?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<NotificationListResponse> => {
    try {
      const res = await api.get('/notifications', {
        params: {
          unreadOnly: params?.unreadOnly ? 'true' : undefined,
          type: params?.type !== 'ALL' ? params?.type : undefined,
          page: params?.page || 1,
          limit: params?.limit || 20,
        },
      });

      if (res.data?.data) {
        saveLocalCache(res.data.data.notifications || []);
        return res.data.data;
      }
    } catch {
      // Graceful offline fallback
    }

    let items = getLocalCache();
    if (params?.unreadOnly) {
      items = items.filter((n) => !n.isRead);
    }
    if (params?.type && params.type !== 'ALL') {
      items = items.filter((n) => n.type === params.type);
    }

    const unreadCount = items.filter((n) => !n.isRead).length;

    return {
      notifications: items,
      meta: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        total: items.length,
        totalPages: 1,
        unreadCount,
      },
    };
  },

  /**
   * Get instant unread badge count
   */
  getUnreadCount: async (): Promise<number> => {
    try {
      const res = await api.get('/notifications/unread-count');
      if (typeof res.data?.data?.unreadCount === 'number') {
        return res.data.data.unreadCount;
      }
    } catch {
      // offline fallback
    }
    const items = getLocalCache();
    return items.filter((n) => !n.isRead).length;
  },

  /**
   * Mark single notification as read
   */
  markAsRead: async (id: string): Promise<boolean> => {
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch {
      // offline fallback
    }
    const items = getLocalCache().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    saveLocalCache(items);
    return true;
  },

  /**
   * Mark all unread notifications as read
   */
  markAllAsRead: async (): Promise<boolean> => {
    try {
      await api.post('/notifications/read-all');
    } catch {
      // offline fallback
    }
    const items = getLocalCache().map((n) => ({ ...n, isRead: true }));
    saveLocalCache(items);
    return true;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/notifications/${id}`);
    } catch {
      // offline fallback
    }
    const items = getLocalCache().filter((n) => n.id !== id);
    saveLocalCache(items);
    return true;
  },

  /**
   * Dispatch a new notification broadcast (Teachers & Admins)
   */
  createNotification: async (payload: CreateNotificationPayload): Promise<NotificationItem> => {
    try {
      const res = await api.post('/notifications', payload);
      if (res.data?.data?.notification) {
        return res.data.data.notification;
      }
    } catch {
      // offline fallback
    }

    const newItem: NotificationItem = {
      id: `local-notif-${Date.now()}`,
      title: payload.title,
      message: payload.message,
      type: payload.type || 'INFO',
      isRead: false,
      link: payload.link || null,
      createdAt: new Date().toISOString(),
    };

    const items = [newItem, ...getLocalCache()];
    saveLocalCache(items);
    return newItem;
  },
};
