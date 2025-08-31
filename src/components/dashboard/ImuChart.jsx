import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Activity } from "lucide-react";

const imuData = [
    { time: "T1", ax: 10, ay: 11, az: 3 },
    { time: "T2", ax: 12, ay: 9, az: 3 },
    { time: "T3", ax: 11, ay: 10, az: 3 },
    { time: "T4", ax: 15, ay: 12, az: 3 },
    { time: "T5", ax: 10, ay: 15, az: 3 },
    { time: "T6", ax: 12, ay: 14, az: 3 },
    { time: "T7", ax: 13, ay: 10, az: 3 },
];

const ImuChart = () => {
    const [selectedTimeRange, setSelectedTimeRange] = useState("Filtrar por");

    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className='flex items-center mb-6'>
                <Activity className='w-6 h-6 text-green-400 mr-3' />
                <h2 className='text-xl font-semibold text-gray-100'>Aceleración (m/s²)</h2>
                <div className='ml-auto'>
                    <select
                        className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                    >
                        <option>Filtrar por</option>
                        <option>Última hora</option>
                        <option>Últimas 6 horas</option>
                        <option>Último día</option>
                    </select>
                </div>
            </div>

            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart data={imuData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey='time' stroke='#9CA3AF' />
                        <YAxis stroke='#9CA3AF' />
                        <Tooltip
                            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                            itemStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />
                        <Area type='monotone' dataKey='ax' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} name='Aceleración X' />
                        <Area type='monotone' dataKey='ay' stroke='#10B981' fill='#10B981' fillOpacity={0.3} name='Aceleración Y' />
                        <Area type='monotone' dataKey='az' stroke='#F59E0B' fill='#F59E0B' fillOpacity={0.3} name='Aceleración Z' />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ImuChart;