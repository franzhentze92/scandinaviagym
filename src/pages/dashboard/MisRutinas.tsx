import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllWorkoutRoutines, 
  getWorkoutRoutine
} from '@/services/database';
import { toast } from 'sonner';
import {
  Activity,
  Search,
  Filter,
  User,
  Calendar,
  Loader2,
  Eye,
  X
} from 'lucide-react';

const MisRutinas: React.FC = () => {
  const { user, userRole } = useAuth();
  const [routines, setRoutines] = useState<any[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingRoutine, setViewingRoutine] = useState<any | null>(null);
  
  // Filters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // KPIs
  const [kpis, setKpis] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [routines, startDate, endDate]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const routinesData = await getAllWorkoutRoutines({
        userId: user.id
      });

      setRoutines(routinesData);
      calculateKPIs(routinesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar las rutinas');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateKPIs = (routinesData: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayCount = routinesData.filter(r => {
      const createdDate = new Date(r.created_at);
      return createdDate >= today && createdDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }).length;

    const weekCount = routinesData.filter(r => {
      const createdDate = new Date(r.created_at);
      return createdDate >= weekStart;
    }).length;

    const monthCount = routinesData.filter(r => {
      const createdDate = new Date(r.created_at);
      return createdDate >= monthStart;
    }).length;

    setKpis({
      total: routinesData.length,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount
    });
  };

  const applyFilters = () => {
    let filtered = [...routines];

    // Date filters
    if (startDate) {
      filtered = filtered.filter(routine => routine.created_at >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(routine => routine.created_at <= endDate);
    }

    setFilteredRoutines(filtered);
  };

  const handleView = async (routine: any) => {
    try {
      const fullRoutine = await getWorkoutRoutine(routine.id);
      if (fullRoutine) {
        setViewingRoutine(fullRoutine);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error loading routine:', error);
      toast.error('Error al cargar la rutina');
    }
  };

  const daysOfWeek = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  const daysOfWeekLower = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Rutinas de Entrenamiento</h1>
          <p className="text-gray-400">Visualiza las rutinas de entrenamiento creadas para ti</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total</p>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Este Mes</p>
            <Calendar className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.thisMonth}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Esta Semana</p>
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.thisWeek}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Hoy</p>
            <Calendar className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{kpis.today}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Fecha Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Fecha Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStartDate('');
                setEndDate('');
              }}
              className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#b5fc00]" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Fecha Creación</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Creado Por</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Tipo de Rutina</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutines.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                    No se encontraron rutinas
                  </td>
                </tr>
              ) : (
                filteredRoutines.map((routine) => {
                  const routineType = routine.routine_data?.formulario?.rutina_inteligente?.semana?.lunes?.ejercicios?.length > 0 
                    ? 'Inteligente' 
                    : 'Clásica';
                  
                  return (
                    <tr key={routine.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-white">
                        {new Date(routine.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-4 py-3 text-white">
                        {routine.created_by_user?.full_name || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-white">
                        <span className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-lg text-sm">
                          {routineType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleView(routine)}
                            className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                            title="Ver"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingRoutine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">Ver Rutina de Entrenamiento</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Información Básica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Creado Por</p>
                    <p className="text-white">{viewingRoutine.created_by_user?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Fecha de Creación</p>
                    <p className="text-white">{new Date(viewingRoutine.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                </div>
              </div>

              {viewingRoutine.routine_data && (
                <>
                  {/* Title and Subtitle */}
                  {viewingRoutine.routine_data.formulario?.titulo && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 text-center">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {viewingRoutine.routine_data.formulario.titulo}
                      </h2>
                      {viewingRoutine.routine_data.formulario.subtitulo && (
                        <p className="text-gray-300">{viewingRoutine.routine_data.formulario.subtitulo}</p>
                      )}
                    </div>
                  )}

                  {/* Basic Fields */}
                  {viewingRoutine.routine_data.formulario?.campos && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Datos Básicos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(viewingRoutine.routine_data.formulario.campos).map(([key, value]: [string, any]) => {
                          if (key === 'checkbox_sin_etiqueta') return null;
                          return (
                            <div key={key}>
                              <p className="text-sm text-gray-400 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                              <p className="text-white">{value || 'N/A'}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Classic Routine Table */}
                  {viewingRoutine.routine_data.formulario?.tabla_rutina_clasica && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Rutina Clásica</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-800">
                              <th className="px-2 py-2 text-left text-gray-300">Fila</th>
                              {daysOfWeek.map(day => (
                                <th key={day} className="px-2 py-2 text-center text-gray-300">{day}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {viewingRoutine.routine_data.formulario.tabla_rutina_clasica.filas.map((fila: any) => (
                              <tr key={fila.row} className="border-b border-gray-700">
                                <td className="px-2 py-2 text-gray-300">{fila.row}</td>
                                {daysOfWeek.map(day => (
                                  <td key={day} className="px-2 py-2 text-white text-center">
                                    {fila[day] || '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Smart Routine */}
                  {viewingRoutine.routine_data.formulario?.rutina_inteligente && (
                    <div className="space-y-6">
                      {/* General Configuration */}
                      {viewingRoutine.routine_data.formulario.rutina_inteligente.configuracion_general && (
                        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                          <h3 className="text-lg font-semibold text-white mb-4">Configuración General</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(viewingRoutine.routine_data.formulario.rutina_inteligente.configuracion_general).map(([key, value]: [string, any]) => (
                              <div key={key}>
                                <p className="text-sm text-gray-400 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                                <p className="text-white">{value || 'N/A'}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Weekly Schedule */}
                      {viewingRoutine.routine_data.formulario.rutina_inteligente.semana && (
                        <div className="space-y-4">
                          {daysOfWeekLower.map((day) => {
                            const dayData = viewingRoutine.routine_data.formulario.rutina_inteligente.semana[day];
                            if (!dayData || !dayData.ejercicios || dayData.ejercicios.length === 0) return null;
                            
                            return (
                              <div key={day} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                                <h3 className="text-lg font-semibold text-white mb-4 capitalize">{day}</h3>
                                {dayData.tipo_entrenamiento && (
                                  <p className="text-gray-300 mb-4">Tipo de Entrenamiento: {dayData.tipo_entrenamiento}</p>
                                )}
                                <div className="space-y-4">
                                  {dayData.ejercicios.map((ejercicio: any, index: number) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                      <h4 className="text-md font-semibold text-white mb-3">
                                        {index + 1}. {ejercicio.nombre || 'Ejercicio sin nombre'}
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {ejercicio.grupo_muscular && (
                                          <div>
                                            <p className="text-sm text-gray-400 mb-1">Grupo Muscular</p>
                                            <p className="text-white">{ejercicio.grupo_muscular}</p>
                                          </div>
                                        )}
                                        {ejercicio.series !== null && ejercicio.series !== undefined && (
                                          <div>
                                            <p className="text-sm text-gray-400 mb-1">Series</p>
                                            <p className="text-white">{ejercicio.series}</p>
                                          </div>
                                        )}
                                        {ejercicio.repeticiones && (
                                          <div>
                                            <p className="text-sm text-gray-400 mb-1">Repeticiones</p>
                                            <p className="text-white">{ejercicio.repeticiones}</p>
                                          </div>
                                        )}
                                        {ejercicio.peso_kg !== null && ejercicio.peso_kg !== undefined && (
                                          <div>
                                            <p className="text-sm text-gray-400 mb-1">Peso (kg)</p>
                                            <p className="text-white">{ejercicio.peso_kg}</p>
                                          </div>
                                        )}
                                        {ejercicio.intensidad_rpe !== null && ejercicio.intensidad_rpe !== undefined && (
                                          <div>
                                            <p className="text-sm text-gray-400 mb-1">Intensidad RPE</p>
                                            <p className="text-white">{ejercicio.intensidad_rpe}</p>
                                          </div>
                                        )}
                                        {ejercicio.descanso_segundos !== null && ejercicio.descanso_segundos !== undefined && (
                                          <div>
                                            <p className="text-sm text-gray-400 mb-1">Descanso (segundos)</p>
                                            <p className="text-white">{ejercicio.descanso_segundos}</p>
                                          </div>
                                        )}
                                        {ejercicio.tempo && (
                                          <div>
                                            <p className="text-sm text-gray-400 mb-1">Tempo</p>
                                            <p className="text-white">{ejercicio.tempo}</p>
                                          </div>
                                        )}
                                        {ejercicio.observaciones && (
                                          <div className="md:col-span-3">
                                            <p className="text-sm text-gray-400 mb-1">Observaciones</p>
                                            <p className="text-white">{ejercicio.observaciones}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisRutinas;

