import React, { useState } from 'react';
import { PageView, NgoProject } from '../../types';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, Calendar, DollarSign, Image as ImageIcon, X } from 'lucide-react';

interface NgoProjectsProps {
    onNavigate: (view: PageView) => void;
}

// Mock Data
const initialProjects: NgoProject[] = [
    {
        id: '1',
        ngoId: 'ngo-1',
        title: 'Reforestación de zonas quemadas',
        description: 'Plantación de 500 árboles nativos en Galicia.',
        category: 'Medio Ambiente',
        goalAmount: 5000,
        imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
        status: 'voting',
        votingMonth: '2026-02',
        currentVotes: 245
    },
    {
        id: '2',
        ngoId: 'ngo-1',
        title: 'Beca comedor escolar',
        description: 'Asegurar comida caliente para 50 niños.',
        category: 'Social',
        goalAmount: 2000,
        imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800',
        status: 'draft',
        votingMonth: '2026-03',
        currentVotes: 0
    }
];

export default function NgoProjects({ onNavigate }: NgoProjectsProps) {
    const [projects, setProjects] = useState<NgoProject[]>(initialProjects);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<NgoProject>>({});
    const [activeTab, setActiveTab] = useState<'voting' | 'draft' | 'completed'>('voting');

    const handleEdit = (project: NgoProject) => {
        setCurrentProject(project);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
            setProjects(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleAddNew = () => {
        setCurrentProject({
            status: 'draft',
            currentVotes: 0,
            ngoId: 'ngo-1', // Mock ID
            imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800' // Default image
        });
        setIsModalOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (currentProject.id) {
            // Edit
            setProjects(prev => prev.map(p => p.id === currentProject.id ? currentProject as NgoProject : p));
        } else {
            // Create
            const newProject = {
                ...currentProject,
                id: Math.random().toString(36).substr(2, 9),
            } as NgoProject;
            setProjects(prev => [...prev, newProject]);
        }
        setIsModalOpen(false);
    };

    const filteredProjects = projects.filter(p => p.status === activeTab);

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

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Proyectos</h1>

                {/* TABS */}
                <div className="flex gap-4 mb-8 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('voting')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'voting' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        En Votación (Activos)
                        {activeTab === 'voting' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('draft')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'draft' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Borradores
                        {activeTab === 'draft' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`pb-3 px-1 font-medium text-sm transition-colors relative ${activeTab === 'completed' ? 'text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Completados (Histórico)
                        {activeTab === 'completed' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></span>}
                    </button>
                </div>

                {/* PROJECTS GRID */}
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
                                    {project.status === 'voting' && (
                                        <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-bold shadow-sm flex items-center gap-1">
                                            <Eye size={12} /> En Votación
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">{project.title}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{project.description}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            <span>{project.votingMonth}</span>
                                        </div>
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
                                        className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all transform hover:-translate-y-0.5"
                                    >
                                        Guardar Proyecto
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
