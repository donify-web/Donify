import React from 'react';
import { X, Check, Star, Shield, Zap, Crown } from 'lucide-react';
import { SubscriptionTier } from '../../types';

interface TierBenefitsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectTier: (tier: SubscriptionTier) => void;
}

export default function TierBenefitsModal({ isOpen, onClose, onSelectTier }: TierBenefitsModalProps) {
    if (!isOpen) return null;

    const tiers = [
        {
            id: 'bronce' as SubscriptionTier,
            name: 'Bronce',
            icon: Shield,
            color: 'text-amber-700',
            bgColor: 'bg-amber-100',
            description: 'Impacto básico para empezar a ayudar.',
            features: ['1 Voto mensual', 'Certificado básico', 'Reportes trimestrales'],
        },
        {
            id: 'plata' as SubscriptionTier,
            name: 'Plata',
            icon: Star,
            color: 'text-gray-400',
            bgColor: 'bg-gray-100',
            description: 'Mayor compromiso con causas sociales.',
            features: ['2 Votos mensuales', 'Certificado oficial', 'Reportes mensuales', 'Insignia de perfil'],
        },
        {
            id: 'oro' as SubscriptionTier,
            name: 'Oro',
            icon: Zap,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-100',
            recommended: true,
            description: 'El equilibrio perfecto de impacto.',
            features: ['5 Votos mensuales', 'Certificado premium', 'Reportes detallados', 'Acceso a eventos', 'Soporte prioritario'],
        },
        {
            id: 'diamante' as SubscriptionTier,
            name: 'Diamante',
            icon: Crown,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100',
            description: 'Máximo impacto y exclusividad.',
            features: ['10 Votos mensuales', 'Certificado diamante', 'Contacto directo con ONGs', 'Mesa redonda anual', 'Merchandising exclusivo'],
        },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Niveles de Impacto</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Elige el nivel de suscripción que mejor se adapte a tu compromiso.
                            Cada nivel desbloquea más poder de voto y beneficios exclusivos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tiers.map((tier) => (
                            <div
                                key={tier.id}
                                className={`relative border-2 rounded-2xl p-6 transition-all hover:scale-105 hover:shadow-xl ${tier.recommended ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-300'
                                    }`}
                            >
                                {tier.recommended && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                        RECOMENDADO
                                    </div>
                                )}

                                <div className={`w-12 h-12 ${tier.bgColor} ${tier.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <tier.icon size={24} />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                                <p className="text-sm text-gray-500 mb-6 h-10">{tier.description}</p>

                                <ul className="space-y-3 mb-8">
                                    {tier.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                            <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => onSelectTier(tier.id)}
                                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${tier.recommended
                                            ? 'bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30'
                                            : 'bg-gray-900 text-white hover:bg-black'
                                        }`}
                                >
                                    Seleccionar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
