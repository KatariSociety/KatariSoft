import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { useSensorsData } from "../../context/SensorsData";

const Actions = ({ onStart, onStop, isSimulating }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isArduinoConnected } = useSensorsData();
    const [connectionStatus, setConnectionStatus] = useState("Comprobando...");

    // Mostrar el estado de la conexión para depuración
    useEffect(() => {
        setConnectionStatus(isArduinoConnected 
            ? "Hardware conectado ✓" 
            : "Hardware no conectado ✗");
        console.log("Estado de Hardware en Actions:", isArduinoConnected);
    }, [isArduinoConnected]);

    const handleStartSimulation = () => {
        onStart(false); // Usar datos simulados
        setIsModalOpen(false);
    };
    
    const handleStartUnitTest = () => {
        console.log("🧪 Iniciando prueba unitaria desde Actions.jsx");
        
        // Llamar a la función onStart con modo 'unitTest'
        onStart('unitTest');
        
        // Cerrar el modal
        setIsModalOpen(false);
        
        // Mensaje informativo para el usuario
        console.log("✅ Prueba unitaria iniciada - esperando datos reales del Arduino");
    };

    return (
        <>
            <motion.div
                className="flex justify-center space-x-2 w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <motion.button
                    className={`text-white py-2 px-4 rounded flex-1 shadow-md ${
                        isSimulating 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                    whileHover={{ scale: isSimulating ? 1 : 1.05 }}
                    whileTap={{ scale: isSimulating ? 1 : 0.95 }}
                    onClick={() => !isSimulating && setIsModalOpen(true)}
                    disabled={isSimulating}
                >
                    {isSimulating ? 'Corriendo' : 'Iniciar'}
                </motion.button>
                <motion.button
                    className={`text-white py-2 px-4 rounded flex-1 shadow-md ${
                        !isSimulating 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-500'
                    }`}
                    whileHover={{ scale: !isSimulating ? 1 : 1.05 }}
                    whileTap={{ scale: !isSimulating ? 1 : 0.95 }}
                    onClick={onStop}
                    disabled={!isSimulating}
                >
                    Detener
                </motion.button>
            </motion.div>

            {/* Modal (renderizado en portal para garantizar superposición) */}
            {isModalOpen && typeof document !== 'undefined' && createPortal(
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-700"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                    >
                        <h2 className="text-xl font-semibold text-white mb-4">Selecciona el tipo de inicio</h2>
                        
                        {/* Indicador de estado de Arduino para depuración */}
                        <div className={`mb-3 p-2 text-sm rounded text-center ${
                            isArduinoConnected ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
                        }`}>
                            {connectionStatus}
                        </div>
                        
                        <button className="w-full bg-gray-700 text-gray-400 py-2 px-4 rounded mb-2 cursor-not-allowed" disabled>
                            🚀 Iniciar misión completa (Dispositivos NO detectados)
                        </button>
                        <button
                            className={`w-full ${isArduinoConnected 
                                ? 'bg-green-600 hover:bg-green-500 text-white' 
                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'} 
                                py-2 px-4 rounded mb-2 shadow-md`}
                            onClick={handleStartUnitTest}
                            disabled={!isArduinoConnected}
                        >
                            🛠️ Iniciar prueba unitaria {isArduinoConnected ? '(Conectado)' : '(No conectado)'}
                        </button>
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded mb-4 shadow-md"
                            onClick={handleStartSimulation}
                        >
                            📊 Iniciar utilizando datos simulados
                        </button>
                        <button
                            className="w-full bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded shadow-md"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancelar
                        </button>
                    </motion.div>
                </motion.div>,
                document.body
            )}
        </>
    );
};

export default Actions;