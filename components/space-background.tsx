"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending, BackSide, ShaderMaterial } from "three";
import { useMemo, useRef } from "react";

function CameraMotion() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.055) * 0.06;
    state.camera.position.y = 0.72 + Math.sin(t * 0.045) * 0.035;
    state.camera.lookAt(0, -0.82, 0);
  });

  return null;
}

function SunGlare() {
  const raysRef = useRef<ShaderMaterial>(null);

  useFrame((state) => {
    if (raysRef.current) {
      raysRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const raysMaterial = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec2 vUv;
          uniform float uTime;

          float hash(float n) {
            return fract(sin(n) * 43758.5453123);
          }

          void main() {
            vec2 center = vec2(0.5, 0.5);
            vec2 p = vUv - center;
            float dist = length(p);
            float angle = atan(p.y, p.x);

            float radialFalloff = smoothstep(0.55, 0.0, dist);
            float coreBurn = smoothstep(0.18, 0.0, dist);

            float rays = 0.0;
            rays += pow(max(0.0, sin(angle * 9.0 + uTime * 0.18)), 18.0) * 0.55;
            rays += pow(max(0.0, sin(angle * 17.0 - uTime * 0.11)), 28.0) * 0.35;
            rays += pow(max(0.0, sin(angle * 31.0 + uTime * 0.07)), 42.0) * 0.22;

            float horizontalFlare = pow(1.0 - abs(p.y) * 3.5, 8.0) * smoothstep(0.58, 0.02, abs(p.x));
            float verticalFlare = pow(1.0 - abs(p.x) * 8.0, 4.0) * smoothstep(0.28, 0.0, abs(p.y));

            float alpha = radialFalloff * 0.08;
            alpha += coreBurn * 0.42;
            alpha += rays * radialFalloff * 0.28;
            alpha += horizontalFlare * 0.18;
            alpha += verticalFlare * 0.05;

            vec3 color = mix(vec3(0.42, 0.72, 1.0), vec3(1.0), coreBurn + rays * 0.7);
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    []
  );

  return (
    <group position={[0, -0.98, 1.05]}>
      <pointLight intensity={95} distance={20} color="#ffffff" />

      {/* Tiny physical sun core. It is intentionally overpowered by glare. */}
      <mesh>
        <sphereGeometry args={[0.045, 32, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.92} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Procedural glare and rays hide the sun dot and make it feel painfully bright. */}
      <mesh position={[0, 0, -0.02]} scale={[3.3, 3.3, 1]}>
        <planeGeometry args={[1, 1, 1, 1]} />
        <primitive object={raysMaterial} attach="material" ref={raysRef} />
      </mesh>

      {/* Large soft bloom around the rays. */}
      <mesh position={[0, 0, -0.03]}>
        <circleGeometry args={[2.8, 128]} />
        <meshBasicMaterial color="#8fcfff" transparent opacity={0.045} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function AtmosphericRing() {
  return (
    <group position={[0, -1.055, 0.88]}>
      {/* Wide ionized glow hugging the limb. */}
      <mesh scale={[1, 0.08, 1]}>
        <torusGeometry args={[2.32, 0.08, 24, 256, Math.PI]} />
        <meshBasicMaterial color="#7fc8ff" transparent opacity={0.28} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Bright white-hot edge where the sun catches the atmosphere. */}
      <mesh scale={[1, 0.055, 1]}>
        <torusGeometry args={[2.27, 0.025, 18, 256, Math.PI]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.85} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Larger blue falloff above the limb. */}
      <mesh scale={[1, 0.17, 1]}>
        <torusGeometry args={[2.36, 0.18, 24, 256, Math.PI]} />
        <meshBasicMaterial color="#3f9dff" transparent opacity={0.08} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Earth() {
  return (
    <group>
      <mesh position={[0, -2.5, 0]} scale={[3.65, 3.65, 3.65]}>
        <sphereGeometry args={[1, 160, 160]} />
        <meshStandardMaterial color="#07101c" roughness={1} metalness={0} />
      </mesh>

      {/* Back-side rim shell gives the planet a faint readable edge without making it look blue. */}
      <mesh position={[0, -2.5, 0]} scale={[3.68, 3.68, 3.68]}>
        <sphereGeometry args={[1, 160, 160]} />
        <meshBasicMaterial color="#10233a" transparent opacity={0.12} blending={AdditiveBlending} side={BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function SpaceBackground() {
  return (
    <Canvas
      style={{ display: "block", width: "100vw", height: "100vh" }}
      camera={{ position: [0, 0.72, 5], fov: 50 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 1);
      }}
    >
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.12} />
      <directionalLight position={[0, 2.4, 4]} intensity={0.8} color="#8fcfff" />

      <Stars radius={70} depth={42} count={220} factor={1.55} saturation={0} fade speed={0.045} />

      <SunGlare />
      <AtmosphericRing />
      <Earth />

      <CameraMotion />
    </Canvas>
  );
}
