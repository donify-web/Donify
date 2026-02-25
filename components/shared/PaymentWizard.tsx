import React, { useState, useEffect } from 'react';
import { User, SubscriptionTier, SubscriptionType } from '../../types';
import {
    CreditCard, Zap, Check, Star, Trophy, Crown,
    ChevronDown, Info, X, ShieldCheck, ArrowRight, Loader2,
    Calendar, RefreshCcw, User as UserIcon, Mail, Lock
} from 'lucide-react';
import { PRICE_IDS, initiateCheckout } from '../../lib/stripeClient';
import { supabase } from '../../lib/supabaseClient';

interface PaymentWizardProps {
    user?: User | null;
    onClose: () => void;
    initialTier?: SubscriptionTier;
    initialType?: SubscriptionType; // Added
}

export const PaymentWizard: React.FC<PaymentWizardProps> = ({ user, onClose, initialTier = 'bronce', initialType = 'simple' }) => {
    const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(initialTier);
    const [selectedType, setSelectedType] = useState<SubscriptionType>(initialType);
    const isYearly = false; // One-time annual removed — always periodic
    const [showTierSelect, setShowTierSelect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auth / Registration State
    const [step, setStep] = useState<'register' | 'payment'>(user ? 'payment' : 'register');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [authError, setAuthError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null | undefined>(user);

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
            setStep('payment');
        }
    }, [user]);

    const handleRegistration = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setAuthError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                // Mock the user object for immediate flow
                const newUser: User = {
                    id: data.user.id,
                    email: data.user.email!,
                    name: fullName,
                    isSubscribed: false,
                    hasVotedThisMonth: false
                }
                setCurrentUser(newUser);
                setStep('payment');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            setAuthError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePayment = async () => {
        if (!currentUser) return;

        setIsSubmitting(true);
        try {
            let priceId = '';

            // Explicit mapping for "Direct Linking" to Stripe Configuration
            if (isYearly) {
                switch (selectedTier) {
                    case 'bronce':
                        priceId = selectedType === 'simple' ? PRICE_IDS.BRONZE_SIMPLE_YEARLY : PRICE_IDS.BRONZE_PRO_YEARLY;
                        break;
                    case 'plata':
                        priceId = selectedType === 'simple' ? PRICE_IDS.PLATA_SIMPLE_YEARLY : PRICE_IDS.PLATA_PRO_YEARLY;
                        break;
                    case 'oro':
                        priceId = selectedType === 'simple' ? PRICE_IDS.ORO_SIMPLE_YEARLY : PRICE_IDS.ORO_PRO_YEARLY;
                        break;
                    case 'diamante':
                        priceId = selectedType === 'simple' ? PRICE_IDS.DIAMANTE_SIMPLE_YEARLY : PRICE_IDS.DIAMANTE_PRO_YEARLY;
                        break;
                }
            } else {
                // Periodic (Standard Donify Logic: Month/Biweek/Week/Day)
                switch (selectedTier) {
                    case 'bronce':
                        priceId = selectedType === 'simple' ? PRICE_IDS.BRONZE_SIMPLE_MONTHLY : PRICE_IDS.BRONZE_PRO_MONTHLY;
                        break;
                    case 'plata':
                        priceId = selectedType === 'simple' ? PRICE_IDS.PLATA_SIMPLE_BIWEEKLY : PRICE_IDS.PLATA_PRO_BIWEEKLY;
                        break;
                    case 'oro':
                        priceId = selectedType === 'simple' ? PRICE_IDS.ORO_SIMPLE_WEEKLY : PRICE_IDS.ORO_PRO_WEEKLY;
                        break;
                    case 'diamante':
                        priceId = selectedType === 'simple' ? PRICE_IDS.DIAMANTE_SIMPLE_DAILY : PRICE_IDS.DIAMANTE_PRO_DAILY;
                        break;
                }
            }

            if (!priceId) throw new Error("Tarifa no configurada correctamente.");

            console.log('[PaymentWizard] Initiating checkout:', { priceId, userId: currentUser.id, tier: selectedTier, type: selectedType });

            const result = await initiateCheckout(priceId, currentUser.id);
            if (!result.success) {
                const errMsg = (result.error as any)?.message || JSON.stringify(result.error) || 'Error desconocido';
                console.error('[PaymentWizard] Checkout failed:', result.error);
                alert("Error al conectar con Stripe: " + errMsg);
            }
        } catch (error: any) {
            console.error('[PaymentWizard] Exception:', error);
            alert("Error al iniciar el pago: " + (error?.message || JSON.stringify(error)));
        } finally {
            setIsSubmitting(false);
        }
    };

    const tiers = [
        {
            id: 'bronce',
            name: 'Bronce',
            priceSimple: 0.99,
            pricePro: 1.99,
            frequency: 'Mensual',
            icon: <Star className="text-orange-400" size={24} />,
            desc: 'Impacto básico para dar tus primeros pasos.'
        },
        {
            id: 'plata',
            name: 'Plata',
            priceSimple: 0.99,
            pricePro: 1.99,
            frequency: 'Quincenal',
            icon: <Zap className="text-blue-400" size={24} />,
            desc: 'Compromiso medio con mayor poder de decisión.'
        },
        {
            id: 'oro',
            name: 'Oro',
            priceSimple: 0.99,
            pricePro: 1.99,
            frequency: 'Semanal',
            icon: <Trophy className="text-amber-400" size={24} />,
            desc: 'Impacto significativo y beneficios exclusivos.',
            popular: true
        },
        {
            id: 'diamante',
            name: 'Diamante',
            priceSimple: 0.99,
            pricePro: 1.99,
            frequency: 'Cada 4 días',
            icon: <Crown className="text-indigo-400" size={24} />,
            desc: 'El máximo nivel de apoyo para fundadores.'
        },
    ];

    const currentPlan = tiers.find(t => t.id === selectedTier);

    // Calculate display price
    let basePrice = selectedType === 'simple' ? currentPlan?.priceSimple || 0 : currentPlan?.pricePro || 0;
    let displayPrice = basePrice;

    if (isYearly) {
        const multiplier = (selectedTier === 'bronce' ? 12 : selectedTier === 'plata' ? 26 : selectedTier === 'oro' ? 52 : 91);
        displayPrice = basePrice * multiplier;
    }

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-500"
                onClick={!isSubmitting ? onClose : undefined}
            />

            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500 border border-white/20">
                {/* Visual Sidebar */}
                <div className="hidden md:flex md:w-80 bg-gray-900 p-10 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-[-50px] left-[-20px] w-64 h-64 border-2 border-white rounded-full"></div>
                        <div className="absolute bottom-[-100px] right-[-50px] w-96 h-96 border-[16px] border-primary/20 rounded-full"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="bg-primary/20 text-primary p-3 rounded-2xl inline-block mb-8 border border-primary/30">
                            <CreditCard size={24} />
                        </div>
                        <h1 className="text-2xl font-black text-white leading-tight mb-3 tracking-tighter italic">
                            Gestiona tu <br /><span className="text-primary not-italic">Compromiso</span>.
                        </h1>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                            Seguridad Stripe • Transparencia Donify
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="p-5 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Pago Seguro</span>
                            </div>
                            <p className="text-[9px] text-gray-400 font-medium leading-relaxed">
                                Utilizamos Stripe para procesar todos los pagos. Donify nunca almacena tus datos bancarios.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-12 relative flex flex-col bg-gray-50/30 overflow-y-auto">
                    {!isSubmitting && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 text-gray-300 hover:text-gray-900 bg-white rounded-2xl shadow-sm transition-all z-10"
                        >
                            <X size={20} />
                        </button>
                    )}

                    <div className="max-w-xl mx-auto w-full space-y-6">

                        {/* Steps Indicator */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className={`h-1 flex-1 rounded-full ${step === 'register' ? 'bg-primary' : 'bg-green-500'}`}></div>
                            <div className={`h-1 flex-1 rounded-full ${step === 'payment' ? 'bg-primary' : 'bg-gray-200'}`}></div>
                        </div>


                        {step === 'register' ? (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <div className="text-center md:text-left mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Crea tu cuenta</h2>
                                    <p className="text-sm text-gray-500 font-medium">Solo necesitamos unos datos para procesar tu donación.</p>
                                </div>

                                {authError && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                                        {authError}
                                    </div>
                                )}

                                <form onSubmit={handleRegistration} className="space-y-4">
                                    <div>
                                        <label className="block text text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nombre Completo</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                placeholder="Tu nombre"
                                                value={fullName}
                                                onChange={e => setFullName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Correo Electrónico</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                placeholder="tu@email.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 mt-4"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <>Continuar al Pago <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                                <div className="mt-4 text-center">
                                    <button onClick={() => setStep('payment')} className="text-xs text-primary font-bold hover:underline">
                                        ¿Ya tienes cuenta? Iniciar Sesión (Mock: Skip)
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <div className="text-center md:text-left">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Activar Suscripción</h2>
                                    <p className="text-sm text-gray-500 font-medium">Hola {currentUser?.name || currentUser?.email}, configura tu donación.</p>
                                </div>

                                {/* FREQUENCY BADGE — periodic only */}
                                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm mt-6">
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                        <RefreshCcw size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">Suscripción Periódica</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cargo automático · cancela cuando quieras</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 mt-6">
                                    {/* THE FORMAL DROPDOWN */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nivel de Suscripción</label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowTierSelect(!showTierSelect)}
                                                className="w-full bg-white border-2 border-gray-100 rounded-2xl p-5 flex items-center justify-between group hover:border-primary transition-all duration-300 shadow-sm"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        {currentPlan?.icon}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-black text-gray-900 text-base">{currentPlan?.name}</p>
                                                        <p className="text-[11px] font-bold text-gray-400">{isYearly ? 'Anual' : currentPlan?.frequency}</p>
                                                    </div>
                                                </div>
                                                <ChevronDown size={24} className={`text-gray-300 group-hover:text-primary transition-transform ${showTierSelect ? 'rotate-180' : ''}`} />
                                            </button>

                                            {showTierSelect && (
                                                <div className="absolute w-full mt-3 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[130] animate-in slide-in-from-top-2 duration-200">
                                                    {tiers.map((t) => (
                                                        <button
                                                            key={t.id}
                                                            onClick={() => { setSelectedTier(t.id as SubscriptionTier); setShowTierSelect(false); }}
                                                            className={`w-full p-5 flex items-center gap-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${selectedTier === t.id ? 'bg-primary/5' : ''}`}
                                                        >
                                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedTier === t.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                                {t.icon}
                                                            </div>
                                                            <div className="text-left flex-1">
                                                                <p className="font-black text-gray-900 text-sm">{t.name}</p>
                                                                <p className="text-[10px] font-bold text-gray-400">{t.desc}</p>
                                                            </div>
                                                            {selectedTier === t.id && <Check size={18} className="text-primary" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* TYPE SELECTOR */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Modalidad de Perfil</label>
                                        <div className="bg-white border-2 border-gray-100 p-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm">
                                            <button
                                                onClick={() => setSelectedType('simple')}
                                                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${selectedType === 'simple' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                Simple
                                            </button>
                                            <button
                                                onClick={() => setSelectedType('pro')}
                                                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${selectedType === 'pro' ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                                            >
                                                Pro
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* PRICE & ACTION */}
                                <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden group mt-6">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none group-hover:scale-125 transition-transform duration-700">
                                        <Zap size={64} fill="currentColor" className="text-primary" />
                                    </div>

                                    <div className="relative z-10">
                                        {/* Price row */}
                                        <div className="flex items-center justify-between mb-5">
                                            <div>
                                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Total por periodo</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-black">{displayPrice}€</span>
                                                    <span className="text-sm font-bold opacity-50">/{currentPlan?.frequency.toLowerCase()}</span>
                                                </div>
                                            </div>
                                            <div className="text-right text-[10px] text-gray-500 font-bold uppercase leading-relaxed">
                                                <span className="block">{currentPlan?.name}</span>
                                                <span className="block text-primary">{selectedType === 'simple' ? 'Simple' : 'Pro'}</span>
                                            </div>
                                        </div>

                                        {/* CTA button — always full width */}
                                        <button
                                            onClick={handlePayment}
                                            disabled={isSubmitting}
                                            className="w-full py-4 bg-primary text-white rounded-2xl font-black text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                        >
                                            {isSubmitting ? <Loader2 className="animate-spin" size={22} /> : (
                                                <>
                                                    Activar Suscripción
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>

                                        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <Info size={13} className="text-primary shrink-0" />
                                                Sin permanencia · cancela cuando quieras
                                            </div>
                                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-3.5 invert opacity-40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentWizard;
