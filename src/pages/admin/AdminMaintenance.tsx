import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Download,
  Activity
} from 'lucide-react';

const AdminMaintenance: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample maintenance data
  const equipment = [
    {
      id: 1,
      name: 'Cinta de Correr #3',
      type: 'Cardio',
      brand: 'Life Fitness',
      model: 'T5',
      location: 'Zona 10 - Piso 1',
      status: 'maintenance_due',
      lastMaintenance: '2024-01-01',
      nextMaintenance: '2024-02-01',
      cost: 150.00,
      issues: ['Banda desgastada', 'Botones no responden']
    },
    {
      id: 2,
      name: 'Pesas Libres Set A',
      type: 'Peso Libre',
      brand: 'Rogue',
      model: 'R-3',
      location: 'Zona 15 - Área Libre',
      status: 'operational',
      lastMaintenance: '2024-01-10',
      nextMaintenance: '2024-04-10',
      cost: 0.00,
      issues: []
    },
    {
      id: 3,
      name: 'Máquina de Remo #2',
      type: 'Cardio',
      brand: 'Concept2',
      model: 'Model D',
      location: 'Zona 10 - Piso 2',
      status: 'out_of_service',
      lastMaintenance: '2023-12-15',
      nextMaintenance: '2024-01-15',
      cost: 300.00,
      issues: ['Motor defectuoso', 'Pantalla no funciona']
    }
  ];

  // KPI data
  const kpis = [
    {
      title: 'Equipos Totales',
      value: '156',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: <Wrench className="w-5 h-5" />
    },
    {
      title: 'Equipos Operativos',
      value: '142',
      change: '+1.2%',
      changeType: 'positive' as const,
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      title: 'Mantenimientos Pendientes',
      value: '8',
      change: '-15.3%',
      changeType: 'negative' as const,
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: 'Costo Mensual',
      value: '$2,450',
      change: '+8.5%',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'maintenance_due': return 'bg-yellow-500';
      case 'out_of_service': return 'bg-red-500';
      case 'repairing': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Cardio': return 'bg-red-500';
      case 'Peso Libre': return 'bg-blue-500';
      case 'Maquinaria': return 'bg-purple-500';
      case 'Accesorios': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Gestión de Mantenimiento</h1>
          <p className="text-gray-400">Administra equipos e inventario</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Equipo
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
                  placeholder="Buscar equipos..."
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
                variant={selectedFilter === 'operational' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('operational')}
                className={selectedFilter === 'operational' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Operativos
              </Button>
              <Button
                variant={selectedFilter === 'maintenance_due' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('maintenance_due')}
                className={selectedFilter === 'maintenance_due' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Mantenimiento
              </Button>
              <Button
                variant={selectedFilter === 'out_of_service' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('out_of_service')}
                className={selectedFilter === 'out_of_service' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Fuera de Servicio
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Inventario de Equipos</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredEquipment.length} equipos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEquipment.map((item) => (
              <div key={item.id} className="p-4 rounded-lg bg-gray-750 border border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <Badge className={`${getTypeColor(item.type)} text-white`}>
                        {item.type}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Marca/Modelo:</span>
                        <span>{item.brand} {item.model}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Último: {item.lastMaintenance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Próximo: {item.nextMaintenance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className={item.cost > 0 ? 'text-yellow-400' : 'text-green-400'}>
                          ${item.cost}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Estado:</span>
                        <span className={item.status === 'operational' ? 'text-green-400' : 
                                        item.status === 'maintenance_due' ? 'text-yellow-400' : 'text-red-400'}>
                          {item.status === 'operational' ? 'Operativo' : 
                           item.status === 'maintenance_due' ? 'Mantenimiento' : 'Fuera de Servicio'}
                        </span>
                      </div>
                    </div>
                    {item.issues.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          <span className="text-gray-400 text-sm">Problemas reportados:</span>
                        </div>
                        <div className="flex gap-1 mt-1">
                          {item.issues.map((issue, index) => (
                            <Badge key={index} variant="outline" className="border-yellow-600 text-yellow-400 text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
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

      {/* Maintenance Schedule and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximos Mantenimientos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Cinta de Correr #3</p>
                  <p className="text-gray-300 text-sm">Zona 10 - Piso 1</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 text-sm">2024-02-01</p>
                  <p className="text-gray-400 text-xs">En 3 días</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Máquina de Remo #2</p>
                  <p className="text-gray-300 text-sm">Zona 10 - Piso 2</p>
                </div>
                <div className="text-right">
                  <p className="text-red-400 text-sm">2024-01-15</p>
                  <p className="text-gray-400 text-xs">Vencido</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Bicicleta Estática #5</p>
                  <p className="text-gray-300 text-sm">Zona 15 - Piso 1</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-sm">2024-02-15</p>
                  <p className="text-gray-400 text-xs">En 17 días</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de Mantenimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20">
                <p className="text-red-400 text-sm font-medium">3 equipos fuera de servicio</p>
                <p className="text-gray-400 text-xs">Requieren reparación urgente</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium">8 mantenimientos vencidos</p>
                <p className="text-gray-400 text-xs">Programar para esta semana</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/20">
                <p className="text-blue-400 text-sm font-medium">5 reparaciones en progreso</p>
                <p className="text-gray-400 text-xs">Técnicos asignados</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminMaintenance;
