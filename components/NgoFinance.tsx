import React from 'react';
import { PageView } from '../types';
import { ArrowLeft, DollarSign } from 'lucide-react';

interface NgoFinanceProps {
    onNavigate: (view: PageView) => void;
}

export default function NgoFinance({ onNavigate }: NgoFinanceProps) {
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
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-6">Finanzas y Transparencia</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-8 border border-gray-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                <DollarSign size={24} />
                            </div>
                            <h2 className="text-xl font-bold">Balance Disponible</h2>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">€0.00</p>
                        <p className="text-sm text-gray-500 mt-1">Conecta tu cuenta de Stripe para recibir pagos.</p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">Historial de transferencias próximamente...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
