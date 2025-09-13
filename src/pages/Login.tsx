import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { User, ArrowRight, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to client dashboard
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span style={{color: '#b5fc00'}}>Mi Cuenta</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Accede a tu cuenta y gestiona tu membresía, reservas y progreso fitness
            </p>
          </div>
        </div>
      </section>

      {/* Client Login Form */}
      <section className="py-16 bg-black">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-300" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Iniciar Sesión
              </h2>
              <p className="text-gray-300">
                Accede a tu cuenta de cliente
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                  placeholder="Tu contraseña"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-600 text-gray-600 focus:ring-gray-600" />
                  <span className="ml-2 text-sm text-gray-300">Recordarme</span>
                </label>
                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full text-black py-4 px-6 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: '#b5fc00'}}
                onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#a3e600')}
                onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#b5fc00')}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
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

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                ¿No tienes cuenta?{' '}
                <a href="#" className="text-white hover:text-gray-300 transition-colors font-medium">
                  Regístrate aquí
                </a>
              </p>
            </div>

            {/* Admin Login Link */}
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-gray-400 text-sm mb-3">¿Eres personal del gimnasio?</p>
              <a 
                href="/admin-login" 
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-sm"
              >
                <Lock className="w-4 h-4" />
                Acceso Administrativo
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;