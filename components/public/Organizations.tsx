import React from 'react';
import { PageView } from '../../types';
import { Building2, CheckCircle, Heart, Shield, Users, ArrowRight, Sparkles } from 'lucide-react';

interface OrganizationsProps {
    onNavigate: (view: PageView) => void;
}

export default function Organizations({ onNavigate }: OrganizationsProps) {
    const partnerOrganizations = [
        {
            name: "ONG de Salud [Ejemplo]",
            mission: "Ayuda humanitaria y acción social",
            img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
            tag: "Salud"
        },
        {
            name: "ONG Infantil [Ejemplo]",
            mission: "Protección y bienestar de la infancia",
            img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
            tag: "Educación"
        },
        {
            name: "ONG Medioambiental [Ejemplo]",
            mission: "Conservación de la naturaleza",
            img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
            tag: "Medio Ambiente"
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-textMain animate-in fade-in duration-500">

            {/* ── HERO ── */}
            <section className="pt-32 pb-14 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f4f9f6] to-white -z-10" />
                <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[80px] -translate-x-1/3 -z-10" />

                <div className="max-w-4xl mx-auto text-center space-y-5">
                    <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full shadow-sm border border-gray-100 text-[10px] font-bold text-primary uppercase tracking-widest">
                        <Building2 size={13} /> Organizaciones Verificadas
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black text-[#1c232f] leading-tight tracking-tight">
                        Causas reales,{' '}
                        <span className="relative inline-block text-primary">
                            apoyo masivo.
                            <svg className="absolute -bottom-1 left-0 w-full h-3 text-primary/25 z-[-1]" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                                <path d="M2.5 9.5C50.5 3.5 150.5 3.5 197.5 9.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </span>
                        {' '}<Sparkles className="inline text-yellow-400 mb-1" size={32} />
                    </h1>

                    <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        Solo trabajamos con organizaciones que demuestran <strong>transparencia total</strong>, impacto real y responsabilidad fiscal. Cada ONG pasa un proceso de selección riguroso.
                    </p>
                </div>
            </section>

            {/* ── DIVIDER ── */}
            <div className="bg-teal-50 border-y border-teal-100/60 py-3 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 text-xs font-semibold text-gray-600">
                    <span className="flex items-center gap-1.5"><Shield size={13} className="text-primary" /> Verificación Legal</span>
                    <span className="hidden sm:block w-1 h-1 rounded-full bg-teal-300" />
                    <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-primary" /> Transparencia Financiera</span>
                    <span className="hidden sm:block w-1 h-1 rounded-full bg-teal-300" />
                    <span className="flex items-center gap-1.5"><Heart size={13} className="text-primary" /> Impacto Demostrable</span>
                </div>
            </div>

            {/* ── MISSION ── */}
            <section className="py-16 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Nuestra Misión</h2>
                        <p className="text-gray-600 leading-relaxed font-medium text-sm">
                            Donify democratiza la filantropía al conectar pequeños donantes con organizaciones de alto impacto.
                            No todas las ONGs pueden participar en nuestras votaciones: solo aquellas que cumplen con
                            nuestros estándares de transparencia, rendición de cuentas y capacidad de ejecución.
                        </p>
                        <div className="space-y-4">
                            {[
                                { icon: <Shield size={18} />, title: 'Verificación Legal', desc: 'Registradas y conformes con la normativa fiscal vigente.' },
                                { icon: <CheckCircle size={18} />, title: 'Transparencia Financiera', desc: 'Informes públicos sobre uso de fondos y resultados.' },
                                { icon: <Heart size={18} />, title: 'Impacto Demostrable', desc: 'Proyectos tangibles con métricas claras de éxito.' },
                            ].map(({ icon, title, desc }, i) => (
                                <div key={i} className="flex items-start gap-3 group hover:-translate-y-0.5 transition-transform">
                                    <div className="p-2 bg-primary/10 rounded-lg shrink-0 group-hover:bg-primary/20 transition-colors text-primary">{icon}</div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm mb-0.5">{title}</h3>
                                        <p className="text-xs text-gray-500 font-medium">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-2 bg-primary/5 rounded-3xl -z-10 group-hover:bg-primary/10 transition-colors" />
                        <img
                            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=1000"
                            alt="Voluntarios trabajando"
                            className="w-full rounded-2xl shadow-xl transition-transform group-hover:scale-[1.01]"
                        />
                    </div>
                </div>
            </section>

            {/* ── PARTNERS ── */}
            <section className="py-14 bg-[#f8fdfd] px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Organizaciones Asociadas</h2>
                        <p className="text-sm text-gray-500 font-medium max-w-lg mx-auto">
                            Ejemplos del tipo de organizaciones que participan en nuestras votaciones (sujeto a verificación).
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {partnerOrganizations.map((org, idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group">
                                <div className="h-44 overflow-hidden relative">
                                    <img src={org.img} alt={org.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3 bg-white/90 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary/10 shadow-sm backdrop-blur-sm">
                                        {org.tag}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 mb-1 text-sm">{org.name}</h3>
                                    <p className="text-gray-500 text-xs font-medium">{org.mission}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── NGO CTA STRIP ── */}
            <div className="border-y border-green-100 bg-gradient-to-r from-[#f0f9f4] via-[#e8f7ef] to-[#f0f9f4] py-5 px-6">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="font-black text-gray-900 text-sm">¿Eres una ONG? <span className="text-primary font-bold">Aplica para recibir fondos</span></p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5 max-w-sm">
                                Si cumples nuestros estándares y tienes un proyecto de impacto, queremos conocerte.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onNavigate('ngo-apply')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-sm shrink-0"
                    >
                        Aplicar como ONG <ArrowRight size={15} />
                    </button>
                </div>
            </div>

        </div>
    );
}
