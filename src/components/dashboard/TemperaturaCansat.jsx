import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import { Thermometer } from "lucide-react";

const temperaturaData = [
	{ time: "T1", temperatura: 21.1},
	{ time: "T2", temperatura: 21.0},
	{ time: "T3", temperatura: 22.0},
	{ time: "T4", temperatura: 21.8},
	{ time: "T5", temperatura: 21.7},
];

const TemperaturaCansat = () => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex items-center mb-6'>
				<Thermometer className='w-6 h-6 text-red-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Temperatura Ambiental</h2>
			</div>
			<div style={{ width: "100%", height: 300 }}>
				<ResponsiveContainer>
					<BarChart data={temperaturaData}>
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
						<Bar 
							dataKey='temperatura' 
							fill='#EC4899' 
							name='Temperatura (°C)'
							radius={[4, 4, 0, 0]}
						/>						
					</BarChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default TemperaturaCansat;
