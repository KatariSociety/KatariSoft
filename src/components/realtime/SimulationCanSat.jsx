import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useSensorsData } from "../../context/SensorsData";

// Modelo simple de CanSat: cuerpo central + paneles solares
const CanSatModel = ({ testMode }) => {
  const { data, activeMode } = useSensorsData();
  const groupRef = useRef();
  const [predictedOrbit, setPredictedOrbit] = useState([]);
  const [incAngle, setIncAngle] = useState(0);
  const incAngleRef = useRef(0);
  const targetPosRef = useRef(new THREE.Vector3());

  // Lecturas relevantes
  const gyroX = Number(data?.sensors?.MPU9250?.readings?.gyroscope?.x?.value) || 0;
  const gyroY = Number(data?.sensors?.MPU9250?.readings?.gyroscope?.y?.value) || 0;
  const gyroZ = Number(data?.sensors?.MPU9250?.readings?.gyroscope?.z?.value) || 0;
  const accelX = Number(data?.sensors?.MPU9250?.readings?.accelerometer?.x?.value) || 0;
  const accelY = Number(data?.sensors?.MPU9250?.readings?.accelerometer?.y?.value) || 0;
  const accelZ = Number(data?.sensors?.MPU9250?.readings?.accelerometer?.z?.value) || 0;
  const altitude = Number(data?.sensors?.BMP280?.readings?.altitude?.value) || 0;

  // Convertir altitud a un radio de órbita visual
  const orbitRadius = 2 + Math.min(Math.max(altitude / 200, 0), 6); // escala visual

  // Calcular una órbita circular predicha (usamos velocidad estimada por aceleración)
  const calculatePredictedOrbit = () => {
    // Ahora generamos un aro muy pequeño alrededor del CanSat
    const smallRadius = 0.35; // radio visual pequeño
    const points = [];
    const segments = 24; // menos segmentos, más discreto
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * smallRadius;
      const y = Math.sin(theta) * (smallRadius * 0.12); // ligera inclinación menor
      const z = Math.sin(theta) * smallRadius;
      points.push([x, y, z]);
    }
    return points;
  };

  useEffect(() => {
    setPredictedOrbit(calculatePredictedOrbit());
  }, [orbitRadius]);

  // Animación: rotación basada en giroscopio o en modo simulación
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // actualizar incAngleRef (no setState por frame)
    incAngleRef.current = incAngleRef.current + delta * 0.5;
    const angle = incAngleRef.current;
    const isUnitTest = testMode === 'unitTest' || activeMode === 'unitTest';
    const isSim = activeMode === 'simulation' || testMode === 'simulation';

    if (isUnitTest) {
      // Orientación a partir del acelerómetro (más estable para saber inclinación)
      const iAx = -accelX;
      const iAy = -accelY;
      const iAz = -accelZ || 1;
      const pitch = Math.atan2(iAy, Math.sqrt(iAx * iAx + iAz * iAz));
      const roll = Math.atan2(-iAx, iAz);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pitch, 0.2);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, roll, 0.2);
      const inclination = Math.sqrt((pitch * 180 / Math.PI) ** 2 + (roll * 180 / Math.PI) ** 2);
      // no llamamos setIncAngle por frame; sincronizamos periódicamente
      incAngleRef.current = inclination;
    } else if (isSim) {
      // Modo simulación: limitar los ángulos a ±10° antes de aplicar
  const maxDeg = 10;
  const scale = 10; // escala para amplificar lecturas pequeñas del giroscopio
  const clampedDegX = Math.min(Math.max((gyroX || 0) * scale, -maxDeg), maxDeg);
  const clampedDegY = Math.min(Math.max((gyroY || 0) * scale, -maxDeg), maxDeg);
  const clampedDegZ = Math.min(Math.max((gyroZ || 0) * scale, -maxDeg), maxDeg);
      const smoothing = 0.12;
      const targetX = THREE.MathUtils.degToRad(clampedDegX);
      const targetY = THREE.MathUtils.degToRad(clampedDegY);
      const targetZ = THREE.MathUtils.degToRad(clampedDegZ);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, smoothing);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, smoothing);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, smoothing);

      // Mantener centrado con pequeña oscilación usando targetPosRef
      const radius = 0.35;
      targetPosRef.current.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      groupRef.current.position.lerp(targetPosRef.current, 0.05);

      // Calcular inclinación aproximada en grados para display
      const inclination = Math.sqrt((targetX * 180 / Math.PI) ** 2 + (targetZ * 180 / Math.PI) ** 2);
      incAngleRef.current = inclination;
    } else {
      // Modo normal (fallback): mantener orientación suave
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.02);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.02);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.02);
      // pequeñas oscilaciones centradas
      const radius = 0.05;
      targetPosRef.current.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      groupRef.current.position.lerp(targetPosRef.current, 0.02);
    }
  });

  // sincronizar el state incAngle cada 200ms para que otras partes que dependan del state se actualicen ocasionalmente
  useEffect(() => {
    const id = setInterval(() => {
      setIncAngle(Number(incAngleRef.current).toFixed(2));
    }, 200);
    return () => clearInterval(id);
  }, []);

  // Componente visual del satélite
  return (
    <group ref={groupRef}>
      {/* Cuerpo cilíndrico simple para el CanSat (más alto, tipo lata de refresco) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 1.2, 32]} />
        <meshStandardMaterial color="#b0bec5" metalness={0.5} roughness={0.4} />
      </mesh>


      {/* Trayectoria predicha (línea) */}
      {predictedOrbit.length > 1 && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={predictedOrbit.length}
              array={new Float32Array(predictedOrbit.flat())}
              itemSize={3}
            />
          </bufferGeometry>
          {/* Aro muy pequeño y más sutil */}
          <lineBasicMaterial color="#60a5fa" transparent opacity={0.25} />
        </line>
      )}

    </group>
  );
};

