import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Filter, 
  Search, 
  Star, 
  Heart, 
  Zap, 
  Dumbbell, 
  Waves, 
  Music, 
  Target, 
  Award,
  Play,
  BookOpen,
  User,
  Phone
} from 'lucide-react';

const Clases: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  useScrollToTop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  const classCategories = [
    { value: 'all', label: 'Todas las clases', icon: <BookOpen className="w-5 h-5" /> },
    { value: 'cardio', label: 'Cardio', icon: <Zap className="w-5 h-5" /> },
    { value: 'fuerza', label: 'Fuerza', icon: <Dumbbell className="w-5 h-5" /> },
    { value: 'acuaticas', label: 'Acuáticas', icon: <Waves className="w-5 h-5" /> },
    { value: 'danza', label: 'Danza', icon: <Music className="w-5 h-5" /> },
    { value: 'baile', label: 'Baile', icon: <Music className="w-5 h-5" /> },
    { value: 'taebo', label: 'Tae-bo', icon: <Zap className="w-5 h-5" /> },
    { value: 'zumba', label: 'Zumba', icon: <Music className="w-5 h-5" /> },
    { value: 'box', label: 'Box', icon: <Target className="w-5 h-5" /> },
    { value: 'especializadas', label: 'Especializadas', icon: <Award className="w-5 h-5" /> }
  ];

  const locations = [
    { value: 'all', label: 'Todas las sedes' },
    { value: 'centro', label: 'Scandinavia Centro' },
    { value: 'zona10', label: 'Scandinavia Zona 10' },
    { value: 'mixco', label: 'Scandinavia Mixco' },
    { value: 'villanueva', label: 'Scandinavia Villa Nueva' },
    { value: 'zona14', label: 'Scandinavia Zona 14' },
    { value: 'petapa', label: 'Scandinavia Petapa' },
    { value: 'sancristobal', label: 'Scandinavia San Cristóbal' },
    { value: 'amatitlan', label: 'Scandinavia Amatitlán' }
  ];

  const days = [
    { value: 'all', label: 'Todos los días' },
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ];

  const classes = [
    {
      id: '1',
      name: 'HIIT Intenso',
      instructor: 'María González',
      category: 'cardio',
      location: 'centro',
      day: 'lunes',
      time: '06:00',
      duration: 45,
      level: 'Intermedio',
      capacity: 20,
      enrolled: 15,
      rating: 4.8,
      description: 'Entrenamiento de alta intensidad que combina ejercicios cardiovasculares y de fuerza.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781157656_0ebd7ea6.webp',
      features: ['Quema de grasa', 'Mejora cardiovascular', 'Fortalece músculos'],
      equipment: ['Mancuernas', 'Kettlebells', 'Colchonetas']
    },
    {
      id: '2',
      name: 'Baile Fitness',
      instructor: 'Carlos Mendoza',
      category: 'baile',
      location: 'zona10',
      day: 'martes',
      time: '07:30',
      duration: 60,
      level: 'Todos los niveles',
      capacity: 25,
      enrolled: 22,
      rating: 4.9,
      description: 'Clase de baile fitness con ritmos variados para divertirte mientras entrenas.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781159548_f6cc2c6d.webp',
      features: ['Diversión', 'Quema calorías', 'Coordinación'],
      equipment: ['Sistema de sonido', 'Espejos', 'Espacio amplio']
    },
    {
      id: '3',
      name: 'Aqua Fitness',
      instructor: 'Ana Rodríguez',
      category: 'acuaticas',
      location: 'centro',
      day: 'miercoles',
      time: '18:00',
      duration: 50,
      level: 'Principiante',
      capacity: 15,
      enrolled: 12,
      rating: 4.7,
      description: 'Ejercicios cardiovasculares y de tonificación en el agua.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781161360_aba23a31.webp',
      features: ['Bajo impacto', 'Trabajo cardiovascular', 'Tonificación'],
      equipment: ['Piscina', 'Flotadores', 'Pesas acuáticas']
    },
    {
      id: '4',
      name: 'CrossFit',
      instructor: 'Roberto Silva',
      category: 'fuerza',
      location: 'mixco',
      day: 'jueves',
      time: '19:00',
      duration: 60,
      level: 'Avanzado',
      capacity: 12,
      enrolled: 10,
      rating: 4.9,
      description: 'Entrenamiento funcional de alta intensidad que combina fuerza, cardio y agilidad.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781163198_40e498db.webp',
      features: ['Fuerza total', 'Condición física', 'Trabajo en equipo'],
      equipment: ['Barras', 'Discos', 'Kettlebells', 'Cuerdas']
    },
    {
      id: '5',
      name: 'Zumba Party',
      instructor: 'Sofia Herrera',
      category: 'zumba',
      location: 'villanueva',
      day: 'viernes',
      time: '20:00',
      duration: 45,
      level: 'Todos los niveles',
      capacity: 30,
      enrolled: 28,
      rating: 4.8,
      description: 'Baile fitness con ritmos latinos que quema calorías mientras te diviertes.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781165004_2fdfdfae.webp',
      features: ['Diversión', 'Quema calorías', 'Coordinación'],
      equipment: ['Sistema de sonido', 'Espejos', 'Espacio amplio']
    },
    {
      id: '6',
      name: 'Tae-bo Intensivo',
      instructor: 'Elena Vásquez',
      category: 'taebo',
      location: 'zona14',
      day: 'sabado',
      time: '09:00',
      duration: 50,
      level: 'Intermedio',
      capacity: 20,
      enrolled: 18,
      rating: 4.6,
      description: 'Entrenamiento de Tae-bo que combina artes marciales y cardio de alta intensidad.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781166772_09fd686a.webp',
      features: ['Cardio intenso', 'Fuerza', 'Coordinación'],
      equipment: ['Colchonetas', 'Guantes', 'Espacio amplio']
    },
    {
      id: '7',
      name: 'Spinning',
      instructor: 'Diego Morales',
      category: 'cardio',
      location: 'petapa',
      day: 'domingo',
      time: '10:30',
      duration: 45,
      level: 'Todos los niveles',
      capacity: 25,
      enrolled: 20,
      rating: 4.7,
      description: 'Ciclismo indoor con música energizante y entrenamiento cardiovascular.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781157656_0ebd7ea6.webp',
      features: ['Cardio intenso', 'Quema grasa', 'Música motivadora'],
      equipment: ['Bicicletas estáticas', 'Sistema de sonido', 'Ventilación']
    },
    {
      id: '8',
      name: 'Box Fitness',
      instructor: 'Miguel Torres',
      category: 'box',
      location: 'sancristobal',
      day: 'lunes',
      time: '19:30',
      duration: 50,
      level: 'Intermedio',
      capacity: 15,
      enrolled: 13,
      rating: 4.8,
      description: 'Entrenamiento de boxeo sin contacto para mejorar condición física y técnica.',
      image: 'https://d64gsuwffb70l.cloudfront.net/68c59c7a14e91a1ceb872621_1757781159548_f6cc2c6d.webp',
      features: ['Coordinación', 'Fuerza', 'Cardio'],
      equipment: ['Guantes', 'Peras', 'Colchonetas']
    }
  ];

  const toggleFavorite = (classId: string) => {
    setFavorites(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === 'all' || classItem.location === selectedLocation;
    const matchesCategory = selectedCategory === 'all' || classItem.category === selectedCategory;
    const matchesDay = selectedDay === 'all' || classItem.day === selectedDay;
    
    return matchesSearch && matchesLocation && matchesCategory && matchesDay;
  });

  const getCategoryIcon = (category: string) => {
    const categoryData = classCategories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : <BookOpen className="w-5 h-5" />;
  };

  const getLocationName = (location: string) => {
    const locationData = locations.find(loc => loc.value === location);
    return locationData ? locationData.label : location;
  };

  const getDayName = (day: string) => {
    const dayData = days.find(d => d.value === day);
    return dayData ? dayData.label : day;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante':
        return 'text-green-400 bg-green-900/20';
      case 'Intermedio':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'Avanzado':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-blue-400 bg-blue-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Nuestras <span style={{color: '#b5fc00'}}>Clases</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Más de 50 clases diferentes cada semana. Encuentra la perfecta para tu nivel y objetivos.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-6 sm:py-8 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Buscar clase o instructor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
                />
              </div>
            </div>
            
            {/* Location Filter */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
              >
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
              >
                {classCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Filter */}
            <div>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
              >
                {days.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Class Categories */}
      <section className="py-6 sm:py-8 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
            {classCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border transition-colors ${
                  selectedCategory === category.value
                    ? 'border-gray-600 bg-gray-800 text-white'
                    : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-600'
                }`}
              >
                <div style={{color: selectedCategory === category.value ? '#b5fc00' : '#6b7280'}}>
                  {category.icon}
                </div>
                <span className="text-xs sm:text-sm font-medium">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <p className="text-gray-300 text-center text-sm sm:text-base">
              Mostrando {filteredClasses.length} de {classes.length} clases
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredClasses.map((classItem) => (
              <div key={classItem.id} className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-700">
                <div className="relative">
                  <img 
                    src={classItem.image} 
                    alt={classItem.name}
                    className="w-full h-40 sm:h-48 object-cover"
                  />
                  <button
                    onClick={() => toggleFavorite(classItem.id)}
                    className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2 rounded-full bg-gray-900/80 backdrop-blur-sm hover:bg-gray-800 transition-colors"
                  >
                    <Heart 
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        favorites.includes(classItem.id) 
                          ? 'fill-current' 
                          : ''
                      }`} 
                      style={{color: favorites.includes(classItem.id) ? '#b5fc00' : '#6b7280'}}
                    />
                  </button>
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-gray-900/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-white text-xs font-medium">{classItem.rating}</span>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(classItem.level)}`}>
                      {classItem.level}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{classItem.name}</h3>
                    <div className="flex items-center gap-1 text-gray-400">
                      {getCategoryIcon(classItem.category)}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 sm:mb-4 line-clamp-2">{classItem.description}</p>
                  
                  <div className="space-y-2 mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{classItem.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{getLocationName(classItem.location)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{getDayName(classItem.day)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{classItem.time} ({classItem.duration} min)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm">{classItem.enrolled}/{classItem.capacity} personas</span>
                    </div>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-xs sm:text-sm font-semibold text-white mb-2">Beneficios:</h4>
                    <div className="flex flex-wrap gap-1">
                      {classItem.features.map((feature, index) => (
                        <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 text-black py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
                      Reservar
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-1">
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClasses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">No se encontraron clases</div>
              <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
            </div>
          )}
        </div>
      </section>

      {/* Class Schedule Table */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Horarios de Clases
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Consulta los horarios completos de todas nuestras clases por sede
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Información Importante</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-3 text-gray-300">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" style={{color: '#b5fc00'}} />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Reservas</p>
                      <p className="text-xs sm:text-sm">Las reservas se pueden hacer hasta 24 horas antes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" style={{color: '#b5fc00'}} />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Capacidad</p>
                      <p className="text-xs sm:text-sm">Cada clase tiene cupo limitado, reserva con anticipación</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-gray-300">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mt-1 flex-shrink-0" style={{color: '#b5fc00'}} />
                    <div>
                      <p className="font-semibold text-sm sm:text-base">Cancelaciones</p>
                      <p className="text-xs sm:text-sm">Puedes cancelar hasta 2 horas antes sin penalización</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 sm:p-6">
                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">¿Necesitas Ayuda?</h4>
                <p className="text-gray-300 mb-4 text-sm sm:text-base">
                  Nuestro equipo está disponible para ayudarte a encontrar la clase perfecta y resolver cualquier duda.
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

export default Clases;
