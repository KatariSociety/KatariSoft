import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import Plot from 'react-plotly.js'; // La nueva dependencia
import { Zap, RotateCw } from "lucide-react";
import { useMemo } from "react";

// Componente interno para el gráfico de barras comparativo
const ImuBarChart = ({ data }) => {
    // Tomamos la última lectura para la comparación
    const lastReading = data[data.length - 1] || { accel: {}, gyro: {} };
    const chartData = [
        { name: 'Accel X', value: lastReading.accel.x, fill: '#3B82F6' },
        { name: 'Accel Y', value: lastReading.accel.y, fill: '#60A5FA' },
        { name: 'Accel Z', value: lastReading.accel.z, fill: '#93C5FD' },
        { name: 'Gyro X', value: lastReading.gyro.x, fill: '#EC4899' },
        { name: 'Gyro Y', value: lastReading.gyro.y, fill: '#F472B6' },
        { name: 'Gyro Z', value: lastReading.gyro.z, fill: '#F9A8D4' },
    ];
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
                <YAxis type="category" dataKey="name" stroke="#9CA3AF" fontSize={12} width={80} />
                <Tooltip
                    contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
                />
                <Bar dataKey="value" name="Valor" fill="#8884d8" />
            </BarChart>
        </ResponsiveContainer>
    );
};

// Componente interno para el gráfico 3D
const ImuVectorChart = ({ data }) => {
    const lastReading = data[data.length - 1] || { accel: {x:0,y:0,z:0}, gyro: {x:0,y:0,z:0} };

    const plotData = [
        // Vector de Aceleración
        {
            type: 'scatter3d',
            mode: 'lines',
            x: [0, lastReading.accel.x],
            y: [0, lastReading.accel.y],
            z: [0, lastReading.accel.z],
            line: { color: '#3B82F6', width: 5 },
            name: 'Aceleración'
        },
        // Vector de Giroscopio
        {
            type: 'scatter3d',
            mode: 'lines',
            x: [0, lastReading.gyro.x],
            y: [0, lastReading.gyro.y],
            z: [0, lastReading.gyro.z],
            line: { color: '#EC4899', width: 5 },
            name: 'Giroscopio'
        }
    ];

    const layout = {
        title: 'Vectores 3D (Última Lectura)',
        autosize: true,
        margin: { l: 0, r: 0, b: 0, t: 40 },
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#E5E7EB' },
        scene: {
            xaxis: { title: 'X', color: '#9CA3AF' },
            yaxis: { title: 'Y', color: '#9CA3AF' },
            zaxis: { title: 'Z', color: '#9CA3AF' },
            bgcolor: 'rgba(31, 41, 55, 0.1)'
        }
    };

    return (
        <Plot
            data={plotData}
            layout={layout}
            useResizeHandler={true}
            style={{ width: '100%', height: '300px' }}
            config={{ responsive: true }}
        />
    );
};


const ImuCharts = ({ data }) => {
    return (
        <motion.div
            className='col-span-1 lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className='flex items-center mb-4'>
                <Zap className='w-6 h-6 text-yellow-400 mr-3' />
                <h2 className='text-xl font-semibold text-gray-100'>Datos Inerciales (IMU)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-center text-gray-300 mb-2">Comparativa de Ejes (Última Lectura)</h3>
                    <ImuBarChart data={data} />
                </div>
                <div>
                     <h3 className="text-center text-gray-300 mb-2">Vectores 3D</h3>
                    <ImuVectorChart data={data} />
                </div>
            </div>
        </motion.div>
    );
};

export default ImuCharts;