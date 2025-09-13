import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  CreditCard, 
  Download, 
  RefreshCw, 
  Pause, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  Clock,
  MapPin,
  Star,
  AlertTriangle,
  FileText,
  Shield,
  Gift,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

const MiMembresia: React.FC = () => {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const membershipDetails = {
    plan: 'Premium',
    type: 'Mensual',
    startDate: '2024-08-15',
    expiryDate: '2024-09-15',
    autoRenewal: true,
    paymentMethod: 'Visa Cuotas',
    lastPayment: '2024-08-15',
    nextPayment: '2024-09-15',
    amount: 399,
    currency: 'Q',
    status: 'active',
    benefits: [
      'Acceso a todas las sedes',
      'Área de pesas y cardio',
      'Acceso a piscina climatizada',
      'Clases grupales ilimitadas',
      'Vestuarios y lockers premium',
      'WiFi gratuito',
      '1 invitado por mes',
      'Soporte prioritario'
    ]
  };

  const paymentHistory = [
    {
      id: 1,
      date: '2024-08-15',
      amount: 399,
      method: 'Visa Cuotas',
      status: 'completed',
      invoice: 'INV-2024-0815-001'
    },
    {
      id: 2,
      date: '2024-07-15',
      amount: 399,
      method: 'Visa Cuotas',
      status: 'completed',
      invoice: 'INV-2024-0715-001'
    },
    {
      id: 3,
      date: '2024-06-15',
      amount: 399,
      method: 'Visa Cuotas',
      status: 'completed',
      invoice: 'INV-2024-0615-001'
    }
  ];

  const availablePlans = [
    {
      name: 'Básico',
      price: 299,
      period: 'mes',
      features: ['Acceso a todas las sedes', 'Área de pesas y cardio', 'Vestuarios y lockers', 'WiFi gratuito'],
      current: false
    },
    {
      name: 'Premium',
      price: 399,
      period: 'mes',
      features: ['Acceso a todas las sedes', 'Área de pesas y cardio', 'Acceso a piscina', 'Clases grupales ilimitadas', '1 invitado por mes'],
      current: true
    },
    {
      name: 'VIP',
      price: 599,
      period: 'mes',
      features: ['Acceso a todas las sedes', 'Área de pesas y cardio', 'Acceso a piscina', 'Clases grupales ilimitadas', '2 sesiones de entrenador personal', 'Acceso a área de spa', 'Valet parking'],
      current: false
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900/20';
      case 'expired':
        return 'text-red-400 bg-red-900/20';
      case 'frozen':
        return 'text-yellow-400 bg-yellow-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'expired':
        return 'Expirada';
      case 'frozen':
        return 'Congelada';
      default:
        return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Mi Membresía</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Gestiona tu plan, pagos y configuraciones</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(membershipDetails.status)}`}>
            {getStatusText(membershipDetails.status)}
          </span>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Plan {membershipDetails.plan}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">Membresía {membershipDetails.type}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl font-bold text-white">
              {membershipDetails.currency}{membershipDetails.amount}
            </div>
            <div className="text-gray-400 text-xs sm:text-sm">por {membershipDetails.type.toLowerCase()}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" style={{color: '#b5fc00'}} />
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Inicio</p>
              <p className="text-white font-medium text-sm sm:text-base">{formatDate(membershipDetails.startDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5" style={{color: '#b5fc00'}} />
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Vence</p>
              <p className="text-white font-medium text-sm sm:text-base">{formatDate(membershipDetails.expiryDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
            <CreditCard className="w-5 h-5" style={{color: '#b5fc00'}} />
            <div>
              <p className="text-gray-400 text-xs sm:text-sm">Método de pago</p>
              <p className="text-white font-medium text-sm sm:text-base">{membershipDetails.paymentMethod}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setSelectedAction('renew')}
            className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base" 
            style={{backgroundColor: '#b5fc00', color: 'black'}} 
            onMouseEnter={(e) => e.target.style.backgroundColor = '#a3e600'} 
            onMouseLeave={(e) => e.target.style.backgroundColor = '#b5fc00'}
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Renovar
          </button>
          <button 
            onClick={() => setSelectedAction('freeze')}
            className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Pause className="w-4 h-4" />
            Congelar
          </button>
          <button 
            onClick={() => setSelectedAction('upgrade')}
            className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <TrendingUp className="w-4 h-4" />
            Cambiar Plan
          </button>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Beneficios Incluidos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {membershipDetails.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{color: '#b5fc00'}} />
              <span className="text-gray-300 text-sm sm:text-base">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">Historial de Pagos</h3>
          <button className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
            Ver todos
          </button>
        </div>
        
        <div className="space-y-3">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">{formatDate(payment.date)}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">{payment.method}</p>
                </div>
              </div>
              <div className="flex items-center justify-between sm:gap-4">
                <div className="text-left sm:text-right">
                  <p className="text-white font-medium text-sm sm:text-base">{payment.currency}{payment.amount}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">{payment.invoice}</p>
                </div>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Planes Disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {availablePlans.map((plan, index) => (
            <div key={index} className={`rounded-xl p-4 sm:p-6 border-2 transition-all ${
              plan.current 
                ? 'border-gray-600 bg-gray-700' 
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}>
              {plan.current && (
                <div className="inline-block mb-4">
                  <span className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold" style={{backgroundColor: '#b5fc00', color: 'black'}}>
                    Plan Actual
                  </span>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2">{plan.name}</h4>
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {membershipDetails.currency}{plan.price}
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">por {plan.period}</div>
              </div>

              <div className="space-y-2 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" style={{color: '#b5fc00'}} />
                    <span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {!plan.current && (
                <button className="w-full py-2 px-3 sm:px-4 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors text-sm sm:text-base">
                  {plan.price > membershipDetails.amount ? 'Upgrade' : 'Downgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Configuración de Pagos</h3>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg gap-3">
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5" style={{color: '#b5fc00'}} />
              <div>
                <p className="text-white font-medium text-sm sm:text-base">Método de Pago</p>
                <p className="text-gray-400 text-xs sm:text-sm">{membershipDetails.paymentMethod}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowPaymentDetails(!showPaymentDetails)}
              className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 self-start sm:self-center"
            >
              {showPaymentDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPaymentDetails ? 'Ocultar' : 'Ver'} detalles
            </button>
          </div>

          {showPaymentDetails && (
            <div className="p-3 sm:p-4 bg-gray-700 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm sm:text-base">Último pago:</span>
                <span className="text-white text-sm sm:text-base">{formatDate(membershipDetails.lastPayment)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm sm:text-base">Próximo pago:</span>
                <span className="text-white text-sm sm:text-base">{formatDate(membershipDetails.nextPayment)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300 text-sm sm:text-base">Renovación automática:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  membershipDetails.autoRenewal 
                    ? 'text-green-400 bg-green-900/20' 
                    : 'text-red-400 bg-red-900/20'
                }`}>
                  {membershipDetails.autoRenewal ? 'Activada' : 'Desactivada'}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors text-sm sm:text-base">
              Cambiar método de pago
            </button>
            <button className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors text-sm sm:text-base">
              Descargar facturas
            </button>
          </div>
        </div>
      </div>

      {/* Important Information */}
      <div className="bg-blue-900/20 border border-blue-600/30 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-blue-400 font-semibold mb-2 text-sm sm:text-base">Información Importante</h4>
            <ul className="text-blue-300 text-xs sm:text-sm space-y-1">
              <li>• Puedes congelar tu membresía hasta 3 meses al año</li>
              <li>• Los cambios de plan se aplican en el próximo ciclo de facturación</li>
              <li>• Las facturas están disponibles para descarga por 12 meses</li>
              <li>• Para cancelaciones, contacta a soporte al cliente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiMembresia;
