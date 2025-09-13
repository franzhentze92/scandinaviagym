import React from 'react';
import { Check, Star, Zap } from 'lucide-react';

const PricingPlans: React.FC = () => {
  const plans = [
    {
      name: 'Básico',
      price: 'Q299',
      period: '/mes',
      description: 'Perfecto para comenzar tu rutina',
      features: [
        'Acceso a todas las sedes',
        'Horarios completos 4:30-22:00',
        'Área de pesas y cardio',
        'Vestuarios y duchas',
        'App móvil'
      ],
      popular: false,
      cta: 'Comenzar'
    },
    {
      name: 'Premium',
      price: 'Q399',
      period: '/mes',
      description: 'La opción más popular',
      features: [
        'Todo lo del plan Básico',
        'Acceso a piscinas climatizadas',
        'Clases grupales ilimitadas',
        'Toallas incluidas',
        'Descuentos en tienda',
        'Invitado gratis 2 veces/mes'
      ],
      popular: true,
      cta: 'Más Popular'
    },
    {
      name: 'Elite',
      price: 'Q599',
      period: '/mes', 
      description: 'Experiencia completa de entrenamiento',
      features: [
        'Todo lo del plan Premium',
        'Entrenamiento personalizado',
        'Consulta nutricional',
        'Acceso a sauna y vapor',
        'Estacionamiento preferencial',
        'Invitados ilimitados',
        'Congelación gratuita'
      ],
      popular: false,
      cta: 'Experiencia Elite'
    }
  ];

  return (
    <section id="planes" className="py-12 sm:py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Planes y Precios
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Elige el plan que mejor se adapte a tu estilo de vida. Todos incluyen acceso a nuestras 14 sedes.
          </p>
          
          {/* Visa Cuotas Banner */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 max-w-md mx-auto border border-gray-600">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">Visa Cuotas Disponibles</span>
            </div>
            <p className="text-xs sm:text-sm opacity-90">Paga tu membresía anual en cuotas mensuales sin intereses</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.popular 
                  ? 'border-gray-600 transform scale-105' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                  <div className="text-black px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-1" style={{backgroundColor: '#b5fc00'}}>
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                    Más Popular
                  </div>
                </div>
              )}

              <div className="p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">{plan.description}</p>
                
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-300">{plan.period}</span>
                </div>

                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" style={{color: '#b5fc00'}} />
                      <span className="text-gray-300 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base ${
                    plan.popular
                      ? 'text-black transform hover:scale-105'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  style={plan.popular ? {backgroundColor: '#b5fc00'} : {}}
                  onMouseEnter={plan.popular ? (e) => e.target.style.backgroundColor = '#a3e600' : undefined}
                  onMouseLeave={plan.popular ? (e) => e.target.style.backgroundColor = '#b5fc00' : undefined}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-gray-300 mb-4 text-sm sm:text-base px-4">¿Necesitas un plan corporativo o estudiantil?</p>
          <button className="font-semibold text-sm sm:text-base" style={{color: '#b5fc00'}} onMouseEnter={(e) => e.target.style.color = '#a3e600'} onMouseLeave={(e) => e.target.style.color = '#b5fc00'}>
            Contáctanos para descuentos especiales →
          </button>
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;