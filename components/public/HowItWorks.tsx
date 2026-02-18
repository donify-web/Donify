import React, { useState } from 'react';
import { PageView } from '../../types';
import {
  ArrowLeft,
  Coins,
  Vote,
  ArrowRight,
  ShieldCheck,
  Calculator,
  Users,
  Gift,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Logo } from '../shared/Logo';

interface HowItWorksProps {
  onNavigate: (view: PageView) => void;
}

export default function HowItWorks({ onNavigate }: HowItWorksProps) {
  // Calculator State
  const [donorCount, setDonorCount] = useState(1000);
  const [avgDonation, setAvgDonation] = useState(0.99); // Simple vs Pro

  // FAQ State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const monthlyImpact = (donorCount * avgDonation).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

  const faqs = [
    {
      q: "¿Donify se queda con dinero?",
      a: "No retenemos beneficios. Solo se descuentan las tarifas de procesamiento de pago (Stripe) y un coste operativo mínimo para mantener los servidores. El 100% del dinero restante llega a la causa."
    },
    {
      q: "¿Quién elige las ONGs?",
      a: "Un equipo de compliance verifica que las organizaciones sean legales, éticas y puedan emitir certificados de donación. Luego, TÚ y la comunidad decidís quién recibe los fondos mediante votación."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-textMain animate-in fade-in duration-500">
      {/* HEADER SIMPLE */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 h-20 flex items-center px-6">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onNavigate('landing')}
          >
            <Logo className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl text-gray-800">Donify</span>
          </div>
          <button
            onClick={() => onNavigate('landing')}
            className="text-gray-500 hover:text-primary flex items-center gap-2 font-medium transition-colors"
          >
            <ArrowLeft size={20} /> Volver al Inicio
          </button>
        </div>
      </nav>

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
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
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

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Si fuéramos <span className="text-primary font-bold">{donorCount.toLocaleString()}</span> donantes
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Donando <span className="text-primary font-bold">{avgDonation}€</span> al mes
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setAvgDonation(0.99)}
                      className={`px-4 py-2 rounded-lg border ${avgDonation === 0.99 ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 text-gray-500'}`}
                    >
                      Bronce (0.99€)
                    </button>
                    <button
                      onClick={() => setAvgDonation(4.99)}
                      className={`px-4 py-2 rounded-lg border ${avgDonation === 4.99 ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 text-gray-500'}`}
                    >
                      Oro (4.99€)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-white p-8 md:p-12 flex flex-col justify-center items-center text-center">
              <div className="text-blue-100 font-medium mb-2">Generaríamos</div>
              <div className="text-5xl font-bold mb-2">{monthlyImpact}</div>
              <div className="text-blue-100 mb-8">cada mes para una causa</div>

              <div className="bg-white/10 rounded-xl p-4 w-full backdrop-blur-sm text-sm text-left space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full"><Users size={16} /></div>
                  <span>Escuela en Kenia (construcción completa)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full"><Gift size={16} /></div>
                  <span>3.000 Comidas calientes</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full"><ShieldCheck size={16} /></div>
                  <span>Refugio para 50 animales</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center p-6 text-left bg-white"
              >
                <span className="font-semibold text-lg">{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-gray-400" />}
              </button>
              {openFaq === idx && (
                <div className="p-6 pt-0 text-gray-600 bg-gray-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
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