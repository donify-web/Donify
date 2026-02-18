import React, { useState, useEffect } from 'react';
import { NgoUser, VoteStats, NgoProject, PageView } from '../../types';
import {
    TrendingUp,
    Users,
    DollarSign,
    Award,
    Settings as SettingsIcon,
    LogOut,
    BarChart3,
    FolderOpen,
    Calendar,
    Eye,
    ChevronRight
} from 'lucide-react';
import { Logo } from '../shared/Logo';

interface NgoDashboardProps {
    ngoUser: NgoUser;
    onLogout: () => void;
    onNavigate?: (view: PageView) => void;
}

// Mock data - en producción vendría de Supabase
const mockStats: VoteStats = {
    currentMonthVotes: 245,
    ranking: 2,
    totalNgos: 8,
    estimatedRevenue: 1225.50,
    lastMonthVotes: 189,
    historicalVotes: [
        { month: 'Ene', votes: 120 },
        { month: 'Feb', votes: 189 },
        { month: 'Mar', votes: 245 }
    ]
};

const mockProject: NgoProject = {
    id: '1',
    ngoId: '1',
    title: 'Reforestación de zonas quemadas en Galicia',
    description: 'Plantación de 500 árboles nativos en zonas afectadas por incendios forestales.',
    category: 'Medio Ambiente',
    goalAmount: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
    status: 'voting',
    votingMonth: '2026-02',
    currentVotes: 245
};

export default function NgoDashboard({ ngoUser, onLogout, onNavigate }: NgoDashboardProps) {
    const [stats, setStats] = useState<VoteStats>(mockStats);
    const [currentProject, setCurrentProject] = useState<NgoProject>(mockProject);

    // En producción, aquí se cargarían los datos desde Supabase
    useEffect(() => {
        // TODO: Fetch real data from Supabase
    }, [ngoUser.id]);

    const statCards = [
        {
            title: 'Votos este mes',
            value: stats.currentMonthVotes,
            icon: Users,
            color: 'bg-blue-500',
            trend: `+${stats.currentMonthVotes - stats.lastMonthVotes} desde el mes pasado`
        },
        {
            title: 'Ranking',
            value: `#${stats.ranking} de ${stats.totalNgos}`,
            icon: Award,
            color: 'bg-yellow-500',
            trend: stats.ranking <= 3 ? '¡Top 3!' : 'Sigue mejorando'
        },
        {
            title: 'Ingresos estimados',
            value: `€${stats.estimatedRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'bg-green-500',
            trend: 'Basado en votos actuales'
        },
        {
            title: 'Visibilidad',
            value: `${Math.round((stats.currentMonthVotes / stats.totalNgos) * 10)}%`,
            icon: TrendingUp,
            color: 'bg-purple-500',
            trend: 'De penetración'
        }
    ];

    return (
        <div className="min-h-screen bg-bgMain">
            {/* HEADER */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Logo className="w-8 h-8 text-primary" />
                                <span className="font-bold text-xl text-gray-800">Donify</span>
                            </div>
                            <div className="hidden md:block h-8 w-px bg-gray-300"></div>
                            <div className="flex items-center gap-3">
                                {ngoUser.logoUrl && (
                                    <img
                                        src={ngoUser.logoUrl}
                                        alt={ngoUser.ngoName}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-primary"
                                    />
                                )}
                                <div>
                                    <h1 className="font-bold text-gray-900">{ngoUser.ngoName}</h1>
                                    <p className="text-xs text-gray-500">Panel de ONG</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {ngoUser.isVerified && (
                                <span className="hidden md:flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    ✓ Verificada
                                </span>
                            )}
                            {onNavigate && (
                                <button
                                    onClick={() => onNavigate('ngo-settings')}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    title="Configuración"
                                >
                                    <SettingsIcon size={20} className="text-gray-600" />
                                </button>
                            )}
                            <button
                                onClick={onLogout}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Cerrar sesión"
                            >
                                <LogOut size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* STATS CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((card, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`${card.color} p-3 rounded-xl`}>
                                    <card.icon className="text-white" size={24} />
                                </div>
                            </div>
                            <h3 className="text-gray-500 text-sm font-medium mb-1">{card.title}</h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                            <p className="text-xs text-gray-400">{card.trend}</p>
                        </div>
                    ))}
                </div>

                {/* CURRENT PROJECT & HISTORICAL VOTES */}
                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* CURRENT PROJECT */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 mb-1">Proyecto Actual en Votación</h2>
                                    <p className="text-sm text-gray-500">Febrero 2026</p>
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    En votación
                                </span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex gap-6">
                                <img
                                    src={currentProject.imageUrl}
                                    alt={currentProject.title}
                                    className="w-32 h-32 rounded-xl object-cover flex-shrink-0"
                                />
                                <div className="flex-1">
                                    <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-xs font-semibold mb-2">
                                        {currentProject.category}
                                    </span>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{currentProject.title}</h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{currentProject.description}</p>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-primary">
                                            <Users size={16} />
                                            <span className="font-bold">{currentProject.currentVotes}</span>
                                            <span className="text-xs text-gray-500">votos</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Eye size={16} />
                                            <span className="text-sm">Ver detalles</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {onNavigate && (
                                <button
                                    onClick={() => onNavigate('ngo-projects')}
                                    className="mt-6 w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    <FolderOpen size={18} />
                                    Gestionar Proyectos
                                </button>
                            )}
                        </div>
                    </div>

                    {/* HISTORICAL VOTES CHART */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <BarChart3 className="text-primary" size={20} />
                            <h3 className="font-bold text-gray-900">Histórico de Votos</h3>
                        </div>

                        <div className="space-y-4">
                            {stats.historicalVotes.map((item, idx) => {
                                const maxVotes = Math.max(...stats.historicalVotes.map(v => v.votes));
                                const percentage = (item.votes / maxVotes) * 100;

                                return (
                                    <div key={idx}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-medium text-gray-700">{item.month}</span>
                                            <span className="text-sm font-bold text-gray-900">{item.votes}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-500 text-center">
                                Total últimos 3 meses: <span className="font-bold text-gray-900">
                                    {stats.historicalVotes.reduce((acc, v) => acc + v.votes, 0)}
                                </span> votos
                            </p>
                        </div>
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Acciones Rápidas</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <button
                            onClick={() => onNavigate && onNavigate('ngo-projects')}
                            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <Calendar size={20} className="text-blue-600 group-hover:text-primary" />
                                </div>
                                <span className="font-semibold text-gray-700 group-hover:text-primary">Ver calendario</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400 group-hover:text-primary" />
                        </button>

                        <button
                            onClick={() => onNavigate && onNavigate('ngo-finance')}
                            className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-primary/20 transition-colors">
                                    <DollarSign size={20} className="text-green-600 group-hover:text-primary" />
                                </div>
                                <span className="font-semibold text-gray-700 group-hover:text-primary">Historial pagos</span>
                            </div>
                            <ChevronRight size={20} className="text-gray-400 group-hover:text-primary" />
                        </button>

                        {onNavigate && (
                            <button
                                onClick={() => onNavigate('ngo-settings')}
                                className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-primary/20 transition-colors">
                                        <SettingsIcon size={20} className="text-purple-600 group-hover:text-primary" />
                                    </div>
                                    <span className="font-semibold text-gray-700 group-hover:text-primary">Configuración</span>
                                </div>
                                <ChevronRight size={20} className="text-gray-400 group-hover:text-primary" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
