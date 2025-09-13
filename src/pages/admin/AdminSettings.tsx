import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Users, 
  Shield, 
  Bell, 
  Globe, 
  Database,
  Key,
  Save,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const AdminSettings: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    maintenance: true
  });

  // Sample system settings
  const systemSettings = {
    gymName: 'Scandinavia Fitness',
    timezone: 'America/Guatemala',
    currency: 'GTQ',
    language: 'Español',
    backupFrequency: 'Diario',
    maintenanceMode: false
  };

  // Sample users data
  const adminUsers = [
    {
      id: 1,
      name: 'Admin Principal',
      email: 'admin@scandinavia.com',
      role: 'Super Admin',
      lastLogin: '2024-01-15 08:30',
      status: 'active',
      permissions: ['all']
    },
    {
      id: 2,
      name: 'María González',
      email: 'maria@scandinavia.com',
      role: 'Gerente',
      lastLogin: '2024-01-15 07:45',
      status: 'active',
      permissions: ['members', 'classes', 'finances']
    },
    {
      id: 3,
      name: 'Carlos Ruiz',
      email: 'carlos@scandinavia.com',
      role: 'Staff',
      lastLogin: '2024-01-14 18:20',
      status: 'inactive',
      permissions: ['classes', 'staff']
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-red-500';
      case 'Gerente': return 'bg-purple-500';
      case 'Staff': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Configuración del Sistema</h1>
          <p className="text-gray-400">Administra configuraciones y permisos</p>
        </div>
        <Button className="bg-gray-700 hover:bg-gray-600 text-white">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            General
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            Usuarios
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Configuración General
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configuraciones básicas del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Nombre del Gimnasio</label>
                  <Input
                    value={systemSettings.gymName}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Zona Horaria</label>
                  <Input
                    value={systemSettings.timezone}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Moneda</label>
                  <Input
                    value={systemSettings.currency}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Idioma</label>
                  <Input
                    value={systemSettings.language}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Frecuencia de Respaldo</label>
                  <Input
                    value={systemSettings.backupFrequency}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">Modo Mantenimiento</label>
                  <div className="flex items-center gap-2">
                    <Switch checked={systemSettings.maintenanceMode} />
                    <span className="text-gray-400 text-sm">
                      {systemSettings.maintenanceMode ? 'Activado' : 'Desactivado'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="w-5 h-5" />
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gray-750">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Versión del Sistema</span>
                  </div>
                  <p className="text-white font-medium">v2.1.4</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-750">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Última Actualización</span>
                  </div>
                  <p className="text-white font-medium">2024-01-10</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-750">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">Estado del Sistema</span>
                  </div>
                  <p className="text-green-400 font-medium">Operativo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Administradores del Sistema
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Gestiona usuarios con acceso administrativo
                </CardDescription>
              </div>
              <Button className="bg-gray-700 hover:bg-gray-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Usuario
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminUsers.map((user) => (
                  <div key={user.id} className="p-4 rounded-lg bg-gray-750 border border-gray-700">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-medium">{user.name}</h3>
                          <Badge className={`${getRoleColor(user.role)} text-white`}>
                            {user.role}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>Último acceso: {user.lastLogin}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">Estado:</span>
                            <span className={user.status === 'active' ? 'text-green-400' : 'text-red-400'}>
                              {user.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-400 text-sm">Permisos:</span>
                            <div className="flex gap-1">
                              {user.permissions.map((permission, index) => (
                                <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                  {permission}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-900">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configuraciones de seguridad y acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Autenticación de Dos Factores</h4>
                    <p className="text-gray-400 text-sm">Requerir 2FA para todos los administradores</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Sesiones Múltiples</h4>
                    <p className="text-gray-400 text-sm">Permitir múltiples sesiones simultáneas</p>
                  </div>
                  <Switch checked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Timeout de Sesión</h4>
                    <p className="text-gray-400 text-sm">Cerrar sesión después de inactividad</p>
                  </div>
                  <Switch checked />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-medium">Cambiar Contraseña</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium">Contraseña Actual</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        className="bg-gray-700 border-gray-600 text-white pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium">Nueva Contraseña</label>
                    <Input
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium">Confirmar Contraseña</label>
                    <Input
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription className="text-gray-400">
                Gestiona cómo recibes las notificaciones del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Notificaciones por Email</h4>
                    <p className="text-gray-400 text-sm">Recibir notificaciones importantes por email</p>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Notificaciones SMS</h4>
                    <p className="text-gray-400 text-sm">Recibir alertas críticas por SMS</p>
                  </div>
                  <Switch 
                    checked={notifications.sms} 
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Notificaciones Push</h4>
                    <p className="text-gray-400 text-sm">Recibir notificaciones en el navegador</p>
                  </div>
                  <Switch 
                    checked={notifications.push} 
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Alertas de Mantenimiento</h4>
                    <p className="text-gray-400 text-sm">Notificaciones sobre mantenimiento del sistema</p>
                  </div>
                  <Switch 
                    checked={notifications.maintenance} 
                    onCheckedChange={(checked) => setNotifications({...notifications, maintenance: checked})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-white font-medium">Horarios de Notificación</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium">Horario de Inicio</label>
                    <Input
                      type="time"
                      value="08:00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-gray-300 text-sm font-medium">Horario de Fin</label>
                    <Input
                      type="time"
                      value="18:00"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
