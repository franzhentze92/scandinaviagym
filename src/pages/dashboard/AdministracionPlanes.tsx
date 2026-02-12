import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllMembershipPlans, 
  createMembershipPlan, 
  updateMembershipPlan, 
  deleteMembershipPlan,
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '@/services/database';
import { toast } from 'sonner';
import {
  CreditCard,
  Search,
  Filter,
  Shield,
  Loader2,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Gift
} from 'lucide-react';
import type { MembershipPlan, Promotion } from '@/types/database';

const AdministracionPlanes: React.FC = () => {
  const { user, userRole } = useAuth();
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<MembershipPlan[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [showFeatures, setShowFeatures] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'plans' | 'promotions'>('plans');
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [promotionSearchQuery, setPromotionSearchQuery] = useState('');
  const [promotionStatusFilter, setPromotionStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'GTQ',
    enrollment_fee: '',
    loyalty_months: '',
    is_active: true,
    prices: {
      monthly: '',
      quarterly: '',
      semiannual: '',
      annual: ''
    },
    autoDebit: false,
    features: {
      cardio: false,
      pesas: false,
      clasesBaile: false,
      clasesFunctional: false,
      clasesSpinning: false,
      sauna: false,
      cuotaMantenimiento: false,
      evaluacionFisica: false,
      invitaAmigo: false,
      ingresoOtrasSedes: false,
      parqueoGratis: false
    },
    customFeatures: ['']
  });

  // KPIs
  const [kpis, setKpis] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    avgPrice: 0
  });

  useEffect(() => {
    if (userRole === 'admin') {
      loadData();
    }
  }, [user, userRole]);

  // Promotion form state
  const [promotionFormData, setPromotionFormData] = useState({
    title: '',
    description: '',
    discount: '',
    coupon_code: '',
    valid_until: '',
    badge: '',
    color: '#ff6b6b',
    is_active: true
  });

  useEffect(() => {
    applyFilters();
  }, [plans, searchQuery, statusFilter]);

  useEffect(() => {
    applyPromotionFilters();
  }, [promotions, promotionSearchQuery, promotionStatusFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [plansData, promotionsData] = await Promise.all([
        getAllMembershipPlans(),
        getAllPromotions()
      ]);
      setPlans(plansData);
      setPromotions(promotionsData);
      calculateKPIs(plansData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const applyPromotionFilters = () => {
    let filtered = [...promotions];

    // Search filter
    if (promotionSearchQuery) {
      const query = promotionSearchQuery.toLowerCase();
      filtered = filtered.filter(promo => 
        promo.title.toLowerCase().includes(query) ||
        promo.description.toLowerCase().includes(query) ||
        promo.coupon_code.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (promotionStatusFilter !== 'all') {
      filtered = filtered.filter(promo => 
        promotionStatusFilter === 'active' ? promo.is_active : !promo.is_active
      );
    }

    setFilteredPromotions(filtered);
  };

  const calculateKPIs = (plansData: MembershipPlan[]) => {
    const activePlans = plansData.filter(p => p.is_active);
    const avgPrice = activePlans.length > 0
      ? activePlans.reduce((sum, p) => sum + p.price, 0) / activePlans.length
      : 0;

    setKpis({
      total: plansData.length,
      active: activePlans.length,
      inactive: plansData.filter(p => !p.is_active).length,
      avgPrice: Math.round(avgPrice)
    });
  };

  const applyFilters = () => {
    let filtered = [...plans];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(plan => 
        plan.name.toLowerCase().includes(query) ||
        plan.description?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(plan => 
        statusFilter === 'active' ? plan.is_active : !plan.is_active
      );
    }

    setFilteredPlans(filtered);
  };

  const getPlanFeatures = (plan: MembershipPlan) => {
    if (!plan.features) return [];
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

  const handleCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      currency: 'GTQ',
      enrollment_fee: '',
      loyalty_months: '',
      is_active: true,
      prices: {
        monthly: '',
        quarterly: '',
        semiannual: '',
        annual: ''
      },
      autoDebit: false,
      features: {
        cardio: false,
        pesas: false,
        clasesBaile: false,
        clasesFunctional: false,
        clasesSpinning: false,
        sauna: false,
        cuotaMantenimiento: false,
        evaluacionFisica: false,
        invitaAmigo: false,
        ingresoOtrasSedes: false,
        parqueoGratis: false
      },
      customFeatures: ['']
    });
    setShowForm(true);
  };

  const handleEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    const features = plan.features || {};
    setFormData({
      name: plan.name,
      description: plan.description || '',
      currency: plan.currency,
      enrollment_fee: (plan.enrollment_fee || 0).toString(),
      loyalty_months: (plan.loyalty_months || 0).toString(),
      is_active: plan.is_active,
      prices: {
        monthly: features.prices?.monthly?.toString() || plan.price.toString(),
        quarterly: features.prices?.quarterly?.toString() || '',
        semiannual: features.prices?.semiannual?.toString() || '',
        annual: features.prices?.annual?.toString() || ''
      },
      autoDebit: features.autoDebit || false,
      features: {
        cardio: features.cardio || false,
        pesas: features.pesas || false,
        clasesBaile: features.clasesBaile || false,
        clasesFunctional: features.clasesFunctional || false,
        clasesSpinning: features.clasesSpinning || false,
        sauna: features.sauna || false,
        cuotaMantenimiento: features.cuotaMantenimiento || false,
        evaluacionFisica: features.evaluacionFisica || false,
        invitaAmigo: features.invitaAmigo || false,
        ingresoOtrasSedes: features.ingresoOtrasSedes || false,
        parqueoGratis: features.parqueoGratis || false
      },
      customFeatures: features.customFeatures || ['']
    });
    setShowForm(true);
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este plan? Esto puede afectar las membresías existentes.')) {
      return;
    }

    try {
      await deleteMembershipPlan(planId);
      toast.success('Plan eliminado correctamente');
      loadData();
    } catch (error: any) {
      console.error('Error deleting plan:', error);
      toast.error(error.message || 'Error al eliminar el plan');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one price is provided
    const hasPrice = Object.values(formData.prices).some(p => p && parseFloat(p) > 0);
    if (!hasPrice) {
      toast.error('Debes especificar al menos un precio');
      return;
    }

    try {
      // Use monthly price as the main price for backward compatibility
      const monthlyPrice = parseFloat(formData.prices.monthly) || 0;
      
      const planData = {
        name: formData.name,
        description: formData.description || null,
        price: monthlyPrice, // Keep for backward compatibility
        currency: formData.currency,
        duration_days: 30, // Default to 30 days for backward compatibility
        enrollment_fee: parseFloat(formData.enrollment_fee) || 0,
        loyalty_months: parseInt(formData.loyalty_months) || 0,
        features: {
          ...formData.features,
          prices: {
            monthly: formData.prices.monthly ? parseFloat(formData.prices.monthly) : null,
            quarterly: formData.prices.quarterly ? parseFloat(formData.prices.quarterly) : null,
            semiannual: formData.prices.semiannual ? parseFloat(formData.prices.semiannual) : null,
            annual: formData.prices.annual ? parseFloat(formData.prices.annual) : null
          },
          autoDebit: formData.autoDebit,
          customFeatures: formData.customFeatures.filter(f => f.trim() !== '')
        },
        is_active: formData.is_active
      };

      if (editingPlan) {
        await updateMembershipPlan(editingPlan.id, planData);
        toast.success('Plan actualizado correctamente');
      } else {
        await createMembershipPlan(planData);
        toast.success('Plan creado correctamente');
      }
      
      setShowForm(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving plan:', error);
      toast.error(error.message || 'Error al guardar el plan');
    }
  };

  const toggleFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]: !formData.features[feature as keyof typeof formData.features]
      }
    });
  };

  // Promotion handlers
  const handleCreatePromotion = () => {
    setEditingPromotion(null);
    setPromotionFormData({
      title: '',
      description: '',
      discount: '',
      coupon_code: '',
      valid_until: '',
      badge: '',
      color: '#ff6b6b',
      is_active: true
    });
    setShowPromotionForm(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setPromotionFormData({
      title: promotion.title,
      description: promotion.description,
      discount: promotion.discount,
      coupon_code: promotion.coupon_code,
      valid_until: promotion.valid_until.split('T')[0],
      badge: promotion.badge || '',
      color: promotion.color,
      is_active: promotion.is_active
    });
    setShowPromotionForm(true);
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta promoción?')) {
      return;
    }

    try {
      await deletePromotion(promotionId);
      toast.success('Promoción eliminada correctamente');
      loadData();
    } catch (error: any) {
      console.error('Error deleting promotion:', error);
      toast.error(error.message || 'Error al eliminar la promoción');
    }
  };

  const handleSubmitPromotion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!promotionFormData.coupon_code.trim()) {
      toast.error('El código de cupón es requerido');
      return;
    }

    try {
      const promotionData = {
        title: promotionFormData.title,
        description: promotionFormData.description,
        discount: promotionFormData.discount,
        coupon_code: promotionFormData.coupon_code.toUpperCase(),
        valid_until: promotionFormData.valid_until,
        badge: promotionFormData.badge || null,
        color: promotionFormData.color,
        is_active: promotionFormData.is_active
      };

      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, promotionData);
        toast.success('Promoción actualizada correctamente');
      } else {
        await createPromotion(promotionData);
        toast.success('Promoción creada correctamente');
      }
      
      setShowPromotionForm(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving promotion:', error);
      toast.error(error.message || 'Error al guardar la promoción');
    }
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Descripción', 'Precio 1 Mes', 'Precio 3 Meses', 'Precio 6 Meses', 'Precio 12 Meses', 'Moneda', 'Cuota Inscripción', 'Meses Lealtad', 'Estado', 'Características'];
    const rows = filteredPlans.map(plan => {
      const features = getPlanFeatures(plan).join('; ');
      const prices = plan.features?.prices || {};
      return [
        plan.name,
        plan.description || '',
        (prices.monthly || plan.price || 0).toString(),
        (prices.quarterly || '').toString(),
        (prices.semiannual || '').toString(),
        (prices.annual || '').toString(),
        plan.currency,
        (plan.enrollment_fee || 0).toString(),
        (plan.loyalty_months || 0).toString(),
        plan.is_active ? 'Activo' : 'Inactivo',
        features
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `planes-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Archivo CSV descargado');
  };

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400">No tienes permisos para acceder a esta sección</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Administración de Planes</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Gestiona los planes de membresía y promociones</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          {activeTab === 'plans' && (
            <>
              <button
                onClick={exportToCSV}
                disabled={filteredPlans.length === 0}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                style={{backgroundColor: '#b5fc00', color: 'black'}}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                }}
              >
                <Plus className="w-4 h-4" />
                Nuevo Plan
              </button>
            </>
          )}
          {activeTab === 'promotions' && (
            <button
              onClick={handleCreatePromotion}
              className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              style={{backgroundColor: '#b5fc00', color: 'black'}}
              onMouseEnter={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
              }}
            >
              <Plus className="w-4 h-4" />
              Nueva Promoción
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'plans'
              ? 'text-white border-b-2 border-green-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Planes
        </button>
        <button
          onClick={() => setActiveTab('promotions')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'promotions'
              ? 'text-white border-b-2 border-green-500'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Promociones
        </button>
      </div>

      {/* KPIs - Only show for plans */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Total</div>
          <div className="text-2xl font-bold text-white">{kpis.total}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Activos</div>
          <div className="text-2xl font-bold text-green-400">{kpis.active}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Inactivos</div>
          <div className="text-2xl font-bold text-gray-400">{kpis.inactive}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Precio Promedio</div>
          <div className="text-2xl font-bold text-white">Q{kpis.avgPrice}</div>
        </div>
      </div>
      )}

      {/* Filters - Plans */}
      {activeTab === 'plans' && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>
      )}

      {/* Filters - Promotions */}
      {activeTab === 'promotions' && (
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por título, descripción o código..."
                value={promotionSearchQuery}
                onChange={(e) => setPromotionSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <select
            value={promotionStatusFilter}
            onChange={(e) => setPromotionStatusFilter(e.target.value as any)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activas</option>
            <option value="inactive">Inactivas</option>
          </select>
        </div>
      </div>
      )}

      {/* Form Modal - Plans */}
      {showForm && activeTab === 'plans' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Moneda *
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="GTQ">GTQ (Q)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Precios por Período */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Precios por Período *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">1 Mes</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.prices.monthly}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        prices: { ...formData.prices, monthly: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">3 Meses</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.prices.quarterly}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        prices: { ...formData.prices, quarterly: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">6 Meses</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.prices.semiannual}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        prices: { ...formData.prices, semiannual: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">12 Meses</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.prices.annual}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        prices: { ...formData.prices, annual: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cuota de Inscripción
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.enrollment_fee}
                    onChange={(e) => setFormData({ ...formData, enrollment_fee: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meses de Lealtad
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.loyalty_months}
                    onChange={(e) => setFormData({ ...formData, loyalty_months: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Débito Automático */}
              <div className="flex items-center gap-2 bg-gray-700 p-4 rounded-lg">
                <input
                  type="checkbox"
                  id="autoDebit"
                  checked={formData.autoDebit}
                  onChange={(e) => setFormData({ ...formData, autoDebit: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
                />
                <label htmlFor="autoDebit" className="text-sm text-gray-300 cursor-pointer">
                  Permitir Débito Automático
                </label>
              </div>


              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Características del Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-700 p-4 rounded-lg mb-4">
                  {Object.entries(formData.features).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => toggleFeature(key)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-300">
                        {key === 'cardio' && 'Cardio'}
                        {key === 'pesas' && 'Pesas'}
                        {key === 'clasesBaile' && 'Clases Salón de Baile'}
                        {key === 'clasesFunctional' && 'Clases de Functional'}
                        {key === 'clasesSpinning' && 'Clases de Spinning'}
                        {key === 'sauna' && 'Sauna'}
                        {key === 'cuotaMantenimiento' && 'Cuota de Mantenimiento Incluida'}
                        {key === 'evaluacionFisica' && 'Evaluación Física'}
                        {key === 'invitaAmigo' && 'Invita a un Amigo (Viernes a Domingo)'}
                        {key === 'ingresoOtrasSedes' && 'Ingreso a Otras Sedes'}
                        {key === 'parqueoGratis' && 'Parqueo Gratis'}
                      </span>
                    </label>
                  ))}
                </div>
                
                {/* Custom Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Características Personalizadas
                  </label>
                  <div className="space-y-2">
                    {formData.customFeatures.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.customFeatures];
                            newFeatures[index] = e.target.value;
                            setFormData({ ...formData, customFeatures: newFeatures });
                          }}
                          placeholder="Agregar característica personalizada..."
                          className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        {formData.customFeatures.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newFeatures = formData.customFeatures.filter((_, i) => i !== index);
                              setFormData({ ...formData, customFeatures: newFeatures });
                            }}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          customFeatures: [...formData.customFeatures, '']
                        });
                      }}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Característica
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-300">
                  Plan activo (visible para clientes)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{backgroundColor: '#b5fc00', color: 'black'}}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                  }}
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {editingPlan ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table - Plans */}
      {activeTab === 'plans' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No se encontraron planes</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Precios</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Inscripción</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lealtad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Características</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPlans.map((plan) => {
                  const features = getPlanFeatures(plan);
                  const isExpanded = showFeatures[plan.id];
                  return (
                    <React.Fragment key={plan.id}>
                      <tr className="hover:bg-gray-700/50">
                        <td className="px-4 py-3">
                          <div className="text-white font-medium">{plan.name}</div>
                          {plan.description && (
                            <div className="text-gray-400 text-sm">{plan.description}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white">
                          <div className="space-y-1 text-sm">
                            {plan.features?.prices?.monthly && (
                              <div>1 mes: {plan.currency === 'GTQ' ? 'Q' : '$'}{plan.features.prices.monthly}</div>
                            )}
                            {plan.features?.prices?.quarterly && (
                              <div>3 meses: {plan.currency === 'GTQ' ? 'Q' : '$'}{plan.features.prices.quarterly}</div>
                            )}
                            {plan.features?.prices?.semiannual && (
                              <div>6 meses: {plan.currency === 'GTQ' ? 'Q' : '$'}{plan.features.prices.semiannual}</div>
                            )}
                            {plan.features?.prices?.annual && (
                              <div>12 meses: {plan.currency === 'GTQ' ? 'Q' : '$'}{plan.features.prices.annual}</div>
                            )}
                            {!plan.features?.prices && (
                              <div>1 mes: {plan.currency === 'GTQ' ? 'Q' : '$'}{plan.price}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {plan.currency === 'GTQ' ? 'Q' : '$'}{plan.enrollment_fee || 0}
                        </td>
                        <td className="px-4 py-3 text-gray-300">{plan.loyalty_months || 0} meses</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.is_active 
                              ? 'text-green-400 bg-green-900/20' 
                              : 'text-gray-400 bg-gray-900/20'
                          }`}>
                            {plan.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setShowFeatures({ ...showFeatures, [plan.id]: !isExpanded })}
                            className="text-gray-400 hover:text-white flex items-center gap-1"
                          >
                            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            <span className="text-xs">{features.length} características</span>
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(plan)}
                              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(plan.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="px-4 py-3 bg-gray-700/30">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {features.map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                  {feature}
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {/* Table - Promotions */}
      {activeTab === 'promotions' && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No se encontraron promociones</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Título</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descuento</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Código</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Válido Hasta</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Badge</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredPromotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-gray-700/50">
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{promo.title}</div>
                        <div className="text-gray-400 text-sm">{promo.description}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-sm font-bold text-white" style={{backgroundColor: promo.color}}>
                          {promo.discount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white font-mono text-sm">{promo.coupon_code}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(promo.valid_until).toLocaleDateString('es-GT')}
                      </td>
                      <td className="px-4 py-3">
                        {promo.badge && (
                          <span className="px-2 py-1 rounded-full text-xs font-bold text-white" style={{backgroundColor: promo.color}}>
                            {promo.badge}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          promo.is_active 
                            ? 'text-green-400 bg-green-900/20' 
                            : 'text-gray-400 bg-gray-900/20'
                        }`}>
                          {promo.is_active ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditPromotion(promo)}
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePromotion(promo.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Promotion Form Modal */}
      {showPromotionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}
              </h2>
              <button
                onClick={() => setShowPromotionForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitPromotion} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={promotionFormData.title}
                    onChange={(e) => setPromotionFormData({ ...promotionFormData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descuento *
                  </label>
                  <input
                    type="text"
                    value={promotionFormData.discount}
                    onChange={(e) => setPromotionFormData({ ...promotionFormData, discount: e.target.value })}
                    required
                    placeholder="Ej: 20% OFF"
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción *
                </label>
                <textarea
                  value={promotionFormData.description}
                  onChange={(e) => setPromotionFormData({ ...promotionFormData, description: e.target.value })}
                  rows={3}
                  required
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Código de Cupón *
                  </label>
                  <input
                    type="text"
                    value={promotionFormData.coupon_code}
                    onChange={(e) => setPromotionFormData({ ...promotionFormData, coupon_code: e.target.value.toUpperCase() })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                    placeholder="VERANO2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Válido Hasta *
                  </label>
                  <input
                    type="date"
                    value={promotionFormData.valid_until}
                    onChange={(e) => setPromotionFormData({ ...promotionFormData, valid_until: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Badge (Opcional)
                  </label>
                  <select
                    value={promotionFormData.badge}
                    onChange={(e) => setPromotionFormData({ ...promotionFormData, badge: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Sin badge</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Popular">Popular</option>
                    <option value="Limitado">Limitado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Color *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={promotionFormData.color}
                      onChange={(e) => setPromotionFormData({ ...promotionFormData, color: e.target.value })}
                      className="w-16 h-10 rounded border border-gray-600 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={promotionFormData.color}
                      onChange={(e) => setPromotionFormData({ ...promotionFormData, color: e.target.value })}
                      className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                      placeholder="#ff6b6b"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="promo_is_active"
                  checked={promotionFormData.is_active}
                  onChange={(e) => setPromotionFormData({ ...promotionFormData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                />
                <label htmlFor="promo_is_active" className="text-sm text-gray-300">
                  Promoción activa (visible para clientes)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg font-medium transition-colors"
                  style={{backgroundColor: '#b5fc00', color: 'black'}}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00';
                  }}
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  {editingPromotion ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPromotionForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministracionPlanes;

