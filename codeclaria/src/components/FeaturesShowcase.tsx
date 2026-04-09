"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

const FEATURES = [
  { id: "analyze", label: "Analyze Repo", icon: "🔗" },
  { id: "ai", label: "AI Explanation", icon: "🧠" },
  { id: "pr", label: "PR Review", icon: "🔀" },
  { id: "commit", label: "Commit Review", icon: "📦" },
  { id: "graph", label: "Dep Graph", icon: "🕸️" },
  { id: "chat", label: "Chat", icon: "💬" },
  { id: "auth", label: "GitHub App", icon: "🔐" },
];

function AnalyzeDemo() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState(0);

  const run = () => {
    if (!url.trim()) return;
    setStep(1);
    setTimeout(() => setStep(2), 1000);
    setTimeout(() => setStep(3), 2200);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-white/10" style={{ background: "#07061a" }}>
          <span className="text-white/30 text-xs">🔗</span>
          <input value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={(e) => e.key === "Enter" && run()}
            placeholder="https://github.com/vercel/next.js"
            className="flex-1 bg-transparent text-[13px] outline-none font-mono placeholder:text-white/20" style={{ color: "rgba(255,255,255,0.7)" }} />
        </div>
        <button onClick={run} className="px-4 py-2 rounded-lg text-[13px] font-semibold" style={{ background: "#fff", color: "#07061a" }}>
          Analyze
        </button>
      </div>

      {step >= 1 && (
        <div className="rounded-xl p-4 border border-white/10 space-y-2 font-mono text-xs" style={{ background: "#07061a" }}>
          <p className="text-[#a78bfa]">▶ Cloning repo...</p>
          {step >= 2 && <p className="text-white/50">▶ Reading files... <span className="text-green-400">31 found</span></p>}
          {step >= 3 && (
            <>
              <p className="text-white/50">▶ Running AI analysis... <span className="text-green-400">done</span></p>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[{ l: "Quality", v: "87", c: "#a78bfa" }, { l: "Cleanliness", v: "78", c: "#60a5fa" }, { l: "Issues", v: "4", c: "#f87171" }].map(s => (
                  <div key={s.l} className="rounded-lg p-2 text-center border border-white/10">
                    <p className="text-[9px] text-white/30 mb-1">{s.l}</p>
                    <p className="text-[18px] font-bold" style={{ color: s.c }}>{s.v}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function AIDemo() {
  const [active, setActive] = useState(0);
  const files = [
    { name: "src/lib/auth.ts", summary: "Handles GitHub OAuth using NextAuth. Sets up JWT callbacks, stores user in MongoDB on first login, and attaches accessToken to session.", tags: ["auth", "jwt", "mongodb"] },
    { name: "src/app/api/analyze/route.ts", summary: "POST endpoint that fetches repo files from GitHub API, scores them by importance, sends top 25 to Groq for AI analysis, and returns structured JSON.", tags: ["api", "groq", "github"] },
    { name: "src/services/fileSelector.ts", summary: "Scores files by relevance to a question using keyword matching. Prioritizes entry points, config files, and files matching question keywords.", tags: ["ai", "scoring", "context"] },
  ];

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {files.map((f, i) => (
          <button key={f.name} onClick={() => setActive(i)}
            className="text-[11px] font-mono px-3 py-1.5 rounded-lg transition-all"
            style={{ background: active === i ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)", color: active === i ? "#a78bfa" : "rgba(255,255,255,0.4)", border: `1px solid ${active === i ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.08)"}` }}>
            {f.name.split("/").pop()}
          </button>
        ))}
      </div>
      <div className="rounded-xl p-4 border border-white/10" style={{ background: "#07061a" }}>
        <p className="text-[11px] font-mono text-[#a78bfa] mb-2">{files[active].name}</p>
        <p className="text-[13px] text-white/65 leading-relaxed mb-3">{files[active].summary}</p>
        <div className="flex flex-wrap gap-1">
          {files[active].tags.map(t => (
            <span key={t} className="text-[10px] px-2 py-[2px] rounded font-mono" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PRDemo() {
  const [open, setOpen] = useState(false);
  const comments = [
    { file: "auth/login.ts", line: 23, severity: "high", comment: "Missing rate limiting — brute force attacks possible on this endpoint." },
    { file: "api/user.ts", line: 45, severity: "medium", comment: "Unhandled promise rejection. Wrap in try/catch or add .catch()." },
    { file: "utils/format.ts", line: 8, severity: "low", comment: "Consider using Intl.DateTimeFormat for locale-aware date formatting." },
  ];
  const colors: any = { high: "#f87171", medium: "#facc15", low: "#34d399" };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "#07061a" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-[13px] font-medium text-white">PR #42 — Add user authentication</span>
          </div>
          <button onClick={() => setOpen(!open)}
            className="text-[11px] px-3 py-1 rounded-lg transition-all"
            style={{ background: open ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.06)", color: open ? "#a78bfa" : "rgba(255,255,255,0.5)" }}>
            {open ? "Hide Review" : "Trigger AI Review"}
          </button>
        </div>
        {open && (
          <div className="p-4 space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">CodeClaria AI Review</p>
            {comments.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: colors[c.severity] }} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono text-white/60">{c.file}</span>
                    <span className="text-[10px] px-1.5 py-[1px] rounded capitalize" style={{ color: colors[c.severity], background: `${colors[c.severity]}15` }}>line {c.line}</span>
                  </div>
                  <p className="text-[12px] text-white/50">{c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CommitDemo() {
  const [pushed, setPushed] = useState(false);
  const changes = [
    { file: "DSA/BinarySearch/04_Floor.py", line: 3, comment: "Remove debug print statement before shipping to production." },
    { file: "DSA/BinarySearch/06_Search.py", line: 8, comment: "Edge case: array with single element not handled." },
    { file: "utils/helpers.js", line: 15, comment: "Consider using const instead of let — value never reassigned." },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "#07061a" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="font-mono text-[12px] text-white/60">
            <span className="text-[#a78bfa]">git push</span> origin main
          </div>
          <button onClick={() => setPushed(true)}
            className="text-[11px] px-3 py-1 rounded-lg"
            style={{ background: pushed ? "rgba(34,197,94,0.1)" : "#fff", color: pushed ? "#4ade80" : "#07061a", border: pushed ? "1px solid rgba(34,197,94,0.2)" : "none" }}>
            {pushed ? "✓ Pushed" : "Simulate Push"}
          </button>
        </div>
        {pushed && (
          <div className="p-4 space-y-2">
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3">Inline Comments Posted</p>
            {changes.map((c, i) => (
              <div key={i} className="p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono" style={{ color: "#facc15" }}>{c.file.split("/").pop()}:{c.line}</span>
                </div>
                <p className="text-[12px] text-white/50">{c.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GraphDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  const nodes = [
    { id: "index.ts", x: 140, y: 55, r: 14, color: "#7c3aed", imports: ["auth.ts", "db.ts"] },
    { id: "auth.ts", x: 75, y: 25, r: 10, color: "#a78bfa", imports: ["db.ts"] },
    { id: "db.ts", x: 205, y: 25, r: 10, color: "#60a5fa", imports: [] },
    { id: "utils.ts", x: 75, y: 90, r: 8, color: "#34d399", imports: [] },
    { id: "api.ts", x: 205, y: 90, r: 8, color: "#fb923c", imports: ["auth.ts", "db.ts"] },
  ];
  const links = [
    { s: "index.ts", t: "auth.ts" }, { s: "index.ts", t: "db.ts" },
    { s: "index.ts", t: "utils.ts" }, { s: "api.ts", t: "auth.ts" },
    { s: "api.ts", t: "db.ts" }, { s: "auth.ts", t: "db.ts" },
  ];
  const sel = nodes.find(n => n.id === selected);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "#07061a" }}>
        <div className="flex">
          <svg viewBox="0 0 280 120" className="flex-1" style={{ height: 180 }}>
            {links.map((l, i) => {
              const s = nodes.find(n => n.id === l.s)!;
              const t = nodes.find(n => n.id === l.t)!;
              const isActive = selected === l.s || selected === l.t;
              return <line key={i} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
                stroke={isActive ? "rgba(167,139,250,0.6)" : "rgba(167,139,250,0.2)"}
                strokeWidth={isActive ? 1.5 : 1} strokeDasharray="4 3" />;
            })}
            {nodes.map(n => (
              <g key={n.id} onClick={() => setSelected(selected === n.id ? null : n.id)} style={{ cursor: "pointer" }}>
                <circle cx={n.x} cy={n.y} r={n.r} fill={selected === n.id ? n.color : n.color + "30"} stroke={n.color} strokeWidth={selected === n.id ? 2 : 1} />
                <text x={n.x} y={n.y + n.r + 10} textAnchor="middle" fill={n.color} fontSize="7" fontFamily="monospace">{n.id}</text>
              </g>
            ))}
          </svg>
          {sel && (
            <div className="w-[140px] p-3 border-l border-white/10 text-xs">
              <p className="font-mono text-[#a78bfa] mb-2">{sel.id}</p>
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">Imports</p>
              {sel.imports.length === 0
                ? <p className="text-white/20 text-[11px]">None</p>
                : sel.imports.map(i => <p key={i} className="text-white/50 text-[11px] font-mono">→ {i}</p>)}
            </div>
          )}
        </div>
        <p className="text-[10px] text-white/20 text-center pb-2">Click any node to inspect</p>
      </div>
    </div>
  );
}

function ChatDemo() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Repo analyzed. Ask me anything about this codebase." }
  ]);
  const answers: Record<string, string> = {
    "auth": "Auth is handled in `src/lib/auth.ts` using NextAuth with GitHub OAuth provider.",
    "database": "DB connects via `src/lib/db.ts` using Mongoose with a cached singleton pattern.",
    "api": "API routes live in `src/app/api/` — analyze, chat, repos, webhook, and connect-repo.",
    "default": "I found references in `src/lib/auth.ts` and `src/app/api/analyze/route.ts`. Check those files.",
  };

  const send = () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages(prev => [...prev, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      const key = Object.keys(answers).find(k => q.toLowerCase().includes(k)) || "default";
      setMessages(prev => [...prev, { role: "ai", text: answers[key] }]);
    }, 600);
  };

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "#07061a" }}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <p className="text-[12px] text-white/50">Chat with Repo</p>
      </div>
      <div className="p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 200 }}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[85%] px-3 py-2 rounded-xl text-[12px] leading-relaxed"
              style={m.role === "user"
                ? { background: "rgba(167,139,250,0.15)", color: "#e2e8f0", border: "1px solid rgba(167,139,250,0.2)" }
                : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {m.text.split(/(`[^`]+`)/g).map((p, j) =>
                p.startsWith("`") ? <code key={j} className="px-1 rounded text-[11px]" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>{p.slice(1, -1)}</code> : <span key={j}>{p}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 px-4 py-3 border-t border-white/10">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Where is auth handled?" className="flex-1 bg-transparent text-[12px] outline-none" style={{ color: "rgba(255,255,255,0.6)" }} />
        <button onClick={send} className="text-[12px] font-semibold px-3 py-1.5 rounded-lg" style={{ background: "#fff", color: "#07061a" }}>Send</button>
      </div>
    </div>
  );
}

function AuthDemo() {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Click Install GitHub App", desc: "Opens github.com/apps/codeclaria/installations/new" },
    { label: "Select repos on GitHub", desc: "Choose which repos to enable auto-review on" },
    { label: "GitHub sets up webhooks", desc: "Automatic — no manual config needed" },
    { label: "PR & commit events flow", desc: "CodeClaria starts reviewing automatically" },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-white/10 overflow-hidden" style={{ background: "#07061a" }}>
        <div className="p-4 space-y-2">
          {steps.map((s, i) => (
            <div key={i} onClick={() => setStep(i)}
              className="flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer"
              style={{ background: step === i ? "rgba(167,139,250,0.08)" : "rgba(255,255,255,0.02)", border: `1px solid ${step === i ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)"}` }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ background: i <= step ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)", color: i <= step ? "#a78bfa" : "rgba(255,255,255,0.2)", border: `1px solid ${i <= step ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.08)"}` }}>
                {i < step ? "✓" : i + 1}
              </div>
              <div>
                <p className="text-[12px] font-medium" style={{ color: step === i ? "#fff" : "rgba(255,255,255,0.5)" }}>{s.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 pb-4">
          <button onClick={() => setStep(s => Math.min(s + 1, steps.length - 1))}
            className="w-full text-[13px] font-semibold py-2.5 rounded-lg transition-all"
            style={{ background: step === steps.length - 1 ? "rgba(34,197,94,0.1)" : "#fff", color: step === steps.length - 1 ? "#4ade80" : "#07061a", border: step === steps.length - 1 ? "1px solid rgba(34,197,94,0.2)" : "none" }}>
            {step === steps.length - 1 ? "✓ All set!" : "Next Step →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const DESCRIPTIONS: Record<string, { heading: string; body: string }> = {
  analyze: { heading: "Drop a repo URL. Get the full picture.", body: "Paste any public GitHub repo URL. CodeClaria fetches every file, maps the structure, and runs AI analysis — giving you a plain-English breakdown, health score, and what needs fixing." },
  ai: { heading: "Every file explained in plain English.", body: "Click any file to get an AI-generated summary of what it does, its role in the system, and how it connects to other files. Powered by Groq's llama-3.3-70b." },
  pr: { heading: "Every PR reviewed. Automatically.", body: "Install the GitHub App. When a PR opens, the webhook fires, AI fetches the diff, reviews it, and posts inline comments directly on GitHub — zero manual action." },
  commit: { heading: "Push to main. Get instant feedback.", body: "Every commit pushed to main is automatically reviewed. AI analyzes changed lines and posts inline comments on the exact lines of your commit on GitHub." },
  graph: { heading: "Your architecture, finally visible.", body: "Interactive D3.js force-directed graph. Drag nodes, zoom in, click to inspect imports. Switch to tree view to see the full folder structure." },
  chat: { heading: "Ask anything about your codebase.", body: "After analysis, chat directly with your repo. Ask where auth is handled, how the DB connects — AI answers with exact file references using the analyzed codebase as context." },
  auth: { heading: "One install. All repos covered.", body: "Sign in with GitHub OAuth. Install the CodeClaria GitHub App — GitHub auto-configures webhooks for all selected repos. PR and commit reviews start immediately." },
};

export default function FeaturesShowcase() {
  const [active, setActive] = useState("analyze");
  const { data: session } = useSession();
  const desc = DESCRIPTIONS[active];

  return (
    <section className="py-24 px-6" style={{ background: "#07061a", fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-[1100px] mx-auto">

        {/* header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium px-4 py-[6px] rounded-full mb-4"
            style={{ color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)", background: "rgba(167,139,250,0.07)" }}>
            ✦ Features
          </div>
          <h2 className="font-extrabold text-white tracking-[-0.02em] leading-[1.1] mb-3" style={{ fontSize: "clamp(26px, 4vw, 44px)" }}>
            See every feature in action.
          </h2>
          <p className="text-[14px] max-w-[440px] mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
            Click any feature below to see an interactive demo of how it works.
          </p>
        </div>

        {/* feature tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {FEATURES.map((f) => (
            <button key={f.id} onClick={() => setActive(f.id)}
              className="flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-full transition-all"
              style={{
                background: active === f.id ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.04)",
                color: active === f.id ? "#a78bfa" : "rgba(255,255,255,0.5)",
                border: `1px solid ${active === f.id ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}>
              <span>{f.icon}</span>
              {f.label}
            </button>
          ))}
        </div>

        {/* demo area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* left — demo */}
          <div className="rounded-2xl p-6 border border-white/10" style={{ background: "#0d0b1f" }}>
            <div className="flex items-center gap-2 mb-5">
              <span className="text-lg">{FEATURES.find(f => f.id === active)?.icon}</span>
              <p className="text-[13px] font-semibold text-white">{FEATURES.find(f => f.id === active)?.label}</p>
              <span className="ml-auto text-[10px] px-2 py-[2px] rounded" style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)" }}>
                Interactive
              </span>
            </div>
            {active === "analyze" && <AnalyzeDemo />}
            {active === "ai" && <AIDemo />}
            {active === "pr" && <PRDemo />}
            {active === "commit" && <CommitDemo />}
            {active === "graph" && <GraphDemo />}
            {active === "chat" && <ChatDemo />}
            {active === "auth" && <AuthDemo />}
          </div>

          {/* right — description */}
          <div className="flex flex-col justify-center space-y-5">
            <h3 className="font-bold text-white leading-tight" style={{ fontSize: "clamp(20px, 3vw, 30px)", letterSpacing: "-0.02em" }}>
              {desc.heading}
            </h3>
            <p className="text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
              {desc.body}
            </p>
            {!session && (
              <div className="flex gap-3 pt-2">
                <a href="/login" className="text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-all hover:bg-white/90" style={{ background: "#fff", color: "#07061a" }}>
                  Get started free →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
