import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  const locations = [
    'Centro - Zona 1',
    'Zona 10',
    'Mixco',
    'Villa Nueva',
    'Zona 14',
    'Petapa'
  ];

  const quickLinks = [
    'Planes y Precios',
    'Clases y Horarios', 
    'Nuestras Sedes',
    'Entrenadores',
    'Promociones',
    'Blog'
  ];

  const support = [
    'Centro de Ayuda',
    'Congelar Membresía',
    'Transferir Sede',
    'Facturación',
    'Políticas',
    'Contacto'
  ];

  return (
    <footer id="contacto" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4" style={{color: '#b5fc00'}}>Scandinavia</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              La red de gimnasios más completa de Guatemala. 14 sedes, 365 días al año, 
              comprometidos con tu bienestar y transformación.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4" style={{color: '#b5fc00'}} />
                <span>1500 SCANDI (722634)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4" style={{color: '#b5fc00'}} />
                <span>info@scandinaviagym.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Clock className="w-4 h-4" style={{color: '#b5fc00'}} />
                <span>4:30 AM - 10:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 transition-colors text-sm" onMouseEnter={(e) => e.target.style.color = '#b5fc00'} onMouseLeave={(e) => e.target.style.color = 'rgb(209 213 219)'}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Soporte</h4>
            <ul className="space-y-2">
              {support.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 transition-colors text-sm" onMouseEnter={(e) => e.target.style.color = '#b5fc00'} onMouseLeave={(e) => e.target.style.color = 'rgb(209 213 219)'}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Nuestras Sedes</h4>
            <ul className="space-y-2">
              {locations.map((location, index) => (
                <li key={index} className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 flex-shrink-0" style={{color: '#b5fc00'}} />
                  <span className="text-gray-300 text-sm">{location}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 text-sm font-medium" style={{color: '#b5fc00'}} onMouseEnter={(e) => e.target.style.color = '#a3e600'} onMouseLeave={(e) => e.target.style.color = '#b5fc00'}>
              Ver todas las sedes →
            </button>
          </div>
        </div>

        {/* Social Media & Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 transition-colors" onMouseEnter={(e) => e.target.style.color = '#b5fc00'} onMouseLeave={(e) => e.target.style.color = 'rgb(156 163 175)'}>
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 transition-colors" onMouseEnter={(e) => e.target.style.color = '#b5fc00'} onMouseLeave={(e) => e.target.style.color = 'rgb(156 163 175)'}>
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 transition-colors" onMouseEnter={(e) => e.target.style.color = '#b5fc00'} onMouseLeave={(e) => e.target.style.color = 'rgb(156 163 175)'}>
                <Youtube className="w-6 h-6" />
              </a>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <span>© 2025 Scandinavia Gym. Todos los derechos reservados.</span>
              <div className="flex gap-4">
                <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = '#b5fc00'} onMouseLeave={(e) => e.target.style.color = 'rgb(156 163 175)'}>Términos</a>
                <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = '#b5fc00'} onMouseLeave={(e) => e.target.style.color = 'rgb(156 163 175)'}>Privacidad</a>
                <a href="#" className="transition-colors" onMouseEnter={(e) => e.target.style.color = '#b5fc00'} onMouseLeave={(e) => e.target.style.color = 'rgb(156 163 175)'}>Trabaja con nosotros</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;