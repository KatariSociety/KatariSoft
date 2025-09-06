import { useState } from "react";
import SettingSection from "./SettingSection";
import { Activity } from "lucide-react";
import { useSensorsData } from "../../context/SensorsData";

const TestType = () => {
  const [test, setTest] = useState(false);
  const { startGeneratingData, startRealTimeMode, stopGeneratingData, isArduinoConnected, activeMode } = useSensorsData();

  const handleTestChange = () => {
    const newTest = !test;
    setTest(newTest);
    
    if (newTest) {
      console.log("🧪 Iniciando prueba unitaria desde settings");
      startGeneratingData('unitTest');
    } else {
      console.log("⏹️ Deteniendo prueba desde settings");
      stopGeneratingData();
    }
  };

  const handleRealTimeMode = () => {
    console.log("🚀 Iniciando modo tiempo real desde settings");
    startRealTimeMode();
  };

  const handleSimulationMode = () => {
    console.log("🎮 Iniciando modo simulación desde settings");
    startGeneratingData(false);
  };

  return (
    <SettingSection icon={Activity} title={"Configuración de prueba"}>
      <div className="space-y-4">
        {/* Estado de conexión del Arduino */}
        <div className="flex items-center justify-between w-full">
          <span className="text-white">Estado del Arduino:</span>
          <span className={`px-3 py-1 rounded text-sm font-medium ${
            isArduinoConnected ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}>
            {isArduinoConnected ? "Conectado" : "Desconectado"}
          </span>
        </div>

        {/* Modo activo */}
        <div className="flex items-center justify-between w-full">
          <span className="text-white">Modo activo:</span>
          <span className="text-gray-300 text-sm">
            {activeMode === 'unitTest' && "🧪 Prueba Unitaria"}
            {activeMode === 'realtime' && "🚀 Tiempo Real"}
            {activeMode === 'simulation' && "🎮 Simulación"}
            {activeMode === 'normal' && "📊 Normal"}
            {!activeMode && "⏹️ Detenido"}
          </span>
        </div>

        {/* Prueba unitaria toggle */}
        <div className="flex items-center justify-between w-full">
          <span className="text-white">Prueba unitaria</span>
          <button
            className={`px-3 py-1 rounded ${
              test ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            } transition duration-200`}
            onClick={handleTestChange}
          >
            {test ? "Detener prueba" : "Iniciar prueba unitaria"}
          </button>
        </div>

        {/* Botones de modo */}
        <div className="flex items-center justify-between w-full">
          <span className="text-white">Modo de datos:</span>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded text-sm transition duration-200 ${
                activeMode === 'realtime' 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-purple-600 hover:bg-purple-700"
              } ${!isArduinoConnected ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleRealTimeMode}
              disabled={!isArduinoConnected}
              title={!isArduinoConnected ? "Arduino no conectado" : "Usar datos reales del Arduino"}
            >
              🚀 Tiempo Real
            </button>
            <button
              className={`px-3 py-1 rounded text-sm transition duration-200 ${
                activeMode === 'simulation' 
                  ? "bg-green-600 hover:bg-green-700" 
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
              onClick={handleSimulationMode}
            >
              🎮 Simulación
            </button>
            <button
              className="px-3 py-1 rounded text-sm bg-red-600 hover:bg-red-700 transition duration-200"
              onClick={stopGeneratingData}
            >
              ⏹️ Detener
            </button>
          </div>
        </div>
      </div>
    </SettingSection>
  );
};

export default TestType;
