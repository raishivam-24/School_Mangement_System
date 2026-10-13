/**
 * @file notification.types.ts
 * @description Comprehensive TypeScript types for the Notification domain.
 */

export type NotificationType =
  | 'INFO'
  | 'SUCCESS'
  | 'WARNING'
  | 'ALERT'
  | 'ACADEMIC'
  | 'FEE'
  | 'ATTENDANCE'
  | 'ANNOUNCEMENT';

export interface NotificationItem {
  id: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export type NotificationCategory =
  | 'ALL'
  | 'UNREAD'
  | 'ACADEMIC'
  | 'FEE'
  | 'ATTENDANCE'
  | 'ANNOUNCEMENT'
  | 'ALERT';

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type?: NotificationType;
  link?: string | null;
  targetUserId?: string | null;
  targetAudience?: 'ALL' | 'TEACHERS' | 'STUDENTS' | 'PARENTS' | null;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    unreadCount: number;
  };
}

export interface NotificationPreferences {
  soundEnabled: boolean;
  browserPushEnabled: boolean;
  emailAlerts: boolean;
  smsAttendance: boolean;
}
