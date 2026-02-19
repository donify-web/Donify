import React, { useState } from 'react';
import { PageView, SubscriptionTier, SubscriptionType } from '../../types';
import { Coins, Heart, CheckCircle, ArrowRight, ShieldCheck, Globe, Star, Zap, Crown } from 'lucide-react';
import { Logo } from '../shared/Logo';

interface LandingProps {
  onNavigate: (view: PageView) => void;
  onShowPaymentWizard: (tier?: SubscriptionTier, type?: SubscriptionType) => void;
  onShowBenefits: () => void;
  onJoinClick: () => void;
}

export default function Landing({ onNavigate, onShowPaymentWizard, onShowBenefits, onJoinClick }: LandingProps) {
  const [pricingMode, setPricingMode] = useState<SubscriptionType>('simple');

  const tiers = [
    {
      id: 'bronce',
      name: 'Bronce',
      price: pricingMode === 'simple' ? 0.99 : 1.99,
      period: 'mes',
      icon: ShieldCheck,
      description: 'Tu impacto empieza aquí',
      gradient: 'bg-gradient-bronze',
      border: 'border-orange-200',
      text: 'text-amber-800',
      button: 'bg-amber-100 text-amber-900 hover:bg-amber-200',
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
      icon: Star,
      description: 'Más compromiso, más ayuda',
      gradient: 'bg-gradient-silver',
      border: 'border-gray-200',
      text: 'text-gray-800',
      button: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
      features: [
        'Potestad de voto',
        'Certificado de donación (PDF Plata)'
      ]
    },
    {
      id: 'oro',
      name: 'Oro',
      price: pricingMode === 'simple' ? 0.99 : 1.99,
      period: 'semana',
      icon: Zap,
      description: 'Lidera el cambio real',
      gradient: 'bg-gradient-gold',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      button: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200',
      features: [
        'Potestad de voto',
        'Certificado de donación (PDF Oro)',
        'Acceso exclusivo a informes mensuales de datos de donaciones'
      ]
    },
    {
      id: 'diamante',
      name: 'Diamante',
      price: pricingMode === 'simple' ? 0.99 : 1.99,
      period: '4 días',
      icon: Crown,
      description: 'Impacto transformador',
      gradient: 'bg-gradient-diamond',
      border: 'border-cyan-200',
      text: 'text-cyan-900',
      button: 'bg-cyan-100 text-cyan-900 hover:bg-cyan-200',
      features: [
        'Potestad de voto',
        'Certificado de donación (PDF Diamante)',
        'Acceso exclusivo a informes mensuales de datos de donaciones'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-bgMain overflow-hidden font-sans relative">

      <div className="relative z-10">

        {/* HERO SECTION */}
        <header className="px-6 lg:px-12 py-6 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer glass-card px-4 py-2 rounded-full" onClick={() => onNavigate('landing')}>
            <Logo className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-gray-800 tracking-tight">Donify</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => onNavigate('how-it-works')} className="text-gray-600 hover:text-primary font-medium transition-colors">Cómo funciona</button>
            <button onClick={() => onNavigate('organizations')} className="text-gray-600 hover:text-primary font-medium transition-colors">Organizaciones</button>
            <button onClick={() => onNavigate('login')} className="text-gray-600 hover:text-primary font-medium transition-colors">Iniciar Sesión</button>
            <button
              onClick={onJoinClick}
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Unirse Ahora
            </button>
          </nav>
          <button className="md:hidden text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
          </button>
        </header>

        <main className="max-w-7xl mx-auto px-6 pt-12 pb-24 lg:pt-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Revolucionando la filantropía
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Tu cambio suelto <br />
            <span className="text-gradient">cambia el mundo.</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Donify democratiza las donaciones. Suscríbete por menos de lo que cuesta un café, vota por las causas que te importan y ve tu impacto en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <button
              onClick={onJoinClick}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white text-lg px-8 py-4 rounded-full font-bold shadow-xl shadow-primary/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Empezar a Donar <ArrowRight size={20} />
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="w-full sm:w-auto bg-white/80 hover:bg-white text-gray-700 text-lg px-8 py-4 rounded-full font-bold shadow-sm border border-gray-200 transition-all hover:border-gray-300"
            >
              Ver Demo
            </button>
          </div>

          {/* STATISTICS / SOCIAL PROOF */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-32 border-t border-b border-gray-200/50 py-12 bg-white/30 backdrop-blur-sm rounded-3xl">
            {[
              { label: 'Donantes Activos', value: '1,240+' },
              { label: 'Fondos Recaudados', value: '€45k+' },
              { label: 'Proyectos Financiados', value: '32' },
              { label: 'ONGs Verificadas', value: '15' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* PRICING SECTION */}
          <div id="pricing" className="mb-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">Elige tu nivel de impacto</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
                Transparencia total. Cancela cuando quieras. El 100% de tu voto cuenta.
              </p>

              {/* TOGGLE */}
              <div className="flex items-center justify-center mb-10">
                <div className="bg-gray-100 p-1 rounded-full flex relative">
                  <div
                    className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${pricingMode === 'pro' ? 'translate-x-full' : 'translate-x-0'}`}
                  ></div>
                  <button
                    onClick={() => setPricingMode('simple')}
                    className={`relative z-10 px-6 py-2 rounded-full font-bold text-sm transition-colors ${pricingMode === 'simple' ? 'text-gray-900' : 'text-gray-500'}`}
                  >
                    Simple (0.99€)
                  </button>
                  <button
                    onClick={() => setPricingMode('pro')}
                    className={`relative z-10 px-6 py-2 rounded-full font-bold text-sm transition-colors ${pricingMode === 'pro' ? 'text-gray-900' : 'text-gray-500'}`}
                  >
                    Pro (1.99€)
                  </button>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative group rounded-3xl p-6 sm:p-8 border ${tier.border} ${tier.gradient} bg-opacity-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${tier.button} flex items-center justify-center mb-6 shadow-inner`}>
                    <tier.icon size={28} />
                  </div>

                  <h3 className={`text-2xl font-bold ${tier.text} mb-2`}>{tier.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 h-10">{tier.description}</p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-gray-900">€{tier.price}</span>
                    <span className="text-gray-500 font-medium">/{tier.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8 text-left flex-1">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                        <CheckCircle size={16} className={`shrink-0 mt-0.5 ${tier.text}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => onShowPaymentWizard(tier.id as SubscriptionTier, pricingMode)}
                    className={`w-full py-4 rounded-xl font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${tier.button} border border-black/5`}
                  >
                    Suscribirse
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button onClick={onShowBenefits} className="text-gray-500 hover:text-primary underline text-sm transition-colors">
                Ver comparación detallada de beneficios
              </button>
            </div>
          </div>

          {/* TRUST INDICATORS */}
          <div className="py-20 border-t border-gray-200/50">
            <h3 className="text-gray-400 font-semibold uppercase tracking-widest text-sm mb-10">Con la confianza de</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-2xl font-black text-gray-800 flex items-center gap-2"><Globe className="text-primary" /> GlobalGiving</div>
              <div className="text-2xl font-black text-gray-800 flex items-center gap-2"><ShieldCheck className="text-primary" /> CharityWatch</div>
              <div className="text-2xl font-black text-gray-800 flex items-center gap-2"><Heart className="text-primary" /> Benevity</div>
            </div>
          </div>

        </main>

        <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Logo className="w-6 h-6 text-gray-400" />
              <span className="font-semibold text-gray-500">Donify © 2026</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-500">
              <button onClick={() => onNavigate('legal')} className="hover:text-gray-900">Términos</button>
              <button onClick={() => onNavigate('legal')} className="hover:text-gray-900">Privacidad</button>
              <button onClick={() => onNavigate('cookies')} className="hover:text-gray-900">Cookies</button>
              <button onClick={() => onNavigate('contact')} className="hover:text-gray-900">Contacto</button>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
