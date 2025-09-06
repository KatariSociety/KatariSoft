import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";

import { ShieldCheck, ShieldAlert, Package, ShieldX } from "lucide-react";
import HistoricalDistributionChart from "../components/historical/HistoricalDistributionChart";
import HistoricalTable from "../components/historical/HistoricalTable";
import HistoricalTrendChart from "../components/historical/HistoricalTrendChart";
import lecturasService from "../services/lecturasService";

const categorizeReading = (item) => {
	// Lógica similar a determineIcon, pero devuelve una categoría (string)
	try {
		if (!item.valor_lectura || !item.valor_lectura.startsWith('{')) {
			return "alert"; // O "error" si prefieres
		}
		const valor = JSON.parse(item.valor_lectura);
		if (valor.temperature || valor.pressure || valor.location || valor.speed || valor.accelerometer || valor.gyroscope) {
			return "success";
		}
		return "failed"; // o "unknown"
	} catch (e) {
		return "alert"; // Error al parsear
	}
};

/**
 * Página de historial de lecturas
 * @returns 
 */
const HistoricalPage = () => {
	const [historicalData, setHistoricalData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [distributionData, setDistributionData] = useState([]);
	const [trendData, setTrendData] = useState([]);
	
	// Estado para paginación del servidor
	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalRecords: 0,
		limit: 50,
		hasNextPage: false,
		hasPrevPage: false
	});

	// Datos para StatCards y DistributionChart (globales, no paginados)
	const [stats, setStats] = useState({
		total: 0,
		culminadas: 0,
		conErrores: 0,
		fallidas: 0,
	});

	// Estado para ordenamiento
	const [sortOrder, setSortOrder] = useState('desc');
	
	// Estado de carga para gráficas
	const [chartsLoading, setChartsLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			await fetchChartData(); // Cargar datos para gráficas primero
			await fetchFilteredData(); // Luego cargar datos de la tabla
		};
		loadData();
	}, []);

	/**
	 * Carga datos globales para las gráficas (sin paginación)
	 */
	const fetchChartData = async () => {
		try {
			setChartsLoading(true);
			//console.log('Cargando datos para gráficas...');
			const result = await lecturasService.obtenerLecturasParaGraficas();
			//console.log('Resultado de gráficas:', result);
			
			if (result.error === false && result.body.success) {
				const data = result.body.data;
				//console.log('Datos de gráficas obtenidos:', data.length, 'registros');
				
				// Ordenar datos localmente ya que el backend no soporta sort
				const sortedData = data.sort((a, b) => {
					const dateA = new Date(a.fecha_lectura);
					const dateB = new Date(b.fecha_lectura);
					return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
				});
				
				// Procesar datos para estadísticas y gráfico de distribución
				let culminadasCount = 0;
				let conErroresCount = 0;
				let fallidasCount = 0;

				sortedData.forEach(item => {
					const category = categorizeReading(item);
					if (category === "success") culminadasCount++;
					else if (category === "alert") conErroresCount++;
					else if (category === "failed") fallidasCount++;
				});

				setStats({
					total: sortedData.length,
					culminadas: culminadasCount,
					conErrores: conErroresCount,
					fallidas: fallidasCount,
				});

				setDistributionData([
					{ name: "Culminadas", value: culminadasCount, color: "#10B981" },
					{ name: "Con Errores", value: conErroresCount, color: "#F59E0B" },
					{ name: "Fallidas", value: fallidasCount, color: "#EF4444" },
				]);

				// Procesar datos para gráfico de tendencia (pruebas por mes)
				const monthlyCounts = sortedData.reduce((acc, item) => {
					const date = new Date(item.fecha_lectura);
					const monthYear = date.toLocaleString('default', { month: 'short' }) + '-' + date.getFullYear().toString().slice(-2);
					acc[monthYear] = (acc[monthYear] || 0) + 1;
					return acc;
				}, {});

				// Convertir a formato que necesita el gráfico de tendencia
				const trendChartData = Object.entries(monthlyCounts)
					.map(([mes, pruebas]) => ({ mes, pruebas }))
					.sort((a, b) => {
						const dateA = new Date(a.mes.split('-')[0] + " 1, 20" + a.mes.split('-')[1]);
						const dateB = new Date(b.mes.split('-')[0] + " 1, 20" + b.mes.split('-')[1]);
						return dateA - dateB;
					});
				setTrendData(trendChartData);
			} else {
				console.error('Error en respuesta de gráficas:', result.body?.message || 'Respuesta no exitosa');
			}
		} catch (err) {
			console.error('Error al cargar datos para gráficas:', err);
		} finally {
			setChartsLoading(false);
		}
	};

	/**
	 * Carga los datos de la tabla con paginación
	 */
	const fetchFilteredData = async (filters = {}, page = 1, limit = 50, sort = 'desc') => {
		try {
			setLoading(true);
			setError(null);
			let result;
			const { sensorId, eventoId } = filters;

			if (sensorId && eventoId) {
				result = await lecturasService.obtenerLecturasPorSensorYEvento(sensorId, eventoId);
			} else if (sensorId) {
				result = await lecturasService.obtenerLecturasPorSensor(sensorId, page, limit);
			} else if (eventoId) {
				result = await lecturasService.obtenerLecturasPorEvento(eventoId, page, limit);
			} else {
				result = await lecturasService.obtenerLecturas(page, limit);
			}

			if (result.error === false && result.body.success) {
				let data = result.body.data;
				const paginationData = result.body.pagination;
				console.log("Lecturas obtenidas:", data);
				console.log("Paginación:", paginationData);
				
				// Ordenar datos localmente ya que el backend no soporta sort
				data = data.sort((a, b) => {
					const dateA = new Date(a.fecha_lectura);
					const dateB = new Date(b.fecha_lectura);
					return sort === 'asc' ? dateA - dateB : dateB - dateA;
				});
				
				setHistoricalData(data);
				
				// Actualizar estado de paginación si está disponible
				if (paginationData) {
					setPagination({
						currentPage: paginationData.currentPage,
						totalPages: paginationData.totalPages,
						totalRecords: paginationData.totalRecords,
						limit: paginationData.limit,
						hasNextPage: paginationData.hasNextPage,
						hasPrevPage: paginationData.hasPrevPage
					});
				}

			} else {
				setError("Error al cargar datos: " + (result.body.message || "Respuesta no exitosa"));
                setHistoricalData([]);
			}
		} catch (err) {
			setError("Error de conexión");
			console.error(err);
			setHistoricalData([]);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Histórico' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total pruebas' icon={Package} value={stats.total} color='#6366F1' />
					<StatCard name='Culminadas' icon={ShieldCheck} value={stats.culminadas} color='#10B981' />
					<StatCard name='Con errores' icon={ShieldAlert} value={stats.conErrores} color='#F59E0B' />
					<StatCard name='Fallidas' icon={ShieldX} value={stats.fallidas} color='#EF4444' />
				</motion.div>

				<HistoricalTable
					initialData={historicalData}
					isLoading={loading}
					dataError={error}
					onFilterSubmit={fetchFilteredData}
					pagination={pagination}
					sortOrder={sortOrder}
					onSortChange={setSortOrder}
				/>

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					{chartsLoading ? (
						<div className="col-span-2 text-center py-8">
							<div className="text-gray-400">Cargando datos para gráficas...</div>
						</div>
					) : (
						<>
							<HistoricalTrendChart data={trendData} />
							<HistoricalDistributionChart data={distributionData} />
						</>
					)}
				</div>
			</main>
		</div>
	);
};
export default HistoricalPage;