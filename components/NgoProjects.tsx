import React from 'react';
import { PageView } from '../types';
import { ArrowLeft, Plus } from 'lucide-react';

interface NgoProjectsProps {
    onNavigate: (view: PageView) => void;
}

export default function NgoProjects({ onNavigate }: NgoProjectsProps) {
    return (
        <div className="min-h-screen bg-bgMain p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => onNavigate('ngo-dashboard')}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Volver al Dashboard</span>
                    </button>
                    <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2">
                        <Plus size={20} />
                        Nuevo Proyecto
                    </button>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Proyectos</h1>

                <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
                    <p className="text-gray-500">Aquí podrás crear y gestionar tus proyectos (Activos, Borradores, Histórico).</p>
                    <p className="text-sm text-gray-400 mt-2">Próximamente...</p>
                </div>
            </div>
        </div>
    );
}
