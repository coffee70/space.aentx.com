"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending } from "three";

function CameraRig() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.05) * 0.2;
    state.camera.position.y = 1.4 + Math.sin(t * 0.04) * 0.1;
    state.camera.lookAt(0, -1.2, 0);
  });
  return null;
}

function Sun() {
  return (
    <group position={[0, -1.9, -1.5]}>
      <pointLight intensity={60} distance={20} color="#ffffff" />

      <mesh>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <mesh>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.08} blending={AdditiveBlending} />
      </mesh>

      <mesh>
        <circleGeometry args={[4.5, 64]} />
        <meshBasicMaterial color="#8fcfff" transparent opacity={0.04} blending={AdditiveBlending} />
      </mesh>
    </group>
  );
}

export default function SpaceBackground() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }} camera={{ position: [0, 1.4, 5], fov: 55 }}>
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.1} />

      <Sun />

      {/* Earth (more visible) */}
      <mesh position={[0, -2.6, 0]} scale={[6, 6, 6]}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshStandardMaterial color="#05080f" roughness={1} />
      </mesh>

      {/* atmosphere rim */}
      <mesh position={[0, -2.05, 0]}>
        <circleGeometry args={[3.2, 128]} />
        <meshBasicMaterial color="#9fd2ff" transparent opacity={0.12} blending={AdditiveBlending} />
      </mesh>

      <Stars radius={100} depth={50} count={400} factor={2} fade speed={0.1} />

      <CameraRig />
    </Canvas>
  );
}
