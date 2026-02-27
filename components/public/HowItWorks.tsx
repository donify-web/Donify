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
      <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-bgMain to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-semibold text-primary mb-4">
            <ShieldCheck size={16} /> Transparencia Radical
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            La democracia de la donación, <span className="text-primary">explicada.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Entiende el viaje de tu euro: desde tu bolsillo hasta el terreno, sin cajas negras, sin intermediarios innecesarios y con total control democrático.
          </p>
        </div>
      </section>

      {/* THE PIPELINE (Visual Core Loop) */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="relative">
          {/* Connecting Line (Desktop: Horizontal, Mobile: Hidden/Vertical logic in layout) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-1 border-t-2 border-dashed border-gray-200 -z-10"></div>

          <div className="grid md:grid-cols-3 gap-12">

            {/* STEP 1: THE POT */}
            <div className="relative flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 z-10">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600 shadow-inner">
                <Coins size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">1. El Bote Común</h3>
              <p className="text-gray-500">
                Tu donación mensual (0.99€ o más) se une a la de miles de personas. No es mucho por separado, pero junto crea un fondo masivo capaz de cambiar realidades.
              </p>
            </div>

            {/* STEP 2: THE VOTE */}
            <div className="relative flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 z-10">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-6 text-purple-600 shadow-inner">
                <Vote size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Votación Democrática</h3>
              <p className="text-gray-500">
                Cada mes, la comunidad recibe 3 propuestas de ONGs verificadas. Tú decides a dónde va el 100% del bote con tu voto. Sin despachos cerrados.
              </p>
            </div>

            {/* STEP 3: THE IMPACT */}
            <div className="relative flex flex-col items-center text-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 z-10">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600 shadow-inner">
                <Gift size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Ejecución Directa</h3>
              <p className="text-gray-500">
                La causa ganadora recibe los fondos inmediatamente. Recibes un reporte con fotos y facturas demostrando en qué se gastó cada céntimo.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CALCULATOR SECTION */}
      <section className="py-20 bg-bgMain px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 space-y-8">
              <div className="flex items-center gap-3 text-primary font-bold">
                <Calculator size={24} />
                Calculadora de Impacto
              </div>
              <h2 className="text-3xl font-bold">El poder de la multitud</h2>
              <p className="text-gray-500">
                Juega con los números y mira lo que pasa cuando nos unimos. Un pequeño esfuerzo individual se convierte en una fuerza imparable.
              </p>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Si fuéramos <span className="text-primary font-bold">{donorCount.toLocaleString()}</span> donantes uniendo fuerzas
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={donorCount}
                    onChange={(e) => setDonorCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Con un nivel de compromiso de:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setAvgDonation(0.99)}
                      className={`px-3 py-3 rounded-xl border text-sm font-bold transition-all ${avgDonation === 0.99 ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      Bronce <span className="block text-[10px] font-normal mt-0.5">0.99€ / mes</span>
                    </button>
                    <button
                      onClick={() => setAvgDonation(2.00)} // (0.99 * (365/15) / 12) ~ 2.00
                      className={`px-3 py-3 rounded-xl border text-sm font-bold transition-all ${avgDonation === 2.00 ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      Plata <span className="block text-[10px] font-normal mt-0.5">0.99€ / quincenal</span>
                    </button>
                    <button
                      onClick={() => setAvgDonation(4.30)} // (0.99 * (365/7) / 12) ~ 4.30
                      className={`px-3 py-3 rounded-xl border text-sm font-bold transition-all ${avgDonation === 4.30 ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      Oro <span className="block text-[10px] font-normal mt-0.5">0.99€ / semanal</span>
                    </button>
                    <button
                      onClick={() => setAvgDonation(7.50)} // (0.99 * (365/4) / 12) ~ 7.50
                      className={`px-3 py-3 rounded-xl border text-sm font-bold transition-all ${avgDonation === 7.50 ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                    >
                      Diamante <span className="block text-[10px] font-normal mt-0.5">0.99€ / 4 días</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white p-8 md:p-12 flex flex-col justify-center items-center text-center relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 pointer-events-none">
                <Calculator size={120} />
              </div>

              <div className="relative z-10 w-full">
                <div className="text-blue-100 font-medium mb-2 uppercase tracking-widest text-xs">Juntos generaríamos</div>
                <div className="text-5xl md:text-6xl font-black mb-2 tracking-tight">{(donorCount * avgDonation).toLocaleString('es-ES', { maximumFractionDigits: 0 })}€</div>
                <div className="text-blue-100 mb-8 font-bold">cada mes para transformar realidades</div>

                <div className="bg-white/10 rounded-2xl p-5 w-full backdrop-blur-md text-sm text-left space-y-4 shadow-xl border border-white/20">
                  <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Equivale aproximadamente a:</div>

                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/20 rounded-xl shrink-0"><Gift size={18} /></div>
                    <div>
                      <span className="font-bold text-lg block">{Math.floor((donorCount * avgDonation) / 2).toLocaleString('es-ES')}</span>
                      <span className="text-blue-100 text-xs">Comidas calientes (aprox 2€/ud)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/20 rounded-xl shrink-0"><Users size={18} /></div>
                    <div>
                      <span className="font-bold text-lg block">{Math.floor((donorCount * avgDonation) / 15).toLocaleString('es-ES')}</span>
                      <span className="text-blue-100 text-xs">Días de educación infantil (aprox 15€/día)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-white/20 rounded-xl shrink-0"><ShieldCheck size={18} /></div>
                    <div>
                      <span className="font-bold text-lg block">{Math.floor((donorCount * avgDonation) / 50).toLocaleString('es-ES')}</span>
                      <span className="text-blue-100 text-xs">Familias con agua potable (aprox 50€/mes)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ TEASER — Link to dedicated page */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <HelpCircle size={24} />
              </div>
              <div>
                <p className="font-bold text-gray-900">¿Tienes más preguntas?</p>
                <p className="text-sm text-gray-500">Consulta nuestra sección de preguntas frecuentes.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('faq')}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shrink-0"
            >
              Ver FAQ <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-20 bg-gray-900 text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-6">¿Listo para ser parte del cambio?</h2>
        <button
          onClick={() => onNavigate('pricing')}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/50 transition-all transform hover:-translate-y-1"
        >
          Empezar con 0.99€/mes
        </button>
      </section>
    </div>
  );
}