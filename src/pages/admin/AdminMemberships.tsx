import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';

const AdminMemberships: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample membership data
  const memberships = [
    {
      id: 1,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+502 1234-5678',
      membershipType: 'Premium',
      status: 'active',
      startDate: '2024-01-15',
      endDate: '2024-07-15',
      paymentStatus: 'paid',
      sede: 'Zona 10',
      trainer: 'Carlos Ruiz'
    },
    {
      id: 2,
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+502 2345-6789',
      membershipType: 'Basic',
      status: 'active',
      startDate: '2024-02-01',
      endDate: '2024-08-01',
      paymentStatus: 'pending',
      sede: 'Zona 15',
      trainer: 'Ana Martínez'
    },
    {
      id: 3,
      name: 'Laura Rodríguez',
      email: 'laura.rodriguez@email.com',
      phone: '+502 3456-7890',
      membershipType: 'VIP',
      status: 'expired',
      startDate: '2023-12-01',
      endDate: '2024-03-01',
      paymentStatus: 'overdue',
      sede: 'Zona 10',
      trainer: 'Pedro López'
    }
  ];

  // KPI data
  const kpis = [
    {
      title: 'Total Miembros',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'Miembros Activos',
      value: '1,156',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      title: 'Renovaciones Pendientes',
      value: '89',
      change: '-3.1%',
      changeType: 'negative' as const,
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: 'Ingresos Mensuales',
      value: '$45,230',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'expired': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'overdue': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getMembershipTypeColor = (type: string) => {
    switch (type) {
      case 'VIP': return 'bg-purple-500';
      case 'Premium': return 'bg-blue-500';
      case 'Basic': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredMemberships = memberships.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || member.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Gestión de Membresías</h1>
          <p className="text-gray-400 text-sm sm:text-base">Administra miembros y suscripciones</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white text-xs sm:text-sm px-2 sm:px-3">
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Nuevo Miembro</span>
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
                <span className="text-xs text-gray-400 ml-1 hidden sm:inline">vs mes anterior</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
                className={`text-xs sm:text-sm ${selectedFilter === 'all' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}`}
              >
                Todos
              </Button>
              <Button
                variant={selectedFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('active')}
                className={`text-xs sm:text-sm ${selectedFilter === 'active' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}`}
              >
                Activos
              </Button>
              <Button
                variant={selectedFilter === 'expired' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('expired')}
                className={`text-xs sm:text-sm ${selectedFilter === 'expired' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}`}
              >
                Expirados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memberships Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Miembros</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredMemberships.length} miembros encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMemberships.map((member) => (
              <div key={member.id} className="p-4 rounded-lg bg-gray-750 border border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{member.name}</h3>
                      <Badge className={`${getMembershipTypeColor(member.membershipType)} text-white`}>
                        {member.membershipType}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
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
                        <span className="text-gray-400">Sede:</span>
                        <span>{member.sede}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Entrenador:</span>
                        <span>{member.trainer}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Vigencia:</span>
                        <span>{member.startDate} - {member.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Pago:</span>
                        <span className={getPaymentStatusColor(member.paymentStatus)}>
                          {member.paymentStatus === 'paid' ? 'Pagado' : 
                           member.paymentStatus === 'pending' ? 'Pendiente' : 'Vencido'}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Membresías por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-300">VIP</span>
                </div>
                <span className="text-white font-medium">234 (18.7%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-300">Premium</span>
                </div>
                <span className="text-white font-medium">567 (45.4%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-gray-300">Basic</span>
                </div>
                <span className="text-white font-medium">446 (35.7%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium">89 pagos pendientes</p>
                <p className="text-gray-400 text-xs">Requieren seguimiento</p>
              </div>
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20">
                <p className="text-red-400 text-sm font-medium">23 membresías expiradas</p>
                <p className="text-gray-400 text-xs">Contactar para renovación</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/20">
                <p className="text-blue-400 text-sm font-medium">12 nuevos leads</p>
                <p className="text-gray-400 text-xs">Prospectos en proceso</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMemberships;
