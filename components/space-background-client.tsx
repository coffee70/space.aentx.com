"use client";

import SpaceBackground from "./space-background";

export default function SpaceBackgroundClient() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_88%,rgba(160,210,255,0.45)_0%,rgba(100,170,255,0.18)_10%,rgba(0,0,0,0)_34%)]" />
      <div className="absolute left-1/2 bottom-[-38vw] h-[78vw] w-[160vw] -translate-x-1/2 rounded-[50%] bg-[#02040a] shadow-[0_-10px_80px_rgba(150,210,255,0.45)]" />
      <div className="absolute left-1/2 bottom-[21vw] h-px w-[92vw] -translate-x-1/2 bg-white/80 shadow-[0_0_28px_rgba(255,255,255,0.95),0_0_80px_rgba(120,190,255,0.65)]" />
      <div className="absolute inset-0 opacity-80">
        <SpaceBackground />
      </div>
    </div>
  );
}
