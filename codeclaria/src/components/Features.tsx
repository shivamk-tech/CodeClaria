"use client";

const FEATURES = [
  {
    icon: "🔗",
    title: "Paste Any Repo URL",
    description: "Just drop a GitHub repo link. We clone it, read every file, and get to work — no setup, no config.",
  },
  {
    icon: "🧠",
    title: "AI Code Explanation",
    description: "Get a plain-English breakdown of what the codebase does, how it's structured, and how every piece connects.",
  },
  {
    icon: "🕸️",
    title: "Dependency Graph",
    description: "Interactive visual graph showing how every file depends on every other file. Understand the architecture instantly.",
  },
  {
    icon: "🔀",
    title: "Auto PR Reviews",
    description: "Webhook fires on PR open. GPT-4o reviews the diff and posts inline comments directly on GitHub.",
  },
  {
    icon: "📊",
    title: "Code Health Score",
    description: "Per-file quality scores, cleanliness ratings, and update recommendations tracked across every PR.",
  },
  {
    icon: "💬",
    title: "Chat with Your Repo",
    description: 'Ask "where is auth handled?" and get an instant, accurate, context-aware answer from the AI.',
  },
];

export default function Features() {
  return (
    <section className="relative z-10 max-w-[1100px] mx-auto px-6 py-24">

      {/* Header */}
      <div className="text-center mb-14">
        <div
          className="inline-flex items-center gap-2 text-[11px] font-medium px-4 py-[6px] rounded-full mb-4"
          style={{
            color: "#a78bfa",
            border: "1px solid rgba(167,139,250,0.2)",
            background: "rgba(167,139,250,0.07)",
          }}
        >
          ✦ Features
        </div>
        <h2
          className="font-extrabold text-white tracking-[-0.02em] leading-[1.1] mb-4"
          style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
        >
          Everything you need to
          <br />
          <span style={{ color: "#a78bfa" }}>understand any codebase.</span>
        </h2>
        <p className="text-[15px] max-w-[480px] mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
          From repo URL to full AI-powered insights in seconds.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        {FEATURES.map((feat) => (
          <div
            key={feat.title}
            className="p-7 flex flex-col gap-3 cursor-default transition-all duration-200"
            style={{ background: "rgba(7,6,26,0.95)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(20,15,45,1)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(7,6,26,0.95)")}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.2)" }}
            >
              {feat.icon}
            </div>
            <h3 className="text-[15px] font-bold text-white">{feat.title}</h3>
            <p className="text-[13px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.38)" }}>
              {feat.description}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}
