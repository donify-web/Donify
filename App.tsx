import React, { useState, useEffect } from 'react';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import PricingPage from './components/PricingPage';
import HowItWorks from './components/HowItWorks';
import Contact from './components/Contact';
import NgoApply from './components/NgoApply';
import NgoDashboard from './components/NgoDashboard';
import NgoProjects from './components/NgoProjects';
import NgoFinance from './components/NgoFinance';
import NgoSettings from './components/NgoSettings';
import LegalView from './components/LegalView';
import AdminPanel from './components/AdminPanel';
import LaunchCountdown from './components/LaunchCountdown';
import Organizations from './components/Organizations';
import Settings from './components/Settings';
import PublicNavbar from './components/PublicNavbar';
import PaymentWizard from './components/PaymentWizard';
import TierBenefitsModal from './components/TierBenefitsModal';
import RegistrationChoiceModal from './components/RegistrationChoiceModal';
import { PageView, SubscriptionTier, NgoUser } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- LAUNCH CONFIGURATION ---
const LAUNCH_DATE = new Date('2026-03-01T00:00:00');

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<PageView>('landing');

  // Base State for Modals
  const [showPaymentWizard, setShowPaymentWizard] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('oro'); // Default to oro


  const [showRegistrationChoice, setShowRegistrationChoice] = useState(false);

  // Determine if we are in Pre-Launch phase
  const isPreLaunch = new Date() < LAUNCH_DATE;

  // Mock NGO User derivation (In production this would come from a database fetch)
  const derivedNgoUser: NgoUser | null = user?.isNgo ? {
    id: user.id || 'ngo-1',
    ngoName: user.name || 'Mi Organización',
    email: user.email,
    isVerified: false,
    logoUrl: '',
    category: 'Social'
  } : null;

  const handleLogout = async () => {
    // AuthContext handles the actual logout logic if needed, 
    // but here we might just want to clear view state
    const { supabase } = await import('./lib/supabaseClient');
    await supabase.auth.signOut();
    setCurrentView('landing');
  };

  const refreshProfile = () => {
    // This is handled by AuthContext mostly, but if we need a manual trigger:
    window.location.reload();
  };

  const handleRegistrationClick = () => {
    if (user) {
      if (user.isNgo) {
        setCurrentView('ngo-dashboard');
      } else {
        setCurrentView('app');
      }
    } else {
      setShowRegistrationChoice(true);
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    // Force LaunchCountdown if pre-launch and not logged in (and not in specific bypass views)
    if (isPreLaunch && !user && !['login', 'admin'].includes(currentView)) {
      return <LaunchCountdown targetDate={LAUNCH_DATE} onLoginRequest={() => setCurrentView('login')} />;
    }

    switch (currentView) {
      case 'landing':
        return (
          <Landing
            onNavigate={setCurrentView}
            onShowPaymentWizard={(tier) => {
              if (tier) setSelectedTier(tier);
              setShowPaymentWizard(true);
            }}
            onShowBenefits={() => setShowBenefitsModal(true)}
            onJoinClick={handleRegistrationClick}
          />
        );
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
      case 'ngo-dashboard':
        return derivedNgoUser ? (
          <NgoDashboard
            ngoUser={derivedNgoUser}
            onLogout={handleLogout}
            onNavigate={setCurrentView}
          />
        ) : <Login onNavigate={setCurrentView} initialState="login" />;
      case 'ngo-projects':
        return <NgoProjects onNavigate={setCurrentView} />;
      case 'ngo-finance':
        return <NgoFinance onNavigate={setCurrentView} />;
      case 'ngo-settings':
        return derivedNgoUser ? (
          <NgoSettings ngoUser={derivedNgoUser} onNavigate={setCurrentView} />
        ) : <Login onNavigate={setCurrentView} initialState="login" />;
      case 'organizations':
        return <Organizations onNavigate={setCurrentView} />;
      case 'settings':
        return user ? (
          <Settings
            onNavigate={setCurrentView}
            user={user}
            onShowPaymentWizard={() => setShowPaymentWizard(true)}
          />
        ) : (
          <Login onNavigate={setCurrentView} initialState="login" />
        );
      case 'legal':
        return <LegalView onNavigate={setCurrentView} initialTab="terms" />;
      case 'cookies':
        return <LegalView onNavigate={setCurrentView} initialTab="cookies" />;
      case 'admin':
        return user?.isAdmin ? (
          <AdminPanel onNavigate={setCurrentView} currentUser={user} />
        ) : (
          <Dashboard
            user={user!}
            onLogout={handleLogout}
            refreshProfile={refreshProfile}
            onNavigate={setCurrentView}
            onShowPaymentWizard={() => setShowPaymentWizard(true)}
          />
        );
      case 'app':
        return user ? (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            refreshProfile={refreshProfile}
            onNavigate={setCurrentView}
            onShowPaymentWizard={(tier) => {
              if (tier) setSelectedTier(tier);
              setShowPaymentWizard(true);
            }}
          />
        ) : (
          <Login onNavigate={setCurrentView} initialState="login" />
        );
      default:
        return isPreLaunch && !user
          ? <LaunchCountdown targetDate={LAUNCH_DATE} onLoginRequest={() => setCurrentView('login')} />
          : (
            <Landing
              onNavigate={setCurrentView}
              onShowPaymentWizard={(tier) => {
                if (tier) setSelectedTier(tier);
                setShowPaymentWizard(true);
              }}
              onShowBenefits={() => setShowBenefitsModal(true)}
              onJoinClick={handleRegistrationClick}
            />
          );
    }
  };

  const showPublicNavbar = !user && !['login', 'signup', 'app', 'admin', 'settings', 'ngo-dashboard', 'ngo-projects', 'ngo-finance', 'ngo-settings'].includes(currentView);

  return (
    <div className="min-h-screen bg-white">
      {showPublicNavbar && (
        <PublicNavbar
          onNavigate={setCurrentView}
          onLoginClick={() => setCurrentView('login')}
          onJoinClick={handleRegistrationClick}
        />
      )}

      {renderView()}

      {/* GLOBAL MODALS */}
      {showPaymentWizard && user && (
        <PaymentWizard
          user={user}
          onClose={() => setShowPaymentWizard(false)}
          initialTier={selectedTier}
        />
      )}
      <TierBenefitsModal
        isOpen={showBenefitsModal}
        onClose={() => setShowBenefitsModal(false)}
        onSelectTier={(tier) => {
          setShowBenefitsModal(false);
          setSelectedTier(tier);
          setShowPaymentWizard(true);
        }}
      />
      {/* Registration Choice Modal */}
      {showRegistrationChoice && (
        <RegistrationChoiceModal
          isOpen={showRegistrationChoice}
          onClose={() => setShowRegistrationChoice(false)}
          onSelectOption={(option) => {
            setShowRegistrationChoice(false);
            if (option === 'donor') {
              // For donors, we usually go to pricing or direct to signup/payment
              // Let's send them to pricing for now, or open payment wizard if we want that flow
              // User request: "unirse como ... usuario nuevo de manera limpia"
              // Maybe just go to generic signup? Or Pricing? 
              // Existing 'Start Now' buttons often go to Pricing. 
              // Let's go to Pricing as it's the standard flow before payment.
              setCurrentView('pricing');
            } else if (option === 'ngo') {
              setCurrentView('ngo-apply');
            }
          }}
        />
      )}
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

