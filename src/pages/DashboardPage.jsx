import Header from "../components/common/Header";
import { motion } from "framer-motion";
import { Rocket, Satellite, BarChart2, Thermometer, Gauge, Activity, Navigation } from "lucide-react";

import ImuChart from "../components/dashboard/ImuChart";
import AlturaRocket from "../components/dashboard/AlturaRocket";
import VelocityChart from "../components/dashboard/VelocityChart";
import PressureAltitudeChart from "../components/dashboard/PressureAltitudeChart";
import AtmosphericProfileChart from "../components/dashboard/AtmosphericProfileChart";
import SensorHealthChart from "../components/dashboard/SensorHealthChart";
import EnergyConsumptionChart from "../components/dashboard/EnergyConsumptionChart";
import GeoSpatialMap from "../components/dashboard/GeoSpatialMap";
import GpsStatusWidget from "../components/dashboard/GpsStatusWidget";

const DashboardPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>				
				
				{/* Sección del Cohete */}
				<motion.div 
					className='mb-12'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className='flex items-center justify-center mb-8'>
						<Rocket className='w-8 h-8 text-blue-500 mr-3' />
						<h1 className='text-3xl font-bold text-white-800'>Cohete</h1>
					</div>
					
					{/* Primera fila: Altura y Velocidad */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4, delay: 0.1 }}
						>
							<AlturaRocket />
						</motion.div>
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4, delay: 0.2 }}
						>
							<VelocityChart />
						</motion.div>
					</div>

					{/* Segunda fila: IMU y Presión vs Altitud */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.3 }}
						>
							<ImuChart />
						</motion.div>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.4 }}
						>
							<PressureAltitudeChart />
						</motion.div>
					</div>
				</motion.div>

				{/* Sección del Satélite */}
				<motion.div 
					className='mb-12'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.6 }}
				>
					<div className='flex items-center justify-center mb-8'>
						<Satellite className='w-8 h-8 text-purple-500 mr-3' />
						<h1 className='text-3xl font-bold text-white-800'>Satélite</h1>
					</div>
					
					{/* Mapa Geoespacial Principal */}
					<div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8'>
						<motion.div
							className='lg:col-span-3'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.7 }}
						>
							<GeoSpatialMap 
								gpsData={{
									latitude: 2.4764896,
									longitude: -76.6221040,
									altitude: 1760,
									satellites: 8,
									hdop: 1.2
								}}
								sensorData={{
									barometricAltitude: 1758,
									temperature: 22.5,
									pressure: 1013.25,
									co2: 415
								}}
								trajectoryData={[
									{ lat: 2.4764896, lng: -76.6221040, gpsAltitude: 1760, barometricAltitude: 1760, temperature: 22.5, pressure: 1013.25, co2: 415, timestamp: '10:00:00' },
									{ lat: 2.4764898, lng: -76.6221042, gpsAltitude: 1765, barometricAltitude: 1763, temperature: 22.3, pressure: 1012.8, co2: 418, timestamp: '10:00:15' },
									{ lat: 2.4764900, lng: -76.6221045, gpsAltitude: 1770, barometricAltitude: 1768, temperature: 22.1, pressure: 1012.3, co2: 420, timestamp: '10:00:30' }
								]}
								autoFollow={false}
							/>
						</motion.div>
						
						{/* Widget de Estado GPS */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.8 }}
						>
							<GpsStatusWidget 
								gpsData={{
									satellites: 8,
									hdop: 1.2
								}}
								calibrationStatus={true}
							/>
						</motion.div>
					</div>

					{/* Layout Asimétrico: Análisis y Consumo Energético */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
						{/* Columna Izquierda: El componente más alto */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.9 }}
						>
							<SensorHealthChart gpsCalibrationStatus={true} />
						</motion.div>

						{/* Columna Derecha: Componentes apilados */}
						<div className='flex flex-col gap-8'>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 1.0 }}
							>
								<AtmosphericProfileChart />
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 1.1 }}
							>
								<EnergyConsumptionChart />
							</motion.div>
						</div>
					</div>
				</motion.div>

				{/* Resumen de Métricas */}
				<motion.div
					className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 1.5 }}
				>
					<div className='flex items-center justify-center mb-6'>
						<BarChart2 className='w-6 h-6 text-green-400 mr-2' />
						<h2 className='text-xl font-semibold text-gray-100'>Resumen de Métricas</h2>
					</div>
					
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						<div className='text-center p-4 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600'>
							<div className='text-2xl font-bold text-blue-400'>500m</div>
							<div className='text-sm text-gray-300'>Altura Máxima Cohete</div>
						</div>
						<div className='text-center p-4 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600'>
							<div className='text-2xl font-bold text-purple-400'>1795m</div>
							<div className='text-sm text-gray-300'>Altura Máxima Satélite</div>
						</div>
						<div className='text-center p-4 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600'>
							<div className='text-2xl font-bold text-green-400'>22.5°C</div>
							<div className='text-sm text-gray-300'>Temperatura Promedio</div>
						</div>
						<div className='text-center p-4 bg-gray-700 bg-opacity-50 rounded-lg border border-gray-600'>
							<div className='text-2xl font-bold text-yellow-400'>1013 hPa</div>
							<div className='text-sm text-gray-300'>Presión Promedio</div>
						</div>
					</div>
				</motion.div>
			</main>
		</div>
	);
};

export default DashboardPage;
