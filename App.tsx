import React, { useState, useEffect } from 'react';
import Landing from './components/public/Landing';
import Dashboard from './components/donor/Dashboard';
import Login from './components/auth/Login';
import PricingPage from './components/public/PricingPage';
import HowItWorks from './components/public/HowItWorks';
import Contact from './components/public/Contact';
import NgoApply from './components/ngo/NgoApply';
import NgoDashboard from './components/ngo/NgoDashboard';
import NgoProjects from './components/ngo/NgoProjects';
import NgoFinance from './components/ngo/NgoFinance';
import NgoSettings from './components/ngo/NgoSettings';
import LegalView from './components/public/LegalView';
import AdminPanel from './components/admin/AdminPanel';
import LaunchCountdown from './components/public/LaunchCountdown';
import Organizations from './components/public/Organizations';
import VotingPage from './components/public/VotingPage';
import QuickVote from './components/public/QuickVote';
import FAQ from './components/public/FAQ';
import Settings from './components/donor/Settings';
import PublicNavbar from './components/public/PublicNavbar';
import PublicFooter from './components/shared/PublicFooter';
import PaymentWizard from './components/shared/PaymentWizard';
import TierBenefitsModal from './components/shared/TierBenefitsModal';
import RegistrationChoiceModal from './components/auth/RegistrationChoiceModal';
import DonorDashboardLayout from './components/donor/DonorDashboardLayout';
import DonorImpact from './components/donor/DonorImpact';
import DonorNews from './components/donor/DonorNews';
import CookieConsent from './components/shared/CookieConsent';
import { PageView, SubscriptionTier, NgoUser, SubscriptionType } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- LAUNCH CONFIGURATION ---
const LAUNCH_DATE = new Date('2026-01-01T00:00:00'); // Set to past for testing

