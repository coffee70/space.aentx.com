"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending } from "three";

function CameraDrift() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.y = 0.8 + Math.sin(t * 0.05) * 0.05;
    state.camera.position.x = Math.sin(t * 0.03) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function SunBloom() {
  return (
    <group position={[0, -2.42, -1.2]}>
      <pointLight color="#ffffff" intensity={18} distance={8} decay={2} />

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

      <mesh position={[0, 0.02, 0]}>
        <circleGeometry args={[0.9, 96]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.03, 0]}>
        <circleGeometry args={[1.8, 96]} />
        <meshBasicMaterial
          color="#8fcfff"
          transparent
          opacity={0.045}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0.04, 0]}>
        <circleGeometry args={[3.2, 128]} />
        <meshBasicMaterial
          color="#5aaeff"
          transparent
          opacity={0.018}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function SpaceBackground() {
  return (
    <Canvas camera={{ position: [0, 0.8, 5], fov: 45 }}>
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.035} />
      <directionalLight position={[0, -2, -4]} intensity={5} color="#d7eeff" />

      <SunBloom />

      {/* Earth */}
      <mesh position={[0, -3.2, 0]} scale={[5, 5, 5]}>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial color="#01030a" roughness={1} />
      </mesh>

      {/* layered glow */}
      <mesh position={[0, -2.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[4.8, 0.06, 1]}>
        <torusGeometry args={[1, 0.01, 16, 256]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} blending={AdditiveBlending} />
      </mesh>

      <mesh position={[0, -2.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[5.2, 0.12, 1]}>
        <torusGeometry args={[1, 0.02, 16, 256]} />
        <meshBasicMaterial color="#a9d8ff" transparent opacity={0.38} blending={AdditiveBlending} />
      </mesh>

      <mesh position={[0, -2.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[6, 0.2, 1]}>
        <torusGeometry args={[1, 0.04, 16, 256]} />
        <meshBasicMaterial color="#6dbbff" transparent opacity={0.14} blending={AdditiveBlending} />
      </mesh>

      {/* stars */}
      <Stars radius={80} depth={40} count={800} factor={2} saturation={0} fade speed={0.1} />

      <CameraDrift />
    </Canvas>
  );
}
