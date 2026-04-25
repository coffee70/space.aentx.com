"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending, BackSide, ShaderMaterial } from "three";
import { useMemo, useRef } from "react";

const EARTH_CENTER_Y = -13.9;
const EARTH_RADIUS = 10.5;
const SUN_Y = EARTH_CENTER_Y + EARTH_RADIUS + 2.11;

function CameraMotion() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    state.camera.position.x = Math.sin(t * 0.04) * 0.035;
    state.camera.position.y = 1.02 + Math.sin(t * 0.032) * 0.02;
    state.camera.lookAt(0, -1.15, 0);
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

            float core = smoothstep(0.115, 0.0, d);
            float halo = smoothstep(0.58, 0.02, d);

            float rays = 0.0;
            rays += pow(max(0.0, sin(a * 7.0 + uTime * 0.08)), 34.0) * 0.22;
            rays += pow(max(0.0, sin(a * 13.0 - uTime * 0.06)), 46.0) * 0.16;
            rays += pow(max(0.0, sin(a * 23.0 + uTime * 0.04)), 62.0) * 0.08;

            float horizontal = exp(-abs(p.y) * 34.0) * smoothstep(0.72, 0.03, abs(p.x));
            float softBloom = smoothstep(0.62, 0.0, d) * 0.06;

            float alpha = core * 0.86;
            alpha += halo * 0.075;
            alpha += rays * halo * 0.18;
            alpha += horizontal * 0.16;
            alpha += softBloom;

            vec3 color = mix(vec3(0.42, 0.72, 1.0), vec3(1.0), core + rays * 0.8);
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    []
  );

  return (
    <group position={[0, SUN_Y, 1.18]}>
      <pointLight intensity={90} distance={24} color="#ffffff" />

      <mesh>
        <sphereGeometry args={[0.016, 24, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.38} blending={AdditiveBlending} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, -0.04]} scale={[1.75, 1.75, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={raysMaterial} attach="material" ref={raysRef} />
      </mesh>
    </group>
  );
}

function Earth() {
  return (
    <group>
      <mesh position={[0, EARTH_CENTER_Y, 0]} scale={[EARTH_RADIUS, EARTH_RADIUS, EARTH_RADIUS]}>
        <sphereGeometry args={[1, 192, 192]} />
        <meshBasicMaterial color="#ff00cc" />
      </mesh>

      <mesh position={[0, EARTH_CENTER_Y, 0]} scale={[EARTH_RADIUS + 0.035, EARTH_RADIUS + 0.035, EARTH_RADIUS + 0.035]}>
        <sphereGeometry args={[1, 192, 192]} />
        <meshBasicMaterial color="#ff00cc" transparent opacity={0.35} blending={AdditiveBlending} side={BackSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function SpaceBackground() {
  return (
    <Canvas
      style={{ display: "block", width: "100vw", height: "100vh" }}
      camera={{ position: [0, 1.02, 5.35], fov: 48 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 1);
      }}
    >
      <color attach="background" args={["#000000"]} />

      <ambientLight intensity={0.06} />
      <directionalLight position={[0, 2.2, 4]} intensity={0.42} color="#8fcfff" />

      <Stars radius={75} depth={46} count={170} factor={1.35} saturation={0} fade speed={0.025} />

      <SunGlare />
      <Earth />

      <CameraMotion />
    </Canvas>
  );
}
