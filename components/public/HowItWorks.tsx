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
  ArrowRight
} from 'lucide-react';

interface HowItWorksProps {
  onNavigate: (view: PageView) => void;
}

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  // Calculator State
  const [donorCount, setDonorCount] = useState(1000);
  const [avgDonation, setAvgDonation] = useState(0.99); // Simple vs Pro

  const monthlyImpact = (donorCount * avgDonation).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });



  return (
    <div className="min-h-screen bg-white font-sans text-textMain animate-in fade-in duration-500">
      {/* HERO SECTION */}
      <section className="pt-40 pb-24 px-6 bg-gradient-to-b from-[#eef5fa] to-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-semibold text-primary mb-2">
            <ShieldCheck size={16} /> Transparencia Radical
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-[#1c232f] leading-tight tracking-tight">
            La democracia de la donación,{' '}
            <span className="relative inline-block text-primary z-10 whitespace-nowrap">
              explicada.
              <svg className="absolute -bottom-1 lg:-bottom-2 left-0 w-full h-3 lg:h-5 text-primary/30 z-[-1]" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 9.5C50.5 3.5 150.5 3.5 197.5 9.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            Entiende el viaje de tu aportación: desde tu bolsillo hasta el terreno, sin cajas negras, sin intermediarios innecesarios y con total control democrático.
          </p>
        </div>
      </section>

      {/* THE PIPELINE (Visual Core Loop) */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-b border-gray-100">
        <div className="relative">
          {/* Connecting Line (Desktop: Horizontal, Mobile: Hidden/Vertical logic in layout) */}
          <div className="hidden md:block absolute top-[4.5rem] left-[10%] right-[10%] h-0 border-t-[3px] border-dashed border-gray-200 -z-10"></div>

          <div className="grid md:grid-cols-3 gap-12">

            {/* STEP 1: THE POT */}
            <div className="relative flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 z-10 transition-transform duration-500 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="w-28 h-28 bg-blue-50/80 rounded-full flex items-center justify-center mb-8 text-blue-600 shadow-sm border border-blue-100/50">
                <Coins size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">1. El Bote Común</h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                Tu donación mensual (0.99€ o más) se une a la de miles de personas. No es mucho por separado, pero junto crea un fondo masivo capaz de cambiar realidades.
              </p>
            </div>

            {/* STEP 2: THE VOTE */}
            <div className="relative flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 z-10 transition-transform duration-500 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="w-28 h-28 bg-purple-50/80 rounded-full flex items-center justify-center mb-8 text-purple-600 shadow-sm border border-purple-100/50">
                <Vote size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">2. Votación Democrática</h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                Cada mes, la comunidad recibe 3 propuestas de ONGs verificadas. Tú decides a dónde va el 100% del bote con tu voto. Sin despachos cerrados.
              </p>
            </div>

            {/* STEP 3: THE IMPACT */}
            <div className="relative flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 z-10 transition-transform duration-500 hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="w-28 h-28 bg-green-50/80 rounded-full flex items-center justify-center mb-8 text-green-600 shadow-sm border border-green-100/50">
                <Gift size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">3. Ejecución Directa</h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                La causa ganadora recibe los fondos inmediatamente. Recibes un reporte con fotos y facturas demostrando en qué se gastó exactamente cada aportación.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CALCULATOR SECTION */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="grid md:grid-cols-2">
            <div className="p-10 md:p-14 space-y-10">
              <div className="flex items-center gap-3 text-primary font-bold tracking-wide uppercase text-sm">
                <Calculator size={20} />
                Calculadora de Impacto
              </div>
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">El poder de la multitud</h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Juega con los números y mira lo que pasa cuando nos unimos. Un pequeño esfuerzo individual se convierte en una fuerza imparable.
                </p>
              </div>

              <div className="space-y-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div>
                  <label className="flex justify-between text-base font-medium text-gray-700 mb-4">
                    <span>Si fuéramos...</span>
                    <span className="text-primary font-black text-xl">{donorCount.toLocaleString()} donantes</span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={donorCount}
                    onChange={(e) => setDonorCount(parseInt(e.target.value))}
                    className="w-full h-2.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-4">
                    Donando un promedio mensual de...
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAvgDonation(0.99)}
                      className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${avgDonation === 0.99 ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      Bronce (0.99€)
                    </button>
                    <button
                      onClick={() => setAvgDonation(4.99)}
                      className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${avgDonation === 4.99 ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      Oro (4.99€)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#022b30] to-[#044c54] text-white p-10 md:p-14 flex flex-col justify-center relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10">
                <div className="text-teal-100/80 font-bold uppercase tracking-widest text-sm mb-4">Generaríamos</div>
                <div className="text-6xl lg:text-7xl font-black mb-4 tracking-tighter">{monthlyImpact}</div>
                <div className="text-teal-100 text-lg font-medium mb-10">cada mes para una causa</div>

                <div className="bg-white/10 rounded-2xl p-6 w-full backdrop-blur-md border border-white/10 space-y-4">
                  <div className="flex items-center gap-4 text-white">
                    <div className="p-3 bg-white/20 rounded-xl"><Users size={20} /></div>
                    <span className="font-semibold">Escuela en Kenia (construcción)</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="p-3 bg-white/20 rounded-xl"><Gift size={20} /></div>
                    <span className="font-semibold">3.000 Comidas calientes</span>
                  </div>
                  <div className="flex items-center gap-4 text-white">
                    <div className="p-3 bg-white/20 rounded-xl"><ShieldCheck size={20} /></div>
                    <span className="font-semibold">Refugio para 50 animales</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ TEASER — Link to dedicated page */}
      <section className="py-24 px-6 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#eef5fa] rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-inner">
                <HelpCircle size={32} />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-gray-900 mb-2">¿Tienes más preguntas?</p>
                <p className="text-lg text-gray-500 font-medium">Consulta nuestra sección detallada de preguntas frecuentes.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('faq')}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-base hover:bg-black hover:scale-105 transition-all shrink-0 shadow-lg shadow-gray-900/20"
            >
              Ver FAQ <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}