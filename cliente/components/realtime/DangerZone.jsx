import { motion } from "framer-motion";

const DangerZone = () => {
    return (
        <motion.div
            className='bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-2 border border-red-700 mb-2 text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            
            <p className='text-gray-300 mb-2 text-sm'>Usar en caso de emergencia.</p>
            <button className='bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-200'>
                Eyectar
            </button>
        </motion.div>
    );
};
export default DangerZone;