// Modelo del cohete (usa rocket.glb)
const RocketModel = ({ testMode }) => {
  const { data, activeMode } = useSensorsData();
  const { scene } = useGLTF(import.meta.env.BASE_URL + "images/rocket.glb");
  const rocketRef = useRef();
  const groupRef = useRef();
  const angleRef = useRef(0);
  const posRef = useRef(new THREE.Vector3());

  const gyroX = Number(data?.sensors?.MPU9250?.readings?.gyroscope?.x?.value) || 0;
  const gyroY = Number(data?.sensors?.MPU9250?.readings?.gyroscope?.y?.value) || 0;
  const gyroZ = Number(data?.sensors?.MPU9250?.readings?.gyroscope?.z?.value) || 0;
  const accelX = Number(data?.sensors?.MPU9250?.readings?.accelerometer?.x?.value) || 0;
  const accelY = Number(data?.sensors?.MPU9250?.readings?.accelerometer?.y?.value) || 0;
  const accelZ = Number(data?.sensors?.MPU9250?.readings?.accelerometer?.z?.value) || 0;

  useFrame((_, delta) => {
  if (!groupRef.current) return;
    angleRef.current += delta * 0.5;
    const angle = angleRef.current;
    const isUnitTest = testMode === 'unitTest' || activeMode === 'unitTest';
    const isSim = activeMode === 'simulation' || testMode === 'simulation';

    if (isUnitTest) {
      const rotX = Math.atan2(accelY, accelZ || 1);
      const rotY = Math.atan2(accelX, accelZ || 1);
  groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotX, 0.1);
  groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotY, 0.1);
    } else if (isSim) {
      // Modo simulación: limitar ángulos a ±10° y aplicar suavizado (coherente con CanSat)
  const maxDeg = 10;
  const scale = 10; // escala para amplificar lecturas pequeñas del giroscopio
  const clampedDegX = Math.min(Math.max((gyroX || 0) * scale, -maxDeg), maxDeg);
  const clampedDegY = Math.min(Math.max((gyroY || 0) * scale, -maxDeg), maxDeg);
  const clampedDegZ = Math.min(Math.max((gyroZ || 0) * scale, -maxDeg), maxDeg);
      const targetX = THREE.MathUtils.degToRad(clampedDegX);
      const targetY = THREE.MathUtils.degToRad(clampedDegY);
      const targetZ = THREE.MathUtils.degToRad(clampedDegZ);
      const smoothing = 0.08;
  groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, smoothing);
  groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, smoothing);
  groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetZ, smoothing);
      // pequeña oscilación visual
      const radius = 0.12;
      posRef.current.set(Math.cos(angle) * radius, Math.sin(angle * 0.7) * 0.04, Math.sin(angle) * radius);
  groupRef.current.position.lerp(posRef.current, 0.04);
    } else {
  groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.02);
  groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.02);
  groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.02);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive ref={rocketRef} object={scene} scale={1.2} position={[0, 0, 0]} />
    </group>
  );
};

