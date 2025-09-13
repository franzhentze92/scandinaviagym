import React from 'react';
import { Play, MapPin, Clock, Calendar } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781153638_8d6c1a42.webp"
          alt="Scandinavia Gym"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-gray-900/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-16 sm:pb-20">
        <div className="text-center">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            <span className="block">14 Gimnasios.</span>
            <span className="block" style={{color: '#b5fc00'}}>365 Días.</span>
            <span className="block">Siempre Cerca.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            Horarios desde 4:30 AM hasta 22:00. Piscina climatizada en sedes seleccionadas. 
            La red de gimnasios más completa de Guatemala.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2" style={{color: '#b5fc00'}}>14</div>
              <div className="text-gray-200 flex items-center justify-center gap-1 text-sm sm:text-base">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                Ubicaciones
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2" style={{color: '#b5fc00'}}>365</div>
              <div className="text-gray-200 flex items-center justify-center gap-1 text-sm sm:text-base">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                Días al Año
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-1 sm:mb-2" style={{color: '#b5fc00'}}>17.5</div>
              <div className="text-gray-200 flex items-center justify-center gap-1 text-sm sm:text-base">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                Horas Diarias
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
              Unirme Hoy
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Pase de 1 Día
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;