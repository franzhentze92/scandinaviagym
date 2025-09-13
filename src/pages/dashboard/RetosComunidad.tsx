import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Target, 
  Award, 
  Calendar, 
  Clock, 
  Star,
  Share2,
  Download,
  Plus,
  Minus,
  CheckCircle,
  X,
  Heart,
  MessageCircle,
  TrendingUp,
  Zap,
  Flame,
  Activity,
  Dumbbell,
  Crown,
  Medal,
  Gift,
  Bell,
  Eye,
  EyeOff,
  Filter,
  Search
} from 'lucide-react';

const RetosComunidad: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('activos');
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);

  const activeChallenges = [
    {
      id: 1,
      title: '30 Clases en 30 Días',
      description: 'Completa una clase cada día durante 30 días consecutivos',
      type: 'streak',
      icon: Zap,
      color: '#ff6b6b',
      participants: 245,
      duration: '30 días',
      reward: 'Badge Especial + 1 mes gratis',
      progress: 15,
      total: 30,
      startDate: '2024-08-01',
      endDate: '2024-08-30',
      difficulty: 'Alta',
      category: 'Consistencia'
    },
    {
      id: 2,
      title: 'Quema 10,000 Calorías',
      description: 'Quema 10,000 calorías en entrenamientos este mes',
      type: 'calories',
      icon: Flame,
      color: '#ffa726',
      participants: 189,
      duration: '1 mes',
      reward: 'Camiseta exclusiva + 2 semanas gratis',
      progress: 6500,
      total: 10000,
      startDate: '2024-08-01',
      endDate: '2024-08-31',
      difficulty: 'Media',
      category: 'Cardio'
    },
    {
      id: 3,
      title: 'Desafío de Fuerza',
      description: 'Aumenta tu peso máximo en press de banca en 20kg',
      type: 'strength',
      icon: Dumbbell,
      color: '#42a5f5',
      participants: 156,
      duration: '2 meses',
      reward: 'Sesión personalizada + suplementos',
      progress: 8,
      total: 20,
      startDate: '2024-07-15',
      endDate: '2024-09-15',
      difficulty: 'Alta',
      category: 'Fuerza'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'María González', points: 2840, avatar: '/api/placeholder/40/40', badge: 'Crown' },
    { rank: 2, name: 'Carlos Ruiz', points: 2650, avatar: '/api/placeholder/40/40', badge: 'Medal' },
    { rank: 3, name: 'Ana Martínez', points: 2420, avatar: '/api/placeholder/40/40', badge: 'Award' },
    { rank: 4, name: 'Luis Herrera', points: 2180, avatar: '/api/placeholder/40/40', badge: null },
    { rank: 5, name: 'Sofia López', points: 1950, avatar: '/api/placeholder/40/40', badge: null },
    { rank: 6, name: 'Roberto Díaz', points: 1820, avatar: '/api/placeholder/40/40', badge: null },
    { rank: 7, name: 'Elena Vega', points: 1680, avatar: '/api/placeholder/40/40', badge: null },
    { rank: 8, name: 'Diego Morales', points: 1540, avatar: '/api/placeholder/40/40', badge: null }
  ];

  const myAchievements = [
    { id: 1, name: 'Primera Semana', icon: Calendar, earned: true, date: '2024-08-10', points: 100 },
    { id: 2, name: '5 Clases Seguidas', icon: Zap, earned: true, date: '2024-08-08', points: 150 },
    { id: 3, name: 'Quemador de Calorías', icon: Flame, earned: true, date: '2024-08-05', points: 200 },
    { id: 4, name: 'Maestro del Peso', icon: Dumbbell, earned: false, progress: 75, points: 300 },
    { id: 5, name: 'Social Butterfly', icon: Users, earned: false, progress: 40, points: 250 }
  ];

  const communityPosts = [
    {
      id: 1,
      user: 'María González',
      avatar: '/api/placeholder/40/40',
      content: '¡Completé mi primera semana del reto de 30 días! 💪',
      likes: 24,
      comments: 8,
      time: '2 horas',
      image: '/api/placeholder/300/200'
    },
    {
      id: 2,
      user: 'Carlos Ruiz',
      avatar: '/api/placeholder/40/40',
      content: 'Consejo: La consistencia es clave. Pequeños pasos cada día llevan a grandes resultados.',
      likes: 18,
      comments: 12,
      time: '4 horas',
      image: null
    },
    {
      id: 3,
      user: 'Ana Martínez',
      avatar: '/api/placeholder/40/40',
      content: '¡Nuevo PR en press de banca! 85kg 🏋️‍♀️',
      likes: 32,
      comments: 15,
      time: '6 horas',
      image: '/api/placeholder/300/200'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Alta': return 'text-red-400 bg-red-900/20';
      case 'Media': return 'text-yellow-400 bg-yellow-900/20';
      case 'Baja': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Crown': return Crown;
      case 'Medal': return Medal;
      case 'Award': return Award;
      default: return Trophy;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Retos & Comunidad</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Participa en desafíos y conecta con la comunidad</p>
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

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex gap-2 mb-6">
          {['activos', 'ranking', 'logros', 'comunidad'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === tab
                  ? 'text-black'
                  : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
              }`}
              style={selectedTab === tab ? {backgroundColor: '#b5fc00'} : {}}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Active Challenges */}
        {selectedTab === 'activos' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Retos Activos</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeChallenges.map(challenge => {
                const Icon = challenge.icon;
                const progressPercentage = (challenge.progress / challenge.total) * 100;
                
                return (
                  <div key={challenge.id} className="bg-gray-700 rounded-xl p-6 border border-gray-600">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{backgroundColor: challenge.color + '20'}}>
                          <Icon className="w-6 h-6" style={{color: challenge.color}} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold">{challenge.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-gray-300 text-sm mb-4">{challenge.description}</p>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progreso</span>
                        <span>{challenge.progress}/{challenge.total}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all"
                          style={{backgroundColor: challenge.color, width: `${progressPercentage}%`}}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{challenge.participants} participantes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{challenge.duration}</span>
                      </div>
                    </div>

                    <div className="bg-gray-600 rounded-lg p-3 mb-4">
                      <p className="text-yellow-400 text-sm font-medium mb-1">Recompensa:</p>
                      <p className="text-white text-sm">{challenge.reward}</p>
                    </div>

                    <button className="w-full py-2 px-4 rounded-lg font-medium transition-colors text-black" style={{backgroundColor: '#b5fc00'}}>
                      Participar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        {selectedTab === 'ranking' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Ranking de Puntos</h3>
            <div className="bg-gray-700 rounded-xl p-6">
              <div className="space-y-3">
                {leaderboard.map((user, index) => {
                  const BadgeIcon = user.badge ? getBadgeIcon(user.badge) : null;
                  
                  return (
                    <div key={user.rank} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white w-8">#{user.rank}</span>
                          {BadgeIcon && (
                            <BadgeIcon className="w-6 h-6 text-yellow-400" />
                          )}
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-white font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name}</p>
                          <p className="text-gray-400 text-sm">{user.points} puntos</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-white transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Achievements */}
        {selectedTab === 'logros' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Mis Logros</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myAchievements.map(achievement => (
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
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{achievement.points} puntos</span>
                    {achievement.earned && (
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>¡Completado!</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community */}
        {selectedTab === 'comunidad' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Comunidad</h3>
              <button className="px-4 py-2 rounded-lg font-medium transition-colors text-black flex items-center gap-2" style={{backgroundColor: '#b5fc00'}}>
                <Plus className="w-4 h-4" />
                Nueva Publicación
              </button>
            </div>
            
            <div className="space-y-4">
              {communityPosts.map(post => (
                <div key={post.id} className="bg-gray-700 rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                      <span className="text-white font-medium">{post.user.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-white font-medium">{post.user}</h4>
                        <span className="text-gray-400 text-sm">{post.time}</span>
                      </div>
                      <p className="text-gray-300 mb-3">{post.content}</p>
                      {post.image && (
                        <div className="w-full h-48 bg-gray-600 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-gray-400">Imagen</span>
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors">
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span>Compartir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Crear Reto</span>
            </div>
            <p className="text-gray-400 text-sm">Propón un nuevo desafío</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Invitar Amigos</span>
            </div>
            <p className="text-gray-400 text-sm">Comparte con tu red</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Notificaciones</span>
            </div>
            <p className="text-gray-400 text-sm">Configurar recordatorios</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetosComunidad;