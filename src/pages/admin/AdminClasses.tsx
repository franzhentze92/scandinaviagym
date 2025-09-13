import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  User,
  MapPin,
  Download
} from 'lucide-react';

const AdminClasses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample class data
  const classes = [
    {
      id: 1,
      name: 'Spinning Matutino',
      type: 'Spinning',
      trainer: 'Carlos Ruiz',
      schedule: 'Lunes, Miércoles, Viernes',
      time: '07:00 - 08:00',
      capacity: 20,
      enrolled: 15,
      sede: 'Zona 10',
      status: 'active',
      price: '$15.00'
    },
    {
      id: 2,
      name: 'Yoga Restaurativo',
      type: 'Yoga',
      trainer: 'Ana Martínez',
      schedule: 'Martes, Jueves',
      time: '18:00 - 19:00',
      capacity: 12,
      enrolled: 8,
      sede: 'Zona 15',
      status: 'active',
      price: '$12.00'
    },
    {
      id: 3,
      name: 'CrossFit Intenso',
      type: 'CrossFit',
      trainer: 'Pedro López',
      schedule: 'Lunes, Miércoles, Viernes',
      time: '19:00 - 20:00',
      capacity: 15,
      enrolled: 15,
      sede: 'Zona 10',
      status: 'full',
      price: '$18.00'
    }
  ];

  // KPI data
  const kpis = [
    {
      title: 'Clases Programadas',
      value: '45',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <Calendar className="w-5 h-5" />
    },
    {
      title: 'Reservas Hoy',
      value: '234',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'Ocupación Promedio',
      value: '78%',
      change: '+5.1%',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: 'Ingresos por Clases',
      value: '$3,420',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: <CheckCircle className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'full': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Spinning': return 'bg-red-500';
      case 'Yoga': return 'bg-green-500';
      case 'CrossFit': return 'bg-blue-500';
      case 'Pilates': return 'bg-purple-500';
      case 'Zumba': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || cls.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Gestión de Clases</h1>
          <p className="text-gray-400 text-sm sm:text-base">Administra clases y reservas</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Clase
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                {kpi.title}
              </CardTitle>
              <div className="text-gray-400">
                {kpi.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs ${kpi.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-gray-400 ml-1">vs semana anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar clases, entrenadores o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
                className={selectedFilter === 'all' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Todas
              </Button>
              <Button
                variant={selectedFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('active')}
                className={selectedFilter === 'active' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Activas
              </Button>
              <Button
                variant={selectedFilter === 'full' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('full')}
                className={selectedFilter === 'full' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Llenas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Clases</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredClasses.length} clases encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredClasses.map((cls) => (
              <div key={cls.id} className="p-4 rounded-lg bg-gray-750 border border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{cls.name}</h3>
                      <Badge className={`${getTypeColor(cls.type)} text-white`}>
                        {cls.type}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(cls.status)}`}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{cls.trainer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{cls.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{cls.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{cls.enrolled}/{cls.capacity} participantes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{cls.sede}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Precio:</span>
                        <span className="text-green-400 font-medium">{cls.price}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Ocupación:</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 text-sm">
                          {Math.round((cls.enrolled / cls.capacity) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Eye className="w-4 h-4" />
                    </Button>
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

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Horario de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Spinning Matutino</p>
                  <p className="text-gray-300 text-sm">07:00 - 08:00</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-sm">15/20</p>
                  <p className="text-gray-400 text-xs">Carlos Ruiz</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Yoga Restaurativo</p>
                  <p className="text-gray-300 text-sm">18:00 - 19:00</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-sm">8/12</p>
                  <p className="text-gray-400 text-xs">Ana Martínez</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">CrossFit Intenso</p>
                  <p className="text-gray-300 text-sm">19:00 - 20:00</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 text-sm">15/15</p>
                  <p className="text-gray-400 text-xs">Pedro López</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Clases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium">3 clases con baja asistencia</p>
                <p className="text-gray-400 text-xs">Menos del 50% de ocupación</p>
              </div>
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20">
                <p className="text-red-400 text-sm font-medium">1 clase cancelada</p>
                <p className="text-gray-400 text-xs">Pilates 10:00 AM - Sin instructor</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/20">
                <p className="text-blue-400 text-sm font-medium">5 reservas pendientes</p>
                <p className="text-gray-400 text-xs">Esperando confirmación</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminClasses;
