import React, { useState } from 'react';
import { PageView } from '../../types';
import { ArrowLeft, CheckSquare, Upload, FileText, Loader2, Building2, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';

interface NgoApplyProps {
    onNavigate: (view: PageView) => void;
}

export default function NgoApply({ onNavigate }: NgoApplyProps) {
    const { user, refreshProfile } = useAuth();
    const [step, setStep] = useState<1 | 2>(1); // 1: Checklist, 2: Form
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        ngoName: '',
        cif: '',
        website: '',
        category: '',
        description: '',
        impactGoal: '',
        goalAmount: '',
        contactName: '',
        contactEmail: ''
    });

    const handleStart = () => {
        if (!user) {
            onNavigate('login');
            return;
        }
        setStep(2);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!user) return;

        try {
            const { error: insertError } = await supabase.from('ngo_profiles').insert({
                auth_user_id: user.id,
                ngo_name: formData.ngoName,
                cif: formData.cif,
                website: formData.website,
                category: formData.category,
                description: formData.description,
                mission: formData.impactGoal, // Using impactGoal as mission for now
                is_verified: false // Requires admin approval
            });

            if (insertError) throw insertError;

            // Update local profile to reflect isNgo status (requires AuthContext refresh)
            await refreshProfile();

            setSubmitted(true);
        } catch (err: any) {
            console.error('Error applying:', err);
            setError(err.message || 'Error al enviar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-bgMain flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Building2 size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Solicitud Recibida</h2>
                <p className="text-gray-600 max-w-md mb-8">
                    Tu solicitud ha sido registrada correctamente. Ahora puedes acceder a tu panel, aunque algunas funciones estarán limitadas hasta la verificación.
                </p>
                <button
                    onClick={() => onNavigate('ngo-dashboard')}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors"
                >
                    Ir al Panel de ONG
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bgMain font-sans text-textMain">
            <nav className="p-6">
                <button onClick={() => onNavigate('landing')} className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
                    <ArrowLeft size={20} /> Volver
                </button>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Financia tu impacto</h1>
                    <p className="text-lg text-gray-600">
                        Accede a miles de micro-donantes sin invertir en marketing. Si tu causa es real, la comunidad te apoyará.
                    </p>
                </div>

                {step === 1 ? (
                    /* STEP 1: ELIGIBILITY CHECKLIST */
                    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Requisitos Previos</h3>
                        <div className="space-y-4 mb-8">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <div className="mt-1 text-primary"><CheckSquare size={20} /></div>
                                <span className="text-gray-700">Somos una organización sin ánimo de lucro legalmente registrada en España.</span>
                            </label>
                            {/* ... more checks ... */}
                            <div className="text-sm text-gray-500 italic mt-4 bg-blue-50 p-3 rounded-lg">
                                Nota: Debes iniciar sesión o registrarte como usuario antes de poder crear una ONG.
                            </div>
                        </div>
                        <button
                            onClick={handleStart}
                            className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                        >
                            {user ? 'Cumplimos los requisitos. Empezar.' : 'Inicia sesión para empezar'}
                        </button>
                    </div>
                ) : (
                    /* STEP 2: APPLICATION FORM */
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-8 border border-gray-100 space-y-8 animate-in slide-in-from-bottom-10 duration-500">

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        {/* Org Details */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 size={20} className="text-primary" /> Datos de la Organización
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input name="ngoName" required placeholder="Nombre Legal de la ONG" value={formData.ngoName} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                <input name="cif" required placeholder="CIF / NIF" value={formData.cif} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                <input name="website" placeholder="Sitio Web" value={formData.website} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                <select name="category" required value={formData.category} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none">
                                    <option value="">Selecciona Sector...</option>
                                    <option value="Environment">Medio Ambiente</option>
                                    <option value="Social">Social / Humanitario</option>
                                    <option value="Education">Educación</option>
                                    <option value="Health">Salud / Investigación</option>
                                </select>
                            </div>
                        </section>

                        {/* The Pitch */}
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-primary" /> El Proyecto
                            </h3>
                            <div className="space-y-4">
                                <textarea name="description" required rows={2} placeholder="Descripción Corta" value={formData.description} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none"></textarea>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input name="impactGoal" required placeholder="Meta de Impacto (Ej: Construir 3 pozos)" value={formData.impactGoal} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                    <input name="goalAmount" type="number" placeholder="Objetivo (€)" value={formData.goalAmount} onChange={handleChange} className="w-full p-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-primary/50 outline-none" />
                                </div>
                            </div>
                        </section>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Registrar ONG'}
                        </button>
                    </form>
                )}
            </main>
        </div>
    );
}
