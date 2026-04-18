import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { ToastProvider } from './utils/ToastContext';
import { ThemeProvider } from './utils/ThemeContext';
import ErrorBoundary from './components/error/ErrorBoundary';

// Components
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import NetworkStatusIndicator from './components/NetworkStatusIndicator';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// Lazy load pages
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ClientCreatePage = lazy(() => import('./pages/ClientCreatePage'));
const ClientListPage = lazy(() => import('./pages/ClientListPage'));
const ClientDetailPage = lazy(() => import('./pages/ClientDetailPage'));
const ClientEditPage = lazy(() => import('./pages/ClientEditPage'));
const LessonTrackingPage = lazy(() => import('./pages/LessonTrackingPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const MemberPortal = lazy(() => import('./pages/MemberPortal'));

// Simplified App Content
const AppContent = () => {
  return (
    <div className="min-h-screen">
      <NetworkStatusIndicator />
      <PWAInstallPrompt />
      
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="lessons" element={<LessonTrackingPage />} />
            
            <Route path="clients">
              <Route path="new" element={<ClientCreatePage />} />
              <Route path="list" element={<ClientListPage />} />
              <Route path=":id" element={<ClientDetailPage />} />
              <Route path=":id/edit" element={<ClientEditPage />} />
              <Route index element={<Navigate to="new" replace />} />
            </Route>

            <Route path="profile" element={<ProfilePage />} />
          </Route>
          
          {/* Public-style Member Portal Route */}
          <Route path="/portal/:id" element={<MemberPortal />} />
          
          {/* Catch all 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;