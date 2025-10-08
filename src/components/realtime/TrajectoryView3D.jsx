import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Grid, Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { useSensorsData } from "../../context/SensorsData";

// Componente para controlar la cámara dinámicamente
const DynamicCamera = ({ currentHeight }) => {
  const { camera } = useThree();
  const targetPositionRef = useRef(new THREE.Vector3());

  useFrame(() => {
    // Calcular la distancia de la cámara basada en la altura
    // A mayor altura, más lejos debe estar la cámara
    const baseDistance = 30;
    const heightFactor = Math.max(1, currentHeight / 20); // Escala basada en altura
    const distance = baseDistance * heightFactor;
    
    // Ángulo de elevación que aumenta con la altura
    const elevationAngle = Math.min(25 + (currentHeight / 5), 45);
    const angleRad = THREE.MathUtils.degToRad(elevationAngle);
    
    // Calcular posición de la cámara
    const azimuthAngle = Math.PI / 4; // 45 grados en azimut
    const x = distance * Math.cos(angleRad) * Math.cos(azimuthAngle);
    const y = distance * Math.sin(angleRad) + currentHeight / 2; // Sigue la altura
    const z = distance * Math.cos(angleRad) * Math.sin(azimuthAngle);
    
    // Suavizar el movimiento de la cámara
    targetPositionRef.current.set(x, y, z);
    camera.position.lerp(targetPositionRef.current, 0.05);
    
    // Hacer que la cámara mire al cohete
    const lookAtTarget = new THREE.Vector3(0, currentHeight / 2, 0);
    const currentLookAt = new THREE.Vector3();
    camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(camera.position.distanceTo(lookAtTarget));
    currentLookAt.add(camera.position);
    currentLookAt.lerp(lookAtTarget, 0.05);
    camera.lookAt(currentLookAt);
  });

  return null;
};

