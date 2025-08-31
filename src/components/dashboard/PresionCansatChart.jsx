import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";

const presionData = [
	{ time: "T1", presion: 1013 },
	{ time: "T2", presion: 1500 },
	{ time: "T3", presion: 1013 },
	{ time: "T4", presion: 1013 },
	{ time: "T5", presion: 1013 },
	{ time: "T6", presion: 1013 },
];

const PresionCansatChart = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
		>
			<div className='flex items-center mb-6'>
				<Gauge className='w-6 h-6 text-yellow-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Presión Atmosférica</h2>
			</div>
			<div className='h-[300px]'>
				<ResponsiveContainer width='100%' height='100%'>
					<LineChart data={presionData}>
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
						<Line
							type='monotone'
							dataKey='presion'
							stroke='#F59E0B'
							strokeWidth={3}
							dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8, stroke: "#F59E0B", strokeWidth: 2 }}
							name='Presión (hPa)'
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default PresionCansatChart;
