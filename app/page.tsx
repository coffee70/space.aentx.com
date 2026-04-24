import SpaceBackgroundClient from "@/components/space-background-client";

export default function Home() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-black text-white">
      <div className="fixed inset-0 z-0 h-svh w-screen">
        <SpaceBackgroundClient />
      </div>

      <div className="relative z-10 flex flex-col min-h-svh">
        <div className="fixed top-0 left-0 right-0 h-[72px] flex items-center px-8 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full" />
            <span className="text-lg font-semibold tracking-tight">Aentx</span>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 text-center pb-[8vh]">
          <div className="max-w-[860px]">
            <h1 className="text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.07em] font-medium">
              Build the operating layer for humanity beyond Earth.
            </h1>
            <p className="mt-6 text-[clamp(1rem,1.4vw,1.25rem)] leading-7 text-white/70">
              Aentx is creating the software foundation for space operations — unifying telemetry, automation, intelligence, and mission infrastructure into a platform built for the next era of human expansion.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
