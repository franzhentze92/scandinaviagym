import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllReservationsWithDetails, getSedes, cancelReservation, getAllInstructors } from '@/services/database';
import { toast } from 'sonner';
import {
  Calendar,
  Search,
  Filter,
  User,
  Clock,
  MapPin,
  Shield,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  RefreshCw,
  Users,
  FileText,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AdministracionReservas: React.FC = () => {
  const { user, userRole } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sedes, setSedes] = useState<any[]>([]);
  const [instructors, setInstructors] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState<'reservas' | 'por-clase' | 'graficos'>('reservas');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [sedeFilter, setSedeFilter] = useState<string>('all');
  const [instructorFilter, setInstructorFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // KPIs
  const [kpis, setKpis] = useState({
    total: 0,
    confirmed: 0,
    cancelled: 0,
    today: 0,
    thisWeek: 0
  });

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'instructor') {
      loadData();
    }
  }, [user, userRole]);

  useEffect(() => {
    applyFilters();
  }, [reservations, searchQuery, statusFilter, sedeFilter, instructorFilter, dateFilter, startDate, endDate]);

  // Calculate reservation counts per class (for instructors)
  // Count all reservations for the same class, schedule, and date
  const getReservationCountForClass = useMemo(() => {
    const counts: Record<string, number> = {};
    // Use all reservations (not filtered) to get accurate counts
    reservations.forEach(reservation => {
      const schedule = reservation.class_schedule || {};
      const classData = schedule.class || {};
      const classId = classData.id;
      const scheduleId = schedule.id;
      const reservationDate = reservation.reservation_date;
      
      // Only count confirmed reservations
      if (reservation.status === 'confirmed') {
        // Create a unique key: classId + scheduleId + date
        const key = `${classId}-${scheduleId}-${reservationDate}`;
        counts[key] = (counts[key] || 0) + 1;
      }
    });
    return counts;
  }, [reservations]);

  // Group reservations by class (for "Por Clase" tab)
  const reservationsByClass = useMemo(() => {
    const grouped: Record<string, {
      classId: string;
      scheduleId: string;
      className: string;
      instructorName: string;
      sedeName: string;
      date: string;
      time: string;
      reservations: any[];
      confirmedCount: number;
      cancelledCount: number;
    }> = {};

    // Filter to only show classes from today onwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredReservations.forEach(reservation => {
      // Skip reservations with dates in the past
      const reservationDateObj = new Date(reservation.reservation_date);
      reservationDateObj.setHours(0, 0, 0, 0);
      if (reservationDateObj < today) {
        return;
      }
      
      const schedule = reservation.class_schedule || {};
      const classData = schedule.class || {};
      const instructor = classData.instructor || {};
      const classId = classData.id;
      const scheduleId = schedule.id;
      const reservationDate = reservation.reservation_date;
      
      // Create a unique key: classId + scheduleId + date
      const key = `${classId}-${scheduleId}-${reservationDate}`;
      
      if (!grouped[key]) {
        // Get sede name directly (same logic as getSedeName function)
        const sede = schedule.sede || 
                     schedule.class?.sede ||
                     reservation.class_schedule?.sede || 
                     reservation.class_schedule?.class?.sede;
        const sedeName = sede?.name || 'Sin sede';
        
        grouped[key] = {
          classId: classId || '',
          scheduleId: scheduleId || '',
          className: classData.name || 'Sin clase',
          instructorName: instructor.name || 'Sin instructor',
          sedeName: sedeName,
          date: reservationDate,
          time: schedule.start_time?.substring(0, 5) || '',
          reservations: [],
          confirmedCount: 0,
          cancelledCount: 0
        };
      }
      
      grouped[key].reservations.push(reservation);
      if (reservation.status === 'confirmed') {
        grouped[key].confirmedCount++;
      } else if (reservation.status === 'cancelled') {
        grouped[key].cancelledCount++;
      }
    });

    return Object.values(grouped).sort((a, b) => {
      // Sort by date and time
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredReservations]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reservationsData, sedesData, instructorsData] = await Promise.all([
        getAllReservationsWithDetails(),
        getSedes(),
        getAllInstructors()
      ]);

      setReservations(reservationsData);
      setSedes(sedesData);
      setInstructors(instructorsData);
      calculateKPIs(reservationsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar las reservas');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateKPIs = (reservationsData: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const todayCount = reservationsData.filter(r => {
      const resDate = new Date(r.reservation_date);
      return resDate >= today && resDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }).length;

    const weekCount = reservationsData.filter(r => {
      const resDate = new Date(r.reservation_date);
      return resDate >= weekStart;
    }).length;

    setKpis({
      total: reservationsData.length,
      confirmed: reservationsData.filter(r => r.status === 'confirmed').length,
      cancelled: reservationsData.filter(r => r.status === 'cancelled').length,
      today: todayCount,
      thisWeek: weekCount
    });
  };

  const applyFilters = () => {
    let filtered = [...reservations];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reservation => {
        const userName = reservation.user?.full_name?.toLowerCase() || '';
        const userEmail = reservation.user?.email?.toLowerCase() || '';
        const className = reservation.class_schedule?.class?.name?.toLowerCase() || '';
        const instructorName = reservation.class_schedule?.class?.instructor?.name?.toLowerCase() || '';
        
        return userName.includes(query) ||
               userEmail.includes(query) ||
               className.includes(query) ||
               instructorName.includes(query);
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(reservation => reservation.status === statusFilter);
    }

    // Sede filter
    if (sedeFilter !== 'all') {
      filtered = filtered.filter(reservation => {
        const sedeId = reservation.class_schedule?.sede_id || 
                      reservation.class_schedule?.class?.sede_id ||
                      reservation.class_schedule?.sede?.id;
        return sedeId === sedeFilter;
      });
    }

    // Instructor filter
    if (instructorFilter !== 'all') {
      filtered = filtered.filter(reservation => {
        const instructorId = reservation.class_schedule?.class?.instructor_id ||
                            reservation.class_schedule?.class?.instructor?.id;
        return instructorId === instructorFilter;
      });
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(reservation => {
        const resDate = new Date(reservation.reservation_date);
        
        if (dateFilter === 'today') {
          return resDate >= today && resDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        } else if (dateFilter === 'week') {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return resDate >= weekStart;
        } else if (dateFilter === 'month') {
          return resDate.getMonth() === today.getMonth() && 
                 resDate.getFullYear() === today.getFullYear();
        }
        return true;
      });
    }

    // Date range filter
    if (startDate) {
      filtered = filtered.filter(reservation => {
        return reservation.reservation_date >= startDate;
      });
    }

    if (endDate) {
      filtered = filtered.filter(reservation => {
        return reservation.reservation_date <= endDate;
      });
    }

    setFilteredReservations(filtered);
  };

  const handleCancel = async (reservationId: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      return;
    }

    try {
      const success = await cancelReservation(reservationId);
      if (success) {
        toast.success('Reserva cancelada exitosamente');
        await loadData();
      } else {
        toast.error('Error al cancelar la reserva');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Error al cancelar la reserva');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSedeName = (reservation: any) => {
    const sede = reservation.class_schedule?.sede || 
                 reservation.class_schedule?.class?.sede;
    return sede?.name || 'Sin sede';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-900/30 text-green-400';
      case 'cancelled':
        return 'bg-red-900/30 text-red-400';
      case 'completed':
        return 'bg-blue-900/30 text-blue-400';
      case 'no_show':
        return 'bg-yellow-900/30 text-yellow-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      case 'no_show':
        return 'No asistió';
      default:
        return status;
    }
  };

  const exportToCSV = () => {
    const headers = ['Usuario', 'Email', 'Clase', 'Instructor', 'Sede', 'Fecha Reserva', 'Hora', 'Estado', 'Fecha Creación'];
    const rows = filteredReservations.map(reservation => {
      const schedule = reservation.class_schedule || {};
      const classData = schedule.class || {};
      const instructor = classData.instructor || {};
      const user = reservation.user || {};
      
      return [
        user.full_name || '',
        user.email || '',
        classData.name || '',
        instructor.name || '',
        getSedeName(reservation),
        formatDate(reservation.reservation_date),
        schedule.start_time?.substring(0, 5) || '',
        getStatusLabel(reservation.status),
        formatDateTime(reservation.created_at)
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reservas-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Archivo CSV descargado');
  };

  if (userRole !== 'admin' && userRole !== 'instructor') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400">No tienes permisos para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 overflow-x-hidden max-w-full w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Administración de Reservas</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Gestiona todas las reservas de clases del sistema</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredReservations.length === 0}
            className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">Exportar</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl p-1 border border-gray-700 flex flex-wrap gap-1 sm:inline-flex w-full sm:w-auto">
        <button
          onClick={() => setSelectedTab('reservas')}
          className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
            selectedTab === 'reservas'
              ? 'text-black'
              : 'text-gray-300 hover:text-white'
          }`}
          style={selectedTab === 'reservas' ? {backgroundColor: '#b5fc00'} : {}}
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Reservas</span>
          <span className="sm:hidden">Res.</span>
        </button>
        <button
          onClick={() => setSelectedTab('por-clase')}
          className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
            selectedTab === 'por-clase'
              ? 'text-black'
              : 'text-gray-300 hover:text-white'
          }`}
          style={selectedTab === 'por-clase' ? {backgroundColor: '#b5fc00'} : {}}
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline">Por Clase</span>
          <span className="sm:hidden">Clase</span>
        </button>
        <button
          onClick={() => setSelectedTab('graficos')}
          className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
            selectedTab === 'graficos'
              ? 'text-black'
              : 'text-gray-300 hover:text-white'
          }`}
          style={selectedTab === 'graficos' ? {backgroundColor: '#b5fc00'} : {}}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Gráficos</span>
          <span className="sm:hidden">Gráf.</span>
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs sm:text-sm">Total</p>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs sm:text-sm">Confirmadas</p>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.confirmed}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs sm:text-sm">Canceladas</p>
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.cancelled}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs sm:text-sm">Hoy</p>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.today}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs sm:text-sm">Esta Semana</p>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.thisWeek}</p>
        </div>
      </div>

      {/* Filters - Show in Reservas and Por Clase tabs */}
      {(selectedTab === 'reservas' || selectedTab === 'por-clase') && (
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 overflow-x-hidden w-full max-w-full">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-white">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Usuario, clase, instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Instructor Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Instructor</label>
            <select
              value={instructorFilter}
              onChange={(e) => setInstructorFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todos los instructores</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todos</option>
              <option value="confirmed">Confirmadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          {/* Sede Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sede</label>
            <select
              value={sedeFilter}
              onChange={(e) => setSedeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todas las sedes</option>
              {sedes.map(sede => (
                <option key={sede.id} value={sede.id}>{sede.name}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Período</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todos</option>
              <option value="today">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
            </select>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>
      </div>
      )}

      {/* Reservations by Class - Only show in Por Clase tab */}
      {selectedTab === 'por-clase' && (
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden w-full max-w-full">
        <div className="p-4 sm:p-6 overflow-x-hidden w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Clases ({reservationsByClass.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : reservationsByClass.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No se encontraron clases</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservationsByClass.map((classGroup, index) => (
                <div key={`${classGroup.classId}-${classGroup.scheduleId}-${classGroup.date}-${index}`} className="bg-gray-700/50 rounded-lg p-3 sm:p-4 border border-gray-600 w-full overflow-x-hidden max-w-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
                    {/* Class Info */}
                    <div className="lg:col-span-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-base sm:text-lg mb-1">{classGroup.className}</h4>
                          <div className="space-y-1 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 text-gray-300">
                              <User className="w-4 h-4 text-gray-400" />
                              {classGroup.instructorName}
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {classGroup.sedeName}
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(classGroup.date)}
                            </div>
                            <div className="flex items-center gap-2 text-gray-300">
                              <Clock className="w-4 h-4 text-gray-400" />
                              {classGroup.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reservations Count */}
                    <div className="lg:col-span-2">
                      <div className="bg-gray-800 rounded-lg p-2 sm:p-3">
                        <p className="text-gray-400 text-xs mb-2">Reservas</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-xs sm:text-sm">Total:</span>
                            <span className="text-white font-semibold text-sm sm:text-base">{classGroup.reservations.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-xs sm:text-sm">Confirmadas:</span>
                            <span className="text-green-400 font-semibold text-sm sm:text-base">{classGroup.confirmedCount}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300 text-xs sm:text-sm">Canceladas:</span>
                            <span className="text-red-400 font-semibold text-sm sm:text-base">{classGroup.cancelledCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Users List */}
                    <div className="lg:col-span-6">
                      <p className="text-gray-400 text-xs mb-2">Usuarios Reservados:</p>
                      <div className="bg-gray-800 rounded-lg p-2 sm:p-3 max-h-32 sm:max-h-40 overflow-y-auto">
                        {classGroup.reservations.length === 0 ? (
                          <p className="text-gray-500 text-xs sm:text-sm">No hay reservas</p>
                        ) : (
                          <div className="space-y-2">
                            {classGroup.reservations.map((reservation) => {
                              const user = reservation.user || {};
                              return (
                                <div key={reservation.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{user.full_name || 'Sin nombre'}</p>
                                    <p className="text-gray-400 text-xs truncate">{user.email || ''}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(reservation.status)}`}>
                                    {getStatusLabel(reservation.status)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      )}

      {/* Reservations Table - Only show in Reservas tab */}
      {selectedTab === 'reservas' && (
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden w-full max-w-full">
        <div className="p-4 sm:p-6 overflow-x-hidden w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Reservas ({filteredReservations.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredReservations.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No se encontraron reservas</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full max-w-full">
              <table className="w-full" style={{ minWidth: 'max-content' }}>
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-300">Usuario</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-300">Clase</th>
                    {userRole === 'instructor' && (
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-300">Reservas</th>
                    )}
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-300">Sede</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-300">Fecha</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-300">Hora</th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-300">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300 hidden sm:table-cell">Reservado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReservations.map((reservation) => {
                    const schedule = reservation.class_schedule || {};
                    const classData = schedule.class || {};
                    const instructor = classData.instructor || {};
                    const user = reservation.user || {};
                    const startTime = schedule.start_time?.substring(0, 5) || '';

                    return (
                      <tr key={reservation.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="min-w-0">
                            <p className="text-white font-medium text-xs sm:text-sm truncate">{user.full_name || 'Sin nombre'}</p>
                            <p className="text-gray-400 text-xs truncate">{user.email || ''}</p>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <p className="text-gray-300 text-xs sm:text-sm truncate min-w-0">{classData.name || '-'}</p>
                        </td>
                        {userRole === 'instructor' && (() => {
                          const schedule = reservation.class_schedule || {};
                          const classData = schedule.class || {};
                          const classId = classData.id;
                          const scheduleId = schedule.id;
                          const reservationDate = reservation.reservation_date;
                          const key = `${classId}-${scheduleId}-${reservationDate}`;
                          const count = getReservationCountForClass[key] || 0;
                          
                          return (
                            <td className="py-3 px-4">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400">
                                <Users className="w-3 h-3" />
                                {count}
                              </span>
                            </td>
                          );
                        })()}
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-300 text-xs sm:text-sm truncate">{getSedeName(reservation)}</span>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">{formatDate(reservation.reservation_date)}</span>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-300 text-xs sm:text-sm whitespace-nowrap">{startTime}</span>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(reservation.status)}`}>
                            {getStatusLabel(reservation.status)}
                          </span>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 hidden sm:table-cell">
                          <span className="text-gray-400 text-xs">{formatDateTime(reservation.created_at)}</span>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4">
                          {reservation.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancel(reservation.id)}
                              className="px-2 sm:px-3 py-1 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-xs font-medium transition-colors whitespace-nowrap"
                            >
                              Cancelar
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      )}

      {/* Charts Tab */}
      {selectedTab === 'graficos' && (
        <ChartsSection reservations={reservations} />
      )}
    </div>
  );
};

