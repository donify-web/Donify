import React from 'react';
import { User } from '../../types';
import { TrendingUp, Users, Heart, Globe, Award, Share2 } from 'lucide-react';

interface DonorImpactProps {
    user: User;
}

export default function DonorImpact({ user }: DonorImpactProps) {
    // Mock data - in real app would come from Supabase/AuthContext
    const totalDonated = user.subscriptionTier === 'diamante' ? 1250 : user.subscriptionTier === 'oro' ? 450 : 125;
    const projectsSupported = 12;
    const peopleImpacted = 45;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-8 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tu Impacto</h1>
                <p className="text-gray-500 text-lg">
                    Gracias a ti y a {user.subscriptionTier ? 'tu plan ' + user.subscriptionTier : 'tu apoyo'}, el mundo cambia un poco cada día.
                </p>
            </header>

            {/* MAIN STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 group-hover:scale-125 transition-transform duration-700">
                        <TrendingUp size={120} />
                    </div>
                    <div className="relative z-10">
                        <p className="text-blue-100 font-medium mb-1">Total Donado</p>
                        <h2 className="text-5xl font-bold tracking-tight">€{totalDonated}</h2>
                        <div className="mt-4 inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                            <TrendingUp size={14} /> +€15 este mes
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-primary transform scale-150 group-hover:scale-125 transition-transform duration-700">
                        <Heart size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                            <Heart size={24} className="fill-current" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{projectsSupported}</h3>
                        <p className="text-gray-500 font-medium">Proyectos Apoyados</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 text-primary transform scale-150 group-hover:scale-125 transition-transform duration-700">
                        <Users size={120} />
                    </div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mb-4">
                            <Users size={24} />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{peopleImpacted}</h3>
                        <p className="text-gray-500 font-medium">Personas Ayudadas (Est.)</p>
                    </div>
                </div>
            </div>

            {/* ACHIEVEMENTS / BADGES */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Award className="text-amber-500" /> Insignias y Logros
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { title: 'Primeros Pasos', desc: 'Tu primera donación', active: true, color: 'bg-blue-100 text-blue-600' },
                        { title: 'Donante Fiel', desc: '3 meses consecutivos', active: true, color: 'bg-purple-100 text-purple-600' },
                        { title: 'Super Votante', desc: 'Participa en 5 votaciones', active: user.hasVotedThisMonth, color: 'bg-orange-100 text-orange-600' },
                        { title: 'Influencer', desc: 'Invita a 3 amigos', active: false, color: 'bg-gray-100 text-gray-400 grayscale' },
                    ].map((badge, i) => (
                        <div key={i} className={`flex flex-col items-center text-center p-4 rounded-2xl transition-all ${badge.active ? 'bg-gray-50' : 'opacity-50'}`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${badge.color}`}>
                                <Award size={32} />
                            </div>
                            <h4 className="font-bold text-gray-900 text-sm">{badge.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{badge.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* GLOBAL IMPACT MAP PLACEHOLDER */}
            <div className="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold mb-4 backdrop-blur-md border border-white/20">
                            <Globe size={14} /> Comunidad Global
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Juntos somos imparables</h3>
                        <p className="text-gray-400 text-sm mb-6">
                            La comunidad de Donify ha recaudado más de €45,000 este año, financiando pozos de agua en Kenia, escuelas en Perú y reforestación en Galicia.
                        </p>
                        <button className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2">
                            <Share2 size={16} /> Compartir mi impacto
                        </button>
                    </div>
                    {/* Abstract Globe Visual */}
                    <div className="w-48 h-48 rounded-full bg-blue-500/20 flex items-center justify-center relative animate-pulse">
                        <div className="absolute w-32 h-32 rounded-full bg-blue-500/30"></div>
                        <Globe size={80} className="text-blue-400" />
                    </div>
                </div>
            </div>
        </div>
    );
}
