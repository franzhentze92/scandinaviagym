import React from 'react';
import { Shield, Clock, Waves, Car, Users, Smartphone } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Horarios Amplios',
      description: 'Abierto desde 4:30 AM hasta 22:00 PM, 365 días al año. Entrena cuando mejor te convenga.',
      color: 'text-gray-300'
    },
    {
      icon: <Waves className="w-8 h-8" />,
      title: 'Piscinas Climatizadas',
      description: 'Piscinas temperadas disponibles en sedes seleccionadas para tu comodidad todo el año.',
      color: 'text-gray-300'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Clases Grupales',
      description: 'Más de 100 clases semanales: Yoga, CrossFit, Zumba, Spinning, Pilates y mucho más.',
      color: 'text-gray-300'
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: 'Estacionamiento Gratuito',
      description: 'Estacionamiento seguro y gratuito en todas nuestras sedes para tu tranquilidad.',
      color: 'text-gray-300'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'App Móvil',
      description: 'Reserva clases, consulta horarios y accede con código QR desde tu smartphone.',
      color: 'text-gray-300'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Seguridad Total',
      description: 'Instalaciones monitoreadas 24/7 con protocolos de seguridad y limpieza estrictos.',
      color: 'text-gray-300'
    }
  ];

  return (
    <section id="nosotros" className="py-12 sm:py-16 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Por Qué Elegir Scandinavia?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            Más que un gimnasio, somos tu compañero en el camino hacia una vida más saludable y activa.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-gray-800 rounded-xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-700"
            >
              <div className={`${feature.color} mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Pool Image Section */}
        <div className="mt-12 sm:mt-16 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781186766_1dc8fb8e.webp"
            alt="Piscina climatizada Scandinavia"
            className="w-full h-48 sm:h-64 md:h-96 object-cover"
          />
          <div className="bg-gray-800 p-6 sm:p-8 text-center border-t border-gray-700">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Piscinas Climatizadas
            </h3>
            <p className="text-gray-300 mb-4 text-sm sm:text-base px-4">
              Disfruta de nuestras piscinas temperadas disponibles en Centro, Zona 10, Villa Nueva y Zona 14.
            </p>
            <button className="text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
              Ver Sedes con Piscina
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;