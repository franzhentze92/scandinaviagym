import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { 
  Gift, 
  Clock, 
  Star, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Percent, 
  Zap, 
  Crown, 
  Heart, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Timer,
  Tag,
  Sparkles,
  Target,
  TrendingUp
} from 'lucide-react';

const Promociones: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  useScrollToTop();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'Todas las promociones', icon: <Sparkles className="w-5 h-5" /> },
    { value: 'membership', label: 'Membresías', icon: <Crown className="w-5 h-5" /> },
    { value: 'classes', label: 'Clases', icon: <Target className="w-5 h-5" /> },
    { value: 'personal', label: 'Entrenamiento Personal', icon: <Zap className="w-5 h-5" /> },
    { value: 'family', label: 'Familiar', icon: <Users className="w-5 h-5" /> },
    { value: 'student', label: 'Estudiantes', icon: <Award className="w-5 h-5" /> }
  ];

  const promotions = [
    {
      id: '1',
      title: 'Pase de 1 Día Gratis',
      category: 'membership',
      type: 'free_trial',
      discount: '100%',
      originalPrice: 50,
      newPrice: 0,
      description: 'Prueba todas nuestras instalaciones sin compromiso. Incluye acceso a pesas, cardio y piscina.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781157656_0ebd7ea6.webp',
      validUntil: '2024-12-31',
      isLimited: false,
      isPopular: true,
      features: [
        'Acceso completo a todas las instalaciones',
        'Incluye piscina climatizada',
        'Vestuarios y lockers',
        'WiFi gratuito',
        'Sin compromiso de permanencia'
      ],
      terms: 'Válido para nuevos miembros. Presentar identificación. No acumulable con otras promociones.',
      locations: ['Todas las sedes'],
      icon: <Gift className="w-6 h-6" />
    },
    {
      id: '2',
      title: '50% OFF Primer Mes',
      category: 'membership',
      type: 'discount',
      discount: '50%',
      originalPrice: 399,
      newPrice: 199,
      description: 'Obtén tu membresía Premium con 50% de descuento en el primer mes. Incluye acceso a piscina y clases grupales.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781159548_f6cc2c6d.webp',
      validUntil: '2024-11-30',
      isLimited: true,
      isPopular: false,
      features: [
        'Membresía Premium completa',
        'Acceso a piscina climatizada',
        'Clases grupales ilimitadas',
        '1 invitado por mes',
        'Soporte prioritario'
      ],
      terms: 'Descuento aplica solo al primer mes. Después del primer mes, precio regular Q399/mes.',
      locations: ['Todas las sedes'],
      icon: <Percent className="w-6 h-6" />
    },
    {
      id: '3',
      title: 'Pack Familiar 3x2',
      category: 'family',
      type: 'bundle',
      discount: '33%',
      originalPrice: 1197,
      newPrice: 798,
      description: 'Membresías familiares con descuento especial. Perfecto para familias de 3 o más miembros.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781161360_aba23a31.webp',
      validUntil: '2024-12-15',
      isLimited: true,
      isPopular: true,
      features: [
        '3 membresías por el precio de 2',
        'Acceso a todas las sedes',
        'Clases familiares incluidas',
        'Área infantil disponible',
        'Descuentos en productos'
      ],
      terms: 'Mínimo 3 miembros de la misma familia. Descuento aplica a membresías Básicas y Premium.',
      locations: ['Todas las sedes'],
      icon: <Users className="w-6 h-6" />
    },
    {
      id: '4',
      title: 'Descuento Estudiantil 20%',
      category: 'student',
      type: 'discount',
      discount: '20%',
      originalPrice: 299,
      newPrice: 239,
      description: 'Descuento especial para estudiantes con carné vigente. Válido en todos nuestros planes.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781163198_40e498db.webp',
      validUntil: '2024-12-31',
      isLimited: false,
      isPopular: false,
      features: [
        '20% de descuento permanente',
        'Válido en todos los planes',
        'Solo con carné estudiantil',
        'Renovación automática',
        'Acceso completo a instalaciones'
      ],
      terms: 'Presentar carné estudiantil vigente. Descuento aplica mientras seas estudiante activo.',
      locations: ['Todas las sedes'],
      icon: <Award className="w-6 h-6" />
    },
    {
      id: '5',
      title: 'Entrenador Personal 3x1',
      category: 'personal',
      type: 'bundle',
      discount: '66%',
      originalPrice: 450,
      newPrice: 150,
      description: 'Pack de 3 sesiones de entrenador personal por el precio de 1. Perfecto para comenzar tu transformación.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781165004_2fdfdfae.webp',
      validUntil: '2024-11-20',
      isLimited: true,
      isPopular: true,
      features: [
        '3 sesiones por Q150',
        'Entrenadores certificados',
        'Plan personalizado incluido',
        'Seguimiento de progreso',
        'Válido por 30 días'
      ],
      terms: 'Sesiones deben usarse dentro de 30 días. No transferible. Válido solo para nuevos clientes.',
      locations: ['Centro', 'Zona 10', 'Zona 14'],
      icon: <Zap className="w-6 h-6" />
    },
    {
      id: '6',
      title: 'Clases Premium Gratis',
      category: 'classes',
      type: 'free_trial',
      discount: '100%',
      originalPrice: 200,
      newPrice: 0,
      description: '1 mes de clases premium gratis con tu membresía. Incluye Pilates, Yoga y Spinning.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781166772_09fd686a.webp',
      validUntil: '2024-12-10',
      isLimited: true,
      isPopular: false,
      features: [
        '1 mes de clases premium gratis',
        'Incluye Pilates, Yoga, Spinning',
        'Instructores certificados',
        'Equipos de última generación',
        'Grupos reducidos'
      ],
      terms: 'Válido solo con membresía Premium o VIP. No acumulable con otras promociones de clases.',
      locations: ['Todas las sedes'],
      icon: <Target className="w-6 h-6" />
    },
    {
      id: '7',
      title: 'Black Friday VIP',
      category: 'membership',
      type: 'discount',
      discount: '40%',
      originalPrice: 599,
      newPrice: 359,
      description: 'Membresía VIP con 40% de descuento. Incluye entrenador personal, spa y servicios premium.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781157656_0ebd7ea6.webp',
      validUntil: '2024-11-29',
      isLimited: true,
      isPopular: true,
      features: [
        'Membresía VIP completa',
        '2 sesiones de entrenador personal',
        'Acceso a área de spa',
        'Valet parking',
        'Soporte VIP 24/7'
      ],
      terms: 'Oferta válida solo el 29 de noviembre. Después del primer mes, precio regular Q599/mes.',
      locations: ['Todas las sedes'],
      icon: <Crown className="w-6 h-6" />
    },
    {
      id: '8',
      title: 'Referido Amigo',
      category: 'membership',
      type: 'referral',
      discount: '1 Mes Gratis',
      originalPrice: 0,
      newPrice: 0,
      description: 'Trae a un amigo y ambos obtienen 1 mes gratis. La mejor forma de entrenar juntos.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781159548_f6cc2c6d.webp',
      validUntil: '2024-12-31',
      isLimited: false,
      isPopular: false,
      features: [
        '1 mes gratis para ti',
        '1 mes gratis para tu amigo',
        'Sin restricciones de plan',
        'Válido para nuevos miembros',
        'Sin límite de referidos'
      ],
      terms: 'Tu amigo debe ser nuevo miembro. Ambos deben mantener membresía activa por mínimo 3 meses.',
      locations: ['Todas las sedes'],
      icon: <Heart className="w-6 h-6" />
    }
  ];

  const filteredPromotions = selectedCategory === 'all' 
    ? promotions 
    : promotions.filter(promo => promo.category === selectedCategory);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'free_trial':
        return 'text-green-400 bg-green-900/20';
      case 'discount':
        return 'text-red-400 bg-red-900/20';
      case 'bundle':
        return 'text-blue-400 bg-blue-900/20';
      case 'referral':
        return 'text-purple-400 bg-purple-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'free_trial':
        return 'Prueba Gratis';
      case 'discount':
        return 'Descuento';
      case 'bundle':
        return 'Pack Especial';
      case 'referral':
        return 'Referido';
      default:
        return 'Promoción';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpiringSoon = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span style={{color: '#b5fc00'}}>Promociones</span> Especiales
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Aprovecha nuestras ofertas exclusivas y comienza tu transformación fitness con los mejores precios
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 sm:py-8 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-full border transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'border-gray-600 bg-gray-800 text-white shadow-lg'
                    : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600 hover:bg-gray-800'
                }`}
              >
                <div style={{color: selectedCategory === category.value ? '#b5fc00' : '#6b7280'}}>
                  {category.icon}
                </div>
                <span className="font-medium text-xs sm:text-sm lg:text-base">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Grid */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-gray-300 text-center text-sm sm:text-base">
              Mostrando {filteredPromotions.length} de {promotions.length} promociones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredPromotions.map((promo) => (
              <div 
                key={promo.id} 
                className={`relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 transform hover:-translate-y-2 ${
                  promo.isPopular 
                    ? 'border-gray-600 ring-2 ring-gray-600' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {promo.isPopular && (
                  <div className="absolute top-0 left-0 right-0 z-10">
                    <div className="text-black py-2 px-4 text-center font-bold text-sm" style={{backgroundColor: '#b5fc00'}}>
                      ⭐ Más Popular
                    </div>
                  </div>
                )}

                {promo.isLimited && (
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10">
                    <div className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      Limitado
                    </div>
                  </div>
                )}

                {isExpiringSoon(promo.validUntil) && (
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
                    <div className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Expira Pronto
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <img 
                    src={promo.image} 
                    alt={promo.title}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                    <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getTypeColor(promo.type)}`}>
                      {getTypeText(promo.type)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 rounded-full" style={{backgroundColor: 'rgba(181, 252, 0, 0.1)'}}>
                        <div style={{color: '#b5fc00'}}>
                          {promo.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">{promo.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-400">Válido hasta {formatDate(promo.validUntil)}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{promo.description}</p>
                  
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl sm:text-2xl font-bold text-white">
                        {promo.newPrice === 0 ? 'GRATIS' : `Q${promo.newPrice}`}
                      </span>
                      {promo.originalPrice > 0 && (
                        <>
                          <span className="text-base sm:text-lg text-gray-400 line-through">Q{promo.originalPrice}</span>
                          <span className="text-base sm:text-lg font-bold" style={{color: '#b5fc00'}}>
                            -{promo.discount}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-white mb-2">Incluye:</h4>
                    <div className="space-y-1">
                      {promo.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300 text-xs">
                          <CheckCircle className="w-3 h-3 flex-shrink-0" style={{color: '#b5fc00'}} />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {promo.features.length > 3 && (
                        <div className="text-gray-400 text-xs">
                          +{promo.features.length - 3} más...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <h4 className="text-xs sm:text-sm font-semibold text-white mb-2">Sedes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {promo.locations.map((location, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                          {location}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowModal(promo.id)}
                      className="flex-1 text-black py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors" 
                      style={{backgroundColor: '#b5fc00'}} 
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} 
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}
                    >
                      Aprovechar Oferta
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 sm:py-3 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      Llamar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No se encontraron promociones</div>
              <p className="text-gray-500">Intenta con otra categoría</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4 sm:mb-6" style={{backgroundColor: 'rgba(181, 252, 0, 0.1)'}}>
              <Mail className="w-6 h-6 sm:w-8 sm:h-8" style={{color: '#b5fc00'}} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              No Te Pierdas las Mejores Ofertas
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
              Suscríbete a nuestro newsletter y recibe las promociones exclusivas antes que nadie
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email aquí..."
                className="flex-1 px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
              />
              <button className="text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Section */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Términos y Condiciones
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 px-4">
              Información importante sobre nuestras promociones
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Políticas Generales</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{color: '#b5fc00'}} />
                  <span className="text-sm sm:text-base">Todas las promociones son válidas solo para nuevos miembros</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{color: '#b5fc00'}} />
                  <span className="text-sm sm:text-base">No acumulable con otras ofertas o descuentos</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{color: '#b5fc00'}} />
                  <span className="text-sm sm:text-base">Presentar identificación válida al momento del registro</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{color: '#b5fc00'}} />
                  <span className="text-sm sm:text-base">Scandinavia se reserva el derecho de modificar o cancelar ofertas</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Contacto</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
                  <span className="text-sm sm:text-base">1500 SCANDI (722634)</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
                  <span className="text-sm sm:text-base">promociones@scandinavia.com.gt</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
                  <span className="text-sm sm:text-base">14 sedes en Guatemala</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
                  <span className="text-sm sm:text-base">Lunes a Domingo: 4:30 AM - 10:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Promociones;
