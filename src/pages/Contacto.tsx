import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send, 
  User, 
  Calendar, 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  Heart,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MessageCircle,
  Headphones,
  Globe,
  Navigation as NavigationIcon
} from 'lucide-react';

const Contacto: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  useScrollToTop();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    membershipInterest: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: <Phone className="w-8 h-8" />,
      title: 'Llamada Telefónica',
      description: 'Habla directamente con nuestro equipo',
      contact: '1500 SCANDI (722634)',
      availability: 'Lunes a Domingo: 4:30 AM - 10:00 PM',
      action: 'Llamar Ahora',
      color: 'green'
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Correo Electrónico',
      description: 'Envíanos un mensaje detallado',
      contact: 'info@scandinavia.com.gt',
      availability: 'Respuesta en 24 horas',
      action: 'Enviar Email',
      color: 'blue'
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'WhatsApp',
      description: 'Chatea con nosotros instantáneamente',
      contact: '+502 5555-1234',
      availability: 'Lunes a Viernes: 8:00 AM - 8:00 PM',
      action: 'Chatear',
      color: 'green'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Visita Presencial',
      description: 'Ven a conocernos en persona',
      contact: '14 sedes en Guatemala',
      availability: 'Horarios de cada sede',
      action: 'Ver Sedes',
      color: 'purple'
    }
  ];

  const locations = [
    {
      name: 'Scandinavia Centro',
      address: 'Zona 1, Ciudad de Guatemala',
      phone: '2251-4000',
      hours: '4:30 - 22:00',
      features: ['Piscina', 'Estacionamiento', 'Clases'],
      isMain: true
    },
    {
      name: 'Scandinavia Zona 10',
      address: 'Zona 10, Ciudad de Guatemala',
      phone: '2251-4010',
      hours: '5:00 - 22:00',
      features: ['Piscina', 'Estacionamiento', 'Clases'],
      isMain: false
    },
    {
      name: 'Scandinavia Mixco',
      address: 'Mixco, Guatemala',
      phone: '2251-4020',
      hours: '4:30 - 22:00',
      features: ['Estacionamiento', 'Clases'],
      isMain: false
    },
    {
      name: 'Scandinavia Villa Nueva',
      address: 'Villa Nueva, Guatemala',
      phone: '2251-4030',
      hours: '5:00 - 21:30',
      features: ['Piscina', 'Estacionamiento', 'Clases'],
      isMain: false
    }
  ];

  const departments = [
    {
      name: 'Atención al Cliente',
      email: 'atencion@scandinavia.com.gt',
      phone: '1500 SCANDI',
      description: 'Resuelve dudas sobre membresías, horarios y servicios'
    },
    {
      name: 'Ventas',
      email: 'ventas@scandinavia.com.gt',
      phone: '2251-4000',
      description: 'Información sobre planes, promociones y nuevos miembros'
    },
    {
      name: 'Soporte Técnico',
      email: 'soporte@scandinavia.com.gt',
      phone: '2251-4001',
      description: 'Ayuda con la app, reservas online y problemas técnicos'
    },
    {
      name: 'Recursos Humanos',
      email: 'rrhh@scandinavia.com.gt',
      phone: '2251-4002',
      description: 'Oportunidades de trabajo y información para empleados'
    }
  ];

  const socialMedia = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-6 h-6" />,
      url: 'https://facebook.com/scandinaviagym',
      followers: '25K'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="w-6 h-6" />,
      url: 'https://instagram.com/scandinaviagym',
      followers: '18K'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-6 h-6" />,
      url: 'https://twitter.com/scandinaviagym',
      followers: '12K'
    },
    {
      name: 'YouTube',
      icon: <Youtube className="w-6 h-6" />,
      url: 'https://youtube.com/scandinaviagym',
      followers: '8K'
    }
  ];

  const faqs = [
    {
      question: '¿Cuáles son los horarios de atención?',
      answer: 'Nuestras sedes están abiertas de lunes a domingo de 4:30 AM a 10:00 PM. El horario puede variar ligeramente por sede.'
    },
    {
      question: '¿Cómo puedo cancelar mi membresía?',
      answer: 'Puedes cancelar tu membresía visitando cualquier sede o contactando a atención al cliente. No hay penalizaciones por cancelación.'
    },
    {
      question: '¿Ofrecen clases de prueba?',
      answer: 'Sí, ofrecemos un pase de 1 día gratis para que conozcas nuestras instalaciones y servicios antes de comprometerte.'
    },
    {
      question: '¿Hay estacionamiento disponible?',
      answer: 'Todas nuestras sedes cuentan con estacionamiento gratuito para nuestros miembros.'
    },
    {
      question: '¿Puedo congelar mi membresía?',
      answer: 'Sí, puedes congelar tu membresía por hasta 3 meses al año por motivos médicos o viajes.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos efectivo, tarjetas de crédito/débito, transferencias bancarias y Visa Cuotas.'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredContact: 'email',
        membershipInterest: false
      });
    }, 3000);
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-400 bg-green-900/20';
      case 'blue':
        return 'text-blue-400 bg-blue-900/20';
      case 'purple':
        return 'text-purple-400 bg-purple-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              <span style={{color: '#b5fc00'}}>Contáctanos</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Estamos aquí para ayudarte. Elige la forma que prefieras para comunicarte con nosotros.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-colors text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-3 sm:mb-4" style={{backgroundColor: 'rgba(181, 252, 0, 0.1)'}}>
                  <div style={{color: '#b5fc00'}}>
                    {method.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{method.title}</h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">{method.description}</p>
                <div className="mb-3 sm:mb-4">
                  <p className="text-white font-medium text-sm sm:text-base">{method.contact}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">{method.availability}</p>
                </div>
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors text-xs sm:text-sm ${getColorClasses(method.color)}`}>
                  {method.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Envíanos un Mensaje
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 px-4">
              Completa el formulario y nos pondremos en contacto contigo pronto
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700">
            {isSubmitted ? (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4" style={{backgroundColor: 'rgba(181, 252, 0, 0.1)'}}>
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8" style={{color: '#b5fc00'}} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                <p className="text-gray-300 text-sm sm:text-base">Gracias por contactarnos. Te responderemos pronto.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Nombre Completo *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Correo Electrónico *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Teléfono
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
                        placeholder="+502 5555-1234"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Asunto *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="membership">Información sobre membresías</option>
                      <option value="classes">Clases y horarios</option>
                      <option value="personal-training">Entrenamiento personal</option>
                      <option value="promotions">Promociones y ofertas</option>
                      <option value="technical">Soporte técnico</option>
                      <option value="complaint">Queja o sugerencia</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Mensaje *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
                      placeholder="Cuéntanos cómo podemos ayudarte..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Preferencia de Contacto
                    </label>
                    <select
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-gray-600 focus:border-gray-600 text-sm sm:text-base"
                    >
                      <option value="email">Correo Electrónico</option>
                      <option value="phone">Teléfono</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="membershipInterest"
                      checked={formData.membershipInterest}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-gray-600 bg-gray-700 border-gray-600 rounded focus:ring-gray-600"
                    />
                    <label className="ml-2 text-xs sm:text-sm text-gray-300">
                      Me interesa información sobre membresías
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-black py-3 sm:py-4 px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: '#b5fc00'}}
                  onMouseEnter={(e) => !isSubmitting && (e.target.style.backgroundColor = '#a3e600')}
                  onMouseLeave={(e) => !isSubmitting && (e.target.style.backgroundColor = '#b5fc00')}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base">Enviando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">Enviar Mensaje</span>
                    </div>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Departamentos Especializados
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Contacta directamente con el departamento que mejor puede ayudarte
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{dept.name}</h3>
                <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">{dept.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4" style={{color: '#b5fc00'}} />
                    <span>{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-xs sm:text-sm">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" style={{color: '#b5fc00'}} />
                    <span>{dept.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Nuestras Sedes
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Visítanos en cualquiera de nuestras 14 ubicaciones en Guatemala
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {locations.map((location, index) => (
              <div key={index} className={`bg-gray-800 rounded-xl p-4 sm:p-6 border-2 transition-colors ${
                location.isMain ? 'border-gray-600' : 'border-gray-700 hover:border-gray-600'
              }`}>
                {location.isMain && (
                  <div className="inline-block mb-3 sm:mb-4">
                    <span className="text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold" style={{backgroundColor: '#b5fc00'}}>
                      Sede Principal
                    </span>
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3">{location.name}</h3>
                <div className="space-y-2 mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" style={{color: '#b5fc00'}} />
                    <span className="text-xs sm:text-sm">{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" style={{color: '#b5fc00'}} />
                    <span className="text-xs sm:text-sm">{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" style={{color: '#b5fc00'}} />
                    <span className="text-xs sm:text-sm">{location.hours}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {location.features.map((feature, featureIndex) => (
                    <span key={featureIndex} className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
                <button className="text-black py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
                  Ver en Mapa
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Síguenos en Redes Sociales
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
            Mantente al día con nuestras últimas noticias, consejos fitness y promociones
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {socialMedia.map((social, index) => (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-colors group"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-2 sm:mb-3 group-hover:scale-110 transition-transform" style={{backgroundColor: 'rgba(181, 252, 0, 0.1)'}}>
                    <div style={{color: '#b5fc00'}}>
                      {social.icon}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold mb-1 text-sm sm:text-base">{social.name}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm">{social.followers} seguidores</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 px-4">
              Respuestas rápidas a las preguntas más comunes
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{faq.question}</h3>
                <p className="text-gray-300 text-sm sm:text-base">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contacto;
