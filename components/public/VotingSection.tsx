import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { VotingOption } from '../../types';
import { TrendingUp, Users, Trophy } from 'lucide-react';

export default function VotingSection() {
    const [options, setOptions] = useState<VotingOption[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVotingOptions = async () => {
            try {
                // Try voting_options table first
                const { data, error } = await supabase
                    .from('voting_options')
                    .select('*')
                    .eq('is_active', true)
                    .order('votes', { ascending: false });

                if (data && data.length > 0) {
                    setOptions(data);
                } else {
                    // Fallback: try projects table
                    const { data: projectData } = await supabase
                        .from('projects')
                        .select('*, ngo_profiles(ngo_name)')
                        .eq('status', 'voting')
                        .order('current_votes', { ascending: false })
                        .limit(3);

                    if (projectData && projectData.length > 0) {
                        const mapped: VotingOption[] = projectData.map(p => ({
                            id: p.id,
                            title: p.title,
                            description: p.description,
                            image_url: p.image_url,
                            votes: p.current_votes || 0,
                            is_active: true,
                            created_at: p.created_at
                        }));
                        setOptions(mapped);
                    } else {
                        // Final fallback: mock data
                        setOptions([
                            {
                                id: 'mock-1', title: 'Reforestación Galicia',
                                description: 'Plantación de 500 árboles nativos en zonas afectadas por incendios forestales.',
                                image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
                                votes: 245, is_active: true, created_at: ''
                            },
                            {
                                id: 'mock-2', title: 'Comedores Sociales Madrid',
                                description: 'Apoyo nutricional diario para 200 personas en situación de vulnerabilidad.',
                                image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
                                votes: 189, is_active: true, created_at: ''
                            },
                            {
                                id: 'mock-3', title: 'Educación Digital Rural',
                                description: 'Tablets y conectividad para escuelas rurales en la España vaciada.',
                                image_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
                                votes: 120, is_active: true, created_at: ''
                            }
                        ]);
                    }
                }
            } catch (error) {
                console.error('Error fetching voting data:', error);
                setOptions([
                    {
                        id: 'mock-err-1', title: 'Reforestación Galicia',
                        description: 'Plantación de 500 árboles nativos en zonas afectadas.',
                        image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
                        votes: 245, is_active: true, created_at: ''
                    },
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchVotingOptions();
    }, []);

    const totalVotes = options.reduce((acc, o) => acc + (o.votes || 0), 0);

    if (loading) return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className="h-4 w-32 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                    <div className="h-10 w-3/4 max-w-lg bg-gray-200 rounded-xl mx-auto mb-6 animate-pulse"></div>
                    <div className="h-4 w-1/2 max-w-md bg-gray-200 rounded-full mx-auto animate-pulse"></div>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-[320px] animate-pulse">
                            <div className="h-48 bg-gray-200"></div>
                            <div className="p-6">
                                <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                                <div className="h-3 w-full bg-gray-200 rounded-full mt-6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    const CARD_COLORS = [
        { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', icon: '🌿' },
        { bar: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700', icon: '💜' },
        { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', icon: '📚' },
    ];

    return (
        <section className="py-20 bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 flex items-center justify-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        En Vivo
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Resultados en Tiempo Real</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Tu suscripción decide el destino de los fondos. Mira cómo votan los miembros en tiempo real.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {options.map((option, index) => {
                        const percentage = totalVotes > 0
                            ? Math.round(((option.votes || 0) / totalVotes) * 100)
                            : 0;
                        const color = CARD_COLORS[index % CARD_COLORS.length];
                        const isLeading = index === 0 && totalVotes > 0;

                        return (
                            <div key={option.id} className="group flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {/* Image Section */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={option.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800'}
                                        alt={option.title}
                                        loading="lazy"
                                        width="800"
                                        height="600"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                                    {/* Percentage Badge */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm text-primary flex items-center gap-1">
                                        <TrendingUp size={12} />
                                        {percentage}%
                                    </div>

                                    {/* Option Badge */}
                                    <div className={`absolute top-4 left-4 ${color.badge} backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm`}>
                                        {color.icon} Opción {String.fromCharCode(65 + index)}
                                    </div>

                                    {/* Leader badge */}
                                    {isLeading && (
                                        <div className="absolute bottom-4 left-4 bg-amber-400 text-amber-900 px-2.5 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-lg">
                                            <Trophy size={10} /> Líder
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                        {option.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {option.description}
                                    </p>

                                    {/* Progress Bar Section */}
                                    <div className="mt-auto">
                                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                                            <div
                                                className={`h-full ${color.bar} rounded-full transition-all duration-1000 ease-out`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                                            <span className="flex items-center gap-1">
                                                <Users size={12} />
                                                {option.votes} votos
                                            </span>
                                            <span className="font-bold text-gray-700">{percentage}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
