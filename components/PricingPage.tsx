
import React, { useState } from 'react';
import { PageView } from '../types';
import { ArrowLeft, Info, Shield, HelpCircle, Check, X as XIcon, CreditCard, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

interface PricingPageProps {
    onNavigate: (view: PageView) => void;
}

export default function PricingPage({ onNavigate }: PricingPageProps) {
    const [activeExample, setActiveExample] = useState<'simple' | 'pro'>('simple');

    // Constants for calculation example
    // Assuming Stripe standard: 0.25€ fixed + 1.5% for EU cards
    const amount = activeExample === 'simple' ? 0.99 : 1.99;
    const stripeFixed = 0.25;
    const stripeVar = amount * 0.015;
    const stripeTotal = stripeFixed + stripeVar;
    const net = amount - stripeTotal;

    return (
        <div className="min-h-screen bg-bgMain font-sans text-textMain animate-in fade-in duration-300">
            {/* Navigation Bar */}
            <nav className="fixed w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 h-20 flex items-center px-6">
                <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                    <div className="flex items-center gap-2" onClick={() => onNavigate('landing')}>
                        <Logo className="w-8 h-8 text-primary" />
                        <span className="font-bold text-xl text-gray-800">Donify</span>
                    </div>
                    <button
                        onClick={() => onNavigate('landing')}
                        className="text-gray-500 hover:text-primary flex items-center gap-2 font-medium"
                    >
                        <ArrowLeft size={20} /> Volver
                    </button>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Cuentas Claras</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        La transparencia radical no es un slogan, es nuestra arquitectura. Aquí tienes el desglose exacto de cada céntimo.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Interactive Receipt */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary"></div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <CreditCard size={20} className="text-primary" /> Simulación de Recibo
                        </h3>

                        <div className="flex gap-4 mb-8">
                            <button
                                onClick={() => setActiveExample('simple')}
                                className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-all ${activeExample === 'simple' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500'}`}
                            >
                                Donación 0.99€
                            </button>
                            <button
                                onClick={() => setActiveExample('pro')}
                                className={`flex-1 py-2 rounded-lg font-bold text-sm border transition-all ${activeExample === 'pro' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-500'}`}
                            >
                                Donación 1.99€
                            </button>
                        </div>

                        <div className="space-y-4 font-mono text-sm">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                <span className="text-gray-600">Importe Bruto (Tu Pago)</span>
                                <span className="font-bold text-gray-900">{amount.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between items-center text-red-500">
                                <span className="flex items-center gap-1"><Info size={12} /> Tarifa Fija Stripe</span>
                                <span>- {stripeFixed.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between items-center text-red-500 pb-2 border-b border-gray-100">
                                <span className="flex items-center gap-1"><Info size={12} /> Tarifa Variable (1.5%)</span>
                                <span>- {stripeVar.toFixed(2)}€</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 text-lg">
                                <span className="font-bold text-primary">Donación Neta a ONG</span>
                                <span className="font-bold text-primary text-2xl">{net.toFixed(2)}€</span>
                            </div>
                        </div>

                        <div className="mt-6 bg-blue-50 p-4 rounded-lg text-xs text-blue-700 leading-relaxed">
                            <strong>¿Por qué perdemos céntimos?</strong><br />
                            Las micro-donaciones tienen un coste fijo alto proporcionalmente. Por eso recomendamos los planes superiores (Oro/Diamante), donde el impacto neto es mucho mayor porcentualmente.
                        </div>
                    </div>

                    {/* Detailed Table */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-bold text-gray-900 mb-4 text-lg">Tabla Comparativa de Niveles</h3>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-3">Nivel</th>
                                                <th className="px-6 py-3">Frecuencia</th>
                                                <th className="px-6 py-3">Bruto</th>
                                                <th className="px-6 py-3 text-primary">Neto (Est.)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            <tr>
                                                <td className="px-6 py-4 font-bold text-gray-900">Bronce</td>
                                                <td className="px-6 py-4">Mensual</td>
                                                <td className="px-6 py-4">0.99€</td>
                                                <td className="px-6 py-4 font-bold text-primary">0.73€</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 font-bold text-gray-900">Plata</td>
                                                <td className="px-6 py-4">Quincenal</td>
                                                <td className="px-6 py-4">0.99€</td>
                                                <td className="px-6 py-4 font-bold text-primary">1.46€ /mes</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 font-bold text-gray-900">Oro</td>
                                                <td className="px-6 py-4">Semanal</td>
                                                <td className="px-6 py-4">0.99€</td>
                                                <td className="px-6 py-4 font-bold text-primary">2.92€ /mes</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-4 font-bold text-gray-900">Diamante</td>
                                                <td className="px-6 py-4">Diario</td>
                                                <td className="px-6 py-4">0.99€</td>
                                                <td className="px-6 py-4 font-bold text-primary">21.90€ /mes</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-900 text-lg">Preguntas Frecuentes sobre Dinero</h3>
                            <div className="space-y-3">
                                <details className="group bg-white rounded-lg border border-gray-200 open:ring-2 open:ring-primary/20 transition-all">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 list-none">
                                        <span>¿Son deducibles las donaciones?</span>
                                        <ChevronDown className="group-open:rotate-180 transition-transform text-gray-400" size={16} />
                                    </summary>
                                    <div className="px-4 pb-4 text-gray-600 text-sm">
                                        Sí. Donify emite un certificado fiscal anual. En España, los primeros 150€ donados tienen una deducción del 80%.
                                    </div>
                                </details>
                                <details className="group bg-white rounded-lg border border-gray-200 open:ring-2 open:ring-primary/20 transition-all">
                                    <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-gray-900 list-none">
                                        <span>¿Es seguro guardar mi tarjeta?</span>
                                        <ChevronDown className="group-open:rotate-180 transition-transform text-gray-400" size={16} />
                                    </summary>
                                    <div className="px-4 pb-4 text-gray-600 text-sm">
                                        Donify no almacena los datos de tu tarjeta. Usamos Stripe, el procesador de pagos estándar de la industria (usado por Amazon, Booking, etc.), que cumple con PCI-DSS Nivel 1.
                                    </div>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
