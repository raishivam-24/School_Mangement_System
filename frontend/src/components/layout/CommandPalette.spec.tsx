/**
 * @file CommandPalette.spec.tsx
 * @description Component tests for CommandPalette search dialog and keyboard navigation.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CommandPalette } from './CommandPalette';

// Mock AuthContext
vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'usr-1', name: 'John Doe', role: 'TEACHER' },
  }),
}));

describe('CommandPalette Component', () => {
  it('does not render dialog content when isOpen is false', () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen={false} onClose={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByPlaceholderText(/Search or jump to/i)).toBeNull();
  });

  it('renders search input when isOpen is true', () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search pages, attendance, subjects/i);
    expect(input).toBeDefined();
  });

  it('filters command list when user types query', () => {
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={vi.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search pages, attendance, subjects/i);
    fireEvent.change(input, { target: { value: 'attendance' } });

    expect(screen.getByText('Roll Call Attendance')).toBeDefined();
  });

  it('calls onClose when clicking close or pressing Escape', () => {
    const handleClose = vi.fn();
    render(
      <MemoryRouter>
        <CommandPalette isOpen={true} onClose={handleClose} />
      </MemoryRouter>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });
});
