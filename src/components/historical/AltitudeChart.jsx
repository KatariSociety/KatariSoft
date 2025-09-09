import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area } from "recharts";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

// Recibe datos procesados
const AltitudeChart = ({ data }) => {
	const formattedData = data.map(d => ({
		...d,
		// Formatea el timestamp para la Tooltip
		timeFormatted: new Date(d.time).toLocaleTimeString()
	}));

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
		>
			<div className='flex items-center mb-4'>
				<Rocket className='w-6 h-6 text-blue-400 mr-3' />
				<h2 className='text-xl font-semibold text-gray-100'>Altura vs. Tiempo</h2>
			</div>
			<div className="h-72">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={formattedData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='timeFormatted' stroke='#9CA3AF' fontSize={12} />
						<YAxis stroke='#9CA3AF' fontSize={12} />
						<Tooltip
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							labelStyle={{ color: "#E5E7EB" }}
						/>
						<Legend />
						<Line type='monotone' dataKey='altitude' stroke='#3B82F6' strokeWidth={2} name='Altura (m)' dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};

export default AltitudeChart;