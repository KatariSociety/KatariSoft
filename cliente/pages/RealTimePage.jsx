import { BarChart2, MapPin, Zap, Rocket, Satellite, Thermometer, CloudHail, Gauge } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import Actions from "../components/realtime/Actions";
import DangerZone from "../components/realtime/DangerZone";
import { useTimer } from "../context/TimerContext";

const RealTimePage = () => {
    const { handleStart, handleStop,} = useTimer();    
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Datos en tiempo real' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <div className='flex'>
                    {/* Contenedor de StatCards */}
                    <div className='pr-4 lg:w-8/12'>
                        {/* COHETE */}
                        <div className='mb-8'>
                            <h2 className='text-2xl font-semibold text-white-800 mb-4 text-center'>Cohete</h2>
                            <motion.div
                                className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <StatCard name='Velocidad' icon={Rocket} value='7,890 km/h' color='#6366F1' />
                                <StatCard name='Altura' icon={Zap} value='435 m' color='#8B5CF6' />
                                <StatCard name='Giroscopio' icon={BarChart2} value='ax ,ay, az' color='#EC4899' />
                                <StatCard name='GPS' icon={MapPin} value='-10102 1354' color='#10B981' />
                            </motion.div>
                        </div>

                        {/* SATELITE */}
                        <div className='mb-8'>
                            <h2 className='text-2xl font-semibold text-white-800 mb-4 text-center'>Satélite</h2>
                            <motion.div
                                className='grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1 }}
                            >
                                <StatCard name='Velocidad' icon={Satellite} value='22,2 km/h' color='#6366F1' />
                                <StatCard name='Altura' icon={BarChart2} value='435 m' color='#8B5CF6' />
                                <StatCard name='GPS' icon={MapPin} value='-10102 1354' color='#10B981' />
                                <StatCard name='Presión' icon={Gauge} value='23' color='#6366F1' />
                                <StatCard name='Temperature' icon={Thermometer} value='20°C' color='#EC4899' />
                                <StatCard name='Humedad' icon={CloudHail} value='12%' color='#8B5CF6' />
                                <StatCard name='CO' icon={Zap} value='12' color='#10B981' />
                                <StatCard name='CO2' icon={Zap} value='18' color='#EC4899' />
                            </motion.div>
							<br /><br />
							<DangerZone />
                        </div>
                    </div>

                    {/* Contenedor de imagen y botones */}
                    <div className='lg:w-4/12 flex flex-col justify-center'>
                        <div className='flex-1 mb-4 flex justify-center'>
                            <img src='../images/vuelo.png' alt='Imagen' className='h-full object-cover' />
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <Actions onStart={handleStart} onStop={handleStop} />                         
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default RealTimePage;