import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PricingPage from './components/PricingPage';
import HowItWorks from './components/HowItWorks';
import Contact from './components/Contact';
import NgoApply from './components/NgoApply';
import LegalView from './components/LegalView';
import AdminPanel from './components/AdminPanel';
import LaunchCountdown from './components/LaunchCountdown';
import Organizations from './components/Organizations';
import Settings from './components/Settings';
import NgoDashboard from './components/NgoDashboard';
import NgoSettings from './components/NgoSettings';
import { PageView, NgoUser } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- LAUNCH CONFIGURATION ---
const LAUNCH_DATE = new Date('2025-03-04T00:00:00');

function AppContent() {
  const { user, loading, signOut, refreshProfile } = useAuth();
  const [currentView, setCurrentView] = useState<PageView>('landing');

  // Determine if we are in Pre-Launch phase
  const isPreLaunch = new Date() < LAUNCH_DATE;

  // React to auth state changes to set initial view
  useEffect(() => {
    if (!loading) {
      if (user) {
        // Route to appropriate dashboard based on user type
        if (user.userType === 'ngo') {
          setCurrentView('ngo-dashboard');
        } else {
          setCurrentView('app');
        }
      } else {
        // If we were in the app and got logged out, go to landing
        if (currentView === 'app' || currentView === 'admin' || currentView === 'ngo-dashboard') {
          setCurrentView('landing');
        }
      }
    }
  }, [user, loading]);

  const handleLogout = async () => {
    await signOut();
    setCurrentView('landing');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        {/* Simple spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <div className="text-primary font-bold">Cargando Donify...</div>
      </div>
    );
  }

  // --- RENDER LOGIC ---
  const renderView = () => {
    // BLOCKING LOGIC: If Pre-Launch, User is not logged in, and not on Login/Signup screens
    const isAuthView = currentView === 'login' || currentView === 'signup';
    if (isPreLaunch && !user && !isAuthView) {
      return <LaunchCountdown targetDate={LAUNCH_DATE} onLoginRequest={() => setCurrentView('login')} />;
    }

    switch (currentView) {
      case 'landing':
        return <Landing onNavigate={setCurrentView} />;
      case 'login':
        return <Login onNavigate={setCurrentView} initialState="login" />;
      case 'signup':
        return <Login onNavigate={setCurrentView} initialState="signup" />;
      case 'pricing':
        return <PricingPage onNavigate={setCurrentView} />;
      case 'how-it-works':
        return <HowItWorks onNavigate={setCurrentView} />;
      case 'contact':
        return <Contact onNavigate={setCurrentView} />;
      case 'ngo-apply':
        return <NgoApply onNavigate={setCurrentView} />;
      case 'organizations':
        return <Organizations onNavigate={setCurrentView} />;
      case 'settings':
        return user ? (
          <Settings onNavigate={setCurrentView} user={user} />
        ) : (
          <Login onNavigate={setCurrentView} initialState="login" />
        );
      case 'legal':
        return <LegalView onNavigate={setCurrentView} />;
      case 'admin':
        return user?.isAdmin ? (
          <AdminPanel onNavigate={setCurrentView} currentUser={user} />
        ) : (
          <Dashboard user={user!} onLogout={handleLogout} refreshProfile={refreshProfile} />
        );
      case 'app':
        return user ? (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            refreshProfile={refreshProfile}
            onNavigate={setCurrentView}
          />
        ) : (
          <Login onNavigate={setCurrentView} initialState="login" />
        );
      case 'ngo-dashboard':
        return user?.userType === 'ngo' ? (
          <NgoDashboard
            ngoUser={user as any as NgoUser}
            onLogout={handleLogout}
            onNavigate={setCurrentView}
          />
        ) : (
          <Login onNavigate={setCurrentView} initialState="login" />
        );
      case 'ngo-settings':
        return user?.userType === 'ngo' ? (
          <NgoSettings
            ngoUser={user as any as NgoUser}
            onNavigate={setCurrentView}
          />
        ) : (
          <Login onNavigate={setCurrentView} initialState="login" />
        );
      default:
        return isPreLaunch && !user
          ? <LaunchCountdown targetDate={LAUNCH_DATE} onLoginRequest={() => setCurrentView('login')} />
          : <Landing onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderView()}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
