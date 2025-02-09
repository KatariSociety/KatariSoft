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

  const currentAltitude = data?.sensors?.BMP280?.readings?.altitude?.value || 0;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (rocketRef.current) {
      const maxTheta = (10 * Math.PI) / 180;
      const thetaX = Math.sin(t * 0.7) * maxTheta;
      const thetaZ = Math.sin(t * 0.75) * maxTheta;

      rocketRef.current.position.set(0, 0, 0);
      rocketRef.current.rotation.set(thetaX, 0, thetaZ);

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
        position: [0, -7, 15], // Cámara más arriba e inclinada
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

      {/* Ajustar OrbitControls sin bloquear el giro, pero apuntando más arriba */}
      <OrbitControls 
        target={[0, 3, 0]} // Ajustar el enfoque más arriba
        minDistance={5} 
        maxDistance={11} 
        enablePan={false} 
      />
    </Canvas>
  );
};

export default Scene;