// Componente para mostrar la trayectoria del cohete
const RocketTrajectory = ({ testMode, onHeightChange }) => {
  const { data, activeMode } = useSensorsData();
  const [trajectory, setTrajectory] = useState([]);
  const [currentPosition, setCurrentPosition] = useState([0, 0, 0]);
  const timeRef = useRef(0);
  const phaseRef = useRef(0); // 0: ascenso, 1: apogeo, 2: descenso

  // Simulación de trayectoria realista del cohete
  useFrame((_, delta) => {
    const isSim = activeMode === 'simulation' || testMode === 'simulation';
    
    if (isSim) {
      timeRef.current += delta;
      const t = timeRef.current;
      
      let x, y, z;
      
      // Fase de ascenso (0-8 segundos)
      if (t < 8) {
        phaseRef.current = 0;
        const accel = 15; // aceleración inicial m/s²
        const drag = 0.05; // resistencia del aire
        
        // Trayectoria con pequeña desviación por viento
        x = Math.sin(t * 0.3) * 0.5 * t;
        y = accel * t - drag * t * t; // altura
        z = Math.cos(t * 0.3) * 0.3 * t;
      }
      // Fase de apogeo (8-10 segundos)
      else if (t < 10) {
        phaseRef.current = 1;
        const apogeoTime = t - 8;
        const maxHeight = 15 * 8 - 0.05 * 64; // altura máxima alcanzada
        
        x = Math.sin(8 * 0.3) * 0.5 * 8 + Math.sin(t * 0.2) * 0.3;
        y = maxHeight - 0.5 * 9.8 * apogeoTime * apogeoTime * 0.3; // comienza a caer lentamente
        z = Math.cos(8 * 0.3) * 0.3 * 8 + Math.cos(t * 0.2) * 0.2;
      }
      // Fase de descenso con paracaídas (10+ segundos)
      else {
        phaseRef.current = 2;
        const descentTime = t - 10;
        const apogeoHeight = 15 * 8 - 0.05 * 64 - 0.5 * 9.8 * 4 * 0.3;
        
        // Descenso más lento con paracaídas (5 m/s)
        x = Math.sin(8 * 0.3) * 0.5 * 8 + Math.sin(t * 0.5) * 1.5;
        y = Math.max(0, apogeoHeight - 5 * descentTime);
        z = Math.cos(8 * 0.3) * 0.3 * 8 + Math.cos(t * 0.5) * 1.2;
        
        // Reiniciar cuando toca el suelo
        if (y <= 0) {
          timeRef.current = 0;
          setTrajectory([]);
          return;
        }
      }
      
      const newPosition = [x, y, z];
      setCurrentPosition(newPosition);
      
      // Notificar cambio de altura al componente padre
      if (onHeightChange) {
        onHeightChange(y);
      }
      
      // Agregar punto a la trayectoria cada 0.1 segundos
      if (trajectory.length === 0 || 
          Math.abs(t - trajectory[trajectory.length - 1].time) > 0.1) {
        setTrajectory(prev => [...prev, { 
          position: newPosition, 
          time: t,
          phase: phaseRef.current 
        }]);
      }
    }
  });

  // Convertir trayectoria a puntos para la línea
  const trajectoryPoints = trajectory.map(point => 
    new THREE.Vector3(...point.position)
  );

  return (
    <>
      {/* Línea de trayectoria */}
      {trajectoryPoints.length > 1 && (
        <Line
          points={trajectoryPoints}
          color="#00ff88"
          lineWidth={3}
          dashed={false}
        />
      )}
      
      {/* Puntos marcadores de la trayectoria */}
      {trajectory.map((point, idx) => (
        idx % 10 === 0 && (
          <mesh key={idx} position={point.position}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial 
              color={point.phase === 0 ? "#ffaa00" : point.phase === 1 ? "#ff0000" : "#00aaff"}
              emissive={point.phase === 0 ? "#ffaa00" : point.phase === 1 ? "#ff0000" : "#00aaff"}
              emissiveIntensity={0.5}
            />
          </mesh>
        )
      ))}
      
      {/* Cohete en posición actual */}
      <group position={currentPosition}>
        <mesh rotation={[0, 0, 0]}>
          <coneGeometry args={[0.3, 1.5, 8]} />
          <meshStandardMaterial 
            color="#ff3333" 
            emissive="#ff3333"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Llama del cohete (solo durante ascenso) */}
        {phaseRef.current === 0 && (
          <mesh position={[0, -0.75, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.2, 0.8, 8]} />
            <meshStandardMaterial 
              color="#ffaa00" 
              emissive="#ffaa00"
              emissiveIntensity={1}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}
        
        {/* Paracaídas (durante descenso) */}
        {phaseRef.current === 2 && (
          <mesh position={[0, 1.5, 0]}>
            <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial 
              color="#ffffff" 
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}
      </group>
      
      {/* Información de altura actual */}
      <Text
        position={[currentPosition[0], currentPosition[1] + 2, currentPosition[2]]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {`Alt: ${currentPosition[1].toFixed(1)}m`}
      </Text>
      
      {/* Indicador de fase */}
      <Text
        position={[currentPosition[0], currentPosition[1] + 2.8, currentPosition[2]]}
        fontSize={0.4}
        color={phaseRef.current === 0 ? "#ffaa00" : phaseRef.current === 1 ? "#ff0000" : "#00aaff"}
        anchorX="center"
        anchorY="middle"
      >
        {phaseRef.current === 0 ? "ASCENSO" : phaseRef.current === 1 ? "APOGEO" : "DESCENSO"}
      </Text>
    </>
  );
};

// Ejes cartesianos 3D
const CartesianAxes = () => {
  return (
    <>
      {/* Eje X (Rojo) */}
      <Line
        points={[[-20, 0, 0], [20, 0, 0]]}
        color="#ff0000"
        lineWidth={2}
      />
      <Text position={[21, 0, 0]} fontSize={0.8} color="#ff0000">
        X (Este)
      </Text>
      
      {/* Eje Y (Verde) - Altura */}
      <Line
        points={[[0, 0, 0], [0, 150, 0]]}
        color="#00ff00"
        lineWidth={2}
      />
      <Text position={[0, 155, 0]} fontSize={0.8} color="#00ff00">
        Y (Altura)
      </Text>
      
      {/* Eje Z (Azul) */}
      <Line
        points={[[0, 0, -20], [0, 0, 20]]}
        color="#0000ff"
        lineWidth={2}
      />
      <Text position={[0, 0, 21]} fontSize={0.8} color="#0000ff">
        Z (Norte)
      </Text>
      
      {/* Marcadores de escala en el eje Y */}
      {[0, 20, 40, 60, 80, 100, 120].map(height => (
        <group key={height}>
          <Line
            points={[[-0.5, height, 0], [0.5, height, 0]]}
            color="#00ff00"
            lineWidth={1}
          />
          <Text
            position={[-1.5, height, 0]}
            fontSize={0.5}
            color="#00ff00"
            anchorX="right"
          >
            {height}m
          </Text>
        </group>
      ))}
    </>
  );
};

// Plataforma de lanzamiento
const LaunchPad = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Plataforma base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[2, 2, 0.1, 32]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Torre de lanzamiento */}
      {[0, 1, 2, 3].map(i => (
        <mesh key={i} position={[1.5, 0.5 + i * 0.5, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
      
      {/* Marcador de origen */}
      <Text
        position={[0, 0.2, 2.5]}
        fontSize={0.6}
        color="#ffff00"
        anchorX="center"
      >
        ORIGEN (0,0,0)
      </Text>
    </group>
  );
};

const TrajectoryView3D = ({ testMode, onBack }) => {
  const [currentHeight, setCurrentHeight] = useState(0);

  return (
    <div style={{ width: "100%", height: "100%", background: "#0a0a1a", position: "relative" }}>
      {/* Botón de volver a vista 3D */}
      <div style={{
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 1000,
      }}>
        <button
          onClick={onBack}
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
          <span>🚀</span>
          <span>Vista Modelo 3D</span>
        </button>
      </div>
      
      <Canvas
        camera={{ position: [30, 25, 30], fov: 60 }}
        style={{ background: "linear-gradient(to bottom, #0a0a2e 0%, #16213e 100%)" }}
      >
        {/* Iluminación */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, 10, -5]} intensity={0.5} />
        
        {/* Cámara dinámica que sigue al cohete */}
        <DynamicCamera currentHeight={currentHeight} />
        
        {/* Controles de órbita - deshabilitados cuando la cámara dinámica está activa */}
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={10}
          maxDistance={200}
          enabled={false}
        />
        
        {/* Grilla del suelo */}
        <Grid
          position={[0, 0, 0]}
          args={[200, 200]}
          cellSize={5}
          cellThickness={0.5}
          cellColor="#444444"
          sectionSize={20}
          sectionThickness={1}
          sectionColor="#666666"
          fadeDistance={300}
          fadeStrength={1}
        />
        
        {/* Ejes cartesianos */}
        <CartesianAxes />
        
        {/* Plataforma de lanzamiento */}
        <LaunchPad />
        
        {/* Trayectoria del cohete */}
        <RocketTrajectory testMode={testMode} onHeightChange={setCurrentHeight} />
      </Canvas>
      
      {/* Leyenda */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        background: "rgba(0, 0, 0, 0.7)",
        padding: "15px",
        borderRadius: "8px",
        color: "white",
        fontSize: "14px",
        fontFamily: "monospace"
      }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#00ff88" }}>Vista Geoespacial 3D</h3>
        <div style={{ marginBottom: "5px" }}>
          <span style={{ color: "#ffaa00" }}>●</span> Fase de Ascenso
        </div>
        <div style={{ marginBottom: "5px" }}>
          <span style={{ color: "#ff0000" }}>●</span> Fase de Apogeo
        </div>
        <div style={{ marginBottom: "5px" }}>
          <span style={{ color: "#00aaff" }}>●</span> Fase de Descenso
        </div>
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#aaa" }}>
          <div>� Cámara automática activa</div>
          <div style={{ color: "#00ff88" }}>Altura actual: {currentHeight.toFixed(1)}m</div>
        </div>
      </div>
    </div>
  );
};

export default TrajectoryView3D;
