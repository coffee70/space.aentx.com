"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";

function WebGLProbe() {
  const { gl, size, camera } = useThree();

  useEffect(() => {
    console.log("Three.js mounted", {
      canvasWidth: gl.domElement.width,
      canvasHeight: gl.domElement.height,
      cssWidth: gl.domElement.style.width,
      cssHeight: gl.domElement.style.height,
      viewportSize: size,
      cameraPosition: camera.position.toArray(),
      renderer: gl.info,
    });
  }, [camera, gl, size]);

  return null;
}

export default function SpaceBackground() {
  return (
    <Canvas
      style={{ display: "block", width: "100vw", height: "100vh" }}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: false, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#101030", 1);
        console.log("Canvas created", gl.domElement.width, gl.domElement.height);
      }}
    >
      <color attach="background" args={["#101030"]} />
      <WebGLProbe />

      <ambientLight intensity={1} />

      {/* Debug anchor: if Three.js is drawing, this red square must be visible. */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="#ff0033" />
      </mesh>

      {/* Debug sun: visible in front of the red square. */}
      <mesh position={[0, -1.25, 1]}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </Canvas>
  );
}
