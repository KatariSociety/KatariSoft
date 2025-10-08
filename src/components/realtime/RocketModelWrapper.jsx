import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import RocketModel from "./RocketModel";
import TrajectoryView3D from "./TrajectoryView3D";

const RocketModelWrapper = ({ testMode }) => {
  const [viewMode, setViewMode] = useState("3d"); // "3d" o "trajectory"

  // Si estamos en modo trajectory, mostramos esa vista completa
  if (viewMode === "trajectory") {
    return <TrajectoryView3D testMode={testMode} onBack={() => setViewMode("3d")} />;
  }

  // Si estamos en modo 3D, mostramos el Canvas con el modelo
  return (
    <>
      {/* Botón de cambio de vista */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 1000,
      }}>
        <button
          onClick={() => setViewMode("trajectory")}
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.6)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
          }}
        >
          <span>📍</span>
          <span>Vista Geoespacial</span>
        </button>
      </div>

      {/* Canvas con el modelo 3D */}
      <Canvas dpr={[1, 1]} camera={{ position: [-2.5, -4, 6], fov: 40 }} className="w-full h-full">
        <Environment files={import.meta.env.BASE_URL + "images/sky.hdr"} background />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]} intensity={1} />
        <RocketModel testMode={testMode} />
        <axesHelper args={[8]} position={[0,-0.9,0]} />
        <OrbitControls target={[0, 0, 0]} minDistance={4} maxDistance={30} enablePan={false} />
      </Canvas>
    </>
  );
};

export default RocketModelWrapper;
