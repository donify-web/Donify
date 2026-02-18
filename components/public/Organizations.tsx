import React from 'react';
import { PageView } from '../../types';
import { ArrowLeft, Building2, CheckCircle, Heart, Shield, Users } from 'lucide-react';
import { Logo } from '../shared/Logo';

interface OrganizationsProps {
    onNavigate: (view: PageView) => void;
}

export default function Organizations({ onNavigate }: OrganizationsProps) {
    const partnerOrganizations = [
        {
            name: "Cruz Roja Española",
            mission: "Ayuda humanitaria y acción social",
            img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"
        },
        {
            name: "Save the Children",
            mission: "Protección de la infancia",
            img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800"
        },
        {
            name: "WWF España",
            mission: "Conservación de la naturaleza",
            img: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=800"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-textMain">
            {/* HEADER */}
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
                        <Building2 size={16} /> Organizaciones Verificadas
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Uniendo causas específicas con <span className="text-primary">apoyo masivo</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        En Donify, trabajamos con organizaciones verificadas que demuestran transparencia, impacto real y responsabilidad fiscal. Cada ONG pasa por un riguroso proceso de selección.
                    </p>
                </div>
            </section>

            {/* MISSION */}
            <section className="py-20 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-bold text-gray-900">Nuestra Misión</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Donify democratiza la filantropía al conectar pequeños donantes con organizaciones de alto impacto.
                            No todas las ONGs pueden participar en nuestras votaciones mensuales: solo aquellas que cumplen con
                            nuestros estándares de transparencia, rendición de cuentas y capacidad de ejecución.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Shield className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Verificación Legal</h3>
                                    <p className="text-sm text-gray-600">Todas las organizaciones están registradas y cumplen la normativa fiscal.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <CheckCircle className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Transparencia Financiera</h3>
                                    <p className="text-sm text-gray-600">Informes públicos sobre el uso de fondos y resultados medibles.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Heart className="text-primary" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-1">Impacto Demostrable</h3>
                                    <p className="text-sm text-gray-600">Proyectos tangibles con métricas claras de éxito.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1000"
                            alt="Voluntarios trabajando"
                            className="w-full rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>
            </section>

            {/* PARTNERS */}
            <section className="py-20 bg-bgMain px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Organizaciones Asociadas</h2>
                        <p className="text-gray-600">
                            Ejemplos de organizaciones que podrían participar en nuestras votaciones (sujeto a verificación).
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {partnerOrganizations.map((org, idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                <div className="h-48 overflow-hidden">
                                    <img src={org.img} alt={org.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{org.name}</h3>
                                    <p className="text-gray-600 text-sm">{org.mission}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gray-900 text-white text-center px-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <Users size={16} /> ¿Eres una ONG?
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">Aplica para recibir fondos</h2>
                    <p className="text-gray-300 text-lg">
                        Si tu organización cumple con nuestros estándares de transparencia y tienes un proyecto de impacto,
                        queremos conocerte. El proceso de verificación es riguroso pero justo.
                    </p>
                    <button
                        onClick={() => onNavigate('ngo-apply')}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/50 transition-all transform hover:-translate-y-1"
                    >
                        Aplicar como ONG
                    </button>
                </div>
            </section>
        </div>
    );
}
