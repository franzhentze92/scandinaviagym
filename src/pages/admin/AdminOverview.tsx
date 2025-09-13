import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  CalendarDays,
  CreditCard,
  BarChart3,
  Filter,
  Download
} from 'lucide-react';

const AdminOverview: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Sample KPI data
  const kpis = [
    {
      title: 'Miembros Activos',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <Users className="w-5 h-5" />,
      description: 'vs mes anterior'
    },
    {
      title: 'Clases Reservadas',
      value: '3,456',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <Calendar className="w-5 h-5" />,
      description: 'esta semana'
    },
    {
      title: 'Ingresos',
      value: '$45,230',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-5 h-5" />,
      description: 'vs mes anterior'
    },
    {
      title: 'Ocupación Promedio',
      value: '78%',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: <Activity className="w-5 h-5" />,
      description: 'vs semana anterior'
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'member',
      title: 'Nuevo miembro registrado',
      description: 'María González se registró en Zona 10',
      time: 'Hace 5 minutos',
      icon: <UserPlus className="w-4 h-4" />,
      status: 'success'
    },
    {
      id: 2,
      type: 'class',
      title: 'Clase cancelada',
      description: 'Spinning 7:00 AM - Cancelada por baja asistencia',
      time: 'Hace 15 minutos',
      icon: <CalendarDays className="w-4 h-4" />,
      status: 'warning'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Pago procesado',
      description: '$89.99 - Membresía Premium - Carlos Ruiz',
      time: 'Hace 30 minutos',
      icon: <CreditCard className="w-4 h-4" />,
      status: 'success'
    },
    {
      id: 4,
      type: 'maintenance',
      title: 'Mantenimiento programado',
      description: 'Cinta de correr #3 - Zona 15',
      time: 'Hace 1 hora',
      icon: <Clock className="w-4 h-4" />,
      status: 'info'
    }
  ];

  // Top performing classes
  const topClasses = [
    { name: 'Spinning', reservations: 234, revenue: '$2,340', growth: '+12%' },
    { name: 'Yoga', reservations: 189, revenue: '$1,890', growth: '+8%' },
    { name: 'CrossFit', reservations: 156, revenue: '$1,560', growth: '+15%' },
    { name: 'Pilates', reservations: 134, revenue: '$1,340', growth: '+5%' },
    { name: 'Zumba', reservations: 98, revenue: '$980', growth: '+3%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'info': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getChangeIcon = (changeType: string) => {
    return changeType === 'positive' ? 
      <TrendingUp className="w-4 h-4" /> : 
      <TrendingDown className="w-4 h-4" />;
  };

  const getChangeColor = (changeType: string) => {
    return changeType === 'positive' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard General</h1>
          <p className="text-gray-400 text-sm sm:text-base">Resumen operacional del gimnasio</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-3">
            <Filter className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
          <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-3">
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-gray-300">
                {kpi.title}
              </CardTitle>
              <div className="text-gray-400">
                {kpi.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold text-white">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className={getChangeColor(kpi.changeType)}>
                  {getChangeIcon(kpi.changeType)}
                </div>
                <span className={`text-xs ${getChangeColor(kpi.changeType)}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-gray-400 ml-1 hidden sm:inline">
                  {kpi.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-800 border-gray-700 w-full sm:w-auto">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-xs sm:text-sm">
            Resumen
          </TabsTrigger>
          <TabsTrigger value="activities" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-xs sm:text-sm">
            <span className="hidden sm:inline">Actividad Reciente</span>
            <span className="sm:hidden">Actividad</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-xs sm:text-sm">
            Rendimiento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activities */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Actividad Reciente
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Últimas acciones del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-750">
                    <div className={`flex-shrink-0 ${getStatusColor(activity.status)}`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{activity.title}</p>
                      <p className="text-gray-300 text-xs mt-1">{activity.description}</p>
                      <p className="text-gray-400 text-xs mt-2">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="border-gray-600 text-gray-300">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Acciones Rápidas
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Herramientas de gestión rápida
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
                  <Users className="w-4 h-4 mr-2" />
                  Agregar Nuevo Miembro
                </Button>
                <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
                  <Calendar className="w-4 h-4 mr-2" />
                  Crear Nueva Clase
                </Button>
                <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Procesar Pagos
                </Button>
                <Button className="w-full justify-start bg-gray-700 hover:bg-gray-600 text-white">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Ver Alertas
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Log de Actividades</CardTitle>
              <CardDescription className="text-gray-400">
                Historial completo de actividades del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-750">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full bg-gray-700 ${getStatusColor(activity.status)}`}>
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-white font-medium">{activity.title}</p>
                        <p className="text-gray-300 text-sm">{activity.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                      <Badge variant="outline" className="border-gray-600 text-gray-300 mt-1">
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Clases con Mejor Rendimiento</CardTitle>
              <CardDescription className="text-gray-400">
                Top 5 clases por número de reservas y ingresos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClasses.map((cls, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-750">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-white font-medium">{cls.name}</p>
                        <p className="text-gray-300 text-sm">{cls.reservations} reservas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{cls.revenue}</p>
                      <p className={`text-sm ${cls.growth.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {cls.growth}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOverview;
