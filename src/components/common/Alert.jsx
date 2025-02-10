import { X } from "lucide-react";

const Alert = ({ title, message, isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={onClose}
            />
            
            {/* Centered Modal */}
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 text-white px-8 py-6 rounded-lg shadow-lg z-50 min-w-[300px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <p className="mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition-colors"
                >
                    Cerrar
                </button>
            </div>
        </>
    );
};

export default Alert;