
import React, { useState } from 'react';
import { PageView } from '../types';
import { Coins, Heart, CheckCircle, ArrowRight, ShieldCheck, Globe, Lock } from 'lucide-react';
import { Logo } from './Logo';

interface LandingProps {
  onNavigate: (view: PageView) => void;
  onShowPaymentWizard: () => void;
  onShowBenefits: () => void;
}

export default function Landing({ onNavigate, onShowPaymentWizard, onShowBenefits }: LandingProps) {
  const [pricingMode, setPricingMode] = useState<'simple' | 'pro'>('simple');
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'yearly'>('monthly');

  const tiers = [
    {
      name: 'Bronce',
      freq: 'Mensual',
      priceMonthly: pricingMode === 'simple' ? 0.99 : 1.99,
      priceYearly: pricingMode === 'simple' ? 10.99 : 21.99,
      period: '/mes',
      periodYearly: '/año',
    },
    {
      name: 'Plata',
      freq: 'Quincenal',
      priceMonthly: pricingMode === 'simple' ? 0.99 : 1.99,
      priceYearly: pricingMode === 'simple' ? 23.76 : 47.52,
      period: '/2 semanas',
      periodYearly: '/año',
      highlight: true,
    },
    {
      name: 'Oro',
      freq: 'Semanal',
      priceMonthly: pricingMode === 'simple' ? 0.99 : 1.99,
      priceYearly: pricingMode === 'simple' ? 47.99 : 95.98,
      period: '/semana',
      periodYearly: '/año',
    },
    {
      name: 'Diamante',
      freq: 'Diario',
      priceMonthly: pricingMode === 'simple' ? 0.99 : 1.99,
      priceYearly: pricingMode === 'simple' ? 335.99 : 671.98,
      period: '/día',
      periodYearly: '/año',
    },
  ];

  const votingProjects = [
    {
      title: "Limpieza de Océanos",
      desc: "Retirada de 5 toneladas de plástico del Mediterráneo.",
      img: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?auto=format&fit=crop&q=80&w=800",
      percent: 75
    },
    {
      title: "Educación Rural",
      desc: "Material escolar para 3 escuelas en zonas despobladas.",
      img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800",
      percent: 45
    },
    {
      title: "Refugio Animal",
      desc: "Ampliación de instalaciones para acoger 20 perros más.",
      img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800",
      percent: 60
    }
  ];

  return (
    <div className="flex flex-col min-h-screen font-sans text-textMain bg-white">
      {/* HERO SECTION */}
      <section id="landing" className="pt-32 pb-16 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1]">
            Tu cambio suelto <br />
            <span className="text-primary">cambia el mundo</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto md:mx-0">
            Las personas donan poco, eligen juntas y el dinero va directamente a las organizaciones más votadas. Sin ruido. Sin intermediarios innecesarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={onShowPaymentWizard}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg hover:shadow-xl"
            >
              Empezar ahora <ArrowRight className="inline ml-2" size={20} />
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-8 py-4 text-gray-600 font-medium hover:text-primary transition-colors flex items-center justify-center"
            >
              Cómo funciona
            </button>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1000"
              alt="Voluntario ayudando"
              className="w-full h-auto object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
              <p className="text-white italic font-medium">"Solo una forma sencilla y transparente de participar en algo que importa"</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS PREVIEW */}
      <section className="py-20 bg-bgMain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cómo funciona</h2>
            <p className="text-gray-500">Sin intermediarios innecesarios. Sin ruido.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                <Coins size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Tú aportas poco</h3>
              <p className="text-gray-600 leading-relaxed">
                Elige una micro-suscripción que no afecte a tu economía diaria. Desde menos de un café al mes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Decidimos juntos</h3>
              <p className="text-gray-600 leading-relaxed">
                Tu donación te da derecho a voto. Cada mes, la comunidad elige democráticamente el destino.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-secondary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Impacto directo</h3>
              <p className="text-gray-600 leading-relaxed">
                El 100% de la donación neta se transfiere a la causa ganadora. Transparencia radical.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Elige tu nivel de impacto</h2>
            <p className="text-xl text-gray-500 mb-8">Pequeñas cantidades, resultados gigantes.</p>

            {/* Payment Frequency Toggle */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="inline-flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setPaymentFrequency('monthly')}
                  className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${paymentFrequency === 'monthly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Pagar Mensualmente
                </button>
                <button
                  onClick={() => setPaymentFrequency('yearly')}
                  className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${paymentFrequency === 'yearly' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Pagar Anualmente
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">-8% ahorro</span>
                </button>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="inline-flex bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setPricingMode('simple')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${pricingMode === 'simple' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Simple (0.99€)
              </button>
              <button
                onClick={() => setPricingMode('pro')}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${pricingMode === 'pro' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Pro (1.99€)
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">La opción más accesible para todos.</p>
          </div>

          {/* 2-Column Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {tiers.map((tier) => {
              const displayPrice = paymentFrequency === 'monthly' ? tier.priceMonthly : tier.priceYearly;
              const displayPeriod = paymentFrequency === 'monthly' ? tier.period : tier.periodYearly;

              return (
                <div key={tier.name} className={`relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${tier.highlight ? 'border-primary ring-2 ring-primary/20 shadow-xl' : 'border-gray-200 shadow-sm hover:shadow-lg'}`}>
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      Más popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{tier.freq}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{displayPrice}€</span>
                    <span className="text-gray-500 text-sm">{displayPeriod}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-primary" /> Derecho a voto
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-primary" /> Reporte de transparencia
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={16} className="text-primary" /> Certificado de donación
                    </li>
                  </ul>

                  <button
                    onClick={onShowPaymentWizard}
                    className={`w-full py-3 rounded-lg font-bold transition-colors ${tier.highlight ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-gray-50 text-gray-900 hover:bg-gray-100'}`}
                  >
                    Suscribirse {tier.name}
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-3">Procesado seguro por Stripe.</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* VOTING PREVIEW */}
      <section className="py-20 bg-bgMain">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Votaciones en curso</h2>
            <p className="text-gray-600">Así es como decidimos el destino de los fondos este mes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {votingProjects.map((project) => (
              <div key={project.title} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="relative h-48 overflow-hidden">
                  <img src={project.img} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary">
                    En votación
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.desc}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-500">POPULARIDAD</span>
                      <span className="text-primary">{project.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${project.percent}%` }}></div>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('login')}
                    className="w-full border border-gray-200 text-gray-600 py-2 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors"
                  >
                    Votar Proyecto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRANSPARENCY SECTION */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl font-bold mb-12">Transparencia Radical</h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-16">
            El dinero no desaparece. Sabemos exactamente dónde está en cada momento. Usamos Stripe para garantizar la seguridad de cada céntimo.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <Lock size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Donación Realizada</h3>
              <p className="text-gray-400 text-sm">El usuario elige su suscripción y realiza el pago seguro.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Seguridad Stripe</h3>
              <p className="text-gray-400 text-sm">Fondos retenidos en balance (7-14 días) por protocolos anti-fraude.</p>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-4">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Transferencia a ONG</h3>
              <p className="text-gray-400 text-sm">Liberación automática a la cuenta bancaria de la organización ganadora.</p>
            </div>
          </div>

          <div className="mt-12 inline-block bg-yellow-500/10 border border-yellow-500/20 px-4 py-2 rounded-lg text-yellow-500 text-sm">
            Disclaimer: Stripe retiene los fondos temporalmente por seguridad antes de liberarlos a la cuenta destino.
          </div>
        </div>
      </section>

      {/* QUIENES SOMOS (About) */}
      <section id="quienes" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Quiénes somos</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-6">
            Donify nace de una frustración: querer ayudar pero sentir que las pequeñas aportaciones no importan.
            Creamos un sistema donde miles de micro-donaciones se suman para financiar proyectos reales y tangibles.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Somos un equipo independiente de desarrolladores y activistas sociales. No retenemos tu dinero más allá de los
            tiempos de seguridad estipulados por nuestros procesadores de pagos. Nuestra misión es democratizar la filantropía.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Logo className="w-6 h-6 text-primary" />
                <span className="font-bold text-xl">Donify</span>
              </div>
              <p className="text-gray-400 text-sm">
                La plataforma de crowdfunding democrática. Tú donas, tú decides, el mundo cambia.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-200">PLATAFORMA</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate('how-it-works')} className="hover:text-primary">Cómo funciona</button></li>
                <li><button onClick={() => onNavigate('organizations')} className="hover:text-primary">Organizaciones</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-200">LEGAL</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate('legal')} className="hover:text-primary">Política de Privacidad</button></li>
                <li><button onClick={() => onNavigate('legal')} className="hover:text-primary">Términos y Condiciones</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-200">CONTACTO</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => onNavigate('ngo-apply')} className="hover:text-primary">¿Eres una ONG?</button></li>
                <li><button onClick={() => onNavigate('ngo-apply')} className="text-primary hover:underline">Aplica para recibir fondos</button></li>
                <li><button onClick={() => onNavigate('contact')} className="hover:text-white">Contacto</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© 2026 Donify. Todos los derechos reservados.</p>
            <p className="max-w-md text-center md:text-right">
              Donify no garantiza que el 100% de la donación bruta llegue al destinatario final debido a las tarifas de
              procesamiento de pagos de terceros y costes operativos mínimos. Por favor, revisa nuestra sección de
              <button onClick={() => onNavigate('pricing')} className="text-gray-400 underline mx-1">Tarifas y Desglose</button>
              para más detalle.
            </p>
            <p className="flex items-center gap-1">Hecho con <Heart size={12} className="text-red-500 fill-current" /> para el mundo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
