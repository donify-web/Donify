import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { NgoProject } from '../../types';
import { Loader2, ArrowRight } from 'lucide-react';

export default function VotingSection() {
    const [projects, setProjects] = useState<NgoProject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVotingProjects = async () => {
            try {
                // Fetch projects with status 'voting'
                // Limit to 3 or 4 top projects? Prompt says "Display the 3 active projects".
                const { data, error } = await supabase
                    .from('projects')
                    .select('*, ngo_profiles(ngo_name, logo_url)')
                    .eq('status', 'voting')
                    .order('current_votes', { ascending: false })
                    .limit(3);

                if (data) {
                    const mapped: NgoProject[] = data.map(p => ({
                        id: p.id,
                        ngoId: p.ngo_id,
                        title: p.title,
                        description: p.description,
                        category: p.category,
                        imageUrl: p.image_url,
                        goalAmount: p.goal_amount,
                        status: p.status,
                        votingMonth: p.voting_month,
                        currentVotes: p.current_votes,
                        // Add joined NGO data if needed for UI, but NgoProject type might not have it. 
                        // I will extend the display locally or use the added fields properties if I updated type, 
                        // but I didn't update NgoProject to have ngoName.
                        // I'll just use the raw data for display or cast it.
                        ngoName: p.ngo_profiles?.ngo_name,
                        ngoLogo: p.ngo_profiles?.logo_url
                    } as any));
                    setProjects(mapped);
                }
            } catch (error) {
                console.error('Error fetching voting projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVotingProjects();
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20 bg-white">
            <Loader2 className="animate-spin text-primary" size={32} />
        </div>
    );

    if (projects.length === 0) return null; // Don't show section if no active projects

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
                        Tu suscripción decide el destino de los fondos. Vota por tu causa favorita y ve el impacto al instante.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {projects.map((project: any) => {
                        // Calculate percentage of total votes
                        const totalVotesInSystem = projects.reduce((acc, p: any) => acc + (p.currentVotes || 0), 0);
                        const percentage = totalVotesInSystem > 0
                            ? Math.round(((project.currentVotes || 0) / totalVotesInSystem) * 100)
                            : 0;

                        return (
                            <div key={project.id} className="group flex flex-col bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                {/* Image Section */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={project.imageUrl || 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80'}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />

                                    {/* Percentage Badge (Top Right) */}
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold shadow-sm text-primary">
                                        {percentage}% votado
                                    </div>

                                    {/* Category Badge (Top Left) */}
                                    <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20">
                                        {project.category}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-4">
                                        {project.ngoLogo ? (
                                            <img src={project.ngoLogo} className="w-5 h-5 rounded-full bg-gray-100" />
                                        ) : <div className="w-5 h-5 rounded-full bg-gray-200" />}
                                        <span className="text-sm font-medium text-gray-500">{project.ngoName}</span>
                                    </div>

                                    <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                                        {project.description}
                                    </p>

                                    {/* Progress Bar Section (Bottom) */}
                                    <div className="mt-auto">
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>

                                        <button className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2 text-sm">
                                            Votar Proyecto
                                        </button>
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
