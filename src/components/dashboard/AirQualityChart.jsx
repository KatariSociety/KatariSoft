import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts";
import { motion } from "framer-motion";
import { Wind } from "lucide-react";

const airQualityData = [
	{ tiempo: "T1", co2: 410, co: 0.5, no2: 15, o3: 25, calidad: 85 },
	{ tiempo: "T2", co2: 412, co: 0.6, no2: 16, o3: 26, calidad: 83 },
	{ tiempo: "T3", co2: 415, co: 0.7, no2: 17, o3: 27, calidad: 80 },
	{ tiempo: "T4", co2: 418, co: 0.8, no2: 18, o3: 28, calidad: 78 },
	{ tiempo: "T5", co2: 420, co: 0.9, no2: 19, o3: 29, calidad: 75 },
	{ tiempo: "T6", co2: 422, co: 1.0, no2: 20, o3: 30, calidad: 72 },
	{ tiempo: "T7", co2: 425, co: 1.1, no2: 21, o3: 31, calidad: 70 },
	{ tiempo: "T8", co2: 428, co: 1.2, no2: 22, o3: 32, calidad: 68 },
];

const AirQualityChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex items-center mb-6'>
				<Wind className='w-6 h-6 text-green-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Calidad del Aire</h2>
			</div>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<ComposedChart data={airQualityData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='tiempo' stroke='#9CA3AF' />
						<YAxis 
							yAxisId="left"
							stroke='#8B5CF6' 
							name='Concentración'
						/>
						<YAxis 
							yAxisId="right"
							orientation="right"
							stroke='#10B981' 
							name='Calidad (%)'
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(31, 41, 55, 0.8)",
								borderColor: "#4B5563",
							}}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Bar 
							yAxisId="left"
							dataKey='co2' 
							fill='#8B5CF6' 
							name='CO2 (ppm)'
							radius={[2, 2, 0, 0]}
						/>
						<Bar 
							yAxisId="left"
							dataKey='co' 
							fill='#F59E0B' 
							name='CO (ppm)'
							radius={[2, 2, 0, 0]}
						/>
						<Bar 
							yAxisId="left"
							dataKey='no2' 
							fill='#EC4899' 
							name='NO2 (ppb)'
							radius={[2, 2, 0, 0]}
						/>
						<Line 
							yAxisId="right"
							type='monotone' 
							dataKey='calidad' 
							stroke='#10B981' 
							strokeWidth={3}
							dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
							name='Calidad (%)'
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default AirQualityChart;
