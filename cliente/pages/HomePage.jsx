import { motion } from "framer-motion";
import Header from "../components/common/Header";
import { Link } from "lucide-react";

const HomePage = () => {
    return (
        <div className='flex-1 overflow-auto relative z-10'>
            <Header title='Información de Katari' />

            <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
                <div className='space-y-8'>
                    {/* Sección Katari Society */}
                    <motion.div
                        className='flex flex-col items-center space-y-4'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <img src='../images/katari-society.jpeg' alt='Katari Society' className='w-full lg:w-1/2 h-auto object-cover rounded-lg shadow-lg' />
                        <div className='text-gray-300 text-justify'>
                            <h2 className='text-2xl font-semibold mb-4'>Katari Society</h2>
                            <p>
                                Katari Society es un grupo de investigación dedicado a la exploración y desarrollo de tecnologías aeroespaciales. Conformado por estudiantes de diversas disciplinas de la Universidad del Cauca y la universidad del Valle, Katari Society tiene como objetivo principal fomentar la investigación en ciencia y tecnología espacial a través de proyectos innovadores. Entre sus iniciativas se encuentra la participación en la competencia Latin American Space Challenge (LASC), donde el grupo se desafía a construir soluciones tecnológicas avanzadas con el objetivo de proteger los recursos naturales de la Amazonía. Katari society representa una ployecto para que jóvenes apasionados por el espacio puedan convertir sus ideas en proyectos reales, acercándose cada vez más al sueño de la exploración espacial.
                            </p>
                        </div>
                    </motion.div>

                    {/* Sección 1 */}
                    <motion.div
                        className='flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-8'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <img src='../images/katari-x.jpg' alt='Katari X' className='w-full lg:w-1/3 h-auto object-cover rounded-lg shadow-lg' />
                        <div className='text-gray-300 text-justify'>
                            <h2 className='text-2xl font-semibold mb-4'>Katari X</h2>
                            <p>
                            Katari X es el cohete experimental desarrollado por Katari Society. Este cohete es un hito en el proyecto, ya que no solo integra sistemas de propulsión seguro y un diseño aeródinámico eficientes, sino que también incorpora tecnologías de telemetría y recuperación. Su desarrollo implica un proceso riguroso de investigación, simulaciones y pruebas para asegurar su rendimiento en cualquier condición. Katari X tiene como misión alcanzar un apogeo de 500 metros, demostrando la capacidad técnica y organizativa del equipo para desarrollar sistemas aeroespaciales de bajo costo pero alto impacto. El cohete simboliza el esfuerzo conjunto de un grupo que sueña con expandir los límites de la tecnología espacial en Latinoamérica.
                            </p>
                        </div>
                    </motion.div>
                    

                    {/* Sección 2 */}
                    <motion.div
                        className='flex flex-col lg:flex-row items-center lg:items-start space-y-4 lg:space-y-0 lg:space-x-8'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        
                        <div className='text-gray-300 text-justify'>
                            <h2 className='text-2xl font-semibold mb-4'>xxxx</h2>
                            <p>
                            El xxxx es el satélite de bajo costo diseñado por Katari Society para llevar a cabo misiones de monitoreo y recolección de datos en altitud. A pesar de su pequeño tamaño, el CanSat está equipado con múltiples sensores que permiten medir variables como temperatura, presión, altitud, humedad, posición geográfica, monóxido de carbono, dióxido de carbono, aceleración y velocidad durante su descenso. Este dispositivo es lanzado a bordo de Katari X, y su misión consiste en transmitir datos en tiempo real gestionado por este software. El desarrollo de este satélite es un reto multidisciplinario que permite realizar una demostración del compromiso del equipo con la investigación y el avance de la tecnología espacial accesible para todos.
                            </p>
                        </div>
                        <img src='../images/katari-x.jpg' alt='Katari cansat' className='w-full lg:w-1/3 h-auto object-cover rounded-lg shadow-lg' />
                    </motion.div>

                    {/* Sección de Redes Sociales */}
                    <div className='flex justify-center space-x-4 mt-8'>
                        <a href='https://www.Link.com' target='_blank' rel='noopener noreferrer'>
                            <Link size={24} className='text-gray-300 hover:text-blue-500 transition-colors' />
                        </a>
                        <a href='https://www.Link.com' target='_blank' rel='noopener noreferrer'>
                            <Link size={24} className='text-gray-300 hover:text-blue-400 transition-colors' />
                        </a>
                        <a href='https://www.Link.com' target='_blank' rel='noopener noreferrer'>
                            <Link size={24} className='text-gray-300 hover:text-pink-500 transition-colors' />
                        </a>
                        <a href='https://www.link.com' target='_blank' rel='noopener noreferrer'>
                            <Link size={24} className='text-gray-300 hover:text-blue-700 transition-colors' />
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;