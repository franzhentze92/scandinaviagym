import React, { useState } from 'react';
import { Menu, X, User, Phone, MapPin } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Inicio', href: '/', isRoute: true },
    { name: 'Nosotros', href: '/nosotros', isRoute: true },
    { name: 'Sedes', href: '/sedes', isRoute: true },
    { name: 'Planes', href: '/planes', isRoute: true },
    { name: 'Clases', href: '/clases', isRoute: true },
    { name: 'Promociones', href: '/promociones', isRoute: true },
    { name: 'Contacto', href: '/contacto', isRoute: true }
  ];

  return (
    <nav className="bg-black/90 backdrop-blur-sm shadow-lg fixed w-full top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-white">
              Scandinavia
            </h1>
            <span className="ml-2 text-sm font-medium" style={{color: '#b5fc00'}}>
              Gym
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors text-sm relative group ${
                    location.pathname === item.href 
                      ? 'text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.href) {
                      e.target.style.color = '#b5fc00';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.href) {
                      e.target.style.color = 'rgb(209 213 219)';
                    }
                  }}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 font-medium transition-colors hover:text-white text-sm relative group"
                  onMouseEnter={(e) => e.target.style.color = '#b5fc00'}
                  onMouseLeave={(e) => e.target.style.color = 'rgb(209 213 219)'}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              )
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="hidden xl:flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                <span>1500-SCANDI</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>14 Sedes</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Mi Cuenta</span>
            </button>
            <button 
              onClick={() => navigate('/planes')}
              className="text-black px-4 py-2 rounded-lg font-semibold transition-colors text-sm" 
              style={{backgroundColor: '#b5fc00'}} 
              onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} 
              onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}
            >
              Unirme Hoy
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 p-2"
              onMouseEnter={(e) => e.target.style.color = '#b5fc00'}
              onMouseLeave={(e) => e.target.style.color = 'rgb(209 213 219)'}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-sm border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-3 font-medium rounded-lg transition-colors ${
                      location.pathname === item.href 
                        ? 'text-white bg-gray-800' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                    onMouseEnter={(e) => {
                      if (location.pathname !== item.href) {
                        e.target.style.color = '#b5fc00';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== item.href) {
                        e.target.style.color = 'rgb(209 213 219)';
                      }
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-3 text-gray-300 font-medium hover:bg-gray-800 rounded-lg transition-colors"
                    onMouseEnter={(e) => e.target.style.color = '#b5fc00'}
                    onMouseLeave={(e) => e.target.style.color = 'rgb(209 213 219)'}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMenuOpen(false);
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    {item.name}
                  </a>
                )
              ))}
              <div className="border-t border-gray-800 pt-4 mt-4">
                <div className="px-3 py-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    <span>1500-SCANDI (722634)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>14 Sedes en Guatemala</span>
                  </div>
                </div>
                <div className="px-3 py-2 space-y-3">
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Mi Cuenta
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/planes');
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-black px-4 py-3 rounded-lg font-semibold transition-colors" 
                    style={{backgroundColor: '#b5fc00'}} 
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} 
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}
                  >
                    Unirme Hoy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;