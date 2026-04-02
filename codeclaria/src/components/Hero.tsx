"use client";

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
      <section className="flex flex-col items-center justify-center" style={{ minHeight: "100vh" }}>
        <div className="text-center px-6">
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
            style={{ fontSize: "clamp(52px, 8vw, 96px)" }}
          >
            Understand code,
            <br />
            ship faster.
          </h1>

          <p className="text-[17px] font-normal" style={{ color: "rgba(255,255,255,0.45)" }}>
            Never wonder what a codebase does again.
          </p>
        </div>
      </section>
    </div>
  );
}
