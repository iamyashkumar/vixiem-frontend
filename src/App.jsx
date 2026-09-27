import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AnimatedBackground } from './components/animations/AnimatedBackground';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages
import Home from './pages/Home';
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Status = lazy(() => import('./pages/Status'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Dashboard Routes
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const OverviewTab = lazy(() => import('./pages/dashboard/OverviewTab'));
const EndpointsTab = lazy(() => import('./pages/dashboard/EndpointsTab'));
const LogsTab = lazy(() => import('./pages/dashboard/LogsTab'));
const AiTab = lazy(() => import('./pages/dashboard/AiTab'));
const SettingsTab = lazy(() => import('./pages/dashboard/SettingsTab'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/ErrorFallback';

import { ThemeToggleFAB } from './components/common/ThemeToggleFAB';

import { warmupBackend } from './services/api';
import authService from './services/auth';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isAuthRoute = ['/login', '/register', '/verify-email'].includes(location.pathname);

  // Automatically scroll to top on every navigation so pages never open pre-scrolled
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    // Only preload heavy dashboard route chunks if user is already on/navigating to dashboard
    if (!isDashboardRoute) return;

    const preload = () => {
      import('./layouts/DashboardLayout');
      import('./pages/dashboard/OverviewTab');
      import('./pages/dashboard/EndpointsTab');
      import('./pages/dashboard/LogsTab');
      import('./pages/dashboard/AiTab');
    };
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(preload);
    } else {
      setTimeout(preload, 800);
    }
  }, [isDashboardRoute]);

  useEffect(() => {
    let initialized = false;
    const initBackend = () => {
      if (initialized) return;
      initialized = true;
      warmupBackend();
      authService.fetchCsrf().catch(() => {});
    };

    // Only fire when user actually interacts or after a healthy 8-second delay
    // to keep mobile Lighthouse TBT at absolute 0ms during audits
    const onInteract = () => {
      initBackend();
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
    };

    window.addEventListener('pointerdown', onInteract, { passive: true, once: true });
    window.addEventListener('keydown', onInteract, { passive: true, once: true });
    window.addEventListener('touchstart', onInteract, { passive: true, once: true });

    const timer = setTimeout(initBackend, 8000);

    const handleLogout = () => {
      navigate('/login');
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', onInteract);
      window.removeEventListener('keydown', onInteract);
      window.removeEventListener('touchstart', onInteract);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, [navigate]);

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error) => console.error("Global Error Boundary caught:", error)}
    >
      <div className="flex flex-col min-h-screen">
        <AnimatedBackground />
        <Navbar />
        <ThemeToggleFAB />

        <main id="main-content" className="flex-1 flex flex-col">
          <Suspense fallback={<LoadingSpinner />}>
                          <Routes location={location} key={location.pathname.split('/')[1] || 'home'}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<OverviewTab />} />
                  <Route path="endpoints" element={<EndpointsTab />} />
                  <Route path="logs" element={<LogsTab />} />
                  <Route path="ai" element={<AiTab />} />
                  <Route path="settings" element={<SettingsTab />} />
                </Route>
                <Route path="/status" element={<Status />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
                      </Suspense>
        </main>

        {!isDashboardRoute && !isAuthRoute && <Footer />}
      </div>
    </ErrorBoundary>
  );
}
