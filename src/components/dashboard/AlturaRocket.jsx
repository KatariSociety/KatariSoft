import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Rocket, Expand } from "lucide-react";
import ChartModal from "../common/ChartModal";

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

const AlturaRocket = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const historicalAlturaData = [
        // Datos de ejemplo para el histórico
        ...alturaData,
        { time: "T9", altura: 450 },
        { time: "T10", altura: 400 },
        { time: "T11", altura: 350 },
        { time: "T12", altura: 300 },
        { time: "T13", altura: 250 },
        { time: "T14", altura: 200 },
        { time: "T15", altura: 150 },
        { time: "T16", altura: 100 },
        { time: "T17", altura: 50 },
        { time: "T18", altura: 0 },
    ];

	const renderChart = (data, isExpanded = false) => (
        <ResponsiveContainer width="100%" height={isExpanded ? "100%" : 300}>
            <LineChart data={data}>
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
                    stroke='#3B82F6'
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 8, stroke: "#3B82F6", strokeWidth: 2 }}
                    name='Altura (m)'
                />
            </LineChart>
        </ResponsiveContainer>
    );

	return (
		<>
			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
			>
				<div className='flex items-center mb-6'>
					<Rocket className='w-6 h-6 text-blue-400 mr-3' />
					<h2 className='text-xl font-semibold text-gray-100'>Altura del Cohete</h2>
					<button
						className='ml-auto p-2 rounded-full hover:bg-gray-700 transition-colors'
						aria-label='Ver datos históricos'
						onClick={() => setIsModalOpen(true)}
					>
						<Expand className='w-5 h-5 text-gray-400' />
					</button>
				</div>
				<div style={{ width: "100%", height: 300 }}>
					{renderChart(alturaData)}
				</div>
			</motion.div>

			<ChartModal
				isVisible={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				title='Histórico de Altura del Cohete'
			>
				{renderChart(historicalAlturaData, true)}
			</ChartModal>
		</>
	);
};

export default AlturaRocket;