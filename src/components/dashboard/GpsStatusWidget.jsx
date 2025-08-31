import React from 'react';
import { Satellite, Signal, AlertCircle, CheckCircle } from 'lucide-react';

const GpsStatusWidget = ({ gpsData, calibrationStatus }) => {
  const { satellites, hdop } = gpsData || {};
  
  // Función para determinar la calidad de la señal GPS
  const getSignalQuality = (satellites, hdop) => {
    if (!satellites || satellites === 0) return { level: 'none', text: 'Sin señal', color: 'text-red-400' };
    
    if (satellites >= 8 && hdop < 1.0) return { level: 'excellent', text: 'Excelente', color: 'text-green-400' };
    if (satellites >= 6 && hdop < 2.0) return { level: 'good', text: 'Buena', color: 'text-blue-400' };
    if (satellites >= 4 && hdop < 3.0) return { level: 'fair', text: 'Regular', color: 'text-yellow-400' };
    if (satellites >= 3 && hdop < 5.0) return { level: 'poor', text: 'Baja', color: 'text-orange-400' };
    return { level: 'very-poor', text: 'Muy baja', color: 'text-red-400' };
  };
  
  // Función para obtener el color del indicador de calidad
  const getQualityColor = (level) => {
    switch (level) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'fair': return 'bg-yellow-500';
      case 'poor': return 'bg-orange-500';
      case 'very-poor': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  const signalQuality = getSignalQuality(satellites, hdop);
  
  return (
    <div className="bg-gray-800 bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Satellite className="w-5 h-5 text-blue-400" />
          <h4 className="text-sm font-semibold text-white">Estado GPS</h4>
        </div>
        
        {/* Indicador de calibración */}
        <div className="flex items-center space-x-1">
          {calibrationStatus ? (
            <CheckCircle className="w-4 h-4 text-green-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-400" />
          )}
          <span className={`text-xs ${calibrationStatus ? 'text-green-400' : 'text-yellow-400'}`}>
            {calibrationStatus ? 'Calibrado' : 'Calibrando...'}
          </span>
        </div>
      </div>
      
      {/* Métricas principales */}
      <div className="space-y-3">
        {/* Número de satélites */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Signal className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-300">Satélites</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${satellites && satellites > 0 ? 'text-blue-400' : 'text-red-400'}`}>
              {satellites || 0}
            </span>
            <span className="text-xs text-gray-400">conectados</span>
          </div>
        </div>
        
        {/* HDOP */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300">Precisión (HDOP)</span>
          <div className="flex items-center space-x-2">
            <span className={`text-lg font-bold ${
              hdop && hdop < 1.0 ? 'text-green-400' : 
              hdop && hdop < 2.0 ? 'text-blue-400' : 
              hdop && hdop < 3.0 ? 'text-yellow-400' : 
              hdop && hdop < 5.0 ? 'text-orange-400' : 'text-red-400'
            }`}>
              {hdop ? hdop.toFixed(2) : 'N/A'}
            </span>
            <span className="text-xs text-gray-400">m</span>
          </div>
        </div>
        
        {/* Indicador de calidad visual */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300">Calidad de señal</span>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getQualityColor(signalQuality.level)}`}></div>
            <span className={`text-xs font-medium ${signalQuality.color}`}>
              {signalQuality.text}
            </span>
          </div>
        </div>
      </div>
      
      {/* Barra de progreso de calidad */}
      <div className="mt-3">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              signalQuality.level === 'excellent' ? 'bg-green-500' :
              signalQuality.level === 'good' ? 'bg-blue-500' :
              signalQuality.level === 'fair' ? 'bg-yellow-500' :
              signalQuality.level === 'poor' ? 'bg-orange-500' :
              signalQuality.level === 'very-poor' ? 'bg-red-500' : 'bg-gray-500'
            }`}
            style={{
              width: signalQuality.level === 'excellent' ? '100%' :
                     signalQuality.level === 'good' ? '80%' :
                     signalQuality.level === 'fair' ? '60%' :
                     signalQuality.level === 'poor' ? '40%' :
                     signalQuality.level === 'very-poor' ? '20%' : '0%'
            }}
          ></div>
        </div>
      </div>
      
      {/* Información adicional */}
      <div className="mt-3 pt-3 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          {satellites && satellites > 0 ? (
            <span>GPS activo - {satellites} satélites disponibles</span>
          ) : (
            <span className="text-red-400">Esperando señal GPS...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default GpsStatusWidget;
