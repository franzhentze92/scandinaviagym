import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getClassSchedulesForDate,
  getAvailableSpots,
  createClassReservation,
  cancelReservation,
  getUserReservationsWithDetails,
  getClassCategories,
  getSedes
} from '@/services/database';
import { toast } from 'sonner';
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
  Loader2
} from 'lucide-react';

const ClasesReservas: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'clases' | 'reservas'>('clases');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSede, setSelectedSede] = useState('todas');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReserving, setIsReserving] = useState<string | null>(null);

  // Load data on mount and when filters change
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, selectedDate, selectedSede, selectedCategory]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load sedes and categories
      const [sedesData, categoriesData] = await Promise.all([
        getSedes(),
        getClassCategories()
      ]);

      setSedes(sedesData);
      setCategories(categoriesData.map(cat => ({
        id: cat.id,
        name: cat.name,
        icon: getCategoryIconByName(cat.name),
        color: cat.color || '#b5fc00'
      })));

      // Load user reservations first
      const reservationsData = await getUserReservationsWithDetails(user.id, selectedDate);
      setReservations(reservationsData);

      // Load classes for selected date
      const sedeId = selectedSede === 'todas' ? undefined : selectedSede;
      const categoryId = selectedCategory === 'todas' ? undefined : selectedCategory;
      
      const schedulesData = await getClassSchedulesForDate(selectedDate, sedeId, categoryId);
      
      // Enrich with availability and reservation status
      const reservationDate = selectedDate.toISOString().split('T')[0];
      const enrichedClasses = await Promise.all(
        schedulesData.map(async (schedule: any) => {
          const spots = await getAvailableSpots(schedule.id, reservationDate);
          const isReserved = reservationsData.some(
            (r: any) => r.class_schedule_id === schedule.id && 
                 r.reservation_date === reservationDate
          );
          
          return {
            ...schedule,
            spots,
            isReserved,
            reservationDate
          };
        })
      );

      setClasses(enrichedClasses);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar las clases');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIconByName = (name: string) => {
    const nameLower = name.toLowerCase();
    if (nameLower.includes('spinning')) return Music;
    if (nameLower.includes('pilates')) return Waves;
    if (nameLower.includes('funcional')) return Target;
    if (nameLower.includes('baile')) return Music;
    if (nameLower.includes('tae-bo') || nameLower.includes('taebo')) return Zap;
    if (nameLower.includes('zumba')) return Music;
    if (nameLower.includes('box')) return Target;
    return Dumbbell;
  };

  const handleReserve = async (scheduleId: string, reservationDate: string) => {
    if (!user) {
      toast.error('Debes iniciar sesión para reservar');
      return;
    }

    setIsReserving(scheduleId);
    try {
      const reservation = await createClassReservation(user.id, scheduleId, reservationDate);
      
      if (reservation) {
        toast.success('Clase reservada exitosamente');
        await loadData(); // Reload to update availability
      } else {
        toast.error('Error al reservar la clase. Puede que ya esté llena o ya tengas una reserva.');
      }
    } catch (error: any) {
      console.error('Error reserving class:', error);
      toast.error(error.message || 'Error al reservar la clase');
    } finally {
      setIsReserving(null);
    }
  };

  const handleCancel = async (reservationId: string) => {
    if (!user) return;

    try {
      const success = await cancelReservation(reservationId);
      
      if (success) {
        toast.success('Reserva cancelada exitosamente');
        await loadData(); // Reload to update availability
      } else {
        toast.error('Error al cancelar la reserva');
      }
    } catch (error: any) {
      console.error('Error cancelling reservation:', error);
      toast.error('Error al cancelar la reserva');
    }
  };

  const getIntensityColor = (intensity: string | null) => {
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

  const getCategoryIcon = (categoryId: string | null) => {
    if (!categoryId) return Dumbbell;
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.icon : Dumbbell;
  };

  const getCategoryColor = (categoryId: string | null) => {
    if (!categoryId) return '#b5fc00';
    const cat = categories.find(c => c.id === categoryId);
    return cat ? cat.color : '#b5fc00';
  };

  const filteredClasses = classes.filter(classItem => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const className = classItem.class?.name?.toLowerCase() || '';
      const instructorName = classItem.class?.instructor?.name?.toLowerCase() || '';
      if (!className.includes(query) && !instructorName.includes(query)) {
        return false;
      }
    }
    return true;
  });


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
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedTab('clases')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedTab === 'clases'
                ? 'text-black'
                : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
            }`}
            style={selectedTab === 'clases' ? {backgroundColor: '#b5fc00'} : {}}
          >
            <Calendar className="w-4 h-4" />
            Clases
          </button>
          <button
            onClick={() => setSelectedTab('reservas')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedTab === 'reservas'
                ? 'text-black'
                : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
            }`}
            style={selectedTab === 'reservas' ? {backgroundColor: '#b5fc00'} : {}}
          >
            <CheckCircle className="w-4 h-4" />
            Mis Reservas
          </button>
        </div>

        {/* Clases Tab */}
        {selectedTab === 'clases' && (
          <div className="space-y-6">
            {/* Date Navigation */}
            <div className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700">
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
              <option value="todas">Todas las sedes</option>
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
              <option value="todas">Todas las categorías</option>
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
              />
            </div>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('todas')}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-xs sm:text-sm ${
              selectedCategory === 'todas'
                ? 'text-black'
                : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
            }`}
            style={selectedCategory === 'todas' ? {backgroundColor: '#b5fc00'} : {}}
          >
            <Dumbbell className="w-3 h-3 sm:w-4 sm:h-4" />
            Todas
          </button>
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
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Cargando clases...</p>
          </div>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No hay clases disponibles para esta fecha</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredClasses.map((scheduleItem: any) => {
            const classData = scheduleItem.class || {};
            const category = classData.category || {};
            const instructor = classData.instructor || {};
            const sede = scheduleItem.sede || classData.sede || {};
            
            const CategoryIcon = getCategoryIcon(category.id);
            const categoryColor = getCategoryColor(category.id);
            const booked = scheduleItem.isReserved;
            
            const startTime = scheduleItem.start_time?.substring(0, 5) || '';
            const duration = classData.duration_minutes || 0;
            // Clean class name: remove instructor name if present (format: "Category - Instructor")
            let className = classData.name || 'Clase';
            if (className.includes(' - ')) {
              className = className.split(' - ')[0].trim();
            }
            const instructorName = instructor.name || 'Instructor';
            const sedeName = sede.name || 'Sede';
            // Clean description: remove "Clase de X con Y" pattern
            let description = classData.description || '';
            if (description && description.includes('Clase de ') && description.includes(' con ')) {
              description = '';
            }
            const intensity = classData.intensity || 'Media';
            const spots = scheduleItem.spots || { available: 0, total: 0 };

            return (
              <div key={scheduleItem.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
                {/* Class Image */}
                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                  {classData.image_url ? (
                    <img 
                      src={classData.image_url} 
                      alt={className}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CategoryIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500" style={{color: categoryColor}} />
                    </div>
                  )}

                  {/* Intensity Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(intensity)}`}>
                      {intensity}
                    </span>
                  </div>

                  {/* Spots Available */}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-1 px-2 py-1 bg-gray-900/50 rounded-full text-white text-xs sm:text-sm">
                      <Users className="w-3 h-3" />
                      {spots.available}/{spots.total}
                    </div>
                  </div>
                </div>

                {/* Class Info */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 truncate">{className}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm">con {instructorName}</p>
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-base sm:text-lg font-bold text-white">{startTime}</div>
                      <div className="text-gray-400 text-xs sm:text-sm">{duration} min</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-300 text-xs sm:text-sm truncate">{sedeName}</span>
                  </div>

                  {description && description.trim() !== '' && (
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{description}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {booked ? (
                      <button
                        onClick={() => {
                          const reservation = reservations.find(
                            r => r.class_schedule_id === scheduleItem.id && 
                                 r.reservation_date === scheduleItem.reservationDate
                          );
                          if (reservation) {
                            handleCancel(reservation.id);
                          }
                        }}
                        className="flex-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Cancelar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReserve(scheduleItem.id, scheduleItem.reservationDate)}
                        disabled={spots.available === 0 || isReserving === scheduleItem.id}
                        className={`flex-1 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm ${
                          spots.available === 0 || isReserving === scheduleItem.id
                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            : 'text-black'
                        }`}
                        style={spots.available > 0 && isReserving !== scheduleItem.id ? {backgroundColor: '#b5fc00'} : {}}
                        onMouseEnter={(e) => {
                          if (spots.available > 0 && isReserving !== scheduleItem.id) {
                            (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (spots.available > 0 && isReserving !== scheduleItem.id) {
                            (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                          }
                        }}
                      >
                        {isReserving === scheduleItem.id ? (
                          <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        {spots.available === 0 ? 'Lleno' : isReserving === scheduleItem.id ? 'Reservando...' : 'Reservar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

          </div>
        )}

        {/* Mis Reservas Tab */}
        {selectedTab === 'reservas' && (
          <div className="space-y-6">
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-base">No tienes reservas activas</p>
                <p className="text-gray-500 text-sm mt-2">Reserva tu primera clase en la pestaña "Clases"</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reservations.map((reservation: any) => {
                  const schedule = reservation.class_schedule || {};
                  const classData = schedule.class || {};
                  const category = classData.category || {};
                  const instructor = classData.instructor || {};
                  const sede = schedule.sede || classData.sede || {};
                  
                  const CategoryIcon = getCategoryIcon(category.id);
                  const categoryColor = getCategoryColor(category.id);
                  const startTime = schedule.start_time?.substring(0, 5) || '';
                  // Clean class name: remove instructor name if present
                  let className = classData.name || 'Clase';
                  if (className.includes(' - ')) {
                    className = className.split(' - ')[0].trim();
                  }
                  const sedeName = sede.name || 'Sede';
                  const reservationDate = new Date(reservation.reservation_date).toLocaleDateString('es-GT', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  });

                  return (
                    <div key={reservation.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-700 rounded-lg gap-3">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {classData.image_url ? (
                            <img 
                              src={classData.image_url} 
                              alt={className}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <CategoryIcon 
                              className="w-6 h-6"
                              style={{color: categoryColor}}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium text-base">{className}</p>
                          <p className="text-gray-400 text-sm">
                            {startTime} • {sedeName}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {reservationDate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button 
                          onClick={() => handleCancel(reservation.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default ClasesReservas;
