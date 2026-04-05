"use client";

import {ButtonOutline} from './ui/ButtonOutline'
import {Button} from './ui/ButtonN'
import { useRouter } from 'next/navigation';

export default function Hero() {

  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      <div
        className="inline-flex items-center gap-2 text-[12px] font-medium px-4 py-[6px] rounded-full mb-6"
        style={{
          color: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(255,255,255,0.15)",
          background: "rgba(255,255,255,0.07)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span style={{ color: "#a78bfa" }}>✦</span>
        GPT-4o powered code intelligence
      </div>

      <h1
        className="font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]"
        style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
      >
        Explain Any Codebase.
        <br />
        <span style={{ color: "#c4b5fd", textShadow: "0 0 40px rgba(167,139,250,0.5)" }}>Like You Wrote It.</span>
      </h1>

      <div className="flex items-center gap-3">
        <Button onClick={()=>{router.push('/analyze')}} className="bg-white text-[#07061a] hover:bg-white/90 text-[14px] font-semibold px-6 py-3 rounded-lg cursor-pointer">
            Analyze a repo
        </Button>
        <ButtonOutline
          onClick={() => document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
          className="text-[14px] font-medium px-6 py-3 rounded-lg border-white/20 bg-transparent text-white/65 hover:bg-white/5 hover:text-white cursor-pointer">
            See how it works
        </ButtonOutline>
      </div>
    </div>
  );
}
