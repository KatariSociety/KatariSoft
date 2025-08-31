import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, ComposedChart } from "recharts";
import { motion } from "framer-motion";
import { Battery } from "lucide-react";

const energyData = [
	{ tiempo: "T1", bateria: 100, consumo: 0, temperatura: 25, voltaje: 3.7 },
	{ tiempo: "T2", bateria: 95, consumo: 5, temperatura: 26, voltaje: 3.65 },
	{ tiempo: "T3", bateria: 90, consumo: 10, temperatura: 27, voltaje: 3.6 },
	{ tiempo: "T4", bateria: 85, consumo: 15, temperatura: 28, voltaje: 3.55 },
	{ tiempo: "T5", bateria: 80, consumo: 20, temperatura: 29, voltaje: 3.5 },
	{ tiempo: "T6", bateria: 75, consumo: 25, temperatura: 30, voltaje: 3.45 },
	{ tiempo: "T7", bateria: 70, consumo: 30, temperatura: 31, voltaje: 3.4 },
	{ tiempo: "T8", bateria: 65, consumo: 35, temperatura: 32, voltaje: 3.35 },
];

const EnergyConsumptionChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.7 }}
		>
			<div className='flex items-center mb-6'>
				<Battery className='w-6 h-6 text-green-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Consumo Energético</h2>
			</div>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<ComposedChart data={energyData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='tiempo' stroke='#9CA3AF' />
						<YAxis 
							yAxisId="left"
							stroke='#10B981' 
							name='Batería (%) / Consumo (%)'
						/>
						<YAxis 
							yAxisId="right"
							orientation="right"
							stroke='#F59E0B' 
							name='Voltaje (V) / Temperatura (°C)'
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Area 
							yAxisId="left"
							type='monotone' 
							dataKey='bateria' 
							stroke='#10B981' 
							fill='#10B981' 
							fillOpacity={0.3}
							name='Batería (%)'
						/>
						<Line 
							yAxisId="left"
							type='monotone' 
							dataKey='consumo' 
							stroke='#EC4899' 
							strokeWidth={2}
							dot={{ fill: "#EC4899", strokeWidth: 2, r: 3 }}
							name='Consumo (%)'
						/>
						<Line 
							yAxisId="right"
							type='monotone' 
							dataKey='voltaje' 
							stroke='#F59E0B' 
							strokeWidth={2}
							dot={{ fill: "#F59E0B", strokeWidth: 2, r: 3 }}
							name='Voltaje (V)'
						/>
						<Line 
							yAxisId="right"
							type='monotone' 
							dataKey='temperatura' 
							stroke='#8B5CF6' 
							strokeWidth={2}
							dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 3 }}
							strokeDasharray="3 3"
							name='Temperatura (°C)'
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default EnergyConsumptionChart;
