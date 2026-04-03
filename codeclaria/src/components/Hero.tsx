"use client";

import {Button} from './ui/Button'

export default function Hero() {
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
        className="font-extrabold text-white leading-[1.05] tracking-[-0.03em] mb-5"
        style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
      >
        Explain Any Codebase.
        <br />
        <span style={{ color: "#a78bfa" }}>Like You Wrote It.</span>
      </h1>

      <p
        className="text-[18px] font-normal max-w-[520px] mb-8"
        style={{ color: "rgba(255,255,255,0.45)" }}
      >
        Paste a GitHub repo URL and get a plain-English breakdown of every file, dependency, and issue — instantly.
      </p>

      <div className="flex items-center gap-3">
        <Button className="bg-white text-[#07061a] hover:bg-white/90 text-[14px] font-semibold px-6 py-3 rounded-lg">
            Analyze a repo
        </Button>
        <Button variant className="bg-white text-[#07061a] hover:bg-white/90 text-[14px] font-semibold px-6 py-3 rounded-lg">
            Analyze a repo
        </Button>
      </div>
    </div>
  );
}
