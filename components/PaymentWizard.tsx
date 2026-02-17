import React, { useState } from 'react';
import { X, Check, Shield, Star, Zap, Crown, CreditCard } from 'lucide-react';
import { SubscriptionTier, SubscriptionType } from '../types';
import { initiateCheckout } from '../lib/stripeClient';
import { useAuth } from '../contexts/AuthContext';

interface PaymentWizardProps {
    isOpen: boolean;
    onClose: () => void;
    initialTier?: SubscriptionTier;
}

export default function PaymentWizard({ isOpen, onClose, initialTier = 'oro' }: PaymentWizardProps) {
    const { user } = useAuth();
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(initialTier);
    const [subscriptionType, setSubscriptionType] = useState<SubscriptionType>('simple');
    const [frequency, setFrequency] = useState<'monthly' | 'yearly'>('monthly');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const tiers = {
        bronce: { name: 'Bronce', price: { simple: 0.99, pro: 1.99 }, color: 'bg-amber-100 text-amber-700', icon: Shield },
        plata: { name: 'Plata', price: { simple: 2.99, pro: 5.99 }, color: 'bg-gray-100 text-gray-500', icon: Star },
        oro: { name: 'Oro', price: { simple: 9.99, pro: 19.99 }, color: 'bg-yellow-100 text-yellow-600', icon: Zap },
        diamante: { name: 'Diamante', price: { simple: 49.99, pro: 99.99 }, color: 'bg-blue-100 text-blue-600', icon: Crown },
    };

    const handlePayment = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // Logic to get correct Price ID based on selection
            // This would normally map to env vars, simulating for now
            const priceId = `price_${selectedTier}_${subscriptionType}_${frequency}`;
            console.log(`Initiating checkout for: ${priceId}`);

            await initiateCheckout(priceId, user.id, frequency === 'yearly' ? 'payment' : 'subscription');
        } catch (error) {
            console.error('Payment failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const currentPrice = tiers[selectedTier].price[subscriptionType];
    const finalPrice = frequency === 'yearly' ? currentPrice * 12 * 0.8 : currentPrice; // 20% discount mock

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Configura tu Plan</h2>
                        <p className="text-sm text-gray-500">Personaliza tu impacto en Donify</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                    {/* Frequency Toggle */}
                    <div className="flex justify-center mb-8">
                        <div className="bg-gray-100 p-1 rounded-xl flex">
                            <button
                                onClick={() => setFrequency('monthly')}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${frequency === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Mensual
                            </button>
                            <button
                                onClick={() => setFrequency('yearly')}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${frequency === 'yearly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                Anual
                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    AHORRA 20%
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Tier Selection Grid */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                        {(Object.keys(tiers) as SubscriptionTier[]).map((tierKey) => {
                            const tier = tiers[tierKey];
                            const isSelected = selectedTier === tierKey;

                            return (
                                <button
                                    key={tierKey}
                                    onClick={() => setSelectedTier(tierKey)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${isSelected
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${tier.color}`}>
                                        <tier.icon size={20} />
                                    </div>
                                    <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-gray-600'}`}>
                                        {tier.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Type Toggle (Simple vs Pro) */}
                    <div className="bg-blue-50/50 rounded-2xl p-6 mb-8 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-bold text-gray-900">Tipo de Suscripción</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setSubscriptionType('simple')}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${subscriptionType === 'simple'
                                        ? 'border-blue-500 bg-white shadow-md'
                                        : 'border-transparent hover:bg-white/50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-900">Individual</span>
                                    {subscriptionType === 'simple' && <Check size={16} className="text-blue-500" />}
                                </div>
                                <p className="text-xs text-gray-500">Para donantes personales</p>
                            </button>

                            <button
                                onClick={() => setSubscriptionType('pro')}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${subscriptionType === 'pro'
                                        ? 'border-blue-500 bg-white shadow-md'
                                        : 'border-transparent hover:bg-white/50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-gray-900">Profesional</span>
                                    {subscriptionType === 'pro' && <Check size={16} className="text-blue-500" />}
                                </div>
                                <p className="text-xs text-gray-500">Para empresas y marcas</p>
                            </button>
                        </div>
                    </div>

                    {/* Summary & Action */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total a pagar</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-gray-900">€{finalPrice.toFixed(2)}</span>
                                <span className="text-sm text-gray-500">/{frequency === 'monthly' ? 'mes' : 'año'}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                'Procesando...'
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    Continuar al Pago
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
