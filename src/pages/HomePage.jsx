import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { Instagram, Youtube, Rocket, Satellite, Target, Zap } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { FaDonate } from "react-icons/fa";

const HomePage = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Katari Society' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                {/* Hero Section */}
                <motion.div
                    className='relative mb-16 overflow-hidden rounded-3xl'
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm'></div>
                    <div className='relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 lg:p-12'>
                        <div className='flex flex-col lg:flex-row items-center gap-8'>
                            <motion.div
                                className='flex-1 space-y-4'
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <div className='flex items-center gap-3 mb-4'>
                                    <Rocket className='w-10 h-10 text-blue-500' />
                                    <h1 className='text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
                                        Katari Society
                                    </h1>
                                </div>
                                <p className='text-lg text-gray-300 leading-relaxed'>
                                    Explorando el espacio, innovando desde Latinoamérica
                                </p>
                                <div className='flex flex-wrap gap-3 pt-4'>
                                    <span className='px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-sm font-medium'>
                                        🚀 Cohetería Experimental
                                    </span>
                                    <span className='px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-sm font-medium'>
                                        🛰️ CanSat
                                    </span>
                                    <span className='px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-full text-green-400 text-sm font-medium'>
                                        📡 Telemetría
                                    </span>
                                </div>
                            </motion.div>
                            <motion.img
                                src={import.meta.env.BASE_URL + 'images/katari_society.jpeg'}
                                alt='Katari Society'
                                className='w-full lg:w-96 h-64 lg:h-80 object-cover rounded-2xl shadow-2xl border border-gray-700/50'
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                                whileHover={{ scale: 1.05 }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* About Section */}
                <motion.div
                    className='bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8 lg:p-10 mb-12'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className='flex items-center gap-3 mb-6'>
                        <Target className='w-8 h-8 text-blue-500' />
                        <h2 className='text-3xl font-bold text-white'>Nuestra Misión</h2>
                    </div>
                    <p className='text-gray-300 text-lg leading-relaxed text-justify'>
                        Katari Society es un grupo de investigación dedicado a la exploración y desarrollo de tecnologías aeroespaciales. Conformado por estudiantes de diversas disciplinas de la Universidad del Cauca y la Universidad del Valle, Katari Society tiene como objetivo principal fomentar la investigación en ciencia y tecnología espacial a través de proyectos innovadores. Entre sus iniciativas se encuentra la participación en la competencia{" "}
                        <a
                            href="https://www.lasc.space"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-semibold underline decoration-blue-400/50 hover:decoration-blue-300"
                        >
                            Latin American Space Challenge (LASC)
                        </a>{" "}
                        y el{" "}
                        <a
                            href="https://enmice.mx"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 font-semibold underline decoration-purple-400/50 hover:decoration-purple-300"
                        >
                            Encuentro Mexicano de Ingeniería en Cohetería Experimental (ENMICE)
                        </a>
                        , donde el grupo se desafía a construir soluciones tecnológicas avanzadas con el objetivo de proteger los recursos naturales. Katari Society representa un proyecto para que jóvenes apasionados por el espacio puedan convertir sus ideas en proyectos reales, acercándose cada vez más al sueño de la exploración espacial.
                    </p>
                </motion.div>

                {/* Projects Section */}
                <motion.div
                    className='space-y-8'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Amaru Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className='relative group'
                    >
                        <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                        <div className='relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden'>
                            <div className='flex flex-col lg:flex-row items-center'>
                                <motion.div
                                    className='lg:w-1/2 p-8 lg:p-12 order-2 lg:order-1'
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.6 }}
                                >
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl'>
                                            <Rocket className='w-6 h-6 text-white' />
                                        </div>
                                        <h2 className='text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent'>
                                            Amaru
                                        </h2>
                                    </div>
                                    <div className='w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6'></div>
                                    <p className='text-gray-300 text-base leading-relaxed text-justify'>
                                        Amaru es el cohete experimental desarrollado por Katari Society. Este cohete es un hito en el proyecto, ya que no solo integra sistemas de propulsión seguros y un diseño aerodinámico eficiente, sino que también incorpora tecnologías de telemetría y recuperación. Su desarrollo implica un proceso riguroso de investigación, simulaciones y pruebas para asegurar su rendimiento en cualquier condición. Amaru tiene como misión alcanzar un apogeo de 1 kilómetro, demostrando la capacidad técnica y organizativa del equipo para desarrollar sistemas aeroespaciales de bajo costo pero alto impacto.
                                    </p>
                                    <div className='flex flex-wrap gap-2 mt-6'>
                                        <span className='px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-xs'>
                                            Propulsión
                                        </span>
                                        <span className='px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-xs'>
                                            Telemetría
                                        </span>
                                        <span className='px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-xs'>
                                            Recuperación
                                        </span>
                                        <span className='px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-xs'>
                                            1 km apogeo
                                        </span>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className='lg:w-1/2 order-1 lg:order-2'
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.7 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img
                                        src={import.meta.env.BASE_URL + 'images/amaru.png'}
                                        alt='Amaru'
                                        className='w-full h-96 object-cover'
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tapirus Card */}
                    <motion.div
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                        className='relative group'
                    >
                        <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                        <div className='relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-3xl overflow-hidden'>
                            <div className='flex flex-col lg:flex-row items-center'>
                                <motion.div
                                    className='lg:w-1/2'
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.8 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img
                                        src={import.meta.env.BASE_URL + 'images/tapirus.png'}
                                        alt='Tapirus'
                                        className='w-full h-96 object-cover'
                                    />
                                </motion.div>
                                <motion.div
                                    className='lg:w-1/2 p-8 lg:p-12'
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.9 }}
                                >
                                    <div className='flex items-center gap-3 mb-4'>
                                        <div className='p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl'>
                                            <Satellite className='w-6 h-6 text-white' />
                                        </div>
                                        <h2 className='text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent'>
                                            Tapirus
                                        </h2>
                                    </div>
                                    <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6'></div>
                                    <p className='text-gray-300 text-base leading-relaxed text-justify'>
                                        Tapirus es el satélite de bajo costo diseñado por Katari Society para llevar a cabo misiones de monitoreo y recolección de datos en altitud. A pesar de su pequeño tamaño, el CanSat está equipado con múltiples sensores que permiten medir variables como temperatura, presión, altitud, humedad, posición geográfica, monóxido de carbono, dióxido de carbono, aceleración y velocidad durante su descenso. Este dispositivo es lanzado a bordo de Amaru, y su misión consiste en transmitir datos en tiempo real gestionado por este software.
                                    </p>
                                    <div className='flex flex-wrap gap-2 mt-6'>
                                        <span className='px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-xs'>
                                            Sensores múltiples
                                        </span>
                                        <span className='px-3 py-1 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-400 text-xs'>
                                            Tiempo real
                                        </span>
                                        <span className='px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 text-xs'>
                                            Bajo costo
                                        </span>
                                        <span className='px-3 py-1 bg-pink-500/20 border border-pink-500/50 rounded-full text-pink-400 text-xs'>
                                            CanSat
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Social Media Section */}
                <motion.div
                    className='mt-12 bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-3xl p-8'
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                >
                    <div className='text-center mb-6'>
                        <h3 className='text-2xl font-bold text-white mb-2'>Síguenos</h3>
                        <p className='text-gray-400'>Mantente al día con nuestros proyectos y avances</p>
                    </div>
                    <div className='flex justify-center items-center gap-6 flex-wrap'>
                        <motion.a
                            href='https://www.instagram.com/katarisociety'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='group'
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className='p-4 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl border border-pink-500/50 group-hover:border-pink-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-pink-500/50'>
                                <Instagram
                                    size={32}
                                    className='text-pink-400 group-hover:text-pink-300 transition-colors'
                                />
                            </div>
                        </motion.a>
                        
                        <motion.a
                            href='https://www.tiktok.com/@katarisociety'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='group'
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className='p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/50 group-hover:border-blue-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/50'>
                                <SiTiktok
                                    size={32}
                                    className='text-blue-400 group-hover:text-blue-300 transition-colors'
                                />
                            </div>
                        </motion.a>
                        
                        <motion.a
                            href='https://www.youtube.com/@KatariSociety'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='group'
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className='p-4 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl border border-red-500/50 group-hover:border-red-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/50'>
                                <Youtube
                                    size={32}
                                    className='text-red-400 group-hover:text-red-300 transition-colors'
                                />
                            </div>
                        </motion.a>
                        
                        <motion.a
                            href='https://vaki.co/es/katari-society'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='group'
                            whileHover={{ scale: 1.2, rotate: -5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className='p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-500/50 group-hover:border-green-400 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/50'>
                                <FaDonate
                                    size={32}
                                    className='text-green-400 group-hover:text-green-300 transition-colors'
                                />
                            </div>
                        </motion.a>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    className='mt-8 text-center'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                >
                    <p className='text-gray-500 text-sm flex items-center justify-center gap-2'>
                        <Zap className='w-4 h-4 text-yellow-500' />
                        Impulsando la exploración espacial desde Latinoamérica
                        <Zap className='w-4 h-4 text-yellow-500' />
                    </p>
                </motion.div>
            </main>
        </div>
    );
};

export default HomePage;
