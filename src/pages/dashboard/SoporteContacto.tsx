import React, { useState, useEffect } from 'react';
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
  MessageSquare,
  Video,
  Camera,
  Paperclip,
  ClipboardList,
  Activity,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSupportTickets, createSupportTicket } from '@/services/database';
import { type SupportTicket } from '@/types/database';
import { toast } from '@/components/ui/use-toast';

const SoporteContacto: React.FC = () => {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState('faq');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: '', category: '', message: '', priority: 'Media' as 'Baja' | 'Media' | 'Alta' });
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const faqCategories = [
    { id: 'todas', name: 'Todas', icon: HelpCircle, color: '#b5fc00' },
    { id: 'membresia', name: 'Membresía', icon: FileText, color: '#42a5f5' },
    { id: 'clases', name: 'Clases', icon: Calendar, color: '#ff6b6b' },
    { id: 'evaluaciones', name: 'Evaluaciones', icon: ClipboardList, color: '#9c27b0' },
    { id: 'rutinas', name: 'Rutinas', icon: Activity, color: '#00bcd4' },
    { id: 'pagos', name: 'Pagos', icon: FileText, color: '#66bb6a' },
    { id: 'tecnico', name: 'Técnico', icon: Settings, color: '#ffa726' },
    { id: 'general', name: 'General', icon: Info, color: '#ab47bc' }
  ];

  const faqItems = [
    {
      id: 1,
      category: 'membresia',
      question: '¿Cómo puedo suscribirme a un plan de membresía?',
      answer: 'Ve a la sección "Mi Membresía" en el menú lateral. Allí verás todos los planes disponibles con sus precios y características. Selecciona el plan que prefieras y haz clic en "Seleccionar Plan". Completa el formulario de suscripción seleccionando la sede, método de pago y aplicando un cupón de promoción si tienes uno.',
      helpful: 45
    },
    {
      id: 2,
      category: 'membresia',
      question: '¿Puedo cambiar de plan después de suscribirme?',
      answer: 'Sí, puedes cambiar de plan en cualquier momento. Ve a "Mi Membresía" y selecciona un nuevo plan. El cambio se aplicará en tu próximo ciclo de facturación. Si cambias a un plan más costoso, se prorrateará la diferencia.',
      helpful: 32
    },
    {
      id: 3,
      category: 'membresia',
      question: '¿Qué incluye el plan PLUS?',
      answer: 'El plan PLUS incluye acceso a todas las sedes de Scandinavia Gym, sin restricciones de ubicación. Además, incluye todas las características premium de los otros planes. Es ideal si te mueves frecuentemente entre diferentes zonas.',
      helpful: 28
    },
    {
      id: 4,
      category: 'membresia',
      question: '¿Cómo aplico un cupón de promoción?',
      answer: 'Al seleccionar un plan en "Mi Membresía", verás las promociones activas con sus cupones. Copia el código del cupón y pégalo en el campo "Cupón" del formulario de suscripción. El descuento se aplicará automáticamente al confirmar tu suscripción.',
      helpful: 19
    },
    {
      id: 5,
      category: 'clases',
      question: '¿Cómo reservo una clase?',
      answer: 'Ve a "Clases & Reservas" en el menú. Verás el calendario con todas las clases disponibles. Selecciona la fecha y la clase que deseas, luego haz clic en "Reservar". Recibirás una confirmación y podrás ver tu reserva en la pestaña "Mis Reservas".',
      helpful: 52
    },
    {
      id: 6,
      category: 'clases',
      question: '¿Puedo cancelar una reserva de clase?',
      answer: 'Sí, puedes cancelar una reserva hasta 2 horas antes del inicio de la clase. Ve a "Clases & Reservas" > "Mis Reservas", encuentra la clase que deseas cancelar y haz clic en "Cancelar". Las cancelaciones tardías pueden afectar tu historial de asistencia.',
      helpful: 38
    },
    {
      id: 7,
      category: 'clases',
      question: '¿Qué pasa si no asisto a una clase reservada?',
      answer: 'Si no cancelas tu reserva con al menos 2 horas de anticipación y no asistes, se marcará como "no asistencia". Múltiples no asistencias pueden limitar tu capacidad de reservar clases en el futuro. Te recomendamos cancelar siempre que no puedas asistir.',
      helpful: 24
    },
    {
      id: 8,
      category: 'evaluaciones',
      question: '¿Qué es una evaluación clínica?',
      answer: 'Las evaluaciones clínicas son evaluaciones físicas completas que incluyen medidas corporales (altura, peso, IMC), antecedentes médicos, y condición física. Estas evaluaciones ayudan a nuestros instructores a crear rutinas personalizadas y seguras para ti.',
      helpful: 31
    },
    {
      id: 9,
      category: 'evaluaciones',
      question: '¿Con qué frecuencia debo realizarme una evaluación clínica?',
      answer: 'Recomendamos realizar una evaluación clínica cada 3-6 meses para monitorear tu progreso. Puedes ver todas tus evaluaciones anteriores en la sección "Mis Evaluaciones" del menú lateral.',
      helpful: 15
    },
    {
      id: 10,
      category: 'rutinas',
      question: '¿Cómo veo mi rutina de entrenamiento?',
      answer: 'Ve a "Mis Rutinas" en el menú lateral. Allí encontrarás todas las rutinas que han sido creadas para ti por nuestros instructores. Cada rutina incluye ejercicios detallados con series, repeticiones, peso e intensidad recomendada.',
      helpful: 27
    },
    {
      id: 11,
      category: 'rutinas',
      question: '¿Puedo modificar mi rutina?',
      answer: 'Las rutinas son creadas por nuestros instructores basándose en tu evaluación clínica. Si necesitas ajustes, contacta con tu instructor o con el personal de la sede. No recomendamos modificar las rutinas sin supervisión profesional.',
      helpful: 18
    },
    {
      id: 12,
      category: 'pagos',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos pagos con tarjeta de crédito o débito. El pago se procesa de forma segura y automática según la frecuencia de tu plan (mensual, trimestral, semestral o anual). También puedes configurar el débito automático para mayor comodidad.',
      helpful: 41
    },
    {
      id: 13,
      category: 'pagos',
      question: '¿Cómo cambio mi método de pago?',
      answer: 'Ve a "Mi Membresía" > "Configuración de Pagos" y haz clic en "Cambiar método de pago". Ingresa los datos de tu nueva tarjeta. El cambio se aplicará para los próximos pagos automáticos.',
      helpful: 22
    },
    {
      id: 14,
      category: 'tecnico',
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Ve a "Mi Perfil" en el menú lateral, luego a la pestaña "Seguridad". Allí encontrarás la opción "Cambiar Contraseña". Ingresa tu contraseña actual y la nueva contraseña. Asegúrate de usar una contraseña segura con al menos 8 caracteres.',
      helpful: 16
    },
    {
      id: 15,
      category: 'tecnico',
      question: '¿Cómo actualizo mi información personal?',
      answer: 'Ve a "Mi Perfil" y haz clic en el botón "Editar". Podrás actualizar tu nombre, teléfono, fecha de nacimiento, género, dirección y contacto de emergencia. Recuerda guardar los cambios al finalizar.',
      helpful: 14
    },
    {
      id: 16,
      category: 'general',
      question: '¿Cuáles son los horarios de las sedes?',
      answer: 'Todas nuestras sedes están abiertas de lunes a viernes de 5:00 AM a 10:00 PM, sábados de 6:00 AM a 8:00 PM y domingos de 7:00 AM a 6:00 PM. Los horarios pueden variar ligeramente por sede, consulta la información específica en la sección "Sedes" de esta página.',
      helpful: 48
    },
    {
      id: 17,
      category: 'general',
      question: '¿Puedo usar cualquier sede con mi membresía?',
      answer: 'Depende de tu plan. Si tienes el plan PLUS, tienes acceso a todas las sedes sin restricciones. Los otros planes están asociados a una sede específica, aunque puedes visitar otras sedes ocasionalmente. Consulta los detalles de tu plan en "Mi Membresía".',
      helpful: 35
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
      name: 'Zona 1',
      address: '6ta avenida. 12-51 centro Capitol, zona 1. Local 106.',
      phone: '+502 2251-4000',
      email: 'zona1@scandinaviagym.com',
      hours: 'Lun-Vie: 5:00-22:00, Sáb-Dom: 6:00-20:00'
    },
    {
      id: 2,
      name: 'Zona 2',
      address: '3ª avenida final, 17-36, zona 2, El Zapote, Guatemala',
      phone: '+502 2251-4010',
      email: 'zona2@scandinaviagym.com',
      hours: 'Lun-Vie: 5:00-22:00, Sáb-Dom: 6:00-20:00'
    },
    {
      id: 3,
      name: 'Zona 6',
      address: '15 avenida lote 2, Col. Santa Isabel zona 6 frente al Estadio Cementos Progreso',
      phone: '+502 2251-4020',
      email: 'zona6@scandinaviagym.com',
      hours: 'Lun-Vie: 5:00-22:00, Sáb-Dom: 6:00-20:00'
    },
    {
      id: 4,
      name: 'Zona 12',
      address: 'Calzada Aguilar Batres 15-07, zona 12',
      phone: '+502 2251-4030',
      email: 'zona12@scandinaviagym.com',
      hours: 'Lun-Vie: 5:00-22:00, Sáb-Dom: 6:00-20:00'
    },
    {
      id: 5,
      name: 'Carr. a El Salvador (El Faro)',
      address: 'Caserio la Laguna, km 17.5 carretera a San Jose Pinula lote 8',
      phone: '+502 2251-4040',
      email: 'elsalvador@scandinaviagym.com',
      hours: 'Lun-Vie: 5:00-22:00, Sáb-Dom: 6:00-20:00'
    },
    {
      id: 6,
      name: 'Quetzaltenango (Xela)',
      address: 'Avenida Las Américas 11-50 Zona 3 Condado Santa María Local 8',
      phone: '+502 2251-4050',
      email: 'xela@scandinaviagym.com',
      hours: 'Lun-Vie: 5:00-22:00, Sáb-Dom: 6:00-20:00'
    },
    {
      id: 7,
      name: 'San José Pinula',
      address: '2ª avenida, 2-34 zona 1, San José Pinula',
      phone: '+502 2251-4060',
      email: 'pinula@scandinaviagym.com',
      hours: 'Lun-Vie: 5:00-22:00, Sáb-Dom: 6:00-20:00'
    },
    {
      id: 8,
      name: 'Villa Nueva Punto Vivo',
      address: '0 calle 15-70 calle Real Zona 10 de San Miguel Petapa',
      phone: '+502 2251-4070',
      email: 'villanueva@scandinaviagym.com',
      hours: 'Lun-Vie: 5:00-22:00, Sáb-Dom: 6:00-20:00'
    }
  ];

  // Load tickets when component mounts or tab changes to tickets
  useEffect(() => {
    if (user && selectedTab === 'tickets') {
      loadTickets();
    }
  }, [user, selectedTab]);

  const loadTickets = async () => {
    if (!user) return;
    
    setLoadingTickets(true);
    try {
      const userTickets = await getSupportTickets(user.id);
      setTickets(userTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los tickets. Por favor, intenta de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleSubmitTicket = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Debes estar autenticado para enviar un ticket.',
        variant: 'destructive'
      });
      return;
    }

    if (!newTicket.subject.trim() || !newTicket.category || !newTicket.message.trim()) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor completa todos los campos del formulario.',
        variant: 'destructive'
      });
      return;
    }

    setSubmittingTicket(true);
    try {
      const ticket = await createSupportTicket(user.id, {
        subject: newTicket.subject.trim(),
        category: newTicket.category,
        message: newTicket.message.trim(),
        priority: newTicket.priority
      });

      if (ticket) {
        // Reset form
        setNewTicket({ subject: '', category: '', message: '', priority: 'Media' });
        setShowTicketForm(false);
        setShowSuccessMessage(true);
        
        // Reload tickets
        await loadTickets();
        
        toast({
          title: 'Ticket enviado',
          description: 'Tu ticket ha sido enviado exitosamente. El gimnasio se pondrá en contacto contigo pronto.',
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 5000);
      } else {
        throw new Error('No se pudo crear el ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el ticket. Por favor, intenta de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setSubmittingTicket(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Abierto';
      case 'in_progress': return 'En Proceso';
      case 'resolved': return 'Resuelto';
      case 'closed': return 'Cerrado';
      default: return status;
    }
  };

  const filteredFaq = faqItems.filter(item => {
    const categoryMatch = selectedCategory === 'todas' || item.category === selectedCategory;
    const searchMatch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
      case 'Abierto': return 'text-yellow-400 bg-yellow-900/20';
      case 'in_progress':
      case 'En Proceso': return 'text-blue-400 bg-blue-900/20';
      case 'resolved':
      case 'Resuelto': return 'text-green-400 bg-green-900/20';
      case 'closed':
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
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden max-w-full w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Soporte & Contacto</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Encuentra ayuda y contacta con nuestro equipo</p>
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
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">Preguntas Frecuentes</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar en FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-auto pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
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
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 text-xs sm:text-sm ${
                      selectedCategory === category.id
                        ? 'text-black'
                        : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
                    }`}
                    style={selectedCategory === category.id ? {backgroundColor: category.color} : {}}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* FAQ Items */}
            <div className="space-y-3 sm:space-y-4">
              {filteredFaq.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No se encontraron preguntas que coincidan con tu búsqueda</p>
                </div>
              ) : (
                filteredFaq.map(item => (
                  <div key={item.id} className="bg-gray-700 rounded-lg p-3 sm:p-4 border border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h4 className="text-white font-medium text-sm sm:text-base flex-1">{item.question}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-gray-400 text-xs sm:text-sm">{item.helpful} útiles</span>
                        <button className="p-1 text-gray-400 hover:text-white transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">{item.answer}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tickets */}
        {selectedTab === 'tickets' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-lg sm:text-xl font-bold text-white">Mis Tickets</h3>
              <button 
                onClick={() => setShowTicketForm(!showTicketForm)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg font-medium transition-colors text-black flex items-center justify-center gap-2 text-sm sm:text-base" 
                style={{backgroundColor: '#b5fc00'}}
              >
                <Plus className="w-4 h-4" />
                {showTicketForm ? 'Cancelar' : 'Nuevo Ticket'}
              </button>
            </div>

            {/* Success Message */}
            {showSuccessMessage && (
              <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-green-400 font-medium mb-1">¡Ticket enviado exitosamente!</p>
                  <p className="text-gray-300 text-sm">
                    Tu ticket ha sido recibido. El gimnasio se pondrá en contacto contigo pronto a través del correo electrónico o teléfono registrado en tu perfil.
                  </p>
                </div>
                <button 
                  onClick={() => setShowSuccessMessage(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* New Ticket Form */}
            {showTicketForm && (
              <div className="bg-gray-700 rounded-lg p-4 sm:p-6 border border-gray-600">
                <h4 className="text-white font-medium mb-4">Crear Nuevo Ticket</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Asunto *</label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 text-sm sm:text-base"
                      placeholder="Describe brevemente tu consulta"
                      disabled={submittingTicket}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 text-sm sm:text-base"
                      disabled={submittingTicket}
                    >
                      <option value="">Seleccionar categoría</option>
                      <option value="membresia">Membresía</option>
                      <option value="clases">Clases</option>
                      <option value="evaluaciones">Evaluaciones</option>
                      <option value="rutinas">Rutinas</option>
                      <option value="pagos">Pagos</option>
                      <option value="tecnico">Técnico</option>
                      <option value="general">General</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prioridad</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as 'Baja' | 'Media' | 'Alta'})}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 text-sm sm:text-base"
                      disabled={submittingTicket}
                    >
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mensaje *</label>
                  <textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-gray-400 text-sm sm:text-base"
                    placeholder="Describe tu problema o consulta en detalle..."
                    disabled={submittingTicket}
                  />
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSubmitTicket}
                    disabled={submittingTicket}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center gap-2 text-sm sm:text-base"
                  >
                    {submittingTicket ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Enviar Ticket
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => {
                      setShowTicketForm(false);
                      setNewTicket({ subject: '', category: '', message: '', priority: 'Media' });
                    }}
                    disabled={submittingTicket}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* My Tickets */}
            <div className="space-y-3">
              {loadingTickets ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-12 bg-gray-700 rounded-lg border border-gray-600">
                  <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 mb-2">No tienes tickets aún</p>
                  <p className="text-gray-500 text-sm">Crea un nuevo ticket para contactar con soporte</p>
                </div>
              ) : (
                tickets.map(ticket => (
                  <div key={ticket.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-gray-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm sm:text-base mb-1">{ticket.subject}</p>
                          <p className="text-gray-400 text-xs sm:text-sm mb-2">{ticket.category} • {formatDate(ticket.created_at)}</p>
                          <p className="text-gray-300 text-xs sm:text-sm line-clamp-2">{ticket.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(ticket.status)}`}>
                          {getStatusLabel(ticket.status)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Sedes */}
        {selectedTab === 'sedes' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Nuestras Sedes</h3>
              <p className="text-gray-400 text-sm">Contacta directamente con la sede de tu preferencia</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sedes.map(sede => (
                <div key={sede.id} className="bg-gray-700 rounded-xl p-4 sm:p-6 border border-gray-600 hover:border-gray-500 transition-colors">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" style={{color: '#b5fc00'}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-base sm:text-lg mb-1">{sede.name}</h4>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">{sede.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a 
                        href={`tel:${sede.phone.replace(/\s/g, '')}`}
                        className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors"
                      >
                        {sede.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <a 
                        href={`mailto:${sede.email}`}
                        className="text-gray-300 text-xs sm:text-sm hover:text-white transition-colors break-all"
                      >
                        {sede.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-300 text-xs sm:text-sm">{sede.hours}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoporteContacto;