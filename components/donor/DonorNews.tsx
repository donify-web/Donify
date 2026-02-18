import React from 'react';
import { Clock, ExternalLink, Heart, MessageCircle } from 'lucide-react';

export default function DonorNews() {
    const news = [
        {
            id: 1,
            title: "¡Objetivo Conseguido! Reforestación en Galicia",
            category: "Medio Ambiente",
            date: "Hace 2 horas",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800",
            excerpt: "Gracias a vuestros votos y donaciones, hemos comenzado la plantación de 500 árboles autóctonos en la Sierra del Caurel.",
            likes: 124,
            comments: 18
        },
        {
            id: 2,
            title: "Informe Trimestral de Transparencia",
            category: "Donify",
            date: "Ayer",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
            excerpt: "Publicamos nuestras cuentas auditadas. Cada euro donado ha sido trazado hasta su destino final. Descarga el PDF.",
            likes: 85,
            comments: 5
        },
        {
            id: 3,
            title: "Nueva ONG verificada: Tech for Kids",
            category: "Educación",
            date: "Hace 3 días",
            image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800",
            excerpt: "Damos la bienvenida a Tech for Kids, una organización dedicada a llevar tecnología a aulas rurales.",
            likes: 210,
            comments: 42
        }
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Novedades</h1>
                <p className="text-gray-500 text-lg">
                    Sigue el rastro de tu ayuda. Actualizaciones reales de proyectos reales.
                </p>
            </header>

            <div className="space-y-8">
                {news.map((item) => (
                    <article key={item.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 md:h-64 overflow-hidden relative">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider">
                                {item.category}
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-3">
                                <Clock size={14} /> {item.date}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight hover:text-primary cursor-pointer transition-colors">
                                {item.title}
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {item.excerpt}
                            </p>

                            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-6">
                                    <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm font-medium group">
                                        <Heart size={18} className="group-hover:fill-current" /> {item.likes}
                                    </button>
                                    <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors text-sm font-medium">
                                        <MessageCircle size={18} /> {item.comments}
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 text-primary font-bold text-sm hover:underline">
                                    Leer más <ExternalLink size={16} />
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            <div className="text-center mt-12 mb-8">
                <p className="text-gray-400 text-sm">Has llegado al final de las noticias.</p>
            </div>
        </div>
    );
}
