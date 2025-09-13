import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Activity, 
  BarChart3,
  Scale,
  Ruler,
  Heart,
  Zap,
  Clock,
  Trophy,
  Star,
  Upload,
  Download,
  Share2,
  Plus,
  Minus,
  CheckCircle,
  X,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Smartphone,
  Watch,
  Dumbbell,
  Users,
  Flame,
  Droplets
} from 'lucide-react';

const MiProgreso: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('mes');
  const [showAddMetric, setShowAddMetric] = useState(false);

  const metrics = {
    weight: { current: 75.2, previous: 76.8, unit: 'kg', trend: 'down' },
    bodyFat: { current: 18.5, previous: 20.2, unit: '%', trend: 'down' },
    muscle: { current: 42.1, previous: 41.8, unit: 'kg', trend: 'up' },
    bmi: { current: 23.4, previous: 24.1, unit: '', trend: 'down' }
  };

  const measurements = [
    { name: 'Cintura', current: 82, previous: 85, unit: 'cm', date: '2024-08-15' },
    { name: 'Pecho', current: 98, previous: 96, unit: 'cm', date: '2024-08-15' },
    { name: 'Brazo', current: 32, previous: 31, unit: 'cm', date: '2024-08-15' },
    { name: 'Muslo', current: 58, previous: 57, unit: 'cm', date: '2024-08-15' }
  ];

  const achievements = [
    { id: 1, name: '10 entrenos seguidos', icon: Trophy, earned: true, date: '2024-08-10' },
    { id: 2, name: '1 mes completo', icon: Calendar, earned: true, date: '2024-08-01' },
    { id: 3, name: 'Primera clase de spinning', icon: Zap, earned: true, date: '2024-07-15' },
    { id: 4, name: '50 clases completadas', icon: Target, earned: false, progress: 35 },
    { id: 5, name: 'Perder 5kg', icon: Scale, earned: false, progress: 60 }
  ];

  const workoutHistory = [
    { date: '2024-08-15', type: 'Pesas', duration: 60, calories: 450, intensity: 'Alta' },
    { date: '2024-08-14', type: 'Spinning', duration: 45, calories: 380, intensity: 'Alta' },
    { date: '2024-08-13', type: 'Yoga', duration: 60, calories: 200, intensity: 'Baja' },
    { date: '2024-08-12', type: 'Cross Training', duration: 50, calories: 420, intensity: 'Alta' },
    { date: '2024-08-11', type: 'Pesas', duration: 45, calories: 320, intensity: 'Media' }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? TrendingUp : TrendingUp;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-400' : 'text-red-400';
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Alta': return 'text-red-400 bg-red-900/20';
      case 'Media': return 'text-yellow-400 bg-yellow-900/20';
      case 'Baja': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Mi Progreso</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Rastrea tu evolución y logros</p>
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

      {/* Period Selector */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Resumen de Progreso</h3>
          <div className="flex gap-2">
            {['semana', 'mes', 'año'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'text-black'
                    : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                }`}
                style={selectedPeriod === period ? {backgroundColor: '#b5fc00'} : {}}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(metrics).map(([key, metric]) => (
            <div key={key} className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {key === 'weight' && <Scale className="w-5 h-5" style={{color: '#b5fc00'}} />}
                  {key === 'bodyFat' && <Droplets className="w-5 h-5" style={{color: '#b5fc00'}} />}
                  {key === 'muscle' && <Dumbbell className="w-5 h-5" style={{color: '#b5fc00'}} />}
                  {key === 'bmi' && <Activity className="w-5 h-5" style={{color: '#b5fc00'}} />}
                  <span className="text-gray-300 text-sm capitalize">{key === 'bodyFat' ? 'Grasa' : key === 'bmi' ? 'IMC' : key}</span>
                </div>
                <div className={`flex items-center gap-1 ${getTrendColor(metric.trend)}`}>
                  {React.createElement(getTrendIcon(metric.trend), { className: "w-4 h-4" })}
                  <span className="text-xs">
                    {metric.trend === 'up' ? '+' : '-'}{Math.abs(metric.current - metric.previous).toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">
                {metric.current}{metric.unit}
              </div>
              <div className="text-gray-400 text-sm">
                Anterior: {metric.previous}{metric.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Measurements */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Medidas Corporales</h3>
          <button 
            onClick={() => setShowAddMetric(true)}
            className="px-4 py-2 rounded-lg font-medium transition-colors text-black flex items-center gap-2"
            style={{backgroundColor: '#b5fc00'}}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {measurements.map((measurement, index) => (
            <div key={index} className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300 text-sm">{measurement.name}</span>
                <div className="flex items-center gap-1">
                  {measurement.current > measurement.previous ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
                  )}
                </div>
              </div>
              <div className="text-xl font-bold text-white">
                {measurement.current}{measurement.unit}
              </div>
              <div className="text-gray-400 text-sm">
                Anterior: {measurement.previous}{measurement.unit}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Logros y Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <div key={achievement.id} className={`rounded-xl p-4 border-2 ${
              achievement.earned 
                ? 'border-gray-600 bg-gray-700' 
                : 'border-gray-700 bg-gray-800'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.earned ? 'bg-yellow-900/20' : 'bg-gray-700'
                }`}>
                  <achievement.icon className={`w-5 h-5 ${
                    achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h4 className="text-white font-medium">{achievement.name}</h4>
                  {achievement.earned && (
                    <p className="text-gray-400 text-sm">Completado {achievement.date}</p>
                  )}
                </div>
              </div>
              
              {!achievement.earned && achievement.progress && (
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-400 mb-1">
                    <span>Progreso</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{backgroundColor: '#b5fc00', width: `${achievement.progress}%`}}
                    ></div>
                  </div>
                </div>
              )}
              
              {achievement.earned && (
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <span>¡Logro desbloqueado!</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Workout History */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Historial de Entrenos</h3>
        <div className="space-y-3">
          {workoutHistory.map((workout, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <p className="text-white font-medium">{workout.type}</p>
                  <p className="text-gray-400 text-sm">{workout.date} • {workout.duration} min</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-white font-medium">{workout.calories} cal</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(workout.intensity)}`}>
                    {workout.intensity}
                  </span>
                </div>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Upload className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Subir Medidas</span>
            </div>
            <p className="text-gray-400 text-sm">Actualizar medidas corporales</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Conectar Dispositivo</span>
            </div>
            <p className="text-gray-400 text-sm">Sincronizar con wearables</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Establecer Meta</span>
            </div>
            <p className="text-gray-400 text-sm">Definir objetivos personales</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiProgreso;