import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { VotingOption } from '../../types';
import { TrendingUp, Users, Trophy } from 'lucide-react';

const INITIAL_MOCK_DATA: VotingOption[] = [
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
];

export default function VotingSection() {
    // Start with mock data instantly to avoid slow skeleton loading
    const [options, setOptions] = useState<VotingOption[]>(INITIAL_MOCK_DATA);

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
                    }
                }
            } catch (error) {
                console.error('Error fetching voting data:', error);
            }
        };

        fetchVotingOptions();
    }, []);

    const totalVotes = options.reduce((acc, o) => acc + (o.votes || 0), 0);



    const CARD_COLORS = [
        { bar: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', icon: '🌿' },
        { bar: 'bg-violet-500', badge: 'bg-violet-100 text-violet-700', icon: '💜' },
        { bar: 'bg-amber-500', badge: 'bg-amber-100 text-amber-700', icon: '📚' },
    ];

    return (
        <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-left mb-12">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tight">
                        Descubre el impacto que estás impulsando
                    </h2>
                    <p className="text-base text-gray-600 font-medium max-w-2xl">
                        Tu suscripción decide el destino de los fondos. Mira cómo votan los miembros en tiempo real.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                    {options.map((option, index) => {
                        const percentage = totalVotes > 0
                            ? Math.round(((option.votes || 0) / totalVotes) * 100)
                            : 0;
                        const isLeading = index === 0 && totalVotes > 0;

                        return (
                            <div key={option.id} className="group flex flex-col cursor-pointer">
                                {/* Image Section (GoFundMe Style) */}
                                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                                    <img
                                        src={option.image_url || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800'}
                                        alt={option.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />

                                    {/* Floating Badges */}
                                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold">
                                        Opción {String.fromCharCode(65 + index)}
                                    </div>

                                    {isLeading && (
                                        <div className="absolute top-3 left-3 bg-white text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
                                            <Trophy size={12} className="text-amber-500" /> Líder
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="flex flex-col">
                                    <h3 className="text-base font-bold text-gray-900 mb-1 leading-snug line-clamp-2 group-hover:underline decoration-2 underline-offset-2">
                                        {option.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {option.description}
                                    </p>

                                    {/* Minimalist Progress Bar */}
                                    <div className="mt-auto">
                                        <div className="text-sm font-bold text-gray-900 mb-2">
                                            {option.votes} votos <span className="text-gray-500 font-normal">recibidos</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-600 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            />
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
