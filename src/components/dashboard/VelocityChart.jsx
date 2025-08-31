import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const velocityData = [
	{ time: "T1", velocidad: 0, aceleracion: 0 },
	{ time: "T2", velocidad: 15, aceleracion: 15 },
	{ time: "T3", velocidad: 45, aceleracion: 30 },
	{ time: "T4", velocidad: 80, aceleracion: 35 },
	{ time: "T5", velocidad: 120, aceleracion: 40 },
	{ time: "T6", velocidad: 150, aceleracion: 30 },
	{ time: "T7", velocidad: 180, aceleracion: 30 },
	{ time: "T8", velocidad: 200, aceleracion: 20 },
	{ time: "T9", velocidad: 220, aceleracion: 20 },
	{ time: "T10", velocidad: 240, aceleracion: 20 },
];

const VelocityChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<div className='flex items-center mb-6'>
				<Zap className='w-6 h-6 text-yellow-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Velocidad vs Tiempo</h2>
			</div>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<AreaChart data={velocityData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='time' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Area 
							type='monotone' 
							dataKey='velocidad' 
							stroke='#F59E0B' 
							fill='#F59E0B' 
							fillOpacity={0.3}
							name='Velocidad (m/s)'
						/>
						<Line 
							type='monotone' 
							dataKey='aceleracion' 
							stroke='#10B981' 
							strokeWidth={2}
							dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
							name='Aceleración (m/s²)'
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default VelocityChart;
