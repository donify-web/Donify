
import React, { useState, useEffect } from 'react';
import { User, OngCandidate, PageView, SubscriptionTier } from '../types';
import { Bell, LogOut, CheckCircle, AlertCircle, Heart, BellOff, Loader2, Shield, TrendingUp, X, Check, Settings as SettingsIcon } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { initiateCheckout, PRICE_IDS } from '../lib/stripeClient';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  refreshProfile: () => void;
  onNavigate?: (view: PageView) => void;
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

export default function Dashboard({ user, onLogout, refreshProfile, onNavigate }: DashboardProps) {
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [isUpdating, setIsUpdating] = useState(false);
  const [localUser, setLocalUser] = useState<User>(user);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [pricingMode, setPricingMode] = useState<'simple' | 'pro'>('simple');

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

  const handleSubscriptionSelect = async (tier: SubscriptionTier) => {
    setShowPlanSelector(false);
    setIsUpdating(true);

    // Determine Price ID based on tier and frequency (monthly for now)
    let key = '';
    switch (tier) {
      case 'bronce': key = pricingMode === 'simple' ? 'BRONZE_SIMPLE_MONTHLY' : 'BRONZE_PRO_MONTHLY'; break;
      case 'plata': key = pricingMode === 'simple' ? 'PLATA_SIMPLE_BIWEEKLY' : 'PLATA_PRO_BIWEEKLY'; break;
      case 'oro': key = pricingMode === 'simple' ? 'ORO_SIMPLE_WEEKLY' : 'ORO_PRO_WEEKLY'; break;
      case 'diamante': key = pricingMode === 'simple' ? 'DIAMANTE_SIMPLE_DAILY' : 'DIAMANTE_PRO_DAILY'; break;
    }

    // @ts-ignore
    const priceId = PRICE_IDS[key] || PRICE_IDS.BRONZE_SIMPLE;

    if (isMock) {
      setTimeout(() => {
        setLocalUser(prev => ({
          ...prev,
          isSubscribed: true,
          subscriptionTier: tier,
          hasVotedThisMonth: false
        }));
        setIsUpdating(false);
        alert(`[SIMULACIÓN] ¡Suscripción ${tier.toUpperCase()} activada!`);
      }, 1500);
    } else {
      const result = await initiateCheckout(priceId, user.id, 'subscription');
      if (!result.success) {
        setIsUpdating(false);
        alert("El proceso de suscripción falló.");
      }
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

  const tiers: { id: SubscriptionTier, name: string, freq: string, priceSimple: number, pricePro: number }[] = [
    { id: 'bronce', name: 'Bronce', freq: 'Mensual', priceSimple: 0.99, pricePro: 1.99 },
    { id: 'plata', name: 'Plata', freq: 'Quincenal', priceSimple: 0.99, pricePro: 1.99 },
    { id: 'oro', name: 'Oro', freq: 'Semanal', priceSimple: 0.99, pricePro: 1.99 },
    { id: 'diamante', name: 'Diamante', freq: 'Diario', priceSimple: 0.99, pricePro: 1.99 },
  ];

  return (
    <div className="min-h-screen bg-bgMain pb-20 relative">
      {/* HEADER */}
      <div className="bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
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

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">

        {/* STATUS CARD */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full shrink-0 ${canVote ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {canVote ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {localUser.isSubscribed ? `Nivel ${localUser.subscriptionTier?.toUpperCase() || 'BRONCE'}` : (canVote ? 'Donación Puntual Activa' : 'Suscripción Inactiva')}
                  </h3>
                  <p className={`text-sm mt-1 ${canVote ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}`}>
                    {canVote ? '✅ Tienes derecho a voto este mes' : '⚠️ Reactiva tu plan para votar'}
                  </p>
                </div>
                {/* UPGRADE BUTTON */}
                {localUser.isSubscribed && (
                  <button
                    onClick={() => setShowPlanSelector(true)}
                    disabled={isUpdating}
                    className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors text-xs font-bold flex flex-col items-center gap-1"
                  >
                    <TrendingUp size={16} />
                    Cambiar
                  </button>
                )}
              </div>

              {!localUser.isSubscribed && (
                <button
                  onClick={() => setShowPlanSelector(true)}
                  disabled={isUpdating}
                  className="mt-3 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-black transition-colors shadow-sm w-full sm:w-auto"
                >
                  {isUpdating ? 'Procesando...' : 'Activar Suscripción'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ONE TIME DONATION */}
        {!localUser.isSubscribed && !canVote && (
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg mb-1">Aumenta tu impacto hoy</h3>
                <p className="text-blue-50 text-sm mb-3">Haz una donación puntual de 5€.</p>
                <button
                  onClick={() => handleOneTimeDonation(5)}
                  disabled={isUpdating}
                  className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-gray-50 flex items-center gap-2"
                >
                  <Heart size={16} className="fill-current" />
                  {isUpdating ? 'Procesando...' : 'Donar 5€ Extra'}
                </button>
              </div>
              <div className="opacity-20 transform scale-150 rotate-12">
                <Heart size={80} />
              </div>
            </div>
          </div>
        )}

        {/* VOTING CORE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Decide el destino</h2>
            <span className="text-xs font-semibold bg-gray-200 text-gray-600 px-2 py-1 rounded">Cierra en 5 días</span>
          </div>

          {localUser.hasVotedThisMonth ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center animate-in fade-in zoom-in duration-300">
              <div className="inline-flex bg-white p-3 rounded-full text-primary mb-3 shadow-sm">
                <CheckCircle size={32} />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">¡Voto registrado!</h3>
              <p className="text-gray-500 text-sm mt-2">Gracias por participar. Te notificaremos cuando se realice la transferencia.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {mockCandidates.map((org) => (
                <div key={org.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col sm:flex-row">
                  <div className="h-32 sm:h-auto sm:w-32 bg-gray-200 shrink-0 relative">
                    <img src={org.imageUrl} alt={org.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 text-center sm:hidden">
                      {org.category}
                    </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="hidden sm:flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{org.category}</span>
                        <span className="text-xs text-gray-400 font-mono">{org.progress}% votos</span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">{org.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{org.description}</p>
                    </div>

                    <div className="mt-4">
                      {canVote ? (
                        <button
                          onClick={() => handleVote(org.name)}
                          disabled={isUpdating}
                          className="w-full bg-gray-900 hover:bg-primary text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          {isUpdating ? <Loader2 className="animate-spin" size={16} /> : 'Votar a esta causa'}
                        </button>
                      ) : (
                        <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-lg text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-1">
                          <X size={14} /> Activa tu cuenta para votar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* --- PLAN SELECTOR MODAL --- */}
      {showPlanSelector && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowPlanSelector(false)}
          ></div>

          {/* Modal */}
          <div className="relative w-full max-w-lg bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-900">Elige tu nivel de impacto</h3>
              <button onClick={() => setShowPlanSelector(false)} className="text-gray-500 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto">
              {/* Toggle */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setPricingMode('simple')}
                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${pricingMode === 'simple' ? 'bg-primary text-white shadow-sm' : 'text-gray-500'}`}
                  >
                    Simple (0.99€)
                  </button>
                  <button
                    onClick={() => setPricingMode('pro')}
                    className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${pricingMode === 'pro' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500'}`}
                  >
                    Pro (1.99€)
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all ${localUser.subscriptionTier === tier.id ? 'border-primary ring-1 ring-primary/20 bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}
                    onClick={() => handleSubscriptionSelect(tier.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${localUser.subscriptionTier === tier.id ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                        {localUser.subscriptionTier === tier.id && <Check size={10} className="text-white" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{tier.name}</h4>
                        <p className="text-xs text-gray-500">{tier.freq}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 block">{pricingMode === 'simple' ? tier.priceSimple : tier.pricePro}€</span>
                      <span className="text-[10px] text-gray-400">/{tier.id === 'diamante' ? 'día' : (tier.id === 'oro' ? 'sem' : (tier.id === 'plata' ? '15d' : 'mes'))}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 text-xs text-center text-gray-400 border-t">
              Procesado seguro por Stripe. Puedes cancelar en cualquier momento.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
