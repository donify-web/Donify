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
} from 'lucide-react';
import { Logo } from '../shared/Logo';

interface HowItWorksProps {
  onNavigate: (view: PageView) => void;
}

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  const [donorCount, setDonorCount] = useState(1000);
  const [pricingMode, setPricingMode] = useState<'simple' | 'pro'>('simple');
  const [selectedTier, setSelectedTier] = useState<'bronze' | 'silver' | 'gold' | 'diamond'>('bronze');

  const multipliers = {
    bronze: 1,
    silver: 2,
    gold: 4.33,
    diamond: 7.5
  };

  const baseAmount = pricingMode === 'simple' ? 0.99 : 1.99;
  const donationsPerMonth = multipliers[selectedTier];
  const totalGrossMonthly = donorCount * baseAmount * donationsPerMonth;

  return (
    <div className="min-h-screen bg-white font-sans text-textMain animate-in fade-in duration-500 overflow-hidden">

      {/* HEADER OVERLAY */}
      <header className="absolute top-0 w-full px-6 lg:px-12 py-5 flex items-center max-w-7xl mx-auto left-0 right-0 z-50">
        <div className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full border border-white/50 shadow-sm bg-white/70 backdrop-blur-md hover:bg-white/90 transition-colors" onClick={() => onNavigate('landing')}>
          <Logo className="w-7 h-7 text-primary" />
          <span className="font-bold text-lg text-gray-800 tracking-tight">Donify</span>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-14 px-6 flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#fcfbf9] to-[#f4f7f4] -z-20" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="absolute inset-0 bg-pattern-dots opacity-30 mix-blend-multiply pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold text-primary uppercase tracking-widest animate-fade-in-up">
            <ShieldCheck size={14} /> Transparencia Radical
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-[#1c232f] leading-tight tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            La democracia de la donación,{' '}
            <span className="relative inline-block text-primary">
              explicada.
              <svg className="absolute -bottom-1 left-0 w-full h-3 text-primary/30 z-[-1]" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M2.5 9.5C50.5 3.5 150.5 3.5 197.5 9.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Entiende el viaje de tu euro con <strong>Donify</strong>: desde tu bolsillo hasta el terreno, sin cajas negras y con total control democrático.
          </p>
        </div>
      </section>

      {/* ── COLOR DIVIDER 1 ── */}
      <div className="bg-teal-50 border-y border-teal-100/60 py-3 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 text-xs font-semibold text-gray-600">
          <span className="flex items-center gap-1.5"><ShieldCheck size={14} className="text-primary" /> Transparencia total</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-teal-300" />
          <span className="flex items-center gap-1.5"><Users size={14} className="text-primary" /> El poder de miles de votos</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-teal-300" />
          <span className="flex items-center gap-1.5"><Gift size={14} className="text-primary" /> Impacto real en tiempo real</span>
        </div>
      </div>

      {/* ── PIPELINE SECTION ── */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">El proceso, paso a paso</h2>
          <p className="text-sm text-gray-500 font-medium">Tres pasos para que tu donación tenga el impacto correcto.</p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-[4rem] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-blue-100 via-purple-100 to-green-100 -z-10" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#eef5fa] rounded-full flex items-center justify-center mb-4 text-primary border border-primary/10 shadow-inner group-hover:scale-110 transition-transform">
                <Coins size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">1. El Bote Común</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">Tu donación se une a la comunidad Donify. Juntos creamos un fondo masivo que cambia realidades.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-purple-600 border border-purple-100 shadow-inner group-hover:scale-110 transition-transform">
                <Vote size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">2. Votación Democrática</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">Cada mes, la comunidad decide a dónde va el 100% del bote. Tu voto cuenta igual que el de todos.</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#f0f9f4] rounded-full flex items-center justify-center mb-4 text-green-600 border border-green-100 shadow-inner group-hover:scale-110 transition-transform">
                <Gift size={28} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">3. Ejecución Directa</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">La causa ganadora recibe los fondos. Recibes reportes claros de cómo se aplicó cada aportación.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLOR DIVIDER 2 ── */}
      <div className="bg-gradient-to-r from-primary/10 via-[#eef5fa] to-primary/10 border-y border-primary/10 h-3" />

      {/* ── CALCULATOR SECTION ── */}
      <section className="py-12 px-6 relative bg-[#f8fdfd]">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-[1fr,400px]">
            {/* Left: Controls */}
            <div className="p-6 md:p-10 space-y-7">
              <div>
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-2">
                  <Calculator size={16} /> Calculadora de Impacto
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                  El poder de la <span className="text-primary">multitud</span>.
                </h2>
                <p className="text-sm text-gray-500 font-medium mt-2">
                  Simula cómo cambia el mundo cuando nos unimos.
                </p>
              </div>

              {/* Simple / Pro Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <button onClick={() => setPricingMode('simple')} className={`px-5 py-2 rounded-lg font-bold text-xs transition-all ${pricingMode === 'simple' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Simple (0.99€)</button>
                <button onClick={() => setPricingMode('pro')} className={`px-5 py-2 rounded-lg font-bold text-xs transition-all ${pricingMode === 'pro' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Pro (1.99€)</button>
              </div>

              {/* Donor Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Comunidad: <span className="text-primary font-black text-xl ml-1">{donorCount.toLocaleString()}</span> donantes
                </label>
                <input type="range" min="100" max="100000" step="100" value={donorCount} onChange={(e) => setDonorCount(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
              </div>

              {/* Tier Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Nivel de compromiso:</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { key: 'bronze', label: 'Bronce', sub: 'mes', color: 'bg-orange-50 border-orange-200 text-orange-800' },
                    { key: 'silver', label: 'Plata', sub: 'quincena', color: 'bg-gray-100 border-gray-300 text-gray-800' },
                    { key: 'gold', label: 'Oro', sub: 'semana', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
                    { key: 'diamond', label: 'Diamante', sub: '4 días', color: 'bg-cyan-50 border-cyan-200 text-cyan-900' },
                  ].map(({ key, label, sub, color }) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTier(key as any)}
                      className={`px-2 py-3 rounded-xl border-2 text-xs font-bold transition-all ${selectedTier === key ? `${color} shadow-sm` : 'border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'}`}
                    >
                      {label} <span className="block text-[10px] font-normal text-gray-500 mt-0.5">{baseAmount}€ / {sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Result Panel */}
            <div className="bg-primary text-white p-6 md:p-10 flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-[0.05] pointer-events-none scale-150 translate-x-8 -translate-y-8">
                <Calculator size={200} />
              </div>
              <div className="relative z-10 w-full space-y-6">
                <div>
                  <div className="text-blue-100 font-bold mb-2 uppercase tracking-widest text-[10px]">Juntos generaríamos</div>
                  <div className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-md">
                    {totalGrossMonthly.toLocaleString('es-ES', { maximumFractionDigits: 0 })}€
                  </div>
                  <div className="text-blue-100 mt-2 font-medium text-xs">cada mes para transformar realidades</div>
                </div>

                <div className="bg-white/10 rounded-xl p-5 w-full backdrop-blur-md text-left border border-white/20">
                  <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Equivale a:</div>
                  <div className="space-y-4">
                    {[
                      { icon: <Gift size={18} />, value: Math.floor(totalGrossMonthly / 2), label: 'Comidas calientes (aprox 2€/ud)' },
                      { icon: <Users size={18} />, value: Math.floor(totalGrossMonthly / 15), label: 'Días de educación (aprox 15€/día)' },
                      { icon: <ShieldCheck size={18} />, value: Math.floor(totalGrossMonthly / 50), label: 'Familias aseguradas (aprox 50€/mes)' },
                    ].map(({ icon, value, label }, i) => (
                      <div key={i} className="flex items-center gap-3 group">
                        <div className="p-2 bg-white/20 rounded-lg shrink-0 group-hover:bg-white/30 transition-colors">{icon}</div>
                        <div>
                          <span className="font-bold text-lg block">{value.toLocaleString('es-ES')}</span>
                          <span className="text-blue-100 text-[11px] font-medium">{label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── COLOR DIVIDER 3 ── */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 border-y border-gray-100 h-3" />

      {/* ── FAQ TEASER ── */}
      <section className="py-12 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#f8fdfd] border border-gray-100 rounded-2xl p-7 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <HelpCircle size={22} />
              </div>
              <div>
                <h3 className="text-base font-black text-gray-900 mb-0.5">¿Tienes más preguntas?</h3>
                <p className="text-sm text-gray-500">Consulta las preguntas frecuentes.</p>
              </div>
            </div>
            <button onClick={() => onNavigate('faq')} className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shrink-0 shadow-sm">
              Ver FAQ <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}