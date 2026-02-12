import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Lock, Mail, Loader2 } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await signUp(formData.email, formData.password, formData.fullName);

      if (error) {
        toast.error(error.message || 'Error al crear la cuenta');
        setIsLoading(false);
        return;
      }

      toast.success('Cuenta creada exitosamente. Por favor, verifica tu correo electrónico.');
      navigate('/login');
    } catch (error: any) {
      toast.error('Error inesperado al crear la cuenta');
      setIsLoading(false);
    }
  };

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
            Crea tu cuenta
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-gray-800 rounded-2xl p-5 sm:p-6 border border-gray-700 mb-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Registrarse
            </h2>
            <p className="text-gray-300 text-sm">
              Crea tu cuenta de cliente
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                disabled={isLoading}
                minLength={6}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                disabled={isLoading}
                minLength={6}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Confirma tu contraseña"
              />
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
                  Creando cuenta...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <User className="w-5 h-5" />
                  Crear Cuenta
                </div>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-white hover:text-gray-300 transition-colors font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

