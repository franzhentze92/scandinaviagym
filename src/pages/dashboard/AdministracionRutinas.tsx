import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllWorkoutRoutines, 
  getWorkoutRoutine,
  createWorkoutRoutine, 
  updateWorkoutRoutine, 
  deleteWorkoutRoutine,
  getAllUsers,
  getUserProfile
} from '@/services/database';
import { toast } from 'sonner';
import {
  Dumbbell,
  Search,
  Filter,
  User,
  Calendar,
  Loader2,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Eye
} from 'lucide-react';

// Exercise categories and exercises
const exerciseCategories = {
  'PECHO': [
    'Press plano con barra',
    'Press inclinado con mancuernas',
    'Press declinado',
    'Aperturas (flys) con mancuernas',
    'Flys en máquina',
    'Peck deck',
    'Crossover (poleas)',
    'Fondos para pecho'
  ],
  'ESPALDA': [
    'Jalón al pecho',
    'Jalón tras nuca',
    'Remo sentado en polea',
    'Remo con barra',
    'Remo con mancuerna',
    'Dominadas',
    'Peso muerto',
    'Hiperextensiones'
  ],
  'HOMBRO': [
    'Press militar con barra',
    'Press con mancuernas',
    'Elevaciones laterales',
    'Elevaciones frontales',
    'Pájaros (posterior)',
    'Elevaciones en polea',
    'Remo al mentón',
    'Press Arnold'
  ],
  'BÍCEPS': [
    'Curl con barra',
    'Curl alterno con mancuernas',
    'Curl concentrado',
    'Curl predicador',
    'Curl martillo',
    'Curl invertido',
    'Curl en polea baja',
    'Curl en banco inclinado'
  ],
  'TRÍCEPS': [
    'Fondos en banco',
    'Extensión de tríceps sentado',
    'Press francés con barra',
    'Patada de burro',
    'Extensión en polea alta',
    'Extensión con mancuerna sobre cabeza',
    'Press cerrado',
    'Extensión en polea invertida'
  ],
  'PIERNA': [
    'Sentadilla libre',
    'Sentadilla hack',
    'Prensa de piernas',
    'Extensión de piernas',
    'Curl femoral',
    'Peso muerto rumano',
    'Abducciones',
    'Aductores'
  ],
  'GLÚTEO': [
    'Abducción de cadera',
    'Desplantes',
    'Extensión de cadera',
    'Extensión de pelvis',
    'Patada de glúteo en polea',
    'Hip thrust',
    'Puente de glúteo',
    'Step-up'
  ],
  'ABDOMEN': [
    'Elevación de tronco',
    'Encogimientos en banco',
    'Encogimientos en polea',
    'Elevación de piernas',
    'Encogimiento inferior',
    'Flexión lateral',
    'Crunch abdominal',
    'Abdominales en máquina'
  ]
};

// Initial form data structure based on JSON
const initialFormData = {
  formulario: {
    id: "rutina_semanal_scandinavia",
    titulo: "SCANDINAVIA GYM",
    subtitulo: "BODY BUILDING & HEALTH CENTER",
    tipo: "rutina_semanal",
    campos: {
      checkbox_sin_etiqueta: false,
      nombre: "",
      fecha: "",
      edad: "",
      cardio: "",
      codigo: "",
      resultado_fit_test: "",
      nivel: "",
      hr_recomendado_ft: "",
      realizado_por: ""
    },
    rutina_inteligente: {
      configuracion_general: {
        objetivo_principal: "",
        nivel: "",
        dias_entrenamiento_semana: null,
        duracion_sesion_minutos: null,
        cardio_hr_objetivo: "",
        observaciones_entrenador: ""
      },
      semana: {
        lunes: {
          tipo_entrenamiento: "",
          ejercicios: []
        },
        martes: {
          tipo_entrenamiento: "",
          ejercicios: []
        },
        miercoles: {
          tipo_entrenamiento: "",
          ejercicios: []
        },
        jueves: {
          tipo_entrenamiento: "",
          ejercicios: []
        },
        viernes: {
          tipo_entrenamiento: "",
          ejercicios: []
        },
        sabado: {
          tipo_entrenamiento: "",
          ejercicios: []
        },
        domingo: {
          tipo_entrenamiento: "",
          ejercicios: []
        }
      }
    },
    automatizacion: {
      sugerir_rutina_por: {
        nivel: true,
        objetivo: true,
        edad: true,
        resultado_fit_test: true,
        historia_clinica: true
      },
      alertas_medicas: {
        lesion_detectada: true,
        problema_cardiaco: true,
        embarazo: true
      },
      ajustes_automaticos: {
        reducir_volumen_si_hr_alta: true,
        bloquear_ejercicios_por_lesion: true,
        recomendar_descanso: true
      }
    }
  }
};

