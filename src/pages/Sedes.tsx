import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { MapPin, Clock, Phone, Waves, Car, Users, Search, Filter, Star, CheckCircle } from 'lucide-react';

const Sedes: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  useScrollToTop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAmenity, setSelectedAmenity] = useState('all');

  const locations = [
    {
      id: '1',
      name: 'Scandinavia Centro',
      address: 'Zona 1, Ciudad de Guatemala',
      phone: '2251-4000',
      hours: '4:30 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781157656_0ebd7ea6.webp',
      amenities: ['Piscina', 'Estacionamiento', 'Clases'],
      occupancy: 'medium' as const,
      rating: 4.8,
      description: 'Nuestra sede principal en el corazón de la ciudad. Equipada con piscina climatizada y todas las comodidades.',
      features: ['Piscina climatizada', 'Estacionamiento gratuito', 'Clases grupales', 'Área de pesas', 'Cardio', 'Vestuarios amplios']
    },
    {
      id: '2', 
      name: 'Scandinavia Zona 10',
      address: 'Zona 10, Ciudad de Guatemala',
      phone: '2251-4010',
      hours: '5:00 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781159548_f6cc2c6d.webp',
      amenities: ['Piscina', 'Estacionamiento', 'Clases'],
      occupancy: 'high' as const,
      rating: 4.9,
      description: 'Ubicada en la zona comercial más exclusiva de la ciudad. Perfecta para profesionales y ejecutivos.',
      features: ['Piscina climatizada', 'Estacionamiento VIP', 'Clases premium', 'Área de spa', 'Cafetería', 'WiFi gratuito']
    },
    {
      id: '3',
      name: 'Scandinavia Mixco',
      address: 'Mixco, Guatemala',
      phone: '2251-4020',
      hours: '4:30 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781161360_aba23a31.webp',
      amenities: ['Estacionamiento', 'Clases'],
      occupancy: 'low' as const,
      rating: 4.7,
      description: 'Sede familiar en Mixco con amplios espacios y ambiente relajado. Ideal para toda la familia.',
      features: ['Estacionamiento amplio', 'Clases familiares', 'Área infantil', 'Parqueo para motos', 'Ventilación natural']
    },
    {
      id: '4',
      name: 'Scandinavia Villa Nueva',
      address: 'Villa Nueva, Guatemala',
      phone: '2251-4030',
      hours: '5:00 - 21:30',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781163198_40e498db.webp',
      amenities: ['Piscina', 'Estacionamiento', 'Clases'],
      occupancy: 'medium' as const,
      rating: 4.6,
      description: 'Sede moderna en Villa Nueva con tecnología de punta y equipos de última generación.',
      features: ['Piscina climatizada', 'Equipos modernos', 'Clases especializadas', 'Área de rehabilitación', 'Estacionamiento techado']
    },
    {
      id: '5',
      name: 'Scandinavia Zona 14',
      address: 'Zona 14, Ciudad de Guatemala',
      phone: '2251-4040',
      hours: '4:30 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781165004_2fdfdfae.webp',
      amenities: ['Piscina', 'Estacionamiento', 'Clases'],
      occupancy: 'high' as const,
      rating: 4.9,
      description: 'Sede premium en Zona 14 con servicios exclusivos y ambiente sofisticado.',
      features: ['Piscina climatizada', 'Servicio VIP', 'Clases privadas', 'Área de relajación', 'Valet parking', 'Locker premium']
    },
    {
      id: '6',
      name: 'Scandinavia Petapa',
      address: 'Petapa, Guatemala',
      phone: '2251-4050',
      hours: '5:00 - 22:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781166772_09fd686a.webp',
      amenities: ['Estacionamiento', 'Clases'],
      occupancy: 'low' as const,
      rating: 4.5,
      description: 'Sede comunitaria en Petapa con enfoque en accesibilidad y comodidad para todos.',
      features: ['Estacionamiento gratuito', 'Clases adaptadas', 'Área de descanso', 'Precios especiales', 'Horarios extendidos']
    },
    {
      id: '7',
      name: 'Scandinavia San Cristóbal',
      address: 'San Cristóbal, Guatemala',
      phone: '2251-4060',
      hours: '5:00 - 21:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781157656_0ebd7ea6.webp',
      amenities: ['Estacionamiento', 'Clases'],
      occupancy: 'medium' as const,
      rating: 4.4,
      description: 'Sede en San Cristóbal con ambiente familiar y servicios personalizados.',
      features: ['Estacionamiento amplio', 'Clases personalizadas', 'Área de juegos', 'Cafetería', 'WiFi gratuito']
    },
    {
      id: '8',
      name: 'Scandinavia Amatitlán',
      address: 'Amatitlán, Guatemala',
      phone: '2251-4070',
      hours: '5:00 - 21:00',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781159548_f6cc2c6d.webp',
      amenities: ['Piscina', 'Estacionamiento', 'Clases'],
      occupancy: 'low' as const,
      rating: 4.3,
      description: 'Sede en Amatitlán con vista al lago y ambiente natural único.',
      features: ['Piscina natural', 'Vista al lago', 'Clases al aire libre', 'Área de picnic', 'Estacionamiento natural']
    }
  ];

  const amenities = [
    { value: 'all', label: 'Todas las sedes' },
    { value: 'Piscina', label: 'Con Piscina' },
    { value: 'Estacionamiento', label: 'Con Estacionamiento' },
    { value: 'Clases', label: 'Con Clases' }
  ];

  const occupancyColors = {
    low: 'text-green-400 bg-green-900/20',
    medium: 'text-yellow-400 bg-yellow-900/20', 
    high: 'text-red-400 bg-red-900/20'
  };

  const occupancyText = {
    low: 'Baja afluencia',
    medium: 'Afluencia media',
    high: 'Alta afluencia'
  };

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Piscina': <Waves className="w-4 h-4" />,
    'Estacionamiento': <Car className="w-4 h-4" />,
    'Clases': <Users className="w-4 h-4" />
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAmenity = selectedAmenity === 'all' || location.amenities.includes(selectedAmenity);
    return matchesSearch && matchesAmenity;
  });

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Nuestras <span style={{color: '#b5fc00'}}>Sedes</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              14 ubicaciones estratégicas en Guatemala para que siempre tengas un Scandinavia cerca de ti
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 sm:py-8 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Buscar sede por nombre o ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value)}
                className="flex-1 sm:flex-none bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
              >
                {amenities.map((amenity) => (
                  <option key={amenity.value} value={amenity.value}>
                    {amenity.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-gray-300 text-center text-sm sm:text-base">
              Mostrando {filteredLocations.length} de {locations.length} sedes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredLocations.map((location) => (
              <div key={location.id} className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-700">
                <div className="relative">
                  <img 
                    src={location.image} 
                    alt={location.name}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 py-1 rounded-full text-xs font-medium ${occupancyColors[location.occupancy]}`}>
                    {occupancyText[location.occupancy]}
                  </div>
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gray-900/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-white text-xs font-medium">{location.rating}</span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{location.name}</h3>
                  <p className="text-gray-300 text-sm mb-3 sm:mb-4 line-clamp-2">{location.description}</p>
                  
                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-start gap-2 text-gray-300">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-1 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{location.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{location.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{location.phone}</span>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-white mb-2">Servicios:</h4>
                    <div className="flex flex-wrap gap-1">
                      {location.amenities.map((amenity, index) => (
                        <span key={index} className="flex items-center gap-1 bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                          {amenityIcons[amenity]}
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-white mb-2">Características:</h4>
                    <div className="space-y-1">
                      {location.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-300 text-xs">
                          <CheckCircle className="w-3 h-3 flex-shrink-0" style={{color: '#b5fc00'}} />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {location.features.length > 3 && (
                        <div className="text-gray-400 text-xs">
                          +{location.features.length - 3} más...
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 text-black py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
                      Ver Horarios
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                      Llamar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No se encontraron sedes</div>
              <p className="text-gray-500">Intenta con otros términos de búsqueda o filtros</p>
            </div>
          )}
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Encuentra la Sede Más Cerca
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Todas nuestras sedes están estratégicamente ubicadas para tu comodidad
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Información de Contacto</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
                    <span className="text-sm sm:text-base">1500 SCANDI (722634)</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
                    <span className="text-sm sm:text-base">Horarios: 4:30 AM - 10:00 PM (varía por sede)</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
                    <span className="text-sm sm:text-base">14 sedes en Guatemala</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
                <h4 className="text-lg font-semibold text-white mb-3 sm:mb-4">¿Necesitas Ayuda?</h4>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  Nuestro equipo está disponible para ayudarte a encontrar la sede perfecta para ti.
                </p>
                <button className="text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
                  Contactar Soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Sedes;
