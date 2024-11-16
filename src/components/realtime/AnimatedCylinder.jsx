// AnimatedCylinder.jsx
import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

function AnimatedCylinder() {
  const cylinderRef = useRef();

  // Animación del cilindro
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (cylinderRef.current) {
      cylinderRef.current.position.x = Math.sin(elapsedTime) * 2; // Oscila en X
      cylinderRef.current.position.y = Math.cos(elapsedTime) * 2; // Oscila en Y
      cylinderRef.current.position.z = Math.sin(elapsedTime * 1.5); // Oscila en Z
    }
  });

  return (
    <mesh ref={cylinderRef}>
      <cylinderGeometry args={[1, 1, 2, 32]} /> {/* Radio superior, inferior, altura, segmentos */}
      <meshStandardMaterial color="blue" />
    </mesh>
  );
}

export default function App() {
  return (
    <Canvas camera={{ position: [5, 5, 5] }}>
      {/* Controles para rotar y hacer zoom */}
      <OrbitControls />
      
      {/* Luz */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      
      {/* Cilindro Animado */}
      <AnimatedCylinder />
    </Canvas>
  );
}