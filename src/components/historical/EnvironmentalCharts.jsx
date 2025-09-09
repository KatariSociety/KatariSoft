import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Thermometer, Wind, Droplets } from "lucide-react";

// Gráfico de barras comparativo
const EnvBarChart = ({ data }) => {
    const lastReading = data[data.length - 1];
    const chartData = [
        { name: 'CO₂ (ppm)', value: lastReading.co2, fill: '#8B5CF6' },
        { name: 'Temp (°C)', value: lastReading.temperature, fill: '#F59E0B' },
        { name: 'Humedad (%)', value: lastReading.humidity, fill: '#3B82F6' },
    ];
    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }} />
                <Bar dataKey="value" name="Valor" />
            </BarChart>
        </ResponsiveContainer>
    );
};

// Gráfico de dispersión
const EnvScatterChart = ({ data }) => {
    // Normalizar CO2 para el rango del ZAxis
    const co2Domain = [Math.min(...data.map(d => d.co2)), Math.max(...data.map(d => d.co2))];
    return (
        <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis type="number" dataKey="temperature" name="Temperatura" unit="°C" stroke="#9CA3AF" fontSize={12} />
                <YAxis type="number" dataKey="humidity" name="Humedad" unit="%" stroke="#9CA3AF" fontSize={12} />
                <ZAxis dataKey="co2" name="CO₂" unit="ppm" range={[60, 400]} domain={co2Domain} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }} />
                <Legend />
                <Scatter name="Lecturas Ambientales" data={data} fill="#10B981" shape="circle" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

// Gráfico de rangos/medidores
const EnvGaugeChart = ({ data }) => {
    const lastReading = data[data.length - 1];
    const ranges = {
        co2: { min: 400, max: 5000, value: lastReading.co2, unit: 'ppm', color: 'bg-purple-500' },
        temperature: { min: 18, max: 27, value: lastReading.temperature, unit: '°C', color: 'bg-amber-500' },
        humidity: { min: 40, max: 60, value: lastReading.humidity, unit: '%', color: 'bg-blue-500' },
    };

    const Gauge = ({ label, range }) => {
        const percentage = ((range.value - range.min) / (range.max - range.min)) * 100;
        const clampedPercentage = Math.max(0, Math.min(100, percentage));

        return (
            <div className="w-full">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="text-gray-300">{label}</span>
                    <span className="font-bold text-white">{range.value.toFixed(2)} {range.unit}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 relative">
                    <div className="h-full bg-gray-500 rounded-full" style={{ width: '100%' }}></div>
                    <div
                        className={`absolute top-0 left-0 h-4 rounded-full ${range.color} transition-all duration-500`}
                        style={{ width: `${clampedPercentage}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{range.min}</span>
                    <span>{range.max}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <Gauge label="CO₂" range={ranges.co2} />
            <Gauge label="Temperatura" range={ranges.temperature} />
            <Gauge label="Humedad" range={ranges.humidity} />
        </div>
    );
};

const EnvironmentalCharts = ({ data }) => {
    return (
        <motion.div
            className='col-span-1 lg:col-span-2 bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className='flex items-center mb-4'>
                <Thermometer className='w-6 h-6 text-green-400 mr-3' />
                <h2 className='text-xl font-semibold text-gray-100'>Datos Ambientales</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                 <div>
                    <h3 className="text-center text-gray-300 mb-2">Valores Actuales</h3>
                    <EnvBarChart data={data} />
                    <h3 className="text-center text-gray-300 mt-6 mb-2">Indicadores de Rango</h3>
                    <EnvGaugeChart data={data} />
                 </div>
                 <div>
                    <h3 className="text-center text-gray-300 mb-2">Correlación Temp/Humedad (Color por CO₂)</h3>
                    <EnvScatterChart data={data} />
                 </div>
            </div>
        </motion.div>
    );
};

export default EnvironmentalCharts;