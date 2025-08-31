import React from 'react';
import { useState } from "react";
import { BarChart2, MapPin, Zap, Rocket, Satellite, Thermometer, CloudHail, Gauge, Navigation, Activity } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import VerificationCard from "../components/common/VerificationCard";
import Actions from "../components/realtime/Actions";
import DangerZone from "../components/realtime/DangerZone";
import { useTimer } from "../context/TimerContext";
import { useSensorsData } from "../context/SensorsData";
import SimulationCanSat from "../components/realtime/SimulationCanSat";
import GPSModal from "../components/realtime/GPSModal";
import SystemStatusIndicator from "../components/realtime/SystemStatusIndicator";

const RealTimePage = () => {
    const { handleStart, handleStop } = useTimer();
    const { data, startGeneratingData, stopGeneratingData, activeMode } = useSensorsData();
    const [isSimulating, setIsSimulating] = useState(false);

    if (!data || !data.sensors) {
        return <div>Loading...</div>;
    }

    const { sensors } = data;
    const [showGPSModal, setShowGPSModal] = React.useState(false);

    const handleStartAll = (mode) => {
        handleStart();
        startGeneratingData(mode);
        setIsSimulating(true);
    };

    const handleStopAll = () => {
        handleStop();
        stopGeneratingData();
        setIsSimulating(false);
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Datos en tiempo real' />

            <SystemStatusIndicator calibrationStatus={sensors?.NEO6M?.readings?.location?.satellites >= 4} />

            <main className='max-w-7xl mx-auto py-2 px-2 sm:py-4 sm:px-4 lg:px-6'>
                <div className='flex flex-col lg:flex-row gap-6'>
                    {/* Sección de sensores */}
                    <div className='w-full lg:w-7/12'>
                        {/* COHETE */}
                        <div className='mb-8'>
                            <motion.div 
                                className='flex items-center justify-center mb-6'
                                initial={{ y: 20 }} 
                                animate={{ y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                <Rocket className='w-8 h-8 text-blue-500 mr-3' />
                                <h2 className='text-2xl sm:text-3xl font-bold text-white-800'>
                                    Cohete
                                </h2>
                            </motion.div>
                            
                            {/* Sensores de navegación */}
                            <motion.div
                                className='mb-6'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            >
                                <h3 className='text-lg font-semibold text-gray-300 mb-4 flex items-center'>
                                    <Navigation className='w-5 h-5 mr-2 text-blue-400' />
                                    Navegación y Posición
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <div onClick={() => setShowGPSModal(true)} className='cursor-pointer transform hover:scale-105 transition-transform'>
                                        <StatCard 
                                            name='GPS (NEO6M)' 
                                            icon={MapPin} 
                                            value={`${sensors.NEO6M.readings.location.latitude}, ${sensors.NEO6M.readings.location.longitude}`} 
                                            color='#10B981' 
                                        />
                                    </div>
                                    <StatCard 
                                        name='Velocidad (NEO6M)' 
                                        icon={Rocket} 
                                        value={`${sensors.NEO6M.readings.speed.value} ${sensors.NEO6M.readings.speed.unit}`} 
                                        color='#6366F1' 
                                    />
                                    <VerificationCard
                                        title="Verificación de Altitud"
                                        primaryData={{
                                            name: 'GPS (NEO6M)',
                                            value: parseFloat(sensors.NEO6M?.readings?.location?.altitude?.value) || 0,
                                            unit: sensors.NEO6M?.readings?.location?.altitude?.unit || 'm'
                                        }}
                                        secondaryData={{
                                            name: 'Barométrico (BMP280)',
                                            value: parseFloat(sensors.BMP280.readings.altitude.value) || 0,
                                            unit: sensors.BMP280.readings.altitude.unit
                                        }}
                                        threshold={5}
                                        icon={Zap}
                                    />
                                    <StatCard 
                                        name='Presión (BMP280)' 
                                        icon={Gauge} 
                                        value={`${sensors.BMP280.readings.pressure.value} ${sensors.BMP280.readings.pressure.unit}`} 
                                        color='#3B82F6' 
                                    />
                                </div>
                            </motion.div>

                            {/* Sensores de movimiento */}
                            <motion.div
                                className='mb-6'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                <h3 className='text-lg font-semibold text-gray-300 mb-4 flex items-center'>
                                    <Activity className='w-5 h-5 mr-2 text-green-400' />
                                    Movimiento y Orientación
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <StatCard 
                                        name='Giroscopio (MPU9250)' 
                                        icon={BarChart2} 
                                        value={`x: ${sensors.MPU9250.readings.gyroscope.x.value}, y: ${sensors.MPU9250.readings.gyroscope.y.value}, z: ${sensors.MPU9250.readings.gyroscope.z.value}`} 
                                        color='#EC4899' 
                                    />
                                    <StatCard 
                                        name='Aceleración (MPU9250)' 
                                        icon={Zap} 
                                        value={`x: ${sensors.MPU9250.readings.accelerometer.x.value}, y: ${sensors.MPU9250.readings.accelerometer.y.value}, z: ${sensors.MPU9250.readings.accelerometer.z.value}`} 
                                        color='#F59E0B' 
                                    />
                                    <StatCard 
                                        name='Ángulo de Inclinación' 
                                        icon={BarChart2} 
                                        value={`${Math.sqrt(
                                            Math.pow(parseFloat(sensors.MPU9250.readings.gyroscope.x.value), 2) + 
                                            Math.pow(parseFloat(sensors.MPU9250.readings.gyroscope.z.value), 2)
                                        ).toFixed(2)}°`} 
                                        color='#10B981' 
                                    />
                                </div>
                            </motion.div>
                        </div>

                        {/* SATELITE */}
                        <div className='mb-8'>
                            <motion.div 
                                className='flex items-center justify-center mb-6'
                                initial={{ y: 20 }} 
                                animate={{ y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                <Satellite className='w-8 h-8 text-purple-500 mr-3' />
                                <h2 className='text-2xl sm:text-3xl font-bold text-white-800'>
                                    Satélite
                                </h2>
                            </motion.div>
                            
                            {/* Sensores ambientales */}
                            <motion.div
                                className='mb-6'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            >
                                <h3 className='text-lg font-semibold text-gray-300 mb-4 flex items-center'>
                                    <Thermometer className='w-5 h-5 mr-2 text-red-400' />
                                    Condiciones Ambientales
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    <VerificationCard
                                        title="Verificación de Temperatura"
                                        primaryData={{
                                            name: 'Barométrico (BMP280)',
                                            value: parseFloat(sensors.BMP280.readings.temperature.value) || 0,
                                            unit: sensors.BMP280.readings.temperature.unit
                                        }}
                                        secondaryData={{
                                            name: 'Ambiental (SCD40)',
                                            value: parseFloat(sensors.SCD40?.readings?.temperature?.value) || 0,
                                            unit: sensors.SCD40?.readings?.temperature?.unit || '°C'
                                        }}
                                        threshold={2}
                                        icon={Thermometer}
                                    />
                                    <StatCard 
                                        name='Temperatura (SCD40)' 
                                        icon={Thermometer} 
                                        value={`${sensors.SCD40?.readings?.temperature?.value ?? '-'} ${sensors.SCD40?.readings?.temperature?.unit ?? ''}`} 
                                        color='#F97316' 
                                    />
                                    <StatCard 
                                        name='Humedad (SCD40)' 
                                        icon={CloudHail} 
                                        value={`${sensors.SCD40?.readings?.humidity?.value ?? '-'} ${sensors.SCD40?.readings?.humidity?.unit ?? ''}`} 
                                        color='#8B5CF6' 
                                    />
                                    <StatCard 
                                        name='CO2 (SCD40)' 
                                        icon={Zap} 
                                        value={`${sensors.SCD40?.readings?.CO2?.value ?? '-'} ${sensors.SCD40?.readings?.CO2?.unit ?? ''}`} 
                                        color='#7C3AED' 
                                    />
                                </div>
                            </motion.div>

                            {/* Sensores de monitoreo */}
                            <motion.div
                                className='mb-6'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                <h3 className='text-lg font-semibold text-gray-300 mb-4 flex items-center'>
                                    <Gauge className='w-5 h-5 mr-2 text-yellow-400' />
                                    Monitoreo y Control
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

                                    <StatCard 
                                        name='Altura (NEO6M)' 
                                        icon={Zap} 
                                        value={`${sensors.NEO6M?.readings?.location?.altitude?.value ?? sensors.BMP280.readings.altitude.value} ${sensors.NEO6M?.readings?.location?.altitude?.unit ?? sensors.BMP280.readings.altitude.unit}`} 
                                        color='#8B5CF6' 
                                    />
                                </div>
                            </motion.div>

                            {/* Zona de peligro */}
                            <motion.div
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <DangerZone />
                            </motion.div>
                        </div>
                    </div>

                    {/* Contenedor de simulación */}
                    <div className='w-full lg:w-5/12 flex flex-col justify-start lg:justify-center mt-6 lg:mt-0'>
                        <motion.div 
                            className='flex-1 mb-4 flex justify-center h-[600px] sm:h-[700px] lg:h-[calc(100vh-8rem)] xl:h-[calc(100vh-7rem)]'
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <SimulationCanSat testMode={activeMode === 'unitTest' ? 'unitTest' : null} />
                        </motion.div>
                        <motion.div 
                            className='flex flex-col space-y-3 px-2 lg:px-0'
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                        >
                            <Actions onStart={handleStartAll} onStop={handleStopAll} isSimulating={isSimulating} />
                        </motion.div>
                    </div>
                </div>
            </main>
            <GPSModal isVisible={showGPSModal} onClose={() => setShowGPSModal(false)} gps={sensors.NEO6M} />
        </div>
    );
};

export default RealTimePage;