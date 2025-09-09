import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Gauge } from "lucide-react";

// Recibe datos procesados
const PressureAltitudeChart = ({ data }) => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
		>
			<div className='flex items-center mb-4'>
				<Gauge className='w-6 h-6 text-cyan-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Presión vs. Altitud</h2>
			</div>
			<div className="h-72">
				<ResponsiveContainer width="100%" height="100%">
					<ScatterChart>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis type="number" dataKey='altitude' name='Altitud' unit='m' stroke='#9CA3AF' fontSize={12} />
						<YAxis type="number" dataKey='pressure' name='Presión' unit='hPa' stroke='#9CA3AF' fontSize={12} />
						<Tooltip cursor={{ strokeDasharray: '3 3' }}
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							labelStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Scatter name='Lecturas' data={data} fill='#22D3EE' />
					</ScatterChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default PressureAltitudeChart;