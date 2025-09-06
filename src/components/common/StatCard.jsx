import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow rounded-lg border border-gray-700 flex flex-col items-center justify-center p-2'
            whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)" }}
        >
            <div className='flex items-center justify-center mb-1'>
                <Icon size={18} className='mr-2' style={{ color }} />
                <span className='text-xs font-medium text-gray-400'>{name}</span>
            </div>
            <p className='mt-1 text-lg sm:text-xl font-semibold text-gray-100'>{value}</p>
        </motion.div>
    );
};
export default StatCard;