function AppContent() {
  const { user, loading } = useAuth();

  // --- HASH-BASED ROUTING ---
  const getViewFromHash = (): PageView => {
    const hash = window.location.hash.split('?')[0].replace('#/', '').replace('#', '') as PageView;
    const validViews: PageView[] = [
      'landing', 'app', 'login', 'signup', 'pricing', 'how-it-works', 'contact', 'ngo-apply',
      'ngo-dashboard', 'ngo-projects', 'ngo-finance', 'ngo-settings', 'legal', 'privacy',
      'cookies', 'admin', 'organizations', 'settings', 'dashboard-impact', 'dashboard-news',
      'voting', 'quick-vote', 'transparency', 'faq'
    ];

    if (validViews.includes(hash)) {
      return hash;
    }
    return 'landing'; // default
  };

  const [currentView, setCurrentView] = useState<PageView>(getViewFromHash());

  // Base State for Modals
  const [showPaymentWizard, setShowPaymentWizard] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('oro'); // Default to oro
  const [selectedType, setSelectedType] = useState<SubscriptionType>('simple'); // Default to simple

  const [showRegistrationChoice, setShowRegistrationChoice] = useState(false);

  // Determine if we are in Pre-Launch phase
  const isPreLaunch = new Date() < LAUNCH_DATE;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Sync hash with current view
    if (currentView !== 'landing' && currentView !== 'quick-vote') {
      window.location.hash = `#/${currentView}`;
    } else if (currentView === 'landing' || currentView === 'quick-vote') {
      // For landing page, remove hash for cleaner URL
      if (currentView === 'landing' && window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [currentView]);

  // Listen for browser back/forward hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const view = getViewFromHash();
      setCurrentView(view);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --- AUTO-REDIRECT LOGIC ---
  useEffect(() => {
    if (!loading && user) {
      if (['login', 'signup'].includes(currentView)) {
        if (user.isAdmin) {
          setCurrentView('admin');
        } else if (user.isNgo) {
          setCurrentView('ngo-dashboard');
        } else {
          setCurrentView('app');
        }
      }
    }
  }, [user, loading, currentView]);

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
      // Go directly to signup page
      setCurrentView('signup');
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
            onShowPaymentWizard={(tier, type) => {
              if (tier) setSelectedTier(tier);
              if (type) setSelectedType(type);
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
        return <HowItWorks onNavigate={setCurrentView} onLoginClick={() => setCurrentView('login')} onJoinClick={handleRegistrationClick} />;
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
        return derivedNgoUser ? (
          <NgoProjects onNavigate={setCurrentView} ngoUser={derivedNgoUser} />
        ) : <Login onNavigate={setCurrentView} initialState="login" />;
      case 'ngo-finance':
        return derivedNgoUser ? (
          <NgoFinance onNavigate={setCurrentView} ngoId={derivedNgoUser.id} />
        ) : <Login onNavigate={setCurrentView} initialState="login" />;
      case 'ngo-settings':
        return derivedNgoUser ? (
          <NgoSettings ngoUser={derivedNgoUser} onNavigate={setCurrentView} />
        ) : <Login onNavigate={setCurrentView} initialState="login" />;
      case 'organizations':
        return <Organizations onNavigate={setCurrentView} />;
      case 'voting':
        return <VotingPage onNavigate={setCurrentView} />;
      case 'quick-vote':
        return <QuickVote onNavigate={setCurrentView} />;
      case 'admin':
        console.log("Current User in App.tsx Admin View:", user);
        if (!user) return <Login onNavigate={setCurrentView} initialState="login" />;
        return user.isAdmin ? (
          <AdminPanel currentUser={user} onNavigate={setCurrentView} />
        ) : (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 p-4">
            <h1 className="text-3xl font-bold text-red-600 mb-2">Acceso Denegado</h1>
            <p className="mb-6 text-center max-w-md">No tienes permisos de administrador. Si eres el dueño, asegúrate de marcar la casilla "is_admin" en tu usuario dentro de Supabase.</p>
            <button
              onClick={() => setCurrentView('landing')}
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        );
      case 'legal':
        return <LegalView onNavigate={setCurrentView} initialTab="terms" />;
      case 'privacy':
        return <LegalView onNavigate={setCurrentView} initialTab="privacy" />;
      case 'cookies':
        return <LegalView onNavigate={setCurrentView} initialTab="cookies" />;
      case 'transparency':
        return <LegalView onNavigate={setCurrentView} initialTab="transparency" />;
      case 'faq':
        return <FAQ />;
      case 'app':
      case 'dashboard-impact':
      case 'dashboard-news':
      case 'settings':
        // DONOR DASHBOARD VIEWS
        if (!user) return <Login onNavigate={setCurrentView} initialState="login" />;

        return (
          <DonorDashboardLayout
            user={user}
            currentView={currentView}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
          >
            {currentView === 'app' && (
              <Dashboard
                user={user}
                onLogout={handleLogout}
                refreshProfile={refreshProfile}
                minimalMode={true}
                onShowPaymentWizard={(tier) => {
                  if (tier) setSelectedTier(tier);
                  setShowPaymentWizard(true);
                }}
                // We pass undefined/null for onNavigate to Dashboard to hide its internal header nav items if we want,
                // or keep them. The Layout has its own Nav. 
                // Let's keep onNavigate so internal links work, but Dashboard might need cleanup to remove duplicate headers.
                onNavigate={setCurrentView}
              />
            )}
            {currentView === 'dashboard-impact' && <DonorImpact user={user} />}
            {currentView === 'dashboard-news' && <DonorNews />}
            {currentView === 'settings' && (
              <Settings
                onNavigate={setCurrentView}
                user={user}
                onShowPaymentWizard={() => setShowPaymentWizard(true)}
              />
            )}
          </DonorDashboardLayout>
        );
      default:
        return isPreLaunch && !user
          ? <LaunchCountdown targetDate={LAUNCH_DATE} onLoginRequest={() => setCurrentView('login')} />
          : (
            <Landing
              onNavigate={setCurrentView}
              onShowPaymentWizard={(tier, type) => {
                if (tier) setSelectedTier(tier);
                if (type) setSelectedType(type);
                setShowPaymentWizard(true);
              }}
              onShowBenefits={() => setShowBenefitsModal(true)}
              onJoinClick={handleRegistrationClick}
            />
          );
    }
  };

  const showPublicNavbar = !['login', 'signup', 'app', 'admin', 'settings', 'ngo-dashboard', 'ngo-projects', 'ngo-finance', 'ngo-settings', 'dashboard-impact', 'dashboard-news', 'voting', 'quick-vote'].includes(currentView);
  const showPublicFooter = !['login', 'signup', 'app', 'admin', 'settings', 'ngo-dashboard', 'ngo-projects', 'ngo-finance', 'ngo-settings', 'dashboard-impact', 'dashboard-news', 'quick-vote'].includes(currentView);

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

      {showPublicFooter && (
        <PublicFooter onNavigate={setCurrentView} />
      )}

      {/* GLOBAL MODALS */}
      {showPaymentWizard && (
        <PaymentWizard
          user={user}
          onClose={() => setShowPaymentWizard(false)}
          initialTier={selectedTier}
          initialType={selectedType}
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
              // Redirect donors to Signup page instead of Pricing
              setCurrentView('signup');
            } else if (option === 'ngo') {
              setCurrentView('ngo-apply');
            }
          }}
        />
      )}

      <CookieConsent onShowPolicy={() => setCurrentView('cookies')} />
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

