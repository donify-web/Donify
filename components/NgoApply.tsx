
import React, { useState } from 'react';
import { PageView } from '../types';
import { ArrowLeft, CheckSquare, Upload, FileText, Loader2, Building2 } from 'lucide-react';
import { Logo } from './Logo';

interface NgoApplyProps {
    onNavigate: (view: PageView) => void;
}

export default function NgoApply({ onNavigate }: NgoApplyProps) {
    const [step, setStep] = useState<1 | 2>(1); // 1: Checklist, 2: Form
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleStart = () => setStep(2);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 2000);
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-bgMain flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Building2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitud Recibida</h2>
                <p className="text-gray-600 max-w-md mb-8">
                    Nuestro equipo de compliance revisará tu documentación en 48-72h. Si todo está correcto, contactaremos contigo para activar tu perfil.
                </p>
                <button
                    onClick={() => onNavigate('landing')}
                    className="text-primary font-bold hover:underline"
                >
                    Volver al Inicio
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgMain font-sans text-textMain">
            <nav className="p-6">
                <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft size={20} /> Volver
                </button>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-8">

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Financia tu impacto</h1>
                    <p className="text-lg text-gray-600">
                        Accede a miles de micro-donantes sin invertir en marketing. Si tu causa es real, la comunidad te apoyará.
                    </p>

                    <div className="flex justify-center gap-8 mt-8 text-sm font-medium text-gray-500">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">0€</div>
                            <span>Coste de Entrada</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <Upload size={20} />
                            </div>
                            <span>Transferencia Stripe</span>
                        </div>
                    </div>
                </div>

                {step === 1 ? (
                    /* STEP 1: ELIGIBILITY CHECKLIST */
                    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Requisitos Previos</h3>
                        <div className="space-y-4 mb-8">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-1 text-primary"><CheckSquare size={20} /></div>
                                <span className="text-gray-700">Somos una organización sin ánimo de lucro legalmente registrada en España.</span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-1 text-primary"><CheckSquare size={20} /></div>
                                <span className="text-gray-700">Podemos emitir certificados de donación válidos para deducción fiscal.</span>
                            </label>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-1 text-primary"><CheckSquare size={20} /></div>
                                <span className="text-gray-700">Aceptamos someter nuestras cuentas a la revisión de transparencia de Donify.</span>
                            </label>
                        </div>
                        <button
                            onClick={handleStart}
                            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                        >
                            Cumplimos los requisitos. Empezar.
                        </button>
                    </div>
                ) : (
                    /* STEP 2: APPLICATION FORM */
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 space-y-8 animate-in slide-in-from-bottom-10 duration-500">

                        {/* Org Details */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 size={20} className="text-primary" /> Datos de la Organización
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input required placeholder="Nombre Legal de la ONG" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                <input required placeholder="CIF / NIF" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                <input required placeholder="Sitio Web" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                <select className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none">
                                    <option value="">Selecciona Sector...</option>
                                    <option>Medio Ambiente</option>
                                    <option>Social / Humanitario</option>
                                    <option>Educación</option>
                                    <option>Salud / Investigación</option>
                                    <option>Protección Animal</option>
                                </select>
                            </div>
                        </section>

                        {/* The Pitch */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-primary" /> El Proyecto
                            </h3>
                            <div className="space-y-4">
                                <textarea required rows={2} placeholder="Descripción Corta (lo que verán los votantes en la tarjeta)" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input required placeholder="Meta de Impacto (Ej: Construir 3 pozos)" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                    <input required type="number" placeholder="Objetivo de Financiación (€)" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                </div>
                            </div>
                        </section>

                        {/* Verification Uploads (Visual) */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Upload size={20} className="text-primary" /> Documentación
                            </h3>
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                                <Upload className="mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Arrastra aquí tus Estatutos y Certificado de Titularidad Bancaria (PDF)</p>
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Contacto Representante</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input required placeholder="Nombre y Apellidos" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                <input required type="email" placeholder="Email Directo" className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Enviar Solicitud'}
                        </button>
                    </form>
                )}

            </main>
        </div>
    );
}
