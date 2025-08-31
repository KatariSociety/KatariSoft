import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from "recharts";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";

const atmosphericData = [
	{ altitud: 0,    presion: 1013.25, temperatura: 22.0, humedad: 60, densidad: 1.225 },
	{ altitud: 500,  presion: 954.61,  temperatura: 18.5, humedad: 58, densidad: 1.167 },
	{ altitud: 1000, presion: 898.76,  temperatura: 15.0, humedad: 55, densidad: 1.112 },
	{ altitud: 1500, presion: 845.47,  temperatura: 11.5, humedad: 52, densidad: 1.058 },
	{ altitud: 2000, presion: 794.98,  temperatura: 8.0,  humedad: 48, densidad: 1.007 },
	{ altitud: 2500, presion: 747.01,  temperatura: 4.5,  humedad: 45, densidad: 0.957 },
	{ altitud: 3000, presion: 701.21,  temperatura: 1.0,  humedad: 42, densidad: 0.909 },
	{ altitud: 3500, presion: 657.80,  temperatura: -2.5, humedad: 38, densidad: 0.863 },
	{ altitud: 4000, presion: 616.45,  temperatura: -6.0, humedad: 35, densidad: 0.819 },
];

const AtmosphericProfileChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<div className='flex items-center mb-6'>
				<Layers className='w-6 h-6 text-purple-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Perfil Atmosférico</h2>
			</div>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<ComposedChart data={atmosphericData}>
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
							name='Temperatura (°C) / Humedad (%)'
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
							dataKey='presion' 
							stroke='#3B82F6' 
							fill='#3B82F6' 
							fillOpacity={0.3}
							name='Presión (hPa)'
						/>
						<Line 
							yAxisId="right"
							type='monotone' 
							dataKey='temperatura' 
							stroke='#EC4899' 
							strokeWidth={3}
							dot={{ fill: "#EC4899", strokeWidth: 2, r: 3 }}
							name='Temperatura (°C)'
						/>
						<Line 
							yAxisId="right"
							type='monotone' 
							dataKey='humedad' 
							stroke='#10B981' 
							strokeWidth={2}
							dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
							strokeDasharray="3 3"
							name='Humedad (%)'
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default AtmosphericProfileChart;
