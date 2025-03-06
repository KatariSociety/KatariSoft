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

const RealTimePage = () => {
    const { handleStart, handleStop } = useTimer();
    const { data, startGeneratingData, stopGeneratingData } = useSensorsData();
    const [isSimulating, setIsSimulating] = useState(false);

    if (!data || !data.sensors) {
        return <div>Loading...</div>;
    }

    const { sensors } = data;

    const handleStartAll = () => {
        handleStart();
        startGeneratingData();
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
                    <div className='w-full lg:w-8/12'>
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
                                className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'
                                initial={{ y: 20 }}  // Removida la opacidad inicial
                                animate={{ y: 0 }}   // Solo animamos el movimiento
                                transition={{ 
                                    duration: 0.3,   // Reducida la duración
                                    ease: 'easeOut'  // Añadida curva de ease
                                }}
                            >
                                <StatCard name='Velocidad' icon={Rocket} value={`${sensors.NEO6M.readings.speed.value} ${sensors.NEO6M.readings.speed.unit}`} color='#6366F1' />
                                <StatCard name='Altura' icon={Zap} value={`${sensors.BMP280.readings.altitude.value} ${sensors.BMP280.readings.altitude.unit}`} color='#8B5CF6' />
                                <StatCard name='Giroscopio' icon={BarChart2} value={`x: ${sensors.MPU9250.readings.gyroscope.x.value}, y: ${sensors.MPU9250.readings.gyroscope.y.value}, z: ${sensors.MPU9250.readings.gyroscope.z.value}`} color='#EC4899' />
                                <StatCard name='GPS' icon={MapPin} value={`${sensors.NEO6M.readings.location.latitude}, ${sensors.NEO6M.readings.location.longitude}`} color='#10B981' />
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
                                className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ 
                                    duration: 0.3,
                                    ease: 'easeOut'
                                }}
                            >
                                <StatCard name='Velocidad' icon={Satellite} value={`${sensors.NEO6M.readings.speed.value} ${sensors.NEO6M.readings.speed.unit}`} color='#6366F1' />
                                <StatCard name='Altura' icon={BarChart2} value={`${sensors.BMP280.readings.altitude.value} ${sensors.BMP280.readings.altitude.unit}`} color='#8B5CF6' />
                                <StatCard name='GPS' icon={MapPin} value={`${sensors.NEO6M.readings.location.latitude}, ${sensors.NEO6M.readings.location.longitude}`} color='#10B981' />
                                <StatCard name='Presión' icon={Gauge} value={`${sensors.BMP280.readings.pressure.value} ${sensors.BMP280.readings.pressure.unit}`} color='#6366F1' />
                                <StatCard name='Temperatura' icon={Thermometer} value={`${sensors.BMP280.readings.temperature.value} ${sensors.BMP280.readings.temperature.unit}`} color='#EC4899' />
                                <StatCard name='Humedad' icon={CloudHail} value='12%' color='#8B5CF6' />
                                <StatCard name='CO' icon={Zap} value='12' color='#10B981' />
                                <StatCard name='CO2' icon={Zap} value={`${sensors.CCS811.readings.CO2.value} ${sensors.CCS811.readings.CO2.unit}`} color='#EC4899' />
                            </motion.div>
                            <div className='mt-4 lg:mt-6'>
                                <DangerZone />
                            </div>
                        </div>
                    </div>

                    {/* Contenedor del simulador */}
                    <div className='w-full lg:w-4/12 flex flex-col justify-start lg:justify-center mt-4 lg:mt-0'>
                        <div className='flex-1 mb-2 flex justify-center h-[700px] sm:h-[800px] lg:h-[calc(100vh-8rem)] xl:h-[calc(100vh-7rem)]'>
                            <SimulationCanSat />
                        </div>
                        <div className='flex flex-col space-y-2 px-2 lg:px-0'>
                            <Actions onStart={handleStartAll} onStop={handleStopAll} isSimulating={isSimulating} />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default RealTimePage;