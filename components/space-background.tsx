"use client";

import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending } from "three";

export default function SpaceBackground() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }} camera={{ position: [0, 0.5, 4], fov: 50 }}>
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.4} />

      {/* SUN (clearly visible) */}
      <group position={[0, -0.6, -1]}>
        <pointLight intensity={80} distance={20} color="#ffffff" />

        <mesh>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <mesh>
          <circleGeometry args={[2.5, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} blending={AdditiveBlending} />
        </mesh>
      </group>

      {/* EARTH (smaller, cannot occlude everything) */}
      <mesh position={[0, -1.5, 0]} scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#0a0f1a" roughness={1} />
      </mesh>

      {/* SIMPLE ATMOSPHERE LINE */}
      <mesh position={[0, -1.0, 0]}>
        <circleGeometry args={[1.8, 64]} />
        <meshBasicMaterial color="#9fd2ff" transparent opacity={0.2} blending={AdditiveBlending} />
      </mesh>

      <Stars radius={50} depth={30} count={200} factor={2} fade speed={0.1} />
    </Canvas>
  );
}
