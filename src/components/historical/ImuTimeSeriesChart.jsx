import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";

const ImuTimeSeriesChart = ({ data, onHover }) => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className='flex items-center mb-4'>
                <Zap className='w-6 h-6 text-yellow-400 mr-3' />
                <h2 className='text-xl font-semibold text-gray-100'>IMU: Series de Tiempo por Eje</h2>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} onMouseMove={onHover} onMouseLeave={() => onHover(null)}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey="timeFormatted" stroke='#9CA3AF' fontSize={12} />
                        <YAxis stroke='#9CA3AF' fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                            labelStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />
                        {/* Acelerómetro */}
                        <Line type='monotone' dataKey='accel.x' name='Accel X' stroke='#3B82F6' dot={false} />
                        <Line type='monotone' dataKey='accel.y' name='Accel Y' stroke='#60A5FA' dot={false} />
                        <Line type='monotone' dataKey='accel.z' name='Accel Z' stroke='#93C5FD' dot={false} />
                        {/* Giroscopio */}
                        <Line type='monotone' dataKey='gyro.x' name='Gyro X' stroke='#EC4899' dot={false} />
                        <Line type='monotone' dataKey='gyro.y' name='Gyro Y' stroke='#F472B6' dot={false} />
                        <Line type='monotone' dataKey='gyro.z' name='Gyro Z' stroke='#F9A8D4' dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default ImuTimeSeriesChart;