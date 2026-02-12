import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getUserProfile,
  getUserMembership,
  getUserReservationsWithDetails,
  getAllClinicalEvaluations,
  getAllWorkoutRoutines,
  getActivePromotions
} from '@/services/database';
import { toast } from 'sonner';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  TrendingUp, 
  Gift, 
  Bell, 
  ArrowRight,
  CheckCircle,
  Star,
  Heart,
  Zap,
  Target,
  Award,
  Activity,
  ClipboardList,
  CreditCard,
  Loader2,
  RefreshCw,
  XCircle
} from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [membership, setMembership] = useState<any>(null);
  const [nextReservation, setNextReservation] = useState<any>(null);
  const [kpis, setKpis] = useState({
    reservations: {
      total: 0,
      today: 0,
      thisWeek: 0,
      upcoming: 0
    },
    evaluations: {
      total: 0,
      lastDate: null as string | null
    },
    routines: {
      total: 0,
      lastDate: null as string | null
    }
  });
  const [promotions, setPromotions] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (!user) return;

      const [
        profile,
        userMembership,
        reservations,
        evaluations,
        routines,
        activePromos
      ] = await Promise.all([
        getUserProfile(user.id),
        getUserMembership(user.id),
        getUserReservationsWithDetails(user.id),
        getAllClinicalEvaluations({ userId: user.id }),
        getAllWorkoutRoutines({ userId: user.id }),
        getActivePromotions()
      ]);

      if (profile) {
        setUserName(profile.full_name || '');
      }

      if (userMembership) {
        setMembership(userMembership);
      }

      // Calculate reservation KPIs
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const todayReservations = reservations.filter((r: any) => {
        const resDate = new Date(r.reservation_date);
        return resDate >= today && resDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
      });

      const weekReservations = reservations.filter((r: any) => {
        const resDate = new Date(r.reservation_date);
        return resDate >= weekStart && resDate < weekEnd;
      });

      const upcomingReservations = reservations.filter((r: any) => {
        const resDate = new Date(r.reservation_date);
        return resDate >= today;
      });

      // Find next reservation
      const sortedUpcoming = upcomingReservations
        .sort((a: any, b: any) => {
          const dateA = new Date(a.reservation_date);
          const dateB = new Date(b.reservation_date);
          return dateA.getTime() - dateB.getTime();
        });
      
      if (sortedUpcoming.length > 0) {
        setNextReservation(sortedUpcoming[0]);
      }

      // Get last evaluation date
      const lastEvaluation = evaluations.length > 0 
        ? evaluations.sort((a: any, b: any) => {
            const dateA = new Date(a.evaluation_date);
            const dateB = new Date(b.evaluation_date);
            return dateB.getTime() - dateA.getTime();
          })[0]
        : null;

      // Get last routine date
      const lastRoutine = routines.length > 0
        ? routines.sort((a: any, b: any) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB.getTime() - dateA.getTime();
          })[0]
        : null;

      setKpis({
        reservations: {
          total: reservations.length,
          today: todayReservations.length,
          thisWeek: weekReservations.length,
          upcoming: upcomingReservations.length
        },
        evaluations: {
          total: evaluations.length,
          lastDate: lastEvaluation ? lastEvaluation.evaluation_date : null
        },
        routines: {
          total: routines.length,
          lastDate: lastRoutine ? lastRoutine.created_at : null
        }
      });

      setPromotions(activePromos.slice(0, 2));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Error al cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
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

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const getMembershipStatus = () => {
    if (!membership) return { status: 'Sin membresía', color: 'text-gray-400' };
    if (membership.status === 'active') {
      const endDate = new Date(membership.end_date);
      const daysLeft = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 7) {
        return { status: `Vence en ${daysLeft} días`, color: 'text-red-400' };
      }
      return { status: `Vence: ${formatDate(membership.end_date)}`, color: 'text-green-400' };
    }
    return { status: 'Expirada', color: 'text-red-400' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const membershipStatus = getMembershipStatus();

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden max-w-full w-full min-w-0">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">
              {userName ? `¡Hola, ${userName}! 👋` : '¡Hola! 👋'}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              {membership ? 'Tu membresía está activa' : 'Bienvenido a Scandinavia Gym'}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {membership && (
              <div className="text-left sm:text-right">
                <p className="text-white font-semibold text-sm sm:text-base">
                  {membership.plan?.name || 'Membresía'}
                </p>
                <p className={`text-xs sm:text-sm ${membershipStatus.color}`}>
                  {membershipStatus.status}
                </p>
              </div>
            )}
            <button
              onClick={() => navigate('/dashboard/membresia')}
              className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
              style={{backgroundColor: '#b5fc00', color: 'black'}}
            >
              {membership ? 'Ver Membresía' : 'Suscribirse'}
            </button>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
            <span className="text-white font-semibold text-base sm:text-lg">{kpis.reservations.total}</span>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm">Reservas Totales</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
            <span className="text-white font-semibold text-base sm:text-lg">{kpis.reservations.upcoming}</span>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm">Próximas</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
            <span className="text-white font-semibold text-base sm:text-lg">{kpis.evaluations.total}</span>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm">Evaluaciones</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5" style={{color: '#b5fc00'}} />
            <span className="text-white font-semibold text-base sm:text-lg">{kpis.routines.total}</span>
          </div>
          <p className="text-gray-300 text-xs sm:text-sm">Rutinas</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Next Reservation */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{color: '#b5fc00'}} />
              <h3 className="text-white font-semibold text-base sm:text-lg">Próxima Reserva</h3>
            </div>
            <button
              onClick={() => navigate('/dashboard/clases')}
              className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
            >
              Ver todas
            </button>
          </div>
          {nextReservation ? (
            <div className="space-y-3">
              <div>
                <h4 className="text-white font-medium text-base sm:text-lg">
                  {nextReservation.class_schedule?.class?.name || 'Clase'}
                </h4>
                {nextReservation.class_schedule?.class?.instructor?.name && (
                  <p className="text-gray-300 text-sm sm:text-base">
                    con {nextReservation.class_schedule.class.instructor.name}
                  </p>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(nextReservation.reservation_date)}</span>
                </div>
                {nextReservation.class_schedule?.start_time && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(nextReservation.class_schedule.start_time)}</span>
                  </div>
                )}
                {nextReservation.class_schedule?.sede?.name && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{nextReservation.class_schedule.sede.name}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => navigate('/dashboard/clases')}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400 text-sm mb-3">No tienes reservas próximas</p>
              <button
                onClick={() => navigate('/dashboard/clases')}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Reservar Clase
              </button>
            </div>
          )}
        </div>

        {/* Evaluations & Routines */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{color: '#b5fc00'}} />
              <h3 className="text-white font-semibold text-base sm:text-lg">Mi Progreso</h3>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm sm:text-base">Evaluaciones Clínicas</span>
                <button
                  onClick={() => navigate('/dashboard/mis-evaluaciones')}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Ver todas →
                </button>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-white text-sm sm:text-base font-medium mb-1">
                  {kpis.evaluations.total > 0 ? `${kpis.evaluations.total} evaluaciones` : 'Sin evaluaciones'}
                </p>
                {kpis.evaluations.lastDate && (
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Última: {formatDate(kpis.evaluations.lastDate)}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm sm:text-base">Rutinas de Entrenamiento</span>
                <button
                  onClick={() => navigate('/dashboard/mis-rutinas')}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Ver todas →
                </button>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3">
                <p className="text-white text-sm sm:text-base font-medium mb-1">
                  {kpis.routines.total > 0 ? `${kpis.routines.total} rutinas` : 'Sin rutinas'}
                </p>
                {kpis.routines.lastDate && (
                  <p className="text-gray-400 text-xs sm:text-sm">
                    Última: {formatDate(kpis.routines.lastDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Promotions */}
      {promotions.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" style={{color: '#b5fc00'}} />
              <h3 className="text-white font-semibold text-base sm:text-lg">Promociones Disponibles</h3>
            </div>
            <button
              onClick={() => navigate('/dashboard/membresia')}
              className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
            >
              Ver todas
            </button>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm mb-4">
            Aplica estos cupones al suscribirte o renovar tu membresía
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {promotions.map((promo) => (
              <div key={promo.id} className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-600">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm sm:text-base mb-1">{promo.title}</h4>
                    <p className="text-gray-300 text-xs sm:text-sm mb-2">{promo.description}</p>
                    {promo.coupon_code && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 text-xs">Cupón:</span>
                        <code className="bg-gray-800 px-2 py-1 rounded text-xs text-green-400 font-mono border border-green-500/30">
                          {promo.coupon_code}
                        </code>
                      </div>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-bold ml-2" style={{color: '#b5fc00'}}>
                    -{promo.discount}%
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                  {promo.valid_until && (
                    <span className="text-gray-400 text-xs">
                      Válido hasta: {formatDate(promo.valid_until)}
                    </span>
                  )}
                  <button
                    onClick={() => navigate('/dashboard/membresia')}
                    className="text-xs sm:text-sm font-medium"
                    style={{color: '#b5fc00'}}
                  >
                    Aprovechar →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/dashboard/clases')}
          className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-700 transition-colors text-left"
        >
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{color: '#b5fc00'}} />
          <p className="text-white font-medium text-sm sm:text-base">Reservar Clase</p>
          <p className="text-gray-400 text-xs sm:text-sm">Ver horarios</p>
        </button>
        <button
          onClick={() => navigate('/dashboard/mis-evaluaciones')}
          className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-700 transition-colors text-left"
        >
          <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{color: '#b5fc00'}} />
          <p className="text-white font-medium text-sm sm:text-base">Mis Evaluaciones</p>
          <p className="text-gray-400 text-xs sm:text-sm">Ver evaluaciones</p>
        </button>
        <button
          onClick={() => navigate('/dashboard/mis-rutinas')}
          className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-700 transition-colors text-left"
        >
          <Activity className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{color: '#b5fc00'}} />
          <p className="text-white font-medium text-sm sm:text-base">Mis Rutinas</p>
          <p className="text-gray-400 text-xs sm:text-sm">Ver rutinas</p>
        </button>
        <button
          onClick={() => navigate('/dashboard/membresia')}
          className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-700 transition-colors text-left"
        >
          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{color: '#b5fc00'}} />
          <p className="text-white font-medium text-sm sm:text-base">Mi Membresía</p>
          <p className="text-gray-400 text-xs sm:text-sm">Ver detalles</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardOverview;
