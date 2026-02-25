import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

const faqCategories = [
    {
        category: '¿Cómo funciona?',
        color: 'bg-blue-50 text-blue-600',
        items: [
            {
                q: '¿Cómo se reparte el dinero recaudado?',
                a: 'Al final de cada ciclo de votación, el fondo total se distribuye entre las tres ONGs más votadas: 50% para la primera, 30% para la segunda y 20% para la tercera. El reparto es automático y transparente.'
            },
            {
                q: '¿Con qué frecuencia se realizan las votaciones?',
                a: 'Los ciclos de votación son mensuales. Cada mes se abre una nueva ronda con nuevas ONGs candidatas, y tú puedes votar con el peso proporcional a tu nivel de suscripción.'
            },
        ]
    },
    {
        category: 'Votación',
        color: 'bg-violet-50 text-violet-600',
        items: [
            {
                q: '¿Qué peso tiene mi voto según mi nivel?',
                a: 'El peso del voto escala con la frecuencia de donación. Bronce (mensual) = 1 voto, Plata (quincenal) = 2 votos, Oro (semanal) = 4 votos, Diamante (cada 4 días) = 7 votos. Más compromiso, más voz.'
            },
            {
                q: '¿Puedo votar por cualquier ONG o solo por las candidatas?',
                a: 'En cada ciclo se presentan las ONGs candidatas preseleccionadas por nuestro equipo de transparencia. Próximamente añadiremos la opción de proponer ONGs como comunidad.'
            },
        ]
    },
    {
        category: 'Suscripción',
        color: 'bg-amber-50 text-amber-600',
        items: [
            {
                q: '¿Puedo cambiar de nivel de suscripción?',
                a: 'Sí, puedes subir o bajar de nivel en cualquier momento desde tu perfil. El cambio aplica en el siguiente ciclo de cobro y tu historial de votos se mantiene.'
            },
            {
                q: '¿Puedo cancelar mi suscripción cuando quiera?',
                a: 'Totalmente. Sin penalización ni permanencia mínima. Cancelas desde tu perfil y sigues teniendo acceso hasta el final del periodo ya pagado.'
            },
        ]
    },
    {
        category: 'ONGs y Transparencia',
        color: 'bg-green-50 text-green-600',
        items: [
            {
                q: '¿Cómo se verifican las ONGs candidatas?',
                a: 'Nuestro equipo revisa que cada organización esté registrada legalmente, opere éticamente y pueda emitir certificados de donación válidos. Solo pasamos a votación a las que superan el proceso.'
            },
            {
                q: '¿Cómo sé que el dinero realmente llega a la ONG?',
                a: 'Utilizamos Stripe Connect: el dinero va directamente de los donantes a las cuentas bancarias verificadas de las ONGs. Donify nunca toca el dinero directamente. Publicamos un informe mensual con los importes transferidos.'
            },
            {
                q: '¿Donify se queda con algún beneficio?',
                a: 'No. Solo descontamos las tarifas de procesamiento de pago de Stripe y un coste operativo mínimo para los servidores. El 100% del dinero restante llega a las causas ganadoras.'
            },
        ]
    },
];

export default function FAQ() {
    const [openFaq, setOpenFaq] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-bgMain font-sans text-textMain animate-in fade-in duration-500">

            {/* HERO */}
            <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-white to-bgMain">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-sm font-semibold text-primary mb-2">
                        <HelpCircle size={16} /> FAQ
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                        Preguntas Frecuentes
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto">
                        Todo lo que necesitas saber sobre cómo funciona Donify.
                    </p>
                </div>
            </section>

            {/* FAQ CONTENT */}
            <section className="px-6 pb-32">
                <div className="max-w-3xl mx-auto space-y-10">
                    {faqCategories.map((cat) => (
                        <div key={cat.category}>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 ${cat.color}`}>
                                {cat.category}
                            </div>
                            <div className="space-y-3">
                                {cat.items.map((faq, idx) => {
                                    const id = `${cat.category}-${idx}`;
                                    const isOpen = openFaq === id;
                                    return (
                                        <div
                                            key={id}
                                            className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${isOpen ? 'border-primary/30 shadow-sm' : 'border-gray-100 hover:border-gray-200'
                                                }`}
                                        >
                                            <button
                                                onClick={() => setOpenFaq(isOpen ? null : id)}
                                                className="w-full flex justify-between items-center p-5 text-left"
                                            >
                                                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                                                <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                                                    }`}>
                                                    {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4 bg-gray-50/50">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
