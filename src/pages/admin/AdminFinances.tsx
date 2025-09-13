import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit
} from 'lucide-react';

const AdminFinances: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample financial data
  const transactions = [
    {
      id: 1,
      type: 'membership',
      description: 'Membresía Premium - María González',
      amount: 89.99,
      status: 'completed',
      date: '2024-01-15',
      method: 'Tarjeta de Crédito',
      sede: 'Zona 10'
    },
    {
      id: 2,
      type: 'class',
      description: 'Clase Spinning - Juan Pérez',
      amount: 15.00,
      status: 'completed',
      date: '2024-01-15',
      method: 'Efectivo',
      sede: 'Zona 15'
    },
    {
      id: 3,
      type: 'membership',
      description: 'Membresía VIP - Laura Rodríguez',
      amount: 149.99,
      status: 'pending',
      date: '2024-01-15',
      method: 'Transferencia',
      sede: 'Zona 10'
    }
  ];

  // KPI data
  const kpis = [
    {
      title: 'Ingresos del Mes',
      value: '$45,230',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: <DollarSign className="w-5 h-5" />
    },
    {
      title: 'Transacciones',
      value: '1,247',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      title: 'Pagos Pendientes',
      value: '$2,340',
      change: '-8.2%',
      changeType: 'negative' as const,
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: 'Promedio por Transacción',
      value: '$36.25',
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'membership': return 'bg-blue-500';
      case 'class': return 'bg-green-500';
      case 'refund': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.sede.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || transaction.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Gestión Financiera</h1>
          <p className="text-gray-400">Administra ingresos, pagos y transacciones</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Transacción
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

      {/* Revenue Chart Placeholder */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Ingresos por Período</CardTitle>
          <CardDescription className="text-gray-400">
            Evolución de ingresos en los últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-750 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Gráfico de ingresos</p>
              <p className="text-gray-500 text-sm">Integrar con librería de gráficos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar transacciones..."
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
                variant={selectedFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('completed')}
                className={selectedFilter === 'completed' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Completadas
              </Button>
              <Button
                variant={selectedFilter === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('pending')}
                className={selectedFilter === 'pending' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Pendientes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Transacciones Recientes</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredTransactions.length} transacciones encontradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-4 rounded-lg bg-gray-750 border border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{transaction.description}</h3>
                      <Badge className={`${getTypeColor(transaction.type)} text-white`}>
                        {transaction.type}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(transaction.status)}`}></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Monto:</span>
                        <span className="text-green-400 font-medium">${transaction.amount}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{transaction.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span>{transaction.method}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Sede:</span>
                        <span>{transaction.sede}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Estado:</span>
                        <span className={transaction.status === 'completed' ? 'text-green-400' : 
                                        transaction.status === 'pending' ? 'text-yellow-400' : 'text-red-400'}>
                          {transaction.status === 'completed' ? 'Completada' : 
                           transaction.status === 'pending' ? 'Pendiente' : 'Fallida'}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Ingresos por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-300">Membresías</span>
                </div>
                <span className="text-white font-medium">$32,450 (71.8%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-300">Clases Individuales</span>
                </div>
                <span className="text-white font-medium">$8,230 (18.2%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-300">Productos</span>
                </div>
                <span className="text-white font-medium">$3,550 (7.9%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span className="text-gray-300">Servicios</span>
                </div>
                <span className="text-white font-medium">$1,000 (2.1%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas Financieras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium">23 pagos pendientes</p>
                <p className="text-gray-400 text-xs">Total: $2,340</p>
              </div>
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20">
                <p className="text-red-400 text-sm font-medium">5 pagos vencidos</p>
                <p className="text-gray-400 text-xs">Total: $890</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/20">
                <p className="text-blue-400 text-sm font-medium">3 reembolsos pendientes</p>
                <p className="text-gray-400 text-xs">Total: $450</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFinances;