// Charts Component
const ChartsSection: React.FC<{ reservations: any[] }> = ({ reservations }) => {
  // Calculate most requested classes
  const mostRequestedClasses = useMemo(() => {
    const classCounts: Record<string, number> = {};
    
    reservations.forEach(reservation => {
      const className = reservation.class_schedule?.class?.name || 'Sin clase';
      classCounts[className] = (classCounts[className] || 0) + 1;
    });

    return Object.entries(classCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [reservations]);

  // Calculate most requested days
  const mostRequestedDays = useMemo(() => {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const dayCounts: Record<number, number> = {};
    
    reservations.forEach(reservation => {
      const date = new Date(reservation.reservation_date);
      const dayOfWeek = date.getDay();
      dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
    });

    return Object.entries(dayCounts)
      .map(([day, count]) => ({ 
        name: dayNames[parseInt(day)], 
        count 
      }))
      .sort((a, b) => {
        const dayOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        return dayOrder.indexOf(a.name) - dayOrder.indexOf(b.name);
      });
  }, [reservations]);

  // Calculate most requested instructors
  const mostRequestedInstructors = useMemo(() => {
    const instructorCounts: Record<string, number> = {};
    
    reservations.forEach(reservation => {
      const instructorName = reservation.class_schedule?.class?.instructor?.name || 'Sin instructor';
      instructorCounts[instructorName] = (instructorCounts[instructorName] || 0) + 1;
    });

    return Object.entries(instructorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [reservations]);

  const colors = ['#b5fc00', '#a3e600', '#8fd600', '#7cc200', '#6aaf00', '#589c00', '#468900', '#347600', '#226300', '#105000'];

  return (
    <div className="space-y-6">
      {/* Most Requested Classes */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[#b5fc00]" />
          <h3 className="text-xl font-bold text-white">Clases Más Solicitadas</h3>
        </div>
        {mostRequestedClasses.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No hay datos disponibles</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mostRequestedClasses}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Bar dataKey="count" name="Reservas" radius={[8, 8, 0, 0]}>
                {mostRequestedClasses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Most Requested Days */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-[#b5fc00]" />
          <h3 className="text-xl font-bold text-white">Días Más Solicitados</h3>
        </div>
        {mostRequestedDays.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No hay datos disponibles</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mostRequestedDays}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Bar dataKey="count" name="Reservas" radius={[8, 8, 0, 0]}>
                {mostRequestedDays.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Most Requested Instructors */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-[#b5fc00]" />
          <h3 className="text-xl font-bold text-white">Instructores Más Solicitados</h3>
        </div>
        {mostRequestedInstructors.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No hay datos disponibles</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={mostRequestedInstructors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                angle={-45}
                textAnchor="end"
                height={100}
                fontSize={12}
              />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Legend />
              <Bar dataKey="count" name="Reservas" radius={[8, 8, 0, 0]}>
                {mostRequestedInstructors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AdministracionReservas;

