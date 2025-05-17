import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useSensorsData } from "../../context/SensorsData";
import io from 'socket.io-client';  // Importar io directamente

// Aceptar prop testMode para indicar si estamos en prueba unitaria
const RocketModel = ({ testMode }) => {
  const { data, activeMode } = useSensorsData();  
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
      console.log("🧪 SimulationCanSat: Activando conexión directa para prueba unitaria");
      
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      
      // Conexión exclusiva para prueba unitaria
      socketRef.current = io('http://localhost:3000', {
        query: { 
          clientType: 'unitTest', 
          exclusiveControl: true 
        }
      });
      
      socketRef.current.on('connect', () => {
        console.log("🔌 Socket conectado directamente para prueba unitaria");

        // Solicitar conexión explícita al Arduino
        socketRef.current.emit('connect_arduino', { forceExclusive: true });
      });
      
      // Recibir datos del MPU directamente desde el servidor

      socketRef.current.on('mpu_data', (mpuData) => {
        try {
          // Parsear los datos si vienen como string
          let parsedData = mpuData;
          if (typeof mpuData === 'string') {
            try {
              parsedData = JSON.parse(mpuData);
              console.log("Datos JSON parseados correctamente");
            } catch (parseError) {
              console.error("Error parseando datos JSON:", parseError);
            }
          }
          
          // Imprime los datos recibidos para depuración
          console.log("%c 📊 DATOS MPU RECIBIDOS EN SIMULATIONCANSAT", 
            "background-color: #10b981; color: white; padding: 4px 8px; border-radius: 4px;"
          );
          console.log(parsedData);
          
          // Verificación del objeto ya parseado
          if (!parsedData || typeof parsedData !== 'object') {
            throw new Error('Formato de datos incorrecto - no es un objeto');
          }
          
          // Extraer y parsear valores con manejo seguro de valores nulos/undefined
          const gyroX = parseFloat(parsedData.gyroscope?.x?.value || 0);
          const gyroY = parseFloat(parsedData.gyroscope?.y?.value || 0);
          const gyroZ = parseFloat(parsedData.gyroscope?.z?.value || 0);
          const accelX = parseFloat(parsedData.accelerometer?.x?.value || 0);
          const accelY = parseFloat(parsedData.accelerometer?.y?.value || 0);
          const accelZ = parseFloat(parsedData.accelerometer?.z?.value || 0);
          
          // Actualizar estado local con los datos recibidos
          setLocalMPUData({
            gyroX: isNaN(gyroX) ? 0 : gyroX,
            gyroY: isNaN(gyroY) ? 0 : gyroY,
            gyroZ: isNaN(gyroZ) ? 0 : gyroZ,
            accelX: isNaN(accelX) ? 0 : accelX,
            accelY: isNaN(accelY) ? 0 : accelY,
            accelZ: isNaN(accelZ) ? 0 : accelZ
          });
          
          // Mostrar valores procesados
          console.log("Valores MPU procesados:", {
            gyroscope: { x: gyroX, y: gyroY, z: gyroZ },
            accelerometer: { x: accelX, y: accelY, z: accelZ }
          });
        } catch (error) {
          console.error("Error procesando datos MPU:", error, mpuData);
        }
      });
      
      // Manejar errores explícitamente
      socketRef.current.on('error', (error) => {
        console.error("🔴 Error en socket de prueba unitaria:", error);
      });
      
      // Cleanup
      return () => {
        if (socketRef.current) {
          console.log("🧹 Limpieza: Desconectando socket de prueba unitaria");
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

  // Registro para debug cuando los valores cambian
  useEffect(() => {
    if (testMode === 'unitTest') {
      console.log(`🛰️ Actualizando visualización con Gyro X: ${gyroX.toFixed(2)}, Z: ${gyroZ.toFixed(2)}`);
    }
  }, [gyroX, gyroZ, testMode]);

  useFrame(() => {
    if (rocketRef.current) {
      if (testMode === 'unitTest') {
        // MODO PRUEBA UNITARIA: Sin restricciones en los ángulos
        const thetaX = THREE.MathUtils.degToRad(gyroX);
        const thetaZ = THREE.MathUtils.degToRad(gyroZ);
        
        // Factor de respuesta más rápido para prueba unitaria
        const directFactor = 0.5;
        
        rocketRef.current.rotation.x = THREE.MathUtils.lerp(
          rocketRef.current.rotation.x, thetaX, directFactor
        );
        
        rocketRef.current.rotation.z = THREE.MathUtils.lerp(
          rocketRef.current.rotation.z, thetaZ, directFactor
        );
        
        // Calcular ángulo de inclinación
        const inclinationAngle = Math.sqrt(thetaX ** 2 + thetaZ ** 2) * (180 / Math.PI);
        setAngle(inclinationAngle.toFixed(2));
      } else {
        // MODO SIMULACIÓN: Con restricciones de ángulos
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

// Resto del código igual...

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