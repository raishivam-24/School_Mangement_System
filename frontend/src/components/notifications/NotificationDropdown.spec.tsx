/**
 * @file NotificationDropdown.spec.tsx
 * @description Component tests for NotificationDropdown bell trigger, unread badges, and filters.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotificationDropdown } from './NotificationDropdown';

const mockNotifications = [
  {
    id: 'n-1',
    title: 'Homework Broadcast: Math Ex 5.2',
    message: 'Class 10-A worksheet has been posted.',
    type: 'ACADEMIC' as const,
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n-2',
    title: 'Term Fee Received',
    message: 'Receipt #REC-2026-901 confirmed.',
    type: 'FEE' as const,
    isRead: true,
    createdAt: new Date().toISOString(),
  },
];

vi.mock('../../context/NotificationContext', () => ({
  useNotifications: () => ({
    notifications: mockNotifications,
    unreadCount: 1,
    soundEnabled: true,
    toggleSound: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    deleteNotification: vi.fn(),
  }),
}));

describe('NotificationDropdown Component', () => {
  it('renders notification bell button with unread badge counter', () => {
    render(
      <MemoryRouter>
        <NotificationDropdown />
      </MemoryRouter>
    );

    const bellButton = screen.getByRole('button', { name: /View notifications/i });
    expect(bellButton).toBeDefined();

    // Verify unread badge shows '1'
    const badge = screen.getByText('1');
    expect(badge).toBeDefined();
  });

  it('toggles dropdown popover on click and renders notifications list', () => {
    render(
      <MemoryRouter>
        <NotificationDropdown />
      </MemoryRouter>
    );

    const bellButton = screen.getByRole('button', { name: /View notifications/i });
    fireEvent.click(bellButton);

    // Dropdown header & items should now be visible
    expect(screen.getByText('Notifications')).toBeDefined();
    expect(screen.getByText('Homework Broadcast: Math Ex 5.2')).toBeDefined();
    expect(screen.getByText('Term Fee Received')).toBeDefined();
  });

  it('renders category filter tabs in dropdown', () => {
    render(
      <MemoryRouter>
        <NotificationDropdown />
      </MemoryRouter>
    );

    const bellButton = screen.getByRole('button', { name: /View notifications/i });
    fireEvent.click(bellButton);

    expect(screen.getByText('All')).toBeDefined();
    expect(screen.getByText('Unread (1)')).toBeDefined();
    expect(screen.getByText('Academics')).toBeDefined();
    expect(screen.getByText('Fees')).toBeDefined();
  });
});
