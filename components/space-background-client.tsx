"use client";

import SpaceBackground from "./space-background";

export default function SpaceBackgroundClient() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <SpaceBackground />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34vh] bg-gradient-to-t from-black via-black/45 to-transparent" />
    </div>
  );
}
