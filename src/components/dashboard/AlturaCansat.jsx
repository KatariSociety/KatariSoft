import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Satellite } from "lucide-react";

const alturaData = [
	{ time: "T1", altura: 0},
	{ time: "T2", altura: 5 },
	{ time: "T3", altura: 20 },
	{ time: "T4", altura: 80 },
	{ time: "T5", altura: 100 },
	{ time: "T6", altura: 200 },
	{ time: "T7", altura: 300 },
	{ time: "T8", altura: 500 },
];

const AlturaCansat = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
		>
			<div className='flex items-center mb-6'>
				<Satellite className='w-6 h-6 text-purple-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Altura del Satélite</h2>
			</div>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<LineChart data={alturaData}>
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
						<Line 
							type='monotone' 
							dataKey='altura' 
							stroke='#8B5CF6' 
							strokeWidth={3}
							dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
							activeDot={{ r: 8, stroke: "#8B5CF6", strokeWidth: 2 }}
							name='Altura (m)'
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default AlturaCansat;
