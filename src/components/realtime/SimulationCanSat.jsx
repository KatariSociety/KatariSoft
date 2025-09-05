import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useSensorsData } from "../../context/SensorsData";

// Aceptar prop testMode para indicar si estamos en prueba unitaria
const RocketModel = ({ testMode }) => {
  const { data, activeMode } = useSensorsData();  
  const { scene } = useGLTF(import.meta.env.BASE_URL + "images/rocket.glb");
  const rocketRef = useRef();
  const [angle, setAngle] = useState(0);
  const [predictedPath, setPredictedPath] = useState([]);

  // Usar datos del contexto directamente - el contexto ya maneja la conexión
  const gyroX = Number(data?.sensors?.MPU9250?.readings?.gyroscope?.x?.value) || 0;
  const gyroY = Number(data?.sensors?.MPU9250?.readings?.gyroscope?.y?.value) || 0;
  const gyroZ = Number(data?.sensors?.MPU9250?.readings?.gyroscope?.z?.value) || 0;
  const currentAltitude = Number(data?.sensors?.BMP280?.readings?.altitude?.value) || 0;
  
  // Datos del acelerómetro del contexto
  const accelX = Number(data?.sensors?.MPU9250?.readings?.accelerometer?.x?.value) || 0;
  const accelY = Number(data?.sensors?.MPU9250?.readings?.accelerometer?.y?.value) || 0;
  const accelZ = Number(data?.sensors?.MPU9250?.readings?.accelerometer?.z?.value) || 0;

  // Función para predecir trayectoria balística
  const calculatePredictedPath = () => {
    const timeSteps = 30; // Predicción para 3 segundos (30 frames a 10fps)
    const timeStep = 0.1; // 100ms por paso
    
    const path = [];
    let currentX = 0;
    let currentY = 0;
    let currentZ = 0;
    let currentVX = accelX * 9.81; // Convertir aceleración a velocidad (m/s)
    let currentVY = accelY * 9.81;
    let currentVZ = accelZ * 9.81;
    
    for (let i = 0; i < timeSteps; i++) {
      path.push({
        x: currentX,
        y: currentY,
        z: currentZ,
        time: i * timeStep
      });
      
      // Actualizar posición usando ecuaciones de movimiento
      currentX += currentVX * timeStep;
      currentY += currentVY * timeStep;
      currentZ += currentVZ * timeStep;
      
      // Aplicar gravedad y resistencia del aire
      currentVY -= 9.81 * timeStep; // Gravedad
      currentVX *= 0.99; // Resistencia del aire (simplificado)
      currentVZ *= 0.99;
    }
    
    return path;
  };

  // Registro para debug cuando los valores cambian - mejorado
  useEffect(() => {
    if (testMode === 'unitTest' || activeMode === 'unitTest') {
      console.log(`� SIMULATIONCANSAT - Datos IMU recibidos:`, {
        accel: { x: accelX.toFixed(3), y: accelY.toFixed(3), z: accelZ.toFixed(3) },
        gyro: { x: gyroX.toFixed(2), y: gyroY.toFixed(2), z: gyroZ.toFixed(2) },
        mode: { testMode, activeMode }
      });
    }
  }, [accelX, accelY, accelZ, gyroX, gyroY, gyroZ, testMode, activeMode]);

  // Actualizar trayectoria predicha cuando cambien los datos de aceleración
  useEffect(() => {
    const newPath = calculatePredictedPath();
    setPredictedPath(newPath);
  }, [accelX, accelY, accelZ]);

  useFrame(() => {
    if (rocketRef.current) {
      if (testMode === 'unitTest' || activeMode === 'unitTest') {
        // MODO PRUEBA UNITARIA: Usar acelerómetro para inclinación real
        
        // Calcular ángulos de inclinación a partir del acelerómetro
        // Esta fórmula convierte lecturas de acelerómetro a ángulos de inclinación
        const accelXg = accelX;  // Se asume que viene en unidades g
        const accelYg = accelY;
        const accelZg = accelZ;
        
        // Solo aplicar rotación si tenemos datos válidos del acelerómetro
        if (Math.abs(accelXg) > 0.01 || Math.abs(accelYg) > 0.01 || Math.abs(accelZg) > 0.01) {
          // Calcular ángulos usando arcotangente (atan2) - CORREGIDO para sensor invertido
          // Invertir completamente la orientación cambiando los signos de los datos
          const invertedAccelX = -accelXg;
          const invertedAccelY = -accelYg;
          const invertedAccelZ = -accelZg;
          
          // Para rotación en X (pitch) - alrededor del eje X
          const pitchRad = Math.atan2(invertedAccelY, Math.sqrt(invertedAccelX * invertedAccelX + invertedAccelZ * invertedAccelZ));
          // Para rotación en Z (roll) - alrededor del eje Z
          const rollRad = Math.atan2(-invertedAccelX, invertedAccelZ);
          
          // Aplicar directamente al modelo
          rocketRef.current.rotation.x = pitchRad;
          rocketRef.current.rotation.z = rollRad;
          
          // Convertir a grados para mostrar
          const pitchDeg = pitchRad * (180 / Math.PI);
          const rollDeg = rollRad * (180 / Math.PI);
          
          // Calcular ángulo total de inclinación
          const inclinationAngle = Math.sqrt(pitchDeg * pitchDeg + rollDeg * rollDeg);
          setAngle(inclinationAngle.toFixed(2));
          
          // Mostrar valores por consola para debug (reducir frecuencia)
          if (Math.random() < 0.1) { // Solo 10% de las veces para no saturar console
            console.log(`📐 Sensor invertido - Original: X:${accelXg.toFixed(2)} Y:${accelYg.toFixed(2)} Z:${accelZg.toFixed(2)}`);
            console.log(`📐 Invertido: X:${invertedAccelX.toFixed(2)} Y:${invertedAccelY.toFixed(2)} Z:${invertedAccelZ.toFixed(2)}`);
            console.log(`📐 Ángulos - Pitch: ${pitchDeg.toFixed(2)}°, Roll: ${rollDeg.toFixed(2)}°, Total: ${inclinationAngle.toFixed(2)}°`);
          }
        }
      } else {
        // MODO SIMULACIÓN: Con restricciones de ángulos (sin cambios)
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
      
      {/* Trayectoria predicha */}
      {predictedPath.length > 0 && (
        <group>
          {/* Línea punteada para la trayectoria */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={predictedPath.length}
                array={new Float32Array(predictedPath.flatMap(point => [point.x, point.y, point.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#00ff00" linewidth={2} transparent opacity={0.6} />
          </line>
          
          {/* Puntos semitransparentes en la trayectoria */}
          {predictedPath.map((point, index) => (
            <mesh key={index} position={[point.x, point.y, point.z]}>
              <sphereGeometry args={[0.05, 8, 6]} />
              <meshBasicMaterial color="#00ff00" transparent opacity={0.3} />
            </mesh>
          ))}
        </group>
      )}
      
  {/* Info 3D removida; ahora la UI overlay se renderiza en 2D (Scene) para no tapar el cohete */}
    </group>
  );
};

// Componente para visualizar los ejes X, Y, Z
const Axes = () => {
  return <axesHelper args={[5]} />;
};

const Scene = ({ testMode }) => {
  // Obtener el contexto una sola vez (evita llamar hooks condicionalmente)
  const ctxData = useSensorsData();
  const { activeMode } = ctxData;
  // Envolver el Canvas en un contenedor con la mitad de la altura actual.
  // Usamos un estilo inline para garantizar que ocupe el 50% de la altura del contenedor padre.
  return (
    <div style={{ width: '100%', height: '50%' }} className="relative">

      {/* Recuadro 2D en esquina superior derecha con info de la prueba unitaria */}
      {(testMode === 'unitTest' || activeMode === 'unitTest') && (() => {
        // Calcular inclinación y velocidad desde los datos del contexto (ctxData ya disponible)
        const accelX_ctx = Number(ctxData.data?.sensors?.MPU9250?.readings?.accelerometer?.x?.value) || 0;
        const accelY_ctx = Number(ctxData.data?.sensors?.MPU9250?.readings?.accelerometer?.y?.value) || 0;
        const accelZ_ctx = Number(ctxData.data?.sensors?.MPU9250?.readings?.accelerometer?.z?.value) || 0;
        const altitude_ctx = Number(ctxData.data?.sensors?.BMP280?.readings?.altitude?.value) || 0;

        // Aplicar la misma inversión que usamos en el modelo
        const iAx = -accelX_ctx;
        const iAy = -accelY_ctx;
        const iAz = -accelZ_ctx;
        const pitch = Math.atan2(iAy, Math.sqrt(iAx * iAx + iAz * iAz));
        const roll = Math.atan2(-iAx, iAz);
        const pitchDeg = pitch * (180 / Math.PI);
        const rollDeg = roll * (180 / Math.PI);
        const inclination = Math.sqrt(pitchDeg * pitchDeg + rollDeg * rollDeg).toFixed(2);
        const velocity = Math.sqrt(accelX_ctx * accelX_ctx + accelY_ctx * accelY_ctx + accelZ_ctx * accelZ_ctx).toFixed(2);

        return (
          <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 50 }}>
            <div style={{ background: '#10B981', color: '#fff', padding: '10px 14px', borderRadius: 8, minWidth: 200, boxShadow: '0 6px 12px rgba(0,0,0,0.18)' }}>
              <div style={{ fontWeight: 800, marginBottom: 6 }}>🧪 MODO PRUEBA UNITARIA</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Inclinación: {inclination}°</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Altura: {altitude_ctx} m</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Velocidad: {velocity} m/s²</div>
            </div>
          </div>
        );
      })()}

      <Canvas 
        camera={{ position: [0, -7, 15], fov: 50 }}
        className="w-full h-full"
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
    </div>
  );
};

export default Scene;
