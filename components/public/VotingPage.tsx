import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { VotingOption, PageView } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../shared/Logo';
import { ArrowLeft, Vote, CheckCircle2, Trophy, Sparkles, TrendingUp, Users, Timer } from 'lucide-react';

interface VotingPageProps {
    onNavigate: (view: PageView) => void;
}

// Fallback mock data for demo
const MOCK_OPTIONS: VotingOption[] = [
    {
        id: 'mock-a',
        title: 'Reforestación Galicia',
        description: 'Plantación de 500 árboles nativos en zonas afectadas por incendios forestales. Tu voto apoya la recuperación de ecosistemas.',
        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        votes: 245,
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: 'mock-b',
        title: 'Comedores Sociales Madrid',
        description: 'Apoyo nutricional diario para 200 personas en situación de vulnerabilidad en comedores comunitarios.',
        image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
        votes: 189,
        is_active: true,
        created_at: new Date().toISOString()
    },
    {
        id: 'mock-c',
        title: 'Educación Digital Rural',
        description: 'Tablets y conectividad para escuelas rurales en la España vaciada. Cerremos la brecha digital.',
        image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
        votes: 120,
        is_active: true,
        created_at: new Date().toISOString()
    },
];

// Accent colors per card
const CARD_THEMES = [
    {
        gradient: 'from-emerald-500 to-teal-600',
        glow: 'shadow-emerald-500/20',
        badge: 'bg-emerald-100 text-emerald-700',
        button: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30',
        bar: 'bg-emerald-500',
        ring: 'ring-emerald-500/20',
        icon: '🌿',
    },
    {
        gradient: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/20',
        badge: 'bg-violet-100 text-violet-700',
        button: 'bg-violet-600 hover:bg-violet-700 shadow-violet-500/30',
        bar: 'bg-violet-500',
        ring: 'ring-violet-500/20',
        icon: '💜',
    },
    {
        gradient: 'from-amber-500 to-orange-600',
        glow: 'shadow-amber-500/20',
        badge: 'bg-amber-100 text-amber-700',
        button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/30',
        bar: 'bg-amber-500',
        ring: 'ring-amber-500/20',
        icon: '📚',
    },
];

