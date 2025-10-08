import { motion } from "framer-motion";
// Header removed from Home page (handled globally in layout)
import { Instagram, Youtube, Rocket, Satellite, Target, Zap } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { FaDonate } from "react-icons/fa";
import { useEffect, useState, useRef } from 'react';

// RocketInstance: un cohete individual que atraviesa el banner dejando pequeñas estrellitas
const RocketInstance = ({ top = 40, delay = 0, duration = 6, drift = 18, scale = 1 }) => {
    const stars = Array.from({ length: 6 });
    // trayectoria diagonal coherente: desde abajo-izquierda hacia arriba-derecha
    const startX = '-35vw';
    const endX = '120vw';
    const startY = `${Math.min(95, top + 30)}vh`; // empieza más abajo
    const endY = `${Math.max(2, top - Math.abs(drift) - 20)}vh`; // termina más arriba

    // offsets para la pequeña órbita circular relativa al cohete
    const orbit = {
        x: [0, 6, 12, 6, 0, -6, -12, -6, 0],
        y: [0, -6, 0, 6, 12, 6, 0, -6, 0]
    };

    // usar transform con translate(...) para asegurar interpolación diagonal en vw/vh
    const startTransform = `translate(${startX}, ${startY}) scale(${scale})`;
    const endTransform = `translate(${endX}, ${endY}) scale(${scale})`;

    return (
        <motion.div
            // empezar visible inmediatamente
            initial={{ transform: startTransform, opacity: 1 }}
            animate={{ transform: [startTransform, endTransform], opacity: [1, 1, 0] }}
            transition={{ delay, duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
            style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}
        >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                {/* cohete con pequeño giro en forma de órbita (animación relativa) */}
                <motion.div style={{ width: 56, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
                    <motion.div
                            animate={{ x: orbit.x, y: orbit.y }}
                            // órbita más lenta para que el giro sea sutil
                            transition={{ duration: Math.max(3.0, duration / 2), repeat: Infinity, ease: 'easeInOut' }}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Rocket size={26} className='drop-shadow-lg' style={{ color: '#C6A8FF' }} />
                    </motion.div>
                </motion.div>

                {/* trail: estrellitas que quedan detrás del cohete (izquierda/abajo) */}
                <div style={{ position: 'absolute', left: -12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8, zIndex: 10 }}>
                    {stars.map((_, i) => (
                        <motion.span
                            key={i}
                            // empezar visibles para no demorar su aparición
                            initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                            // las estrellitas se desplazan hacia la izquierda y ligeramente hacia abajo (quedan atrás)
                            animate={{ opacity: [1, 0], x: [0, -80 - i * 30], y: [0, 40 + i * 10], scale: [1, 0.2] }}
                                transition={{ duration: 2.8 + i * 0.5, delay: Math.max(0, delay) + 0.02 + i * 0.02, repeat: Infinity, repeatType: 'loop', ease: 'easeOut' }}
                            style={{
                                display: 'block',
                                width: 6,
                                height: 6,
                                borderRadius: 6,
                                background: 'white',
                                boxShadow: '0 0 8px rgba(255,255,255,0.95)'
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

// RocketSpawner: genera múltiples cohetes con variaciones para dar efecto de muchos "coheticos"
const RocketSpawner = ({ count = 7 }) => {
    const [items, setItems] = useState([]);
    useEffect(() => {
        const arr = Array.from({ length: count }).map((_, i) => ({
            id: i,
            top: 8 + Math.random() * 70, // porcentaje de altura dentro del banner
                // aparecer casi inmediatamente: delay muy pequeño, con un stagger leve
                delay: Math.random() * 0.3 + i * 0.15,
            // más lentos: duraciones entre ~12s y ~20s
                duration: 18 + Math.random() * 12,
            drift: -6 + Math.random() * 12,
            // cohetes más grandes: escala base entre 1.0 y 1.6
            scale: 1.0 + Math.random() * 0.6
        }));
        setItems(arr);
    }, [count]);

    return (
        <>
            {items.map((r) => (
                <RocketInstance key={r.id} top={r.top} delay={r.delay} duration={r.duration} drift={r.drift} scale={r.scale} />
            ))}
        </>
    );
};

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
            // RocketSpawner: mantiene una cola y asegura que no haya más de 3 cohetes visibles al mismo tiempo.
                ease: "easeOut"
            }
        }
    };

    const bannerTextVariants = {
        hidden: { opacity: 0, y: 18 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, delay: i * 0.15, ease: 'easeOut' }
        })
    };

    return (
        <div className='flex-1 overflow-auto relative z-10'>
            {/* Header oculto en la página principal */}

            {/* Full-bleed banner (se extiende de borde a borde) */}
            <motion.section
                className='relative w-screen left-1/2 right-1/2 -translate-x-1/2 mb-10 overflow-hidden'
                initial='hidden'
                animate='visible'
            >
                {/* Fondo con imagen de Katari */}
                <motion.img
                    src={import.meta.env.BASE_URL + 'images/katari.jpg'}
                    alt='Katari Society banner'
                    className='absolute inset-0 w-full h-full object-cover object-[center_40%]'
                    initial={{ scale: 1.02 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: 'mirror', ease: 'linear' }}
                    loading='lazy'
                />

                {/* Overlay para mejorar contraste */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none'></div>

                {/* Cohetes animados con estela de estrellitas que atraviesan todo el banner */}
                <div className='absolute inset-0 pointer-events-none'>
                    <RocketSpawner count={8} />
                </div>

                {/* Estrellas sutiles (puntos) */}
                <div className='absolute inset-0 pointer-events-none'>
                    <svg className='w-full h-full opacity-40' viewBox='0 0 1200 300' preserveAspectRatio='none'>
                        <g fill='white' opacity='0.06'>
                            <circle cx='60' cy='40' r='1.6' />
                            <circle cx='180' cy='20' r='1.2' />
                            <circle cx='260' cy='80' r='1.4' />
                            <circle cx='420' cy='30' r='1.1' />
                            <circle cx='760' cy='60' r='1.8' />
                            <circle cx='980' cy='45' r='1.3' />
                        </g>
                    </svg>
                </div>

                {/* Orbes decorativas animadas */}
                <motion.div className='absolute -top-16 left-8 w-56 h-56 rounded-full bg-purple-400/30 blur-3xl mix-blend-screen' animate={{ y: [0, -18, 0] }} transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }} />
                <motion.div className='absolute -bottom-20 right-12 w-48 h-48 rounded-full bg-cyan-400/25 blur-2xl mix-blend-screen' animate={{ y: [0, 12, 0] }} transition={{ duration: 9, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }} />

                <div className='relative w-full'>
                    <div className='w-full h-80 md:h-96 lg:h-[560px] flex items-center justify-center'>
                        <div className='max-w-4xl px-6 text-center'>
                            <motion.h1 custom={0} variants={bannerTextVariants} className='text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-white drop-shadow-xl'>
                                <span className='bg-clip-text text-transparent bg-gradient-to-r from-sky-200 via-cyan-100 to-blue-100'>Katari Society</span>
                            </motion.h1>

                            <motion.p custom={1} variants={bannerTextVariants} className='mt-4 text-lg md:text-xl text-gray-100/90 max-w-3xl mx-auto'>Explorando el espacio, innovando desde Latinoamérica.</motion.p>

                            <motion.div custom={2} variants={bannerTextVariants} className='mt-6 flex items-center justify-center gap-3'>
                                <span className='text-xs md:text-sm text-white/90 bg-black/25 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10'>Cohetería · Satélites · Aeroospace</span>
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className='w-full overflow-hidden leading-none mt-2'>
                    <svg className='w-full h-8 md:h-12' viewBox='0 0 1200 120' preserveAspectRatio='none'>
                        <path d='M0,0 C300,100 900,0 1200,80 L1200,120 L0,120 Z' fill='rgba(15,23,42,0.9)' />
                    </svg>
                </div>
            </motion.section>

            <main className='px-6 pb-12 max-w-7xl mx-auto'>

            {/* About Section (Nuestra Misión) ahora con imagen a la derecha */}
            <motion.div
                className='bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-3xl p-6 lg:p-10 mb-12'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
                <div className='flex flex-col lg:flex-row items-center gap-8'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-3 mb-6'>
                            <Target className='w-8 h-8 text-blue-500' />
                            <h2 className='text-3xl font-bold text-white'>Nuestra Misión</h2>
                        </div>
                        <p className='text-gray-300 text-lg leading-relaxed text-justify'>
                            Katari Society es un grupo de investigación dedicado a la exploración y desarrollo de tecnologías aeroespaciales. Conformado por estudiantes y egresados de diversas disciplinas de la Universidad del Cauca, Katari Society tiene como objetivo principal fomentar la investigación en ciencia y tecnología espacial a través de proyectos innovadores. Entre sus iniciativas se encuentra la participación en la competencia{' '}
                            <a
                                href='https://www.lasc.space'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-blue-400 hover:text-blue-300 font-semibold underline decoration-blue-400/50 hover:decoration-blue-300'
                            >
                                Latin American Space Challenge (LASC)
                            </a>{' '}
                            y el{' '}
                            <a
                                href='https://enmice.mx'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='text-purple-400 hover:text-purple-300 font-semibold underline decoration-purple-400/50 hover:decoration-purple-300'
                            >
                                Encuentro Mexicano de Ingeniería en Cohetería Experimental (ENMICE)
                            </a>
                            , donde el grupo se desafía a construir soluciones tecnológicas avanzadas con el objetivo de proteger los recursos naturales. Katari Society representa un proyecto para que jóvenes apasionados por el espacio puedan convertir sus ideas en proyectos reales, acercándose cada vez más al sueño de la exploración espacial.
                        </p>
                    </div>
                    {/* Imagen eliminada para evitar duplicado; la foto principal permanece en el banner */}
                </div>
            </motion.div>

                
                <motion.div
                    className='space-y-8'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    
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
                                        alt='Amaru - Cohete experimental Katari'
                                        className='w-full h-64 md:h-80 lg:h-96 object-contain object-center rounded-2xl shadow-2xl'
                                        loading='lazy'
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>

                    
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
                                        alt='Tapirus - CanSat de Katari'
                                        className='w-full h-64 md:h-80 lg:h-96 object-contain object-center rounded-2xl shadow-2xl'
                                        loading='lazy'
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
