import React, { useState, useEffect } from 'react';
import { User, OngCandidate, PageView, SubscriptionTier } from '../../types';
import { Bell, LogOut, CheckCircle, AlertCircle, Heart, BellOff, Loader2, Shield, TrendingUp, X, Check, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { initiateCheckout, PRICE_IDS } from '../../lib/stripeClient';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  refreshProfile: () => void;
  onNavigate?: (view: PageView) => void;
  onShowPaymentWizard?: (tier?: SubscriptionTier) => void;
  minimalMode?: boolean;
}

const mockCandidates: OngCandidate[] = [
  {
    id: '1',
    name: 'Reforesta Futuro',
    category: 'Medio Ambiente',
    description: 'Plantación de 500 árboles en zonas quemadas de Galicia.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    progress: 34
  },
  {
    id: '2',
    name: 'Comedores Dignos',
    category: 'Social',
    description: 'Garantizar una comida caliente diaria a 50 familias vulnerables.',
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
    progress: 45
  },
  {
    id: '3',
    name: 'Tech for Kids',
    category: 'Educación',
    description: 'Tablets y conectividad para escuelas rurales aisladas.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    progress: 21
  }
];

export default function Dashboard({ user, onLogout, refreshProfile, onNavigate, onShowPaymentWizard, minimalMode = false }: DashboardProps) {
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [isUpdating, setIsUpdating] = useState(false);
  const [localUser, setLocalUser] = useState<User>(user);

  useEffect(() => {
    setLocalUser(user);
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
    }
  }, [user]);

  const canVote = localUser.isSubscribed || (localUser.lastDonationDate && new Date(localUser.lastDonationDate).getMonth() === new Date().getMonth());
  const isMock = user.id.startsWith('mock-');

  // --- PAYMENT LOGIC ---
  const handleOneTimeDonation = async (amount: number = 5) => {
    setIsUpdating(true);
    // Use price IDs from stripeClient. In this case, DONATION_5 is specifically for 5€
    const priceId = amount === 5 ? PRICE_IDS.DONATION_5 : PRICE_IDS.DONATION_5;

    if (isMock) {
      setTimeout(() => {
        setLocalUser(prev => ({ ...prev, lastDonationDate: new Date().toISOString() }));
        setIsUpdating(false);
        alert(`[SIMULACIÓN] ¡Donación puntual de ${amount}€ recibida! Ya puedes votar.`);
      }, 1500);
    } else {
      const result = await initiateCheckout(priceId, user.id, 'payment');
      if (!result.success) {
        setIsUpdating(false);
        alert("Error al iniciar el proceso de pago.");
      }
      // Redirection happens inside initiateCheckout
    }
  };

  const handleVote = async (ongName: string) => {
    if (!canVote) return;
    setIsUpdating(true);

    if (isMock) {
      setTimeout(() => {
        setLocalUser(prev => ({ ...prev, hasVotedThisMonth: true }));
        setIsUpdating(false);
        alert(`[SIMULACIÓN] Voto registrado para ${ongName}!`);
      }, 800);
    } else {
      const { error } = await supabase
        .from('profiles')
        .update({ has_voted_this_month: true })
        .eq('id', user.id);

      setIsUpdating(false);

      if (error) {
        console.error(error);
        alert("Error al guardar el voto.");
      } else {
        alert(`¡Voto registrado para ${ongName}!`);
        refreshProfile();
      }
    }
  };

  const handleNotificationRequest = async () => {
    if (!('Notification' in window)) return;
    if (notifPermission === 'granted') {
      new Notification("Donify", { body: "Las notificaciones están activas." });
      return;
    }
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
    if (permission === 'granted') {
      new Notification("¡Gracias!", { body: "Te avisaremos de las próximas votaciones." });
    }
  };

  return (
    <div className={`min-h-screen bg-bgMain pb-20 relative ${minimalMode ? 'pt-6' : ''}`}>
      {/* HEADER */}
      {!minimalMode && (
        <div className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm border-b border-gray-100">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Hola, {localUser.name}</h1>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${canVote ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <p className="text-xs text-gray-500 font-medium">{canVote ? 'Voto Habilitado' : 'Voto Deshabilitado'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            {localUser.isAdmin && onNavigate && (
              <button
                onClick={() => onNavigate('admin')}
                className="text-gray-900 hover:text-primary transition-colors bg-gray-100 p-2 rounded-full"
                title="Panel de Admin"
              >
                <Shield size={20} />
              </button>
            )}

            {onNavigate && (
              <button
                onClick={() => onNavigate('settings')}
                className="text-gray-900 hover:text-primary transition-colors bg-gray-100 p-2 rounded-full"
                title="Configuración"
              >
                <SettingsIcon size={20} />
              </button>
            )}

            <button
              onClick={handleNotificationRequest}
              className={`relative transition-colors ${notifPermission === 'granted' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}
            >
              {notifPermission === 'denied' ? <BellOff size={24} /> : <Bell size={24} />}
              {notifPermission === 'default' && (
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
            <button onClick={onLogout} className="text-gray-400 hover:text-gray-600">
              <LogOut size={24} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8">

        {/* GREETING SECTION */}
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Hola, {localUser.name} 👋</h1>
          <p className="text-gray-500 font-medium">Aquí tienes el resumen de tu impacto hoy.</p>
        </div>

        {/* TOP STATUS SECTION */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className={`p-4 rounded-full shrink-0 ${canVote ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {canVote ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {localUser.isSubscribed ? `Nivel ${localUser.subscriptionTier?.toUpperCase() || 'BRONCE'}` : (canVote ? 'Donación Puntual Activa' : 'Suscripción Inactiva')}
              </h3>
              <p className={`text-sm mt-1 ${canVote ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}`}>
                {canVote ? '✅ Tienes derecho a voto este mes' : '⚠️ Reactiva tu plan para votar'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            {!localUser.isSubscribed ? (
              <button
                onClick={() => onShowPaymentWizard?.()}
                disabled={isUpdating}
                className="flex-1 md:flex-none bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-200 font-bold"
              >
                {isUpdating ? 'Procesando...' : 'Activar Suscripción'}
              </button>
            ) : (
              <button
                onClick={() => onShowPaymentWizard?.()}
                disabled={isUpdating}
                className="flex-1 md:flex-none bg-gray-50 text-gray-900 px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 font-bold flex items-center justify-center gap-2"
              >
                <TrendingUp size={18} />
                Mejorar Plan
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: VOTING (2/3 width on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Proyectos Destacados</h2>
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-wide">Cierra en 5 días</span>
            </div>

            {localUser.hasVotedThisMonth ? (
              <div className="bg-blue-50 border border-blue-100 rounded-3xl p-10 text-center animate-in fade-in zoom-in duration-500">
                <div className="inline-flex bg-white p-4 rounded-full text-blue-600 mb-4 shadow-sm">
                  <CheckCircle size={48} />
                </div>
                <h3 className="font-bold text-gray-900 text-2xl mb-2">¡Voto registrado!</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Gracias por participar. Tu opinión ayuda a decidir dónde se dirige el impacto de Donify este mes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockCandidates.map((org) => (
                  <div key={org.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col h-full group">
                    <div className="h-48 bg-gray-200 relative overflow-hidden">
                      <img
                        src={org.imageUrl}
                        alt={org.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                        {org.category}
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">{org.name}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/5 px-2 py-1 rounded-md">
                          <TrendingUp size={12} />
                          {org.progress}%
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-6 flex-1">{org.description}</p>

                      {canVote ? (
                        <button
                          onClick={() => handleVote(org.name)}
                          disabled={isUpdating}
                          className="w-full bg-gray-900 hover:bg-primary text-white py-3 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200 group-hover:translate-y-[-2px]"
                        >
                          {isUpdating ? <Loader2 className="animate-spin" size={16} /> : 'Votar Proyecto'}
                        </button>
                      ) : (
                        <button disabled className="w-full bg-gray-50 text-gray-400 py-3 rounded-xl text-sm font-bold cursor-not-allowed flex items-center justify-center gap-2 border border-gray-100">
                          <LogOut size={16} /> Requiere Suscripción
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SIDEBAR (1/3 width on desktop) */}
          <div className="lg:col-span-1 space-y-6">
            {/* ONE TIME DONATION CARD */}
            {!localUser.isSubscribed && !canVote && (
              <div className="bg-gradient-to-br from-primary to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="fill-white" size={24} />
                  </div>
                  <h3 className="font-black text-2xl mb-2">Impacto inmediato</h3>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    ¿No quieres suscribirte? Haz una donación puntual para desbloquear tu voto este mes.
                  </p>
                  <button
                    onClick={() => handleOneTimeDonation(5)}
                    disabled={isUpdating}
                    className="w-full bg-white text-primary py-3 rounded-xl text-sm font-black shadow-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {isUpdating ? 'Procesando...' : 'Donar 5€'}
                  </button>
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-[-50%] right-[-50%] w-full h-full border-[40px] border-white/5 rounded-full"></div>
                <div className="absolute bottom-[-20%] left-[-20%] w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              </div>
            )}

            {/* INFORMATION CARD */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                Transparencia
              </h4>
              <ul className="space-y-4">
                <li className="text-sm text-gray-600 flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0"></div>
                  <p>El 100% de tu donación va directamente a los proyectos.</p>
                </li>
                <li className="text-sm text-gray-600 flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0"></div>
                  <p>Ventas verificadas y auditadas mensualmente.</p>
                </li>
                <li className="text-sm text-gray-600 flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0"></div>
                  <p>Recibes actualizaciones del impacto real generado.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
