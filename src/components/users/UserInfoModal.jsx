import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const UserInfoModal = ({ isVisible, onClose, user }) => {
  if (!user) return null;
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl border border-gray-800 grid grid-cols-1 md:grid-cols-3 overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Left: avatar + basic */}
            <div className="md:col-span-1 bg-gradient-to-br from-indigo-700 to-purple-700 p-6 flex flex-col items-center justify-center gap-4">
              <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {initials}
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                <p className="text-xs text-white/80">{user.email}</p>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold">{user.role}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.status === 'Active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>{user.status}</span>
              </div>
            </div>

            {/* Right: details */}
            <div className="md:col-span-2 p-6 flex flex-col">
              <header className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-sm text-gray-400 mt-1">Detalles del integrante</p>
                </div>
                <motion.button
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6 text-gray-300" />
                </motion.button>
              </header>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div>
                  <h4 className="text-sm text-gray-300 font-semibold mb-2">Bio</h4>
                  <p className="text-gray-300 text-sm">{user.bio}</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-300 font-semibold mb-2">Contacto</h4>
                  <p className="text-gray-300 text-sm mb-1"><strong>Email:</strong> <span className="text-gray-200">{user.email}</span></p>
                  <p className="text-gray-300 text-sm"><strong>Rol:</strong> <span className="text-gray-200">{user.role}</span></p>
                </div>
              </div>

              <footer className="mt-6 flex justify-end">
                <button
                  className="px-4 py-2 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors"
                  onClick={onClose}
                >Cerrar</button>
              </footer>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserInfoModal;
