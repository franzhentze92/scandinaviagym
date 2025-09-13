import React, { useState } from 'react';
import { Mail, Gift, ArrowRight } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  return (
    <section id="promociones" className="py-16 bg-gradient-to-r from-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full" style={{backgroundColor: 'rgba(181, 252, 0, 0.1)'}}>
              <Gift className="w-8 h-8" style={{color: '#b5fc00'}} />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¡Obtén Tu Pase de 1 Día Gratis!
          </h2>
          
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe un pase gratuito para probar cualquiera de nuestras 14 sedes. 
            Además, mantente al día con promociones exclusivas, nuevas clases y consejos de fitness.
          </p>

          {!subscribed ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-white bg-gray-700"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
                  style={{backgroundColor: '#b5fc00'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}
                >
                  Obtener Pase
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-white">
                <Gift className="w-5 h-5" style={{color: '#b5fc00'}} />
                <span className="font-semibold">¡Gracias por suscribirte!</span>
              </div>
              <p className="text-gray-300 mt-2 text-sm">
                Revisa tu email para recibir tu pase gratuito de 1 día.
              </p>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#b5fc00'}}></div>
              <span>Promociones exclusivas</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#b5fc00'}}></div>
              <span>Nuevas clases y horarios</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{backgroundColor: '#b5fc00'}}></div>
              <span>Consejos de nutrición</span>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6">
            No spam. Puedes cancelar tu suscripción en cualquier momento.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;