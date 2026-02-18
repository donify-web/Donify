import React, { useState, useEffect } from 'react';
import { PageView, SubscriptionTier } from '../../types';
import { ArrowLeft, CreditCard, FileText, Settings as SettingsIcon, Check, AlertCircle, TrendingUp, X, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { redirectToCustomerPortal, modifySubscription } from '../../lib/stripeClient';

interface SettingsProps {
    onNavigate: (view: PageView) => void;
    user: any; // Replace with proper User type
    onShowPaymentWizard?: (tier?: SubscriptionTier) => void;
}

type Tab = 'subscription' | 'payment' | 'history';

export default function Settings({ onNavigate, user, onShowPaymentWizard }: SettingsProps) {
    const [activeTab, setActiveTab] = useState<Tab>('subscription');
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Modals
    const [showFreqModal, setShowFreqModal] = useState(false);
    const [showTierModal, setShowTierModal] = useState(false);

    // Mock data - replace with actual data from Stripe/Supabase
    const currentTier = user.subscription_tier || 'Ninguno';
    const currentFrequency = 'Mensual'; // This should come from user object or stripe
    const currentAmount = user.subscription_tier === 'bronce' ? '0.99€' : (user.subscription_tier ? '1.99€' : '0.00€');

    useEffect(() => {
        if (activeTab === 'payment') {
            loadPaymentMethods();
        } else if (activeTab === 'history') {
            loadPaymentHistory();
        }
    }, [activeTab]);

    const loadPaymentMethods = async () => {
        if (!user.stripe_customer_id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('get-payment-methods', {
                body: { customerId: user.stripe_customer_id }
            });
            if (error) throw error;
            setPaymentMethods(data.paymentMethods || []);
        } catch (error) {
            console.error('Error loading payment methods:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPaymentHistory = async () => {
        if (!user.stripe_customer_id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('get-payment-history', {
                body: { customerId: user.stripe_customer_id, limit: 10 }
            });
            if (error) throw error;
            setPaymentHistory(data.invoices || []);
        } catch (error) {
            console.error('Error loading payment history:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePaymentMethod = async () => {
        if (!user.stripe_customer_id) {
            alert("No se ha encontrado un ID de cliente de Stripe.");
            return;
        }
        setActionLoading(true);
        const result = await redirectToCustomerPortal(user.stripe_customer_id);
        if (!result.success) {
            alert("Error al redirigir al portal de Stripe.");
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bgMain font-sans">
            {/* HEADER */}
            {/* HEADER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Configuración</h1>
                <p className="text-gray-500 font-medium">Gestiona tu cuenta y preferencias.</p>
            </div>

            {/* TABS */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('subscription')}
                            className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors ${activeTab === 'subscription' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Suscripción
                        </button>
                        <button
                            onClick={() => setActiveTab('payment')}
                            className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors ${activeTab === 'payment' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Método de Pago
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors ${activeTab === 'history' ? 'text-primary border-b-2 border-primary bg-primary/5' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Historial
                        </button>
                    </div>

                    <div className="p-8">
                        {activeTab === 'subscription' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Suscripción</h2>
                                    <p className="text-gray-600 font-medium">Administra tu nivel y frecuencia de donación</p>
                                </div>

                                <div className="bg-bgMain rounded-xl p-6 border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Plan Actual</h3>
                                            <p className="text-sm text-gray-500">Tu suscripción activa</p>
                                        </div>
                                        {user.is_subscribed && (
                                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                                                <Check size={18} />
                                                <span className="font-bold text-sm uppercase tracking-wider">Activa</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Nivel</div>
                                            <div className="text-xl font-bold text-primary capitalize">{currentTier}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Frecuencia</div>
                                            <div className="text-xl font-bold text-gray-900">{currentFrequency}</div>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">Monto</div>
                                            <div className="text-xl font-bold text-gray-900">{currentAmount}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => onShowPaymentWizard?.()}
                                        className="bg-primary hover:bg-primary-hover text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                                    >
                                        Cambiar Frecuencia
                                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <button
                                        onClick={() => onShowPaymentWizard?.()}
                                        className="bg-gray-900 hover:bg-black text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
                                    >
                                        Subir de Nivel
                                        <TrendingUp size={18} className="group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>

                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 shadow-sm">
                                    <AlertCircle className="text-blue-500 flex-shrink-0" size={20} />
                                    <div className="text-sm text-blue-900">
                                        <p className="font-bold mb-1">Información de cambios</p>
                                        Los cambios en tu suscripción se aplican al instante mediante Stripe. Las actualizaciones de nivel se prorratearán automáticamente.
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Métodos de Pago</h2>
                                    <p className="text-gray-600 font-medium font-medium font-medium">Administra tus tarjetas y métodos de pago de forma segura</p>
                                </div>

                                {loading ? (
                                    <div className="text-center py-12 bg-bgMain rounded-xl animate-pulse">
                                        <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
                                        <p className="text-gray-500 font-bold">Consultando a Stripe...</p>
                                    </div>
                                ) : paymentMethods.length > 0 ? (
                                    <div className="space-y-4">
                                        {paymentMethods.map((method) => (
                                            <div key={method.id} className="bg-bgMain border border-gray-100 rounded-xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-white p-3 rounded-lg shadow-sm">
                                                        <CreditCard className="text-primary" size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 tracking-wide uppercase">
                                                            {method.brand} •••• {method.last4}
                                                        </div>
                                                        <div className="text-sm text-gray-500 font-medium">
                                                            Expira {method.exp_month}/{method.exp_year}
                                                        </div>
                                                    </div>
                                                </div>
                                                {method.is_default && (
                                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                        Principal
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-bgMain rounded-xl border-2 border-dashed border-gray-200">
                                        <CreditCard className="text-gray-300 mx-auto mb-4" size={48} />
                                        <p className="text-gray-500 font-bold">No hay métodos de pago registrados</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleUpdatePaymentMethod}
                                    disabled={actionLoading}
                                    className="w-full bg-primary hover:bg-primary-hover text-white py-4 px-6 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                >
                                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <SettingsIcon size={20} />}
                                    Actualizar Método de Pago vía Stripe Portal
                                </button>

                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-600 shadow-sm leading-relaxed">
                                    <p className="font-bold text-gray-900 mb-1 flex items-center gap-1">
                                        <Check size={14} className="text-green-500" /> Seguridad Garantizada
                                    </p>
                                    Los datos de tu tarjeta son procesados de forma segura por Stripe. Donify nunca almacena información completa de tarjetas en nuestros servidores siguiendo los estándares PCI DSS.
                                </div>
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Historial de Pagos</h2>
                                    <p className="text-gray-600 font-medium">Revisa tus donaciones pasadas y descarga facturas</p>
                                </div>

                                {loading ? (
                                    <div className="text-center py-12">
                                        <Loader2 className="animate-spin text-primary mx-auto mb-4" size={32} />
                                        <p className="text-gray-500 font-bold">Cargando recibos...</p>
                                    </div>
                                ) : paymentHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {paymentHistory.map((invoice) => (
                                            <div key={invoice.id} className="bg-bgMain border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-white hover:shadow-sm transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-white p-2 rounded-lg shadow-xs group-hover:bg-primary/5 transition-colors">
                                                        <FileText className="text-gray-400 group-hover:text-primary transition-colors" size={24} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 flex items-center gap-2">
                                                            €{(invoice.amount / 100).toFixed(2)}
                                                            <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded uppercase">{invoice.currency}</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-medium">
                                                            {new Date(invoice.date * 1000).toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                        {invoice.status === 'paid' ? 'Pagado' : invoice.status}
                                                    </span>
                                                    {invoice.invoice_pdf && (
                                                        <a
                                                            href={invoice.invoice_pdf}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-white border border-gray-200 text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                                                        >
                                                            Recibo
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-bgMain rounded-xl border-2 border-dashed border-gray-200">
                                        <FileText className="text-gray-300 mx-auto mb-4" size={48} />
                                        <p className="text-gray-500 font-bold">No hay pagos registrados aún</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MODALS (Simplified for now - can be expanded to full selectors like Dashboard) */}
            {(showFreqModal || showTierModal) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="text-center space-y-4">
                            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary">
                                {showTierModal ? <TrendingUp size={32} /> : <SettingsIcon size={32} />}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {showTierModal ? 'Mejorar Tier' : 'Cambiar Frecuencia'}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Esta funcionalidad te permite ajustar tu donación recurrente rápidamente. Se aplicará en tu próximo ciclo.
                            </p>
                            <div className="grid gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowFreqModal(false);
                                        setShowTierModal(false);
                                        onNavigate('app');
                                    }}
                                    className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-colors shadow-md"
                                >
                                    Ir al Selector del Panel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowFreqModal(false);
                                        setShowTierModal(false);
                                    }}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-3 rounded-xl font-bold transition-colors"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
