"use client";

export default function SpaceBackgroundClient() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_78%,rgba(130,190,255,0.22)_0%,rgba(80,145,255,0.08)_15%,rgba(0,0,0,0)_42%)]" />
      <div className="absolute left-1/2 bottom-[-72vw] h-[86vw] w-[180vw] -translate-x-1/2 rounded-[50%] bg-[#010309] shadow-[0_-8px_70px_rgba(150,210,255,0.32)]" />
      <div className="absolute left-1/2 bottom-[10.5vw] h-[0.5px] w-[78vw] -translate-x-1/2 rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.95),0_0_52px_rgba(120,190,255,0.75),0_0_130px_rgba(70,150,255,0.38)]" />
      <div className="absolute left-1/2 bottom-[10.2vw] h-[4vw] w-[86vw] -translate-x-1/2 rounded-[50%] border-t border-white/20 blur-[2px]" />
      <div className="absolute inset-x-0 bottom-0 h-[42vh] bg-gradient-to-t from-black via-black/70 to-transparent" />
    </div>
  );
}
