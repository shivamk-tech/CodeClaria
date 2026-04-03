export default function Footer() {
  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#1a1f1a" }}
    >
      {/* CTA Section */}
      <div className="flex flex-col items-center justify-center px-6 pt-16 pb-12 text-center">
        {/* "Free to start" pill badge */}
        <div
          className="mb-8 inline-flex items-center rounded-full px-5 py-2"
          style={{
            backgroundColor: "#2a2560",
            border: "1px solid #4a44a0",
          }}
        >
          <span
            className="font-mono text-sm tracking-widest"
            style={{ color: "#818cf8" }}
          >
            Free to start
          </span>
        </div>

        {/* Main Heading */}
        <h2
          className="mb-10 max-w-2xl font-bold leading-tight text-white"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}
        >
          Ready to understand your codebase?
        </h2>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            className="rounded-xl font-mono text-base text-white transition-all duration-200 hover:bg-white/10"
            style={{
              padding: "0.75rem 2rem",
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: "transparent",
              letterSpacing: "0.01em",
            }}
          >
            Get started free
          </button>

          <button
            className="rounded-xl font-mono text-base text-white transition-all duration-200 hover:bg-white/10"
            style={{
              padding: "0.75rem 2rem",
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: "transparent",
              letterSpacing: "0.01em",
            }}
          >
            Read the docs
          </button>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: "90%",
          height: "1px",
          backgroundColor: "rgba(255,255,255,0.1)",
        }}
      />

      {/* Bottom Bar */}
      <div
        className="mx-auto flex w-full flex-col items-center justify-between gap-3 px-8 py-5 sm:flex-row"
        style={{ maxWidth: "1100px" }}
      >
        <p
          className="font-mono text-sm"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          © 2026 CodeClaira
        </p>

        <div className="flex items-center">
          {["Privacy", "Terms", "GitHub"].map((item, i) => (
            <span key={item} className="flex items-center">
              <a
                href="#"
                className="font-mono text-sm transition-colors duration-200 hover:text-white"
                style={{ color: "rgba(255,255,255,0.35)", padding: "0 14px" }}
              >
                {item}
              </a>
              {i < 2 && (
                <span style={{ color: "rgba(255,255,255,0.15)" }}>|</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Giant Watermark Text — fades top to bottom */}
      <div
        className="pointer-events-none select-none overflow-hidden"
        style={{
          marginTop: "-0.5rem",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 100%)",
        }}
      >
        <p
          className="text-center font-black leading-none"
          style={{
            fontSize: "clamp(4rem, 18vw, 13rem)",
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "-0.02em",
          }}
        >
          CodeClaira
        </p>
      </div>
    </footer>
  );
}