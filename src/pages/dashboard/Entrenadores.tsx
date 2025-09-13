import React, { useState } from 'react';
import { 
  User, 
  Star, 
  Calendar, 
  MapPin, 
  Clock, 
  Award, 
  MessageCircle,
  Search,
  Filter,
  Heart,
  Bookmark,
  BookmarkCheck,
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
  ChevronLeft,
  ChevronRight,
  Users,
  Trophy,
  TrendingUp,
  Activity,
  Timer,
  DollarSign,
  Package,
  Eye,
  EyeOff
} from 'lucide-react';

const Entrenadores: React.FC = () => {
  const [selectedSede, setSelectedSede] = useState('todas');
  const [selectedSpecialty, setSelectedSpecialty] = useState('todas');
  const [favorites, setFavorites] = useState<number[]>([1, 3]);
  const [bookings, setBookings] = useState<number[]>([2]);
  const [selectedTrainer, setSelectedTrainer] = useState<number | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const sedes = [
    { id: 'todas', name: 'Todas las sedes' },
    { id: 'zona10', name: 'Zona 10' },
    { id: 'zona15', name: 'Zona 15' },
    { id: 'carretera', name: 'Carretera a El Salvador' },
    { id: 'pradera', name: 'Pradera Concepción' }
  ];

  const specialties = [
    { id: 'todas', name: 'Todas', icon: Dumbbell, color: '#b5fc00' },
    { id: 'pesas', name: 'Pesas', icon: Dumbbell, color: '#ef5350' },
    { id: 'funcional', name: 'Funcional', icon: Target, color: '#ab47bc' },
    { id: 'cardio', name: 'Cardio', icon: Activity, color: '#ff6b6b' },
    { id: 'yoga', name: 'Yoga', icon: TreePine, color: '#66bb6a' },
    { id: 'pilates', name: 'Pilates', icon: Waves, color: '#42a5f5' },
    { id: 'crossfit', name: 'CrossFit', icon: Flame, color: '#ffa726' },
    { id: 'rehabilitacion', name: 'Rehabilitación', icon: Award, color: '#26c6da' }
  ];

  const trainers = [
    {
      id: 1,
      name: 'María González',
      specialty: 'pesas',
      sede: 'Zona 10',
      rating: 4.9,
      reviews: 127,
      experience: '8 años',
      certifications: ['NSCA-CPT', 'ACSM', 'FMS'],
      bio: 'Especialista en entrenamiento de fuerza y acondicionamiento físico. Ayudo a mis clientes a alcanzar sus objetivos de manera segura y efectiva.',
      price: 150,
      currency: 'Q',
      sessions: 'por sesión',
      availability: 'Lunes a Viernes 6:00-20:00',
      image: '/api/placeholder/300/300',
      languages: ['Español', 'Inglés'],
      achievements: ['Entrenador del Año 2023', '100+ clientes transformados'],
      specialties: ['Pesas', 'Funcional', 'Rehabilitación']
    },
    {
      id: 2,
      name: 'Carlos Ruiz',
      specialty: 'funcional',
      sede: 'Zona 15',
      rating: 4.8,
      reviews: 89,
      experience: '6 años',
      certifications: ['NASM-CPT', 'FMS', 'TRX'],
      bio: 'Entrenador funcional especializado en movimientos naturales y prevención de lesiones. Mi enfoque es mejorar la calidad de vida de mis clientes.',
      price: 140,
      currency: 'Q',
      sessions: 'por sesión',
      availability: 'Martes a Sábado 7:00-19:00',
      image: '/api/placeholder/300/300',
      languages: ['Español'],
      achievements: ['Especialista en Movimiento Funcional', '50+ atletas entrenados'],
      specialties: ['Funcional', 'Pesas', 'Cardio']
    },
    {
      id: 3,
      name: 'Ana Martínez',
      specialty: 'yoga',
      sede: 'Carretera a El Salvador',
      rating: 4.9,
      reviews: 156,
      experience: '10 años',
      certifications: ['RYT-500', 'Yin Yoga', 'Prenatal Yoga'],
      bio: 'Instructora de yoga certificada con más de 10 años de experiencia. Especializada en yoga terapéutico y mindfulness.',
      price: 120,
      currency: 'Q',
      sessions: 'por sesión',
      availability: 'Lunes a Domingo 6:00-21:00',
      image: '/api/placeholder/300/300',
      languages: ['Español', 'Inglés'],
      achievements: ['Instructora Certificada RYT-500', '200+ horas de enseñanza'],
      specialties: ['Yoga', 'Pilates', 'Meditación']
    },
    {
      id: 4,
      name: 'Luis Herrera',
      specialty: 'crossfit',
      sede: 'Pradera Concepción',
      rating: 4.7,
      reviews: 98,
      experience: '5 años',
      certifications: ['CrossFit L2', 'Olympic Lifting', 'Gymnastics'],
      bio: 'Entrenador de CrossFit certificado con experiencia en levantamiento olímpico y gimnasia. Ayudo a atletas de todos los niveles.',
      price: 160,
      currency: 'Q',
      sessions: 'por sesión',
      availability: 'Lunes a Viernes 5:00-22:00',
      image: '/api/placeholder/300/300',
      languages: ['Español'],
      achievements: ['CrossFit Level 2', 'Competidor Regional'],
      specialties: ['CrossFit', 'Pesas', 'Funcional']
    },
    {
      id: 5,
      name: 'Sofia López',
      specialty: 'rehabilitacion',
      sede: 'Zona 10',
      rating: 4.9,
      reviews: 203,
      experience: '12 años',
      certifications: ['DPT', 'CSCS', 'FMS'],
      bio: 'Fisioterapeuta y entrenadora personal especializada en rehabilitación y prevención de lesiones. Enfoque integral del movimiento.',
      price: 180,
      currency: 'Q',
      sessions: 'por sesión',
      availability: 'Lunes a Viernes 8:00-18:00',
      image: '/api/placeholder/300/300',
      languages: ['Español', 'Inglés'],
      achievements: ['Doctora en Fisioterapia', 'Especialista en Lesiones Deportivas'],
      specialties: ['Rehabilitación', 'Funcional', 'Pesas']
    },
    {
      id: 6,
      name: 'Roberto Díaz',
      specialty: 'cardio',
      sede: 'Zona 15',
      rating: 4.6,
      reviews: 76,
      experience: '4 años',
      certifications: ['ACSM-CPT', 'Spinning', 'HIIT'],
      bio: 'Especialista en entrenamiento cardiovascular y de alta intensidad. Ayudo a mis clientes a mejorar su resistencia y condición física.',
      price: 130,
      currency: 'Q',
      sessions: 'por sesión',
      availability: 'Lunes a Sábado 6:00-20:00',
      image: '/api/placeholder/300/300',
      languages: ['Español'],
      achievements: ['Instructor de Spinning Certificado', 'Maratonista'],
      specialties: ['Cardio', 'HIIT', 'Spinning']
    }
  ];

  const packages = [
    {
      id: 1,
      name: 'Paquete Básico',
      sessions: 4,
      price: 520,
      currency: 'Q',
      discount: '13%',
      description: 'Perfecto para comenzar tu transformación'
    },
    {
      id: 2,
      name: 'Paquete Estándar',
      sessions: 8,
      price: 960,
      currency: 'Q',
      discount: '20%',
      description: 'Ideal para resultados consistentes'
    },
    {
      id: 3,
      name: 'Paquete Premium',
      sessions: 12,
      price: 1320,
      currency: 'Q',
      discount: '25%',
      description: 'Para transformaciones completas'
    }
  ];

  const getSpecialtyIcon = (specialty: string) => {
    const spec = specialties.find(s => s.id === specialty);
    return spec ? spec.icon : Dumbbell;
  };

  const getSpecialtyColor = (specialty: string) => {
    const spec = specialties.find(s => s.id === specialty);
    return spec ? spec.color : '#b5fc00';
  };

  const filteredTrainers = trainers.filter(trainer => {
    const sedeMatch = selectedSede === 'todas' || trainer.sede.toLowerCase().includes(selectedSede);
    const specialtyMatch = selectedSpecialty === 'todas' || trainer.specialty === selectedSpecialty;
    return sedeMatch && specialtyMatch;
  });

  const toggleFavorite = (trainerId: number) => {
    setFavorites(prev => 
      prev.includes(trainerId) 
        ? prev.filter(id => id !== trainerId)
        : [...prev, trainerId]
    );
  };

  const toggleBooking = (trainerId: number) => {
    setBookings(prev => 
      prev.includes(trainerId) 
        ? prev.filter(id => id !== trainerId)
        : [...prev, trainerId]
    );
  };

  const isBooked = (trainerId: number) => bookings.includes(trainerId);
  const isFavorite = (trainerId: number) => favorites.includes(trainerId);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Entrenadores Personales</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Encuentra el entrenador perfecto para tus objetivos</p>
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

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Sede Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sede</label>
            <select 
              value={selectedSede}
              onChange={(e) => setSelectedSede(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              {sedes.map(sede => (
                <option key={sede.id} value={sede.id}>{sede.name}</option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Especialidad</label>
            <select 
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              {specialties.map(specialty => (
                <option key={specialty.id} value={specialty.id}>{specialty.name}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar entrenadores..."
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Specialty Buttons */}
        <div className="flex flex-wrap gap-2">
          {specialties.map(specialty => {
            const Icon = specialty.icon;
            return (
              <button
                key={specialty.id}
                onClick={() => setSelectedSpecialty(specialty.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedSpecialty === specialty.id
                    ? 'text-black'
                    : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                }`}
                style={selectedSpecialty === specialty.id ? {backgroundColor: specialty.color} : {}}
              >
                <Icon className="w-4 h-4" />
                {specialty.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTrainers.map(trainer => {
          const SpecialtyIcon = getSpecialtyIcon(trainer.specialty);
          const specialtyColor = getSpecialtyColor(trainer.specialty);
          const booked = isBooked(trainer.id);
          const favorite = isFavorite(trainer.id);

          return (
            <div key={trainer.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors">
              {/* Trainer Image */}
              <div className="relative h-64 bg-gradient-to-br from-gray-700 to-gray-800">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(trainer.id)}
                    className={`p-2 rounded-full transition-colors ${
                      favorite 
                        ? 'text-yellow-400 bg-yellow-900/20' 
                        : 'text-gray-400 bg-gray-900/50 hover:text-yellow-400'
                    }`}
                  >
                    {favorite ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  </button>
                </div>

                {/* Specialty Badge */}
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-900/50 rounded-full text-white text-sm">
                    <SpecialtyIcon className="w-3 h-3" style={{color: specialtyColor}} />
                    <span className="capitalize">{trainer.specialty}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-3">
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-900/50 rounded-full text-white text-sm">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{trainer.rating}</span>
                    <span className="text-gray-400">({trainer.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Trainer Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{trainer.name}</h3>
                    <p className="text-gray-400 text-sm">{trainer.experience} de experiencia</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">
                      {trainer.currency}{trainer.price}
                    </div>
                    <div className="text-gray-400 text-sm">{trainer.sessions}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{trainer.sede}</span>
                </div>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{trainer.bio}</p>

                {/* Certifications */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {trainer.certifications.slice(0, 3).map((cert, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      {cert}
                    </span>
                  ))}
                  {trainer.certifications.length > 3 && (
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                      +{trainer.certifications.length - 3}
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {booked ? (
                    <button
                      onClick={() => toggleBooking(trainer.id)}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedTrainer(trainer.id);
                        setShowBookingModal(true);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-black"
                      style={{backgroundColor: '#b5fc00'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Reservar
                    </button>
                  )}
                  
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* My Bookings */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Mis Reservas</h3>
        
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No tienes reservas con entrenadores</p>
            <p className="text-gray-500 text-sm">Reserva tu primera sesión arriba</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trainers.filter(t => bookings.includes(t.id)).map(trainer => (
              <div key={trainer.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-300" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{trainer.name}</p>
                    <p className="text-gray-400 text-sm">{trainer.sede} • {trainer.currency}{trainer.price}/sesión</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => toggleBooking(trainer.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Packages */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Paquetes de Entrenamiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-gray-700 rounded-xl p-6 border border-gray-600">
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-white mb-2">{pkg.name}</h4>
                <div className="text-3xl font-bold text-white mb-1">
                  {pkg.currency}{pkg.price}
                </div>
                <div className="text-gray-400 text-sm mb-2">{pkg.sessions} sesiones</div>
                <div className="inline-block px-2 py-1 bg-green-900/20 text-green-400 text-xs rounded-full">
                  Ahorra {pkg.discount}
                </div>
              </div>
              <p className="text-gray-300 text-sm text-center mb-4">{pkg.description}</p>
              <button className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors">
                Comprar Paquete
              </button>
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
              <Package className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Mis Paquetes</span>
            </div>
            <p className="text-gray-400 text-sm">Ver sesiones disponibles</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Historial</span>
            </div>
            <p className="text-gray-400 text-sm">Ver sesiones anteriores</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Heart className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Favoritos</span>
            </div>
            <p className="text-gray-400 text-sm">Ver entrenadores guardados</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Entrenadores;
