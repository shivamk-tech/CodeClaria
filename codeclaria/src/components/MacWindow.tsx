export default function MacWindowUI() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0b0b1a] shadow-2xl overflow-hidden">

      {/* Top Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
        <span className="w-3 h-3 bg-red-500 rounded-full" />
        <span className="w-3 h-3 bg-yellow-400 rounded-full" />
        <span className="w-3 h-3 bg-green-500 rounded-full" />
        <div className="ml-4 flex-1 text-xs text-white/40 bg-white/5 px-3 py-1 rounded-md font-mono">
          🔗 github.com/vercel/next.js
        </div>
        <div className="text-xs text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-md">
          Analyzing...
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 text-white min-h-[320px]">

        {/* Sidebar */}
        <div className="border-r border-white/10 p-4 space-y-1">
          <div className="bg-purple-600/20 text-purple-400 px-3 py-2 rounded-lg text-sm font-medium">
            🗂️ File Explorer
          </div>
          <div className="text-white/50 px-3 py-2 text-sm">🏗️ Architecture</div>
          <div className="text-white/50 px-3 py-2 text-sm">🔀 PR Reviews</div>
          <div className="text-white/50 px-3 py-2 text-sm">📊 Analytics</div>
          <div className="text-white/50 px-3 py-2 text-sm">💬 Ask AI</div>

          <div className="pt-4 text-[10px] text-white/30 px-3 uppercase tracking-widest">Recent Repos</div>
          <div className="text-xs text-white/60 px-3 py-1">▸ vercel/next.js</div>
          <div className="text-xs text-white/40 px-3 py-1">▸ prisma/client</div>
          <div className="text-xs text-white/40 px-3 py-1">▸ supabase/supabase</div>
        </div>

        {/* Center */}
        <div className="p-5 space-y-3 border-r border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/90">AI Explanation</h2>
            <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-[2px] rounded-full">
              ✓ Done
            </span>
          </div>

          {/* Summary */}
          <div className="text-xs text-white/60 leading-relaxed bg-white/5 rounded-lg p-3 border border-white/5">
            <span className="text-purple-400 font-medium">next.js</span> uses SSR + file-based routing.
            Auth lives in <span className="text-blue-400 font-mono">middleware.ts</span>,
            DB access via <span className="text-blue-400 font-mono">prisma.ts</span>.
            <span className="text-yellow-400"> 3 files need attention.</span>
          </div>

          {/* Issues & Best parts */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2 space-y-1">
              <p className="text-[10px] text-red-400 uppercase tracking-widest">⚠ Issues</p>
              <p className="text-[10px] text-white/50">No error boundaries</p>
              <p className="text-[10px] text-white/50">Missing rate limiting</p>
              <p className="text-[10px] text-white/50">Unhandled promise rejections</p>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2 space-y-1">
              <p className="text-[10px] text-green-400 uppercase tracking-widest">✦ Best Parts</p>
              <p className="text-[10px] text-white/50">Clean auth flow</p>
              <p className="text-[10px] text-white/50">Modular DB layer</p>
              <p className="text-[10px] text-white/50">Typed API routes</p>
            </div>
          </div>

          {/* Needs Update */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-2 space-y-1">
            <p className="text-[10px] text-yellow-400 uppercase tracking-widest mb-1">↻ Needs Update</p>
            <div className="flex flex-wrap gap-1">
              {["middleware.ts", "lib/compiler.ts", "pages/_app.tsx"].map((f) => (
                <span key={f} className="text-[10px] font-mono text-yellow-300/60 bg-yellow-500/10 px-2 py-[2px] rounded">{f}</span>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-[6px]">Code Heatmap</p>
            <div className="flex gap-[3px]">
              {[
                { label: "router",     pct: 92, color: "#34d399" },
                { label: "middleware", pct: 54, color: "#facc15" },
                { label: "compiler",  pct: 40, color: "#f87171" },
                { label: "prisma",    pct: 78, color: "#60a5fa" },
                { label: "auth",      pct: 65, color: "#a78bfa" },
              ].map((b) => (
                <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-sm" style={{ height: 36, background: "rgba(255,255,255,0.05)" }}>
                    <div className="w-full rounded-sm transition-all" style={{ height: `${b.pct}%`, marginTop: `${100 - b.pct}%`, background: b.color, opacity: 0.7 }} />
                  </div>
                  <span className="text-[8px] text-white/30 truncate w-full text-center">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Completion + Health */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-purple-600/10 border border-purple-500/20">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Health</p>
              <div className="flex items-end gap-1">
                <span className="text-xl font-bold text-purple-400">87</span>
                <span className="text-xs text-purple-400/40 mb-[1px]">/100</span>
              </div>
              <p className="text-[9px] text-white/30">↑ 3pts · excellent</p>
            </div>
            <div className="p-2 rounded-xl bg-blue-600/10 border border-blue-500/20">
              <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Completion</p>
              <div className="flex items-end gap-1">
                <span className="text-xl font-bold text-blue-400">73</span>
                <span className="text-xs text-blue-400/40 mb-[1px]">%</span>
              </div>
              <p className="text-[9px] text-white/30">27% needs work</p>
            </div>
          </div>
        </div>

        {/* Right — Dependency Graph */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs text-white/50">Dependency Graph</h3>
            <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-[2px] rounded">
              Interactive
            </span>
          </div>

          <div className="relative h-[220px]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="95" y1="44"  x2="50"  y2="100" stroke="rgba(124,58,237,0.35)" strokeWidth="1" />
              <line x1="95" y1="44"  x2="148" y2="100" stroke="rgba(124,58,237,0.35)" strokeWidth="1" />
              <line x1="50" y1="100" x2="24"  y2="162" stroke="rgba(124,58,237,0.2)"  strokeWidth="1" />
              <line x1="148" y1="100" x2="148" y2="162" stroke="rgba(124,58,237,0.2)" strokeWidth="1" />
              <line x1="148" y1="100" x2="90"  y2="162" stroke="rgba(124,58,237,0.2)" strokeWidth="1" />
            </svg>

            {[
              { label: "layout.tsx",   top: 20,  left: 58, active: true },
              { label: "router.ts",    top: 82,  left: 8 },
              { label: "middleware",   top: 82,  left: 108 },
              { label: "prisma.ts",    top: 148, left: 0 },
              { label: "compiler.ts", top: 148, left: 68 },
              { label: "auth.ts",     top: 148, left: 136 },
            ].map((node) => (
              <div
                key={node.label}
                className="absolute text-[10px] px-2 py-[4px] rounded-md font-mono whitespace-nowrap"
                style={{
                  top: node.top,
                  left: node.left,
                  background: node.active ? "rgba(124,58,237,0.28)" : "rgba(124,58,237,0.08)",
                  border: node.active ? "1px solid rgba(139,92,246,0.65)" : "1px solid rgba(124,58,237,0.2)",
                  color: node.active ? "#c4b5fd" : "rgba(255,255,255,0.4)",
                }}
              >
                {node.label}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
