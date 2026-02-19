
import React, { useState } from 'react';
import { PageView } from '../../types';
import { Mail, Handshake, Lightbulb, CheckCircle, Loader2 } from 'lucide-react';

interface ContactProps {
  onNavigate: (view: PageView) => void;
}

export default function Contact({ onNavigate }: ContactProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bgMain flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje Recibido!</h2>
        <p className="text-gray-600 max-w-md mb-8">Gracias por contactar con Donify. Nuestro equipo humano (no un robot) te responderá en menos de 24 horas.</p>
        <button
          onClick={() => onNavigate('landing')}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-hover transition-colors"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgMain font-sans text-textMain">
      <main className="max-w-6xl mx-auto px-6 pt-32 pb-10 grid md:grid-cols-2 gap-16 items-start">
        {/* Left Side: Context */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Estamos aquí para escucharte.</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              ¿Tienes preguntas sobre tu donación, una sugerencia técnica o representas a una ONG? Escríbenos. Somos personas reales.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="bg-blue-50 p-3 rounded-lg text-primary">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Soporte General</h3>
                <p className="text-sm text-gray-500 mb-1">Dudas sobre pagos o cuenta.</p>
                <a href="mailto:info@donify.org" className="text-primary font-medium hover:underline">info@donify.org</a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="bg-purple-50 p-3 rounded-lg text-purple-600">
                <Handshake size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Alianzas y ONGs</h3>
                <p className="text-sm text-gray-500 mb-1">Para organizaciones que quieren participar.</p>
                <a href="mailto:ongs@donify.org" className="text-primary font-medium hover:underline">ongs@donify.org</a>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="bg-amber-50 p-3 rounded-lg text-amber-600">
                <Lightbulb size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Ideas y Feedback</h3>
                <p className="text-sm text-gray-500 mb-1">Ayúdanos a mejorar Donify.</p>
                <a href="mailto:ideas@donify.org" className="text-primary font-medium hover:underline">ideas@donify.org</a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Nombre</label>
              <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Tu nombre" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <input type="email" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" placeholder="tucorreo@ejemplo.com" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Asunto</label>
              <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none">
                <option>Ayuda con mi cuenta</option>
                <option>Soy una ONG</option>
                <option>Reportar un bug</option>
                <option>Prensa/Medios</option>
                <option>Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mensaje</label>
              <textarea required rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-lg shadow-md transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Enviar Mensaje'}
            </button>
          </form>
        </div>
      </main>

      {/* FAQ Teaser */}
      <div className="text-center py-10">
        <p className="text-gray-500 mb-4">¿Tienes prisa? Quizás ya hemos respondido tu duda.</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => onNavigate('pricing')} className="text-sm font-bold text-primary hover:underline">Ver Tarifas</button>
          <span className="text-gray-300">|</span>
          <button onClick={() => onNavigate('how-it-works')} className="text-sm font-bold text-primary hover:underline">Cómo Funciona</button>
        </div>
      </div>
    </div>
  );
}
