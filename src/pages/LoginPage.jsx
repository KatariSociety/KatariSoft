import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LogIn } from "lucide-react";
import Alert from "../components/common/Alert";
import ResetPasswordModal from "../components/Login/ResetPasswordModal";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    
    const [showLoginError, setShowLoginError] = useState(false);
    const [showPasswordReset, setShowPasswordReset] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulamos una validación que toma tiempo
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (formData.email !== 'admin@katari.com' || formData.password !== 'admin123') {
            setIsLoading(false);
            setShowLoginError(true);
            return;
        }

        setIsLoading(false);
        // Aquí iría la lógica de autenticación exitosa
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        setShowResetModal(true);
    };
    const handleResetSubmit = (email) => {
        setShowResetModal(false);
        setShowPasswordReset(true);
        setFormData(prev => ({ ...prev, email }));
    };

    return (
        <div className="flex-1 overflow-auto relative z-10 flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-md bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-8 border border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-center mb-8">
                    <LogIn className="text-blue-500 w-8 h-8 mr-2" />
                    <h2 className="text-2xl font-bold text-white">Iniciar Sesión</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ejemplo@katari.com"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LogIn className="w-5 h-5" />
                        <span>Iniciar Sesión</span>
                    </motion.button>

                    <div className="text-center text-sm text-gray-400">
                        <button 
                            onClick={handleForgotPassword}
                            className="hover:text-blue-500"
                        >
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                </form>
                {/* Loading Overlay */}
                <AnimatePresence>
                {isLoading && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="relative"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div 
                                    className="w-14 h-14 border-4 border-blue-300 border-t-transparent rounded-full animate-spin-reverse" 
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            </motion.div>
            {/* Alert para error de login */}
            <Alert 
                title="Error de autenticación"
                message="El correo electrónico o la contraseña son incorrectos"
                isVisible={showLoginError}
                onClose={() => setShowLoginError(false)}
            />
            <ResetPasswordModal 
                isVisible={showResetModal}
                onClose={() => setShowResetModal(false)}
                onSubmit={handleResetSubmit}
            />

            {/* Alert para reseteo de contraseña */}
            <Alert 
                title="Recuperación de contraseña"
                message={`Se ha enviado un enlace de recuperación a ${formData.email}`}
                isVisible={showPasswordReset}
                onClose={() => setShowPasswordReset(false)}
            />
            
        </div>
    );
};

export default LoginPage;