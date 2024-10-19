import { motion } from "framer-motion";

const StatCard = ({ name, icon: Icon, value, color }) => {
    return (
        <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-gray-700 flex justify-center items-center'
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        >
            <div className='px-2 py-3 sm:px-3 sm:py-4 text-center'>
                <span className='flex items-center justify-center text-xs font-medium text-gray-400'>
                    <Icon size={16} className='mr-1' style={{ color }} />
                    {name}
                </span>
                <p className='mt-1 text-xl font-semibold text-gray-100'>{value}</p>
            </div>
        </motion.div>
    );
};
export default StatCard;