/**
 * @file App.tsx
 * @description Root Application Router with Authentication Provider, QueryClient, and Protected Layout Routes.
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { TeachersPage } from './pages/TeachersPage';
import { AttendancePage } from './pages/AttendancePage';
import { FinancePage } from './pages/FinancePage';
import { AcademicsPage } from './pages/AcademicsPage';
import { TimetablePage } from './pages/TimetablePage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { CalendarPage } from './pages/CalendarPage';
import { SuperAdminPage } from './pages/SuperAdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { StudentSubjectsPage } from './pages/StudentSubjectsPage';
import { SubjectClassroomPage } from './pages/SubjectClassroomPage';
import { ExamsPage } from './pages/ExamsPage';
import {
  LibraryPage,
  MessagesPage,
  ReportsPage,
  SettingsPage,
} from './pages/OtherPages';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * ProtectedRoute: Authentication boundary using React Router's Outlet.
 * Blocks unauthenticated access and projects nested routes cleanly without prop drilling.
 */
const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="w-10 h-10 border-4 border-brand-sky border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing & Marketing */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Authentication */}
              <Route path="/login" element={<LoginPage />} />

              {/* 🛡️ Protected Routes Guard Boundary */}
              <Route element={<ProtectedRoute />}>
                {/* 🎨 Main Application Shell (Sidebar + Navbar + Page Outlet) */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/my-subjects" element={<StudentSubjectsPage />} />
                  <Route path="/my-subjects/:subjectId" element={<SubjectClassroomPage />} />
                  <Route path="/students" element={<StudentsPage />} />
                  <Route path="/teachers" element={<TeachersPage />} />
                  <Route path="/academics" element={<AcademicsPage />} />
                  <Route path="/attendance" element={<AttendancePage />} />
                  <Route path="/finance" element={<FinancePage />} />
                  <Route path="/timetable" element={<TimetablePage />} />
                  <Route path="/exams" element={<ExamsPage />} />
                  <Route path="/announcements" element={<AnnouncementsPage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/library" element={<LibraryPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />

                  {/* Super Admin routes */}
                  <Route path="/admin/dashboard" element={<SuperAdminPage />} />
                  <Route path="/admin/schools" element={<SuperAdminPage />} />
                  <Route path="/admin/subscriptions" element={<SuperAdminPage />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
