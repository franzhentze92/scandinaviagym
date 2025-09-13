import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Users,
  DollarSign,
  Activity,
  PieChart,
  LineChart,
  FileText,
  Filter,
  Eye,
  Share2
} from 'lucide-react';

const AdminReports: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Sample report data
  const reports = [
    {
      id: 1,
      name: 'Reporte Mensual de Ingresos',
      type: 'Financial',
      period: 'Enero 2024',
      status: 'ready',
      generatedBy: 'Sistema Automático',
      lastGenerated: '2024-01-15 08:00'
    },
    {
      id: 2,
      name: 'Análisis de Membresías',
      type: 'Membership',
      period: 'Diciembre 2023',
      status: 'ready',
      generatedBy: 'María González',
      lastGenerated: '2024-01-10 14:30'
    },
    {
      id: 3,
      name: 'Rendimiento de Clases',
      type: 'Classes',
      period: 'Semana 2 - Enero 2024',
      status: 'generating',
      generatedBy: 'Carlos Ruiz',
      lastGenerated: '2024-01-14 16:45'
    }
  ];

  // KPI data for dashboard
  const kpis = [
    {
      title: 'Reportes Generados',
      value: '24',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: 'Vistas Este Mes',
      value: '156',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <Eye className="w-5 h-5" />
    },
    {
      title: 'Exportaciones',
      value: '89',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <Download className="w-5 h-5" />
    },
    {
      title: 'Reportes Automáticos',
      value: '8',
      change: '+25%',
      changeType: 'positive' as const,
      icon: <Activity className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500';
      case 'generating': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Financial': return 'bg-green-500';
      case 'Membership': return 'bg-blue-500';
      case 'Classes': return 'bg-purple-500';
      case 'Staff': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Reportes & Análisis</h1>
          <p className="text-gray-400">Análisis ejecutivo y reportes del sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Nuevo Reporte
          </Button>
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <Download className="w-4 h-4 mr-2" />
            Exportar Todo
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

      {/* Quick Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Ingresos por Período
            </CardTitle>
            <CardDescription className="text-gray-400">
              Últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-750 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Gráfico de ingresos</p>
                <p className="text-gray-500 text-sm">Integrar con librería de gráficos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Distribución de Membresías
            </CardTitle>
            <CardDescription className="text-gray-400">
              Por tipo de membresía
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-750 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Gráfico circular</p>
                <p className="text-gray-500 text-sm">Integrar con librería de gráficos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Templates */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Plantillas de Reportes
          </CardTitle>
          <CardDescription className="text-gray-400">
            Reportes predefinidos disponibles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-gray-750 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Reporte Financiero</h4>
                <Badge className="bg-green-500 text-white">Listo</Badge>
              </div>
              <p className="text-gray-400 text-sm mb-3">Ingresos, gastos y análisis financiero</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-750 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Análisis de Miembros</h4>
                <Badge className="bg-green-500 text-white">Listo</Badge>
              </div>
              <p className="text-gray-400 text-sm mb-3">Estadísticas de membresías y retención</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-gray-750 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Rendimiento de Clases</h4>
                <Badge className="bg-yellow-500 text-white">Generando</Badge>
              </div>
              <p className="text-gray-400 text-sm mb-3">Ocupación y popularidad de clases</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Download className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Reportes Recientes</CardTitle>
          <CardDescription className="text-gray-400">
            Últimos reportes generados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 rounded-lg bg-gray-750 border border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{report.name}</h3>
                      <Badge className={`${getTypeColor(report.type)} text-white`}>
                        {report.type}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`}></div>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {report.period}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>Generado por: {report.generatedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Última vez: {report.lastGenerated}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Estado:</span>
                        <span className={report.status === 'ready' ? 'text-green-400' : 
                                        report.status === 'generating' ? 'text-yellow-400' : 'text-red-400'}>
                          {report.status === 'ready' ? 'Listo' : 
                           report.status === 'generating' ? 'Generando' : 'Error'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Reportes Programados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Reporte Semanal de Ingresos</p>
                  <p className="text-gray-300 text-sm">Cada lunes a las 8:00 AM</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500 text-white">Activo</Badge>
                  <p className="text-gray-400 text-xs mt-1">Próximo: 22 Ene</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Análisis Mensual de Miembros</p>
                  <p className="text-gray-300 text-sm">Primer día de cada mes</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-500 text-white">Activo</Badge>
                  <p className="text-gray-400 text-xs mt-1">Próximo: 1 Feb</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Reporte de Mantenimiento</p>
                  <p className="text-gray-300 text-sm">Cada viernes a las 6:00 PM</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-yellow-500 text-white">Pausado</Badge>
                  <p className="text-gray-400 text-xs mt-1">Sin programar</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Estadísticas de Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-300">Reportes Financieros</span>
                </div>
                <span className="text-white font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-300">Análisis de Miembros</span>
                </div>
                <span className="text-white font-medium">28%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-300">Rendimiento de Clases</span>
                </div>
                <span className="text-white font-medium">18%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-300">Reportes de Staff</span>
                </div>
                <span className="text-white font-medium">9%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
