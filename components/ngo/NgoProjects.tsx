import React, { useState, useEffect } from 'react';
import { PageView, NgoProject, NgoUser } from '../../types';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, Calendar, DollarSign, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface NgoProjectsProps {
    onNavigate: (view: PageView) => void;
    ngoUser: NgoUser;
}

export default function NgoProjects({ onNavigate, ngoUser }: NgoProjectsProps) {
    const [projects, setProjects] = useState<NgoProject[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<NgoProject>>({});
    const [activeTab, setActiveTab] = useState<'voting' | 'draft' | 'completed' | 'pending_approval'>('voting');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, [ngoUser.id]);

    const fetchProjects = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('ngo_id', ngoUser.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
        } else if (data) {
            // Map snake_case to camelCase if needed, or if types match. 
            // My SQL schema uses snake_case keys (title, description etc are same). 
            // Only ngo_id, image_url, goal_amount, voting_month, current_votes need mapping if type expects camelCase.
            // Let's assume type expects camelCase based on previous viewing of types.ts.
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
                currentVotes: p.current_votes
            }));
            setProjects(mapped);
        }
        setLoading(false);
    };

    const handleEdit = (project: NgoProject) => {
        setCurrentProject(project);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (!error) {
                setProjects(prev => prev.filter(p => p.id !== id));
            } else {
                alert('Error al eliminar proyecto');
            }
        }
    };

    const handleAddNew = () => {
        setCurrentProject({
            status: 'draft',
            currentVotes: 0,
            ngoId: ngoUser.id,
            imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800' // Default image
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const projectData = {
            ngo_id: ngoUser.id,
            title: currentProject.title,
            description: currentProject.description,
            category: currentProject.category,
            image_url: currentProject.imageUrl,
            goal_amount: currentProject.goalAmount,
            status: currentProject.status || 'draft',
            voting_month: currentProject.votingMonth, // Optional
            // current_votes is usually managed by system, not editable here unless strict admin
        };

        let result;
        if (currentProject.id) {
            // Update
            result = await supabase
                .from('projects')
                .update(projectData)
                .eq('id', currentProject.id)
                .select()
                .single();
        } else {
            // Create
            result = await supabase
                .from('projects')
                .insert([{ ...projectData, current_votes: 0 }])
                .select()
                .single();
        }

        const { data, error } = result;

        if (error) {
            console.error(error);
            alert('Error al guardar proyecto: ' + error.message);
        } else if (data) {
            // Refresh list or update local state manually
            await fetchProjects();
            setIsModalOpen(false);
        }
        setSaving(false);
    };

    // Filter projects logic
    // We treat 'pending_approval' as a separate tab or group it? 
    // Let's add 'pending_approval' to tabs or show it under 'Draft' for now?
    // User requested "Approve projects", so they likely go to a 'Pending' state.
    // I added 'pending_approval' to state types.

    // Group draft and pending? Or separate?
    // Let's separate for clarity.

    const filteredProjects = projects.filter(p => {
        if (activeTab === 'voting') return p.status === 'voting';
        if (activeTab === 'draft') return p.status === 'draft';
        if (activeTab === 'completed') return p.status === 'completed';
        if (activeTab === 'pending_approval') return p.status === 'pending_approval';
        return false;
    });

    return (
        <div className="min-h-screen bg-bgMain p-6">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => onNavigate('ngo-dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Volver al Dashboard</span>
                    </button>
                    <button
                        onClick={handleAddNew}
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5"
                    >
                        <Plus size={20} />
                        Nuevo Proyecto
                    </button>
                </div>

                <div className="flex justify-between items-end mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Proyectos</h1>
                    <div className="text-sm text-gray-500">
                        ONG: <span className="font-bold text-gray-900">{ngoUser.ngoName}</span>
                    </div>
                </div>

                {/* TABS */}
                <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
                    {(['voting', 'pending_approval', 'draft', 'completed'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-1 font-medium text-sm transition-colors relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab === 'voting' && 'En Votación'}
                            {tab === 'pending_approval' && 'Pendientes'}
                            {tab === 'draft' && 'Borradores'}
                            {tab === 'completed' && 'Histórico'}
                            {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
                        </button>
                    ))}
                </div>

                {/* PROJECTS GRID */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={32} /></div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.length === 0 ? (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-200 border-dashed">
                                <p className="text-gray-500">No hay proyectos en esta categoría.</p>
                                <button onClick={handleAddNew} className="text-primary font-semibold mt-2 hover:underline">Crear uno nuevo</button>
                            </div>
                        ) : (
                            filteredProjects.map(project => (
                                <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                                    <div className="h-48 overflow-hidden relative">
                                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm">
                                            {project.category}
                                        </div>
                                        <div className={`absolute bottom-2 left-2 px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1 ${project.status === 'voting' ? 'bg-green-500 text-white' :
                                                project.status === 'pending_approval' ? 'bg-orange-500 text-white' :
                                                    'bg-gray-200 text-gray-700'
                                            }`}>
                                            {project.status === 'voting' ? 'En Votación' : project.status === 'pending_approval' ? 'Pendiente' : project.status}
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{project.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{project.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                            {project.votingMonth && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{project.votingMonth}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <DollarSign size={14} />
                                                <span>Meta: €{project.goalAmount}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 border border-gray-200"
                                            >
                                                <Edit2 size={16} /> Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="w-10 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* MODAL / FORM */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-20">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {currentProject.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Título del Proyecto</label>
                                    <input
                                        required
                                        value={currentProject.title || ''}
                                        onChange={e => setCurrentProject(p => ({ ...p, title: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Ej: Reforestación Comunitaria"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Categoría</label>
                                        <select
                                            value={currentProject.category || ''}
                                            onChange={e => setCurrentProject(p => ({ ...p, category: e.target.value }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <option>Medio Ambiente</option>
                                            <option>Social</option>
                                            <option>Educación</option>
                                            <option>Salud</option>
                                            <option>Animales</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta de Financiación (€)</label>
                                        <input
                                            type="number"
                                            required
                                            value={currentProject.goalAmount || ''}
                                            onChange={e => setCurrentProject(p => ({ ...p, goalAmount: Number(e.target.value) }))}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={currentProject.description || ''}
                                        onChange={e => setCurrentProject(p => ({ ...p, description: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                        placeholder="Describe el impacto de este proyecto..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen de Portada (URL)</label>
                                    <div className="flex gap-4">
                                        <input
                                            type="url"
                                            value={currentProject.imageUrl || ''}
                                            onChange={e => setCurrentProject(p => ({ ...p, imageUrl: e.target.value }))}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                            placeholder="https://..."
                                        />
                                        <div className="w-16 h-10 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 overflow-hidden">
                                            {currentProject.imageUrl ? (
                                                <img src={currentProject.imageUrl} className="w-full h-full object-cover" />
                                            ) : <ImageIcon size={20} />}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estado (Solicitud)</label>
                                    <select
                                        value={currentProject.status || 'draft'}
                                        onChange={e => setCurrentProject(p => ({ ...p, status: e.target.value as any }))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                                    >
                                        <option value="draft">Borrador</option>
                                        <option value="pending_approval">Enviar para Aprobación</option>
                                        {/* NGOs cannot select 'voting' or 'completed' directly usually, but for now allow strict manual selection or limit it */}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">Selecciona "Enviar para Aprobación" para que un administrador revise tu proyecto.</p>
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    >
                                        {saving && <Loader2 className="animate-spin" size={18} />}
                                        {saving ? 'Guardando...' : 'Guardar Proyecto'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
