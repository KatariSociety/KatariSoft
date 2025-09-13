import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Thermometer } from "lucide-react";

const EnvironmentalTimeSeriesChart = ({ data, onHover }) => {
    return (
        <motion.div
            className='col-span-1 lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className='flex items-center mb-4'>
                <Thermometer className='w-6 h-6 text-green-400 mr-3' />
                <h2 className='text-xl font-semibold text-gray-100'>Datos Ambientales a través del Tiempo</h2>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} onMouseMove={onHover} onMouseLeave={() => onHover(null)}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                        <XAxis dataKey="timeFormatted" stroke='#9CA3AF' fontSize={12} />
                        {/* Múltiples ejes Y para cada variable con su propia escala */}
                        <YAxis yAxisId="temp" orientation="left" stroke="#F59E0B" fontSize={12} />
                        <YAxis yAxisId="humidity" orientation="right" stroke="#3B82F6" fontSize={12} />
                        <YAxis yAxisId="co2" orientation="right" stroke="#8B5CF6" fontSize={12} dx={50} />

                        <Tooltip
                            contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                            labelStyle={{ color: "#E5E7EB" }}
                        />
                        <Legend />
                        <Line yAxisId="temp" type='monotone' dataKey='temperature' name='Temperatura (°C)' stroke='#F59E0B' dot={false} />
                        <Line yAxisId="humidity" type='monotone' dataKey='humidity' name='Humedad (%)' stroke='#3B82F6' dot={false} />
                        <Line yAxisId="co2" type='monotone' dataKey='co2' name='CO₂ (ppm)' stroke='#8B5CF6' dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default EnvironmentalTimeSeriesChart;