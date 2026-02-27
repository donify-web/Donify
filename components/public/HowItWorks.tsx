import React, { useState } from 'react';
import { PageView } from '../../types';
import {
  Coins,
  Vote,
  ShieldCheck,
  Calculator,
  Users,
  Gift,
  HelpCircle,
  ArrowRight,
  Heart,
  Globe,
  Award
} from 'lucide-react';
import { Logo } from '../shared/Logo';

interface HowItWorksProps {
  onNavigate: (view: PageView) => void;
}

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  // Calculator State
  const [donorCount, setDonorCount] = useState(1000);
  const [pricingMode, setPricingMode] = useState<'simple' | 'pro'>('simple');
  const [selectedTier, setSelectedTier] = useState<'bronze' | 'silver' | 'gold' | 'diamond'>('bronze');

  // Multipliers based on frequency (donations per month)
  const multipliers = {
    bronze: 1, // Monthly
    silver: 2, // Bi-weekly (aprox 2 per month)
    gold: 4.33, // Weekly (aprox 4.33 per month)
    diamond: 7.5 // Every 4 days (aprox 7.5 per month)
  };

  const baseAmount = pricingMode === 'simple' ? 0.99 : 1.99;
  const donationsPerMonth = multipliers[selectedTier];
  const grossMonthlyPerUser = baseAmount * donationsPerMonth;
  const totalGrossMonthly = donorCount * grossMonthlyPerUser;

  return (
    <div className="min-h-screen bg-white font-sans text-textMain animate-in fade-in duration-500 overflow-hidden">
      {/* HEADER OVERLAY */}
      <header className="absolute top-0 w-full px-6 lg:px-12 py-6 flex justify-between items-center max-w-7xl mx-auto left-0 right-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer glass-card px-4 py-2 rounded-full border border-gray-200 shadow-sm bg-white/80 backdrop-blur-md hover:bg-white transition-colors" onClick={() => onNavigate('landing')}>
          <Logo className="w-8 h-8 text-primary" />
          <span className="font-bold text-xl text-gray-800 tracking-tight">Donify</span>
        </div>
      </header>

      {/* PREMIUM HERO SECTION (GoFundMe Style) */}
      <section className="relative pt-40 pb-20 px-6 min-h-[60vh] flex flex-col justify-center overflow-hidden">
        {/* Beautiful very light warm background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fcfbf9] to-[#f4f7f4] -z-20" />

        {/* Abstract floating blur elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 -z-10" />

        {/* Dotted pattern overlay */}
        <div className="absolute inset-0 bg-pattern-dots opacity-30 mix-blend-multiply pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest mb-2 animate-fade-in-up">
            <ShieldCheck size={16} /> Transparencia Radical
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[#1c232f] leading-tight tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            La democracia de la donación, <br className="hidden md:block" />
            <span className="relative inline-block text-primary mt-2">
              explicada.
              <svg className="absolute -bottom-1 lg:-bottom-2 left-0 w-full h-3 lg:h-4 text-primary/30 z-[-1]" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 9.5C50.5 3.5 150.5 3.5 197.5 9.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Entiende el viaje de tu euro con <strong>Donify</strong>: desde tu bolsillo hasta el terreno, sin cajas negras, sin intermediarios innecesarios y con total control democrático.
          </p>
        </div>
      </section>

      {/* THE PIPELINE (Visual Core Loop) - Elevated Cards */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">El proceso, paso a paso</h2>
          <p className="text-lg text-gray-500 font-medium">Tres simples pasos para asegurarnos de que tu donación tiene el impacto correcto.</p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 -z-10"></div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">

            {/* STEP 1: THE POT */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#eef5fa] rounded-full flex items-center justify-center mb-6 text-primary border border-primary/10 shadow-inner group-hover:scale-110 transition-transform">
                <Coins size={40} className="fill-primary/20" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">1. El Bote Común</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Tu donación mensual se une a la de la comunidad Donify. Separado es poco, pero junto crea un fondo masivo capaz de cambiar realidades mayores.
              </p>
            </div>

            {/* STEP 2: THE VOTE */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 text-purple-600 border border-purple-100 shadow-inner group-hover:scale-110 transition-transform">
                <Vote size={40} className="fill-purple-200" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">2. Votación Democrática</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                Cada mes proponemos causas verificadas. Toda la comunidad de Donify decide a dónde va el 100% del bote. Sin despachos cerrados.
              </p>
            </div>

            {/* STEP 3: THE IMPACT */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-[#f0f9f4] rounded-full flex items-center justify-center mb-6 text-green-600 border border-green-100 shadow-inner group-hover:scale-110 transition-transform">
                <Gift size={40} className="fill-green-200" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">3. Ejecución Directa</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                La causa ganadora recibe los fondos inmediatamente. Recibes reportes claros demostrando cómo se aplicó cada aportación.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* PARTNERS / CREDIBILITY SECTION */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Con la confianza de organizaciones e iniciativas como</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Trust Badges - Generic placeholders but with real-world associations */}
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><Globe size={28} /> GlobalTrust</div>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><Heart size={28} /> EcoAction Net</div>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><Award size={28} /> VerifiedNGO</div>
            <div className="flex items-center gap-2 text-xl font-bold text-gray-800"><ShieldCheck size={28} /> SecurPay</div>
          </div>
          <p className="max-w-2xl mx-auto mt-10 text-gray-500 font-medium">
            Trabajamos mano a mano con pequeños colaboradores y herramientas líderes (como Stripe) para asegurar que la seguridad y transparencia de Donify sean de grado institucional.
          </p>
        </div>
      </section>

      {/* REFINED CALCULATOR SECTION (Gross Focus) */}
      <section className="py-24 bg-white px-6 relative">
        {/* Decorative subtle background for calculator section */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fdfd] to-[#eef5fa] opacity-60 pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-[1fr,450px]">
            <div className="p-8 md:p-12 lg:p-16 space-y-10">
              <div className="flex items-center gap-3 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                <Calculator size={20} />
                Calculadora de Impacto
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-none">
                El poder de la <span className="text-primary">multitud</span>.
              </h2>
              <p className="text-lg text-gray-600 font-medium">
                Al sumar muchas pequeñas aportaciones, el resultado es gigantesco. Simula cómo cambia el mundo cuando nos unimos.
              </p>

              <div className="space-y-10">
                {/* Mode Toggle */}
                <div className="flex bg-gray-100 p-1.5 rounded-2xl w-fit">
                  <button
                    onClick={() => setPricingMode('simple')}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${pricingMode === 'simple' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Modo Simple (0.99€)
                  </button>
                  <button
                    onClick={() => setPricingMode('pro')}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${pricingMode === 'pro' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Modo Pro (1.99€)
                  </button>
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-4">
                    Comunidad: <span className="text-primary font-black text-2xl ml-2">{donorCount.toLocaleString()}</span> donantes unidos
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={donorCount}
                    onChange={(e) => setDonorCount(parseInt(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-base font-medium text-gray-700 mb-4">
                    Nivel de compromiso de la comunidad:
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button
                      onClick={() => setSelectedTier('bronze')}
                      className={`px-3 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${selectedTier === 'bronze' ? 'bg-orange-50 border-orange-200 text-orange-800 shadow-sm' : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                    >
                      Bronce <span className="block text-xs font-medium text-gray-500 mt-1">{baseAmount}€ / mes</span>
                    </button>
                    <button
                      onClick={() => setSelectedTier('silver')}
                      className={`px-3 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${selectedTier === 'silver' ? 'bg-gray-100 border-gray-300 text-gray-800 shadow-sm' : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                    >
                      Plata <span className="block text-xs font-medium text-gray-500 mt-1">{baseAmount}€ / quincena</span>
                    </button>
                    <button
                      onClick={() => setSelectedTier('gold')}
                      className={`px-3 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${selectedTier === 'gold' ? 'bg-yellow-50 border-yellow-200 text-yellow-800 shadow-sm' : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                    >
                      Oro <span className="block text-xs font-medium text-gray-500 mt-1">{baseAmount}€ / semanal</span>
                    </button>
                    <button
                      onClick={() => setSelectedTier('diamond')}
                      className={`px-3 py-4 rounded-2xl border-2 text-sm font-bold transition-all ${selectedTier === 'diamond' ? 'bg-cyan-50 border-cyan-200 text-cyan-900 shadow-sm' : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                    >
                      Diamante <span className="block text-xs font-medium text-gray-500 mt-1">{baseAmount}€ / 4 días</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.05] -rotate-12 pointer-events-none scale-150 transform translate-x-12 -translate-y-12">
                <Calculator size={300} />
              </div>

              <div className="relative z-10 w-full space-y-8">
                <div>
                  <div className="text-blue-100 font-bold mb-3 uppercase tracking-widest text-xs">Juntos generaríamos</div>
                  <div className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-md">
                    {totalGrossMonthly.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€
                  </div>
                  <div className="text-blue-100 mt-3 font-medium text-sm">
                    cada mes para transformar realidades
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-6 w-full backdrop-blur-md text-sm text-left shadow-xl border border-white/20">
                  <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-4 border-b border-white/10 pb-3">Equivale mensualmente a:</div>
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 group">
                      <div className="p-3 bg-white/20 rounded-xl shrink-0 group-hover:bg-white/30 transition-colors"><Gift size={20} /></div>
                      <div>
                        <span className="font-bold text-xl md:text-2xl block">{Math.floor(totalGrossMonthly / 2).toLocaleString('es-ES')}</span>
                        <span className="text-blue-100 text-xs font-medium">Comidas calientes (aprox 2€/ud)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                      <div className="p-3 bg-white/20 rounded-xl shrink-0 group-hover:bg-white/30 transition-colors"><Users size={20} /></div>
                      <div>
                        <span className="font-bold text-xl md:text-2xl block">{Math.floor(totalGrossMonthly / 15).toLocaleString('es-ES')}</span>
                        <span className="text-blue-100 text-xs font-medium">Días de educación (aprox 15€/día)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group">
                      <div className="p-3 bg-white/20 rounded-xl shrink-0 group-hover:bg-white/30 transition-colors"><ShieldCheck size={20} /></div>
                      <div>
                        <span className="font-bold text-xl md:text-2xl block">{Math.floor(totalGrossMonthly / 50).toLocaleString('es-ES')}</span>
                        <span className="text-blue-100 text-xs font-medium">Familias aseguradas (aprox 50€/mes)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ TEASER — Premium Card */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-[#eef5fa] opacity-30 skew-y-2 -z-10 origin-top-left" />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-[2rem] p-10 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">

            {/* Decorative blob inside card */}
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-primary/5 rounded-tl-full pointer-events-none" />

            <div className="flex items-center gap-6 relative z-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <HelpCircle size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">¿Tienes más preguntas?</h3>
                <p className="text-base font-medium text-gray-500">Consulta los detalles en nuestras Preguntas Frecuentes.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('faq')}
              className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-base hover:bg-black transition-all shrink-0 relative z-10 shadow-md"
            >
              Ver FAQ <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="pt-24 pb-32 bg-[#1c232f] text-center px-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">¿Listo para ser parte del cambio?</h2>
          <p className="text-xl text-gray-400 mb-12 font-medium">Únete a la comunidad de Donify y empieza a votar hoy mismo.</p>
          <button
            onClick={() => onNavigate('pricing')}
            className="bg-primary hover:bg-primary-dark text-white px-10 py-5 rounded-full font-bold text-xl shadow-xl shadow-primary/30 transition-all transform hover:-translate-y-1 inline-flex items-center gap-3"
          >
            Empezar con 0.99€/mes <ArrowRight size={24} />
          </button>
        </div>
      </section>
    </div>
  );
}