import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface CookieConsentProps {
    onShowPolicy: () => void;
}

export default function CookieConsent({ onShowPolicy }: CookieConsentProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('donify_cookie_consent');
        if (!consent) {
            // Small delay to not overwhelm user immediately
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('donify_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-in slide-in-from-bottom duration-500">
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-6 md:flex items-center justify-between gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">🍪 Valoramos tu privacidad</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Utilizamos cookies propias y de terceros (como Stripe) para garantizar la seguridad de los pagos,
                        mantener tu sesión iniciada y analizar el tráfico de forma anónima.
                        Puedes leer nuestra <button onClick={onShowPolicy} className="text-primary hover:underline font-semibold">Política de Cookies</button> para más detalles.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 shrink-0">
                    <button
                        onClick={handleAccept} // For MVP, "Decline" implies strictly essential only, which is default behavior here anyway.
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
                    >
                        Solo Esenciales
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5 text-sm"
                    >
                        Aceptar Todo
                    </button>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 md:hidden"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}
