import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAllSupportTickets, updateSupportTicketStatus } from '@/services/database';
import { type SupportTicket } from '@/types/database';
import { toast } from 'sonner';
import {
  FileText,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  RefreshCw,
  User,
  Mail,
  Phone,
  Calendar,
  Tag,
  Eye,
  X
} from 'lucide-react';

interface TicketWithUser extends SupportTicket {
  user?: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
  };
}

const AdministracionTickets: React.FC = () => {
  const { userRole } = useAuth();
  const [tickets, setTickets] = useState<TicketWithUser[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithUser | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);

  useEffect(() => {
    if (userRole === 'admin') {
      loadTickets();
    }
  }, [userRole]);

  useEffect(() => {
    applyFilters();
  }, [tickets, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const allTickets = await getAllSupportTickets();
      console.log('Tickets loaded:', allTickets);
      setTickets(allTickets);
      if (allTickets.length === 0) {
        console.warn('No tickets found. This might be due to RLS policies. Make sure to run database/allow-admins-view-all-tickets.sql');
      }
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Error al cargar los tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tickets];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.subject.toLowerCase().includes(query) ||
        ticket.message.toLowerCase().includes(query) ||
        ticket.user?.full_name?.toLowerCase().includes(query) ||
        ticket.user?.email?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.category === categoryFilter);
    }

    setFilteredTickets(filtered);
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    setUpdatingTicketId(ticketId);
    try {
      const updated = await updateSupportTicketStatus(ticketId, newStatus);
      if (updated) {
        await loadTickets();
        toast.success(`Ticket ${newStatus === 'resolved' ? 'marcado como resuelto' : newStatus === 'closed' ? 'cerrado' : 'actualizado'} exitosamente`);
      } else {
        throw new Error('No se pudo actualizar el ticket');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      toast.error('Error al actualizar el estado del ticket');
    } finally {
      setUpdatingTicketId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'in_progress': return 'text-blue-400 bg-blue-900/20 border-blue-700';
      case 'resolved': return 'text-green-400 bg-green-900/20 border-green-700';
      case 'closed': return 'text-gray-400 bg-gray-900/20 border-gray-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-red-400 bg-red-900/20 border-red-700';
      case 'Media': return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
      case 'Baja': return 'text-green-400 bg-green-900/20 border-green-700';
      default: return 'text-gray-400 bg-gray-900/20 border-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'membresia': 'Membresía',
      'clases': 'Clases',
      'evaluaciones': 'Evaluaciones',
      'rutinas': 'Rutinas',
      'pagos': 'Pagos',
      'tecnico': 'Técnico',
      'general': 'General'
    };
    return labels[category] || category;
  };

  // Calculate KPIs
  const kpis = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length
  };

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-400">Esta página es solo para administradores</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden max-w-full w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Gestión de Tickets</h1>
          <p className="text-gray-300 mt-1 text-sm sm:text-base">Administra y gestiona los tickets de soporte</p>
        </div>
        <button
          onClick={loadTickets}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.total}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Abiertos</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-400">{kpis.open}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm mb-1">En Proceso</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-400">{kpis.inProgress}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Resueltos</p>
          <p className="text-xl sm:text-2xl font-bold text-green-400">{kpis.resolved}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 border border-gray-700">
          <p className="text-gray-400 text-xs sm:text-sm mb-1">Cerrados</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-400">{kpis.closed}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por asunto, mensaje, usuario..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-500 text-sm sm:text-base"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
          >
            <option value="all">Todos los estados</option>
            <option value="open">Abierto</option>
            <option value="in_progress">En Proceso</option>
            <option value="resolved">Resuelto</option>
            <option value="closed">Cerrado</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
          >
            <option value="all">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 text-sm sm:text-base"
          >
            <option value="all">Todas las categorías</option>
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

      {/* Tickets Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No se encontraron tickets</p>
          </div>
        ) : (
          <div className="overflow-x-auto w-full max-w-full">
            <table className="w-full min-w-0">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">Usuario</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">Asunto</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">Categoría</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">Prioridad</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">Estado</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">Fecha</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-300 whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="min-w-0">
                        <p className="text-white text-xs sm:text-sm font-medium truncate">{ticket.user?.full_name || 'N/A'}</p>
                        <p className="text-gray-400 text-xs truncate">{ticket.user?.email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="min-w-0 max-w-xs">
                        <p className="text-white text-xs sm:text-sm truncate">{ticket.subject}</p>
                        <p className="text-gray-400 text-xs truncate line-clamp-1">{ticket.message}</p>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                        <Tag className="w-3 h-3" />
                        {getCategoryLabel(ticket.category)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <Calendar className="w-3 h-3" />
                        <span className="whitespace-nowrap">{formatDate(ticket.created_at)}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3 sm:py-4">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowTicketModal(true);
                          }}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs transition-colors flex items-center gap-1"
                          title="Ver detalles"
                        >
                          <Eye className="w-3 h-3" />
                          <span className="hidden sm:inline">Ver</span>
                        </button>
                        {ticket.status === 'open' && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, 'in_progress')}
                            disabled={updatingTicketId === ticket.id}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded text-xs transition-colors flex items-center gap-1"
                          >
                            {updatingTicketId === ticket.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Clock className="w-3 h-3" />
                            )}
                            <span className="hidden sm:inline">En Proceso</span>
                          </button>
                        )}
                        {ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                            disabled={updatingTicketId === ticket.id}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white rounded text-xs transition-colors flex items-center gap-1"
                          >
                            {updatingTicketId === ticket.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                            <span className="hidden sm:inline">Resuelto</span>
                          </button>
                        )}
                        {ticket.status !== 'closed' && (
                          <button
                            onClick={() => handleUpdateStatus(ticket.id, 'closed')}
                            disabled={updatingTicketId === ticket.id}
                            className="px-2 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded text-xs transition-colors flex items-center gap-1"
                          >
                            {updatingTicketId === ticket.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                            <span className="hidden sm:inline">Cerrar</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-gray-300" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Detalles del Ticket</h2>
                  <p className="text-gray-400 text-xs sm:text-sm">ID: {selectedTicket.id.substring(0, 8)}...</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setSelectedTicket(null);
                }}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* User Information */}
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Información del Usuario
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Nombre</p>
                    <p className="text-white text-sm sm:text-base">{selectedTicket.user?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <a 
                        href={`mailto:${selectedTicket.user?.email}`}
                        className="text-white text-sm sm:text-base hover:text-blue-400 transition-colors break-all"
                      >
                        {selectedTicket.user?.email || 'N/A'}
                      </a>
                    </div>
                  </div>
                  {selectedTicket.user?.phone && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Teléfono</p>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <a 
                          href={`tel:${selectedTicket.user.phone.replace(/\s/g, '')}`}
                          className="text-white text-sm sm:text-base hover:text-blue-400 transition-colors"
                        >
                          {selectedTicket.user.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Information */}
              <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Información del Ticket
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Asunto</p>
                    <p className="text-white text-sm sm:text-base font-medium">{selectedTicket.subject}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Mensaje</p>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-600">
                      <p className="text-white text-sm sm:text-base whitespace-pre-wrap break-words">
                        {selectedTicket.message}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Categoría</p>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-300">
                        <Tag className="w-3 h-3" />
                        {getCategoryLabel(selectedTicket.category)}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Prioridad</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Estado</p>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTicket.status)}`}>
                        {getStatusLabel(selectedTicket.status)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-600">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Fecha de Creación</p>
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span>{formatDate(selectedTicket.created_at)}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Última Actualización</p>
                      <div className="flex items-center gap-2 text-white text-sm">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{formatDate(selectedTicket.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 sm:p-6 border-t border-gray-700 flex-shrink-0 bg-gray-800/50">
              <div className="flex flex-wrap items-center gap-2">
                {selectedTicket.status === 'open' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedTicket.id, 'in_progress');
                      setShowTicketModal(false);
                      setSelectedTicket(null);
                    }}
                    disabled={updatingTicketId === selectedTicket.id}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-2"
                  >
                    {updatingTicketId === selectedTicket.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                    Marcar como En Proceso
                  </button>
                )}
                {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedTicket.id, 'resolved');
                      setShowTicketModal(false);
                      setSelectedTicket(null);
                    }}
                    disabled={updatingTicketId === selectedTicket.id}
                    className="px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-2"
                  >
                    {updatingTicketId === selectedTicket.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    Marcar como Resuelto
                  </button>
                )}
                {selectedTicket.status !== 'closed' && (
                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedTicket.id, 'closed');
                      setShowTicketModal(false);
                      setSelectedTicket(null);
                    }}
                    disabled={updatingTicketId === selectedTicket.id}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-2"
                  >
                    {updatingTicketId === selectedTicket.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    Cerrar Ticket
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setShowTicketModal(false);
                  setSelectedTicket(null);
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs sm:text-sm transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministracionTickets;

