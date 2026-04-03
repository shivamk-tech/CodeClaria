export default function Footer() {
  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#0a0f1e", fontFamily: "'DM Sans', sans-serif", borderTop: "1px solid rgba(148,163,184,0.08)" }}
    >
      {/* top fade */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, #07061a, transparent)" }}
      />

      {/* top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at top, rgba(56,189,248,0.06) 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      {/* CTA Section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center">
        <div
          className="inline-flex items-center gap-2 text-[11px] font-medium px-4 py-[6px] rounded-full mb-6"
          style={{ color: "rgba(148,163,184,0.8)", border: "1px solid rgba(148,163,184,0.12)", background: "rgba(148,163,184,0.05)" }}
        >
          ✦ Free during beta
        </div>

        <h2
          className="mb-8 max-w-2xl font-extrabold leading-tight tracking-[-0.02em]"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#e2e8f0" }}
        >
          Ready to understand your codebase?
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            className="text-[14px] font-semibold rounded-xl px-6 py-3 transition-all hover:opacity-90"
            style={{ background: "#e2e8f0", color: "#0a0f1e" }}
          >
            Get started free
          </button>
          <button
            className="text-[14px] font-medium rounded-xl px-6 py-3 transition-all hover:bg-white/5"
            style={{ border: "1px solid rgba(148,163,184,0.15)", color: "rgba(148,163,184,0.6)" }}
          >
            Read the docs
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto w-[90%] h-px" style={{ background: "rgba(148,163,184,0.08)" }} />

      {/* Bottom Bar */}
      <div
        className="relative z-10 mx-auto flex w-full flex-col items-center justify-between gap-3 px-8 py-5 sm:flex-row"
        style={{ maxWidth: "1100px" }}
      >
        <p className="text-[12px]" style={{ color: "rgba(148,163,184,0.35)" }}>
          © 2024 CodeClaria. All rights reserved.
        </p>
        <div className="flex items-center">
          {["Privacy", "Terms", "GitHub"].map((item, i) => (
            <span key={item} className="flex items-center">
              <a
                href="#"
                className="text-[12px] transition-colors hover:text-slate-300"
                style={{ color: "rgba(148,163,184,0.35)", padding: "0 14px" }}
              >
                {item}
              </a>
              {i < 2 && <span style={{ color: "rgba(148,163,184,0.1)" }}>|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Giant watermark */}
      <div
        className="pointer-events-none select-none overflow-hidden"
        style={{
          marginTop: "-0.5rem",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <p
          className="text-center font-black leading-none"
          style={{ fontSize: "clamp(4rem, 18vw, 13rem)", color: "rgba(148,163,184,0.06)", letterSpacing: "-0.02em" }}
        >
          CodeClaria
        </p>
      </div>
    </footer>
  );
}
