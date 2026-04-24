"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending } from "three";

function CameraMotion() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.08) * 0.08;
    state.camera.position.y = 0.65 + Math.sin(t * 0.06) * 0.04;
    state.camera.lookAt(0, -0.75, 0);
  });

  return null;
}

export default function SpaceBackground() {
  return (
    <Canvas
      style={{ display: "block", width: "100vw", height: "100vh" }}
      camera={{ position: [0, 0.65, 5], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 1);
      }}
    >
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.18} />
      <directionalLight position={[0, 2, 4]} intensity={0.7} color="#7fbfff" />

      {/* Stars */}
      <Stars radius={60} depth={35} count={260} factor={1.8} saturation={0} fade speed={0.06} />

      {/* Sun: intentionally in front of the planet edge so it is clearly visible. */}
      <group position={[0, -0.92, 0.85]}>
        <pointLight intensity={75} distance={18} color="#ffffff" />

        <mesh>
          <sphereGeometry args={[0.14, 48, 48]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <mesh position={[0, 0, -0.02]}>
          <circleGeometry args={[0.9, 96]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} blending={AdditiveBlending} depthWrite={false} />
        </mesh>

        <mesh position={[0, 0, -0.03]}>
          <circleGeometry args={[1.8, 96]} />
          <meshBasicMaterial color="#8fcfff" transparent opacity={0.065} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* Planet body: large enough to read as Earth limb, low enough not to swallow the scene. */}
      <mesh position={[0, -2.45, 0]} scale={[3.6, 3.6, 3.6]}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial color="#08111d" roughness={1} />
      </mesh>

      {/* Atmosphere glow above the limb. */}
      <mesh position={[0, -1.05, 0.75]}>
        <circleGeometry args={[2.25, 128]} />
        <meshBasicMaterial color="#9fd2ff" transparent opacity={0.16} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh position={[0, -1.08, 0.9]} scale={[1, 0.06, 1]}>
        <circleGeometry args={[2.2, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      <CameraMotion />
    </Canvas>
  );
}
