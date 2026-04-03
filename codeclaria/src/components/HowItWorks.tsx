"use client";

import { useState } from "react";

interface Step {
  number: string;
  icon: React.ReactNode;
  title: string;
  shortDesc: string;
  detailLabel: string;
  detailHeading: string;
  detailBody: string;
  badge: string;
  mockup: React.ReactNode;
}

function RepoPasteMockup() {
  return (
    <div className="rounded-xl p-5 font-mono text-xs border border-white/10" style={{ background: "#13112a" }}>
      <p className="text-[10px] tracking-[0.16em] text-[#a78bfa] uppercase mb-3">Paste repo url</p>
      <div className="rounded-lg px-3 py-2.5 flex items-center gap-2 text-white/30 mb-3 border border-white/10" style={{ background: "#13112a" }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
        github.com/your-org/your-repo
      </div>
      <div className="flex gap-1.5 mb-3">
        {["main", "TypeScript", "12 modules"].map((t) => (
          <span key={t} className="px-2 py-0.5 rounded border border-white/10 text-white/40 text-[10px]">{t}</span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "#1e1b3a" }}>
          <div className="h-full w-3/4 rounded-full" style={{ background: "#a78bfa" }} />
        </div>
        <span className="text-[10px] text-[#a78bfa]">Connecting…</span>
      </div>
    </div>
  );
}

function AnalysisMockup() {
  const files = [
    { name: "src/index.ts", done: true },
    { name: "lib/parser.ts", done: true },
    { name: "utils/graph.ts", done: true },
    { name: "api/routes.ts", done: false },
  ];
  return (
    <div className="rounded-xl p-5 font-mono text-xs border border-white/10" style={{ background: "#13112a" }}>
      <p className="text-[10px] tracking-[0.16em] text-[#a78bfa] uppercase mb-3">Scanning files</p>
      <div className="space-y-2">
        {files.map((f) => (
          <div key={f.name} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.done ? "bg-[#a78bfa]" : "bg-white/20"}`} />
            <span className="flex-1 text-white/50">{f.name}</span>
            {f.done ? <span className="text-[#a78bfa]">✓</span> : <span className="text-white/30">…</span>}
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 mt-3 pt-3 flex justify-between text-white/30">
        <span>Dependencies mapped</span>
        <span className="text-[#a78bfa] font-medium">48</span>
      </div>
    </div>
  );
}

function GraphMockup() {
  return (
    <div className="rounded-xl p-5 border border-white/10" style={{ background: "#13112a" }}>
      <p className="text-[10px] tracking-[0.16em] text-[#a78bfa] uppercase mb-3 font-mono">Dependency graph</p>
      <svg viewBox="0 0 280 110" className="w-full block">
        <line x1="140" y1="55" x2="75" y2="28" stroke="rgba(167,139,250,0.4)" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="140" y1="55" x2="205" y2="28" stroke="rgba(167,139,250,0.4)" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="140" y1="55" x2="75" y2="85" stroke="rgba(167,139,250,0.2)" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="140" y1="55" x2="205" y2="85" stroke="rgba(167,139,250,0.2)" strokeWidth="1" strokeDasharray="4 3" />
        <line x1="75" y1="28" x2="28" y2="14" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <line x1="205" y1="28" x2="252" y2="14" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <circle cx="140" cy="55" r="10" fill="#7c3aed" />
        <circle cx="75" cy="28" r="7" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1" />
        <circle cx="205" cy="28" r="7" fill="rgba(167,139,250,0.15)" stroke="#a78bfa" strokeWidth="1" />
        <circle cx="75" cy="85" r="6" fill="rgba(167,139,250,0.08)" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
        <circle cx="205" cy="85" r="6" fill="rgba(167,139,250,0.08)" stroke="rgba(167,139,250,0.3)" strokeWidth="1" />
        <circle cx="28" cy="14" r="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
        <circle cx="252" cy="14" r="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

function ExplanationMockup() {
  return (
    <div className="rounded-xl p-5 text-xs border border-white/10" style={{ background: "#13112a" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[#a78bfa]" />
        <span className="text-white/40 font-mono">parser.ts</span>
      </div>
      <p className="text-white/50 leading-relaxed mb-3">
        This module reads raw AST nodes and converts them into a normalized dependency graph. It is the core of the analysis pipeline — everything downstream depends on its output shape.
      </p>
      <div className="flex flex-wrap gap-1">
        {["reads AST", "emits graph", "no side effects"].map((t) => (
          <span key={t} className="px-2 py-0.5 rounded border border-purple-500/20 text-[#a78bfa] bg-purple-500/10 text-[10px]">{t}</span>
        ))}
      </div>
    </div>
  );
}

const steps: Step[] = [
  {
    number: "01",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: "Paste your repo",
    shortDesc: "Drop a GitHub URL. No setup, no config.",
    detailLabel: "STEP 01 — PASTE",
    detailHeading: "Drop your repo. We handle the rest.",
    detailBody: "Paste a GitHub URL or drag in your codebase. OAuth-based auth means zero friction — no tokens, no config. Works with monorepos, private repos, and multi-language projects.",
    badge: "No setup needed",
    mockup: <RepoPasteMockup />,
  },
  {
    number: "02",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "AI analyzes your code",
    shortDesc: "Files, deps, structure — all decoded.",
    detailLabel: "STEP 02 — ANALYZE",
    detailHeading: "Every function. Every dependency. Decoded.",
    detailBody: "The AI traverses your entire project tree — understanding imports, resolving module boundaries, mapping call hierarchies, and flagging complexity hotspots.",
    badge: "Deep understanding",
    mockup: <AnalysisMockup />,
  },
  {
    number: "03",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Explore visual insights",
    shortDesc: "Interactive graphs, architecture maps.",
    detailLabel: "STEP 03 — EXPLORE",
    detailHeading: "Your architecture, finally visible.",
    detailBody: "Interactive graphs let you zoom into any module, trace a data flow end-to-end, or get a bird's-eye view of your entire system. Filter by layer, language, or complexity.",
    badge: "Interactive graphs",
    mockup: <GraphMockup />,
  },
  {
    number: "04",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Get clear explanations",
    shortDesc: "Plain English. Like a senior dev.",
    detailLabel: "STEP 04 — UNDERSTAND",
    detailHeading: "Like a senior dev, always available.",
    detailBody: "Each file and component gets a human-readable summary: what it does, its role in the system, what it depends on, and how to extend or refactor it safely.",
    badge: "Plain English",
    mockup: <ExplanationMockup />,
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const s = steps[active];

  return (
    <div className="relative mx-6 lg:mx-20 my-10">
      <section
        className="relative font-sans antialiased text-white border border-white/10 rounded-2xl overflow-hidden"
        style={{ background: "#0d0b1f", zIndex: 1 }}
      >
      {/* Header */}
      <div className="grid md:grid-cols-2 gap-8 px-8 pt-10 pb-8 border-b border-white/10">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-white/40 uppercase flex items-center gap-2 mb-4">
            <span className="w-5 h-px bg-white/20 block" />
            How it works
          </p>
          <h1 className="text-3xl md:text-4xl font-medium leading-[1.1] tracking-tight text-white">
            From repo to{" "}
            <span style={{ color: "#a78bfa" }}>clarity</span>
            <br />in seconds.
          </h1>
        </div>
        <div className="flex flex-col justify-center gap-5">
          <p className="text-sm text-white/50 leading-relaxed">
            No lengthy setup. No engineers needed. Paste a URL and get full architectural understanding of any codebase — built for developers who move fast.
          </p>
          <div>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-sm font-medium text-white/70 hover:bg-white/5 transition-colors">
              Analyze your repo
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Step tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/10">
        {steps.map((step, i) => (
          <button
            key={step.number}
            onClick={() => setActive(i)}
            className={`relative p-5 text-left border-r border-white/10 last:border-r-0 ${active === i ? "bg-white text-gray-900" : "hover:bg-white/5 transition-colors duration-150"}`}
          >
            {active === i && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#a78bfa]" />}
            <div className="flex items-start justify-between mb-6">
              <span className={`text-xs font-medium tracking-wider ${active === i ? "text-[#7c3aed]" : "text-white/30"}`}>
                {step.number}
              </span>
              <span className={`p-1.5 rounded-lg border transition-colors ${active === i ? "border-purple-200 text-[#7c3aed] bg-purple-50" : "border-white/10 text-white/30"}`}>
                {step.icon}
              </span>
            </div>
            <p className={`text-sm font-medium mb-1 ${active === i ? "text-gray-900" : "text-white"}`}>{step.title}</p>
            <p className={`text-xs leading-relaxed hidden md:block ${active === i ? "text-gray-500" : "text-white/40"}`}>{step.shortDesc}</p>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      <div className="grid md:grid-cols-2 gap-10 px-8 py-10 items-center border-b border-white/10">
        <div>{s.mockup}</div>
        <div className="space-y-4">
          <p className="text-[11px] tracking-[0.18em] text-[#a78bfa] font-mono">{s.detailLabel}</p>
          <h2 className="text-xl md:text-2xl font-medium leading-tight text-white">{s.detailHeading}</h2>
          <p className="text-sm text-white/50 leading-relaxed">{s.detailBody}</p>
          <span className="inline-flex items-center px-3 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[#a78bfa] text-xs font-medium">
            {s.badge}
          </span>
          <div className="flex gap-1.5 pt-1">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1 rounded-full transition-all duration-300 ${active === i ? "w-5 bg-[#a78bfa]" : "w-1.5 bg-white/15 hover:bg-white/25"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CTA bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-8 py-6 border-b border-white/10">
        <div>
          <p className="font-medium text-base text-white">Ready to simplify your codebase?</p>
          <p className="text-sm text-white/40 mt-0.5">Paste a repo URL and get full clarity in under 90 seconds.</p>
        </div>
        <button className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#07061a] rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
          Get started free
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-col sm:flex-row items-center gap-3 px-8 py-6">
        <div className="flex-1 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 w-full" style={{ background: "#13112a" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <input
            type="text"
            placeholder="https://github.com/your-org/your-repo"
            className="flex-1 bg-transparent text-sm text-white/60 placeholder:text-white/25 outline-none font-mono"
          />
        </div>
        <button className="shrink-0 text-sm font-semibold bg-white text-[#07061a] px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors">
          Analyze Repo →
        </button>
      </div>
      </section>
    </div>
  );
}
