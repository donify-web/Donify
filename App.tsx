
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
import LaunchCountdown from './components/LaunchCountdown'; // Import new component
import { User, PageView, SubscriptionTier } from './types';
import { supabase } from './lib/supabaseClient';


// --- LAUNCH CONFIGURATION ---
const LAUNCH_DATE = new Date('2025-03-04T00:00:00');

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine if we are in Pre-Launch phase
  const isPreLaunch = new Date() < LAUNCH_DATE;

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
        setCurrentView('app');
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
   const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProfile(session.user.id, session.user.email!);
        setCurrentView('app');
      } else {
        // Simplified: Always clear user on sign out
        setUser(null);
        if (currentView === 'app' || currentView === 'admin') {
            setCurrentView('landing');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data) {
        const isAdmin = email === 'admin@donify.org';
        setUser({
          id: data.id,
          email: data.email || email,
          name: data.full_name || email.split('@')[0],
          isSubscribed: data.is_subscribed,
          subscriptionTier: data.subscription_tier,
          hasVotedThisMonth: data.has_voted_this_month,
          lastDonationDate: data.last_donation_date,
          isAdmin: isAdmin
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    if (user?.id.startsWith('mock-')) {
        // Mock Logout
        setUser(null);
        setCurrentView('landing');
    } else {
        // Real Logout
        await supabase.auth.signOut();
        setUser(null);
        setCurrentView('landing');
    }
  };

  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-primary font-bold">Cargando Donify...</div>;
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
        return <Login onNavigate={setCurrentView} initialState="login"  />;
      case 'signup':
        return <Login onNavigate={setCurrentView} initialState="signup"  />;
      case 'pricing':
        return <PricingPage onNavigate={setCurrentView} />;
      case 'how-it-works':
        return <HowItWorks onNavigate={setCurrentView} />;
      case 'contact':
        return <Contact onNavigate={setCurrentView} />;
      case 'ngo-apply':
        return <NgoApply onNavigate={setCurrentView} />;
      case 'legal':
        return <LegalView onNavigate={setCurrentView} />;
      case 'admin':
        return user?.isAdmin ? (
          <AdminPanel onNavigate={setCurrentView} currentUser={user} />
        ) : (
          <Dashboard user={user!} onLogout={handleLogout} refreshProfile={() => {}} />
        );
      case 'app':
        return user ? (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            refreshProfile={() => user.id.startsWith('mock-') ? null : fetchProfile(user.id, user.email)} 
            onNavigate={setCurrentView} 
          />
        ) : (
          <Login onNavigate={setCurrentView} initialState="login" />
        );
      default:
        // Default fallback to Countdown if prelaunch
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
