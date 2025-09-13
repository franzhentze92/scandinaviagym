import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminKey: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.adminKey) {
      newErrors.adminKey = 'La clave administrativa es requerida';
    } else if (formData.adminKey !== 'SCANDINAVIA-ADMIN-001') {
      newErrors.adminKey = 'Clave administrativa incorrecta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate admin login process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirect to admin dashboard
    navigate('/admin');
  };

  const handleBackToClientLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4 border-2 border-gray-700">
            <Shield className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Acceso Administrativo
          </h1>
          <p className="text-gray-400">
            Panel de administración de Scandinavia Fitness
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Correo Electrónico Administrativo
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="admin@scandinavia.com"
              />
              {errors.email && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Admin Key Field */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Clave Administrativa
              </label>
              <input
                type="text"
                name="adminKey"
                value={formData.adminKey}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition-colors ${
                  errors.adminKey ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="SCANDINAVIA-ADMIN-001"
              />
              {errors.adminKey && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {errors.adminKey}
                </div>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Solicita la clave administrativa al super administrador
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-black py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
              style={{backgroundColor: '#b5fc00'}}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#a3e600')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#b5fc00')}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Verificando acceso...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  Acceder al Panel Admin
                </div>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-gray-750 rounded-lg border border-gray-600">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h4 className="text-white font-medium text-sm mb-1">Acceso Restringido</h4>
                <p className="text-gray-400 text-xs">
                  Esta área es exclusiva para personal autorizado. Todas las actividades son monitoreadas y registradas.
                </p>
              </div>
            </div>
          </div>

          {/* Back to Client Login */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToClientLogin}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Volver al login de clientes
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-xs">
            © 2024 Scandinavia Fitness. Sistema de Administración v2.1.4
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
