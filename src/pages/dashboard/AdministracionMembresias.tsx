import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllUserMemberships, 
  getAllUsers, 
  getAllMembershipPlans, 
  createUserMembership, 
  updateUserMembership, 
  deleteUserMembership,
  deactivateUserActiveMemberships
} from '@/services/database';
import { toast } from 'sonner';
import {
  CreditCard,
  Search,
  Filter,
  User,
  Calendar,
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
  Clock,
  AlertTriangle
} from 'lucide-react';
import type { UserMembership, MembershipPlan, UserProfile } from '@/types/database';

const AdministracionMembresias: React.FC = () => {
  const { user, userRole } = useAuth();
  const [memberships, setMemberships] = useState<any[]>([]);
  const [filteredMemberships, setFilteredMemberships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMembership, setEditingMembership] = useState<any | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'cancelled' | 'frozen'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    user_id: '',
    plan_id: '',
    start_date: '',
    end_date: '',
    status: 'active' as 'active' | 'expired' | 'cancelled' | 'frozen',
    payment_method: '',
    auto_renew: true
  });

  // KPIs
  const [kpis, setKpis] = useState({
    total: 0,
    active: 0,
    expired: 0,
    frozen: 0,
    cancelled: 0,
    thisMonth: 0
  });

  useEffect(() => {
    if (userRole === 'admin') {
      loadData();
    }
  }, [user, userRole]);

  useEffect(() => {
    applyFilters();
  }, [memberships, searchQuery, statusFilter, planFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [membershipsData, usersData, plansData] = await Promise.all([
        getAllUserMemberships(),
        getAllUsers(),
        getAllMembershipPlans()
      ]);

      setMemberships(membershipsData);
      setUsers(usersData.filter(u => u.role === 'client'));
      setPlans(plansData);
      calculateKPIs(membershipsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar las membresías');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateKPIs = (membershipsData: any[]) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get only the most recent active membership per user
    const activeMembershipsByUser = new Map<string, any>();
    membershipsData
      .filter(m => m.status === 'active')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .forEach(m => {
        if (!activeMembershipsByUser.has(m.user_id)) {
          activeMembershipsByUser.set(m.user_id, m);
        }
      });

    const kpisData = {
      total: membershipsData.length,
      active: activeMembershipsByUser.size, // Only count unique users with active memberships
      expired: membershipsData.filter(m => m.status === 'expired').length,
      frozen: membershipsData.filter(m => m.status === 'frozen').length,
      cancelled: membershipsData.filter(m => m.status === 'cancelled').length,
      thisMonth: membershipsData.filter(m => {
        const createdDate = new Date(m.created_at);
        return createdDate >= startOfMonth;
      }).length
    };

    setKpis(kpisData);
  };

  const applyFilters = () => {
    let filtered = [...memberships];

    // If filtering by active status, only show the most recent active membership per user
    if (statusFilter === 'active') {
      const activeMembershipsByUser = new Map<string, any>();
      filtered
        .filter(m => m.status === 'active')
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .forEach(m => {
          if (!activeMembershipsByUser.has(m.user_id)) {
            activeMembershipsByUser.set(m.user_id, m);
          }
        });
      
      // Replace active memberships with only the most recent one per user
      filtered = filtered.filter(m => {
        if (m.status === 'active') {
          return activeMembershipsByUser.get(m.user_id)?.id === m.id;
        }
        return true; // Keep non-active memberships
      });
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(membership => {
        const userName = membership.user?.full_name?.toLowerCase() || '';
        const userEmail = membership.user?.email?.toLowerCase() || '';
        const planName = membership.plan?.name?.toLowerCase() || '';
        
        return userName.includes(query) ||
               userEmail.includes(query) ||
               planName.includes(query);
      });
    }

    // Status filter (already applied above for active, but apply for other statuses)
    if (statusFilter !== 'all' && statusFilter !== 'active') {
      filtered = filtered.filter(membership => membership.status === statusFilter);
    }

    // Plan filter
    if (planFilter !== 'all') {
      filtered = filtered.filter(membership => membership.plan_id === planFilter);
    }

    setFilteredMemberships(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
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
      case 'cancelled':
        return 'text-gray-400 bg-gray-900/20';
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
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const handleCreate = () => {
    setEditingMembership(null);
    setFormData({
      user_id: '',
      plan_id: '',
      start_date: '',
      end_date: '',
      status: 'active',
      payment_method: '',
      auto_renew: true
    });
    setShowForm(true);
  };

  const handleEdit = (membership: any) => {
    setEditingMembership(membership);
    setFormData({
      user_id: membership.user_id,
      plan_id: membership.plan_id,
      start_date: membership.start_date,
      end_date: membership.end_date,
      status: membership.status,
      payment_method: membership.payment_method || '',
      auto_renew: membership.auto_renew ?? true
    });
    setShowForm(true);
  };

  const handleDelete = async (membershipId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta membresía?')) {
      return;
    }

    try {
      await deleteUserMembership(membershipId);
      toast.success('Membresía eliminada correctamente');
      loadData();
    } catch (error: any) {
      console.error('Error deleting membership:', error);
      toast.error(error.message || 'Error al eliminar la membresía');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingMembership) {
        // If updating to active status, deactivate other active memberships for this user
        if (formData.status === 'active') {
          try {
            await deactivateUserActiveMemberships(formData.user_id, editingMembership.id);
          } catch (error) {
            console.error('Error deactivating previous memberships:', error);
          }
        }
        await updateUserMembership(editingMembership.id, formData);
        toast.success('Membresía actualizada correctamente');
      } else {
        await createUserMembership(formData);
        toast.success('Membresía creada correctamente');
      }
      
      setShowForm(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving membership:', error);
      toast.error(error.message || 'Error al guardar la membresía');
    }
  };

  const handlePlanChange = (planId: string) => {
    const selectedPlan = plans.find(p => p.id === planId);
    if (selectedPlan && formData.start_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + selectedPlan.duration_days);
      setFormData({
        ...formData,
        plan_id: planId,
        end_date: endDate.toISOString().split('T')[0]
      });
    } else {
      setFormData({ ...formData, plan_id: planId });
    }
  };

  const handleStartDateChange = (startDate: string) => {
    const selectedPlan = plans.find(p => p.id === formData.plan_id);
    if (selectedPlan) {
      const start = new Date(startDate);
      const end = new Date(start);
      end.setDate(end.getDate() + selectedPlan.duration_days);
      setFormData({
        ...formData,
        start_date: startDate,
        end_date: end.toISOString().split('T')[0]
      });
    } else {
      setFormData({ ...formData, start_date: startDate });
    }
  };

  const exportToCSV = () => {
    const headers = ['Usuario', 'Email', 'Plan', 'Inicio', 'Vence', 'Estado', 'Método de Pago', 'Renovación Automática'];
    const rows = filteredMemberships.map(membership => [
      membership.user?.full_name || '',
      membership.user?.email || '',
      membership.plan?.name || '',
      formatDate(membership.start_date),
      formatDate(membership.end_date),
      getStatusText(membership.status),
      membership.payment_method || '',
      membership.auto_renew ? 'Sí' : 'No'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `membresias-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Administración de Inscripciones</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Gestiona todas las inscripciones y membresías</p>
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
          <button
            onClick={exportToCSV}
            disabled={filteredMemberships.length === 0}
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
            Nueva Inscripción
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Total</div>
          <div className="text-2xl font-bold text-white">{kpis.total}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Activas</div>
          <div className="text-2xl font-bold text-green-400">{kpis.active}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Expiradas</div>
          <div className="text-2xl font-bold text-red-400">{kpis.expired}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Congeladas</div>
          <div className="text-2xl font-bold text-yellow-400">{kpis.frozen}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Canceladas</div>
          <div className="text-2xl font-bold text-gray-400">{kpis.cancelled}</div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm mb-1">Este Mes</div>
          <div className="text-2xl font-bold text-white">{kpis.thisMonth}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por usuario, email o plan..."
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
            <option value="active">Activas</option>
            <option value="expired">Expiradas</option>
            <option value="frozen">Congeladas</option>
            <option value="cancelled">Canceladas</option>
          </select>
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="all">Todos los planes</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingMembership ? 'Editar Inscripción' : 'Nueva Inscripción'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Usuario *
                </label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar usuario</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.email} {user.gym_code ? `(${user.gym_code})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan *
                </label>
                <select
                  value={formData.plan_id}
                  onChange={(e) => handlePlanChange(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Seleccionar plan</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - Q{plan.price} ({plan.duration_days} días)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de Inicio *
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Fecha de Vencimiento *
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active">Activa</option>
                    <option value="expired">Expirada</option>
                    <option value="frozen">Congelada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Método de Pago
                  </label>
                  <input
                    type="text"
                    value={formData.payment_method}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    placeholder="Efectivo, Tarjeta, Transferencia..."
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="auto_renew"
                  checked={formData.auto_renew}
                  onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-green-500 focus:ring-green-500"
                />
                <label htmlFor="auto_renew" className="text-sm text-gray-300">
                  Renovación automática
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
                  {editingMembership ? 'Actualizar' : 'Crear'}
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

      {/* Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredMemberships.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No se encontraron membresías</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Plan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Inicio</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Vence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pago</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredMemberships.map((membership) => (
                  <tr key={membership.id} className="hover:bg-gray-700/50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-white font-medium">{membership.user?.full_name || 'N/A'}</div>
                        <div className="text-gray-400 text-sm">{membership.user?.email || ''}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white">
                      {membership.plan?.name || 'N/A'}
                      {membership.plan?.price && (
                        <div className="text-gray-400 text-sm">Q{membership.plan.price}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{formatDate(membership.start_date)}</td>
                    <td className="px-4 py-3 text-gray-300">{formatDate(membership.end_date)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(membership.status)}`}>
                        {getStatusText(membership.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-sm">
                      {membership.payment_method || 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(membership)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(membership.id)}
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
    </div>
  );
};

export default AdministracionMembresias;

