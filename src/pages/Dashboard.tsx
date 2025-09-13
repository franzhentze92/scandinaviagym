import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  Users, 
  TrendingUp, 
  Trophy, 
  HelpCircle, 
  Settings,
  Menu,
  X,
  Bell,
  QrCode,
  LogOut,
  CheckCircle,
  AlertTriangle,
  Info,
  Download,
  Share2,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

// Import dashboard pages (we'll create these)
import DashboardOverview from './dashboard/DashboardOverview';
import MiMembresia from './dashboard/MiMembresia';
import ClasesReservas from './dashboard/ClasesReservas';
import Entrenadores from './dashboard/Entrenadores';
import MiProgreso from './dashboard/MiProgreso';
import RetosComunidad from './dashboard/RetosComunidad';
import SoporteContacto from './dashboard/SoporteContacto';
import MiPerfil from './dashboard/MiPerfil';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useScrollToTop();

  const menuItems = [
    {
      id: 'overview',
      name: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      path: '/dashboard',
      description: 'Resumen general'
    },
    {
      id: 'membership',
      name: 'Mi Membresía',
      icon: <User className="w-5 h-5" />,
      path: '/dashboard/membresia',
      description: 'Plan y pagos'
    },
    {
      id: 'classes',
      name: 'Clases & Reservas',
      icon: <Calendar className="w-5 h-5" />,
      path: '/dashboard/clases',
      description: 'Horarios y reservas'
    },
    {
      id: 'trainers',
      name: 'Entrenadores',
      icon: <Users className="w-5 h-5" />,
      path: '/dashboard/entrenadores',
      description: 'Entrenamiento personal'
    },
    {
      id: 'progress',
      name: 'Mi Progreso',
      icon: <TrendingUp className="w-5 h-5" />,
      path: '/dashboard/progreso',
      description: 'Métricas y evolución'
    },
    {
      id: 'challenges',
      name: 'Retos & Comunidad',
      icon: <Trophy className="w-5 h-5" />,
      path: '/dashboard/retos',
      description: 'Desafíos y rankings'
    },
    {
      id: 'support',
      name: 'Soporte',
      icon: <HelpCircle className="w-5 h-5" />,
      path: '/dashboard/soporte',
      description: 'Ayuda y contacto'
    },
    {
      id: 'profile',
      name: 'Mi Perfil',
      icon: <Settings className="w-5 h-5" />,
      path: '/dashboard/perfil',
      description: 'Configuración personal'
    }
  ];

  const handleLogout = () => {
    // Implement logout logic
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Clase reservada exitosamente',
      message: 'Tu clase de Spinning a las 7:00 AM ha sido confirmada',
      time: 'Hace 5 minutos',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Recordatorio de pago',
      message: 'Tu membresía vence en 3 días. Renueva ahora para evitar interrupciones',
      time: 'Hace 1 hora',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Nuevo reto disponible',
      message: '¡Únete al reto "30 clases en 30 días" y gana premios increíbles!',
      time: 'Hace 2 horas',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Logro desbloqueado',
      message: '¡Felicitaciones! Has completado 10 clases consecutivas',
      time: 'Ayer',
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info': return <Info className="w-5 h-5 text-blue-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const copyQRCode = () => {
    navigator.clipboard.writeText('SCANDINAVIA-MEMBER-12345');
    // You could show a toast notification here
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="lg:hidden bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-white font-bold text-lg">Scandinavia</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-gray-300 hover:text-white relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-semibold">Notificaciones</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-gray-750' : ''}`}>
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                          <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                          <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-700">
                  <button className="w-full text-center text-gray-300 hover:text-white text-sm">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setShowQRCode(!showQRCode)}
            className="p-2 text-gray-300 hover:text-white"
          >
            <QrCode className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#b5fc00'}}>
                  <span className="text-black font-bold text-sm">S</span>
                </div>
                <span className="text-white font-bold text-lg">Scandinavia</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <p className="text-white font-medium">María González</p>
                  <p className="text-gray-400 text-sm">Premium Member</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    isActive(item.path)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <div className={`flex-shrink-0 ${
                    isActive(item.path) ? 'text-white' : 'text-gray-400'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 truncate">{item.description}</p>
                  </div>
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className="px-4 py-4 border-t border-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-gray-900 border-b border-gray-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
                </h1>
                <p className="text-gray-400 text-sm">
                  {menuItems.find(item => isActive(item.path))?.description || 'Resumen general'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 text-gray-300 hover:text-white transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </button>
                  
                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold">Notificaciones</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notification => (
                          <div key={notification.id} className={`p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-gray-750' : ''}`}>
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                                <p className="text-gray-300 text-xs mt-1">{notification.message}</p>
                                <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-400 rounded-full mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-700">
                        <button className="w-full text-center text-gray-300 hover:text-white text-sm">
                          Ver todas las notificaciones
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-300" />
                  </button>
                  
                  {/* Profile Menu Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        <button 
                          onClick={() => {
                            navigate('/dashboard/perfil');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Mi Perfil
                        </button>
                        <button 
                          onClick={() => {
                            navigate('/dashboard/membresia');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Mi Membresía
                        </button>
                        <button 
                          onClick={() => {
                            navigate('/dashboard/soporte');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Soporte
                        </button>
                        <hr className="my-2 border-gray-700" />
                        <button 
                          onClick={() => {
                            handleLogout();
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/membresia" element={<MiMembresia />} />
              <Route path="/clases" element={<ClasesReservas />} />
              <Route path="/entrenadores" element={<Entrenadores />} />
              <Route path="/progreso" element={<MiProgreso />} />
              <Route path="/retos" element={<RetosComunidad />} />
              <Route path="/soporte" element={<SoporteContacto />} />
              <Route path="/perfil" element={<MiPerfil />} />
            </Routes>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl p-6 max-w-sm w-full border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Mi Código QR</h3>
              <button 
                onClick={() => setShowQRCode(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-40 h-40 bg-gray-200 rounded flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-600" />
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">
                Muestra este código en la recepción para acceso rápido
              </p>
              
              <div className="bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-gray-400 text-xs mb-1">ID de Miembro</p>
                <p className="text-white font-mono text-sm">SCANDINAVIA-MEMBER-12345</p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={copyQRCode}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar ID
                </button>
                <button className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
