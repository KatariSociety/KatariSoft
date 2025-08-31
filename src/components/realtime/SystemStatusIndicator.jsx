import React from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SystemStatusIndicator = ({ calibrationStatus }) => {
    return (
        <motion.div
            className='mb-6 p-4 rounded-xl border-2 backdrop-blur-sm'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
                borderColor: calibrationStatus ? '#10B981' : '#F59E0B',
                backgroundColor: calibrationStatus ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)'
            }}
        >
            <div className='flex items-center justify-center space-x-3'>
                <motion.div
                    animate={calibrationStatus ? {} : { rotate: 360 }}
                    transition={calibrationStatus ? {} : { duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                    {calibrationStatus ? (
                        <CheckCircle className='w-6 h-6 text-green-400' />
                    ) : (
                        <Loader2 className='w-6 h-6 text-yellow-400' />
                    )}
                </motion.div>
                
                <div className='text-center'>
                    <h3 className={`text-lg font-semibold ${
                        calibrationStatus ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                        {calibrationStatus ? 'Sistema Listo y Calibrado' : 'Calibrando GPS...'}
                    </h3>
                    <p className={`text-sm ${
                        calibrationStatus ? 'text-green-300' : 'text-yellow-300'
                    }`}>
                        {calibrationStatus 
                            ? 'Todos los sensores están operativos y calibrados'
                            : 'Esperando estabilización del GPS para mayor precisión'
                        }
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default SystemStatusIndicator;
