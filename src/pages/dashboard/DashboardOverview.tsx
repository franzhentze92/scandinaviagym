import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'renewal',
      message: 'Recuerda renovar tu membresía antes del 30 de Septiembre',
      urgent: true,
      date: '2024-09-15'
    },
    {
      id: 2,
      type: 'class',
      message: 'Tu clase de Yoga Flow está programada para mañana a las 7:30 AM',
      urgent: false,
      date: '2024-09-14'
    },
    {
      id: 3,
      type: 'promo',
      message: '¡Nueva promoción! 20% OFF en entrenamiento personal',
      urgent: false,
      date: '2024-09-13'
    }
  ]);

  const nextClass = {
    name: 'Yoga Flow',
    instructor: 'Carlos Mendoza',
    time: '7:30 AM',
    date: 'Mañana',
    location: 'Scandinavia Centro',
    canCancel: true
  };

  const progressData = {
    lastCheckIn: 'Hace 2 días',
    imcTrend: '+0.2',
    lastWorkouts: [
      { name: 'HIIT Intenso', date: 'Hace 2 días', duration: '45 min' },
      { name: 'Pilates Mat', date: 'Hace 4 días', duration: '50 min' },
      { name: 'Spinning', date: 'Hace 6 días', duration: '45 min' },
      { name: 'CrossFit', date: 'Hace 1 semana', duration: '60 min' }
    ]
  };

  const activePromos = [
    {
      title: 'Entrenamiento Personal',
      description: '20% OFF en tu primera sesión',
      discount: '20%',
      validUntil: '30 Sept',
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: 'Pack Familiar',
      description: '3x2 en membresías familiares',
      discount: '33%',
      validUntil: '15 Oct',
      icon: <Users className="w-6 h-6" />
    }
  ];

  const stats = [
    {
      label: 'Días activos este mes',
      value: '18',
      icon: <Activity className="w-5 h-5" />,
      trend: '+3 vs mes anterior'
    },
    {
      label: 'Clases completadas',
      value: '24',
      icon: <CheckCircle className="w-5 h-5" />,
      trend: '+8 vs mes anterior'
    },
    {
      label: 'Calorías quemadas',
      value: '12,450',
      icon: <Target className="w-5 h-5" />,
      trend: '+1,200 vs mes anterior'
    },
    {
      label: 'Puntos de fidelidad',
      value: '1,250',
      icon: <Star className="w-5 h-5" />,
      trend: 'Nivel Plata'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              ¡Hola, María! 👋
            </h1>
            <p className="text-gray-300 text-base sm:text-lg">
              ¿Lista para tu entrenamiento de hoy?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-left sm:text-right">
              <p className="text-white font-semibold text-sm sm:text-base">Membresía Premium</p>
              <p className="text-gray-400 text-xs sm:text-sm">Vence: 30 Sept 2024</p>
            </div>
            <button className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors text-sm sm:text-base w-full sm:w-auto" style={{backgroundColor: '#b5fc00', color: 'black'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
              Renovar
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-5 h-5" style={{color: '#b5fc00'}} />
            <h3 className="text-white font-semibold">Notificaciones</h3>
          </div>
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div key={notification.id} className={`flex items-start gap-3 p-3 rounded-lg ${
                notification.urgent ? 'bg-red-900/20 border border-red-600/30' : 'bg-gray-700/50'
              }`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  notification.urgent ? 'bg-red-400' : 'bg-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-white text-sm">{notification.message}</p>
                  <p className="text-gray-400 text-xs mt-1">{notification.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Next Class */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5" style={{color: '#b5fc00'}} />
            <h3 className="text-white font-semibold text-sm sm:text-base">Próxima Clase</h3>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="text-white font-medium text-base sm:text-lg">{nextClass.name}</h4>
              <p className="text-gray-300 text-sm sm:text-base">con {nextClass.instructor}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{nextClass.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{nextClass.location}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                Ver Detalles
              </button>
              {nextClass.canCancel && (
                <button className="px-3 sm:px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Snapshot */}
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5" style={{color: '#b5fc00'}} />
            <h3 className="text-white font-semibold text-sm sm:text-base">Mi Progreso</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm sm:text-base">Último check-in:</span>
              <span className="text-white font-medium text-sm sm:text-base">{progressData.lastCheckIn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm sm:text-base">Tendencia IMC:</span>
              <span className="text-green-400 font-medium text-sm sm:text-base">{progressData.imcTrend}</span>
            </div>
            <div className="pt-2">
              <p className="text-gray-300 text-xs sm:text-sm mb-2">Últimos entrenamientos:</p>
              <div className="space-y-1">
                {progressData.lastWorkouts.slice(0, 2).map((workout, index) => (
                  <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-white truncate pr-2">{workout.name}</span>
                    <span className="text-gray-400 flex-shrink-0">{workout.date}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full text-center text-xs sm:text-sm py-2 text-gray-300 hover:text-white transition-colors">
              Ver progreso completo →
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <div style={{color: '#b5fc00'}}>
                {stat.icon}
              </div>
              <span className="text-white font-semibold text-base sm:text-lg">{stat.value}</span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm mb-1">{stat.label}</p>
            <p className="text-gray-400 text-xs">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Active Promos */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Gift className="w-5 h-5" style={{color: '#b5fc00'}} />
          <h3 className="text-white font-semibold text-sm sm:text-base">Promociones Activas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {activePromos.map((promo, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{backgroundColor: 'rgba(181, 252, 0, 0.1)'}}>
                    <div style={{color: '#b5fc00'}}>
                      {promo.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm sm:text-base">{promo.title}</h4>
                    <p className="text-gray-300 text-xs sm:text-sm">{promo.description}</p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-bold" style={{color: '#b5fc00'}}>
                  -{promo.discount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">Válido hasta: {promo.validUntil}</span>
                <button className="text-xs sm:text-sm font-medium" style={{color: '#b5fc00'}}>
                  Aprovechar →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <button className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-700 transition-colors text-left">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{color: '#b5fc00'}} />
          <p className="text-white font-medium text-sm sm:text-base">Reservar Clase</p>
          <p className="text-gray-400 text-xs sm:text-sm">Ver horarios</p>
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-700 transition-colors text-left">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{color: '#b5fc00'}} />
          <p className="text-white font-medium text-sm sm:text-base">Entrenador</p>
          <p className="text-gray-400 text-xs sm:text-sm">Sesión personal</p>
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-700 transition-colors text-left">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{color: '#b5fc00'}} />
          <p className="text-white font-medium text-sm sm:text-base">Mi Progreso</p>
          <p className="text-gray-400 text-xs sm:text-sm">Ver métricas</p>
        </button>
        <button className="bg-gray-800 hover:bg-gray-700 rounded-xl p-3 sm:p-4 border border-gray-700 transition-colors text-left">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 mb-2" style={{color: '#b5fc00'}} />
          <p className="text-white font-medium text-sm sm:text-base">Favoritos</p>
          <p className="text-gray-400 text-xs sm:text-sm">Mis clases</p>
        </button>
      </div>
    </div>
  );
};

export default DashboardOverview;
