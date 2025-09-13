import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const ImuMagnitudeChart = ({ data }) => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className='flex items-center mb-4'>
                <TrendingUp className='w-6 h-6 text-pink-400 mr-3' />
                <h2 className='text-xl font-semibold text-gray-100'>IMU: Magnitud de Vectores</h2>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey="timeFormatted" stroke='#9CA3AF' fontSize={12} />
                        {/* Ejes Y separados para Aceleración (g) y Giroscopio (°/s) */}
                        <YAxis yAxisId="left" stroke='#3B82F6' fontSize={12} />
                        <YAxis yAxisId="right" orientation="right" stroke='#EC4899' fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                            labelStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />
                        <Line yAxisId="left" type='monotone' dataKey='accelMagnitude' name='Aceleración (g)' stroke='#3B82F6' strokeWidth={2} dot={false} />
                        <Line yAxisId="right" type='monotone' dataKey='gyroMagnitude' name='Giroscopio (°/s)' stroke='#EC4899' strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ImuMagnitudeChart;