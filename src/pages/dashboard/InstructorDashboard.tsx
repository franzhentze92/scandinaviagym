import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getAllReservationsWithDetails, 
  getAllClinicalEvaluations, 
  getAllWorkoutRoutines,
  getUserProfile
} from '@/services/database';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Activity,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

const InstructorDashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  
  // KPIs
  const [kpis, setKpis] = useState({
    reservations: {
      total: 0,
      today: 0,
      thisWeek: 0,
      confirmed: 0,
      cancelled: 0
    },
    evaluations: {
      total: 0,
      thisMonth: 0,
      thisWeek: 0
    },
    routines: {
      total: 0,
      thisMonth: 0,
      thisWeek: 0
    }
  });

  useEffect(() => {
    if (userRole === 'instructor') {
      loadUserProfile();
      loadData();
    }
  }, [user, userRole]);

  const loadUserProfile = async () => {
    if (!user) return;
    try {
      const profile = await getUserProfile(user.id);
      if (profile) {
        setUserName(profile.full_name || '');
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reservations, evaluations, routines] = await Promise.all([
        getAllReservationsWithDetails(),
        getAllClinicalEvaluations(),
        getAllWorkoutRoutines()
      ]);

      // Calculate reservation KPIs
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const todayReservations = reservations.filter(r => {
        const resDate = new Date(r.reservation_date);
        return resDate >= today && resDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      });

      const weekReservations = reservations.filter(r => {
        const resDate = new Date(r.reservation_date);
        return resDate >= weekStart;
      });

      // Calculate evaluation KPIs
      const monthEvaluations = evaluations.filter(e => {
        const evalDate = new Date(e.evaluation_date);
        return evalDate >= monthStart;
      });

      const weekEvaluations = evaluations.filter(e => {
        const evalDate = new Date(e.evaluation_date);
        return evalDate >= weekStart;
      });

      // Calculate routine KPIs
      const monthRoutines = routines.filter(r => {
        const createdDate = new Date(r.created_at);
        return createdDate >= monthStart;
      });

      const weekRoutines = routines.filter(r => {
        const createdDate = new Date(r.created_at);
        return createdDate >= weekStart;
      });

      setKpis({
        reservations: {
          total: reservations.length,
          today: todayReservations.length,
          thisWeek: weekReservations.length,
          confirmed: reservations.filter(r => r.status === 'confirmed').length,
          cancelled: reservations.filter(r => r.status === 'cancelled').length
        },
        evaluations: {
          total: evaluations.length,
          thisMonth: monthEvaluations.length,
          thisWeek: weekEvaluations.length
        },
        routines: {
          total: routines.length,
          thisMonth: monthRoutines.length,
          thisWeek: weekRoutines.length
        }
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (userRole !== 'instructor') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <LayoutDashboard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400">Esta página es solo para instructores</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {userName ? `Bienvenido, ${userName}` : 'Bienvenido'}
          </h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Resumen de tus actividades y gestión</p>
        </div>
        <button
          onClick={loadData}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Reservations Section */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Reservas</h2>
          </div>
          <button
            onClick={() => navigate('/dashboard/admin/reservas')}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm sm:text-base"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{kpis.reservations.total}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Hoy</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-400">{kpis.reservations.today}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Esta Semana</p>
            <p className="text-xl sm:text-2xl font-bold text-indigo-400">{kpis.reservations.thisWeek}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Confirmadas</p>
            <p className="text-xl sm:text-2xl font-bold text-green-400">{kpis.reservations.confirmed}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Canceladas</p>
            <p className="text-xl sm:text-2xl font-bold text-red-400">{kpis.reservations.cancelled}</p>
          </div>
        </div>
      </div>

      {/* Evaluations Section */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Evaluaciones Clínicas</h2>
          </div>
          <button
            onClick={() => navigate('/dashboard/admin/evaluaciones')}
            className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm sm:text-base"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{kpis.evaluations.total}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Este Mes</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-400">{kpis.evaluations.thisMonth}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Esta Semana</p>
            <p className="text-xl sm:text-2xl font-bold text-indigo-400">{kpis.evaluations.thisWeek}</p>
          </div>
        </div>
      </div>

      {/* Routines Section */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Rutinas de Entrenamiento</h2>
          </div>
          <button
            onClick={() => navigate('/dashboard/admin/rutinas')}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm sm:text-base"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Total</p>
            <p className="text-xl sm:text-2xl font-bold text-white">{kpis.routines.total}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Este Mes</p>
            <p className="text-xl sm:text-2xl font-bold text-purple-400">{kpis.routines.thisMonth}</p>
          </div>
          <div className="bg-gray-700/50 rounded-lg p-3 sm:p-4">
            <p className="text-gray-400 text-xs sm:text-sm mb-1">Esta Semana</p>
            <p className="text-xl sm:text-2xl font-bold text-indigo-400">{kpis.routines.thisWeek}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/dashboard/admin/reservas')}
            className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 sm:p-4 text-left transition-colors w-full"
          >
            <Calendar className="w-5 h-5 text-green-400 mb-2" />
            <p className="font-medium text-white text-sm sm:text-base">Gestionar Reservas</p>
            <p className="text-xs sm:text-sm text-gray-400">Ver y administrar todas las reservas</p>
          </button>
          <button
            onClick={() => navigate('/dashboard/admin/evaluaciones')}
            className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 sm:p-4 text-left transition-colors w-full"
          >
            <ClipboardList className="w-5 h-5 text-blue-400 mb-2" />
            <p className="font-medium text-white text-sm sm:text-base">Gestionar Evaluaciones</p>
            <p className="text-xs sm:text-sm text-gray-400">Ver y crear evaluaciones clínicas</p>
          </button>
          <button
            onClick={() => navigate('/dashboard/admin/rutinas')}
            className="bg-gray-700 hover:bg-gray-600 rounded-lg p-3 sm:p-4 text-left transition-colors w-full"
          >
            <Activity className="w-5 h-5 text-purple-400 mb-2" />
            <p className="font-medium text-white text-sm sm:text-base">Gestionar Rutinas</p>
            <p className="text-xs sm:text-sm text-gray-400">Ver y crear rutinas de entrenamiento</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

