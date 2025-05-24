import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const HistoricalTrendChart = ({ data }) => {
	if (!data || data.length === 0) {
		return (
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 flex items-center justify-center h-[352px]' // altura igual al div del gráfico + padding etc.
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<p className="text-gray-400">No hay datos para mostrar en el gráfico de tendencia.</p>
			</motion.div>
		);
	}
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4 text-center'>Pruebas por mes</h2>
			<div style={{ width: "100%", height: 300 }}> {/* Esta altura es para el contenedor de Recharts */}
				<ResponsiveContainer>
					<LineChart data={data}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='mes' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' allowDecimals={false} />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Line type='monotone' dataKey='pruebas' stroke='#8B5CF6' strokeWidth={2} name="Nº Pruebas" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default HistoricalTrendChart;