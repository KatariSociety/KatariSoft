import React from 'react';
import { useState } from "react";
import { BarChart2, MapPin, Zap, Rocket, Satellite, Thermometer, CloudHail, Gauge, Navigation, Activity, Wind, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
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

// Función auxiliar para manejar toFixed de manera segura
const safeToFixed = (value, decimals = 2) => {
    if (typeof value === 'number' && !isNaN(value)) {
        return value.toFixed(decimals);
    }
    return '0.00';
};

const RealTimePage = () => {
    const { handleStart, handleStop } = useTimer();
    const { data, startGeneratingData, stopGeneratingData, activeMode } = useSensorsData();
    const [isSimulating, setIsSimulating] = useState(false);

    // Función para obtener datos de sensores con valores por defecto
    const getSensorData = (sensorPath, defaultValue = 0) => {
        try {
            const keys = sensorPath.split('.');
            let value = data;
            for (const key of keys) {
                value = value?.[key];
            }
            // Convertir a número si es posible
            const numValue = parseFloat(value);
            return !isNaN(numValue) ? numValue : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    };

    // Función para determinar el color y texto del indicador de modo
    const getModeIndicator = () => {
        switch (activeMode) {
            case 'unitTest':
                return {
                    color: 'bg-green-500',
                    text: '🧪 MODO PRUEBA UNITARIA ACTIVO - DATOS REALES DEL ARDUINO',
                    textColor: 'text-green-100'
                };
            case 'normal':
                return {
                    color: 'bg-blue-500',
                    text: '🚀 MODO DATOS REALES ACTIVO',
                    textColor: 'text-blue-100'
                };
            case 'simulation':
                return {
                    color: 'bg-purple-500',
                    text: '🎮 MODO SIMULACIÓN ACTIVO',
                    textColor: 'text-purple-100'
                };
            default:
                return {
                    color: 'bg-gray-500',
                    text: '⏸️ MODO INACTIVO',
                    textColor: 'text-gray-100'
                };
        }
    };

    // Datos del Arduino basados en el formato real
    const arduinoData = {
        device_id: "KATARI_UNIT_1",
        timestamp: Date.now(),
        
        // GPS - adaptado a datos reales del Arduino
        gps_lat: getSensorData('sensors.NEO6M.readings.location.latitude', 0),
        gps_lng: getSensorData('sensors.NEO6M.readings.location.longitude', 0),
        gps_alt: getSensorData('sensors.NEO6M.readings.location.altitude.value', 0),
        gps_sats: getSensorData('sensors.NEO6M.readings.satellites', 0),        // SCD40 - Calidad del aire (formato Arduino: co2, temp_scd, humidity)
        co2: getSensorData('sensors.SCD40.readings.CO2.value', 400),
        temp_scd: getSensorData('sensors.SCD40.readings.temperature.value', 24.0),
        humidity: getSensorData('sensors.SCD40.readings.humidity.value', 50.0),
        
        // BMP280 - Presión y temperatura (formato Arduino: temp_bmp, pressure, altitude_bmp)
        temp_bmp: getSensorData('sensors.BMP280.readings.temperature.value', 26.0),
        pressure: getSensorData('sensors.BMP280.readings.pressure.value', 829.0),
        altitude_bmp: getSensorData('sensors.BMP280.readings.altitude.value', 1658.0),
        
        // MPU9250 - Acelerómetro y giroscopio (formato Arduino)
        accel_x: getSensorData('sensors.MPU9250.readings.accelerometer.x.value', -0.015),
        accel_y: getSensorData('sensors.MPU9250.readings.accelerometer.y.value', -0.057),
        accel_z: getSensorData('sensors.MPU9250.readings.accelerometer.z.value', -0.978),
        gyro_x: getSensorData('sensors.MPU9250.readings.gyroscope.x.value', 0.0),
        gyro_y: getSensorData('sensors.MPU9250.readings.gyroscope.y.value', -1.77),
        gyro_z: getSensorData('sensors.MPU9250.readings.gyroscope.z.value', -0.18),
        
        // Estados de sensores basados en datos reales
        status_scd40: getSensorData('sensors.SCD40.readings.CO2.value', 0) > 0,
        status_gy91: getSensorData('sensors.BMP280.readings.pressure.value', 0) > 0 || 
                    Math.abs(getSensorData('sensors.MPU9250.readings.accelerometer.z.value', 0)) > 0.1,
        status_gps: getSensorData('sensors.NEO6M.readings.location.latitude', 0) !== 0 || 
                   getSensorData('sensors.NEO6M.readings.location.longitude', 0) !== 0,
        calibrated: getSensorData('sensors.NEO6M.readings.satellites', 0) >= 4
    };

    // Log temporal para debugging GPS
    console.log('📍 ArduinoData GPS:', {
        gps_lat: arduinoData.gps_lat,
        gps_lng: arduinoData.gps_lng,
        gps_alt: arduinoData.gps_alt,
        gps_sats: arduinoData.gps_sats,
        status_gps: arduinoData.status_gps
    });

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

    // Función para determinar el color del estado
    const getStatusColor = (status) => {
        return status ? '#10B981' : '#EF4444'; // Verde si activo, rojo si inactivo
    };

    // Función para determinar el icono del estado
    const getStatusIcon = (status) => {
        return status ? CheckCircle : XCircle;
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Datos en tiempo real - Sistema KATARI' />

            <main className='max-w-7xl mx-auto py-2 px-2 sm:py-4 sm:px-4 lg:px-6'>
                {/* Indicador de Modo Activo */}
                {activeMode && (
                    <motion.div 
                        className={`mb-4 ${getModeIndicator().color} rounded-lg p-4 border-2 border-opacity-50`}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className='flex items-center justify-center'>
                            <div className={`flex items-center ${getModeIndicator().textColor} font-bold text-lg`}>
                                <div className='animate-pulse mr-3 w-3 h-3 bg-white rounded-full'></div>
                                {getModeIndicator().text}
                                <div className='animate-pulse ml-3 w-3 h-3 bg-white rounded-full'></div>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {/* Estado del sistema - compacto */}
                <motion.div 
                    className='mb-6'
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className='bg-gray-800 rounded-lg p-3'>
                        <h3 className='text-sm font-semibold text-gray-200 mb-2 text-center flex items-center justify-center'>
                            <Eye className='w-4 h-4 mr-2 text-blue-400' />
                            Estado de los sensores
                        </h3>
                        <div className='flex items-center justify-center space-x-6 text-sm text-gray-300'>
                            <div className='flex items-center'>
                                {arduinoData.status_scd40 ? <CheckCircle className='w-4 h-4 mr-2 text-green-500' /> : <XCircle className='w-4 h-4 mr-2 text-red-500' />}
                                <span>SCD40</span>
                            </div>
                            <div className='flex items-center'>
                                {arduinoData.status_gy91 ? <CheckCircle className='w-4 h-4 mr-2 text-green-500' /> : <XCircle className='w-4 h-4 mr-2 text-red-500' />}
                                <span>GY91</span>
                            </div>
                            <div className='flex items-center'>
                                {arduinoData.status_gps ? <CheckCircle className='w-4 h-4 mr-2 text-green-500' /> : <XCircle className='w-4 h-4 mr-2 text-red-500' />}
                                <span>{arduinoData.status_gps ? `${arduinoData.gps_sats} sats` : 'GPS'}</span>
                            </div>
                            <div className='flex items-center'>
                                <AlertTriangle className={`w-4 h-4 mr-2 ${arduinoData.calibrated ? 'text-green-500' : 'text-yellow-400'}`} />
                                <span>{arduinoData.calibrated ? 'Calibrado' : 'Calibrando'}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

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
                                    Cohete - Datos de Navegación
                                </h2>
                            </motion.div>
                            
                           
                            {/* Sensores de movimiento */}
                            <motion.div
                                className='mb-6'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            >
                                <h3 className='text-base font-semibold text-gray-300 mb-3 flex items-center'>
                                    <Activity className='w-5 h-5 mr-2 text-green-400' />
                                    Sistema IMU (MPU9250)
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3'>
                                    <StatCard 
                                        name='Aceleración X' 
                                        icon={Zap} 
                                        value={`${safeToFixed(arduinoData.accel_x, 3)} g`} 
                                        color='#EC4899' 
                                    />
                                    <StatCard 
                                        name='Aceleración Y' 
                                        icon={Zap} 
                                        value={`${safeToFixed(arduinoData.accel_y, 3)} g`} 
                                        color='#EC4899' 
                                    />
                                    <StatCard 
                                        name='Aceleración Z' 
                                        icon={Zap} 
                                        value={`${safeToFixed(arduinoData.accel_z, 3)} g`} 
                                        color='#EC4899' 
                                    />
                                    <StatCard 
                                        name='Giroscopio X' 
                                        icon={BarChart2} 
                                        value={`${safeToFixed(arduinoData.gyro_x, 2)} °/s`} 
                                        color='#F59E0B' 
                                    />
                                    <StatCard 
                                        name='Giroscopio Y' 
                                        icon={BarChart2} 
                                        value={`${safeToFixed(arduinoData.gyro_y, 2)} °/s`} 
                                        color='#F59E0B' 
                                    />
                                    <StatCard 
                                        name='Giroscopio Z' 
                                        icon={BarChart2} 
                                        value={`${safeToFixed(arduinoData.gyro_z, 2)} °/s`} 
                                        color='#F59E0B' 
                                    />
                                </div>
                            </motion.div>

                            {/* Sensores barométricos */}
                            <motion.div
                                className='mb-6'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            >
                                <h3 className='text-base font-semibold text-gray-300 mb-3 flex items-center'>
                                    <Gauge className='w-5 h-5 mr-2 text-purple-400' />
                                    Sistema Barométrico (BMP280)
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3'>
                                    <StatCard 
                                        name='Presión Atmosférica' 
                                        icon={Gauge} 
                                        value={`${safeToFixed(arduinoData.pressure, 2)} hPa`} 
                                        color='#3B82F6' 
                                    />
                                    <StatCard 
                                        name='Altitud Barométrica' 
                                        icon={Rocket} 
                                        value={`${safeToFixed(arduinoData.altitude_bmp, 1)} m`} 
                                        color='#6366F1' 
                                    />
                                    <StatCard 
                                        name='Temperatura BMP' 
                                        icon={Thermometer} 
                                        value={`${safeToFixed(arduinoData.temp_bmp, 2)} °C`} 
                                        color='#F97316' 
                                    />
                                    <VerificationCard
                                        title="Verificación de Altitud"
                                        primaryData={{
                                            name: 'GPS',
                                            value: arduinoData.status_gps ? arduinoData.gps_alt : 0,
                                            unit: 'm'
                                        }}
                                        secondaryData={{
                                            name: 'Barométrico',
                                            value: arduinoData.altitude_bmp,
                                            unit: 'm'
                                        }}
                                        threshold={10}
                                        icon={Zap}
                                    />
                                </div>
                            </motion.div>

                            
                        </div>

                        {/* SATELITE */}
                        <div className='mb-8'>
                            {/* <motion.div 
                                className='flex items-center justify-center mb-6'
                                initial={{ y: 20 }} 
                                animate={{ y: 0 }}
                                transition={{ duration: 0.3, ease: 'easeOut' }}
                            >
                                <Satellite className='w-8 h-8 text-purple-500 mr-3' />
                                <h2 className='text-2xl sm:text-3xl font-bold text-white-800'>
                                    Satélite - Monitoreo Ambiental
                                </h2>
                            </motion.div> */}
                            
                            {/* Sensores ambientales SCD40 */}
                            <motion.div
                                className='mb-6'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            >
                                <h3 className='text-base font-semibold text-gray-300 mb-3 flex items-center'>
                                    <Wind className='w-5 h-5 mr-2 text-red-400' />
                                    Calidad del Aire (SCD40)
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3'>
                                    <StatCard 
                                        name='CO2' 
                                        icon={Wind} 
                                        value={arduinoData.status_scd40 ? 
                                            `${arduinoData.co2} ppm` : 
                                            'Sin datos'
                                        } 
                                        color={arduinoData.co2 > 1000 ? '#EF4444' : '#10B981'} 
                                    />
                                    <StatCard 
                                        name='Humedad Relativa' 
                                        icon={CloudHail} 
                                        value={arduinoData.status_scd40 ? 
                                            `${safeToFixed(arduinoData.humidity, 1)} %` : 
                                            'Sin datos'
                                        } 
                                        color='#8B5CF6' 
                                    />
                                    <StatCard 
                                        name='Temperatura SCD40' 
                                        icon={Thermometer} 
                                        value={arduinoData.status_scd40 ? 
                                            `${safeToFixed(arduinoData.temp_scd, 2)} °C` : 
                                            'Sin datos'
                                        } 
                                        color='#F97316' 
                                    />
                                    <VerificationCard
                                        title="Verificación de Temperatura"
                                        primaryData={{
                                            name: 'SCD40',
                                            value: arduinoData.status_scd40 ? arduinoData.temp_scd : 0,
                                            unit: '°C'
                                        }}
                                        secondaryData={{
                                            name: 'BMP280',
                                            value: arduinoData.temp_bmp,
                                            unit: '°C'
                                        }}
                                        threshold={3}
                                        icon={Thermometer}
                                    />
                                </div>
                            </motion.div>
                             {/* Sensores de navegación y posición */}
                            <motion.div
                                className='mb-6'
                                initial={{ y: 20 }}
                                animate={{ y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                            >
                                <h3 className='text-base font-semibold text-gray-300 mb-3 flex items-center'>
                                    <Navigation className='w-5 h-5 mr-2 text-blue-400' />
                                    Sistema de Navegación GPS
                                </h3>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3'>
                                    <div onClick={() => setShowGPSModal(true)} className='cursor-pointer transform hover:scale-105 transition-transform'>
                                        <StatCard 
                                            name='Posición GPS' 
                                            icon={MapPin} 
                                            value={arduinoData.status_gps && 
                                                typeof arduinoData.gps_lat === 'number' && 
                                                typeof arduinoData.gps_lng === 'number' ? 
                                                `${safeToFixed(arduinoData.gps_lat, 6)}, ${safeToFixed(arduinoData.gps_lng, 6)}` : 
                                                'Sin señal GPS'
                                            } 
                                            color={getStatusColor(arduinoData.status_gps)} 
                                        />
                                    </div>
                                    <StatCard 
                                        name='Altitud GPS' 
                                        icon={Rocket} 
                                        value={arduinoData.status_gps ? 
                                            `${safeToFixed(arduinoData.gps_alt, 1)} m` : 
                                            'Sin datos'
                                        } 
                                        color={getStatusColor(arduinoData.status_gps)} 
                                    />
                                    <StatCard 
                                        name='Satélites' 
                                        icon={Satellite} 
                                        value={arduinoData.status_gps ? 
                                            `${arduinoData.gps_sats} sats` : 
                                            'Buscando...'
                                        } 
                                        color={arduinoData.gps_sats >= 4 ? '#10B981' : '#F59E0B'} 
                                    />
                                    <StatCard 
                                        name='Estado Calibración' 
                                        icon={AlertTriangle} 
                                        value={arduinoData.calibrated ? 'Completada' : 'En proceso'} 
                                        color={arduinoData.calibrated ? '#10B981' : '#F59E0B'} 
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
                            className='w-full mb-3 px-2 lg:px-0'
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                        >
                            <div className='bg-gray-800/50 backdrop-blur-sm p-2 rounded w-full'>
                                <Actions onStart={handleStartAll} onStop={handleStopAll} isSimulating={isSimulating} />
                            </div>
                        </motion.div>

                        <motion.div
                            className='flex-1 mt-2 mb-4 flex justify-center h-[520px] sm:h-[640px] lg:h-[760px] xl:h-[880px] w-full relative'
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <SimulationCanSat testMode={activeMode === 'unitTest' ? 'unitTest' : null} />
                        </motion.div>
                    </div>
                </div>
            </main>
            <GPSModal 
                isVisible={showGPSModal} 
                onClose={() => setShowGPSModal(false)} 
                gps={{
                    readings: {
                        location: {
                            latitude: arduinoData.status_gps ? arduinoData.gps_lat : 0,
                            longitude: arduinoData.status_gps ? arduinoData.gps_lng : 0,
                            altitude: {
                                value: arduinoData.status_gps ? arduinoData.gps_alt : 0,
                                unit: 'm'
                            },
                            satellites: arduinoData.gps_sats
                        }
                    }
                }} 
            />
        </div>
    );
};

export default RealTimePage;