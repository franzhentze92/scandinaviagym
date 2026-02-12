import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getAllClinicalEvaluations, 
  getClinicalEvaluation,
  getUserProfile
} from '@/services/database';
import { toast } from 'sonner';
import {
  FileText,
  Search,
  Filter,
  User,
  Calendar,
  Loader2,
  Eye,
  BarChart3,
  X
} from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const MisEvaluaciones: React.FC = () => {
  const { user, userRole } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'evaluaciones' | 'analiticas'>('evaluaciones');
  const [evaluations, setEvaluations] = useState<any[]>([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingEvaluation, setViewingEvaluation] = useState<any | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
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
  }, [evaluations, searchQuery, startDate, endDate]);

  const loadData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const evaluationsData = await getAllClinicalEvaluations({
        userId: user.id
      });

      // Si created_by_user no está disponible, intentar obtenerlo manualmente
      const enrichedEvaluations = await Promise.all(
        evaluationsData.map(async (evaluation) => {
          if (!evaluation.created_by_user?.full_name && evaluation.created_by) {
            try {
              const creatorProfile = await getUserProfile(evaluation.created_by);
              if (creatorProfile) {
                evaluation.created_by_user = {
                  id: creatorProfile.id,
                  full_name: creatorProfile.full_name
                };
              }
            } catch (error) {
              console.error('Error loading creator profile:', error);
            }
          }
          return evaluation;
        })
      );

      setEvaluations(enrichedEvaluations);
      calculateKPIs(enrichedEvaluations);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Error al cargar las evaluaciones');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateKPIs = (evaluationsData: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayCount = evaluationsData.filter(e => {
      const evalDate = new Date(e.evaluation_date);
      return evalDate >= today && evalDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    }).length;

    const weekCount = evaluationsData.filter(e => {
      const evalDate = new Date(e.evaluation_date);
      return evalDate >= weekStart;
    }).length;

    const monthCount = evaluationsData.filter(e => {
      const evalDate = new Date(e.evaluation_date);
      return evalDate >= monthStart;
    }).length;

    setKpis({
      total: evaluationsData.length,
      today: todayCount,
      thisWeek: weekCount,
      thisMonth: monthCount
    });
  };

  const applyFilters = () => {
    let filtered = [...evaluations];

    // Date filters
    if (startDate) {
      filtered = filtered.filter(evaluation => evaluation.evaluation_date >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(evaluation => evaluation.evaluation_date <= endDate);
    }

    setFilteredEvaluations(filtered);
  };

  const handleView = async (evaluation: any) => {
    try {
      const fullEvaluation = await getClinicalEvaluation(evaluation.id);
      if (fullEvaluation) {
        setViewingEvaluation(fullEvaluation);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error loading evaluation:', error);
      toast.error('Error al cargar la evaluación');
    }
  };

  // Prepare chart data for time series
  const prepareChartData = () => {
    const sorted = [...filteredEvaluations].sort((a, b) => 
      new Date(a.evaluation_date).getTime() - new Date(b.evaluation_date).getTime()
    );

    return sorted.map(evaluation => {
      const data: any = {
        date: new Date(evaluation.evaluation_date).toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        }),
        fullDate: evaluation.evaluation_date
      };

      // Datos físicos
      const datosFisicos = evaluation.form_data?.mediciones_corporales?.datos_fisicos;
      if (datosFisicos) {
        data.peso = parseFloat(datosFisicos.peso) || null;
        data.altura = parseFloat(datosFisicos.altura) || null;
        data.porcentaje_grasa = parseFloat(datosFisicos.porcentaje_grasa) || null;
        data.imc = parseFloat(datosFisicos.imc) || null;
        data.peso_ideal = parseFloat(datosFisicos.peso_ideal) || null;
        data.porcentaje_grasa_ideal = parseFloat(datosFisicos.porcentaje_grasa_ideal) || null;
        data.imc_ideal = parseFloat(datosFisicos.imc_ideal) || null;
      }

      // Presión arterial
      const presion = evaluation.form_data?.mediciones_corporales?.presion_arterial;
      if (presion) {
        data.presion_sis = parseFloat(presion.sis) || null;
        data.presion_dias = parseFloat(presion.dias) || null;
        data.presion = presion.presion || null;
      }

      // Mediciones corporales
      const medidas = evaluation.form_data?.mediciones_corporales?.tabla_medidas;
      if (medidas) {
        Object.entries(medidas).forEach(([medida, valores]: [string, any]) => {
          const primera = parseFloat(valores.primera_medida) || null;
          const segunda = parseFloat(valores.segunda_medida) || null;
          const tercera = parseFloat(valores.tercera_medida) || null;
          const cuarta = parseFloat(valores.cuarta_medida) || null;
          const quinta = parseFloat(valores.quinta_medida) || null;
          const meta = parseFloat(valores.meta) || null;
          
          data[`${medida}_1ra`] = primera;
          data[`${medida}_2da`] = segunda;
          data[`${medida}_3ra`] = tercera;
          data[`${medida}_4ta`] = cuarta;
          data[`${medida}_5ta`] = quinta;
          data[`${medida}_meta`] = meta;
        });
      }

      return data;
    });
  };

  const chartData = prepareChartData();

  // Chart colors configuration
  const chartConfig = {
    peso: { label: 'Peso (kg)', color: '#3b82f6' },
    altura: { label: 'Altura (cm)', color: '#10b981' },
    porcentaje_grasa: { label: '% Grasa', color: '#f59e0b' },
    imc: { label: 'IMC', color: '#ef4444' },
    peso_ideal: { label: 'Peso Ideal (kg)', color: '#8b5cf6' },
    porcentaje_grasa_ideal: { label: '% Grasa Ideal', color: '#ec4899' },
    imc_ideal: { label: 'IMC Ideal', color: '#06b6d4' },
    presion_sis: { label: 'Presión SIS', color: '#f97316' },
    presion_dias: { label: 'Presión DIAS', color: '#84cc16' },
    cuello_1ra: { label: 'Cuello 1ra', color: '#3b82f6' },
    cuello_2da: { label: 'Cuello 2da', color: '#2563eb' },
    cuello_3ra: { label: 'Cuello 3ra', color: '#1d4ed8' },
    cuello_4ta: { label: 'Cuello 4ta', color: '#1e40af' },
    cuello_5ta: { label: 'Cuello 5ta', color: '#1e3a8a' },
    cuello_meta: { label: 'Cuello Meta', color: '#6366f1', strokeDasharray: '5 5' },
    hombro_1ra: { label: 'Hombro 1ra', color: '#10b981' },
    hombro_2da: { label: 'Hombro 2da', color: '#059669' },
    hombro_3ra: { label: 'Hombro 3ra', color: '#047857' },
    hombro_4ta: { label: 'Hombro 4ta', color: '#065f46' },
    hombro_5ta: { label: 'Hombro 5ta', color: '#064e3b' },
    hombro_meta: { label: 'Hombro Meta', color: '#14b8a6', strokeDasharray: '5 5' },
    busto_pecho_1ra: { label: 'Busto/Pecho 1ra', color: '#f59e0b' },
    busto_pecho_2da: { label: 'Busto/Pecho 2da', color: '#d97706' },
    busto_pecho_3ra: { label: 'Busto/Pecho 3ra', color: '#b45309' },
    busto_pecho_4ta: { label: 'Busto/Pecho 4ta', color: '#92400e' },
    busto_pecho_5ta: { label: 'Busto/Pecho 5ta', color: '#78350f' },
    busto_pecho_meta: { label: 'Busto/Pecho Meta', color: '#fbbf24', strokeDasharray: '5 5' },
    oblicuos_1ra: { label: 'Oblicuos 1ra', color: '#ef4444' },
    oblicuos_2da: { label: 'Oblicuos 2da', color: '#dc2626' },
    oblicuos_3ra: { label: 'Oblicuos 3ra', color: '#b91c1c' },
    oblicuos_4ta: { label: 'Oblicuos 4ta', color: '#991b1b' },
    oblicuos_5ta: { label: 'Oblicuos 5ta', color: '#7f1d1d' },
    oblicuos_meta: { label: 'Oblicuos Meta', color: '#f87171', strokeDasharray: '5 5' },
    cadera_1ra: { label: 'Cadera 1ra', color: '#8b5cf6' },
    cadera_2da: { label: 'Cadera 2da', color: '#7c3aed' },
    cadera_3ra: { label: 'Cadera 3ra', color: '#6d28d9' },
    cadera_4ta: { label: 'Cadera 4ta', color: '#5b21b6' },
    cadera_5ta: { label: 'Cadera 5ta', color: '#4c1d95' },
    cadera_meta: { label: 'Cadera Meta', color: '#a78bfa', strokeDasharray: '5 5' },
    muslo_1ra: { label: 'Muslo 1ra', color: '#ec4899' },
    muslo_2da: { label: 'Muslo 2da', color: '#db2777' },
    muslo_3ra: { label: 'Muslo 3ra', color: '#be185d' },
    muslo_4ta: { label: 'Muslo 4ta', color: '#9f1239' },
    muslo_5ta: { label: 'Muslo 5ta', color: '#831843' },
    muslo_meta: { label: 'Muslo Meta', color: '#f472b6', strokeDasharray: '5 5' },
    biceps_1ra: { label: 'Bíceps 1ra', color: '#06b6d4' },
    biceps_2da: { label: 'Bíceps 2da', color: '#0891b2' },
    biceps_3ra: { label: 'Bíceps 3ra', color: '#0e7490' },
    biceps_4ta: { label: 'Bíceps 4ta', color: '#155e75' },
    biceps_5ta: { label: 'Bíceps 5ta', color: '#164e63' },
    biceps_meta: { label: 'Bíceps Meta', color: '#22d3ee', strokeDasharray: '5 5' },
    antebrazo_1ra: { label: 'Antebrazo 1ra', color: '#f97316' },
    antebrazo_2da: { label: 'Antebrazo 2da', color: '#ea580c' },
    antebrazo_3ra: { label: 'Antebrazo 3ra', color: '#c2410c' },
    antebrazo_4ta: { label: 'Antebrazo 4ta', color: '#9a3412' },
    antebrazo_5ta: { label: 'Antebrazo 5ta', color: '#7c2d12' },
    antebrazo_meta: { label: 'Antebrazo Meta', color: '#fb923c', strokeDasharray: '5 5' },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mis Evaluaciones Clínicas</h1>
          <p className="text-gray-400">Visualiza tus evaluaciones físicas y analiza tu progreso</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-400 text-sm">Total</p>
            <FileText className="w-5 h-5 text-gray-400" />
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

      {/* Tabs */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedTab('evaluaciones')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedTab === 'evaluaciones'
                ? 'text-black'
                : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
            }`}
            style={selectedTab === 'evaluaciones' ? {backgroundColor: '#b5fc00'} : {}}
          >
            <FileText className="w-4 h-4" />
            Evaluaciones
          </button>
          <button
            onClick={() => setSelectedTab('analiticas')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedTab === 'analiticas'
                ? 'text-black'
                : 'text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600'
            }`}
            style={selectedTab === 'analiticas' ? {backgroundColor: '#b5fc00'} : {}}
          >
            <BarChart3 className="w-4 h-4" />
            Analíticas
          </button>
        </div>

        {/* Evaluaciones Tab */}
        {selectedTab === 'evaluaciones' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
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
              <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800 border-b border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Fecha Evaluación</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-300">Realizado Por</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-300">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvaluations.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                          No se encontraron evaluaciones
                        </td>
                      </tr>
                    ) : (
                      filteredEvaluations.map((evaluation) => (
                        <tr key={evaluation.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="px-4 py-3 text-white">
                            {new Date(evaluation.evaluation_date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-4 py-3 text-white">
                            {(() => {
                              // Intentar mostrar el nombre del creador
                              if (evaluation.created_by_user?.full_name) {
                                return evaluation.created_by_user.full_name;
                              }
                              // Si no está disponible, intentar obtenerlo del campo created_by
                              if (evaluation.created_by) {
                                return 'Cargando...';
                              }
                              return 'N/A';
                            })()}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleView(evaluation)}
                                className="p-2 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors"
                                title="Ver"
                              >
                                <Eye className="w-4 h-4" />
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
          </div>
        )}

        {/* Analíticas Tab */}
        {selectedTab === 'analiticas' && (
          <div className="space-y-6">
            {/* Filters for Analytics */}
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
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

            {/* Time Series Charts */}
            {chartData.length > 0 ? (
              <div className="space-y-6">
                {/* Datos Físicos */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Datos Físicos - Evolución Temporal</h3>
                  <div className="space-y-6">
                    {/* Peso */}
                    <div>
                      <h4 className="text-md font-medium text-gray-300 mb-3">Peso (kg)</h4>
                      <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                          />
                          <YAxis 
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="peso" 
                            stroke={chartConfig.peso.color} 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="Peso"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="peso_ideal" 
                            stroke={chartConfig.peso_ideal.color} 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4 }}
                            name="Peso Ideal"
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>

                    {/* IMC */}
                    <div>
                      <h4 className="text-md font-medium text-gray-300 mb-3">IMC</h4>
                      <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                          />
                          <YAxis 
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="imc" 
                            stroke={chartConfig.imc.color} 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="IMC"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="imc_ideal" 
                            stroke={chartConfig.imc_ideal.color} 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4 }}
                            name="IMC Ideal"
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>

                    {/* Porcentaje de Grasa */}
                    <div>
                      <h4 className="text-md font-medium text-gray-300 mb-3">Porcentaje de Grasa</h4>
                      <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                          />
                          <YAxis 
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                          />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Line 
                            type="monotone" 
                            dataKey="porcentaje_grasa" 
                            stroke={chartConfig.porcentaje_grasa.color} 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            name="% Grasa"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="porcentaje_grasa_ideal" 
                            stroke={chartConfig.porcentaje_grasa_ideal.color} 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 4 }}
                            name="% Grasa Ideal"
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  </div>
                </div>

                {/* Presión Arterial */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Presión Arterial - Evolución Temporal</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="presion_sis" 
                        stroke={chartConfig.presion_sis.color} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="SIS"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="presion_dias" 
                        stroke={chartConfig.presion_dias.color} 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        name="DIAS"
                      />
                    </LineChart>
                  </ChartContainer>
                </div>

                {/* Mediciones Corporales - Cuello */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Cuello - Evolución Temporal</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="cuello_1ra" stroke={chartConfig.cuello_1ra.color} strokeWidth={2} dot={{ r: 3 }} name="1ra Medida" />
                      <Line type="monotone" dataKey="cuello_2da" stroke={chartConfig.cuello_2da.color} strokeWidth={2} dot={{ r: 3 }} name="2da Medida" />
                      <Line type="monotone" dataKey="cuello_3ra" stroke={chartConfig.cuello_3ra.color} strokeWidth={2} dot={{ r: 3 }} name="3ra Medida" />
                      <Line type="monotone" dataKey="cuello_4ta" stroke={chartConfig.cuello_4ta.color} strokeWidth={2} dot={{ r: 3 }} name="4ta Medida" />
                      <Line type="monotone" dataKey="cuello_5ta" stroke={chartConfig.cuello_5ta.color} strokeWidth={2} dot={{ r: 3 }} name="5ta Medida" />
                      <Line type="monotone" dataKey="cuello_meta" stroke={chartConfig.cuello_meta.color} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Meta" />
                    </LineChart>
                  </ChartContainer>
                </div>

                {/* Mediciones Corporales - Hombro */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Hombro - Evolución Temporal</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="hombro_1ra" stroke={chartConfig.hombro_1ra.color} strokeWidth={2} dot={{ r: 3 }} name="1ra Medida" />
                      <Line type="monotone" dataKey="hombro_2da" stroke={chartConfig.hombro_2da.color} strokeWidth={2} dot={{ r: 3 }} name="2da Medida" />
                      <Line type="monotone" dataKey="hombro_3ra" stroke={chartConfig.hombro_3ra.color} strokeWidth={2} dot={{ r: 3 }} name="3ra Medida" />
                      <Line type="monotone" dataKey="hombro_4ta" stroke={chartConfig.hombro_4ta.color} strokeWidth={2} dot={{ r: 3 }} name="4ta Medida" />
                      <Line type="monotone" dataKey="hombro_5ta" stroke={chartConfig.hombro_5ta.color} strokeWidth={2} dot={{ r: 3 }} name="5ta Medida" />
                      <Line type="monotone" dataKey="hombro_meta" stroke={chartConfig.hombro_meta.color} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Meta" />
                    </LineChart>
                  </ChartContainer>
                </div>

                {/* Mediciones Corporales - Busto/Pecho */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Busto/Pecho - Evolución Temporal</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="busto_pecho_1ra" stroke={chartConfig.busto_pecho_1ra.color} strokeWidth={2} dot={{ r: 3 }} name="1ra Medida" />
                      <Line type="monotone" dataKey="busto_pecho_2da" stroke={chartConfig.busto_pecho_2da.color} strokeWidth={2} dot={{ r: 3 }} name="2da Medida" />
                      <Line type="monotone" dataKey="busto_pecho_3ra" stroke={chartConfig.busto_pecho_3ra.color} strokeWidth={2} dot={{ r: 3 }} name="3ra Medida" />
                      <Line type="monotone" dataKey="busto_pecho_4ta" stroke={chartConfig.busto_pecho_4ta.color} strokeWidth={2} dot={{ r: 3 }} name="4ta Medida" />
                      <Line type="monotone" dataKey="busto_pecho_5ta" stroke={chartConfig.busto_pecho_5ta.color} strokeWidth={2} dot={{ r: 3 }} name="5ta Medida" />
                      <Line type="monotone" dataKey="busto_pecho_meta" stroke={chartConfig.busto_pecho_meta.color} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Meta" />
                    </LineChart>
                  </ChartContainer>
                </div>

                {/* Mediciones Corporales - Oblicuos */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Oblicuos - Evolución Temporal</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="oblicuos_1ra" stroke={chartConfig.oblicuos_1ra.color} strokeWidth={2} dot={{ r: 3 }} name="1ra Medida" />
                      <Line type="monotone" dataKey="oblicuos_2da" stroke={chartConfig.oblicuos_2da.color} strokeWidth={2} dot={{ r: 3 }} name="2da Medida" />
                      <Line type="monotone" dataKey="oblicuos_3ra" stroke={chartConfig.oblicuos_3ra.color} strokeWidth={2} dot={{ r: 3 }} name="3ra Medida" />
                      <Line type="monotone" dataKey="oblicuos_4ta" stroke={chartConfig.oblicuos_4ta.color} strokeWidth={2} dot={{ r: 3 }} name="4ta Medida" />
                      <Line type="monotone" dataKey="oblicuos_5ta" stroke={chartConfig.oblicuos_5ta.color} strokeWidth={2} dot={{ r: 3 }} name="5ta Medida" />
                      <Line type="monotone" dataKey="oblicuos_meta" stroke={chartConfig.oblicuos_meta.color} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Meta" />
                    </LineChart>
                  </ChartContainer>
                </div>

                {/* Mediciones Corporales - Cadera */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Cadera - Evolución Temporal</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="cadera_1ra" stroke={chartConfig.cadera_1ra.color} strokeWidth={2} dot={{ r: 3 }} name="1ra Medida" />
                      <Line type="monotone" dataKey="cadera_2da" stroke={chartConfig.cadera_2da.color} strokeWidth={2} dot={{ r: 3 }} name="2da Medida" />
                      <Line type="monotone" dataKey="cadera_3ra" stroke={chartConfig.cadera_3ra.color} strokeWidth={2} dot={{ r: 3 }} name="3ra Medida" />
                      <Line type="monotone" dataKey="cadera_4ta" stroke={chartConfig.cadera_4ta.color} strokeWidth={2} dot={{ r: 3 }} name="4ta Medida" />
                      <Line type="monotone" dataKey="cadera_5ta" stroke={chartConfig.cadera_5ta.color} strokeWidth={2} dot={{ r: 3 }} name="5ta Medida" />
                      <Line type="monotone" dataKey="cadera_meta" stroke={chartConfig.cadera_meta.color} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Meta" />
                    </LineChart>
                  </ChartContainer>
                </div>

                {/* Mediciones Corporales - Muslo */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Muslo - Evolución Temporal</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="muslo_1ra" stroke={chartConfig.muslo_1ra.color} strokeWidth={2} dot={{ r: 3 }} name="1ra Medida" />
                      <Line type="monotone" dataKey="muslo_2da" stroke={chartConfig.muslo_2da.color} strokeWidth={2} dot={{ r: 3 }} name="2da Medida" />
                      <Line type="monotone" dataKey="muslo_3ra" stroke={chartConfig.muslo_3ra.color} strokeWidth={2} dot={{ r: 3 }} name="3ra Medida" />
                      <Line type="monotone" dataKey="muslo_4ta" stroke={chartConfig.muslo_4ta.color} strokeWidth={2} dot={{ r: 3 }} name="4ta Medida" />
                      <Line type="monotone" dataKey="muslo_5ta" stroke={chartConfig.muslo_5ta.color} strokeWidth={2} dot={{ r: 3 }} name="5ta Medida" />
                      <Line type="monotone" dataKey="muslo_meta" stroke={chartConfig.muslo_meta.color} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Meta" />
                    </LineChart>
                  </ChartContainer>
                </div>

                {/* Mediciones Corporales - Bíceps */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Bíceps - Evolución Temporal</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="biceps_1ra" stroke={chartConfig.biceps_1ra.color} strokeWidth={2} dot={{ r: 3 }} name="1ra Medida" />
                      <Line type="monotone" dataKey="biceps_2da" stroke={chartConfig.biceps_2da.color} strokeWidth={2} dot={{ r: 3 }} name="2da Medida" />
                      <Line type="monotone" dataKey="biceps_3ra" stroke={chartConfig.biceps_3ra.color} strokeWidth={2} dot={{ r: 3 }} name="3ra Medida" />
                      <Line type="monotone" dataKey="biceps_4ta" stroke={chartConfig.biceps_4ta.color} strokeWidth={2} dot={{ r: 3 }} name="4ta Medida" />
                      <Line type="monotone" dataKey="biceps_5ta" stroke={chartConfig.biceps_5ta.color} strokeWidth={2} dot={{ r: 3 }} name="5ta Medida" />
                      <Line type="monotone" dataKey="biceps_meta" stroke={chartConfig.biceps_meta.color} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Meta" />
                    </LineChart>
                  </ChartContainer>
                </div>

                {/* Mediciones Corporales - Antebrazo */}
                <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Antebrazo - Evolución Temporal</h3>
                  <ChartContainer config={chartConfig} className="h-[300px] w-full !aspect-auto">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <YAxis 
                        stroke="#9ca3af"
                        tick={{ fill: '#9ca3af' }}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line type="monotone" dataKey="antebrazo_1ra" stroke={chartConfig.antebrazo_1ra.color} strokeWidth={2} dot={{ r: 3 }} name="1ra Medida" />
                      <Line type="monotone" dataKey="antebrazo_2da" stroke={chartConfig.antebrazo_2da.color} strokeWidth={2} dot={{ r: 3 }} name="2da Medida" />
                      <Line type="monotone" dataKey="antebrazo_3ra" stroke={chartConfig.antebrazo_3ra.color} strokeWidth={2} dot={{ r: 3 }} name="3ra Medida" />
                      <Line type="monotone" dataKey="antebrazo_4ta" stroke={chartConfig.antebrazo_4ta.color} strokeWidth={2} dot={{ r: 3 }} name="4ta Medida" />
                      <Line type="monotone" dataKey="antebrazo_5ta" stroke={chartConfig.antebrazo_5ta.color} strokeWidth={2} dot={{ r: 3 }} name="5ta Medida" />
                      <Line type="monotone" dataKey="antebrazo_meta" stroke={chartConfig.antebrazo_meta.color} strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Meta" />
                    </LineChart>
                  </ChartContainer>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 text-center">
                <p className="text-gray-400">No hay suficientes datos para mostrar gráficas. Ajusta los filtros.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && viewingEvaluation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-bold text-white">Ver Evaluación</h2>
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
                    <p className="text-sm text-gray-400 mb-1">Fecha de Evaluación</p>
                    <p className="text-white">{new Date(viewingEvaluation.evaluation_date).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Creado Por</p>
                    <p className="text-white">{viewingEvaluation.created_by_user?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Fecha de Creación</p>
                    <p className="text-white">{new Date(viewingEvaluation.created_at).toLocaleDateString('es-ES')}</p>
                  </div>
                </div>
              </div>

              {viewingEvaluation.form_data && (
                <>
                  {/* Datos Personales */}
                  {viewingEvaluation.form_data.datos_personales && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Datos Personales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Nombre</p>
                          <p className="text-white">{viewingEvaluation.form_data.datos_personales.nombre || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Edad</p>
                          <p className="text-white">{viewingEvaluation.form_data.datos_personales.edad || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Sexo</p>
                          <p className="text-white">
                            {viewingEvaluation.form_data.datos_personales.sexo?.m ? 'Masculino' : 
                             viewingEvaluation.form_data.datos_personales.sexo?.f ? 'Femenino' : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Fecha de Nacimiento</p>
                          <p className="text-white">
                            {viewingEvaluation.form_data.datos_personales.fecha ? 
                              new Date(viewingEvaluation.form_data.datos_personales.fecha).toLocaleDateString('es-ES') : 'N/A'}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm text-gray-400 mb-1">Profesión u Oficio</p>
                          <p className="text-white">{viewingEvaluation.form_data.datos_personales.profesion_u_oficio || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Control Médico */}
                  {viewingEvaluation.form_data.control_medico && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Control Médico</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">¿Está bajo control médico?</p>
                          <p className="text-white">
                            {viewingEvaluation.form_data.control_medico.esta_bajo_control_medico?.si ? 'Sí' : 
                             viewingEvaluation.form_data.control_medico.esta_bajo_control_medico?.no ? 'No' : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Nombre del Médico</p>
                          <p className="text-white">{viewingEvaluation.form_data.control_medico.nombre_del_medico || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Teléfono del Médico</p>
                          <p className="text-white">{viewingEvaluation.form_data.control_medico.tel_medico || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Tipo de Sangre</p>
                          <p className="text-white">{viewingEvaluation.form_data.control_medico.tipo_de_sangre || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Contacto de Emergencia</p>
                          <p className="text-white">{viewingEvaluation.form_data.control_medico.en_caso_de_emergencia_avisar_a || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Teléfono de Emergencia</p>
                          <p className="text-white">{viewingEvaluation.form_data.control_medico.tel_emergencia || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Programa de Ejercicios Dirigido */}
                  {viewingEvaluation.form_data.programa_ejercicios_dirigido && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Programa de Ejercicios Dirigido</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">¿Sabe su médico que desea someterse a un programa de ejercicios físicos dirigido?</p>
                          <p className="text-white">
                            {viewingEvaluation.form_data.programa_ejercicios_dirigido.sabe_su_medico_que_desea_someterse_a_un_programa_de_ejercicios_fisicos_dirigido?.si ? 'Sí' : 
                             viewingEvaluation.form_data.programa_ejercicios_dirigido.sabe_su_medico_que_desea_someterse_a_un_programa_de_ejercicios_fisicos_dirigido?.no ? 'No' : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Antecedentes */}
                  {viewingEvaluation.form_data.antecedentes && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Antecedentes</h3>
                      <div className="space-y-4">
                        {viewingEvaluation.form_data.antecedentes.padece_o_ha_padecido_los_ultimos_meses_alguna_enfermedad_cronica && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">¿Padece o ha padecido los últimos meses alguna enfermedad crónica?</p>
                            <p className="text-white mb-2">
                              {viewingEvaluation.form_data.antecedentes.padece_o_ha_padecido_los_ultimos_meses_alguna_enfermedad_cronica.si ? 'Sí' : 
                               viewingEvaluation.form_data.antecedentes.padece_o_ha_padecido_los_ultimos_meses_alguna_enfermedad_cronica.no ? 'No' : 'N/A'}
                            </p>
                            {viewingEvaluation.form_data.antecedentes.explique && (
                              <p className="text-white text-sm bg-gray-800 p-2 rounded">{viewingEvaluation.form_data.antecedentes.explique}</p>
                            )}
                          </div>
                        )}

                        {viewingEvaluation.form_data.antecedentes.a_dificultad_para_ejecutar_alguna_actividad_fisica && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">a) ¿Dificultad para ejecutar alguna actividad física?</p>
                            <p className="text-white mb-2">
                              {viewingEvaluation.form_data.antecedentes.a_dificultad_para_ejecutar_alguna_actividad_fisica.si ? 'Sí' : 
                               viewingEvaluation.form_data.antecedentes.a_dificultad_para_ejecutar_alguna_actividad_fisica.no ? 'No' : 'N/A'}
                            </p>
                            {viewingEvaluation.form_data.antecedentes.si_la_respuesta_es_si_explique_por_que && (
                              <p className="text-white text-sm bg-gray-800 p-2 rounded">{viewingEvaluation.form_data.antecedentes.si_la_respuesta_es_si_explique_por_que}</p>
                            )}
                          </div>
                        )}

                        {viewingEvaluation.form_data.antecedentes.b_alguna_enfermedad && (
                          <div>
                            <p className="text-sm text-gray-400 mb-2">b) ¿Alguna enfermedad?</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(viewingEvaluation.form_data.antecedentes.b_alguna_enfermedad)
                                .filter(([_, value]) => value)
                                .map(([key, _]) => (
                                  <span key={key} className="px-3 py-1 bg-red-900/30 text-red-300 rounded-lg text-sm">
                                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                ))}
                              {Object.values(viewingEvaluation.form_data.antecedentes.b_alguna_enfermedad).every(v => !v) && (
                                <span className="text-gray-400 text-sm">Ninguna</span>
                              )}
                            </div>
                          </div>
                        )}

                        {viewingEvaluation.form_data.antecedentes.c_alguna_lesion_a_nivel && (
                          <div>
                            <p className="text-sm text-gray-400 mb-2">c) ¿Alguna lesión a nivel?</p>
                            <div className="space-y-2">
                              {['articular', 'muscular', 'espalda', 'osea'].map((tipo) => {
                                const lesion = viewingEvaluation.form_data.antecedentes.c_alguna_lesion_a_nivel[tipo];
                                if (!lesion) return null;
                                return (
                                  <div key={tipo} className="bg-gray-800 rounded p-2">
                                    <p className="text-white font-medium capitalize mb-1">{tipo}</p>
                                    <p className="text-sm text-gray-300 mb-1">
                                      {lesion.si ? 'Sí' : lesion.no ? 'No' : 'N/A'}
                                    </p>
                                    {lesion.explique && (
                                      <p className="text-sm text-white bg-gray-700 p-2 rounded mt-1">{lesion.explique}</p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {viewingEvaluation.form_data.antecedentes.d_problemas_cardiacos && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">d) ¿Problemas cardiacos?</p>
                            <p className="text-white mb-2">
                              {viewingEvaluation.form_data.antecedentes.d_problemas_cardiacos.si ? 'Sí' : 
                               viewingEvaluation.form_data.antecedentes.d_problemas_cardiacos.no ? 'No' : 'N/A'}
                            </p>
                            {viewingEvaluation.form_data.antecedentes.d_problemas_cardiacos.explique && (
                              <p className="text-white text-sm bg-gray-800 p-2 rounded">{viewingEvaluation.form_data.antecedentes.d_problemas_cardiacos.explique}</p>
                            )}
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-gray-400 mb-1">e) ¿Cirugía en los últimos 3 meses?</p>
                          <p className="text-white">
                            {viewingEvaluation.form_data.antecedentes.e_cirugia_en_los_ultimos_3_meses?.si ? 'Sí' : 
                             viewingEvaluation.form_data.antecedentes.e_cirugia_en_los_ultimos_3_meses?.no ? 'No' : 'N/A'}
                          </p>
                        </div>

                        {viewingEvaluation.form_data.antecedentes.f_es_usted_fumador && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">f) ¿Es usted fumador?</p>
                            <p className="text-white mb-2">
                              {viewingEvaluation.form_data.antecedentes.f_es_usted_fumador.si ? 'Sí' : 
                               viewingEvaluation.form_data.antecedentes.f_es_usted_fumador.no ? 'No' : 'N/A'}
                            </p>
                            {viewingEvaluation.form_data.antecedentes.f_es_usted_fumador.frecuencia && (
                              <p className="text-white text-sm">Frecuencia: {viewingEvaluation.form_data.antecedentes.f_es_usted_fumador.frecuencia}</p>
                            )}
                          </div>
                        )}

                        {viewingEvaluation.form_data.antecedentes.g_problemas_pulmonares && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">g) ¿Problemas pulmonares?</p>
                            <p className="text-white mb-2">
                              {viewingEvaluation.form_data.antecedentes.g_problemas_pulmonares.si ? 'Sí' : 
                               viewingEvaluation.form_data.antecedentes.g_problemas_pulmonares.no ? 'No' : 'N/A'}
                            </p>
                            {viewingEvaluation.form_data.antecedentes.g_problemas_pulmonares.frecuencia && (
                              <p className="text-white text-sm">Frecuencia: {viewingEvaluation.form_data.antecedentes.g_problemas_pulmonares.frecuencia}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actividad Física Actual */}
                  {viewingEvaluation.form_data.actividad_fisica_actual && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Actividad Física Actual</h3>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Actividad física actual</p>
                        <p className="text-white bg-gray-800 p-2 rounded">
                          {viewingEvaluation.form_data.actividad_fisica_actual.si_en_la_actualidad_realiza_alguna_actividad_fisica_explique_cual_y_con_que_frecuencia || 'N/A'}
                        </p>
                      </div>
                      {viewingEvaluation.form_data.actividad_fisica_actual.tel && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-400 mb-1">Teléfono</p>
                          <p className="text-white">{viewingEvaluation.form_data.actividad_fisica_actual.tel}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tiempo Disponible */}
                  {viewingEvaluation.form_data.tiempo_disponible && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Tiempo Disponible</h3>
                      <p className="text-white">
                        {viewingEvaluation.form_data.tiempo_disponible.tiempo_disponible_para_entrenar_dias_x_semana_y_horas_x_dia || 'N/A'}
                      </p>
                    </div>
                  )}

                  {/* Datos Especiales */}
                  {viewingEvaluation.form_data.datos_especiales && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Datos Especiales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-400 mb-1">¿Sospecha usted que está embarazada?</p>
                          <p className="text-white">
                            {viewingEvaluation.form_data.datos_especiales.sospecha_usted_que_esta_embarazada?.si ? 'Sí' : 
                             viewingEvaluation.form_data.datos_especiales.sospecha_usted_que_esta_embarazada?.no ? 'No' : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400 mb-1">¿Tiene hijos pequeños?</p>
                          <p className="text-white mb-2">
                            {viewingEvaluation.form_data.datos_especiales.tiene_hijos_pequenos?.si ? 'Sí' : 
                             viewingEvaluation.form_data.datos_especiales.tiene_hijos_pequenos?.no ? 'No' : 'N/A'}
                          </p>
                          {viewingEvaluation.form_data.datos_especiales.tiene_hijos_pequenos?.edad && (
                            <p className="text-white text-sm">Edad: {viewingEvaluation.form_data.datos_especiales.tiene_hijos_pequenos.edad}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Objetivo Primordial */}
                  {viewingEvaluation.form_data.objetivo_primordial && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Objetivo Primordial</h3>
                      <p className="text-white bg-gray-800 p-2 rounded">
                        {viewingEvaluation.form_data.objetivo_primordial || 'N/A'}
                      </p>
                    </div>
                  )}

                  {/* Mediciones Corporales */}
                  {viewingEvaluation.form_data.mediciones_corporales && (
                    <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-semibold text-white mb-4">Mediciones Corporales</h3>
                      
                      {/* Tabla de Medidas */}
                      {viewingEvaluation.form_data.mediciones_corporales.tabla_medidas && (
                        <div className="mb-6">
                          <h4 className="text-md font-semibold text-gray-300 mb-3">Tabla de Medidas</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="bg-gray-800">
                                  <th className="px-2 py-2 text-left text-gray-300">Medida</th>
                                  <th className="px-2 py-2 text-center text-gray-300">1ra</th>
                                  <th className="px-2 py-2 text-center text-gray-300">2da</th>
                                  <th className="px-2 py-2 text-center text-gray-300">3ra</th>
                                  <th className="px-2 py-2 text-center text-gray-300">4ta</th>
                                  <th className="px-2 py-2 text-center text-gray-300">5ta</th>
                                  <th className="px-2 py-2 text-center text-gray-300">Meta</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.entries(viewingEvaluation.form_data.mediciones_corporales.tabla_medidas).map(([medida, valores]: [string, any]) => (
                                  <tr key={medida} className="border-b border-gray-700">
                                    <td className="px-2 py-2 text-gray-300 capitalize">{medida.replace(/_/g, ' ')}</td>
                                    {['primera_medida', 'segunda_medida', 'tercera_medida', 'cuarta_medida', 'quinta_medida', 'meta'].map((campo) => (
                                      <td key={campo} className="px-2 py-2 text-white text-center">
                                        {valores[campo] || '-'}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Datos Físicos */}
                      {viewingEvaluation.form_data.mediciones_corporales.datos_fisicos && (
                        <div className="mb-6">
                          <h4 className="text-md font-semibold text-gray-300 mb-3">Datos Físicos</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(viewingEvaluation.form_data.mediciones_corporales.datos_fisicos).map(([key, value]: [string, any]) => (
                              <div key={key}>
                                <p className="text-sm text-gray-400 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                                <p className="text-white">{value || 'N/A'}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Presión Arterial */}
                      {viewingEvaluation.form_data.mediciones_corporales.presion_arterial && (
                        <div>
                          <h4 className="text-md font-semibold text-gray-300 mb-3">Presión Arterial</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-gray-400 mb-1">SIS</p>
                              <p className="text-white">{viewingEvaluation.form_data.mediciones_corporales.presion_arterial.sis || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400 mb-1">DIAS</p>
                              <p className="text-white">{viewingEvaluation.form_data.mediciones_corporales.presion_arterial.dias || 'N/A'}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-400 mb-1">Presión</p>
                              <p className="text-white">{viewingEvaluation.form_data.mediciones_corporales.presion_arterial.presion || 'N/A'}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Nota Legal */}
                  {viewingEvaluation.form_data.nota_legal && (
                    <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                      <p className="text-sm text-yellow-300">{viewingEvaluation.form_data.nota_legal}</p>
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

export default MisEvaluaciones;

