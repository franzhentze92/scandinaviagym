import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  MapPin, 
  Users, 
  Clock, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Download,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail
} from 'lucide-react';

const AdminSedes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample sede data
  const sedes = [
    {
      id: 1,
      name: 'Zona 10',
      address: '5ta Avenida 10-50, Zona 10',
      phone: '+502 2233-4455',
      email: 'zona10@scandinavia.com',
      manager: 'María González',
      status: 'active',
      capacity: 150,
      members: 127,
      equipment: 45,
      monthlyRevenue: 18500,
      hours: '5:00 AM - 10:00 PM'
    },
    {
      id: 2,
      name: 'Zona 15',
      address: '8va Calle 15-25, Zona 15',
      phone: '+502 2233-5566',
      email: 'zona15@scandinavia.com',
      manager: 'Carlos Ruiz',
      status: 'active',
      capacity: 120,
      members: 98,
      equipment: 38,
      monthlyRevenue: 15200,
      hours: '5:00 AM - 10:00 PM'
    },
    {
      id: 3,
      name: 'Carretera a El Salvador',
      address: 'Km 18.5 Carretera a El Salvador',
      phone: '+502 2233-6677',
      email: 'carretera@scandinavia.com',
      manager: 'Ana Martínez',
      status: 'maintenance',
      capacity: 100,
      members: 67,
      equipment: 32,
      monthlyRevenue: 9800,
      hours: '6:00 AM - 9:00 PM'
    }
  ];

  // KPI data
  const kpis = [
    {
      title: 'Total Sedes',
      value: '3',
      change: '+0%',
      changeType: 'positive' as const,
      icon: <Building2 className="w-5 h-5" />
    },
    {
      title: 'Miembros Totales',
      value: '292',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'Ingresos Mensuales',
      value: '$43,500',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      title: 'Ocupación Promedio',
      value: '78%',
      change: '+5.1%',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredSedes = sedes.filter(sede => {
    const matchesSearch = sede.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sede.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sede.manager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || sede.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Gestión de Sedes</h1>
          <p className="text-gray-400">Administra sucursales y ubicaciones</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Sede
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
                  placeholder="Buscar sedes..."
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
                variant={selectedFilter === 'maintenance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('maintenance')}
                className={selectedFilter === 'maintenance' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Mantenimiento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sedes Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Sedes</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredSedes.length} sedes encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSedes.map((sede) => (
              <div key={sede.id} className="p-4 rounded-lg bg-gray-750 border border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{sede.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(sede.status)}`}></div>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {sede.status === 'active' ? 'Activa' : 
                         sede.status === 'maintenance' ? 'Mantenimiento' : 'Inactiva'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{sede.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{sede.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{sede.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{sede.members}/{sede.capacity} miembros</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span>{sede.equipment} equipos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{sede.hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Gerente:</span>
                        <span>{sede.manager}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-green-400 font-medium">${sede.monthlyRevenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-sm">Ocupación:</span>
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(sede.members / sede.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-300 text-sm">
                          {Math.round((sede.members / sede.capacity) * 100)}%
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

      {/* Performance and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Rendimiento por Sede
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
                    <p className="text-white font-medium">Zona 10</p>
                    <p className="text-gray-300 text-sm">127/150 miembros</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">$18,500</p>
                  <p className="text-gray-400 text-xs">84.7% ocupación</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">Zona 15</p>
                    <p className="text-gray-300 text-sm">98/120 miembros</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">$15,200</p>
                  <p className="text-gray-400 text-xs">81.7% ocupación</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">Carretera a El Salvador</p>
                    <p className="text-gray-300 text-sm">67/100 miembros</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">$9,800</p>
                  <p className="text-gray-400 text-xs">67.0% ocupación</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Sedes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium">1 sede en mantenimiento</p>
                <p className="text-gray-400 text-xs">Carretera a El Salvador - Limpieza profunda</p>
              </div>
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20">
                <p className="text-red-400 text-sm font-medium">3 equipos fuera de servicio</p>
                <p className="text-gray-400 text-xs">Zona 15 - Requieren reparación</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/20">
                <p className="text-blue-400 text-sm font-medium">5 contratos próximos a vencer</p>
                <p className="text-gray-400 text-xs">Renovar antes del 31 de enero</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSedes;
