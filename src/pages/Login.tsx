import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Lock, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        toast.error(error.message || 'Error al iniciar sesión');
        setIsLoading(false);
        return;
      }

      // Save email to localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      toast.success('Sesión iniciada exitosamente');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Error inesperado al iniciar sesión');
      setIsLoading(false);
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-4 sm:py-6">
      <div className="w-full max-w-md px-4 sm:px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-3">
          <div className="flex justify-center mb-2">
            <img 
              src="/logo1.png" 
              alt="Scandinavia" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
          </div>
          <p className="text-gray-300 text-xs sm:text-sm">
            Accede a tu cuenta
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-700 mb-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Iniciar Sesión
            </h2>
            <p className="text-gray-300 text-sm">
              Accede a tu cuenta de cliente
            </p>
          </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Tu contraseña"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-600 text-gray-600 focus:ring-gray-600" 
                  />
                  <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (email) {
                      // TODO: Implement password reset
                      toast.info('Funcionalidad de recuperación de contraseña próximamente');
                    } else {
                      toast.warning('Ingresa tu correo electrónico primero');
                    }
                  }}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-black py-3 px-4 rounded-lg font-semibold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: '#b5fc00'}}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                  }
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-5 h-5" />
                    Iniciar Sesión
                  </div>
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-400 text-xs">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-white hover:text-gray-300 transition-colors font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>

          {/* Admin Login Link */}
          <div className="mt-4 pt-4 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-xs mb-2">¿Eres personal del gimnasio?</p>
            <a 
              href="/admin-login" 
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-xs"
            >
              <Lock className="w-3 h-3" />
              Acceso Administrativo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;