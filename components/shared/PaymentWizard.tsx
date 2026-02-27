import React, { useState, useEffect } from 'react';
import { User, SubscriptionTier, SubscriptionType } from '../../types';
import {
    CreditCard, Zap, Check, Star, Trophy, Crown,
    ChevronDown, Info, X, ShieldCheck, ArrowRight, Loader2,
    Calendar, RefreshCcw, User as UserIcon, Mail, Lock
} from 'lucide-react';
import { PRICE_IDS, initiateCheckout } from '../../lib/stripeClient';
import { supabase } from '../../lib/supabaseClient';
import { Logo } from './Logo';

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
    const [step, setStep] = useState<'register' | 'payment' | 'login'>(user ? 'payment' : 'register');
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setAuthError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();

                const loggedUser: User = {
                    id: data.user.id,
                    email: data.user.email!,
                    name: profile?.full_name || data.user.user_metadata?.full_name || '',
                    isSubscribed: profile?.subscription_tier != null,
                    subscriptionTier: profile?.subscription_tier,
                    hasVotedThisMonth: false
                };
                setCurrentUser(loggedUser);
                setStep('payment');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setAuthError('Correo o contraseña incorrectos.');
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
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={!isSubmitting ? onClose : undefined}
            />

            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] md:max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-500 border border-white/20">
                {/* Visual Sidebar (Brand & Trust) */}
                <div className="hidden md:flex md:w-80 bg-gray-50 p-10 flex-col justify-between border-r border-gray-100 relative overflow-hidden">
                    <div className="relative z-10">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-2 mb-8">
                            <Logo className="w-10 h-10 text-primary" />
                            <span className="font-black text-2xl text-gray-900 tracking-tight">Donify</span>
                        </div>

                        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-3 italic">
                            Tu donación <br /><span className="text-primary not-italic">impulsa el cambio</span>.
                        </h1>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed mb-8">
                            Seguridad Stripe • Transparencia Donify
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="text-green-500 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Garantía Donify</h4>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Tu donativo está protegido.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Lock className="text-blue-500 shrink-0 mt-0.5" size={18} />
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">Pago 100% Seguro</h4>
                                    <p className="text-[11px] text-gray-500 mt-0.5">Encriptación nivel bancario.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-12 relative flex flex-col bg-white overflow-y-auto w-full">
                    {!isSubmitting && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 md:top-6 md:right-6 p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full transition-all z-10"
                        >
                            <X size={20} />
                        </button>
                    )}

                    <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-center space-y-6">

                        {step === 'register' ? (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <div className="text-center md:text-left mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Crea tu cuenta</h2>
                                    <p className="text-sm text-gray-500 font-medium">Solo necesitamos unos datos básicos.</p>
                                </div>

                                {authError && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">
                                        {authError}
                                    </div>
                                )}

                                <form onSubmit={handleRegistration} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nombre Completo</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                placeholder="Tu nombre"
                                                value={fullName}
                                                onChange={e => setFullName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Correo Electrónico</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                placeholder="tu@email.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="password"
                                                required
                                                minLength={6}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <>Continuar al Pago <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                                <div className="mt-4 text-center">
                                    <button onClick={() => setStep('login')} className="text-xs text-primary font-bold hover:underline">
                                        ¿Ya tienes cuenta? Iniciar Sesión aquí
                                    </button>
                                </div>
                            </div>
                        ) : step === 'login' ? (
                            <div className="animate-in slide-in-from-left-4 duration-300">
                                <div className="text-center md:text-left mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Iniciar Sesión</h2>
                                    <p className="text-sm text-gray-500 font-medium">Bienvenido de nuevo a Donify.</p>
                                </div>

                                {authError && (
                                    <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4">
                                        {authError}
                                    </div>
                                )}

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Correo Electrónico</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                placeholder="tu@email.com"
                                                value={email}
                                                onChange={e => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Contraseña</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                                            <input
                                                type="password"
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={e => setPassword(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 mt-4 shadow-lg"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <>Entrar y Continuar <ArrowRight size={18} /></>}
                                    </button>
                                </form>
                                <div className="mt-4 text-center">
                                    <button onClick={() => setStep('register')} className="text-xs text-primary font-bold hover:underline">
                                        ¿No tienes cuenta? Regístrate aquí
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <div className="text-center md:text-left mb-6">
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2">Activar Suscripción</h2>
                                    <p className="text-sm text-gray-500 font-medium">Configura tu donación periódica.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-5">
                                    {/* DROPDOWN */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nivel de Suscripción</label>
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowTierSelect(!showTierSelect)}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 flex items-center justify-between group hover:border-primary transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-primary">
                                                        {currentPlan?.icon}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-black text-gray-900 text-sm">{currentPlan?.name}</p>
                                                        <p className="text-[11px] font-bold text-gray-500">{currentPlan?.frequency}</p>
                                                    </div>
                                                </div>
                                                <ChevronDown size={20} className={`text-gray-400 group-hover:text-primary transition-transform ${showTierSelect ? 'rotate-180' : ''}`} />
                                            </button>

                                            {showTierSelect && (
                                                <div className="absolute w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[130] animate-in slide-in-from-top-2 duration-200">
                                                    {tiers.map((t) => (
                                                        <button
                                                            key={t.id}
                                                            onClick={() => { setSelectedTier(t.id as SubscriptionTier); setShowTierSelect(false); }}
                                                            className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${selectedTier === t.id ? 'bg-primary/5' : ''}`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedTier === t.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                                {t.icon}
                                                            </div>
                                                            <div className="text-left flex-1">
                                                                <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                                                                <p className="text-[10px] text-gray-500">{t.desc}</p>
                                                            </div>
                                                            {selectedTier === t.id && <Check size={16} className="text-primary" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* TYPE SELECTOR */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Modalidad</label>
                                        <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1">
                                            <button
                                                onClick={() => setSelectedType('simple')}
                                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedType === 'simple' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                Simple (1,99€/mes)
                                            </button>
                                            <button
                                                onClick={() => setSelectedType('pro')}
                                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${selectedType === 'pro' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                Pro (1,99€/mes)
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* PRICE & ACTION */}
                                <div className="mt-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-bold text-gray-500">Total:</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-gray-900">{displayPrice.toFixed(2)}€</span>
                                            <span className="text-xs font-bold text-gray-400">/{currentPlan?.frequency.toLowerCase()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" size={22} /> : (
                                            <>
                                                Donar ahora
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>

                                    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Lock size={12} className="text-gray-400" />
                                        Pagos seguros con Stripe
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
