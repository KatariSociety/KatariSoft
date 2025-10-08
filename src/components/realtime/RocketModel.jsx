import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useSensorsData } from "../../context/SensorsData";

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
      const maxDeg = 10;
      const scale = 10;
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
      <primitive ref={rocketRef} object={scene} scale={1.2} position={[0, -0.9, 0]} />
    </group>
  );
};

export default RocketModel;
