import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera,
  Edit,
  Save,
  X,
  Eye,
  EyeOff,
  Shield,
  Key,
  Bell,
  Settings,
  Download,
  Upload,
  Share2,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  Info,
  Lock,
  Unlock,
  Smartphone,
  CreditCard,
  Heart,
  Activity,
  Target,
  Award,
  Star,
  Trash2,
  Copy,
  ExternalLink,
  QrCode,
  Scan
} from 'lucide-react';

const MiPerfil: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const userProfile = {
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+502 5555-1234',
    birthDate: '1990-05-15',
    gender: 'Femenino',
    sede: 'Zona 10',
    memberSince: '2023-03-15',
    avatar: '/api/placeholder/150/150',
    emergencyContact: {
      name: 'Carlos González',
      phone: '+502 5555-5678',
      relationship: 'Esposo'
    },
    preferences: {
      notifications: {
        email: true,
        sms: false,
        push: true,
        marketing: false
      },
      privacy: {
        profileVisible: true,
        showProgress: true,
        showAchievements: true
      }
    }
  };

  const [profile, setProfile] = useState(userProfile);

  const tabs = [
    { id: 'personal', name: 'Personal', icon: User },
    { id: 'seguridad', name: 'Seguridad', icon: Shield },
    { id: 'preferencias', name: 'Preferencias', icon: Settings },
    { id: 'dispositivos', name: 'Dispositivos', icon: Smartphone }
  ];

  const achievements = [
    { id: 1, name: 'Miembro del Mes', icon: Star, earned: true, date: '2024-07-01' },
    { id: 2, name: '100 Clases Completadas', icon: Target, earned: true, date: '2024-06-15' },
    { id: 3, name: 'Consistencia Perfecta', icon: Award, earned: false, progress: 75 }
  ];

  const connectedDevices = [
    { id: 1, name: 'iPhone 14 Pro', type: 'mobile', lastSync: '2024-08-15 10:30', status: 'connected' },
    { id: 2, name: 'Apple Watch Series 8', type: 'wearable', lastSync: '2024-08-15 10:25', status: 'connected' },
    { id: 3, name: 'Garmin Forerunner 945', type: 'wearable', lastSync: '2024-08-14 18:45', status: 'disconnected' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('Profile saved:', profile);
  };

  const handleCancel = () => {
    setProfile(userProfile);
    setIsEditing(false);
  };

  const toggleNotification = (type: string) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        notifications: {
          ...profile.preferences.notifications,
          [type]: !profile.preferences.notifications[type]
        }
      }
    });
  };

  const togglePrivacy = (type: string) => {
    setProfile({
      ...profile,
      preferences: {
        ...profile.preferences,
        privacy: {
          ...profile.preferences.privacy,
          [type]: !profile.preferences.privacy[type]
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Mi Perfil</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Gestiona tu información personal y configuraciones</p>
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

      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center">
              <User className="w-12 h-12 text-gray-400" />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
              <Camera className="w-4 h-4 text-gray-300" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <p className="text-gray-400 mb-2">Miembro desde {new Date(profile.memberSince).toLocaleDateString('es-GT')}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{profile.sede}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300 text-sm">{profile.gender}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowQR(!showQR)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              QR Code
            </button>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-lg font-medium transition-colors text-black flex items-center gap-2"
                style={{backgroundColor: '#b5fc00'}}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}
              >
                <Edit className="w-4 h-4" />
                Editar
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 rounded-lg font-medium transition-colors text-black flex items-center gap-2"
                  style={{backgroundColor: '#b5fc00'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}
                >
                  <Save className="w-4 h-4" />
                  Guardar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedTab === tab.id
                    ? 'text-black'
                    : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                }`}
                style={selectedTab === tab.id ? {backgroundColor: '#b5fc00'} : {}}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Personal Information */}
        {selectedTab === 'personal' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setProfile({...profile, birthDate: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Género</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({...profile, gender: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                >
                  <option value="Femenino">Femenino</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Sede Principal</label>
                <select
                  value={profile.sede}
                  onChange={(e) => setProfile({...profile, sede: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:bg-gray-800 disabled:text-gray-400"
                >
                  <option value="Zona 10">Zona 10</option>
                  <option value="Zona 15">Zona 15</option>
                  <option value="Carretera a El Salvador">Carretera a El Salvador</option>
                  <option value="Pradera Concepción">Pradera Concepción</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">Contacto de Emergencia</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={profile.emergencyContact.name}
                    onChange={(e) => setProfile({
                      ...profile, 
                      emergencyContact: {...profile.emergencyContact, name: e.target.value}
                    })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 disabled:bg-gray-700 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={profile.emergencyContact.phone}
                    onChange={(e) => setProfile({
                      ...profile, 
                      emergencyContact: {...profile.emergencyContact, phone: e.target.value}
                    })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 disabled:bg-gray-700 disabled:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Relación</label>
                  <input
                    type="text"
                    value={profile.emergencyContact.relationship}
                    onChange={(e) => setProfile({
                      ...profile, 
                      emergencyContact: {...profile.emergencyContact, relationship: e.target.value}
                    })}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 disabled:bg-gray-700 disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">Logros Recientes</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map(achievement => (
                  <div key={achievement.id} className={`rounded-lg p-3 border ${
                    achievement.earned ? 'border-gray-600 bg-gray-600' : 'border-gray-700 bg-gray-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achievement.earned ? 'bg-yellow-900/20' : 'bg-gray-700'
                      }`}>
                        <achievement.icon className={`w-4 h-4 ${
                          achievement.earned ? 'text-yellow-400' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h5 className="text-white text-sm font-medium">{achievement.name}</h5>
                        {achievement.earned && (
                          <p className="text-gray-400 text-xs">{achievement.date}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        {selectedTab === 'seguridad' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Seguridad</h3>
            
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-medium">Contraseña</h4>
                    <p className="text-gray-400 text-sm">Última actualización: 15 de julio, 2024</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Cambiar
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-600 rounded-full">
                    <div className="h-2 bg-green-400 rounded-full" style={{width: '80%'}}></div>
                  </div>
                  <span className="text-green-400 text-sm font-medium">Fuerte</span>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-medium">Autenticación de Dos Factores</h4>
                    <p className="text-gray-400 text-sm">Agrega una capa extra de seguridad</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Activar
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <span className="text-red-400 text-sm">Desactivado</span>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-white font-medium">Sesiones Activas</h4>
                    <p className="text-gray-400 text-sm">Gestiona tus dispositivos conectados</p>
                  </div>
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Ver Todas
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-600 rounded">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">iPhone 14 Pro</span>
                    </div>
                    <span className="text-gray-400 text-sm">Activo ahora</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-600 rounded">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-gray-400" />
                      <span className="text-white text-sm">Chrome - Windows</span>
                    </div>
                    <span className="text-gray-400 text-sm">Hace 2 horas</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences */}
        {selectedTab === 'preferencias' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Preferencias</h3>
            
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Notificaciones</h4>
                <div className="space-y-3">
                  {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="text-white text-sm capitalize">{key}</span>
                        <p className="text-gray-400 text-xs">
                          {key === 'email' && 'Recibir notificaciones por correo'}
                          {key === 'sms' && 'Recibir notificaciones por SMS'}
                          {key === 'push' && 'Recibir notificaciones push'}
                          {key === 'marketing' && 'Recibir ofertas y promociones'}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification(key)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          value ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h4 className="text-white font-medium mb-4">Privacidad</h4>
                <div className="space-y-3">
                  {Object.entries(profile.preferences.privacy).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="text-white text-sm capitalize">
                          {key === 'profileVisible' && 'Perfil Visible'}
                          {key === 'showProgress' && 'Mostrar Progreso'}
                          {key === 'showAchievements' && 'Mostrar Logros'}
                        </span>
                        <p className="text-gray-400 text-xs">
                          {key === 'profileVisible' && 'Permitir que otros miembros vean tu perfil'}
                          {key === 'showProgress' && 'Compartir tu progreso con la comunidad'}
                          {key === 'showAchievements' && 'Mostrar tus logros públicamente'}
                        </p>
                      </div>
                      <button
                        onClick={() => togglePrivacy(key)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          value ? 'bg-green-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Devices */}
        {selectedTab === 'dispositivos' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Dispositivos Conectados</h3>
            
            <div className="space-y-4">
              {connectedDevices.map(device => (
                <div key={device.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center">
                        <Smartphone className="w-6 h-6 text-gray-300" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{device.name}</h4>
                        <p className="text-gray-400 text-sm">
                          {device.type} • Última sincronización: {device.lastSync}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        device.status === 'connected' ? 'bg-green-400' : 'bg-red-400'
                      }`}></div>
                      <span className={`text-sm ${
                        device.status === 'connected' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {device.status === 'connected' ? 'Conectado' : 'Desconectado'}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="text-white font-medium mb-4">Conectar Nuevo Dispositivo</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Smartphone className="w-5 h-5" style={{color: '#b5fc00'}} />
                    <span className="text-white font-medium">Apple Health</span>
                  </div>
                  <p className="text-gray-400 text-sm">Sincronizar con iPhone</p>
                </button>
                
                <button className="p-4 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5" style={{color: '#b5fc00'}} />
                    <span className="text-white font-medium">Google Fit</span>
                  </div>
                  <p className="text-gray-400 text-sm">Sincronizar con Android</p>
                </button>
                
                <button className="p-4 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="w-5 h-5" style={{color: '#b5fc00'}} />
                    <span className="text-white font-medium">Garmin</span>
                  </div>
                  <p className="text-gray-400 text-sm">Conectar reloj deportivo</p>
                </button>
              </div>
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
              <Download className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Descargar Datos</span>
            </div>
            <p className="text-gray-400 text-sm">Exportar toda tu información</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Trash2 className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Eliminar Cuenta</span>
            </div>
            <p className="text-gray-400 text-sm">Eliminar permanentemente</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Compartir Perfil</span>
            </div>
            <p className="text-gray-400 text-sm">Compartir con amigos</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiPerfil;