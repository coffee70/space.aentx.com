"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

export default function SpaceBackground() {
  return (
    <Canvas camera={{ position: [0, 0.8, 5], fov: 45 }}>
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.05} />
      <directionalLight position={[0, -2, -4]} intensity={4} />

      {/* Earth */}
      <mesh position={[0, -3.2, 0]} scale={[5, 5, 5]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#01030a" roughness={1} />
      </mesh>

      {/* Glow arc */}
      <mesh position={[0, -2.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[4.8, 0.08, 1]}>
        <torusGeometry args={[1, 0.01, 16, 256]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
      </mesh>

      {/* Stars */}
      <Stars radius={80} depth={40} count={1200} factor={2} saturation={0} fade speed={0.15} />
    </Canvas>
  );
}
