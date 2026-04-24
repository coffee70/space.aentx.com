"use client";

import dynamic from "next/dynamic";

const SpaceBackground = dynamic(() => import("./space-background"), {
  ssr: false,
});

export default function SpaceBackgroundClient() {
  return <SpaceBackground />;
}
