"use client";
import MacWindowUI from "./MacWindow";

const NAV_LINKS = ["Product", "Pricing", "Docs", "Changelog"];

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "#07061a", color: "#fff", fontFamily: "'Manrope', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
      `}</style>

      {/* ── HERO ── */}
      <section className="flex items-center justify-center px-6 lg:px-20" style={{ minHeight: "100vh" }}>
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