const AdministracionRutinas: React.FC = () => {
  const { user, userRole } = useAuth();
  const [routines, setRoutines] = useState<any[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<any | null>(null);
  const [viewingRoutine, setViewingRoutine] = useState<any | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Form state
  const [formData, setFormData] = useState(initialFormData);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // KPIs
  const [kpis, setKpis] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    today: 0
  });

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'instructor') {
      loadData();
    }
  }, [user, userRole]);

  useEffect(() => {
    applyFilters();
  }, [routines, searchQuery, userFilter, startDate, endDate]);

  // Load user profile data when user is selected
  useEffect(() => {
    const loadUserProfileData = async () => {
      if (selectedUserId && showForm) {
        try {
          const userProfile = await getUserProfile(selectedUserId);
          if (userProfile) {
            // Get age from profile, or calculate from birth_date if age is not set
            let age = '';
            if (userProfile.age !== null && userProfile.age !== undefined) {
              age = userProfile.age.toString();
            } else if (userProfile.birth_date) {
              // Fallback: calculate age from birth_date if age is not set
              const birthDate = new Date(userProfile.birth_date);
              const today = new Date();
              const calculatedAge = today.getFullYear() - birthDate.getFullYear();
              const monthDiff = today.getMonth() - birthDate.getMonth();
              if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age = (calculatedAge - 1).toString();
              } else {
                age = calculatedAge.toString();
              }
            }

            // Update form data with user profile information
            setFormData(prev => ({
              ...prev,
              formulario: {
                ...prev.formulario,
                campos: {
                  ...prev.formulario.campos,
                  nombre: userProfile.full_name || '',
                  edad: age,
                  codigo: userProfile.gym_code || '',
                  realizado_por: user?.email || ''
                }
              }
            }));
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    loadUserProfileData();
  }, [selectedUserId, showForm, user]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [routinesData, usersData] = await Promise.all([
        getAllWorkoutRoutines(),
        getAllUsers()
      ]);

      setRoutines(routinesData);
      setUsers(usersData.filter(u => u.role === 'client'));
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

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(routine => {
        const userName = routine.user?.full_name?.toLowerCase() || '';
        const userEmail = routine.user?.email?.toLowerCase() || '';
        const userCode = routine.user?.gym_code?.toLowerCase() || '';
        const routineName = routine.routine_data?.formulario?.campos?.nombre?.toLowerCase() || '';
        return userName.includes(query) || userEmail.includes(query) || userCode.includes(query) || routineName.includes(query);
      });
    }

    // User filter
    if (userFilter !== 'all') {
      filtered = filtered.filter(routine => routine.user_id === userFilter);
    }

    // Date filters
    if (startDate) {
      filtered = filtered.filter(routine => routine.created_at >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(routine => routine.created_at <= endDate);
    }

    setFilteredRoutines(filtered);
  };

  const handleCreate = () => {
    setFormData(initialFormData);
    setSelectedUserId('');
    setEditingRoutine(null);
    setShowForm(true);
  };

  const handleEdit = async (routine: any) => {
    try {
      const fullRoutine = await getWorkoutRoutine(routine.id);
      if (fullRoutine) {
        setFormData(fullRoutine.routine_data);
        setSelectedUserId(fullRoutine.user_id);
        setEditingRoutine(fullRoutine);
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error loading routine:', error);
      toast.error('Error al cargar la rutina');
    }
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

  const handleDelete = async (routine: any) => {
    if (!confirm('¿Estás seguro de eliminar esta rutina?')) return;

    try {
      await deleteWorkoutRoutine(routine.id);
      toast.success('Rutina eliminada correctamente');
      loadData();
    } catch (error) {
      console.error('Error deleting routine:', error);
      toast.error('Error al eliminar la rutina');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUserId) {
      toast.error('Debes seleccionar un usuario');
      return;
    }

    try {
      // Set current date
      const updatedFormData = {
        ...formData,
        formulario: {
          ...formData.formulario,
          campos: {
            ...formData.formulario.campos,
            fecha: formData.formulario.campos.fecha || new Date().toISOString().split('T')[0],
            realizado_por: formData.formulario.campos.realizado_por || user?.email || ''
          }
        }
      };

      if (editingRoutine) {
        await updateWorkoutRoutine(editingRoutine.id, {
          routine_data: updatedFormData
        });
        toast.success('Rutina actualizada correctamente');
      } else {
        await createWorkoutRoutine(
          selectedUserId,
          user!.id,
          updatedFormData
        );
        toast.success('Rutina creada correctamente');
      }
      
      setShowForm(false);
      loadData();
    } catch (error: any) {
      console.error('Error saving routine:', error);
      toast.error(error.message || 'Error al guardar la rutina');
    }
  };

  const updateFormData = (path: (string | number)[], value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (typeof key === 'number') {
          if (!Array.isArray(current)) {
            current = [];
          }
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        } else {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
      }
      
      const lastKey = path[path.length - 1];
      if (typeof lastKey === 'number') {
        if (!Array.isArray(current)) {
          current = [];
        }
        current[lastKey] = value;
      } else {
        current[lastKey] = value;
      }
      
      return newData;
    });
  };

  const addExercise = (day: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      const dayKey = day.toLowerCase() as keyof typeof newData.formulario.rutina_inteligente.semana;
      if (!newData.formulario.rutina_inteligente.semana[dayKey].ejercicios) {
        newData.formulario.rutina_inteligente.semana[dayKey].ejercicios = [];
      }
      newData.formulario.rutina_inteligente.semana[dayKey].ejercicios.push({
        categoria: "",
        ejercicio: "",
        nombre: "", // Keep for backward compatibility, will be set from categoria + ejercicio
        grupo_muscular: "",
        series: null,
        repeticiones: "",
        peso_kg: null,
        intensidad_rpe: null,
        descanso_segundos: null,
        tempo: "",
        observaciones: ""
      });
      return newData;
    });
  };

  const removeExercise = (day: string, index: number) => {
    setFormData(prev => {
      const newData = { ...prev };
      const dayKey = day.toLowerCase() as keyof typeof newData.formulario.rutina_inteligente.semana;
      newData.formulario.rutina_inteligente.semana[dayKey].ejercicios.splice(index, 1);
      return newData;
    });
  };

  const updateExercise = (day: string, index: number, field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const dayKey = day.toLowerCase() as keyof typeof newData.formulario.rutina_inteligente.semana;
      (newData.formulario.rutina_inteligente.semana[dayKey].ejercicios[index] as any)[field] = value;
      return newData;
    });
  };

  const exportToCSV = () => {
    const headers = ['Usuario', 'Email', 'Código', 'Fecha Creación', 'Creado Por'];
    const rows = filteredRoutines.map(routine => [
      routine.user?.full_name || '',
      routine.user?.email || '',
      routine.user?.gym_code || '',
      new Date(routine.created_at).toLocaleDateString('es-ES'),
      routine.created_by_user?.full_name || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rutinas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const daysOfWeek = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
  const daysOfWeekLower = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  return (
    <div className="space-y-6 overflow-x-hidden max-w-full w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Administración de Rutinas</h1>
          <p className="text-gray-400 text-sm sm:text-base">Gestiona las rutinas de entrenamiento para los clientes</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            className="w-full sm:w-auto px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
            <span className="sm:hidden">Exportar</span>
          </button>
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto px-4 py-2 text-black rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            style={{backgroundColor: '#b5fc00'}}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Rutina</span>
            <span className="sm:hidden">Nueva</span>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs sm:text-sm">Total</p>
            <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.total}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs sm:text-sm">Este Mes</p>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.thisMonth}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs sm:text-sm">Esta Semana</p>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.thisWeek}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-3 sm:p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-xs sm:text-sm">Hoy</p>
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white">{kpis.today}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Filtros</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full overflow-x-hidden max-w-full">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Usuario, email, código..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Usuario</label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
            >
              <option value="all">Todos los usuarios</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.full_name}</option>
              ))}
            </select>
          </div>
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
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#b5fc00]" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-x-auto w-full max-w-full">
          <table className="w-full min-w-0">
            <thead className="bg-gray-700 border-b border-gray-600">
              <tr>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">Usuario</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300">Fecha Creación</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-300 hidden md:table-cell">Creado Por</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-semibold text-gray-300">Acciones</th>
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
                filteredRoutines.map((routine) => (
                  <tr key={routine.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex items-center gap-3">
                        {routine.user?.avatar_url ? (
                          <img 
                            src={routine.user.avatar_url} 
                            alt={routine.user.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">{routine.user?.full_name || 'N/A'}</p>
                          <p className="text-gray-400 text-sm">{routine.user?.email || ''}</p>
                        </div>
                      </div>
                    </td>
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
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleView(routine)}
                          className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(routine)}
                          className="p-2 text-yellow-400 hover:bg-yellow-400/20 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(routine)}
                          className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">
                {editingRoutine ? 'Editar Rutina' : 'Nueva Rutina'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* User Selection */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Seleccionar Usuario</h3>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                >
                  <option value="">Selecciona un usuario</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.full_name} - {user.email}</option>
                  ))}
                </select>
              </div>

              {/* Basic Fields */}
              <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Datos Básicos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full overflow-x-hidden max-w-full">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nombre</label>
                    <input
                      type="text"
                      value={formData.formulario.campos.nombre}
                      onChange={(e) => updateFormData(['formulario', 'campos', 'nombre'], e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Fecha</label>
                    <input
                      type="date"
                      value={formData.formulario.campos.fecha}
                      onChange={(e) => updateFormData(['formulario', 'campos', 'fecha'], e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Edad</label>
                    <input
                      type="text"
                      value={formData.formulario.campos.edad}
                      onChange={(e) => updateFormData(['formulario', 'campos', 'edad'], e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Cardio</label>
                    <input
                      type="text"
                      value={formData.formulario.campos.cardio}
                      onChange={(e) => updateFormData(['formulario', 'campos', 'cardio'], e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Código</label>
                    <input
                      type="text"
                      value={formData.formulario.campos.codigo}
                      onChange={(e) => updateFormData(['formulario', 'campos', 'codigo'], e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Resultado Fit Test</label>
                    <input
                      type="text"
                      value={formData.formulario.campos.resultado_fit_test}
                      onChange={(e) => updateFormData(['formulario', 'campos', 'resultado_fit_test'], e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nivel</label>
                    <input
                      type="text"
                      value={formData.formulario.campos.nivel}
                      onChange={(e) => updateFormData(['formulario', 'campos', 'nivel'], e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">HR Recomendado FT</label>
                    <input
                      type="text"
                      value={formData.formulario.campos.hr_recomendado_ft}
                      onChange={(e) => updateFormData(['formulario', 'campos', 'hr_recomendado_ft'], e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Realizado Por</label>
                    <input
                      type="text"
                      value={formData.formulario.campos.realizado_por}
                      onChange={(e) => updateFormData(['formulario', 'campos', 'realizado_por'], e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Smart Routine */}
              <div className="space-y-6">
                  {/* General Configuration */}
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">Configuración General</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full overflow-x-hidden max-w-full">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Objetivo Principal</label>
                        <input
                          type="text"
                          value={formData.formulario.rutina_inteligente.configuracion_general.objetivo_principal}
                          onChange={(e) => updateFormData(['formulario', 'rutina_inteligente', 'configuracion_general', 'objetivo_principal'], e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Nivel</label>
                        <input
                          type="text"
                          value={formData.formulario.rutina_inteligente.configuracion_general.nivel}
                          onChange={(e) => updateFormData(['formulario', 'rutina_inteligente', 'configuracion_general', 'nivel'], e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Días Entrenamiento/Semana</label>
                        <input
                          type="number"
                          value={formData.formulario.rutina_inteligente.configuracion_general.dias_entrenamiento_semana || ''}
                          onChange={(e) => updateFormData(['formulario', 'rutina_inteligente', 'configuracion_general', 'dias_entrenamiento_semana'], e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Duración Sesión (minutos)</label>
                        <input
                          type="number"
                          value={formData.formulario.rutina_inteligente.configuracion_general.duracion_sesion_minutos || ''}
                          onChange={(e) => updateFormData(['formulario', 'rutina_inteligente', 'configuracion_general', 'duracion_sesion_minutos'], e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Cardio HR Objetivo</label>
                        <input
                          type="text"
                          value={formData.formulario.rutina_inteligente.configuracion_general.cardio_hr_objetivo}
                          onChange={(e) => updateFormData(['formulario', 'rutina_inteligente', 'configuracion_general', 'cardio_hr_objetivo'], e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Observaciones Entrenador</label>
                        <textarea
                          value={formData.formulario.rutina_inteligente.configuracion_general.observaciones_entrenador}
                          onChange={(e) => updateFormData(['formulario', 'rutina_inteligente', 'configuracion_general', 'observaciones_entrenador'], e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Weekly Schedule */}
                  {daysOfWeekLower.map((day, dayIndex) => {
                    const dayData = formData.formulario.rutina_inteligente.semana[day as keyof typeof formData.formulario.rutina_inteligente.semana];
                    return (
                      <div key={day} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white capitalize">{day}</h3>
                          <button
                            type="button"
                            onClick={() => addExercise(day)}
                            className="px-3 py-1 bg-[#b5fc00] text-black rounded-lg text-sm font-medium hover:bg-[#a3e600] transition-colors"
                          >
                            + Agregar Ejercicio
                          </button>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm text-gray-400 mb-2">Tipo de Entrenamiento</label>
                          <input
                            type="text"
                            value={dayData.tipo_entrenamiento}
                            onChange={(e) => updateFormData(['formulario', 'rutina_inteligente', 'semana', day, 'tipo_entrenamiento'], e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                            placeholder="Ej: Fuerza, Cardio, HIIT, etc."
                          />
                        </div>
                        {dayData.ejercicios && dayData.ejercicios.length > 0 && (
                          <div className="space-y-4">
                            {dayData.ejercicios.map((ejercicio: any, index: number) => (
                              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-md font-semibold text-white">Ejercicio {index + 1}</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeExercise(day, index)}
                                    className="p-1 text-red-400 hover:bg-red-400/20 rounded transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  <div>
                                    <label className="block text-sm text-gray-400 mb-2">Categoría</label>
                                    <select
                                      value={ejercicio.categoria || ''}
                                      onChange={(e) => {
                                        const categoria = e.target.value;
                                        // Update all fields at once using setFormData to ensure consistency
                                        setFormData(prev => {
                                          const newData = { ...prev };
                                          const dayKey = day.toLowerCase() as keyof typeof newData.formulario.rutina_inteligente.semana;
                                          const ejercicioData = newData.formulario.rutina_inteligente.semana[dayKey].ejercicios[index];
                                          ejercicioData.categoria = categoria;
                                          ejercicioData.ejercicio = ''; // Reset ejercicio when categoria changes
                                          ejercicioData.grupo_muscular = categoria; // Auto-set grupo_muscular
                                          ejercicioData.nombre = categoria; // Update nombre for backward compatibility
                                          return newData;
                                        });
                                      }}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                                    >
                                      <option value="">Selecciona una categoría</option>
                                      {Object.keys(exerciseCategories).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-400 mb-2">Ejercicio</label>
                                    <select
                                      value={ejercicio.ejercicio || ''}
                                      onChange={(e) => {
                                        const ejercicioName = e.target.value;
                                        // Update all fields at once using setFormData to ensure consistency
                                        setFormData(prev => {
                                          const newData = { ...prev };
                                          const dayKey = day.toLowerCase() as keyof typeof newData.formulario.rutina_inteligente.semana;
                                          const ejercicioData = newData.formulario.rutina_inteligente.semana[dayKey].ejercicios[index];
                                          ejercicioData.ejercicio = ejercicioName;
                                          // Update nombre for backward compatibility (categoria + ejercicio)
                                          const fullName = ejercicioData.categoria && ejercicioName 
                                            ? `${ejercicioData.categoria} - ${ejercicioName}`
                                            : ejercicioName || ejercicioData.categoria || '';
                                          ejercicioData.nombre = fullName;
                                          return newData;
                                        });
                                      }}
                                      disabled={!ejercicio.categoria}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <option value="">Selecciona un ejercicio</option>
                                      {ejercicio.categoria && exerciseCategories[ejercicio.categoria as keyof typeof exerciseCategories]?.map(ex => (
                                        <option key={ex} value={ex}>{ex}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-400 mb-2">Grupo Muscular</label>
                                    <input
                                      type="text"
                                      value={ejercicio.grupo_muscular || ejercicio.categoria || ''}
                                      onChange={(e) => updateExercise(day, index, 'grupo_muscular', e.target.value)}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                                      readOnly
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-400 mb-2">Series</label>
                                    <input
                                      type="number"
                                      value={ejercicio.series || ''}
                                      onChange={(e) => updateExercise(day, index, 'series', e.target.value ? parseInt(e.target.value) : null)}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-400 mb-2">Repeticiones</label>
                                    <input
                                      type="text"
                                      value={ejercicio.repeticiones}
                                      onChange={(e) => updateExercise(day, index, 'repeticiones', e.target.value)}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-400 mb-2">Peso (kg)</label>
                                    <input
                                      type="number"
                                      value={ejercicio.peso_kg || ''}
                                      onChange={(e) => updateExercise(day, index, 'peso_kg', e.target.value ? parseFloat(e.target.value) : null)}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-400 mb-2">Intensidad RPE</label>
                                    <input
                                      type="number"
                                      value={ejercicio.intensidad_rpe || ''}
                                      onChange={(e) => updateExercise(day, index, 'intensidad_rpe', e.target.value ? parseInt(e.target.value) : null)}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-400 mb-2">Descanso (segundos)</label>
                                    <input
                                      type="number"
                                      value={ejercicio.descanso_segundos || ''}
                                      onChange={(e) => updateExercise(day, index, 'descanso_segundos', e.target.value ? parseInt(e.target.value) : null)}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm text-gray-400 mb-2">Tempo</label>
                                    <input
                                      type="text"
                                      value={ejercicio.tempo}
                                      onChange={(e) => updateExercise(day, index, 'tempo', e.target.value)}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                                    />
                                  </div>
                                  <div className="md:col-span-3">
                                    <label className="block text-sm text-gray-400 mb-2">Observaciones</label>
                                    <textarea
                                      value={ejercicio.observaciones}
                                      onChange={(e) => updateExercise(day, index, 'observaciones', e.target.value)}
                                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-gray-500"
                                      rows={2}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-black rounded-lg font-medium transition-colors flex items-center gap-2"
                  style={{backgroundColor: '#b5fc00'}}
                >
                  <Save className="w-4 h-4" />
                  {editingRoutine ? 'Actualizar' : 'Crear'} Rutina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewingRoutine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">Ver Rutina</h2>
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
                    <p className="text-sm text-gray-400 mb-1">Usuario</p>
                    <p className="text-white">{viewingRoutine.user?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Creado Por</p>
                    <p className="text-white">{viewingRoutine.created_by_user?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Fecha de Creación</p>
                    <p className="text-white">{new Date(viewingRoutine.created_at).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>
              </div>

              {viewingRoutine.routine_data && (
                <>
                  {/* Basic Fields */}
                  {viewingRoutine.routine_data.formulario?.campos && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Datos Básicos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(viewingRoutine.routine_data.formulario.campos).map(([key, value]: [string, any]) => (
                          <div key={key}>
                            <p className="text-sm text-gray-400 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                            <p className="text-white">{value || 'N/A'}</p>
                          </div>
                        ))}
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
                                  <p className="text-gray-300 mb-4">Tipo: {dayData.tipo_entrenamiento}</p>
                                )}
                                <div className="space-y-4">
                                  {dayData.ejercicios.map((ejercicio: any, index: number) => (
                                    <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                                      <h4 className="text-md font-semibold text-white mb-3">
                                        Ejercicio {index + 1}: {ejercicio.categoria && ejercicio.ejercicio 
                                          ? `${ejercicio.categoria} - ${ejercicio.ejercicio}`
                                          : ejercicio.nombre || ejercicio.ejercicio || ejercicio.categoria || 'Sin nombre'}
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {ejercicio.categoria && (
                                          <div>
                                            <p className="text-sm text-gray-400 mb-1">Categoría</p>
                                            <p className="text-white">{ejercicio.categoria}</p>
                                          </div>
                                        )}
                                        {ejercicio.ejercicio && (
                                          <div>
                                            <p className="text-sm text-gray-400 mb-1">Ejercicio</p>
                                            <p className="text-white">{ejercicio.ejercicio}</p>
                                          </div>
                                        )}
                                        {Object.entries(ejercicio).map(([key, value]: [string, any]) => (
                                          key !== 'nombre' && key !== 'categoria' && key !== 'ejercicio' && (
                                            <div key={key}>
                                              <p className="text-sm text-gray-400 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                                              <p className="text-white">{value || 'N/A'}</p>
                                            </div>
                                          )
                                        ))}
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

export default AdministracionRutinas;

