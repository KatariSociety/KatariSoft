import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Html } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useSensorsData } from "../../context/SensorsData";

const RocketModel = () => {
  const { data } = useSensorsData();
  const { scene } = useGLTF("/images/rocket.glb");
  const rocketRef = useRef();
  const [angle, setAngle] = useState(0);

  // Obtener datos del giroscopio y altitud (pero sin afectar la posición)
  const gyroX = data?.sensors?.MPU9250?.readings?.gyroscope?.x?.value || 0;
  const gyroZ = data?.sensors?.MPU9250?.readings?.gyroscope?.z?.value || 0;
  const currentAltitude = data?.sensors?.BMP280?.readings?.altitude?.value || 0;

  useFrame(() => {
    if (rocketRef.current) {
      // Convertir el giro de grados a radianes
      const thetaX = THREE.MathUtils.degToRad(gyroX);
      const thetaZ = THREE.MathUtils.degToRad(gyroZ);

      // Aplicar interpolación para suavizar el movimiento
      rocketRef.current.rotation.x = THREE.MathUtils.lerp(rocketRef.current.rotation.x, thetaX, 0.1);
      rocketRef.current.rotation.z = THREE.MathUtils.lerp(rocketRef.current.rotation.z, thetaZ, 0.1);

      // Mantener el cohete en la posición (0,0,0)
      rocketRef.current.position.set(0, 0, 0);

      // Calcular la inclinación total con respecto a la vertical (eje Y)
      const inclinationAngle = Math.sqrt(thetaX ** 2 + thetaZ ** 2) * (180 / Math.PI);
      setAngle(inclinationAngle.toFixed(2));
    }
  });

  return (
    <group>
      <primitive ref={rocketRef} object={scene} scale={1.5} />
      
      {/* Mostrar el ángulo y la altura en pantalla */}
      <Html position={[0, 3, 0]} center>
        <div style={{ color: "white", fontSize: "12px", background: "rgba(0,0,0,0.6)", padding: "5px", borderRadius: "5px" }}>
          Inclinación: {angle}° <br />
          Altura: {currentAltitude} m
        </div>
      </Html>
    </group>
  );
};

// Componente para visualizar los ejes X, Y, Z
const Axes = () => {
  return <axesHelper args={[5]} />;
};

const Scene = () => {
  return (
    <Canvas 
      camera={{
        position: [0, -7, 15], // Cámara más elevada para ver el eje en la parte inferior
        fov: 50
      }}
    >
      {/* Fondo HDR */}
      <Environment files="/images/sky.hdr" background />

      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-5, 10, -5]} intensity={0.5} color="#CCE6FF" />

      {/* Modelo del cohete con indicador de ángulo y altura */}
      <RocketModel />

      {/* Ejes X, Y, Z */}
      <Axes />

      {/* Mantener el eje 0,0,0 en la parte inferior */}
      <OrbitControls 
        target={[0, 3, 0]} // Ajustar la vista hacia abajo
        minDistance={7} 
        maxDistance={12} 
        enablePan={false} 
      />
    </Canvas>
  );
};

export default Scene;
