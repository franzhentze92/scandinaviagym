import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/use-scroll-to-top';
import { Check, Star, Users, Clock, CreditCard, Gift, Zap, Crown, Shield, Heart, Award, Phone } from 'lucide-react';

const Planes: React.FC = () => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  useScrollToTop();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const membershipPlans = [
    {
      id: 'basic',
      name: 'Plan Básico',
      price: 299,
      period: 'mes',
      description: 'Perfecto para comenzar tu journey fitness',
      popular: false,
      icon: <Users className="w-8 h-8" />,
      features: [
        'Acceso a todas las sedes',
        'Área de pesas y cardio',
        'Vestuarios y lockers',
        'WiFi gratuito',
        'Horario: 4:30 AM - 10:00 PM',
        'Soporte básico'
      ],
      limitations: [
        'Sin acceso a piscina',
        'Sin clases grupales',
        'Sin invitados'
      ],
      color: 'gray'
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      price: 399,
      period: 'mes',
      description: 'El más popular con acceso completo',
      popular: true,
      icon: <Star className="w-8 h-8" />,
      features: [
        'Acceso a todas las sedes',
        'Área de pesas y cardio',
        'Acceso a piscina climatizada',
        'Clases grupales ilimitadas',
        'Vestuarios y lockers premium',
        'WiFi gratuito',
        'Horario: 4:30 AM - 10:00 PM',
        '1 invitado por mes',
        'Soporte prioritario'
      ],
      limitations: [
        'Sin entrenador personal',
        'Sin acceso a spa'
      ],
      color: 'neon'
    },
    {
      id: 'vip',
      name: 'Plan VIP',
      price: 599,
      period: 'mes',
      description: 'Experiencia premium con servicios exclusivos',
      popular: false,
      icon: <Crown className="w-8 h-8" />,
      features: [
        'Acceso a todas las sedes',
        'Área de pesas y cardio',
        'Acceso a piscina climatizada',
        'Clases grupales ilimitadas',
        '2 sesiones de entrenador personal',
        'Acceso a área de spa',
        'Vestuarios VIP',
        'Lockers premium',
        'WiFi gratuito',
        'Horario extendido: 4:00 AM - 11:00 PM',
        '3 invitados por mes',
        'Valet parking (sedes seleccionadas)',
        'Soporte VIP 24/7',
        'Descuentos en productos'
      ],
      limitations: [],
      color: 'gold'
    }
  ];

  const addOns = [
    {
      name: 'Entrenador Personal',
      price: 150,
      period: 'sesión',
      description: 'Sesiones individuales con entrenadores certificados',
      icon: <Zap className="w-6 h-6" />
    },
    {
      name: 'Acceso a Spa',
      price: 200,
      period: 'mes',
      description: 'Acceso ilimitado a sauna, jacuzzi y área de relajación',
      icon: <Heart className="w-6 h-6" />
    },
    {
      name: 'Clases Especializadas',
      price: 100,
      period: 'mes',
      description: 'Acceso a clases premium como pilates, yoga y spinning',
      icon: <Award className="w-6 h-6" />
    },
    {
      name: 'Seguro de Equipos',
      price: 50,
      period: 'mes',
      description: 'Protección completa para tus equipos personales',
      icon: <Shield className="w-6 h-6" />
    }
  ];

  const benefits = [
    {
      icon: <Users className="w-8 h-8" />,
      title: '14 Sedes',
      description: 'Acceso a todas nuestras ubicaciones en Guatemala'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Horarios Extendidos',
      description: 'Abierto de 4:30 AM a 10:00 PM, todos los días'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Visa Cuotas',
      description: 'Paga en cuotas sin intereses con tu tarjeta Visa'
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Pase de 1 Día',
      description: 'Prueba gratis por 1 día antes de comprometerte'
    }
  ];

  const faqs = [
    {
      question: '¿Puedo cambiar de plan en cualquier momento?',
      answer: 'Sí, puedes cambiar de plan en cualquier momento. Los cambios se aplicarán en tu próximo ciclo de facturación.'
    },
    {
      question: '¿Hay contratos de permanencia?',
      answer: 'No, todos nuestros planes son flexibles. Puedes cancelar en cualquier momento sin penalizaciones.'
    },
    {
      question: '¿Qué incluye el pase de 1 día?',
      answer: 'El pase de 1 día incluye acceso completo a todas las instalaciones, excepto clases grupales y servicios premium.'
    },
    {
      question: '¿Puedo congelar mi membresía?',
      answer: 'Sí, puedes congelar tu membresía por hasta 3 meses al año por motivos médicos o viajes.'
    },
    {
      question: '¿Hay descuentos para estudiantes?',
      answer: 'Sí, ofrecemos 20% de descuento para estudiantes con carné vigente.'
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos efectivo, tarjetas de crédito/débito, transferencias bancarias y Visa Cuotas.'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  const getPlanColor = (color: string) => {
    switch (color) {
      case 'neon':
        return '#b5fc00';
      case 'gold':
        return '#ffd700';
      default:
        return '#6b7280';
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
              Nuestros <span style={{color: '#b5fc00'}}>Planes</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Encuentra el plan perfecto para tu estilo de vida. Flexibilidad, calidad y resultados garantizados.
            </p>
          </div>
        </div>
      </section>

      {/* Visa Cuotas Banner */}
      <section className="py-6 sm:py-8 bg-gradient-to-r from-gray-800 to-gray-700 border-b border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gray-800 border border-gray-600 rounded-full px-4 sm:px-6 py-2 sm:py-3">
              <CreditCard className="w-4 h-4 sm:w-6 sm:h-6" style={{color: '#b5fc00'}} />
              <span className="text-white font-semibold text-sm sm:text-base">Paga en cuotas sin intereses con Visa Cuotas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {membershipPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`relative bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-gray-600 ring-2 ring-gray-600' 
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="text-black py-2 px-4 text-center font-bold text-sm" style={{backgroundColor: '#b5fc00'}}>
                      Más Popular
                    </div>
                  </div>
                )}
                
                <div className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-4" style={{backgroundColor: `${getPlanColor(plan.color)}20`}}>
                      <div style={{color: getPlanColor(plan.color)}}>
                        {plan.icon}
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                    <div className="mb-4">
                      <span className="text-3xl sm:text-4xl font-bold text-white">Q{plan.price}</span>
                      <span className="text-gray-300 ml-2">/{plan.period}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{color: '#b5fc00'}} />
                        <span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limitations.length > 0 && (
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-400 mb-2">Limitaciones:</h4>
                      <div className="space-y-1">
                        {plan.limitations.map((limitation, index) => (
                          <div key={index} className="text-gray-500 text-xs">• {limitation}</div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                      plan.popular 
                        ? 'text-black' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                    style={plan.popular ? {backgroundColor: '#b5fc00'} : {}}
                    onMouseEnter={(e) => {
                      if (plan.popular) {
                        e.target.style.backgroundColor = '#a3e600';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (plan.popular) {
                        e.target.style.backgroundColor = '#b5fc00';
                      }
                    }}
                  >
                    Seleccionar Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Servicios Adicionales
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Personaliza tu experiencia con nuestros servicios premium
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full mb-3 sm:mb-4" style={{backgroundColor: 'rgba(181, 252, 0, 0.1)'}}>
                    <div style={{color: '#b5fc00'}}>
                      {addon.icon}
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{addon.name}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">{addon.description}</p>
                  <div className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
                    Q{addon.price}
                    <span className="text-gray-400 text-xs sm:text-sm">/{addon.period}</span>
                  </div>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors">
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              ¿Por Qué Elegir Scandinavia?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Más que un gimnasio, somos tu compañero en el camino hacia una vida más saludable
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-3 sm:mb-4" style={{backgroundColor: 'rgba(181, 252, 0, 0.1)'}}>
                  <div style={{color: '#b5fc00'}}>
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-300 text-sm sm:text-base">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Preguntas Frecuentes
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 px-4">
              Resolvemos las dudas más comunes sobre nuestros planes
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

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            ¿Listo para Comenzar?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 px-4">
            Únete a miles de personas que ya transformaron su vida con Scandinavia
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button className="text-black px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors" style={{backgroundColor: '#b5fc00'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}>
              Obtener Pase de 1 Día Gratis
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-colors flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
              Llamar Ahora
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Planes;
