"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { AdditiveBlending, BackSide, ShaderMaterial } from "three";
import { useMemo, useRef } from "react";

/**
 * Tune these independently.
 *
 * EARTH_Y moves the Earth up/down.
 * EARTH_SCALE controls the actual sphere size.
 * SUN_Y moves the sun up/down independently.
 */
const EARTH_Y = -25.9;
const EARTH_SCALE = 20.5;
const ATMOSPHERE_OFFSET = 0.055;

const SUN_Y = -1.45;
const SUN_Z = 1.18;

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
            float halo = smoothstep(0.74, 0.03, d);

            float radialRayFade = exp(-d * 2.85);
            float outerRayFade = smoothstep(0.82, 0.12, d);
            float rayFade = radialRayFade * outerRayFade;

            float rays = 0.0;
            rays += pow(max(0.0, sin(a * 7.0 + uTime * 0.08)), 34.0) * 0.22;
            rays += pow(max(0.0, sin(a * 13.0 - uTime * 0.06)), 46.0) * 0.16;
            rays += pow(max(0.0, sin(a * 23.0 + uTime * 0.04)), 62.0) * 0.08;
            rays *= rayFade;

            float horizontal = exp(-abs(p.y) * 22.0) * smoothstep(0.9, 0.03, abs(p.x)) * exp(-d * 1.15);
            float softBloom = smoothstep(0.86, 0.0, d) * exp(-d * 2.1) * 0.055;

            float alpha = core * 0.86;
            alpha += halo * 0.055;
            alpha += rays * 0.2;
            alpha += horizontal * 0.11;
            alpha += softBloom;

            float edgeFadeX = smoothstep(0.5, 0.18, abs(p.x));
            float edgeFadeY = smoothstep(0.5, 0.18, abs(p.y));
            float edgeFade = edgeFadeX * edgeFadeY;

            alpha *= edgeFade;

            vec3 color = mix(vec3(0.42, 0.72, 1.0), vec3(1.0), core + rays * 0.75);
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    []
  );

  return (
    <group position={[0, SUN_Y, SUN_Z]}>
      <pointLight intensity={90} distance={24} color="#ffffff" />

      <mesh>
        <sphereGeometry args={[0.016, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.38}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.04]} scale={[8.5, 8.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <primitive object={raysMaterial} attach="material" ref={raysRef} />
      </mesh>
    </group>
  );
}

function Earth() {
  const atmosphereMaterial = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
        side: BackSide,
        uniforms: {
          uColor: { value: [0.45, 0.78, 1.0] },
          uIntensity: { value: 0.16 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;

          void main() {
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

            vNormal = normalize(normalMatrix * normal);
            vViewPosition = -mvPosition.xyz;

            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vViewPosition;

          uniform vec3 uColor;
          uniform float uIntensity;

          void main() {
            vec3 viewDir = normalize(vViewPosition);
            float rim = 1.0 - abs(dot(normalize(vNormal), viewDir));

            float thinRing = smoothstep(0.86, 0.99, rim);
            float outerFade = smoothstep(1.0, 0.95, rim);

            float alpha = thinRing * outerFade * uIntensity;

            gl_FragColor = vec4(uColor, alpha);
          }
        `,
      }),
    []
  );

  return (
    <group>
      <mesh
        position={[0, EARTH_Y, 0]}
        scale={[EARTH_SCALE, EARTH_SCALE, EARTH_SCALE]}
      >
        <sphereGeometry args={[1, 192, 192]} />
        <meshBasicMaterial color="#020714" />
      </mesh>

      <mesh
        position={[0, EARTH_Y, 0]}
        scale={[
          EARTH_SCALE + ATMOSPHERE_OFFSET,
          EARTH_SCALE + ATMOSPHERE_OFFSET,
          EARTH_SCALE + ATMOSPHERE_OFFSET,
        ]}
      >
        <sphereGeometry args={[1, 192, 192]} />
        <primitive object={atmosphereMaterial} attach="material" />
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