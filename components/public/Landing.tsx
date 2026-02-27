import React, { useState, useEffect, useRef } from 'react';
import { PageView, SubscriptionTier, SubscriptionType } from '../../types';
import { Coins, Heart, CheckCircle, ArrowRight, ShieldCheck, Globe, Star, Zap, Crown, Lock, PlayCircle, Users, Activity, Loader2 } from 'lucide-react';
import { Logo } from '../shared/Logo';
import VotingSection from './VotingSection';
import { PRICE_IDS, initiateCheckout } from '../../lib/stripeClient';
import { supabase } from '../../lib/supabaseClient';

// Custom hook for scroll animations on solid sections
function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

interface LandingProps {
  onNavigate: (view: PageView) => void;
  onShowPaymentWizard: (tier?: SubscriptionTier, type?: SubscriptionType) => void;
  onShowBenefits: () => void;
  onJoinClick: () => void;
}

export default function Landing({ onNavigate, onShowPaymentWizard, onShowBenefits, onJoinClick }: LandingProps) {
  const [pricingMode, setPricingMode] = useState<SubscriptionType>('simple');
  const [isDonating, setIsDonating] = useState(false);

  const handleDonate5 = async () => {
    setIsDonating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || 'anonymous';
      const result = await initiateCheckout(PRICE_IDS.DONATION_5, userId, 'payment');
      if (!result.success) {
        alert('Error al iniciar el pago. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('[Donate5] Error:', err);
      alert('Error al iniciar el pago. Por favor, inténtalo de nuevo.');
    } finally {
      setIsDonating(false);
    }
  };

  const statsAnimation = useScrollAnimation();
  const videoAnimation = useScrollAnimation();
  const storyAnimation = useScrollAnimation();

  const tiers = [
    {
      id: 'bronce',
      name: 'Bronce',
      price: pricingMode === 'simple' ? 0.99 : 1.99,
      period: 'mes',
      frequency: 'Mensual',
      icon: ShieldCheck,
      description: 'Tu impacto empieza aquí',
      gradient: 'bg-gradient-bronze',
      cardBg: '#FFF4EE',
      border: 'border-orange-200',
      text: 'text-orange-700',
      button: 'bg-orange-100 text-orange-900 hover:bg-orange-200 border-orange-200/50',
      features: [
        'Potestad de voto',
        'Certificado de donación (PDF Bronce)'
      ]
    },
    {
      id: 'plata',
      name: 'Plata',
      price: pricingMode === 'simple' ? 0.99 : 1.99,
      period: '2 semanas',
      frequency: 'Quincenal',
      icon: Star,
      description: 'Más compromiso, más ayuda',
      gradient: 'bg-gradient-silver',
      cardBg: '#F0F4F8',
      border: 'border-slate-200',
      text: 'text-slate-700',
      button: 'bg-slate-100 text-slate-900 hover:bg-slate-200 border-slate-200/50',
      features: [
        'Potestad de voto',
        'Certificado de donación (PDF Plata)',
        'Acceso anticipado a votaciones'
      ]
    },
    {
      id: 'oro',
      name: 'Oro',
      price: pricingMode === 'simple' ? 0.99 : 1.99,
      period: 'semana',
      frequency: 'Semanal',
      icon: Zap,
      description: 'Lidera el cambio real',
      gradient: 'bg-gradient-gold',
      cardBg: '#FFFBEA',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      button: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200 border-yellow-200/50',
      features: [
        'Potestad de voto',
        'Certificado de donación (PDF Oro)',
        'Mención en la web oficial',
        'Acceso exclusivo a informes mensuales'
      ]
    },
    {
      id: 'diamante',
      name: 'Diamante',
      price: pricingMode === 'simple' ? 0.99 : 1.99,
      period: '4 días',
      frequency: 'Cada 4 días',
      icon: Crown,
      description: 'Impacto transformador',
      gradient: 'bg-gradient-diamond',
      cardBg: '#EAF7F9',
      border: 'border-cyan-200',
      text: 'text-cyan-700',
      button: 'bg-cyan-100 text-cyan-900 hover:bg-cyan-200 border-cyan-200/50',
      features: [
        'Potestad de voto',
        'Certificado de donación (PDF Diamante)',
        'Participación en comité asesor',
        'Elegir la causa del primer mes',
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden font-sans relative">

      <div className="relative z-10">

        {/* HERO SECTION - with brand light blue background */}
        <div className="bg-[#eef5fa] relative">
          {/* Subtle dotted pattern */}
          <div className="absolute inset-0 bg-pattern-dots opacity-30 mix-blend-multiply pointer-events-none"></div>

          <header className="px-6 lg:px-12 py-6 flex justify-between items-center max-w-7xl mx-auto relative z-20">
            <div className="flex items-center gap-2 cursor-pointer glass-card px-4 py-2 rounded-full border border-white/50 shadow-sm bg-white/60 hover:bg-white/80 transition-colors" onClick={() => onNavigate('landing')}>
              <Logo className="w-8 h-8 text-primary" />
              <span className="font-bold text-xl text-gray-800 tracking-tight">Donify</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <button onClick={() => onNavigate('how-it-works')} className="text-gray-600 hover:text-primary font-medium transition-colors">Cómo funciona</button>
              <button onClick={() => onNavigate('organizations')} className="text-gray-600 hover:text-primary font-medium transition-colors">Organizaciones</button>
              <button onClick={() => onNavigate('login')} className="text-gray-600 hover:text-primary font-medium transition-colors">Iniciar Sesión</button>
              <button
                onClick={() => onShowPaymentWizard()}
                className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-black transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Unirse Ahora
              </button>
            </nav>
            <button className="md:hidden text-gray-800 relative z-20">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
            </button>
          </header>

          <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 lg:pt-24 text-center relative z-10 min-h-[65vh] flex flex-col justify-center">

            {/* Floating Images mapped around the center */}
            <div className="hidden lg:block absolute top-[10%] left-[5%] animate-float" style={{ animationDelay: '0s' }}>
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=200" alt="Salud" className="w-full h-full object-cover transition-transform group-hover:scale-110" />

              </div>
            </div>

            <div className="hidden lg:block absolute bottom-[15%] left-[12%] animate-float" style={{ animationDelay: '1.5s' }}>
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200" alt="Educación" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
            </div>

            <div className="hidden lg:block absolute top-[20%] right-[8%] animate-float" style={{ animationDelay: '0.8s' }}>
              <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=300" alt="Medio Ambiente" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
            </div>

            <div className="hidden lg:block absolute bottom-[10%] right-[15%] animate-float" style={{ animationDelay: '2s' }}>
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden relative group">
                <img src="https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&q=80&w=150" alt="Animales" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-8 mx-auto animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Revolucionando la filantropía
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-[#1c232f] mb-6 tracking-tight leading-tight max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Tu cambio suelto <br className="hidden md:block" />
              <span className="relative inline-block text-primary z-10">
                cambia el mundo.
                <svg className="absolute -bottom-1 lg:-bottom-2 left-0 w-full h-3 lg:h-5 text-primary/30 z-[-1]" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 9.5C50.5 3.5 150.5 3.5 197.5 9.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Donify democratiza las donaciones. Suscríbete por menos de lo que cuesta un café, vota por las causas que te importan y ve tu impacto en tiempo real.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button
                onClick={() => onShowPaymentWizard()}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white text-lg px-8 py-4 rounded-full font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Empezar a Donar <ArrowRight size={20} />
              </button>
              <button
                onClick={() => onNavigate('how-it-works')}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 text-lg px-8 py-4 rounded-full font-bold shadow-sm border border-gray-200 transition-all hover:border-gray-300"
              >
                Ver Demo
              </button>
            </div>
          </main>
        </div>

        {/* STATS BANNER */}
        <div
          ref={statsAnimation.ref}
          className={`bg-teal-50 py-6 border-y border-teal-100/50 transition-all duration-700 ${statsAnimation.isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}
        >
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-14 text-sm font-semibold text-gray-700">
            <div className="flex items-center gap-2"><Zap className="text-primary w-5 h-5 flex-shrink-0" /> <span>Empezar a donar no tiene costes extra</span></div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-teal-300"></div>
            <div className="flex items-center gap-2"><Activity className="text-primary w-5 h-5 flex-shrink-0" /> <span>Impacto trackeado en tiempo real</span></div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-teal-300"></div>
            <div className="flex items-center gap-2"><Users className="text-primary w-5 h-5 flex-shrink-0" /> <span>El poder de miles de votos unidos</span></div>
          </div>
        </div>

        {/* CÓMO FUNCIONA - VÍDEO BANNERS */}
        <section
          ref={videoAnimation.ref}
          className={`max-w-7xl mx-auto px-6 py-20 lg:py-28 ${videoAnimation.isVisible ? 'animate-fade-in-up opacity-100' : 'opacity-0'}`}
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <span className="text-primary font-bold uppercase tracking-widest text-xs mb-3 block">Descubre Donify</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Que tu recaudación tenga el mayor éxito</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Empieza en solo unos minutos: regístrate, elige tu nivel de suscripción y obtén potestad inmediata de voto. Cada mes, tus fondos se unen a los de miles de personas para donar de forma contundente a la organización ganadora de las votaciones.
              </p>
              <button
                onClick={() => onNavigate('how-it-works')}
                className="font-bold text-gray-900 border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 rounded-full px-8 py-3 transition-colors shadow-sm"
              >
                Saber más
              </button>
            </div>
            <div className="flex-1 w-full max-w-xl mx-auto">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 group cursor-pointer" onClick={() => onNavigate('how-it-works')}>
                <img src="https://images.unsplash.com/photo-1593113563332-ce6b71026ce8?auto=format&fit=crop&q=80&w=1200" alt="Video tutorial cover" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                    <PlayCircle className="w-5 h-5 text-primary" /> Reproducir vídeo de 1 min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION (Premium Translucent Light Theme) */}
        <section id="pricing" className="py-16 md:py-24 bg-[#f8fdfd] relative overflow-hidden border-y border-gray-100/50">
          {/* Base translucent gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#b5e3e8]/40 via-[#b5e3e8]/10 to-transparent"></div>

          {/* Floating glowing orbs for depth */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#b5e3e8]/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#b5e3e8]/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-[#f8fdfd]/60 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

          {/* Dotted texture overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>

          <div className="mb-14 relative z-10 px-6 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="text-left max-w-2xl">
              <span className="text-primary-dark font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-2 block drop-shadow-sm">Suscripciones</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 tracking-tight drop-shadow-sm">Elige tu nivel de impacto</h2>
              <p className="text-base text-gray-700 font-medium opacity-90">
                Transparencia total. Cancela cuando quieras. El 100% de tu voto cuenta.
              </p>
            </div>

            {/* TOGGLE */}
            <div className="flex-shrink-0 md:pb-2">
              <div className="bg-white/60 p-1 rounded-full flex relative shadow-inner border border-white/40 backdrop-blur-sm">
                <div
                  className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${pricingMode === 'pro' ? 'translate-x-full' : 'translate-x-0'}`}
                ></div>
                <button
                  onClick={() => setPricingMode('simple')}
                  className={`relative z-10 px-5 py-2 rounded-full font-bold text-sm transition-colors ${pricingMode === 'simple' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Simple (0.99€)
                </button>
                <button
                  onClick={() => setPricingMode('pro')}
                  className={`relative z-10 px-5 py-2 rounded-full font-bold text-sm transition-colors ${pricingMode === 'pro' ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Pro (1.99€)
                </button>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto relative z-10">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                style={{ backgroundColor: tier.cardBg }}
                className={`relative group rounded-[1.5rem] p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col overflow-hidden border ${tier.border}`}
              >
                {/* Soft gradient aura behind the content */}
                <div className={`absolute inset-0 opacity-10 ${tier.gradient} pointer-events-none transition-opacity duration-300 group-hover:opacity-20`}></div>

                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-xl ${tier.button} flex items-center justify-center mb-4 shadow-sm border border-white/50 backdrop-blur-sm`}>
                    <tier.icon size={24} />
                  </div>

                  <h3 className={`text-xl font-bold text-gray-900 mb-0.5`}>{tier.name}</h3>
                  <span className={`text-base font-extrabold ${tier.text} tracking-tight block mb-1 drop-shadow-sm`}>{tier.frequency}</span>
                  <p className="text-gray-500 text-xs mb-4">{tier.description}</p>

                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-bold text-gray-900">€{tier.price}</span>
                    <span className="text-gray-500 font-medium text-sm">/{tier.period}</span>
                  </div>

                  <ul className="space-y-2 mb-6 text-left flex-1">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700 font-medium">
                        <CheckCircle size={14} className={`shrink-0 mt-0.5 ${tier.text}`} />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onShowPaymentWizard(tier.id as SubscriptionTier, pricingMode)}
                    className={`w-full py-2.5 rounded-lg font-bold border transition-all hover:scale-105 active:scale-95 text-sm ${tier.button}`}
                  >
                    Suscribirse
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DONATION BANNER — potencia la organización con 5€ */}
          <div className="relative z-10 px-6 max-w-7xl mx-auto mt-10 mb-4">
            <button
              onClick={handleDonate5}
              disabled={isDonating}
              className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-200 border-2 border-dashed border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:border-rose-400 hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed group"
            >
              {isDonating ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <Heart size={22} className="fill-rose-400 text-rose-400 group-hover:scale-110 transition-transform" />
              )}
              <span>
                {isDonating ? 'Procesando...' : 'Donar 5€ y potenciar a la organización'}
              </span>
              {!isDonating && (
                <span className="ml-1 text-rose-400 text-xl">❤️</span>
              )}
            </button>
          </div>

        </section>


        {/* VOTING SECTION (Real Data) */}
        <VotingSection />

        {/* DONIFY STORY (PREMIUM GOFUNDME STYLE) */}
        <section
          ref={storyAnimation.ref}
          className={`relative w-full py-20 overflow-hidden transition-all duration-1000 ${storyAnimation.isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Beautiful very light warm background (like GoFundMe's beige sections) */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#fcfbf9] to-[#f4f7f4] -z-20" />

          {/* Abstract GoFundMe-like yellow/primary stripe or circle in the background */}
          <div
            className={`absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 transition-transform duration-1000 delay-500 -z-10 ${storyAnimation.isVisible ? 'scale-100' : 'scale-50'}`}
          />
          <div
            className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 transition-transform duration-1000 delay-700 -z-10 ${storyAnimation.isVisible ? 'scale-100' : 'scale-50'}`}
          />

          {/* Logo watermark pattern (very subtle) */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: 'url(/donify_logo.jpg)',
              backgroundSize: '100px 100px',
              backgroundRepeat: 'repeat',
              opacity: 0.02,
            }}
          />

          <div className="relative z-10 max-w-5xl mx-auto px-6">

            {/* Header Area */}
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-block py-1.5 px-4 rounded-full bg-white shadow-sm border border-gray-100 text-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs mb-6">
                Nuestra Historia
              </span>

              <h2 className={`text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-6 tracking-tight transition-all duration-1000 delay-100 ${storyAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                Donify nace de la simple idea de querer ayudar.
              </h2>

              <p className={`text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-medium transition-all duration-1000 delay-200 ${storyAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                Queremos marcar una diferencia en nuestra sociedad tan llena de injusticias. La idea, en nuestra opinión, es brillante porque soluciona los problemas modernos que sufre la filantropía:
              </p>
            </div>

            {/* The 3 Pillars as elegant floating cards */}
            <div className={`grid md:grid-cols-3 gap-6 mb-20 transition-all duration-1000 delay-300 ${storyAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>

              {/* Pillar 1 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
                <div className="w-12 h-12 bg-[#f0f9f4] text-primary rounded-2xl flex items-center justify-center mb-5 border border-primary/10">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="text-primary font-black text-3xl opacity-10 absolute bottom-5 right-5 pointer-events-none">01</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Suscripciones fuera del alcance de <span className="text-primary">TODOS</span></h3>
                <p className="text-gray-500 text-sm leading-relaxed">Hemos creado un sistema flexible y con un amplio rango de posibles donaciones para que cualquiera pueda participar.</p>
              </div>

              {/* Pillar 2 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
                <div className="w-12 h-12 bg-[#f0f9f4] text-primary rounded-2xl flex items-center justify-center mb-5 border border-primary/10">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-primary font-black text-3xl opacity-10 absolute bottom-5 right-5 pointer-events-none">02</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Falta de <span className="text-primary">TRANSPARENCIA</span> en donaciones</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Transparencia radical con el único objetivo en mente de ayudar y saber exactamente a dónde va cada céntimo.</p>
              </div>

              {/* Pillar 3 */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110" />
                <div className="w-12 h-12 bg-[#f0f9f4] text-primary rounded-2xl flex items-center justify-center mb-5 border border-primary/10">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-primary font-black text-3xl opacity-10 absolute bottom-5 right-5 pointer-events-none">03</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No tener sistemas <span className="text-primary">DEMOCRÁTICOS</span></h3>
                <p className="text-gray-500 text-sm leading-relaxed">La opinión de todos vosotros es la que vale para decidir a quién ayudamos activamente cada mes.</p>
              </div>

            </div>

            {/* Tagline & Call to action */}
            <div className={`text-center transition-all duration-1000 delay-500 ${storyAnimation.isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="inline-block relative">
                {/* Decorative brackets */}
                <div className="absolute -left-6 -top-6 text-[5rem] sm:text-[6rem] font-serif text-primary/10 leading-none select-none">"</div>
                <div className="absolute -right-6 -bottom-10 text-[5rem] sm:text-[6rem] font-serif text-primary/10 leading-none select-none">"</div>

                <p className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-8 relative z-10">
                  Tu donación, <br />
                  <span className="text-primary relative inline-block mt-2">
                    tu decisión.
                    {/* Underline swoosh */}
                    <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary/30" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.20312 9.42173C48.6946 3.90382 121.365 -0.662285 197.809 7.72898" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                  </span>
                </p>
              </div>

              {/* Minimalistic Guarantee Link - Elevated style */}
              <div className="mt-6 flex justify-center">
                <div onClick={() => window.open('/transparency', '_blank')} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer group px-6 py-3 rounded-full hover:bg-white/50 border border-transparent hover:border-gray-200">
                  <ShieldCheck className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-lg font-medium">Lee la <span className="underline decoration-2 underline-offset-[6px] text-gray-900 group-hover:text-primary transition-colors">Garantía de Donativos</span> de Donify</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* VOICES OF IMPACT - TESTIMONIALS */}
        <div className="max-w-7xl mx-auto mb-32 relative">
          {/* Personal Backdrop/Pattern */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-blue-50/50 rounded-3xl -z-10" />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />


          <div className="text-center mb-12 pt-12">
            <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">Comunidad Donify</span>
            <h3 className="text-3xl font-bold text-gray-900">Historias Reales de Impacto</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 px-8 pb-12">
            {[
              {
                name: "Laura Gómez",
                role: "Suscriptora Nivel Oro",
                quote: "Nunca pensé que 2€ pudieran sentirse tan poderosos. Ver cómo mi voto ayuda a decidir el destino de los fondos es increíble.",
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
              },
              {
                name: "Carlos Ruiz",
                role: "Suscriptor",
                quote: "La transparencia lo es todo para mí. Aquí sé exactamente a dónde va cada céntimo. Es la forma más honesta de ayudar.",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
              },
              {
                name: "Inés Cuevas",
                role: "Voluntaria y Donante",
                quote: "Me encanta la comunidad. No es solo dar dinero, es ser parte de un movimiento que elige qué problemas solucionar hoy.",
                img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
              }
            ].map((person, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-white/50 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <img src={person.img} loading="lazy" width="48" height="48" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt={person.name} />
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{person.name}</div>
                    <div className="text-xs text-primary font-medium">{person.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm italic leading-relaxed">"{person.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
