export default function MacWindowUI() {
  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0b0b1a] shadow-2xl overflow-hidden">

      {/* Top Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
        <span className="w-3 h-3 bg-red-500 rounded-full" />
        <span className="w-3 h-3 bg-yellow-400 rounded-full" />
        <span className="w-3 h-3 bg-green-500 rounded-full" />
        <div className="ml-4 flex-1 text-xs text-white/40 bg-white/5 px-3 py-1 rounded-md font-mono">
          codeclaria.dev/analyze
        </div>
      </div>

      {/* App UI */}
      <div className="p-6 space-y-4">

        {/* Repo input */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            <span className="text-white/30 text-xs">🔗</span>
            <span className="text-xs font-mono text-white/50">https://github.com/vercel/next.js</span>
          </div>
          <button className="text-xs text-white bg-purple-600 px-4 py-2 rounded-lg font-medium shrink-0">
            Analyze →
          </button>
        </div>

        {/* Result card */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-semibold">vercel / next.js</span>
              <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-[2px] rounded-full">✓ Analyzed</span>
            </div>
            <span className="text-[10px] text-white/30">2s ago</span>
          </div>

          {/* AI summary */}
          <p className="text-xs text-white/60 leading-relaxed">
            A React framework for production. Handles <span className="text-purple-400">SSR</span>, <span className="text-purple-400">routing</span>, and <span className="text-purple-400">bundling</span>. Auth is managed via middleware, data layer uses Prisma. Overall well-structured with a few areas to improve.
          </p>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2 text-center">
              <p className="text-[9px] text-white/40 uppercase tracking-widest">Health</p>
              <p className="text-lg font-bold text-purple-400">87<span className="text-[10px] opacity-40">/100</span></p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 text-center">
              <p className="text-[9px] text-white/40 uppercase tracking-widest">Cleanliness</p>
              <p className="text-lg font-bold text-blue-400">78<span className="text-[10px] opacity-40">/100</span></p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 text-center">
              <p className="text-[9px] text-white/40 uppercase tracking-widest">Updates</p>
              <p className="text-lg font-bold text-yellow-400">4<span className="text-[10px] opacity-40"> files</span></p>
            </div>
          </div>

          {/* Issues */}
          <div className="space-y-[6px]">
            <p className="text-[10px] text-white/30 uppercase tracking-widest">Issues Detected</p>
            {[
              { file: "middleware.ts",  issue: "Missing auth check on /api/admin",  severity: "high" },
              { file: "_app.tsx",       issue: "No global error boundary",           severity: "medium" },
              { file: "api/user.ts",    issue: "Unhandled promise rejection",        severity: "medium" },
            ].map((u) => (
              <div key={u.file} className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-3 py-[6px]">
                <span className={`w-[6px] h-[6px] rounded-full shrink-0 ${u.severity === "high" ? "bg-red-400" : "bg-yellow-400"}`} />
                <span className="text-[10px] font-mono text-white/60 shrink-0">{u.file}</span>
                <span className="text-[10px] text-white/30 ml-auto">{u.issue}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