export default function VotingPage({ onNavigate }: VotingPageProps) {
    const { user } = useAuth();
    const [options, setOptions] = useState<VotingOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [votingFor, setVotingFor] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [votedOptionId, setVotedOptionId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Get current month key for localStorage
    const currentMonthKey = `donify_vote_${new Date().toISOString().slice(0, 7)}`;

    useEffect(() => {
        fetchOptions();
        checkLocalVote();
    }, []);

    const checkLocalVote = () => {
        // Check localStorage first (works for everyone, logged in or not)
        const savedVote = localStorage.getItem(currentMonthKey);
        if (savedVote) {
            setHasVoted(true);
            setVotedOptionId(savedVote);
        }
    };

    const fetchOptions = async () => {
        try {
            const { data, error } = await supabase
                .from('voting_options')
                .select('*')
                .eq('is_active', true)
                .order('votes', { ascending: false });

            if (data && data.length > 0) {
                setOptions(data);
            } else {
                setOptions(MOCK_OPTIONS);
            }
        } catch {
            setOptions(MOCK_OPTIONS);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (optionId: string) => {
        setErrorMessage('');
        setSuccessMessage('');

        // Check localStorage to prevent duplicate votes
        if (hasVoted || localStorage.getItem(currentMonthKey)) {
            setErrorMessage('Ya has votado este mes. ¡Gracias por tu participación!');
            setHasVoted(true);
            return;
        }

        setVotingFor(optionId);

        try {
            // 1. Increment the vote count on the voting option in Supabase
            const option = options.find(o => o.id === optionId);
            if (option) {
                const { error: updateError } = await supabase
                    .from('voting_options')
                    .update({ votes: (option.votes || 0) + 1 })
                    .eq('id', optionId);

                if (updateError) {
                    console.error('Supabase update error:', updateError);
                    setErrorMessage('Error al registrar tu voto. Inténtalo de nuevo.');
                    setVotingFor(null);
                    return;
                }
            }

            // 2. If user is logged in, also record in monthly_votes for tracking
            if (user) {
                const currentDate = new Date().toISOString().slice(0, 10);
                await supabase
                    .from('monthly_votes')
                    .insert({
                        user_id: user.id,
                        project_id: optionId,
                        voting_month: currentDate,
                    })
                    .then(() => { }); // silently handle — localStorage is the primary guard
            }

            // 3. Save to localStorage to prevent re-voting (works for anonymous too)
            localStorage.setItem(currentMonthKey, optionId);

            // 4. Update local state
            setOptions(prev => prev.map(o =>
                o.id === optionId ? { ...o, votes: (o.votes || 0) + 1 } : o
            ));

            setHasVoted(true);
            setVotedOptionId(optionId);
            setSuccessMessage('🎉 ¡Tu voto ha sido registrado con éxito! Gracias por participar.');
        } catch {
            setErrorMessage('Error inesperado. Inténtalo de nuevo.');
        } finally {
            setVotingFor(null);
        }
    };

    const totalVotes = options.reduce((acc, o) => acc + (o.votes || 0), 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
            {/* Animated background decorations */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 via-violet-100/20 to-emerald-100/20 rounded-full blur-3xl -z-0 animate-pulse" style={{ animationDuration: '8s' }} />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-amber-100/30 via-transparent to-transparent rounded-full blur-3xl -z-0" />
            <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-r from-violet-100/20 to-transparent rounded-full blur-3xl -z-0" />

            {/* Top Navigation Bar */}
            <nav className="relative z-10 border-b border-gray-200/50 bg-white/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onNavigate('landing')}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-medium hidden sm:inline">Volver</span>
                        </button>
                        <div className="h-6 w-px bg-gray-200 hidden sm:block" />
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('landing')}>
                            <Logo className="w-7 h-7 text-primary" />
                            <span className="font-bold text-lg text-gray-800 tracking-tight">Donify</span>
                        </div>
                    </div>
                    {user ? (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">
                            <CheckCircle2 size={14} />
                            <span className="hidden sm:inline">{user.name || user.email}</span>
                            <span className="sm:hidden">Conectado</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => onNavigate('login')}
                            className="bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-black transition-all shadow-sm"
                        >
                            Iniciar Sesión
                        </button>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-12 md:pt-20 pb-8 text-center">
                {/* Live badge */}
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 shadow-sm">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    Votación en Vivo
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                    Elige el destino de{' '}
                    <span className="bg-gradient-to-r from-primary via-violet-500 to-emerald-500 bg-clip-text text-transparent">
                        tu impacto
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-6 leading-relaxed">
                    Tu voto decide a dónde van los fondos este mes. Selecciona la causa que más te importa y
                    haz que tu contribución cuente.
                </p>

                {/* Stats bar */}
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-12">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Users size={18} className="text-primary" />
                        <span className="text-sm font-semibold">{totalVotes} votos totales</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Trophy size={18} className="text-amber-500" />
                        <span className="text-sm font-semibold">{options.length} opciones activas</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                        <Timer size={18} className="text-violet-500" />
                        <span className="text-sm font-semibold">Febrero 2026</span>
                    </div>
                </div>
            </div>

            {/* Success / Error Messages */}
            {successMessage && (
                <div className="relative z-10 max-w-2xl mx-auto px-6 mb-8">
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-lg shadow-emerald-100/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CheckCircle2 size={20} className="shrink-0" />
                        {successMessage}
                    </div>
                </div>
            )}
            {errorMessage && (
                <div className="relative z-10 max-w-2xl mx-auto px-6 mb-8">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-semibold flex items-center gap-3 shadow-lg shadow-red-100/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <span className="text-lg">⚠️</span>
                        {errorMessage}
                    </div>
                </div>
            )}

            {/* Cards Grid */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-3xl border border-gray-100 overflow-hidden h-[520px] animate-pulse shadow-sm">
                                <div className="h-52 bg-gray-200" />
                                <div className="p-8">
                                    <div className="h-7 w-3/4 bg-gray-200 rounded-lg mb-4" />
                                    <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-8" />
                                    <div className="h-14 w-full bg-gray-200 rounded-2xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {options.map((option, index) => {
                            const theme = CARD_THEMES[index % CARD_THEMES.length];
                            const percentage = totalVotes > 0
                                ? Math.round((option.votes / totalVotes) * 100)
                                : 0;
                            const isLeading = index === 0 && totalVotes > 0;
                            const isVotedOption = votedOptionId === option.id;
                            const isVoting = votingFor === option.id;

                            return (
                                <div
                                    key={option.id}
                                    className={`group relative bg-white rounded-3xl border overflow-hidden transition-all duration-500 flex flex-col
                    ${isVotedOption
                                            ? `ring-2 ${theme.ring} border-transparent shadow-2xl ${theme.glow} scale-[1.02]`
                                            : 'border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 hover:border-gray-200'
                                        }`}
                                >
                                    {/* Image with gradient overlay */}
                                    <div className="h-52 overflow-hidden relative">
                                        <img
                                            src={option.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800'}
                                            alt={option.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        {/* Gradient overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-t ${theme.gradient} opacity-30 mix-blend-multiply`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                        {/* Top badges */}
                                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                            <span className={`${theme.badge} backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold shadow-sm`}>
                                                {theme.icon} Opción {String.fromCharCode(65 + index)}
                                            </span>
                                            {isLeading && (
                                                <span className="bg-amber-400 text-amber-900 px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1 shadow-lg shadow-amber-400/30 animate-bounce" style={{ animationDuration: '2s' }}>
                                                    <Trophy size={12} /> Líder
                                                </span>
                                            )}
                                        </div>

                                        {/* Vote count overlay */}
                                        <div className="absolute bottom-4 right-4">
                                            <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-sm font-black text-gray-900 shadow-lg flex items-center gap-2">
                                                <TrendingUp size={14} className="text-primary" />
                                                {percentage}%
                                            </div>
                                        </div>

                                        {/* Voted check */}
                                        {isVotedOption && (
                                            <div className="absolute bottom-4 left-4">
                                                <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                                                    <CheckCircle2 size={12} /> Tu voto
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                                        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                                            {option.title}
                                        </h3>

                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                            {option.description}
                                        </p>

                                        {/* Progress section */}
                                        <div className="mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Votos</span>
                                                <span className="text-sm font-black text-gray-900">{option.votes} votos</span>
                                            </div>
                                            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${theme.bar} rounded-full transition-all duration-1000 ease-out`}
                                                    style={{ width: `${Math.max(percentage, 2)}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Vote Button */}
                                        <button
                                            onClick={() => handleVote(option.id)}
                                            disabled={hasVoted || isVoting}
                                            className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2.5
                        ${hasVoted
                                                    ? isVotedOption
                                                        ? 'bg-emerald-100 text-emerald-700 cursor-default border border-emerald-200'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : `${theme.button} text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`
                                                }`}
                                        >
                                            {isVoting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Registrando voto...
                                                </>
                                            ) : hasVoted ? (
                                                isVotedOption ? (
                                                    <>
                                                        <CheckCircle2 size={20} />
                                                        ¡Has votado por esta opción!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Vote size={20} />
                                                        Ya has votado este mes
                                                    </>
                                                )
                                            ) : (
                                                <>
                                                    <Sparkles size={20} />
                                                    Votar por esta opción
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Bottom info */}
                {!loading && (
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-2xl text-sm text-gray-500 shadow-sm">
                            <Vote size={16} className="text-primary" />
                            <span>Cada miembro puede votar <strong className="text-gray-900">una vez al mes</strong>. Los resultados se actualizan en tiempo real.</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="relative z-10 border-t border-gray-200/50 bg-white/50 backdrop-blur-md py-8 px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Logo className="w-5 h-5" />
                        <span className="text-sm font-medium">Donify © 2026</span>
                    </div>
                    <div className="flex gap-6 text-xs text-gray-400">
                        <button onClick={() => onNavigate('legal')} className="hover:text-gray-700 transition-colors">Términos</button>
                        <button onClick={() => onNavigate('privacy')} className="hover:text-gray-700 transition-colors">Privacidad</button>
                        <button onClick={() => onNavigate('contact')} className="hover:text-gray-700 transition-colors">Contacto</button>
                    </div>
                </div>
            </footer>
        </div>
    );
}
