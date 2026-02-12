import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllInstructors, createInstructor, updateInstructor, deleteInstructor, getSedes } from '@/services/database';
import type { Instructor } from '@/types/database';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  MapPin,
  Loader2,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  X,
  Save
} from 'lucide-react';

const AdministracionInstructores: React.FC = () => {
  const { user, userRole } = useAuth();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [filteredInstructors, setFilteredInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sedes, setSedes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [sedeFilter, setSedeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialty: '',
    sede_id: '',
    bio: '',
    is_active: true
  });

  // KPIs
  const [kpis, setKpis] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  useEffect(() => {
    if (userRole === 'admin') {
      loadData();
    }
  }, [user, userRole]);

  useEffect(() => {
    applyFilters();
  }, [instructors, searchQuery, sedeFilter, statusFilter, specialtyFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [instructorsData, sedesData] = await Promise.all([
        getAllInstructors(),
        getSedes()
      ]);

      setInstructors(instructorsData);
      setSedes(sedesData);
      calculateKPIs(instructorsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los instructores');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateKPIs = (instructorsData: Instructor[]) => {
    const active = instructorsData.filter(i => i.is_active).length;

    setKpis({
      total: instructorsData.length,
      active,
      inactive: instructorsData.length - active
    });
  };

  const applyFilters = () => {
    let filtered = [...instructors];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(instructor => 
        instructor.name?.toLowerCase().includes(query) ||
        instructor.email?.toLowerCase().includes(query) ||
        instructor.phone?.toLowerCase().includes(query) ||
        instructor.specialty?.toLowerCase().includes(query) ||
        instructor.bio?.toLowerCase().includes(query)
      );
    }

    // Sede filter
    if (sedeFilter !== 'all') {
      filtered = filtered.filter(instructor => instructor.sede_id === sedeFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(instructor => instructor.is_active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(instructor => !instructor.is_active);
    }

    // Specialty filter
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(instructor => 
        instructor.specialty?.toLowerCase().includes(specialtyFilter.toLowerCase())
      );
    }

    setFilteredInstructors(filtered);
  };

  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor);
    setFormData({
      name: instructor.name || '',
      email: instructor.email || '',
      phone: instructor.phone || '',
      specialty: instructor.specialty || '',
      sede_id: instructor.sede_id || '',
      bio: instructor.bio || '',
      is_active: instructor.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (instructorId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este instructor?')) {
      return;
    }

    try {
      const success = await deleteInstructor(instructorId);
      if (success) {
        toast.success('Instructor eliminado exitosamente');
        await loadData();
      } else {
        toast.error('Error al eliminar el instructor');
      }
    } catch (error) {
      console.error('Error deleting instructor:', error);
      toast.error('Error al eliminar el instructor');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const instructorData: Partial<Instructor> = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        specialty: formData.specialty || null,
        sede_id: formData.sede_id || null,
        bio: formData.bio || null,
        is_active: formData.is_active
      };

      let result;
      if (editingInstructor) {
        result = await updateInstructor(editingInstructor.id, instructorData);
        if (result) {
          toast.success('Instructor actualizado exitosamente');
        }
      } else {
        result = await createInstructor(instructorData);
        if (result) {
          toast.success('Instructor creado exitosamente');
        }
      }

      if (result) {
        setShowForm(false);
        setEditingInstructor(null);
        setFormData({
          name: '',
          email: '',
          phone: '',
          specialty: '',
          sede_id: '',
          bio: '',
          is_active: true
        });
        await loadData();
      } else {
        toast.error('Error al guardar el instructor');
      }
    } catch (error) {
      console.error('Error saving instructor:', error);
      toast.error('Error al guardar el instructor');
    }
  };

  const handleNew = () => {
    setEditingInstructor(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      specialty: '',
      sede_id: '',
      bio: '',
      is_active: true
    });
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSedeName = (sedeId: string | null) => {
    if (!sedeId) return 'Sin sede';
    const sede = sedes.find(s => s.id === sedeId);
    return sede?.name || 'Sin sede';
  };

  const getSpecialties = () => {
    const specialties = new Set<string>();
    instructors.forEach(instructor => {
      if (instructor.specialty) {
        instructor.specialty.split(',').forEach(s => {
          specialties.add(s.trim());
        });
      }
    });
    return Array.from(specialties).sort();
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Email', 'Teléfono', 'Especialidad', 'Sede', 'Estado', 'Fecha Registro'];
    const rows = filteredInstructors.map(instructor => [
      instructor.name,
      instructor.email || '',
      instructor.phone || '',
      instructor.specialty || '',
      getSedeName(instructor.sede_id),
      instructor.is_active ? 'Activo' : 'Inactivo',
      formatDate(instructor.created_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `instructores-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Administración de Instructores</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Gestiona todos los instructores del sistema</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleNew}
            className="px-4 py-2 text-black rounded-lg font-medium transition-colors flex items-center gap-2"
            style={{backgroundColor: '#b5fc00'}}
            onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600'}
            onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00'}
          >
            <Plus className="w-4 h-4" />
            Nuevo Instructor
          </button>
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
            disabled={filteredInstructors.length === 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total</p>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Activos</p>
            <User className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.active}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Inactivos</p>
            <User className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.inactive}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-bold text-white">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-300 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Nombre, email, especialidad..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Sede Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sede</label>
            <select
              value={sedeFilter}
              onChange={(e) => setSedeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todas las sedes</option>
              {sedes.map(sede => (
                <option key={sede.id} value={sede.id}>{sede.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          {/* Specialty Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Especialidad</label>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todas</option>
              {getSpecialties().map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Instructores ({filteredInstructors.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredInstructors.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No se encontraron instructores</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Instructor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Contacto</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Especialidad</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Sede</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Estado</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInstructors.map((instructor) => (
                    <tr key={instructor.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{instructor.name}</p>
                            {instructor.bio && (
                              <p className="text-gray-400 text-xs line-clamp-1">{instructor.bio}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {instructor.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-300 text-sm">{instructor.email}</span>
                            </div>
                          )}
                          {instructor.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-300 text-sm">{instructor.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-300 text-sm">{instructor.specialty || '-'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{getSedeName(instructor.sede_id)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          instructor.is_active
                            ? 'bg-green-900/30 text-green-400'
                            : 'bg-red-900/30 text-red-400'
                        }`}>
                          {instructor.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(instructor)}
                            className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(instructor.id)}
                            className="p-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors"
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingInstructor ? 'Editar Instructor' : 'Nuevo Instructor'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Especialidad</label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    placeholder="Ej: Pilates, Spinning, Yoga"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sede</label>
                  <select
                    value={formData.sede_id}
                    onChange={(e) => setFormData({...formData, sede_id: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                  >
                    <option value="">Sin sede</option>
                    {sedes.map(sede => (
                      <option key={sede.id} value={sede.id}>{sede.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Biografía</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="w-4 h-4 rounded bg-gray-700 border-gray-600"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-300">
                  Instructor activo
                </label>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-black rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  style={{backgroundColor: '#b5fc00'}}
                  onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#a3e600'}
                  onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#b5fc00'}
                >
                  <Save className="w-4 h-4" />
                  {editingInstructor ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministracionInstructores;

