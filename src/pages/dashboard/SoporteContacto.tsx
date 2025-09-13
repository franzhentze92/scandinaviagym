import React, { useState } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Search,
  HelpCircle,
  FileText,
  Send,
  Download,
  Share2,
  Plus,
  Minus,
  CheckCircle,
  X,
  AlertTriangle,
  Info,
  ExternalLink,
  Calendar,
  User,
  Tag,
  Filter,
  Bell,
  Settings,
  Headphones,
  MessageSquare,
  Video,
  Camera,
  Paperclip
} from 'lucide-react';

const SoporteContacto: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('faq');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: '', message: '' });

  const faqCategories = [
    { id: 'todas', name: 'Todas', icon: HelpCircle, color: '#b5fc00' },
    { id: 'membresia', name: 'Membresía', icon: FileText, color: '#42a5f5' },
    { id: 'clases', name: 'Clases', icon: Calendar, color: '#ff6b6b' },
    { id: 'pagos', name: 'Pagos', icon: FileText, color: '#66bb6a' },
    { id: 'tecnico', name: 'Técnico', icon: Settings, color: '#ffa726' },
    { id: 'general', name: 'General', icon: Info, color: '#ab47bc' }
  ];

  const faqItems = [
    {
      id: 1,
      category: 'membresia',
      question: '¿Cómo puedo congelar mi membresía?',
      answer: 'Puedes congelar tu membresía hasta 3 meses al año. Ve a "Mi Membresía" > "Congelar" y selecciona las fechas. La congelación se aplica desde el próximo ciclo de facturación.',
      helpful: 24
    },
    {
      id: 2,
      category: 'clases',
      question: '¿Puedo cancelar una reserva de clase?',
      answer: 'Sí, puedes cancelar hasta 2 horas antes de la clase. Ve a "Clases & Reservas" > "Mis Reservas" y haz clic en "Cancelar". Las cancelaciones tardías pueden afectar tu historial.',
      helpful: 18
    },
    {
      id: 3,
      category: 'pagos',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos Visa Cuotas, tarjetas de crédito/débito, efectivo en sede y transferencias bancarias. Todos los pagos son seguros y encriptados.',
      helpful: 31
    },
    {
      id: 4,
      category: 'tecnico',
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a "Mi Perfil" > "Seguridad" > "Cambiar Contraseña". Ingresa tu contraseña actual y la nueva. Asegúrate de usar una contraseña segura.',
      helpful: 12
    },
    {
      id: 5,
      category: 'general',
      question: '¿Cuáles son los horarios de las sedes?',
      answer: 'Todas nuestras sedes están abiertas de lunes a viernes de 5:00 AM a 10:00 PM, sábados de 6:00 AM a 8:00 PM y domingos de 7:00 AM a 6:00 PM.',
      helpful: 45
    },
    {
      id: 6,
      category: 'membresia',
      question: '¿Puedo transferir mi membresía a otra persona?',
      answer: 'Las membresías no son transferibles. Sin embargo, puedes invitar a un amigo con tu beneficio de invitado mensual incluido en tu plan.',
      helpful: 8
    }
  ];

  const contactMethods = [
    {
      id: 1,
      type: 'chat',
      title: 'Chat en Vivo',
      description: 'Respuesta inmediata',
      icon: MessageCircle,
      color: '#42a5f5',
      available: true,
      responseTime: 'Inmediato'
    },
    {
      id: 2,
      type: 'whatsapp',
      title: 'WhatsApp',
      description: 'Soporte 24/7',
      icon: MessageSquare,
      color: '#25d366',
      available: true,
      responseTime: '< 5 min'
    },
    {
      id: 3,
      type: 'phone',
      title: 'Llamada',
      description: 'Atención personalizada',
      icon: Phone,
      color: '#ff6b6b',
      available: true,
      responseTime: 'Inmediato'
    },
    {
      id: 4,
      type: 'email',
      title: 'Email',
      description: 'Seguimiento detallado',
      icon: Mail,
      color: '#ffa726',
      available: true,
      responseTime: '< 2 horas'
    }
  ];

  const sedes = [
    {
      id: 1,
      name: 'Zona 10',
      address: '15 Calle 1-25, Zona 10, Guatemala',
      phone: '+502 2222-0001',
      hours: '5:00 AM - 10:00 PM',
      manager: 'María González'
    },
    {
      id: 2,
      name: 'Zona 15',
      address: '12 Avenida 15-30, Zona 15, Guatemala',
      phone: '+502 2222-0002',
      hours: '5:00 AM - 10:00 PM',
      manager: 'Carlos Ruiz'
    },
    {
      id: 3,
      name: 'Carretera a El Salvador',
      address: 'Km 12.5 Carretera a El Salvador',
      phone: '+502 2222-0003',
      hours: '5:00 AM - 10:00 PM',
      manager: 'Ana Martínez'
    }
  ];

  const myTickets = [
    {
      id: 1,
      subject: 'Problema con reserva de clase',
      category: 'Clases',
      status: 'Abierto',
      priority: 'Media',
      date: '2024-08-15',
      lastUpdate: '2024-08-15'
    },
    {
      id: 2,
      subject: 'Consulta sobre membresía',
      category: 'Membresía',
      status: 'Resuelto',
      priority: 'Baja',
      date: '2024-08-10',
      lastUpdate: '2024-08-12'
    }
  ];

  const filteredFaq = faqItems.filter(item => {
    const categoryMatch = selectedCategory === 'todas' || item.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Abierto': return 'text-yellow-400 bg-yellow-900/20';
      case 'Resuelto': return 'text-green-400 bg-green-900/20';
      case 'Cerrado': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-400 bg-red-900/20';
      case 'Media': return 'text-yellow-400 bg-yellow-900/20';
      case 'Baja': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Soporte & Contacto</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Encuentra ayuda y contacta con nuestro equipo</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-xs sm:text-sm">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar</span>
          </button>
          <button className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-xs sm:text-sm">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Formas de Contacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map(method => {
            const Icon = method.icon;
            return (
              <button
                key={method.id}
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                onClick={() => method.type === 'chat' && setShowChat(true)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: method.color + '20'}}>
                    <Icon className="w-5 h-5" style={{color: method.color}} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{method.title}</h4>
                    <p className="text-gray-400 text-sm">{method.responseTime}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm">{method.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex gap-2 mb-6">
          {['faq', 'tickets', 'sedes'].map(tab => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedTab === tab
                  ? 'text-black'
                  : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
              }`}
              style={selectedTab === tab ? {backgroundColor: '#b5fc00'} : {}}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* FAQ */}
        {selectedTab === 'faq' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Preguntas Frecuentes</h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar en FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {faqCategories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? 'text-black'
                        : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                    }`}
                    style={selectedCategory === category.id ? {backgroundColor: category.color} : {}}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* FAQ Items */}
            <div className="space-y-4">
              {filteredFaq.map(item => (
                <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium">{item.question}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{item.helpful} útiles</span>
                      <button className="p-1 text-gray-400 hover:text-white transition-colors">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tickets */}
        {selectedTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Mis Tickets</h3>
              <button className="px-4 py-2 rounded-lg font-medium transition-colors text-black flex items-center gap-2" style={{backgroundColor: '#b5fc00'}}>
                <Plus className="w-4 h-4" />
                Nuevo Ticket
              </button>
            </div>

            {/* New Ticket Form */}
            <div className="bg-gray-700 rounded-lg p-6">
              <h4 className="text-white font-medium mb-4">Crear Nuevo Ticket</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Asunto</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400"
                    placeholder="Describe brevemente tu consulta"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="membresia">Membresía</option>
                    <option value="clases">Clases</option>
                    <option value="pagos">Pagos</option>
                    <option value="tecnico">Técnico</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje</label>
                <textarea
                  value={newTicket.message}
                  onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400"
                  placeholder="Describe tu problema o consulta en detalle..."
                />
              </div>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                <Send className="w-4 h-4" />
                Enviar Ticket
              </button>
            </div>

            {/* My Tickets */}
            <div className="space-y-3">
              {myTickets.map(ticket => (
                <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{ticket.subject}</p>
                      <p className="text-gray-400 text-sm">{ticket.category} • {ticket.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sedes */}
        {selectedTab === 'sedes' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Información de Sedes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sedes.map(sede => (
                <div key={sede.id} className="bg-gray-700 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                      <MapPin className="w-5 h-5" style={{color: '#b5fc00'}} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{sede.name}</h4>
                      <p className="text-gray-400 text-sm">Gerente: {sede.manager}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{sede.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{sede.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{sede.hours}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm transition-colors">
                      Llamar
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg text-sm transition-colors">
                      WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Headphones className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Chat en Vivo</span>
            </div>
            <p className="text-gray-400 text-sm">Habla con un agente ahora</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Manual de Usuario</span>
            </div>
            <p className="text-gray-400 text-sm">Guía completa de la plataforma</p>
          </button>
          
          <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5" style={{color: '#b5fc00'}} />
              <span className="text-white font-medium">Notificaciones</span>
            </div>
            <p className="text-gray-400 text-sm">Configurar alertas de soporte</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoporteContacto;