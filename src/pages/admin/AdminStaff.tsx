import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserCheck, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Award,
  MapPin,
  Download,
  Star
} from 'lucide-react';

const AdminStaff: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample staff data
  const staff = [
    {
      id: 1,
      name: 'Carlos Ruiz',
      role: 'Entrenador Principal',
      email: 'carlos.ruiz@scandinavia.com',
      phone: '+502 1234-5678',
      sede: 'Zona 10',
      status: 'active',
      experience: '5 años',
      specializations: ['Spinning', 'CrossFit'],
      rating: 4.8,
      classesPerWeek: 12,
      salary: '$800'
    },
    {
      id: 2,
      name: 'Ana Martínez',
      role: 'Instructora de Yoga',
      email: 'ana.martinez@scandinavia.com',
      phone: '+502 2345-6789',
      sede: 'Zona 15',
      status: 'active',
      experience: '3 años',
      specializations: ['Yoga', 'Pilates'],
      rating: 4.9,
      classesPerWeek: 8,
      salary: '$650'
    },
    {
      id: 3,
      name: 'Pedro López',
      role: 'Entrenador CrossFit',
      email: 'pedro.lopez@scandinavia.com',
      phone: '+502 3456-7890',
      sede: 'Zona 10',
      status: 'on_leave',
      experience: '4 años',
      specializations: ['CrossFit', 'Peso Libre'],
      rating: 4.7,
      classesPerWeek: 10,
      salary: '$750'
    }
  ];

  // KPI data
  const kpis = [
    {
      title: 'Total Staff',
      value: '24',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'Entrenadores Activos',
      value: '18',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      title: 'Clases Esta Semana',
      value: '156',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <Calendar className="w-5 h-5" />
    },
    {
      title: 'Horas Trabajadas',
      value: '2,340',
      change: '+5.1%',
      changeType: 'positive' as const,
      icon: <Clock className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'on_leave': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Entrenador Principal': return 'bg-purple-500';
      case 'Instructora de Yoga': return 'bg-green-500';
      case 'Entrenador CrossFit': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.sede.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Gestión de Staff</h1>
          <p className="text-gray-400 text-sm sm:text-base">Administra entrenadores y personal</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white text-xs sm:text-sm px-2 sm:px-3">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Nuevo Staff</span>
            <span className="sm:hidden">Nuevo</span>
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs sm:text-sm px-2 sm:px-3">
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
                <span className={`text-xs ${kpi.changeType === 'positive' ? 'text-green-400' : 'text-red-400'}`}>
                  {kpi.change}
                </span>
                <span className="text-xs text-gray-400 ml-1">vs mes anterior</span>
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
                  placeholder="Buscar por nombre, rol o sede..."
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
                Todos
              </Button>
              <Button
                variant={selectedFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('active')}
                className={selectedFilter === 'active' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Activos
              </Button>
              <Button
                variant={selectedFilter === 'on_leave' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('on_leave')}
                className={selectedFilter === 'on_leave' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                En Licencia
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Staff</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredStaff.length} miembros de staff encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStaff.map((member) => (
              <div key={member.id} className="p-4 rounded-lg bg-gray-750 border border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{member.name}</h3>
                      <Badge className={`${getRoleColor(member.role)} text-white`}>
                        {member.role}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-yellow-400 text-sm font-medium">{member.rating}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Email:</span>
                        <span>{member.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Teléfono:</span>
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{member.sede}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-gray-400" />
                        <span>{member.experience}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{member.classesPerWeek} clases/semana</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Salario:</span>
                        <span className="text-green-400 font-medium">{member.salary}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Especialidades:</span>
                        <div className="flex gap-1">
                          {member.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
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

      {/* Performance and Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Entrenadores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">Ana Martínez</p>
                    <p className="text-gray-300 text-sm">Yoga & Pilates</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-medium">4.9</span>
                  </div>
                  <p className="text-gray-400 text-xs">156 clases</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">Carlos Ruiz</p>
                    <p className="text-gray-300 text-sm">Spinning & CrossFit</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-medium">4.8</span>
                  </div>
                  <p className="text-gray-400 text-xs">234 clases</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">Pedro López</p>
                    <p className="text-gray-300 text-sm">CrossFit & Peso Libre</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-medium">4.7</span>
                  </div>
                  <p className="text-gray-400 text-xs">189 clases</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium">3 entrenadores en licencia</p>
                <p className="text-gray-400 text-xs">Pedro López, María García, Juan Pérez</p>
              </div>
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20">
                <p className="text-red-400 text-sm font-medium">2 clases sin instructor</p>
                <p className="text-gray-400 text-xs">Buscar reemplazo temporal</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/20">
                <p className="text-blue-400 text-sm font-medium">5 solicitudes de vacaciones</p>
                <p className="text-gray-400 text-xs">Pendientes de aprobación</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminStaff;
