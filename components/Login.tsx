
import React, { useState } from 'react';
import { PageView } from '../types';
import { ArrowLeft, Mail, Lock, User as UserIcon, Loader2, Code2, Terminal, PlayCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface LoginProps {
  onNavigate: (view: PageView) => void;
  initialState?: 'login' | 'signup';
  onMockLogin?: (type: 'admin' | 'subscriber' | 'new') => void;
}

// Simple Google Logo Component
const GoogleLogo = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function Login({ onNavigate, initialState = 'login', onMockLogin }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(initialState === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showDevMenu, setShowDevMenu] = useState(true);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al conectar con Google');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    const cleanEmail = email.trim();

    try {
      if (isSignUp) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { full_name: fullName } },
        });
        if (authError) throw authError;

        if (authData.user && !authData.session) {
            alert('¡Cuenta creada! \n\nIMPORTANTE: Supabase ha enviado un correo de confirmación. Debes validarlo.');
            setIsSignUp(false);
        } else {
            alert('Cuenta creada. Iniciando sesión...');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        setErrorMsg('Credenciales incorrectas.');
      } else {
        setErrorMsg(error.message || 'Error en la autenticación');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 relative">
      <button 
        onClick={() => onNavigate('landing')} 
        className="absolute top-6 left-6 text-gray-400 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={24} />
      </button>

      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl text-primary mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{isSignUp ? 'Crear Cuenta' : 'Bienvenido de nuevo'}</h1>
          <p className="text-gray-500 mt-2">
            {isSignUp ? 'Únete a la comunidad de impacto.' : 'Introduce tus datos para acceder a tu panel.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
             <div>
             <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nombre Completo</label>
             <div className="relative">
               <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
               <input 
                 type="text" 
                 required
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 placeholder="Tu nombre"
                 className="w-full pl-10 pr-4 py-3 bg-bgMain border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
               />
             </div>
           </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@email.com"
                className="w-full pl-10 pr-4 py-3 bg-bgMain border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Contraseña</label>
             <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-bgMain border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-primary/20 flex justify-center items-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isSignUp ? 'Registrarse' : 'Acceder')}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 font-bold">O continúa con</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors flex justify-center items-center gap-3"
        >
          <GoogleLogo />
          <span>Google</span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(null); }} 
              className="text-primary font-bold hover:underline ml-1"
            >
              {isSignUp ? 'Inicia sesión' : 'Regístrate gratis'}
            </button>
          </p>
        </div>
      </div>

      {/* --- QUICK SWITCHER (Instant Login) --- */}
      {showDevMenu && onMockLogin && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-xl shadow-2xl border border-gray-700 z-50 opacity-95 animate-in slide-in-from-bottom-5 w-64">
           <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                 <Terminal size={14}/> Quick Switcher
              </h3>
              <button onClick={() => setShowDevMenu(false)} className="text-gray-500 hover:text-white"><Code2 size={14}/></button>
           </div>
           
           <div className="space-y-2">
               <button 
                 onClick={() => onMockLogin('admin')} 
                 className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-primary/20 hover:text-primary rounded-lg text-xs font-mono transition-colors flex justify-between items-center"
               >
                 <span><PlayCircle size={10} className="inline mr-1"/> Login as Admin</span>
               </button>

               <button 
                 onClick={() => onMockLogin('subscriber')} 
                 className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-primary/20 hover:text-primary rounded-lg text-xs font-mono transition-colors flex justify-between items-center"
               >
                 <span><PlayCircle size={10} className="inline mr-1"/> Login as Subscriber</span>
               </button>

               <button 
                 onClick={() => onMockLogin('new')} 
                 className="w-full text-left px-3 py-2 bg-gray-800 hover:bg-primary/20 hover:text-primary rounded-lg text-xs font-mono transition-colors flex justify-between items-center"
               >
                 <span><PlayCircle size={10} className="inline mr-1"/> Login as New User</span>
               </button>
           </div>
        </div>
      )}
    </div>
  );
}
