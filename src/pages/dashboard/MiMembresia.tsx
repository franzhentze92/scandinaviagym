import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserMembership, getMembershipPlans, createUserMembership, updateUserMembership, getSedes, getActivePromotions } from '@/services/database';
import type { Sede } from '@/types/database';
import { toast } from 'sonner';
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
  EyeOff,
  X,
  Loader2
} from 'lucide-react';

const MiMembresia: React.FC = () => {
  const { user } = useAuth();
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [pricingPeriod, setPricingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [membershipDetails, setMembershipDetails] = useState<any>(null);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'quarterly' | 'semiannual' | 'annual'>('monthly');
  const [selectedSede, setSelectedSede] = useState<string>('');
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showChangePaymentModal, setShowChangePaymentModal] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<string>('');
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  useEffect(() => {
    if (user) {
      loadMembershipData();
    }
  }, [user]);

  const loadMembershipData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const [userMembership, plans, activePromotions] = await Promise.all([
        getUserMembership(user.id),
        getMembershipPlans(),
        getActivePromotions()
      ]);

      if (userMembership) {
        const plan = plans.find(p => p.id === userMembership.plan_id);
        setMembershipDetails({
          ...userMembership,
          planName: plan?.name || 'Sin plan',
          planPrice: plan?.price || 0
        });
      }

      // Set default plans if not in database
      if (plans.length === 0) {
        setAvailablePlans(getDefaultPlans());
      } else {
        setAvailablePlans(plans.map(plan => {
          const features = plan.features || {};
          return {
            ...plan,
            features: features,
            // Map prices from features
            price: features.prices?.monthly || plan.price || 0,
            quarterlyPrice: features.prices?.quarterly || null,
            semiannualPrice: features.prices?.semiannual || null,
            annualPrice: features.prices?.annual || (plan.price ? plan.price * 12 : 0),
            enrollmentFee: plan.enrollment_fee || 0,
            loyaltyMonths: plan.loyalty_months || 0
          };
        }));
      }

      // Set promotions from database
      setPromotions(activePromotions);
    } catch (error) {
      console.error('Error loading membership data:', error);
      toast.error('Error al cargar información de membresía');
      setAvailablePlans(getDefaultPlans());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultPlans = () => {
    return [
      {
        id: 'plus',
        name: 'PLUS',
        price: 250,
        annualPrice: 250 * 12,
        enrollmentFee: 50,
        loyaltyMonths: 12,
        currency: 'Q',
        features: {
          cardio: true,
          pesas: true,
          clasesBaile: true,
          clasesFunctional: true,
          clasesSpinning: true,
          sauna: true,
          cuotaMantenimiento: true,
          evaluacionFisica: true,
          invitaAmigo: true,
          ingresoOtrasSedes: true,
          parqueoGratis: true
        }
      },
      {
        id: 'flex',
        name: 'FLEX',
        price: 199,
        annualPrice: 199 * 12,
        enrollmentFee: 100,
        loyaltyMonths: 2,
        currency: 'Q',
        features: {
          cardio: true,
          pesas: true,
          clasesBaile: true,
          clasesFunctional: true,
          clasesSpinning: true,
          sauna: true,
          cuotaMantenimiento: true,
          evaluacionFisica: false,
          invitaAmigo: false,
          ingresoOtrasSedes: false,
          parqueoGratis: true
        }
      }
    ];
  };

  const getPlanFeatures = (plan: any) => {
    if (!plan || !plan.features) return [];
    const features = [];
    if (plan.features.cardio) features.push('Cardio');
    if (plan.features.pesas) features.push('Pesas');
    if (plan.features.clasesBaile) features.push('Clases Salón de Baile');
    if (plan.features.clasesFunctional) features.push('Clases de Functional');
    if (plan.features.clasesSpinning) features.push('Clases de Spinning');
    if (plan.features.sauna) features.push('Sauna');
    if (plan.features.cuotaMantenimiento) features.push('Cuota de Mantenimiento Incluida');
    if (plan.features.evaluacionFisica) features.push('Evaluación Física');
    if (plan.features.invitaAmigo) features.push('Invita a un Amigo (Viernes a Domingo)');
    if (plan.features.ingresoOtrasSedes) features.push('Ingreso a Otras Sedes');
    if (plan.features.parqueoGratis) features.push('Parqueo Gratis');
    
    // Add custom features
    if (plan.features.customFeatures && Array.isArray(plan.features.customFeatures)) {
      plan.features.customFeatures.forEach((feature: string) => {
        if (feature && feature.trim()) {
          features.push(feature.trim());
        }
      });
    }
    
    return features;
  };


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

  const handleSubscribe = async (plan: any, coupon?: string) => {
    setSelectedPlan(plan);
    setSelectedPeriod('monthly');
    setSelectedSede('');
    setCouponCode(coupon || '');
    try {
      const sedesData = await getSedes();
      setSedes(sedesData);
    } catch (error) {
      console.error('Error loading sedes:', error);
      toast.error('Error al cargar las sedes');
    }
    setShowSubscribeModal(true);
  };

  const confirmSubscription = async () => {
    if (!user || !selectedPlan) return;

    // Validate sede selection (unless plan is PLUS which includes all sedes)
    const isPlusPlan = selectedPlan.features?.ingresoOtrasSedes === true;
    if (!isPlusPlan && !selectedSede) {
      toast.error('Por favor, selecciona una sede');
      return;
    }

    setIsSubscribing(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      
      // Calculate duration based on selected period
      let durationDays = 30; // Default to 1 month
      if (selectedPeriod === 'quarterly') {
        durationDays = 90;
      } else if (selectedPeriod === 'semiannual') {
        durationDays = 180;
      } else if (selectedPeriod === 'annual') {
        durationDays = 365;
      }
      
      endDate.setDate(endDate.getDate() + durationDays);

      // Build payment method string with sede info and coupon
      const sedeName = selectedSede ? sedes.find(s => s.id === selectedSede)?.name : 'Todas las sedes (PLUS)';
      let paymentMethod = `Tarjeta de Crédito/Débito - Sede: ${sedeName}`;
      if (couponCode.trim()) {
        paymentMethod += ` - Cupón: ${couponCode.trim()}`;
      }

      await createUserMembership({
        user_id: user.id,
        plan_id: selectedPlan.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'active',
        payment_method: paymentMethod,
        auto_renew: selectedPlan.features?.autoDebit || false
      });

      toast.success('¡Suscripción creada exitosamente!');
      setShowSubscribeModal(false);
      setSelectedPlan(null);
      setSelectedPeriod('monthly');
      setSelectedSede('');
      setCouponCode('');
      loadMembershipData();
    } catch (error: any) {
      console.error('Error creating subscription:', error);
      toast.error(error.message || 'Error al crear la suscripción');
    } finally {
      setIsSubscribing(false);
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
        {membershipDetails && (
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(membershipDetails.status)}`}>
              {getStatusText(membershipDetails.status)}
            </span>
          </div>
        )}
      </div>

      {/* Current Plan Card */}
      {membershipDetails && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Plan {membershipDetails.planName}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">Membresía Activa</p>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-white">
                Q{membershipDetails.planPrice}
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">por mes</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" style={{color: '#b5fc00'}} />
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Inicio</p>
                <p className="text-white font-medium text-sm sm:text-base">
                  {formatDate(membershipDetails.start_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" style={{color: '#b5fc00'}} />
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Vence</p>
                <p className="text-white font-medium text-sm sm:text-base">
                  {formatDate(membershipDetails.end_date)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-1">
              <CreditCard className="w-5 h-5" style={{color: '#b5fc00'}} />
              <div>
                <p className="text-gray-400 text-xs sm:text-sm">Método de pago</p>
                <p className="text-white font-medium text-sm sm:text-base">
                  {membershipDetails.payment_method || 'No especificado'}
                </p>
              </div>
            </div>
          </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => setSelectedAction('renew')}
            className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base" 
            style={{backgroundColor: '#b5fc00', color: 'black'}} 
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
            }} 
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
            }}
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
      )}

      {/* Benefits */}
      {membershipDetails && (
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Beneficios Incluidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {getPlanFeatures(availablePlans.find(p => p.id === membershipDetails.plan_id) || availablePlans[0]).map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" style={{color: '#b5fc00'}} />
                <span className="text-gray-300 text-sm sm:text-base">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History */}
      {membershipDetails && (
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-white">Historial de Pagos</h3>
            <button className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors">
              Ver todos
            </button>
          </div>
          
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No hay historial de pagos disponible</p>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-lg sm:text-xl font-bold text-white">ELIGE TU PLAN</h3>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {availablePlans.map((plan, index) => {
              const isCurrent = membershipDetails?.plan_id === plan.id;
              const features = getPlanFeatures(plan);
              const prices = plan.features?.prices || {};
              const hasMultiplePrices = !!(prices.quarterly || prices.semiannual || prices.annual);

              return (
                <div 
                  key={plan.id || index} 
                  className={`rounded-xl p-6 border-2 transition-all relative flex flex-col h-full ${
                    isCurrent 
                      ? 'border-gray-600 bg-gray-700' 
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  {isCurrent && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{backgroundColor: '#b5fc00', color: 'black'}}>
                        Plan Actual
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-6 flex-shrink-0">
                    <h4 className="text-2xl font-bold text-white mb-4">{plan.name}</h4>
                    
                    {plan.description && (
                      <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                    )}
                    
                    {/* Precios por Período */}
                    <div className="mb-4 space-y-2">
                      {prices.monthly && (
                        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <span className="text-gray-300 text-sm">1 Mes:</span>
                          <span className="text-white font-bold">Q{prices.monthly}</span>
                        </div>
                      )}
                      {prices.quarterly && (
                        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <span className="text-gray-300 text-sm">3 Meses:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs">(Q{Math.round(prices.quarterly / 3)}/mes)</span>
                            <span className="text-white font-bold">Q{prices.quarterly}</span>
                          </div>
                        </div>
                      )}
                      {prices.semiannual && (
                        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <span className="text-gray-300 text-sm">6 Meses:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs">(Q{Math.round(prices.semiannual / 6)}/mes)</span>
                            <span className="text-white font-bold">Q{prices.semiannual}</span>
                          </div>
                        </div>
                      )}
                      {prices.annual && (
                        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <span className="text-gray-300 text-sm">12 Meses:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-xs">(Q{Math.round(prices.annual / 12)}/mes)</span>
                            <span className="text-white font-bold">Q{prices.annual}</span>
                          </div>
                        </div>
                      )}
                      {!hasMultiplePrices && plan.price && (
                        <div className="flex items-center justify-between p-2 bg-gray-700 rounded">
                          <span className="text-gray-300 text-sm">1 Mes:</span>
                          <span className="text-white font-bold">Q{plan.price}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                      {plan.enrollmentFee > 0 && (
                        <div>
                          <span className="text-gray-400">Inscripción:</span>
                          <span className="text-white font-medium ml-2">Q{plan.enrollmentFee}</span>
                        </div>
                      )}
                      {plan.loyaltyMonths > 0 && (
                        <div>
                          <span className="text-gray-400">Lealtad:</span>
                          <span className="text-white font-medium ml-2">{plan.loyaltyMonths} meses</span>
                        </div>
                      )}
                      {plan.features?.autoDebit && (
                        <div className="col-span-2">
                          <span className="text-gray-400">✓ Débito Automático Disponible</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 flex-grow">
                    {features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" style={{color: '#b5fc00'}} />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => handleSubscribe(plan)}
                      className="w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm mt-auto"
                      style={{backgroundColor: '#b5fc00', color: 'black'}}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                      }}
                    >
                      Seleccionar Plan
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Promociones */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-6">Promociones</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {promotions.length === 0 ? (
            <div className="col-span-3 text-center py-8">
              <Gift className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No hay promociones disponibles en este momento</p>
            </div>
          ) : (
            promotions.map((promo) => (
            <div 
              key={promo.id} 
              className="relative rounded-xl p-6 border-2 border-gray-700 bg-gray-800 hover:border-gray-600 transition-all overflow-hidden"
            >
              {/* Badge */}
              {promo.badge && (
                <div className="absolute top-4 right-4">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-bold"
                    style={{backgroundColor: promo.color, color: 'white'}}
                  >
                    {promo.badge}
                  </span>
                </div>
              )}

              {/* Discount Badge */}
              <div className="absolute top-4 left-4">
                <div 
                  className="px-3 py-1 rounded-lg font-bold text-lg"
                  style={{backgroundColor: promo.color, color: 'white'}}
                >
                  {promo.discount}
                </div>
              </div>

              <div className="mt-12 mb-4">
                <h4 className="text-xl font-bold text-white mb-2">{promo.title}</h4>
                <p className="text-gray-300 text-sm mb-4">{promo.description}</p>
                
                {/* Código de Cupón */}
                <div className="mb-3 p-2 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Código de Cupón:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm font-mono">{promo.coupon_code}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(promo.coupon_code);
                          toast.success('Código copiado al portapapeles');
                        }}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copiar código"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>Válido hasta {new Date(promo.valid_until).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  // Find the first available plan to open the modal
                  const firstPlan = availablePlans[0];
                  if (firstPlan) {
                    handleSubscribe(firstPlan, promo.coupon_code);
                  } else {
                    toast.info('Por favor, selecciona un plan primero');
                  }
                }}
                className="w-full py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                style={{backgroundColor: '#b5fc00', color: 'black'}}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                }}
              >
                Aplicar Promoción
              </button>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Settings */}
      {membershipDetails && (
        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">Configuración de Pagos</h3>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-700 rounded-lg gap-3">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5" style={{color: '#b5fc00'}} />
                <div>
                  <p className="text-white font-medium text-sm sm:text-base">Método de Pago</p>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {membershipDetails.payment_method || 'No especificado'}
                  </p>
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
                  <span className="text-gray-300 text-sm sm:text-base">Inicio:</span>
                  <span className="text-white text-sm sm:text-base">{formatDate(membershipDetails.start_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Vence:</span>
                  <span className="text-white text-sm sm:text-base">{formatDate(membershipDetails.end_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm sm:text-base">Renovación automática:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    membershipDetails.auto_renew 
                      ? 'text-green-400 bg-green-900/20' 
                      : 'text-red-400 bg-red-900/20'
                  }`}>
                    {membershipDetails.auto_renew ? 'Activada' : 'Desactivada'}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => {
                  setNewPaymentMethod(membershipDetails.payment_method || '');
                  setShowChangePaymentModal(true);
                }}
                className="px-3 sm:px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Cambiar método de pago
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Subscribe Modal */}
      {showSubscribeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-white">Confirmar Suscripción</h2>
              <button
                onClick={() => {
                  setShowSubscribeModal(false);
                  setSelectedPlan(null);
                  setSelectedPeriod('monthly');
                  setSelectedSede('');
                  setCouponCode('');
                }}
                className="text-gray-400 hover:text-white"
                disabled={isSubscribing}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Plan: {selectedPlan.name}</h3>
                {selectedPlan.description && (
                  <p className="text-gray-400 text-sm mb-4">{selectedPlan.description}</p>
                )}
                
                {/* Período de Suscripción */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Selecciona el Período *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedPlan.features?.prices?.monthly && (
                      <button
                        type="button"
                        onClick={() => setSelectedPeriod('monthly')}
                        className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                          selectedPeriod === 'monthly'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                        }`}
                        disabled={isSubscribing}
                      >
                        <div className="text-white font-bold">Q{selectedPlan.features.prices.monthly}</div>
                        <div className="text-gray-400 text-xs">1 Mes</div>
                      </button>
                    )}
                    {selectedPlan.features?.prices?.quarterly && (
                      <button
                        type="button"
                        onClick={() => setSelectedPeriod('quarterly')}
                        className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                          selectedPeriod === 'quarterly'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                        }`}
                        disabled={isSubscribing}
                      >
                        <div className="text-white font-bold">Q{selectedPlan.features.prices.quarterly}</div>
                        <div className="text-gray-400 text-xs">3 Meses</div>
                        <div className="text-gray-500 text-xs">(Q{Math.round(selectedPlan.features.prices.quarterly / 3)}/mes)</div>
                      </button>
                    )}
                    {selectedPlan.features?.prices?.semiannual && (
                      <button
                        type="button"
                        onClick={() => setSelectedPeriod('semiannual')}
                        className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                          selectedPeriod === 'semiannual'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                        }`}
                        disabled={isSubscribing}
                      >
                        <div className="text-white font-bold">Q{selectedPlan.features.prices.semiannual}</div>
                        <div className="text-gray-400 text-xs">6 Meses</div>
                        <div className="text-gray-500 text-xs">(Q{Math.round(selectedPlan.features.prices.semiannual / 6)}/mes)</div>
                      </button>
                    )}
                    {selectedPlan.features?.prices?.annual && (
                      <button
                        type="button"
                        onClick={() => setSelectedPeriod('annual')}
                        className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                          selectedPeriod === 'annual'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                        }`}
                        disabled={isSubscribing}
                      >
                        <div className="text-white font-bold">Q{selectedPlan.features.prices.annual}</div>
                        <div className="text-gray-400 text-xs">12 Meses</div>
                        <div className="text-gray-500 text-xs">(Q{Math.round(selectedPlan.features.prices.annual / 12)}/mes)</div>
                      </button>
                    )}
                    {!selectedPlan.features?.prices && selectedPlan.price && (
                      <button
                        type="button"
                        onClick={() => setSelectedPeriod('monthly')}
                        className={`p-3 rounded-lg border-2 transition-colors text-sm ${
                          selectedPeriod === 'monthly'
                            ? 'border-green-500 bg-green-500/20'
                            : 'border-gray-600 bg-gray-700 hover:border-gray-500'
                        }`}
                        disabled={isSubscribing}
                      >
                        <div className="text-white font-bold">Q{selectedPlan.price}</div>
                        <div className="text-gray-400 text-xs">1 Mes</div>
                      </button>
                    )}
                  </div>
                </div>

                {/* Selector de Sede */}
                {!selectedPlan.features?.ingresoOtrasSedes && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Selecciona la Sede Matriz *
                    </label>
                    <select
                      value={selectedSede}
                      onChange={(e) => setSelectedSede(e.target.value)}
                      required
                      disabled={isSubscribing}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      <option value="">Seleccionar sede</option>
                      {sedes.map((sede) => (
                        <option key={sede.id} value={sede.id}>
                          {sede.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedPlan.features?.ingresoOtrasSedes && (
                  <div className="mb-4 p-3 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-blue-300 text-sm">
                        <strong>Plan PLUS:</strong> Este plan incluye acceso a todas las sedes, por lo que no es necesario seleccionar una sede específica.
                      </p>
                    </div>
                  </div>
                )}

                {/* Campo de Cupón */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código de Cupón (Opcional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Ingresa el código de cupón"
                      disabled={isSubscribing}
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 font-mono"
                    />
                    {couponCode && (
                      <button
                        type="button"
                        onClick={() => setCouponCode('')}
                        className="px-3 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                        disabled={isSubscribing}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {couponCode && (
                    <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Cupón aplicado: {couponCode}
                    </p>
                  )}
                </div>

                <div className="space-y-2 text-sm text-gray-300 bg-gray-700 p-3 rounded-lg">
                  {selectedPlan.enrollmentFee > 0 && (
                    <div className="flex justify-between">
                      <span>Cuota de inscripción:</span>
                      <span className="text-white font-medium">Q{selectedPlan.enrollmentFee}</span>
                    </div>
                  )}
                  {selectedPlan.loyaltyMonths > 0 && (
                    <div className="flex justify-between">
                      <span>Meses de lealtad:</span>
                      <span className="text-white font-medium">{selectedPlan.loyaltyMonths} meses</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-gray-600">
                    <span className="font-medium">Método de pago:</span>
                    <span className="text-white font-medium">Tarjeta de Crédito/Débito</span>
                  </div>
                  {selectedPlan.features?.autoDebit && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Débito Automático Disponible</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-700 flex gap-3 flex-shrink-0">
              <button
                onClick={confirmSubscription}
                disabled={isSubscribing}
                className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{backgroundColor: '#b5fc00', color: 'black'}}
                onMouseEnter={(e) => {
                  if (!isSubscribing) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubscribing) {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                  }
                }}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  'Confirmar Suscripción'
                )}
              </button>
              <button
                onClick={() => {
                  setShowSubscribeModal(false);
                  setSelectedPlan(null);
                  setSelectedPeriod('monthly');
                  setSelectedSede('');
                  setCouponCode('');
                }}
                disabled={isSubscribing}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Payment Method Modal */}
      {showChangePaymentModal && membershipDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-md">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Cambiar Método de Pago</h2>
              <button
                onClick={() => {
                  setShowChangePaymentModal(false);
                  setNewPaymentMethod('');
                }}
                className="text-gray-400 hover:text-white"
                disabled={isUpdatingPayment}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Método de Pago *
                </label>
                <select
                  value={newPaymentMethod}
                  onChange={(e) => setNewPaymentMethod(e.target.value)}
                  required
                  disabled={isUpdatingPayment}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <option value="">Seleccionar método de pago</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                  <option value="Tarjeta de Crédito/Débito">Tarjeta de Crédito/Débito</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                </select>
                <p className="text-gray-400 text-xs mt-2">
                  Nota: Si tu membresía incluye información de sede o cupón, estos se mantendrán.
                </p>
              </div>

              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-gray-400 text-xs mb-1">Método actual:</p>
                <p className="text-white text-sm">{membershipDetails.payment_method || 'No especificado'}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={async () => {
                    if (!newPaymentMethod.trim()) {
                      toast.error('Por favor, selecciona un método de pago');
                      return;
                    }

                    setIsUpdatingPayment(true);
                    try {
                      // Preserve sede and coupon info if they exist in the current payment method
                      let finalPaymentMethod = newPaymentMethod;
                      const currentMethod = membershipDetails.payment_method || '';
                      
                      // Extract sede info if it exists
                      const sedeMatch = currentMethod.match(/Sede:\s*([^-]+?)(?:\s*-|$)/);
                      if (sedeMatch) {
                        finalPaymentMethod += ` - Sede: ${sedeMatch[1].trim()}`;
                      }
                      
                      // Extract coupon info if it exists
                      const couponMatch = currentMethod.match(/Cupón:\s*(.+?)$/);
                      if (couponMatch) {
                        finalPaymentMethod += ` - Cupón: ${couponMatch[1].trim()}`;
                      }

                      await updateUserMembership(membershipDetails.id, {
                        payment_method: finalPaymentMethod
                      });

                      toast.success('Método de pago actualizado correctamente');
                      setShowChangePaymentModal(false);
                      setNewPaymentMethod('');
                      loadMembershipData();
                    } catch (error: any) {
                      console.error('Error updating payment method:', error);
                      toast.error(error.message || 'Error al actualizar el método de pago');
                    } finally {
                      setIsUpdatingPayment(false);
                    }
                  }}
                  disabled={isUpdatingPayment || !newPaymentMethod}
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{backgroundColor: '#b5fc00', color: 'black'}}
                  onMouseEnter={(e) => {
                    if (!isUpdatingPayment && newPaymentMethod) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isUpdatingPayment && newPaymentMethod) {
                      (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                    }
                  }}
                >
                  {isUpdatingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowChangePaymentModal(false);
                    setNewPaymentMethod('');
                  }}
                  disabled={isUpdatingPayment}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiMembresia;
