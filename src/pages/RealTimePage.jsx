import React from 'react';
import { useState } from "react";
import { BarChart2, MapPin, Zap, Rocket, Satellite, Thermometer, CloudHail, Gauge } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import Actions from "../components/realtime/Actions";
import DangerZone from "../components/realtime/DangerZone";
import { useTimer } from "../context/TimerContext";
import { useSensorsData } from "../context/SensorsData";
import SimulationCanSat from "../components/realtime/SimulationCanSat";
import GPSModal from "../components/realtime/GPSModal";

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

            <main className='max-w-7xl mx-auto py-2 px-2 sm:py-4 sm:px-4 lg:px-6'>
                <div className='flex flex-col lg:flex-row gap-4'>
                    {/* Reducimos el ancho de la sección de KPIs */}
                    <div className='w-full lg:w-6/12'>
                        {/* COHETE */}
                        <div className='mb-4 lg:mb-6'>
                            <motion.h2 
                                className='text-xl sm:text-2xl font-semibold text-white-800 mb-2 sm:mb-4 text-center'
                                initial={{ y: 20 }} 
                                animate={{ y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                Cohete
                            </motion.h2>
                            <motion.div
                                className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ 
                                    duration: 0.3,
                                    ease: 'easeOut'
                                }}
                            >
                                <div onClick={() => setShowGPSModal(true)} className='cursor-pointer'>
                                    <StatCard name='GPS (NEO6M)' icon={MapPin} value={`${sensors.NEO6M.readings.location.latitude}, ${sensors.NEO6M.readings.location.longitude}`} color='#10B981' />
                                </div>
                                <StatCard name='Velocidad (NEO6M)' icon={Rocket} value={`${sensors.NEO6M.readings.speed.value} ${sensors.NEO6M.readings.speed.unit}`} color='#6366F1' />
                                <StatCard name='Altura (BMP280)' icon={Zap} value={`${sensors.BMP280.readings.altitude.value} ${sensors.BMP280.readings.altitude.unit}`} color='#8B5CF6' />
                                <StatCard name='Giroscopio (MPU9250)' icon={BarChart2} value={`x: ${sensors.MPU9250.readings.gyroscope.x.value}, y: ${sensors.MPU9250.readings.gyroscope.y.value}, z: ${sensors.MPU9250.readings.gyroscope.z.value}`} color='#EC4899' />
                                <StatCard 
                                    name='Aceleración (MPU9250)' 
                                    icon={Zap} 
                                    value={`x: ${sensors.MPU9250.readings.accelerometer.x.value}, y: ${sensors.MPU9250.readings.accelerometer.y.value}, z: ${sensors.MPU9250.readings.accelerometer.z.value}`} 
                                    color='#F59E0B' 
                                />
                                <StatCard 
                                    name='Ángulo (MPU9250)' 
                                    icon={BarChart2} 
                                    value={`${Math.sqrt(
                                        Math.pow(parseFloat(sensors.MPU9250.readings.gyroscope.x.value), 2) + 
                                        Math.pow(parseFloat(sensors.MPU9250.readings.gyroscope.z.value), 2)
                                    ).toFixed(2)}°`} 
                                    color='#10B981' 
                                />
                                <StatCard 
                                    name='Presión (BMP280)' 
                                    icon={Gauge} 
                                    value={`${sensors.BMP280.readings.pressure.value} ${sensors.BMP280.readings.pressure.unit}`} 
                                    color='#3B82F6' 
                                />
                            </motion.div>
                        </div>

                        {/* SATELITE */}
                        <div className='mb-4 lg:mb-6'>
                            <motion.h2 
                                className='text-xl sm:text-2xl font-semibold text-white-800 mb-2 sm:mb-4 text-center'
                                initial={{ y: 20 }} 
                                animate={{ y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                Satélite
                            </motion.h2>
                            <motion.div
                                className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ 
                                    duration: 0.3,
                                    ease: 'easeOut'
                                }}
                            >
                                <div onClick={() => setShowGPSModal(true)} className='cursor-pointer'>
                                    <StatCard name='GPS (NEO6M)' icon={MapPin} value={`${sensors.NEO6M.readings.location.latitude}, ${sensors.NEO6M.readings.location.longitude}`} color='#10B981' />
                                </div>
                                <StatCard name='Velocidad (NEO6M)' icon={Rocket} value={`${sensors.NEO6M?.readings?.speed?.value ?? '-'} ${sensors.NEO6M?.readings?.speed?.unit ?? ''}`} color='#6366F1' />
                                <StatCard name='Altura (NEO6M)' icon={Zap} value={`${sensors.NEO6M?.readings?.location?.altitude?.value ?? sensors.BMP280.readings.altitude.value} ${sensors.NEO6M?.readings?.location?.altitude?.unit ?? sensors.BMP280.readings.altitude.unit}`} color='#8B5CF6' />
                                <StatCard name='Presión (BMP280)' icon={Gauge} value={`${sensors.BMP280.readings.pressure.value} ${sensors.BMP280.readings.pressure.unit}`} color='#6366F1' />
                                <StatCard name='Temperatura (BMP280)' icon={Thermometer} value={`${sensors.BMP280.readings.temperature.value} ${sensors.BMP280.readings.temperature.unit}`} color='#EC4899' />
                                <StatCard name='Temperatura (SCD40)' icon={Thermometer} value={`${sensors.SCD40?.readings?.temperature?.value ?? '-'} ${sensors.SCD40?.readings?.temperature?.unit ?? ''}`} color='#F97316' />
                                <StatCard name='Humedad' icon={CloudHail} value='12%' color='#8B5CF6' />
                                <StatCard name='CO' icon={Zap} value='12' color='#10B981' />
                                <StatCard name='CO2 (SCD40)' icon={Zap} value={`${sensors.SCD40?.readings?.CO2?.value ?? '-'} ${sensors.SCD40?.readings?.CO2?.unit ?? ''}`} color='#7C3AED' />
                            </motion.div>
                            <div className='mt-4 lg:mt-6'>
                                <DangerZone />
                            </div>
                        </div>
                    </div>

                    {/* Aumentamos el ancho del contenedor de la simulación */}
                    <div className='w-full lg:w-6/12 flex flex-col justify-start lg:justify-center mt-4 lg:mt-0'>
                        <div className='flex-1 mb-2 flex justify-center h-[700px] sm:h-[800px] lg:h-[calc(100vh-6rem)] xl:h-[calc(100vh-5rem)]'>
                            <SimulationCanSat testMode={activeMode === 'unitTest' ? 'unitTest' : null} />
                        </div>
                        <div className='flex flex-col space-y-2 px-2 lg:px-0'>
                            <Actions onStart={handleStartAll} onStop={handleStopAll} isSimulating={isSimulating} />
                        </div>
                    </div>
                </div>
            </main>
            <GPSModal isVisible={showGPSModal} onClose={() => setShowGPSModal(false)} gps={sensors.NEO6M} />
        </div>
    );
};

export default RealTimePage;