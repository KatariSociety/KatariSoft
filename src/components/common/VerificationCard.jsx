import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const VerificationCard = ({ title, primaryData, secondaryData, threshold, icon: Icon }) => {
    // Calcular la diferencia absoluta entre los dos sensores
    const delta = Math.abs(primaryData.value - secondaryData.value);
    
    // Determinar el estado de verificación basado en el threshold
    const getVerificationStatus = () => {
        if (delta <= threshold) return 'success';
        if (delta <= threshold * 2) return 'warning';
        return 'error';
    };
    
    const status = getVerificationStatus();
    
    // Configuración de colores y iconos según el estado
    const statusConfig = {
        success: {
            color: 'text-green-400',
            borderColor: 'border-green-500',
            bgColor: 'bg-green-900/20',
            icon: CheckCircle,
            iconColor: 'text-green-400'
        },
        warning: {
            color: 'text-yellow-400',
            borderColor: 'border-yellow-500',
            bgColor: 'bg-yellow-900/20',
            icon: AlertTriangle,
            iconColor: 'text-yellow-400'
        },
        error: {
            color: 'text-red-400',
            borderColor: 'border-red-500',
            bgColor: 'bg-red-900/20',
            icon: XCircle,
            iconColor: 'text-red-400'
        }
    };
    
    const config = statusConfig[status];
    const StatusIcon = config.icon;
    
    return (
        <motion.div
            className={`p-4 rounded-xl border-2 ${config.bgColor} ${config.borderColor} backdrop-blur-sm`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            whileHover={{ scale: 1.02 }}
        >
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center space-x-2'>
                    {Icon && <Icon className='w-5 h-5 text-gray-300' />}
                    <h3 className='text-sm font-semibold text-gray-200'>{title}</h3>
                </div>
                <StatusIcon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            
            <div className='grid grid-cols-2 gap-3 mb-3'>
                <div className='text-center'>
                    <p className='text-xs text-gray-400 mb-1'>{primaryData.name}</p>
                    <p className={`text-lg font-bold ${config.color}`}>
                        {primaryData.value} {primaryData.unit}
                    </p>
                </div>
                <div className='text-center'>
                    <p className='text-xs text-gray-400 mb-1'>{secondaryData.name}</p>
                    <p className={`text-lg font-bold ${config.color}`}>
                        {secondaryData.value} {secondaryData.unit}
                    </p>
                </div>
            </div>
            
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                    <span className='text-xs text-gray-400'>Diferencia:</span>
                    <span className={`text-sm font-semibold ${config.color}`}>
                        Δ {delta.toFixed(2)} {primaryData.unit}
                    </span>
                </div>
                <div className='text-xs text-gray-500'>
                    Threshold: {threshold} {primaryData.unit}
                </div>
            </div>
            
            {status !== 'success' && (
                <motion.div
                    className={`mt-3 p-2 rounded-lg ${config.bgColor} border ${config.borderColor}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                >
                    <p className={`text-xs ${config.color} text-center`}>
                        {status === 'warning' 
                            ? '⚠️ Diferencia moderada - Verificar calibración'
                            : '🚨 Diferencia crítica - Revisar sensores'
                        }
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default VerificationCard;
