import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const ChartModal = ({ isVisible, onClose, title, children }) => {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className='fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						className='bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[70vh] border border-gray-700 flex flex-col'
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.9, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						onClick={(e) => e.stopPropagation()} // Evita que el clic se propague al fondo
					>
						<header className='flex items-center justify-between p-4 border-b border-gray-700'>
							<h2 className='text-xl font-bold text-white'>{title}</h2>
							<motion.button
								className='p-2 rounded-full hover:bg-gray-700 transition-colors'
								onClick={onClose}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
							>
								<X className='w-6 h-6 text-gray-400' />
							</motion.button>
						</header>

						<main className='flex-1 p-6 overflow-y-auto'>
							{children}
						</main>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default ChartModal;