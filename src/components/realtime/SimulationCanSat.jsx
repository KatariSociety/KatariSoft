import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useSensorsData } from "../../context/SensorsData";
import io from 'socket.io-client';  // Importar io directamente

// Aceptar prop testMode para indicar si estamos en prueba unitaria
const RocketModel = ({ testMode }) => {
  const { data } = useSensorsData();  
  const { scene } = useGLTF(import.meta.env.BASE_URL + "images/rocket.glb");
  const rocketRef = useRef();
  const [angle, setAngle] = useState(0);
  const socketRef = useRef(null);
  
  // Estado local para los datos del MPU en modo prueba
  const [localMPUData, setLocalMPUData] = useState({
    gyroX: 0,
    gyroY: 0,
    gyroZ: 0,
    accelX: 0,
    accelY: 0,
    accelZ: 0
  });

  // Conectar directamente a Socket.io cuando estamos en modo prueba unitaria
  useEffect(() => {
    if (testMode === 'unitTest') {
      console.log("🔌 Conectando Socket.io directamente en SimulationCanSat para prueba unitaria");
      
      // IMPORTANTE: Usar un puerto diferente para evitar conflicto con el contexto global
      // O usar una señal para indicar que este componente tiene control exclusivo
      
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      
      socketRef.current = io('http://localhost:3000', {
        query: { 
          clientType: 'unitTest', 
          exclusiveControl: true 
        }
      });
      
      socketRef.current.on('connect', () => {
        console.log("🔌 Socket conectado directamente en componente para prueba unitaria");
        socketRef.current.emit('register_unit_test');  // Evento especial para prueba unitaria
        socketRef.current.emit('connect_arduino', { forceExclusive: true });
      });
      
      socketRef.current.on('mpu_data', (mpuData) => {
        console.log("📊 Datos MPU recibidos en modo prueba unitaria:", 
          mpuData.readings.gyroscope.x.value, 
          mpuData.readings.gyroscope.z.value
        );
        
        // Actualizar estado local con los datos recibidos
        setLocalMPUData({
          gyroX: parseFloat(mpuData.readings.gyroscope.x.value),
          gyroY: parseFloat(mpuData.readings.gyroscope.y.value),
          gyroZ: parseFloat(mpuData.readings.gyroscope.z.value),
          accelX: parseFloat(mpuData.readings.accelerometer.x.value),
          accelY: parseFloat(mpuData.readings.accelerometer.y.value),
          accelZ: parseFloat(mpuData.readings.accelerometer.z.value)
        });
      });
      
      // Manejar errores explícitamente
      socketRef.current.on('error', (error) => {
        console.error("🔴 Error en socket de prueba unitaria:", error);
      });
      
      // Cleanup al cambiar modo o desmontar componente
      return () => {
        if (socketRef.current) {
          console.log("🔌 Desconectando Socket.io en prueba unitaria");
          socketRef.current.emit('release_unit_test');  // Liberar el control exclusivo
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [testMode]);

  // Usar valores locales si estamos en testMode, o valores del contexto si no
  const gyroX = testMode === 'unitTest' ? localMPUData.gyroX : Number(data?.sensors?.MPU9250?.readings?.gyroscope?.x?.value) || 0;
  const gyroY = testMode === 'unitTest' ? localMPUData.gyroY : Number(data?.sensors?.MPU9250?.readings?.gyroscope?.y?.value) || 0;
  const gyroZ = testMode === 'unitTest' ? localMPUData.gyroZ : Number(data?.sensors?.MPU9250?.readings?.gyroscope?.z?.value) || 0;
  const currentAltitude = Number(data?.sensors?.BMP280?.readings?.altitude?.value) || 0;
  
  // Datos adicionales para modo prueba unitaria
  const accelX = testMode === 'unitTest' ? localMPUData.accelX : Number(data?.sensors?.MPU9250?.readings?.accelerometer?.x?.value) || 0;
  const accelY = testMode === 'unitTest' ? localMPUData.accelY : Number(data?.sensors?.MPU9250?.readings?.accelerometer?.y?.value) || 0;
  const accelZ = testMode === 'unitTest' ? localMPUData.accelZ : Number(data?.sensors?.MPU9250?.readings?.accelerometer?.z?.value) || 0;

  // Registro para debug
  useEffect(() => {
    if (testMode === 'unitTest') {
      console.log(`🛰️ SimulationCanSat recibiendo valores - Gyro X: ${gyroX}, Z: ${gyroZ}`);
    }
  }, [gyroX, gyroZ, testMode]);

  useFrame(() => {
    if (rocketRef.current) {
      if (testMode === 'unitTest') {
        // EN MODO PRUEBA UNITARIA:
        const thetaX = THREE.MathUtils.degToRad(gyroX);
        const thetaZ = THREE.MathUtils.degToRad(gyroZ);
        
        // Aplicación más directa con menos suavizado para una respuesta inmediata
        // Usar un factor de suavizado más alto (0.5) para respuesta más rápida
        const directFactor = 0.5;
        
        rocketRef.current.rotation.x = THREE.MathUtils.lerp(
          rocketRef.current.rotation.x, thetaX, directFactor
        );
        
        rocketRef.current.rotation.z = THREE.MathUtils.lerp(
          rocketRef.current.rotation.z, thetaZ, directFactor
        );
        
        // Calcular ángulo de inclinación real sin restricciones
        const inclinationAngle = Math.sqrt(thetaX ** 2 + thetaZ ** 2) * (180 / Math.PI);
        setAngle(inclinationAngle.toFixed(2));
      } else {
        // MODO SIMULACIÓN:
        // Mantener el comportamiento anterior con restricciones para la simulación
        const thetaX = THREE.MathUtils.degToRad(Math.min(Math.max(gyroX, -10), 10));
        const thetaZ = THREE.MathUtils.degToRad(Math.min(Math.max(gyroZ, -10), 10));
        
        const smoothingFactor = 0.1;
        
        rocketRef.current.rotation.x = THREE.MathUtils.lerp(
          rocketRef.current.rotation.x, thetaX, smoothingFactor
        );
        rocketRef.current.rotation.z = THREE.MathUtils.lerp(
          rocketRef.current.rotation.z, thetaZ, smoothingFactor
        );
        
        const inclinationAngle = Math.sqrt(thetaX ** 2 + thetaZ ** 2) * (180 / Math.PI);
        setAngle(inclinationAngle.toFixed(2));
      }
      
      // Mantener posición en origen
      rocketRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <group>
      <primitive ref={rocketRef} object={scene} scale={1.5} />
      
      {/* Mostrar el ángulo y la altura en pantalla */}
      <Html position={[0, 3, 0]} center>
        <div style={{ 
          color: "white", 
          fontSize: "12px", 
          background: testMode === 'unitTest' ? "rgba(16,185,129,0.7)" : "rgba(0,0,0,0.6)", 
          padding: "5px", 
          borderRadius: "5px",
          minWidth: "180px",
          textAlign: "center" 
        }}>
          {testMode === 'unitTest' && (
            <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
              MODO PRUEBA UNITARIA MPU
            </div>
          )}
          Inclinación: {angle}° <br />
          Altura: {currentAltitude} m
          
          {/* Mostrar datos adicionales en modo prueba unitaria */}
          {testMode === 'unitTest' && (
            <div style={{ marginTop: "5px", fontSize: "10px", borderTop: "1px solid rgba(255,255,255,0.3)", paddingTop: "3px" }}>
              Accel: X:{accelX.toFixed(2)} Y:{accelY.toFixed(2)} Z:{accelZ.toFixed(2)}<br/>
              Gyro: X:{gyroX.toFixed(2)} Y:{gyroY.toFixed(2)} Z:{gyroZ.toFixed(2)}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};

// Componente para visualizar los ejes X, Y, Z
const Axes = () => {
  return <axesHelper args={[5]} />;
};

const Scene = ({ testMode }) => {
  return (
    <Canvas 
      camera={{
        position: [0, -7, 15],
        fov: 50
      }}
    >
      {/* Fondo HDR */}
      <Environment files={import.meta.env.BASE_URL + "images/sky.hdr"} background />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.5} color="#CCE6FF" />

      {/* Modelo del cohete con indicador de ángulo y altura */}
      <RocketModel testMode={testMode} />

      {/* Ejes X, Y, Z */}
      <Axes />

      {/* Mantener el eje 0,0,0 en la parte inferior */}
      <OrbitControls 
        target={[0, 3, 0]}
        minDistance={7} 
        maxDistance={12} 
        enablePan={false} 
      />
    </Canvas>
  );
};

export default Scene;