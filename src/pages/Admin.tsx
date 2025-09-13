import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  UserCheck, 
  DollarSign, 
  Wrench, 
  Building2, 
  Megaphone, 
  BarChart3, 
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
  EyeOff,
  Shield,
  User as UserIcon
} from 'lucide-react';

// Import admin pages (we'll create these)
import AdminOverview from './admin/AdminOverview';
import AdminMemberships from './admin/AdminMemberships';
import AdminClasses from './admin/AdminClasses';
import AdminStaff from './admin/AdminStaff';
import AdminFinances from './admin/AdminFinances';
import AdminMaintenance from './admin/AdminMaintenance';
import AdminSedes from './admin/AdminSedes';
import AdminCRM from './admin/AdminCRM';
import AdminReports from './admin/AdminReports';
import AdminSettings from './admin/AdminSettings';

const Admin: React.FC = () => {
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
      path: '/admin',
      description: 'Resumen operacional'
    },
    {
      id: 'memberships',
      name: 'Membresías & Clientes',
      icon: <Users className="w-5 h-5" />,
      path: '/admin/memberships',
      description: 'Gestión de miembros'
    },
    {
      id: 'classes',
      name: 'Clases & Reservas',
      icon: <Calendar className="w-5 h-5" />,
      path: '/admin/classes',
      description: 'Horarios y reservas'
    },
    {
      id: 'staff',
      name: 'Entrenadores & Staff',
      icon: <UserCheck className="w-5 h-5" />,
      path: '/admin/staff',
      description: 'Personal y horarios'
    },
    {
      id: 'finances',
      name: 'Finanzas',
      icon: <DollarSign className="w-5 h-5" />,
      path: '/admin/finances',
      description: 'Ingresos y pagos'
    },
    {
      id: 'maintenance',
      name: 'Mantenimiento',
      icon: <Wrench className="w-5 h-5" />,
      path: '/admin/maintenance',
      description: 'Equipos e inventario'
    },
    {
      id: 'sedes',
      name: 'Sedes',
      icon: <Building2 className="w-5 h-5" />,
      path: '/admin/sedes',
      description: 'Gestión de sucursales'
    },
    {
      id: 'crm',
      name: 'CRM & Marketing',
      icon: <Megaphone className="w-5 h-5" />,
      path: '/admin/crm',
      description: 'Leads y campañas'
    },
    {
      id: 'reports',
      name: 'Reportes',
      icon: <BarChart3 className="w-5 h-5" />,
      path: '/admin/reports',
      description: 'Análisis ejecutivo'
    },
    {
      id: 'settings',
      name: 'Configuración',
      icon: <Settings className="w-5 h-5" />,
      path: '/admin/settings',
      description: 'Sistema y permisos'
    }
  ];

  const handleLogout = () => {
    // Implement logout logic
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Sample admin notifications
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Pago fallido - María González',
      message: 'El pago de la membresía Premium falló. Contactar al cliente.',
      time: 'Hace 10 minutos',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Clase con baja asistencia',
      message: 'Spinning 7:00 AM - Solo 3 de 20 cupos ocupados',
      time: 'Hace 30 minutos',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Mantenimiento pendiente',
      message: 'Cinta de correr #3 en Zona 10 requiere revisión',
      time: 'Hace 1 hora',
      read: true
    },
    {
      id: 4,
      type: 'success',
      title: 'Nuevo miembro registrado',
      message: 'Carlos Ruiz se registró en Zona 15 - Plan Premium',
      time: 'Hace 2 horas',
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
    navigator.clipboard.writeText('SCANDINAVIA-ADMIN-001');
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
          <h1 className="text-white font-bold text-lg">Admin Panel</h1>
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
              <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-3 sm:p-4 border-b border-gray-700">
                  <h3 className="text-white font-semibold text-sm sm:text-base">Notificaciones Admin</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div key={notification.id} className={`p-3 sm:p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-gray-750' : ''}`}>
                      <div className="flex items-start gap-2 sm:gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h4 className="text-white font-medium text-xs sm:text-sm">{notification.title}</h4>
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
                <div className="p-2 sm:p-3 border-t border-gray-700">
                  <button className="w-full text-center text-gray-300 hover:text-white text-xs sm:text-sm">
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
                  <Shield className="w-5 h-5 text-black" />
                </div>
                <span className="text-white font-bold text-lg">Admin Panel</span>
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
                  <UserIcon className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <p className="text-white font-medium">Admin User</p>
                  <p className="text-gray-400 text-sm">Super Admin</p>
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
                  {menuItems.find(item => isActive(item.path))?.name || 'Admin Dashboard'}
                </h1>
                <p className="text-gray-400 text-sm">
                  {menuItems.find(item => isActive(item.path))?.description || 'Panel de administración'}
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
                    <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-3 sm:p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold text-sm sm:text-base">Notificaciones Admin</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map(notification => (
                          <div key={notification.id} className={`p-3 sm:p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-gray-750' : ''}`}>
                            <div className="flex items-start gap-2 sm:gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <h4 className="text-white font-medium text-xs sm:text-sm">{notification.title}</h4>
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
                      <div className="p-2 sm:p-3 border-t border-gray-700">
                        <button className="w-full text-center text-gray-300 hover:text-white text-xs sm:text-sm">
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
                    <UserIcon className="w-4 h-4 text-gray-300" />
                  </button>
                  
                  {/* Profile Menu Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                      <div className="p-2">
                        <button 
                          onClick={() => {
                            navigate('/admin/settings');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Configuración
                        </button>
                        <button 
                          onClick={() => {
                            navigate('/admin/reports');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          Reportes
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
          <div className="p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="/memberships" element={<AdminMemberships />} />
              <Route path="/classes" element={<AdminClasses />} />
              <Route path="/staff" element={<AdminStaff />} />
              <Route path="/finances" element={<AdminFinances />} />
              <Route path="/maintenance" element={<AdminMaintenance />} />
              <Route path="/sedes" element={<AdminSedes />} />
              <Route path="/crm" element={<AdminCRM />} />
              <Route path="/reports" element={<AdminReports />} />
              <Route path="/settings" element={<AdminSettings />} />
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
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-sm w-full border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-base sm:text-lg">Admin QR Code</h3>
              <button 
                onClick={() => setShowQRCode(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-36 h-36 sm:w-48 sm:h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-28 h-28 sm:w-40 sm:h-40 bg-gray-200 rounded flex items-center justify-center">
                  <QrCode className="w-20 h-20 sm:w-32 sm:h-32 text-gray-600" />
                </div>
              </div>
              
              <p className="text-gray-300 text-xs sm:text-sm mb-4">
                Código de acceso administrativo
              </p>
              
              <div className="bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-gray-400 text-xs mb-1">Admin ID</p>
                <p className="text-white font-mono text-xs sm:text-sm">SCANDINAVIA-ADMIN-001</p>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={copyQRCode}
                  className="flex-1 px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm"
                >
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Copiar ID</span>
                  <span className="sm:hidden">Copiar</span>
                </button>
                <button className="flex-1 px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Descargar</span>
                  <span className="sm:hidden">PDF</span>
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

export default Admin;
