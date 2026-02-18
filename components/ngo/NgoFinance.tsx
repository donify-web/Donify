import React, { useState, useEffect } from 'react';
import { PageView, NgoPayout } from '../../types';
import { ArrowLeft, DollarSign, Download, ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface NgoFinanceProps {
    onNavigate: (view: PageView) => void;
    ngoId: string;
}

export default function NgoFinance({ onNavigate, ngoId }: NgoFinanceProps) {
    const [payouts, setPayouts] = useState<NgoPayout[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalPaid, setTotalPaid] = useState(0);

    useEffect(() => {
        if (ngoId) {
            fetchFinanceData();
        }
    }, [ngoId]);

    const fetchFinanceData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('ngo_payouts')
                .select('*')
                .eq('ngo_id', ngoId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const mappedPayouts: NgoPayout[] = (data || []).map(p => ({
                id: p.id,
                amount: p.amount,
                currency: 'EUR', // Default for now
                status: p.status,
                payout_date: p.payment_date
            }));

            setPayouts(mappedPayouts);
            // Calculate total of completed payouts
            const total = mappedPayouts
                .filter(p => p.status === 'completed')
                .reduce((acc, curr) => acc + curr.amount, 0);
            setTotalPaid(total);

        } catch (error) {
            console.error('Error fetching payouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStripeConnect = () => {
        alert('Redirigiendo a Stripe Connect... (Funcionalidad Mock)');
        // In real apps: window.location.href = stripeOauthUrl;
    };

    return (
        <div className="min-h-screen bg-bgMain pb-20">
            {/* Header */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => onNavigate('ngo-dashboard')}
                            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="font-medium">Volver al Dashboard</span>
                        </button>
                        <h1 className="text-xl font-bold text-gray-900 hidden md:block">Finanzas</h1>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Resumen Financiero</h1>
                        <p className="text-gray-600 mt-1">Gestiona tus ingresos y facturación</p>
                    </div>

                    <button
                        onClick={handleStripeConnect}
                        className="bg-[#635BFF] hover:bg-[#5851df] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    >
                        <span>Conectar con Stripe</span>
                        <ExternalLink size={16} />
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {/* Tarjeta de Balance */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm md:col-span-2">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <h2 className="text-gray-500 font-medium text-sm">Total Pagado</h2>
                                <p className="text-4xl font-bold text-gray-900">
                                    {totalPaid.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                </p>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 my-4"></div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> Cuenta Activa
                            </span>
                            <span>•</span>
                            <span>Próximo pago estimado: 01/03/2026</span>
                        </div>
                    </div>

                    {/* Tarjeta Informativa Stripe */}
                    <div className="bg-[#f8f9fa] rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-[#635BFF] mb-2">Powered by Stripe</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Utilizamos Stripe Connect para asegurar que los fondos lleguen directamente a tu cuenta bancaria de forma segura y transparente.
                            </p>
                            <a href="https://stripe.com/connect" target="_blank" rel="noreferrer" className="text-xs font-bold underline text-gray-500 hover:text-gray-800">Saber más</a>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-10 text-[#635BFF]">
                            <DollarSign size={120} />
                        </div>
                    </div>
                </div>

                {/* Tabla de Historial */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Historial de Transferencias</h2>
                        <button className="text-gray-400 hover:text-primary">
                            <Download size={20} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-10 flex justify-center">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    ) : payouts.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            <p>No hay transferencias registradas aún.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">ID Transacción</th>
                                        <th className="px-6 py-4">Fecha</th>
                                        <th className="px-6 py-4">Estado</th>
                                        <th className="px-6 py-4 text-right">Monto</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {payouts.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">
                                                {payout.id.slice(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {payout.payout_date || 'Pendiente'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={payout.status} />
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-gray-900">
                                                {payout.amount.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        completed: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        failed: 'bg-red-100 text-red-700'
    };

    const labels = {
        completed: 'Completado',
        pending: 'Pendiente',
        failed: 'Fallido'
    };

    const s = status as keyof typeof styles;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${styles[s] || 'bg-gray-100 text-gray-600'}`}>
            {labels[s] || status}
        </span>
    );
}
