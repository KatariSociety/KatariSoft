import { useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useSensorsData } from "../../context/SensorsData";

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
    const smallRadius = 0.35; // radio visual pequeño
    const points = [];
    const segments = 24;
    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * smallRadius;
      const y = Math.sin(theta) * (smallRadius * 0.12);
      const z = Math.sin(theta) * smallRadius;
      points.push([x, y, z]);
    }
    return points;
  };

  useEffect(() => {
    setPredictedOrbit(calculatePredictedOrbit());
  }, [orbitRadius]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    incAngleRef.current = incAngleRef.current + delta * 0.5;
    const angle = incAngleRef.current;
    const isUnitTest = testMode === 'unitTest' || activeMode === 'unitTest';
    const isSim = activeMode === 'simulation' || testMode === 'simulation';

    if (isUnitTest) {
      const iAx = -accelX;
      const iAy = -accelY;
      const iAz = -accelZ || 1;
      const pitch = Math.atan2(iAy, Math.sqrt(iAx * iAx + iAz * iAz));
      const roll = Math.atan2(-iAx, iAz);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, pitch, 0.2);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, roll, 0.2);
      const inclination = Math.sqrt((pitch * 180 / Math.PI) ** 2 + (roll * 180 / Math.PI) ** 2);
      incAngleRef.current = inclination;
    } else if (isSim) {
      const maxDeg = 10;
      const scale = 10;
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

      const radius = 0.35;
      targetPosRef.current.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      groupRef.current.position.lerp(targetPosRef.current, 0.05);

      const inclination = Math.sqrt((targetX * 180 / Math.PI) ** 2 + (targetZ * 180 / Math.PI) ** 2);
      incAngleRef.current = inclination;
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, 0, 0.02);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.02);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, 0, 0.02);
      const radius = 0.05;
      targetPosRef.current.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
      groupRef.current.position.lerp(targetPosRef.current, 0.02);
    }
  });

  useEffect(() => {
    const id = setInterval(() => {
      setIncAngle(Number(incAngleRef.current).toFixed(2));
    }, 200);
    return () => clearInterval(id);
  }, []);

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 1.2, 32]} />
        <meshStandardMaterial color="#b0bec5" metalness={0.5} roughness={0.4} />
      </mesh>

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
          <lineBasicMaterial color="#60a5fa" transparent opacity={0.25} />
        </line>
      )}
    </group>
  );
};

export default CanSatModel;
