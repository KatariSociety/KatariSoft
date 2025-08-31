import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, ScatterChart, ComposedChart } from "recharts";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";

const pressureAltitudeData = [
	{ altitud: 0, presion: 1013.25, temperatura: 15 },
	{ altitud: 1000, presion: 898.76, temperatura: 8.5 },
	{ altitud: 2000, presion: 794.98, temperatura: 2 },
	{ altitud: 3000, presion: 701.21, temperatura: -4.5 },
	{ altitud: 4000, presion: 616.45, temperatura: -11 },
	{ altitud: 5000, presion: 540.48, temperatura: -17.5 },
	{ altitud: 6000, presion: 472.17, temperatura: -24 },
	{ altitud: 7000, presion: 411.05, temperatura: -30.5 },
	{ altitud: 8000, presion: 356.51, temperatura: -37 },
	{ altitud: 9000, presion: 308.00, temperatura: -43.5 },
	{ altitud: 10000, presion: 264.36, temperatura: -50 },
];

const PressureAltitudeChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex items-center mb-6'>
				<Gauge className='w-6 h-6 text-blue-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Presión vs Altitud</h2>
			</div>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<ComposedChart data={pressureAltitudeData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis 
							dataKey='altitud' 
							stroke='#9CA3AF' 
							name='Altitud (m)'
							type='number'
						/>
						<YAxis 
							yAxisId="left"
							stroke='#3B82F6' 
							name='Presión (hPa)'
						/>
						<YAxis 
							yAxisId="right"
							orientation="right"
							stroke='#EC4899' 
							name='Temperatura (°C)'
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Line 
							yAxisId="left"
							type='monotone' 
							dataKey='presion' 
							stroke='#3B82F6' 
							strokeWidth={3}
							dot={{ fill: "#3B82F6", strokeWidth: 2, r: 3 }}
							activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
							name='Presión (hPa)'
						/>
						<Line 
							yAxisId="right"
							type='monotone' 
							dataKey='temperatura' 
							stroke='#EC4899' 
							strokeWidth={2}
							dot={{ fill: "#EC4899", strokeWidth: 2, r: 2 }}
							strokeDasharray="5 5"
							name='Temperatura (°C)'
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default PressureAltitudeChart;
