"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending, BackSide, ShaderMaterial } from "three";
import { useMemo, useRef } from "react";

const EARTH_CENTER_Y = -5.95;
const EARTH_RADIUS = 5.15;
const HORIZON_Y = -0.95;
const HORIZON_Z = 0.65;

function CameraMotion() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.045) * 0.045;
    state.camera.position.y = 0.92 + Math.sin(t * 0.035) * 0.025;
    state.camera.lookAt(0, -1.12, 0);
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
        depthTest: false,
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

          void main() {
            vec2 p = vUv - vec2(0.5);
            float d = length(p);
            float a = atan(p.y, p.x);

            float core = smoothstep(0.16, 0.0, d);
            float halo = smoothstep(0.52, 0.02, d);

            float rays = 0.0;
            rays += pow(max(0.0, sin(a * 8.0 + uTime * 0.12)), 22.0) * 0.55;
            rays += pow(max(0.0, sin(a * 15.0 - uTime * 0.09)), 32.0) * 0.38;
            rays += pow(max(0.0, sin(a * 27.0 + uTime * 0.05)), 44.0) * 0.22;

            float horizontal = exp(-abs(p.y) * 22.0) * smoothstep(0.68, 0.04, abs(p.x));
            float vertical = exp(-abs(p.x) * 38.0) * smoothstep(0.28, 0.0, abs(p.y));

            float alpha = core * 0.7;
            alpha += halo * 0.09;
            alpha += rays * halo * 0.36;
            alpha += horizontal * 0.22;
            alpha += vertical * 0.04;

            vec3 color = mix(vec3(0.35, 0.68, 1.0), vec3(1.0), core + rays);
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    []
  );

  return (
    <group position={[0, HORIZON_Y + 0.03, 1.18]}>
      <pointLight intensity={110} distance={24} color="#ffffff" />

      <mesh>
        <sphereGeometry args={[0.022, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.55} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, -0.04]} scale={[2.15, 2.15, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={raysMaterial} attach="material" ref={raysRef} />
      </mesh>

      <mesh position={[0, 0, -0.06]}>
        <circleGeometry args={[2.1, 128]} />
        <meshBasicMaterial color="#77bbff" transparent opacity={0.035} blending={AdditiveBlending} depthWrite={false} depthTest={false} />
      </mesh>
    </group>
  );
}

function AtmosphericRing() {
  return (
    <group position={[0, HORIZON_Y, HORIZON_Z]} rotation={[0, 0, 0]}>
      <mesh scale={[1, 0.105, 1]}>
        <torusGeometry args={[3.72, 0.105, 32, 320, Math.PI]} />
        <meshBasicMaterial color="#68bdff" transparent opacity={0.22} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh scale={[1, 0.06, 1]}>
        <torusGeometry args={[3.68, 0.028, 24, 320, Math.PI]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.92} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh scale={[1, 0.22, 1]}>
        <torusGeometry args={[3.82, 0.24, 32, 320, Math.PI]} />
        <meshBasicMaterial color="#2f8cff" transparent opacity={0.055} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Earth() {
  return (
    <group>
      <mesh position={[0, EARTH_CENTER_Y, 0]} scale={[EARTH_RADIUS, EARTH_RADIUS, EARTH_RADIUS]}>
        <sphereGeometry args={[1, 192, 192]} />
        <meshStandardMaterial color="#050a12" roughness={1} metalness={0} />
      </mesh>

      <mesh position={[0, EARTH_CENTER_Y, 0]} scale={[EARTH_RADIUS + 0.035, EARTH_RADIUS + 0.035, EARTH_RADIUS + 0.035]}>
        <sphereGeometry args={[1, 192, 192]} />
        <meshBasicMaterial color="#0b2440" transparent opacity={0.08} blending={AdditiveBlending} side={BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function SpaceBackground() {
  return (
    <Canvas
      style={{ display: "block", width: "100vw", height: "100vh" }}
      camera={{ position: [0, 0.92, 5.2], fov: 48 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 1);
      }}
    >
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.08} />
      <directionalLight position={[0, 2.2, 4]} intensity={0.55} color="#8fcfff" />

      <Stars radius={75} depth={46} count={190} factor={1.45} saturation={0} fade speed={0.035} />

      <SunGlare />
      <AtmosphericRing />
      <Earth />

      <CameraMotion />
    </Canvas>
  );
}
