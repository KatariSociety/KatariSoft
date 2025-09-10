import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const UserInfoModal = ({ isVisible, onClose, user }) => {
  if (!user) return null;
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700 flex flex-col"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={e => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <motion.button
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-6 h-6 text-gray-400" />
              </motion.button>
            </header>
            <main className="flex-1 p-6">
              <p className="text-gray-300 mb-2"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-300 mb-2"><strong>Rol:</strong> {user.role}</p>
              <p className="text-gray-300 mb-2"><strong>Estado:</strong> {user.status}</p>
              <p className="text-gray-300"><strong>Bio:</strong> {user.bio}</p>
            </main>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserInfoModal;
