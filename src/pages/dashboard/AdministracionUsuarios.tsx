import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers, getSedes } from '@/services/database';
import type { UserProfile } from '@/types/database';
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
  UserCheck,
  Loader2,
  Download,
  RefreshCw,
  MapPin
} from 'lucide-react';

const AdministracionUsuarios: React.FC = () => {
  const { user, userRole } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sedes, setSedes] = useState<any[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'admin' | 'instructor'>('all');
  const [sedeFilter, setSedeFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Masculino' | 'Femenino' | 'Otro'>('all');

  // KPIs
  const [kpis, setKpis] = useState({
    total: 0,
    clients: 0,
    admins: 0,
    instructors: 0,
    withGymCode: 0,
    thisMonth: 0
  });

  useEffect(() => {
    if (userRole === 'admin') {
      loadData();
    }
  }, [user, userRole]);

  useEffect(() => {
    applyFilters();
  }, [users, searchQuery, roleFilter, sedeFilter, genderFilter]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [usersData, sedesData] = await Promise.all([
        getAllUsers(),
        getSedes()
      ]);

      console.log('Users loaded:', usersData.length, usersData);
      setUsers(usersData);
      setSedes(sedesData);
      calculateKPIs(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar los usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateKPIs = (usersData: UserProfile[]) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const kpisData = {
      total: usersData.length,
      clients: usersData.filter(u => u.role === 'client').length,
      admins: usersData.filter(u => u.role === 'admin').length,
      instructors: usersData.filter(u => u.role === 'instructor').length,
      withGymCode: usersData.filter(u => u.gym_code && u.gym_code.trim() !== '').length,
      thisMonth: usersData.filter(u => {
        const createdDate = new Date(u.created_at);
        return createdDate >= startOfMonth;
      }).length
    };

    setKpis(kpisData);
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.gym_code?.toLowerCase().includes(query)
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Sede filter
    if (sedeFilter !== 'all') {
      filtered = filtered.filter(user => user.sede_id === sedeFilter);
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(user => user.gender === genderFilter);
    }

    setFilteredUsers(filtered);
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

  const exportToCSV = () => {
    const headers = ['Nombre', 'Email', 'Teléfono', 'Rol', 'Sede', 'Código Gym', 'Género', 'Fecha Registro'];
    const rows = filteredUsers.map(user => [
      user.full_name || '',
      user.email,
      user.phone || '',
      user.role === 'admin' ? 'Administrador' : user.role === 'instructor' ? 'Instructor' : 'Cliente',
      getSedeName(user.sede_id),
      user.gym_code || '',
      user.gender || '',
      formatDate(user.created_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `usuarios-${new Date().toISOString().split('T')[0]}.csv`;
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Administración de Usuarios</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Gestiona todos los usuarios registrados en el sistema</p>
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
            disabled={filteredUsers.length === 0}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total Usuarios</p>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Clientes</p>
            <UserCheck className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.clients}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Administradores</p>
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.admins}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Instructores</p>
            <UserCheck className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.instructors}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Con Código</p>
            <User className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.withGymCode}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Este Mes</p>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.thisMonth}</p>
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
                placeholder="Nombre, email, teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Rol</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'all' | 'client' | 'admin' | 'instructor')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todos los roles</option>
              <option value="client">Cliente</option>
              <option value="admin">Administrador</option>
              <option value="instructor">Instructor</option>
            </select>
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

          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Género</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as 'all' | 'Masculino' | 'Femenino' | 'Otro')}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todos</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">
              Usuarios ({filteredUsers.length})
            </h3>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Usuario</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Teléfono</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Rol</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Sede</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Código</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Registro</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {user.avatar_url ? (
                              <img
                                src={user.avatar_url}
                                alt={user.full_name || 'Usuario'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.full_name || 'Sin nombre'}</p>
                            {user.gender && (
                              <p className="text-gray-400 text-xs">{user.gender}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-300">{user.phone}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-blue-900/30 text-blue-400'
                            : user.role === 'instructor'
                            ? 'bg-purple-900/30 text-purple-400'
                            : 'bg-green-900/30 text-green-400'
                        }`}>
                          {user.role === 'admin' ? 'Administrador' : user.role === 'instructor' ? 'Instructor' : 'Cliente'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{getSedeName(user.sede_id)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {user.gym_code ? (
                          <span className="text-gray-300 font-mono text-sm">{user.gym_code}</span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300 text-sm">{formatDate(user.created_at)}</span>
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
    </div>
  );
};

export default AdministracionUsuarios;

