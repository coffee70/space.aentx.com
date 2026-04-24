"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending } from "three";

function CameraDrift() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.y = 1.2 + Math.sin(t * 0.05) * 0.05;
    state.camera.position.x = Math.sin(t * 0.03) * 0.05;
    state.camera.lookAt(0, -1, 0);
  });

  return null;
}

function SunBloom() {
  return (
    <group position={[0, -2.2, -1]}>
      <pointLight color="#ffffff" intensity={20} distance={10} decay={2} />

      <mesh>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <mesh>
        <circleGeometry args={[1.5, 64]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
        />
      </mesh>

      <mesh>
        <circleGeometry args={[3, 64]} />
        <meshBasicMaterial
          color="#8fcfff"
          transparent
          opacity={0.04}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function SpaceBackground() {
  return (
    <Canvas style={{ width: "100vw", height: "100vh" }} camera={{ position: [0, 1.2, 5], fov: 50 }}>
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.05} />
      <directionalLight position={[0, -1, -3]} intensity={6} color="#d7eeff" />

      <SunBloom />

      {/* Earth */}
      <mesh position={[0, -3, 0]} scale={[5, 5, 5]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#02040a" />
      </mesh>

      {/* horizon glow */}
      <mesh position={[0, -2.2, 0]}>
        <circleGeometry args={[2.5, 128]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.12}
          blending={AdditiveBlending}
        />
      </mesh>

      <Stars radius={80} depth={40} count={500} factor={2} fade speed={0.1} />

      <CameraDrift />
    </Canvas>
  );
}
