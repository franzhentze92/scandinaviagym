import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Heart, 
  Star, 
  Filter, 
  Search,
  CheckCircle,
  X,
  Plus,
  Minus,
  Download,
  Share2,
  Bell,
  Zap,
  Target,
  Dumbbell,
  Waves,
  Flame,
  Music,
  TreePine,
  User,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

const ClasesReservas: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSede, setSelectedSede] = useState('todas');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [favorites, setFavorites] = useState<number[]>([1, 3, 7]);
  const [bookings, setBookings] = useState<number[]>([2, 5]);

  const sedes = [
    { id: 'todas', name: 'Todas las sedes' },
    { id: 'zona10', name: 'Zona 10' },
    { id: 'zona15', name: 'Zona 15' },
    { id: 'carretera', name: 'Carretera a El Salvador' },
    { id: 'pradera', name: 'Pradera Concepción' }
  ];

  const categories = [
    { id: 'todas', name: 'Todas', icon: Dumbbell, color: '#b5fc00' },
    { id: 'spinning', name: 'Spinning', icon: Music, color: '#ff6b6b' },
    { id: 'crossfit', name: 'Cross Training', icon: Flame, color: '#ffa726' },
    { id: 'yoga', name: 'Yoga', icon: TreePine, color: '#66bb6a' },
    { id: 'pilates', name: 'Pilates', icon: Waves, color: '#42a5f5' },
    { id: 'funcional', name: 'Funcional', icon: Target, color: '#ab47bc' },
    { id: 'pesas', name: 'Pesas', icon: Dumbbell, color: '#ef5350' }
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', 
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00', '21:00'
  ];

  const classes = [
    {
      id: 1,
      name: 'Spinning Intenso',
      instructor: 'María González',
      time: '07:00',
      duration: 45,
      sede: 'Zona 10',
      category: 'spinning',
      intensity: 'Alta',
      spots: { available: 8, total: 20 },
      description: 'Clase de spinning de alta intensidad para quemar calorías',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      name: 'Yoga Matutino',
      instructor: 'Carlos Ruiz',
      time: '08:00',
      duration: 60,
      sede: 'Zona 15',
      category: 'yoga',
      intensity: 'Baja',
      spots: { available: 12, total: 15 },
      description: 'Yoga suave para comenzar el día con energía',
      image: '/api/placeholder/300/200'
    },
    {
      id: 3,
      name: 'Cross Training',
      instructor: 'Ana Martínez',
      time: '18:00',
      duration: 50,
      sede: 'Carretera a El Salvador',
      category: 'crossfit',
      intensity: 'Alta',
      spots: { available: 5, total: 12 },
      description: 'Entrenamiento funcional de alta intensidad',
      image: '/api/placeholder/300/200'
    },
    {
      id: 4,
      name: 'Pilates Core',
      instructor: 'Luis Herrera',
      time: '19:00',
      duration: 45,
      sede: 'Pradera Concepción',
      category: 'pilates',
      intensity: 'Media',
      spots: { available: 10, total: 12 },
      description: 'Fortalecimiento del core con Pilates',
      image: '/api/placeholder/300/200'
    },
    {
      id: 5,
      name: 'Funcional Avanzado',
      instructor: 'Sofia López',
      time: '20:00',
      duration: 40,
      sede: 'Zona 10',
      category: 'funcional',
      intensity: 'Alta',
      spots: { available: 3, total: 10 },
      description: 'Entrenamiento funcional para atletas',
      image: '/api/placeholder/300/200'
    },
    {
      id: 6,
      name: 'Yoga Restaurativo',
      instructor: 'Elena Vega',
      time: '21:00',
      duration: 60,
      sede: 'Zona 15',
      category: 'yoga',
      intensity: 'Baja',
      spots: { available: 8, total: 15 },
      description: 'Yoga relajante para terminar el día',
      image: '/api/placeholder/300/200'
    },
    {
      id: 7,
      name: 'Spinning Sunset',
      instructor: 'Roberto Díaz',
      time: '18:30',
      duration: 45,
      sede: 'Carretera a El Salvador',
      category: 'spinning',
      intensity: 'Media',
      spots: { available: 15, total: 25 },
      description: 'Spinning al atardecer con música en vivo',
      image: '/api/placeholder/300/200'
    }
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Alta':
        return 'text-red-400 bg-red-900/20';
      case 'Media':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'Baja':
        return 'text-green-400 bg-green-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Dumbbell;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.color : '#b5fc00';
  };

  const filteredClasses = classes.filter(classItem => {
    const sedeMatch = selectedSede === 'todas' || classItem.sede.toLowerCase().includes(selectedSede);
    const categoryMatch = selectedCategory === 'todas' || classItem.category === selectedCategory;
    return sedeMatch && categoryMatch;
  });

  const toggleFavorite = (classId: number) => {
    setFavorites(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const toggleBooking = (classId: number) => {
    setBookings(prev => 
      prev.includes(classId) 
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const isBooked = (classId: number) => bookings.includes(classId);
  const isFavorite = (classId: number) => favorites.includes(classId);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-GT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Clases & Reservas</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Reserva tus clases favoritas y gestiona tu horario</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-xs sm:text-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-xs sm:text-sm">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Horario Semanal</h3>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateDate('prev')}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 sm:px-4 py-2 bg-gray-700 text-white rounded-lg font-medium min-w-[150px] sm:min-w-[200px] text-center text-sm sm:text-base">
              {formatDate(selectedDate)}
            </span>
            <button 
              onClick={() => navigateDate('next')}
              className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
          {/* Sede Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Sede</label>
            <select 
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
            >
              {sedes.map(sede => (
                <option key={sede.id} value={sede.id}>{sede.name}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Categoría</label>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar clases..."
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-xs sm:text-sm ${
                  selectedCategory === category.id
                    ? 'text-black'
                    : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                }`}
                style={selectedCategory === category.id ? {backgroundColor: category.color} : {}}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredClasses.map(classItem => {
          const CategoryIcon = getCategoryIcon(classItem.category);
          const categoryColor = getCategoryColor(classItem.category);
          const booked = isBooked(classItem.id);
          const favorite = isFavorite(classItem.id);

          return (
            <div key={classItem.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
              {/* Class Image */}
              <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-700 to-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <CategoryIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" style={{color: categoryColor}} />
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(classItem.id)}
                    className={`p-2 rounded-full transition-colors ${
                      favorite 
                        ? 'text-yellow-400 bg-yellow-900/20' 
                        : 'text-gray-400 bg-gray-900/50 hover:text-yellow-400'
                    }`}
                  >
                    {favorite ? <BookmarkCheck className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                </div>

                {/* Intensity Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(classItem.intensity)}`}>
                    {classItem.intensity}
                  </span>
                </div>

                {/* Spots Available */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-900/50 rounded-full text-white text-xs sm:text-sm">
                    <Users className="w-3 h-3" />
                    {classItem.spots.available}/{classItem.spots.total}
                  </div>
                </div>
              </div>

              {/* Class Info */}
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">{classItem.name}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">con {classItem.instructor}</p>
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-base sm:text-lg font-bold text-white">{classItem.time}</div>
                    <div className="text-gray-400 text-xs sm:text-sm">{classItem.duration} min</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-300 text-xs sm:text-sm truncate">{classItem.sede}</span>
                </div>

                <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{classItem.description}</p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {booked ? (
                    <button
                      onClick={() => toggleBooking(classItem.id)}
                      className="flex-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Cancelar</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleBooking(classItem.id)}
                      disabled={classItem.spots.available === 0}
                      className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm ${
                        classItem.spots.available === 0
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'text-black'
                      }`}
                      style={classItem.spots.available > 0 ? {backgroundColor: '#b5fc00'} : {}}
                      onMouseEnter={(e) => {
                        if (classItem.spots.available > 0) {
                          e.target.style.backgroundColor = '#a3e600';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (classItem.spots.available > 0) {
                          e.target.style.backgroundColor = '#b5fc00';
                        }
                      }}
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      {classItem.spots.available === 0 ? 'Lleno' : 'Reservar'}
                    </button>
                  )}
                  
                  <button className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                    <Bell className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* My Bookings */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Mis Reservas</h3>
        
        {bookings.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm sm:text-base">No tienes reservas activas</p>
            <p className="text-gray-500 text-xs sm:text-sm">Reserva tu primera clase arriba</p>
          </div>
        ) : (
          <div className="space-y-3">
            {classes.filter(c => bookings.includes(c.id)).map(classItem => (
              <div key={classItem.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg gap-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                    {React.createElement(getCategoryIcon(classItem.category), {
                      className: "w-5 h-5 sm:w-6 sm:h-6",
                      style: {color: getCategoryColor(classItem.category)}
                    })}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm sm:text-base">{classItem.name}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{classItem.time} • {classItem.sede}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleBooking(classItem.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs sm:text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <button className="p-3 sm:p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Download className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium text-sm sm:text-base">Exportar Horario</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">Descarga tu horario en PDF</p>
          </button>
          
          <button className="p-3 sm:p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium text-sm sm:text-base">Recordatorios</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">Configurar notificaciones</p>
          </button>
          
          <button className="p-3 sm:p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium text-sm sm:text-base">Clases Favoritas</span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm">Ver clases guardadas</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClasesReservas;
