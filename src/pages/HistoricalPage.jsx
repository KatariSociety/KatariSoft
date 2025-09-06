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

	// Datos para StatCards y DistributionChart
	const [stats, setStats] = useState({
		total: 0,
		culminadas: 0,
		conErrores: 0,
		fallidas: 0,
	});

	useEffect(() => {
		fetchFilteredData(); // Carga inicial sin filtros
	}, []);

	/**
	 * Carga los datos iniciales
	 */
	const fetchFilteredData = async (filters = {}) => {
		try {
			setLoading(true);
			setError(null);
			let result;
			const { sensorId, eventoId } = filters;

			if (sensorId && eventoId) {
				result = await lecturasService.obtenerLecturasPorSensorYEvento(sensorId, eventoId);
			} else if (sensorId) {
				result = await lecturasService.obtenerLecturasPorSensor(sensorId);
			} else if (eventoId) {
				result = await lecturasService.obtenerLecturasPorEvento(eventoId);
			} else {
				result = await lecturasService.obtenerLecturas();
			}

			if (result.error === false && result.body.success) {
				const data = result.body.data;
				console.log("Lecturas obtenidas:", data);
				setHistoricalData(data);

				// Procesar datos para estadísticas y gráfico de distribución
				let culminadasCount = 0;
				let conErroresCount = 0;
				let fallidasCount = 0;

				data.forEach(item => {
					const category = categorizeReading(item);
					if (category === "success") culminadasCount++;
					else if (category === "alert") conErroresCount++;
					else if (category === "failed") fallidasCount++;
				});

				setStats({
					total: data.length,
					culminadas: culminadasCount,
					conErrores: conErroresCount,
					fallidas: fallidasCount,
				});

				setDistributionData([
					{ name: "Culminadas", value: culminadasCount, color: "#10B981" }, // Color para ShieldCheck
					{ name: "Con Errores", value: conErroresCount, color: "#F59E0B" }, // Color para ShieldAlert
					{ name: "Fallidas", value: fallidasCount, color: "#EF4444" }, // Color para ShieldX
				]);

				// Procesar datos para gráfico de tendencia (pruebas por mes)
				const monthlyCounts = data.reduce((acc, item) => {
					const date = new Date(item.fecha_lectura);
					// Formato 'ShortMonth-YY' para agrupar, ej: "Oct-23"
					// Usar un formato numérico como 'YYYY-MM' para mejor ordenación si es necesario
					const monthYear = date.toLocaleString('default', { month: 'short' }) + '-' + date.getFullYear().toString().slice(-2);
					acc[monthYear] = (acc[monthYear] || 0) + 1;
					return acc;
				}, {});

				// Convertir a formato que necesita el gráfico de tendencia
				const trendChartData = Object.entries(monthlyCounts)
					.map(([mes, pruebas]) => ({ mes, pruebas }))
					.sort((a, b) => { // Simple sort, puede necesitar mejora para meses
						const dateA = new Date(a.mes.split('-')[0] + " 1, 20" + a.mes.split('-')[1]);
						const dateB = new Date(b.mes.split('-')[0] + " 1, 20" + b.mes.split('-')[1]);
						return dateA - dateB;
					});
				setTrendData(trendChartData);

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
				/>

				{/* CHARTS */}
				<div className='grid grid-col-1 lg:grid-cols-2 gap-8'>
					<HistoricalTrendChart data={trendData} />
					<HistoricalDistributionChart data={distributionData} />
				</div>
			</main>
		</div>
	);
};
export default HistoricalPage;