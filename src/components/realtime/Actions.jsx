import { motion } from "framer-motion";

const Actions = ({ onStart, onStop }) => {
    return (
        <motion.div
            className='flex justify-center space-x-2 w-full'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <motion.button
                className='bg-blue-500 text-white py-2 px-4 rounded flex-1'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStart}
            >
                Iniciar
            </motion.button>
            <motion.button
                className='bg-green-500 text-white py-2 px-4 rounded flex-1'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onStop}
            >
                Detener
            </motion.button>
        </motion.div>
    );
};

export default Actions;