import React from 'react';
import { X, Heart, Building2, ArrowRight } from 'lucide-react';

interface RegistrationChoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectOption: (option: 'donor' | 'ngo') => void;
}

export default function RegistrationChoiceModal({ isOpen, onClose, onSelectOption }: RegistrationChoiceModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="p-8 sm:p-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Únete a Donify</h2>
                    <p className="text-gray-600 mb-10 text-lg">Elige cómo quieres formar parte del cambio.</p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Donor Option */}
                        <button
                            onClick={() => onSelectOption('donor')}
                            className="group relative flex flex-col items-center p-8 rounded-2xl border-2 border-gray-100 hover:border-primary/30 bg-white hover:bg-primary/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Heart size={40} className="fill-current" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Quiero Donar</h3>
                            <p className="text-gray-500 text-sm text-center leading-relaxed">
                                Apoya causas, vota proyectos y ve tu impacto en tiempo real.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-primary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                Empezar ahora <ArrowRight size={16} />
                            </div>
                        </button>

                        {/* NGO Option */}
                        <button
                            onClick={() => onSelectOption('ngo')}
                            className="group relative flex flex-col items-center p-8 rounded-2xl border-2 border-gray-100 hover:border-blue-500/30 bg-white hover:bg-blue-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Building2 size={40} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Soy una ONG</h3>
                            <p className="text-gray-500 text-sm text-center leading-relaxed">
                                Recauda fondos, visibiliza tus proyectos y conecta con donantes.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-blue-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                                Aplicar ahora <ArrowRight size={16} />
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t border-gray-100">
                    ¿Ya tienes cuenta? <button onClick={() => { onClose(); /* Trigger login logic if needed, currently just close */ }} className="text-primary font-semibold hover:underline">Iniciar sesión</button>
                </div>
            </div>
        </div>
    );
}
