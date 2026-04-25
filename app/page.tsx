import SpaceBackgroundClient from "@/components/space-background-client";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-svh overflow-hidden bg-black text-white">
      <div className="fixed inset-0 z-0 h-svh w-screen">
        <SpaceBackgroundClient />
      </div>

      <div className="relative z-10 flex flex-col min-h-svh">
        <div className="fixed top-0 left-0 right-0 h-18 flex items-center px-8 z-20">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Aentx logo"
              width={32}
              height={32}
              priority
              className="h-8 w-8 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-1 items-start justify-center px-6 text-center pt-[18vh]">
          <div className="max-w-215">
            <h1 className="text-[clamp(2.6rem,6vw,6.5rem)] leading-[0.92] tracking-[-0.07em] font-medium">
              Space, reimagined.
            </h1>
            <p className="mt-6 text-[clamp(1rem,1.4vw,1.25rem)] leading-7 text-white/70">
              Aentx builds software for the next generation of space operations.
            </p>
            <div className="mt-8 flex justify-center">
              <a
                href="#"
                className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium tracking-tight text-white shadow-[0_0_30px_rgba(120,180,255,0.18)] backdrop-blur-md transition hover:border-white/35 hover:bg-white/15 hover:shadow-[0_0_42px_rgba(120,180,255,0.28)]"
              >
                <span>See Demo</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
