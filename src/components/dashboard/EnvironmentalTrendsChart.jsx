import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from "recharts";
import { motion } from "framer-motion";
import { CloudHail } from "lucide-react";

const environmentalData = [
	{ tiempo: "T1", temperatura: 22.1, humedad: 45, co2: 410, presion: 1013 },
	{ tiempo: "T2", temperatura: 21.8, humedad: 47, co2: 412, presion: 1012 },
	{ tiempo: "T3", temperatura: 21.5, humedad: 50, co2: 415, presion: 1011 },
	{ tiempo: "T4", temperatura: 21.2, humedad: 52, co2: 418, presion: 1010 },
	{ tiempo: "T5", temperatura: 20.9, humedad: 55, co2: 420, presion: 1009 },
	{ tiempo: "T6", temperatura: 20.6, humedad: 58, co2: 422, presion: 1008 },
	{ tiempo: "T7", temperatura: 20.3, humedad: 60, co2: 425, presion: 1007 },
	{ tiempo: "T8", temperatura: 20.0, humedad: 62, co2: 428, presion: 1006 },
];

const EnvironmentalTrendsChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<div className='flex items-center mb-6'>
				<CloudHail className='w-6 h-6 text-blue-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Tendencias Ambientales</h2>
			</div>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<ComposedChart data={environmentalData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='tiempo' stroke='#9CA3AF' />
						<YAxis 
							yAxisId="left"
							stroke='#EC4899' 
							name='Temperatura (°C)'
						/>
						<YAxis 
							yAxisId="right"
							orientation="right"
							stroke='#10B981' 
							name='Humedad (%) / CO2 (ppm)'
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
							name='Humedad (%)'
						/>
						<Line 
							yAxisId="right"
							type='monotone' 
							dataKey='co2' 
							stroke='#8B5CF6' 
							strokeWidth={2}
							dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 3 }}
							strokeDasharray="3 3"
							name='CO2 (ppm)'
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default EnvironmentalTrendsChart;
