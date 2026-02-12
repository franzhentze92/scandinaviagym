import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { useAuth } from '@/contexts/AuthContext';
import { getUserProfile } from '@/services/database';
import type { UserProfile } from '@/types/database';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  User, 
  Calendar, 
  TrendingUp, 
  Trophy, 
  HelpCircle, 
  Settings,
  Menu,
  X,
  QrCode,
  LogOut,
  Copy,
  Loader2,
  Shield,
  Users,
  GraduationCap,
  CalendarCheck,
  ClipboardList,
  Activity,
  CreditCard,
  FileText
} from 'lucide-react';

// Lazy load dashboard pages for code splitting
const DashboardOverview = lazy(() => import('./dashboard/DashboardOverview'));
const MiMembresia = lazy(() => import('./dashboard/MiMembresia'));
const ClasesReservas = lazy(() => import('./dashboard/ClasesReservas'));
const Entrenadores = lazy(() => import('./dashboard/Entrenadores'));
const RetosComunidad = lazy(() => import('./dashboard/RetosComunidad'));
const SoporteContacto = lazy(() => import('./dashboard/SoporteContacto'));
const MiPerfil = lazy(() => import('./dashboard/MiPerfil'));
const AdministracionUsuarios = lazy(() => import('./dashboard/AdministracionUsuarios'));
const AdministracionInstructores = lazy(() => import('./dashboard/AdministracionInstructores'));
const AdministracionReservas = lazy(() => import('./dashboard/AdministracionReservas'));
const AdministracionEvaluaciones = lazy(() => import('./dashboard/AdministracionEvaluaciones'));
const InstructorDashboard = lazy(() => import('./dashboard/InstructorDashboard'));
const AdminDashboard = lazy(() => import('./dashboard/AdminDashboard'));
const AdministracionRutinas = lazy(() => import('./dashboard/AdministracionRutinas'));
const AdministracionMembresias = lazy(() => import('./dashboard/AdministracionMembresias'));
const AdministracionPlanes = lazy(() => import('./dashboard/AdministracionPlanes'));
const AdministracionTickets = lazy(() => import('./dashboard/AdministracionTickets'));
const MisEvaluaciones = lazy(() => import('./dashboard/MisEvaluaciones'));
const MisRutinas = lazy(() => import('./dashboard/MisRutinas'));

const Dashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useScrollToTop();

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        const profile = await getUserProfile(user.id);
        setUserProfile(profile);
        setAvatarError(false); // Reset error state when profile changes
      }
    };
    loadProfile();
  }, [user]);

  // En móvil, cuando el sidebar está abierto, asegurarse de que esté expandido
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      setSidebarCollapsed(false);
    }
  }, [sidebarOpen]);

  const menuItems = useMemo(() => {
    const allItems = [
      {
        id: 'overview',
        name: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/dashboard',
        description: 'Resumen general',
        adminOnly: false,
        instructorOnly: false
      },
      {
        id: 'instructor-dashboard',
        name: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/dashboard/instructor',
        description: 'Resumen de actividades',
        adminOnly: false,
        instructorOnly: true
      },
      {
        id: 'membership',
        name: 'Mi Membresía',
        icon: <User className="w-5 h-5" />,
        path: '/dashboard/membresia',
        description: 'Plan y pagos',
        adminOnly: false,
        instructorOnly: false
      },
      {
        id: 'classes',
        name: 'Clases & Reservas',
        icon: <Calendar className="w-5 h-5" />,
        path: '/dashboard/clases',
        description: 'Horarios y reservas',
        adminOnly: false,
        instructorOnly: false
      },
      {
        id: 'mis-evaluaciones',
        name: 'Mis Evaluaciones',
        icon: <ClipboardList className="w-5 h-5" />,
        path: '/dashboard/mis-evaluaciones',
        description: 'Evaluaciones clínicas',
        adminOnly: false,
        instructorOnly: false,
        clientOnly: true
      },
      {
        id: 'mis-rutinas',
        name: 'Mis Rutinas',
        icon: <Activity className="w-5 h-5" />,
        path: '/dashboard/mis-rutinas',
        description: 'Rutinas de entrenamiento',
        adminOnly: false,
        instructorOnly: false,
        clientOnly: true
      },
      // Admin only items
      {
        id: 'admin-dashboard',
        name: 'Dashboard',
        icon: <LayoutDashboard className="w-5 h-5" />,
        path: '/dashboard/admin',
        description: 'Panel de administración',
        adminOnly: true,
        instructorOnly: false
      },
      {
        id: 'admin-users',
        name: 'Usuarios',
        icon: <Users className="w-5 h-5" />,
        path: '/dashboard/admin/usuarios',
        description: 'Administración de usuarios',
        adminOnly: true,
        instructorOnly: false
      },
      {
        id: 'admin-instructors',
        name: 'Instructores',
        icon: <GraduationCap className="w-5 h-5" />,
        path: '/dashboard/admin/instructores',
        description: 'Administración de instructores',
        adminOnly: true,
        instructorOnly: false
      },
      {
        id: 'admin-reservations',
        name: 'Reservas',
        icon: <CalendarCheck className="w-5 h-5" />,
        path: '/dashboard/admin/reservas',
        description: 'Administración de reservas',
        adminOnly: true,
        instructorOnly: false
      },
      {
        id: 'admin-evaluations',
        name: 'Evaluaciones',
        icon: <ClipboardList className="w-5 h-5" />,
        path: '/dashboard/admin/evaluaciones',
        description: 'Evaluaciones clínicas',
        adminOnly: true,
        instructorOnly: false
      },
      {
        id: 'admin-routines',
        name: 'Rutinas',
        icon: <Activity className="w-5 h-5" />,
        path: '/dashboard/admin/rutinas',
        description: 'Rutinas de entrenamiento',
        adminOnly: true,
        instructorOnly: false
      },
      {
        id: 'admin-memberships',
        name: 'Inscripciones',
        icon: <CreditCard className="w-5 h-5" />,
        path: '/dashboard/admin/inscripciones',
        description: 'Administración de inscripciones',
        adminOnly: true,
        instructorOnly: false
      },
      {
        id: 'admin-plans',
        name: 'Planes y Promociones',
        icon: <CreditCard className="w-5 h-5" />,
        path: '/dashboard/admin/planes',
        description: 'Administración de planes de membresía',
        adminOnly: true,
        instructorOnly: false
      },
      {
        id: 'admin-tickets',
        name: 'Tickets',
        icon: <FileText className="w-5 h-5" />,
        path: '/dashboard/admin/tickets',
        description: 'Gestión de tickets de soporte',
        adminOnly: true,
        instructorOnly: false
      },
      {
        id: 'profile',
        name: 'Mi Perfil',
        icon: <Settings className="w-5 h-5" />,
        path: '/dashboard/perfil',
        description: 'Configuración personal',
        adminOnly: false,
        instructorOnly: false
      },
      {
        id: 'support',
        name: 'Soporte',
        icon: <HelpCircle className="w-5 h-5" />,
        path: '/dashboard/soporte',
        description: 'Ayuda y contacto',
        adminOnly: false
      }
    ];

    // Filter items based on user role
    if (userRole === 'admin') {
      // For admins, only show admin items and profile (exclude client-only items, instructor dashboard, and support)
      return allItems.filter(item => 
        (item.adminOnly || item.id === 'profile') && 
        !item.clientOnly && 
        !item.instructorOnly &&
        item.id !== 'support'
      );
    } else if (userRole === 'instructor') {
      // For instructors, show instructor dashboard and admin pages EXCEPT: usuarios, instructores, inscripciones, planes, admin-dashboard, admin-tickets
      const excludedIds = ['admin-users', 'admin-instructors', 'admin-memberships', 'admin-plans', 'admin-dashboard', 'admin-tickets'];
      return allItems.filter(item => 
        (item.instructorOnly || (item.adminOnly && !excludedIds.includes(item.id)) || item.id === 'profile') && 
        !item.clientOnly
      );
    } else {
      // For regular users (clients), show all non-admin items (exclude client-only items if they're not clients, and exclude instructor dashboard)
      return allItems.filter(item => 
        !item.adminOnly && 
        !item.instructorOnly && 
        (!item.clientOnly || userRole === 'client')
      );
    }
  }, [userRole]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const copyQRCode = () => {
    if (user?.id && userProfile?.email) {
      const qrData = JSON.stringify({
        userId: user.id,
        email: userProfile.email,
        name: userProfile.full_name || '',
        memberId: `SCANDINAVIA-${user.id.substring(0, 8).toUpperCase()}`,
        memberSince: userProfile.member_since || new Date().toISOString()
      });
      navigator.clipboard.writeText(qrData);
      toast.success('Código QR copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden bg-sidebar-background border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            setSidebarOpen(!sidebarOpen);
            // En móvil, cuando se abre el sidebar, asegurarse de que esté expandido
            if (!sidebarOpen && window.innerWidth < 1024) {
              setSidebarCollapsed(false);
            }
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className="flex-1 flex justify-center">
          <img 
            src="/logo1.png" 
            alt="Scandinavia" 
            className="h-8 object-contain"
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowQRCode(!showQRCode)}
            className="p-2 text-muted-foreground hover:text-foreground"
          >
            <QrCode className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors overflow-hidden"
            >
              {userProfile?.avatar_url && !avatarError ? (
                <img 
                  src={userProfile.avatar_url} 
                  alt={userProfile.full_name || 'Usuario'} 
                  className="w-full h-full object-cover"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <User className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            
            {/* Profile Menu Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                {/* User Info Section */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                      {userProfile?.avatar_url && !avatarError ? (
                        <img 
                          src={userProfile.avatar_url} 
                          alt={userProfile.full_name || 'Usuario'} 
                          className="w-full h-full object-cover"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <User className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-semibold truncate">
                        {userProfile?.full_name || 'Usuario'}
                      </p>
                      <p className="text-muted-foreground text-sm truncate">
                        {userProfile?.role === 'admin' 
                          ? 'Administrador' 
                          : userProfile?.role === 'instructor' 
                          ? 'Instructor' 
                          : 'Cliente'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => {
                      navigate('/dashboard/perfil');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    Mi Perfil
                  </button>
                  {userProfile?.role === 'client' && (
                    <>
                      <button 
                        onClick={() => {
                          navigate('/dashboard/membresia');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        Mi Membresía
                      </button>
                      <button 
                        onClick={() => {
                          navigate('/dashboard/soporte');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      >
                        Soporte
                      </button>
                    </>
                  )}
                  <hr className="my-2 border-border" />
                  <button 
                    onClick={() => {
                      handleLogout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-destructive hover:text-destructive/80 hover:bg-muted rounded-lg transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 bg-sidebar-background border-r border-sidebar-border transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 lg:transition-all ${
            sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
          } w-64`}
          onMouseEnter={() => {
            // Solo aplicar en desktop
            if (window.innerWidth >= 1024) {
              setSidebarCollapsed(false);
            }
          }}
          onMouseLeave={() => {
            // Solo aplicar en desktop
            if (window.innerWidth >= 1024) {
              setSidebarCollapsed(true);
            }
          }}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center h-16 border-b border-sidebar-border transition-all duration-300 ${
              sidebarCollapsed ? 'lg:px-2 lg:justify-center' : 'px-4 justify-between'
            } px-4`}>
              <img 
                src="/logo1.png" 
                alt="Scandinavia" 
                className={`transition-all duration-300 object-contain ${
                  sidebarCollapsed ? 'lg:w-6 lg:h-6' : 'w-full max-w-[140px] h-8'
                } w-full max-w-[140px] h-8`}
              />
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  // En móvil, cuando se cierra el sidebar, resetear el estado
                  if (window.innerWidth < 1024) {
                    setSidebarCollapsed(true);
                  }
                }}
                className="lg:hidden text-muted-foreground hover:text-foreground flex-shrink-0 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 py-4 space-y-1 transition-all duration-300 ${
              sidebarCollapsed ? 'lg:px-2' : 'px-4'
            } px-4`}>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                    // En móvil, cuando se cierra el sidebar, resetear el estado
                    if (window.innerWidth < 1024) {
                      setSidebarCollapsed(true);
                    }
                  }}
                  className={`w-full flex items-center gap-3 rounded-lg text-left transition-colors ${
                    sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'px-3'
                  } px-3 py-2 ${
                    isActive(item.path)
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <div className={`flex-shrink-0 ${
                    isActive(item.path) ? 'text-sidebar-primary' : 'text-muted-foreground'
                  }`}>
                    {item.icon}
                  </div>
                  <div className={`flex-1 min-w-0 transition-opacity duration-300 ${
                    sidebarCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                  } opacity-100`}>
                    <p className="font-medium truncate text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                  </div>
                </button>
              ))}
            </nav>

            {/* Logout */}
            <div className={`border-t border-sidebar-border transition-all duration-300 ${
              sidebarCollapsed ? 'lg:px-2 lg:py-4' : 'px-4 py-4'
            }`}>
              <button
                onClick={handleLogout}
                className={`w-full flex items-center gap-3 rounded-lg text-left text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors ${
                  sidebarCollapsed ? 'lg:justify-center lg:px-2' : 'px-3'
                } px-3 py-3`}
                title={sidebarCollapsed ? 'Cerrar Sesión' : undefined}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${
                  sidebarCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : 'opacity-100'
                } opacity-100`}>
                  Cerrar Sesión
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 min-w-0 overflow-x-hidden max-w-full ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* Desktop Header */}
          <div className="hidden lg:block bg-sidebar-background border-b border-border px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {menuItems.find(item => isActive(item.path))?.name || 'Dashboard'}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {menuItems.find(item => isActive(item.path))?.description || 'Resumen general'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <QrCode className="w-5 h-5" />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors overflow-hidden"
                  >
                    {userProfile?.avatar_url && !avatarError ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt={userProfile.full_name || 'Usuario'} 
                        className="w-full h-full object-cover"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  
                  {/* Profile Menu Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
                      {/* User Info Section */}
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                            {userProfile?.avatar_url && !avatarError ? (
                              <img 
                                src={userProfile.avatar_url} 
                                alt={userProfile.full_name || 'Usuario'} 
                                className="w-full h-full object-cover"
                                onError={() => setAvatarError(true)}
                              />
                            ) : (
                              <User className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground font-semibold truncate">
                              {userProfile?.full_name || 'Usuario'}
                            </p>
                            <p className="text-muted-foreground text-sm truncate">
                              {userProfile?.role === 'admin' 
                                ? 'Administrador' 
                                : userProfile?.role === 'instructor' 
                                ? 'Instructor' 
                                : 'Cliente'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button 
                          onClick={() => {
                            navigate('/dashboard/perfil');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          Mi Perfil
                        </button>
                        {userProfile?.role === 'client' && (
                          <>
                            <button 
                              onClick={() => {
                                navigate('/dashboard/membresia');
                                setShowProfileMenu(false);
                              }}
                              className="w-full text-left px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              Mi Membresía
                            </button>
                            <button 
                              onClick={() => {
                                navigate('/dashboard/soporte');
                                setShowProfileMenu(false);
                              }}
                              className="w-full text-left px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              Soporte
                            </button>
                          </>
                        )}
                        <hr className="my-2 border-border" />
                        <button 
                          onClick={() => {
                            handleLogout();
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left px-3 py-2 text-destructive hover:text-destructive/80 hover:bg-muted rounded-lg transition-colors"
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
          <div className="p-3 sm:p-6 overflow-x-hidden max-w-full w-full min-w-0">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            }>
              <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="/membresia" element={<MiMembresia />} />
                <Route path="/clases" element={<ClasesReservas />} />
                <Route path="/entrenadores" element={<Entrenadores />} />
                <Route path="/retos" element={<RetosComunidad />} />
                <Route path="/soporte" element={<SoporteContacto />} />
                <Route path="/perfil" element={<MiPerfil />} />
                <Route path="/instructor" element={<InstructorDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/usuarios" element={<AdministracionUsuarios />} />
                <Route path="/admin/instructores" element={<AdministracionInstructores />} />
                <Route path="/admin/reservas" element={<AdministracionReservas />} />
                <Route path="/admin/evaluaciones" element={<AdministracionEvaluaciones />} />
                <Route path="/admin/rutinas" element={<AdministracionRutinas />} />
                <Route path="/admin/inscripciones" element={<AdministracionMembresias />} />
                <Route path="/admin/planes" element={<AdministracionPlanes />} />
                <Route path="/admin/tickets" element={<AdministracionTickets />} />
                <Route path="/mis-evaluaciones" element={<MisEvaluaciones />} />
                <Route path="/mis-rutinas" element={<MisRutinas />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowQRCode(false)}>
          <div className="bg-card rounded-xl p-6 max-w-sm w-full border border-border" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-foreground font-bold text-lg">Mi Código QR</h3>
              <button 
                onClick={() => setShowQRCode(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center">
              <div className="w-64 h-64 bg-white rounded-lg mx-auto mb-4 p-4 flex items-center justify-center">
                {user?.id && userProfile?.email ? (
                  <QRCodeSVG
                    value={JSON.stringify({
                      userId: user.id,
                      email: userProfile.email,
                      name: userProfile.full_name || '',
                      memberId: `SCANDINAVIA-${user.id.substring(0, 8).toUpperCase()}`,
                      memberSince: userProfile.member_since || new Date().toISOString()
                    })}
                    size={224}
                    level="H"
                    includeMargin={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              
              <p className="text-muted-foreground text-sm mb-4">
                Muestra este código en la recepción para acceso rápido
              </p>
              
              {user?.id && (
                <div className="bg-muted rounded-lg p-3 mb-3">
                  <p className="text-muted-foreground text-xs mb-1">ID de Miembro</p>
                  <p className="text-foreground font-mono text-sm">
                    SCANDINAVIA-{user.id.substring(0, 8).toUpperCase()}
                  </p>
                </div>
              )}
              
              {userProfile?.gym_code && (
                <div className="bg-muted rounded-lg p-3 mb-4">
                  <p className="text-muted-foreground text-xs mb-1">Mi Código</p>
                  <p className="text-foreground font-mono text-sm">
                    {userProfile.gym_code}
                  </p>
                </div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={copyQRCode}
                  className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
                <button
                  onClick={() => setShowQRCode(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors text-black"
                  style={{backgroundColor: '#b5fc00'}}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                  }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileMenu(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
