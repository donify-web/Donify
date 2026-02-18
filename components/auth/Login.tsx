import React, { useState } from 'react';
import { PageView } from '../../types';
import { Mail, Lock, User as UserIcon, Loader2, AlertCircle, ArrowLeft, Heart, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

interface LoginProps {
  onNavigate: (view: PageView) => void;
  initialState?: 'login' | 'signup';
}

const GoogleLogo = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login({ onNavigate, initialState = 'login' }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(initialState === 'signup');
  const [isNgoMode, setIsNgoMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // NGO-specific fields
  const [ngoName, setNgoName] = useState('');
  const [ngoCategory, setNgoCategory] = useState('');
  const [ngoDescription, setNgoDescription] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message || 'Error al conectar con Google');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        // Sign Up Logic with account_type
        const { data: authData, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              account_type: isNgoMode ? 'ngo' : 'donor',
              // NGO fields if applicable
              ...(isNgoMode && {
                ngo_name: ngoName,
                ngo_category: ngoCategory,
                ngo_description: ngoDescription
              })
            },
          },
        });
        if (error) throw error;

        // The database trigger handles everything - just wait a moment
        if (authData.user) {
          console.log(`${isNgoMode ? 'NGO' : 'Donor'} account created, waiting for trigger...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } else {
        // Log In Logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      let msg = error.message;
      if (msg === 'Invalid login credentials') msg = 'Credenciales incorrectas.';
      if (msg === 'User already registered') msg = 'Este correo ya está registrado.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setIsNgoMode(false);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">

      {/* Left Side - Image & Mission */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80"
          alt="Charity"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

        <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
          <div className="flex items-center gap-2">
            <Heart className="text-primary fill-primary" size={32} />
            <span className="text-2xl font-bold tracking-tight">Donify</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Cada pequeña acción cuenta.
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed opacity-90">
              Únete a una comunidad global dedicada a hacer del mundo un lugar mejor, céntimo a céntimo.
            </p>
          </div>

          <div className="flex gap-4 text-sm text-gray-400">
            <span>© 2026 Donify Inc.</span>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white relative">
        <button
          onClick={() => onNavigate('landing')}
          className="absolute top-8 left-8 p-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Volver</span>
        </button>

        <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {isSignUp ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}
            </h2>
            <p className="mt-2 text-gray-500">
              {isSignUp
                ? 'Empieza gratis y cancela cuando quieras.'
                : 'Ingresa tus datos para continuar.'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <GoogleLogo />
              <span>Continuar con Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">O usa tu email</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      placeholder="Ej. Juan Pérez"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>

                {/* NGO MODE TOGGLE */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="flex items-start cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={isNgoMode}
                      onChange={(e) => setIsNgoMode(e.target.checked)}
                      className="mt-1 mr-3 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold text-gray-900">Represento una organización sin ánimo de lucro</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        Registra tu ONG para acceder a financiación comunitaria
                      </p>
                    </div>
                  </label>
                </div>

                {/* NGO FIELDS (conditional) */}
                {isNgoMode && (
                  <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-lg p-4 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-xs text-gray-600 font-medium flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      Datos de la organización
                    </p>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nombre de la ONG *</label>
                      <input
                        type="text"
                        required={isNgoMode}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        placeholder="Ej. Fundación Ayuda Social"
                        value={ngoName}
                        onChange={(e) => setNgoName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Categoría *</label>
                      <select
                        required={isNgoMode}
                        value={ngoCategory}
                        onChange={(e) => setNgoCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      >
                        <option value="">Selecciona...</option>
                        <option value="Medio Ambiente">Medio Ambiente</option>
                        <option value="Social">Social / Humanitario</option>
                        <option value="Educación">Educación</option>
                        <option value="Salud">Salud / Investigación</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Descripción breve *</label>
                      <textarea
                        required={isNgoMode}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
                        placeholder="¿Qué hace tu organización?"
                        value={ngoDescription}
                        onChange={(e) => setNgoDescription(e.target.value)}
                      />
                    </div>

                    <p className="text-xs text-gray-500 italic">
                      📝 Tu cuenta requerirá verificación antes de poder aceptar donaciones.
                    </p>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="nombre@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            {isSignUp ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}
            <button
              onClick={toggleMode}
              className="ml-1 font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              {isSignUp ? 'Inicia sesión' : 'Regístrate gratis'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}