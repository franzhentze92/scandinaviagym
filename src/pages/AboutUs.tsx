import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Heart, Users, Award, Target, Clock, MapPin, Star, CheckCircle } from 'lucide-react';

const AboutUs: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  useScrollToTop();

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Pasión por el Fitness',
      description: 'Creemos que el ejercicio debe ser una experiencia positiva y motivadora que transforme vidas.'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Comunidad Inclusiva',
      description: 'Todos son bienvenidos, sin importar su nivel de condición física o experiencia previa.'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Excelencia en Servicio',
      description: 'Nos comprometemos a brindar la mejor experiencia de entrenamiento en Guatemala.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Resultados Reales',
      description: 'Nuestro enfoque está en ayudarte a alcanzar tus objetivos de salud y bienestar.'
    }
  ];

  const milestones = [
    {
      year: '2008',
      title: 'Fundación',
      description: 'Abrimos nuestra primera sede en Centro con la visión de democratizar el fitness en Guatemala.'
    },
    {
      year: '2012',
      title: 'Expansión',
      description: 'Llegamos a Zona 10, consolidando nuestra presencia en la capital.'
    },
    {
      year: '2016',
      title: 'Innovación',
      description: 'Introdujimos las primeras piscinas climatizadas y clases grupales especializadas.'
    },
    {
      year: '2020',
      title: 'Digitalización',
      description: 'Lanzamos nuestra app móvil y sistema de reservas online.'
    },
    {
      year: '2024',
      title: 'Liderazgo',
      description: 'Con 14 sedes, somos la red de gimnasios más grande y completa de Guatemala.'
    }
  ];

  const stats = [
    { number: '25,000+', label: 'Miembros Activos' },
    { number: '14', label: 'Sedes en Guatemala' },
    { number: '15', label: 'Años de Experiencia' },
    { number: '100+', label: 'Clases Semanales' },
    { number: '50+', label: 'Instructores Certificados' },
    { number: '365', label: 'Días Abiertos al Año' }
  ];

  const certifications = [
    'ACSM (American College of Sports Medicine)',
    'NASM (National Academy of Sports Medicine)',
    'NSCA (National Strength and Conditioning Association)',
    'RYT (Registered Yoga Teacher)',
    'CrossFit Level 2',
    'Zumba B1 & B2',
    'Spinning Certified',
    'AEA (Aquatic Exercise Association)'
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Sobre <span style={{color: '#b5fc00'}}>Scandinavia</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Desde 2008, hemos sido la red de gimnasios más completa de Guatemala, 
              comprometidos con tu transformación y bienestar integral.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 sm:w-8 sm:h-8" style={{color: '#b5fc00'}} />
                Nuestra Misión
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Democratizar el acceso al fitness de calidad en Guatemala, proporcionando 
                instalaciones modernas, instructores certificados y una experiencia de 
                entrenamiento excepcional que inspire y transforme vidas.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 sm:w-8 sm:h-8" style={{color: '#b5fc00'}} />
                Nuestra Visión
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Ser la red de gimnasios líder en Centroamérica, reconocida por nuestra 
                innovación, excelencia en servicio y contribución al bienestar de las 
                comunidades donde operamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Nuestros Valores
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Los principios que guían cada decisión y acción en Scandinavia
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 sm:p-6 text-center border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="mb-3 sm:mb-4" style={{color: '#b5fc00'}}>
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Nuestra Historia
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Un viaje de crecimiento y compromiso con la salud de Guatemala
            </p>
          </div>

          <div className="relative">
            {/* Hide timeline line on mobile */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-700"></div>
            
            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col lg:flex-row lg:items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8 lg:text-left'}`}>
                    <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                      <div className="text-xl sm:text-2xl font-bold mb-2" style={{color: '#b5fc00'}}>
                        {milestone.year}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-300 text-sm sm:text-base">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Hide timeline dots on mobile */}
                  <div className="hidden lg:block w-4 h-4 bg-gray-700 rounded-full border-4 border-gray-800 z-10"></div>
                  
                  <div className="hidden lg:block w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Números que Hablan
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              El impacto de nuestra pasión por el fitness en números
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2" style={{color: '#b5fc00'}}>
                  {stat.number}
                </div>
                <div className="text-gray-300 text-xs sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Certificaciones y Estándares
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Nuestros instructores están certificados por las instituciones más reconocidas del mundo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{color: '#b5fc00'}} />
                <span className="text-gray-300 text-xs sm:text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">
            ¿Listo para Formar Parte de Nuestra Historia?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
            Únete a miles de guatemaltecos que han transformado su vida con Scandinavia
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 transform hover:scale-105" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
              Unirme Hoy
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              Ver Sedes
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
