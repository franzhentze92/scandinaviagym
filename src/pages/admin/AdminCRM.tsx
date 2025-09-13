import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Megaphone, 
  Users, 
  TrendingUp, 
  MessageSquare,
  Calendar,
  Phone,
  Mail,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  BarChart3
} from 'lucide-react';

const AdminCRM: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Sample leads data
  const leads = [
    {
      id: 1,
      name: 'Roberto Silva',
      email: 'roberto.silva@email.com',
      phone: '+502 1234-5678',
      source: 'Facebook',
      status: 'new',
      interest: 'Premium',
      lastContact: '2024-01-15',
      assignedTo: 'María González',
      notes: 'Interesado en clases de spinning'
    },
    {
      id: 2,
      name: 'Carmen Morales',
      email: 'carmen.morales@email.com',
      phone: '+502 2345-6789',
      source: 'Referido',
      status: 'contacted',
      interest: 'VIP',
      lastContact: '2024-01-14',
      assignedTo: 'Carlos Ruiz',
      notes: 'Viene recomendada por miembro actual'
    },
    {
      id: 3,
      name: 'Diego Herrera',
      email: 'diego.herrera@email.com',
      phone: '+502 3456-7890',
      source: 'Instagram',
      status: 'qualified',
      interest: 'Basic',
      lastContact: '2024-01-13',
      assignedTo: 'Ana Martínez',
      notes: 'Listo para agendar visita'
    }
  ];

  // KPI data
  const kpis = [
    {
      title: 'Leads Totales',
      value: '156',
      change: '+23.5%',
      changeType: 'positive' as const,
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'Nuevos Este Mes',
      value: '34',
      change: '+18.2%',
      changeType: 'positive' as const,
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      title: 'Tasa de Conversión',
      value: '24.5%',
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: <Target className="w-5 h-5" />
    },
    {
      title: 'Campañas Activas',
      value: '8',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <Megaphone className="w-5 h-5" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-green-500';
      case 'converted': return 'bg-purple-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'Facebook': return 'bg-blue-600';
      case 'Instagram': return 'bg-pink-500';
      case 'Referido': return 'bg-green-500';
      case 'Google': return 'bg-red-500';
      case 'Web': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.phone.includes(searchTerm);
    const matchesFilter = selectedFilter === 'all' || lead.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">CRM & Marketing</h1>
          <p className="text-gray-400">Gestiona leads y campañas de marketing</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="bg-gray-700 hover:bg-gray-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Lead
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

      {/* Campaign Performance */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Rendimiento de Campañas
          </CardTitle>
          <CardDescription className="text-gray-400">
            Últimas campañas de marketing activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-gray-750">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Facebook Ads</h4>
                <Badge className="bg-green-500 text-white">Activa</Badge>
              </div>
              <p className="text-gray-400 text-sm mb-2">Leads: 45</p>
              <p className="text-gray-400 text-sm mb-2">Conversión: 18%</p>
              <p className="text-green-400 text-sm font-medium">ROI: 340%</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-750">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Instagram</h4>
                <Badge className="bg-green-500 text-white">Activa</Badge>
              </div>
              <p className="text-gray-400 text-sm mb-2">Leads: 32</p>
              <p className="text-gray-400 text-sm mb-2">Conversión: 22%</p>
              <p className="text-green-400 text-sm font-medium">ROI: 280%</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-750">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Google Ads</h4>
                <Badge className="bg-yellow-500 text-white">Pausada</Badge>
              </div>
              <p className="text-gray-400 text-sm mb-2">Leads: 28</p>
              <p className="text-gray-400 text-sm mb-2">Conversión: 15%</p>
              <p className="text-red-400 text-sm font-medium">ROI: 120%</p>
            </div>
            <div className="p-4 rounded-lg bg-gray-750">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-medium">Email Marketing</h4>
                <Badge className="bg-green-500 text-white">Activa</Badge>
              </div>
              <p className="text-gray-400 text-sm mb-2">Leads: 67</p>
              <p className="text-gray-400 text-sm mb-2">Conversión: 12%</p>
              <p className="text-green-400 text-sm font-medium">ROI: 450%</p>
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
                  placeholder="Buscar leads..."
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
                variant={selectedFilter === 'new' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('new')}
                className={selectedFilter === 'new' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Nuevos
              </Button>
              <Button
                variant={selectedFilter === 'contacted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('contacted')}
                className={selectedFilter === 'contacted' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Contactados
              </Button>
              <Button
                variant={selectedFilter === 'qualified' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('qualified')}
                className={selectedFilter === 'qualified' ? 'bg-gray-600 text-white' : 'border-gray-600 text-gray-300 hover:bg-gray-800'}
              >
                Calificados
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Lista de Leads</CardTitle>
          <CardDescription className="text-gray-400">
            {filteredLeads.length} leads encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="p-4 rounded-lg bg-gray-750 border border-gray-700">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{lead.name}</h3>
                      <Badge className={`${getSourceColor(lead.source)} text-white`}>
                        {lead.source}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(lead.status)}`}></div>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {lead.interest}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{lead.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>Último contacto: {lead.lastContact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>Asignado a: {lead.assignedTo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Estado:</span>
                        <span className={lead.status === 'new' ? 'text-blue-400' : 
                                        lead.status === 'contacted' ? 'text-yellow-400' : 
                                        lead.status === 'qualified' ? 'text-green-400' : 'text-gray-400'}>
                          {lead.status === 'new' ? 'Nuevo' : 
                           lead.status === 'contacted' ? 'Contactado' : 
                           lead.status === 'qualified' ? 'Calificado' : lead.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">Notas:</span>
                        <span className="text-gray-300 text-sm">{lead.notes}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      <Mail className="w-4 h-4" />
                    </Button>
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

      {/* Follow-up Tasks and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Tareas de Seguimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Llamar a Roberto Silva</p>
                  <p className="text-gray-300 text-sm">Interesado en Premium</p>
                </div>
                <div className="text-right">
                  <p className="text-yellow-400 text-sm">Hoy 3:00 PM</p>
                  <Badge variant="outline" className="border-yellow-600 text-yellow-400 text-xs">
                    Pendiente
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Enviar info a Carmen Morales</p>
                  <p className="text-gray-300 text-sm">Plan VIP</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 text-sm">Mañana 10:00 AM</p>
                  <Badge variant="outline" className="border-green-600 text-green-400 text-xs">
                    Programada
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-750">
                <div>
                  <p className="text-white font-medium">Agendar visita con Diego Herrera</p>
                  <p className="text-gray-300 text-sm">Calificado - Listo</p>
                </div>
                <div className="text-right">
                  <p className="text-red-400 text-sm">Vencido</p>
                  <Badge variant="outline" className="border-red-600 text-red-400 text-xs">
                    Urgente
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alertas de CRM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/20">
                <p className="text-yellow-400 text-sm font-medium">5 leads sin contacto por 3+ días</p>
                <p className="text-gray-400 text-xs">Requerir seguimiento inmediato</p>
              </div>
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-500/20">
                <p className="text-red-400 text-sm font-medium">2 leads perdidos esta semana</p>
                <p className="text-gray-400 text-xs">Revisar proceso de seguimiento</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-900/20 border border-blue-500/20">
                <p className="text-blue-400 text-sm font-medium">Campaña Facebook necesita optimización</p>
                <p className="text-gray-400 text-xs">ROI por debajo del objetivo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCRM;
