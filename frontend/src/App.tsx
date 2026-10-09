import { useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, LogIn, Menu, UserCircle2, X } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import SocietiesPage from './pages/SocietiesPage';
import ExploreEventsPage from './pages/ExploreEventsPage';
import EventDetailPage from './pages/EventDetailPage';
import SocietyPage from './pages/SocietyPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MyEventsPage from './pages/MyEventsPage';
import NotificationsPage from './pages/NotificationsPage';
import CreateEventPage from './pages/CreateEventPage';
import NotFoundPage from './pages/NotFoundPage';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="page-shell"><div className="soft-panel p-8 text-center text-[var(--muted)]">Loading…</div></div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = user?.role === 'STUDENT'
    ? [
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Events', href: '/events' },
        { label: 'Societies', href: '/societies' },
        { label: 'My Events', href: '/my-events' },
        { label: 'Notifications', href: '/notifications' },
      ]
    : user?.role === 'ORGANIZER'
      ? [
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Create Event', href: '/create-event' },
          { label: 'Events', href: '/events' },
          { label: 'Notifications', href: '/notifications' },
        ]
      : user?.role === 'ADMIN'
        ? [
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Events', href: '/events' },
            { label: 'Societies', href: '/societies' },
            { label: 'Users', href: '/dashboard' },
          ]
        : [
            { label: 'Events', href: '/events' },
            { label: 'Societies', href: '/societies' },
            { label: 'About', href: '/' },
          ];

  const handleNavigate = (href: string) => {
    setMobileOpen(false);
    if (href === '/') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    navigate(href);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <button onClick={() => handleNavigate('/')} className="brand-button">
            <div className="brand-mark">MIT </div>
            <div className="brand-copy">
              <div className="brand-kicker"></div>
              <div className="brand-name">EventHub</div>
            </div>
          </button>

          <nav className="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigate(item.href)}
                className={`nav-pill ${location.pathname === item.href ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="topbar-actions">
            {user ? (
              <>
                <button onClick={() => handleNavigate('/notifications')} className="icon-button" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                  <span className="notification-dot" />
                </button>
                <button onClick={() => handleNavigate('/dashboard')} className="profile-pill">
                  <UserCircle2 className="h-4 w-4" />
                  {user.name}
                </button>
                <button onClick={() => { logout(); navigate('/'); }} className="secondary-button">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => handleNavigate('/login')} className="secondary-button hidden sm:inline-flex"><LogIn className="mr-2 h-4 w-4" /> Login</button>
                <button onClick={() => handleNavigate('/register')} className="primary-button">Get Started</button>
              </>
            )}

            <button
              aria-label="Toggle menu"
              className="menu-button md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mobile-menu">
            <nav className="mobile-menu-inner">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigate(item.href)}
                  className={`mobile-menu-item ${location.pathname === item.href ? 'active' : ''}`}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
              {!user && (
                <button onClick={() => handleNavigate('/login')} className="secondary-button mt-2 justify-center">Login</button>
              )}
            </nav>
          </div>
        )}
      </header>

      <main key={location.pathname} className="route-transition">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<ExploreEventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/societies" element={<SocietiesPage />} />
          <Route path="/societies/:slug" element={<SocietyPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/organizer-dashboard" element={<ProtectedRoute allowedRoles={['ORGANIZER']}><OrganizerDashboardPage /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboardPage /></ProtectedRoute>} />
          <Route path="/my-events" element={<ProtectedRoute allowedRoles={['STUDENT']}><MyEventsPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/create-event" element={<ProtectedRoute allowedRoles={['ORGANIZER','ADMIN']}><CreateEventPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
