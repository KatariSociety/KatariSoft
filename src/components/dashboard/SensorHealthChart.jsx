import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, LineChart, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import { Activity, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

// Datos de ejemplo para la verificación cruzada de sensores
const crossVerificationData = [
	{ tiempo: "10:00", gpsAltitude: 1760, barometricAltitude: 1760, tempSCD: 22.5, tempBMP: 22.3, pressure: 1013.25, co2: 415 },
	{ tiempo: "10:01", gpsAltitude: 1765, barometricAltitude: 1763, tempSCD: 22.3, tempBMP: 22.1, pressure: 1012.8, co2: 418 },
	{ tiempo: "10:02", gpsAltitude: 1770, barometricAltitude: 1768, tempSCD: 22.1, tempBMP: 21.9, pressure: 1012.3, co2: 420 },
	{ tiempo: "10:03", gpsAltitude: 1775, barometricAltitude: 1772, tempSCD: 21.9, tempBMP: 21.7, pressure: 1011.8, co2: 422 },
	{ tiempo: "10:04", gpsAltitude: 1780, barometricAltitude: 1776, tempSCD: 21.7, tempBMP: 21.5, pressure: 1011.3, co2: 425 },
	{ tiempo: "10:05", gpsAltitude: 1785, barometricAltitude: 1780, tempSCD: 21.5, tempBMP: 21.3, pressure: 1010.8, co2: 428 },
	{ tiempo: "10:06", gpsAltitude: 1790, barometricAltitude: 1784, tempSCD: 21.3, tempBMP: 21.1, pressure: 1010.3, co2: 430 },
	{ tiempo: "10:07", gpsAltitude: 1795, barometricAltitude: 1788, tempSCD: 21.1, tempBMP: 20.9, pressure: 1009.8, co2: 433 },
];

// Datos de salud de sensores
const sensorHealthData = [
	{ tiempo: "T1", gps: 95, bmp280: 98, scd40: 92, mpu9250: 96, bateria: 100 },
	{ tiempo: "T2", gps: 94, bmp280: 97, scd40: 91, mpu9250: 95, bateria: 98 },
	{ tiempo: "T3", gps: 93, bmp280: 96, scd40: 90, mpu9250: 94, bateria: 96 },
	{ tiempo: "T4", gps: 92, bmp280: 95, scd40: 89, mpu9250: 93, bateria: 94 },
	{ tiempo: "T5", gps: 91, bmp280: 94, scd40: 88, mpu9250: 92, bateria: 92 },
	{ tiempo: "T6", gps: 90, bmp280: 93, scd40: 87, mpu9250: 91, bateria: 90 },
	{ tiempo: "T7", gps: 89, bmp280: 92, scd40: 86, mpu9250: 90, bateria: 88 },
	{ tiempo: "T8", gps: 88, bmp280: 91, scd40: 85, mpu9250: 89, bateria: 86 },
];

const SensorHealthChart = ({ gpsCalibrationStatus = false }) => {
	// Calcular diferencias entre sensores para detectar anomalías
	const calculateDifferences = () => {
		const lastData = crossVerificationData[crossVerificationData.length - 1];
		const altitudeDiff = Math.abs(lastData.gpsAltitude - lastData.barometricAltitude);
		const tempDiff = Math.abs(lastData.tempSCD - lastData.tempBMP);
		
		return { altitudeDiff, tempDiff };
	};

	const { altitudeDiff, tempDiff } = calculateDifferences();
	
	// Determinar estado de los sensores
	const getSensorStatus = (diff, threshold) => {
		if (diff <= threshold) return { status: 'good', color: 'text-green-400', icon: CheckCircle };
		if (diff <= threshold * 2) return { status: 'warning', color: 'text-yellow-400', icon: AlertCircle };
		return { status: 'error', color: 'text-red-400', icon: AlertCircle };
	};

	const altitudeStatus = getSensorStatus(altitudeDiff, 5); // 5m de diferencia
	const tempStatus = getSensorStatus(tempDiff, 1); // 1°C de diferencia

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700 h-full'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.6 }}
		>
			{/* Header con estado de calibración */}
			<div className='flex items-center justify-between mb-6'>
				<div className='flex items-center'>
					<Activity className='w-6 h-6 text-yellow-400 mr-3' />
					<h2 className='text-xl font-semibold text-gray-100'>Verificación de Sensores</h2>
				</div>
				
				{/* Indicador de estado de calibración GPS */}
				<div className='flex items-center space-x-2'>
					{gpsCalibrationStatus ? (
						<>
							<CheckCircle className='w-5 h-5 text-green-400' />
							<span className='text-sm text-green-400 font-medium'>GPS Calibrado</span>
						</>
					) : (
						<>
							<Loader2 className='w-5 h-5 text-yellow-400 animate-spin' />
							<span className='text-sm text-yellow-400 font-medium'>Calibrando GPS...</span>
						</>
					)}
				</div>
			</div>

			{/* Indicadores de estado de sensores */}
			<div className='grid grid-cols-2 gap-4 mb-6'>
				<div className={`p-3 rounded-lg border ${altitudeStatus.status === 'good' ? 'border-green-500 bg-green-500 bg-opacity-10' : 
					altitudeStatus.status === 'warning' ? 'border-yellow-500 bg-yellow-500 bg-opacity-10' : 
					'border-red-500 bg-red-500 bg-opacity-10'}`}>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-gray-300'>Altitud</span>
						<altitudeStatus.icon className={`w-4 h-4 ${altitudeStatus.color}`} />
					</div>
					<div className={`text-lg font-bold ${altitudeStatus.color}`}>
						{altitudeDiff.toFixed(1)}m
					</div>
					<div className='text-xs text-gray-400'>
						GPS vs Barométrico
					</div>
				</div>

				<div className={`p-3 rounded-lg border ${tempStatus.status === 'good' ? 'border-green-500 bg-green-500 bg-opacity-10' : 
					tempStatus.status === 'warning' ? 'border-yellow-500 bg-yellow-500 bg-opacity-10' : 
					'border-red-500 bg-red-500 bg-opacity-10'}`}>
					<div className='flex items-center justify-between'>
						<span className='text-sm text-gray-300'>Temperatura</span>
						<tempStatus.icon className={`w-4 h-4 ${tempStatus.color}`} />
					</div>
					<div className={`text-lg font-bold ${tempStatus.color}`}>
						{tempDiff.toFixed(1)}°C
					</div>
					<div className='text-xs text-gray-400'>
						SCD40 vs BMP280
					</div>
				</div>
			</div>

			{/* Gráfico de verificación cruzada */}
			<div className='mb-6'>
				<h3 className='text-lg font-semibold text-gray-100 mb-4'>Verificación Cruzada de Sensores</h3>
				<div style={{ width: "100%", height: 250 }}>
					<ResponsiveContainer>
						<ComposedChart data={crossVerificationData}>
							<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
							<XAxis dataKey='tiempo' stroke='#9CA3AF' />
							<YAxis 
								yAxisId="left"
								stroke='#3B82F6' 
								name='Altitud (m)'
								domain={[1750, 1800]}
							/>
							<YAxis 
								yAxisId="right"
								orientation="right"
								stroke='#EC4899' 
								name='Temperatura (°C)'
								domain={[20, 25]}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "rgba(31, 41, 55, 0.9)",
									borderColor: "#4B5563",
									borderRadius: "8px",
								}}
								itemStyle={{ color: "#E5E7EB" }}
							/>
							<Legend />
							
							{/* Líneas de altitud */}
							<Line 
								yAxisId="left"
								type='monotone' 
								dataKey='gpsAltitude' 
								stroke='#10B981' 
								strokeWidth={3}
								dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
								name='Altitud GPS'
							/>
							<Line 
								yAxisId="left"
								type='monotone' 
								dataKey='barometricAltitude' 
								stroke='#3B82F6' 
								strokeWidth={3}
								dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
								name='Altitud Barométrica'
							/>
							
							{/* Líneas de temperatura */}
							<Line 
								yAxisId="right"
								type='monotone' 
								dataKey='tempSCD' 
								stroke='#8B5CF6' 
								strokeWidth={2}
								dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 3 }}
								name='Temp SCD40'
							/>
							<Line 
								yAxisId="right"
								type='monotone' 
								dataKey='tempBMP' 
								stroke='#EC4899' 
								strokeWidth={2}
								dot={{ fill: "#EC4899", strokeWidth: 2, r: 3 }}
								name='Temp BMP280'
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Gráfico de salud de sensores */}
			<div>
				<h3 className='text-lg font-semibold text-gray-100 mb-4'>Estado de Salud de Sensores</h3>
				<div style={{ width: "100%", height: 200 }}>
					<ResponsiveContainer>
						<BarChart data={sensorHealthData}>
							<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
							<XAxis dataKey='tiempo' stroke='#9CA3AF' />
							<YAxis 
								stroke='#9CA3AF' 
								name='Estado (%)'
								domain={[0, 100]}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "rgba(31, 41, 55, 0.8)",
									borderColor: "#4B5563",
								}}
								itemStyle={{ color: "#E5E7EB" }}
							/>
							<Legend />
							<Bar 
								dataKey='gps' 
								fill='#10B981' 
								name='GPS'
								radius={[2, 2, 0, 0]}
							/>
							<Bar 
								dataKey='bmp280' 
								fill='#3B82F6' 
								name='BMP280'
								radius={[2, 2, 0, 0]}
							/>
							<Bar 
								dataKey='scd40' 
								fill='#8B5CF6' 
								name='SCD40'
								radius={[2, 2, 0, 0]}
							/>
							<Bar 
								dataKey='mpu9250' 
								fill='#EC4899' 
								name='MPU9250'
								radius={[2, 2, 0, 0]}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</div>
		</motion.div>
	);
};

export default SensorHealthChart;
