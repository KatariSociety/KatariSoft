import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

const DangerZone = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <motion.div
                className='bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-2 border border-red-700 mb-2 text-center'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <p className='text-gray-300 mb-2 text-sm'>Usar en caso de emergencia.</p>
                <motion.button 
                    className='bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-200 flex items-center justify-center mx-auto space-x-2'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Eyectar</span>
                </motion.button>
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-red-500 mx-4"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <div className="flex items-center space-x-2 mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                <h2 className="text-xl font-bold text-white">¡Advertencia!</h2>
                            </div>
                            <p className="text-gray-300 mb-6">
                                ¿Estás seguro de que deseas eyectar el satélite? Esta acción puede dañar el satélite y desviar el cohete y podría ser peligroso si no se realiza en el momento adecuado.
                            </p>
                            <div className="flex flex-col space-y-2">
                                <motion.button
                                    className="w-full bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded shadow-md font-semibold"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        // Aquí iría la lógica de eyección
                                        console.log('Satélite eyectado');
                                        setIsModalOpen(false);
                                    }}
                                >
                                    Confirmar Eyección
                                </motion.button>
                                <motion.button
                                    className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded shadow-md"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancelar
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default DangerZone;