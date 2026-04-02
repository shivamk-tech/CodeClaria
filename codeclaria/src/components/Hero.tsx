"use client";
import { useEffect, useState } from "react";
import MacWindowUI from "./MacWindow";

const NAV_LINKS = ["Product", "Pricing", "Docs", "Changelog"];

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(139,92,246,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* purple glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)" }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle, rgba(79,70,229,0.1) 0%, transparent 70%)" }} />
    </div>
  );
}

export default function LandingPage() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "#07061a", color: "#fff", fontFamily: "'Manrope', sans-serif" }}
    >
      {/* Corner vignette blur */}
      <div
        className="fixed inset-0 z-[999] pointer-events-none"
        style={{
          backdropFilter: visible ? "blur(18px)" : "blur(0px)",
          WebkitBackdropFilter: visible ? "blur(18px)" : "blur(0px)",
          maskImage: "radial-gradient(ellipse at center, transparent 30%, black 100%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, transparent 30%, black 100%)",
          transition: "backdrop-filter 1.4s ease-out, -webkit-backdrop-filter 1.4s ease-out",
        }}
      />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* ── HERO ── */}
      <section className="relative flex items-center justify-center px-6 lg:px-20" style={{ minHeight: "100vh" }}>
        <GridBackground />
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full max-w-[1200px]">

          {/* Left — text */}
          <div className="flex-1 flex flex-col items-start">
            <div
              className="inline-flex items-center gap-2 text-[12px] font-medium px-4 py-[6px] rounded-full mb-9"
              style={{
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.07)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span style={{ color: "#a78bfa" }}>✦</span>
              New: GPT-4o auto PR reviews just landed
            </div>

            <h1
              className="font-extrabold text-white leading-[1.0] tracking-[-0.03em] mb-5"
              style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              Understand code,
              <br />
              ship faster.
            </h1>

            <p className="text-[17px] font-normal" style={{ color: "rgba(255,255,255,0.45)" }}>
              Never wonder what a codebase does again.
            </p>
          </div>

          {/* Right — MacWindow */}
          <div className="w-full flex-[1.6]">
            <MacWindowUI />
          </div>

        </div>
      </section>
    </div>
  );
}