const Scene = ({ testMode }) => {
  const ctx = useSensorsData();
  const { activeMode } = ctx;

  // Valores generales
  const altitude = Number(ctx.data?.sensors?.BMP280?.readings?.altitude?.value) || 0;
  const gyroX = Number(ctx.data?.sensors?.MPU9250?.readings?.gyroscope?.x?.value) || 0;
  const gyroY = Number(ctx.data?.sensors?.MPU9250?.readings?.gyroscope?.y?.value) || 0;
  const gyroZ = Number(ctx.data?.sensors?.MPU9250?.readings?.gyroscope?.z?.value) || 0;
  const accelX = Number(ctx.data?.sensors?.MPU9250?.readings?.accelerometer?.x?.value) || 0;
  const accelY = Number(ctx.data?.sensors?.MPU9250?.readings?.accelerometer?.y?.value) || 0;
  const accelZ = Number(ctx.data?.sensors?.MPU9250?.readings?.accelerometer?.z?.value) || 0;

  const computeInclination = (mode) => {
    const isUnit = mode === 'unitTest' || activeMode === 'unitTest';
    const isSim = activeMode === 'simulation' || mode === 'simulation';
    if (isUnit) {
      const iAx = -accelX;
      const iAy = -accelY;
      const iAz = -accelZ || 1;
      const pitch = Math.atan2(iAy, Math.sqrt(iAx * iAx + iAz * iAz));
      const roll = Math.atan2(-iAx, iAz);
      const inclination = Math.sqrt((pitch * 180 / Math.PI) ** 2 + (roll * 180 / Math.PI) ** 2);
      return Number(inclination).toFixed(2);
    }
    if (isSim) {
      // usar giroscopio (grados) como aproximación de ángulo objetivo, pero clamp a ±10°
  const maxDeg = 10;
  const scale = 10; // mismo factor de escala para display
  const clampedDegX = Math.min(Math.max((gyroX || 0) * scale, -maxDeg), maxDeg);
  const clampedDegZ = Math.min(Math.max((gyroZ || 0) * scale, -maxDeg), maxDeg);
      const inclination = Math.sqrt((clampedDegX) ** 2 + (clampedDegZ) ** 2);
      return Number(inclination).toFixed(2);
    }
    return (0).toFixed(2);
  };

  const rocketIncl = computeInclination(testMode);
  const cansatIncl = computeInclination(testMode);

  const TelemetryOverlay = () => {
    const accelX = Number(ctx.data?.sensors?.MPU9250?.readings?.accelerometer?.x?.value) || 0;
    const accelY = Number(ctx.data?.sensors?.MPU9250?.readings?.accelerometer?.y?.value) || 0;
    const accelZ = Number(ctx.data?.sensors?.MPU9250?.readings?.accelerometer?.z?.value) || 0;
    const altitude = Number(ctx.data?.sensors?.BMP280?.readings?.altitude?.value) || 0;
    const velocity = Math.sqrt(accelX * accelX + accelY * accelY + accelZ * accelZ).toFixed(2);

    const iAx = -accelX;
    const iAy = -accelY;
    const iAz = -accelZ || 1;
    const pitch = Math.atan2(iAy, Math.sqrt(iAx * iAx + iAz * iAz));
    const roll = Math.atan2(-iAx, iAz);
    const inclination = Math.sqrt((pitch * 180 / Math.PI) ** 2 + (roll * 180 / Math.PI) ** 2).toFixed(2);

    if (!(testMode === 'unitTest' || activeMode === 'unitTest')) return null;

    return (
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, pointerEvents: 'none' }}>
        <div style={{ background: '#7c3aed', color: '#fff', padding: '10px 14px', borderRadius: 8, minWidth: 220, boxShadow: '0 6px 12px rgba(0,0,0,0.18)', pointerEvents: 'auto' }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>🛰️ MODO PRUEBA UNITARIA</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Inclinación: {inclination}°</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Altura: {altitude} m</div>
          <div style={{ fontSize: 13, marginTop: 4 }}>Velocidad sens.: {velocity} m/s²</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-2" style={{ height: '100%' }}>
  {/* Canvas superior: Cohete (52%) */}
  <div className="w-full bg-black rounded-lg overflow-hidden" style={{ height: '52%' }}>
        {/* Overlay discreto para el cohete */}
        <div style={{ position: 'absolute', left: 12, top: 12, zIndex: 40, pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '6px 10px', borderRadius: 8, fontSize: 12, minWidth: 140, boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>🚀 Cohete</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Altitud</span><strong>{altitude} m</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}><span>Ángulo</span><strong>{rocketIncl}°</strong></div>
          </div>
        </div>
        <Canvas dpr={[1, 1]} camera={{ position: [0, 5, 12], fov: 50 }} className="w-full h-full">
          <Environment files={import.meta.env.BASE_URL + "images/sky.hdr"} background />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 8, 5]} intensity={1} />
          <RocketModel testMode={testMode} />
          {/* Ejes estáticos de referencia (no rotan con el cohete) */}
          <axesHelper args={[8]} position={[0,0,0]} />
          <OrbitControls target={[0, 2, 0]} minDistance={6} maxDistance={20} enablePan={false} />
        </Canvas>
      </div>

  {/* Canvas inferior: CanSat */}
  <div className="w-full bg-black rounded-lg overflow-hidden relative" style={{ height: '48%' }}>
        <TelemetryOverlay />
        {/* Overlay discreto para el CanSat */}
        <div style={{ position: 'absolute', left: 12, top: 12, zIndex: 40, pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', padding: '6px 10px', borderRadius: 8, fontSize: 12, minWidth: 140, boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }}>
            <div style={{ fontWeight: 800, marginBottom: 4 }}>🛰️ CanSat</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Altitud</span><strong>{altitude} m</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}><span>Ángulo</span><strong>{cansatIncl}°</strong></div>
          </div>
        </div>
        <Canvas dpr={[1, 1]} camera={{ position: [0, 3, 8], fov: 50 }} className="w-full h-full">
          <Environment files={import.meta.env.BASE_URL + "images/sky.hdr"} background />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <CanSatModel testMode={testMode} />
          {/* Ejes estáticos de referencia (no rotan con el CanSat) */}
          <axesHelper args={[3.2]} position={[0,0,0]} />
          <OrbitControls target={[0, 0, 0]} minDistance={3} maxDistance={20} enablePan={false} />
        </Canvas>
      </div>
    </div>
  );
};

export default Scene;
