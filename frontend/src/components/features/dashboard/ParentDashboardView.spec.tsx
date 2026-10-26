import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { ParentDashboardView } from './ParentDashboardView';

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock('../../../lib/api', () => ({
  api: {
    get: mockGet,
  },
}));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}));

const mockChildren = [
  {
    id: 'student-1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    admissionNo: 'ADM-001',
    status: 'ACTIVE',
  },
];

const mockDashboard = {
  student: mockChildren[0],
  enrollment: {
    class: { name: '10' },
    section: { name: 'A' },
  },
  attendance: {
    todayStatus: 'PRESENT',
    todayReason: null,
    presentDays: 88,
    totalDays: 100,
    percentage: 88,
    meets75PercentThreshold: true,
  },
  fees: {
    outstandingDues: 14500,
    unpaidInvoiceCount: 1,
    invoices: [],
  },
  upcomingExams: [
    {
      id: 'exam-1',
      examDate: '2026-11-10T00:00:00.000Z',
      subject: { name: 'Mathematics' },
      exam: { name: 'Periodic Test 2' },
    },
  ],
  latestResults: [
    {
      id: 'result-1',
      marksObtained: 91,
      maxMarks: 100,
      percentage: 91,
      grade: 'A',
      examSubject: {
        subject: { name: 'Science' },
        exam: { name: 'Periodic Test 1' },
      },
    },
  ],
  circulars: [
    {
      id: 'notice-1',
      title: 'Annual Sports Day',
      content: 'Annual Sports Day will be held next month.',
      priority: 'NORMAL',
      createdAt: '2026-10-20T00:00:00.000Z',
    },
  ],
  assignments: [
    {
      id: 'assignment-1',
      title: 'Algebra Homework',
      dueDate: '2026-11-05T00:00:00.000Z',
      subject: 'Mathematics',
      submissionStatus: 'NOT_SUBMITTED',
      submittedAt: null,
    },
  ],
};

beforeEach(() => {
  mockGet.mockReset();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ParentDashboardView', () => {
  it('renders the linked child and their academic dashboard', async () => {
    mockGet.mockImplementation(async (path: string) => {
      if (path === '/parent/children') {
        return { data: { data: mockChildren } };
      }

      if (path.includes('/parent/dashboard?studentId=student-1')) {
        return { data: { data: mockDashboard } };
      }

      throw new Error(`Unexpected API request: ${path}`);
    });

    render(<ParentDashboardView user={{ name: 'Rahul Sharma Parent' }} />);

    expect(
      await screen.findByRole('heading', { name: 'Parent Dashboard' }),
    ).toBeDefined();

    expect(await screen.findByText('Rahul Sharma')).toBeDefined();
    expect(screen.getAllByText('88.0%')).toHaveLength(2);
    expect(screen.getAllByText(/14,500/).length).toBeGreaterThan(0);
    expect(screen.getAllByText('Mathematics').length).toBeGreaterThan(0);
    expect(screen.getByText('Annual Sports Day')).toBeDefined();
    expect(screen.getByText('Algebra Homework')).toBeDefined();
  });

  it('shows an empty state when the parent has no linked children', async () => {
    mockGet.mockResolvedValue({
      data: { data: [] },
    });

    render(<ParentDashboardView user={{ name: 'Test Parent' }} />);

    expect(
      await screen.findByText('No linked children found'),
    ).toBeDefined();
  });

  it('shows an error when the children API request fails', async () => {
    mockGet.mockRejectedValue(new Error('Session has expired'));

    render(<ParentDashboardView user={{ name: 'Test Parent' }} />);

    expect(
      await screen.findByText('Could not load your children'),
    ).toBeDefined();

    expect(screen.getByText('Session has expired')).toBeDefined();
  });

  it('retries loading children when Try again is clicked', async () => {
    mockGet
      .mockRejectedValueOnce(new Error('Temporary network error'))
      .mockResolvedValueOnce({
        data: { data: mockChildren },
      })
      .mockResolvedValueOnce({
        data: { data: mockDashboard },
      });

    render(<ParentDashboardView user={{ name: 'Test Parent' }} />);

    await screen.findByText('Could not load your children');

    const retryButton = screen.getByRole('button', { name: /try again/i });
    retryButton.click();

    await waitFor(() => {
      expect(screen.getByText('Rahul Sharma')).toBeDefined();
    });

    expect(mockGet).toHaveBeenCalledWith('/parent/children');
  });
});
