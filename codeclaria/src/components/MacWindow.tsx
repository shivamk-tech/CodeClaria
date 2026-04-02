export default function MacWindowUI() {
  return (
    <div className="max-w-6xl mx-auto mt-10 rounded-2xl border border-white/10 bg-[#0b0b1a] shadow-2xl overflow-hidden">

      {/* Top Bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white/5 border-b border-white/10">
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>

        <div className="ml-6 text-sm text-white/60 bg-white/5 px-4 py-1 rounded-md">
          Search files, PRs, analysis...
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 text-white">

        {/* Sidebar */}
        <div className="border-r border-white/10 p-4 space-y-4">
          <div className="bg-purple-600/20 text-purple-400 px-3 py-2 rounded-lg">
            ✏️ Repos
          </div>
          <div className="text-white/60 px-3 py-2">📄 PR Reviews</div>
          <div className="text-white/60 px-3 py-2">✅ Analysis</div>
          <div className="text-white/60 px-3 py-2">💬 Chat</div>

          <div className="mt-6 text-xs text-white/40">RECENT REPOS</div>
          <div className="text-sm text-white/70">next.js</div>
          <div className="text-sm text-white/70">prisma/client</div>
          <div className="text-sm text-white/70">my-saas-app</div>
        </div>

        {/* Center */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            vercel / next.js — Analysis
          </h2>

          <div className="space-y-2 text-sm text-white/70">
            <div>• app/router.ts</div>
            <div>• lib/compiler.ts</div>
            <div>• server/middleware.ts</div>
            <div>• pages/_app.tsx</div>
            <div>• lib/db/prisma.ts</div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-purple-600/10 border border-purple-500/20">
            <p className="text-sm text-white/60">CODE HEALTH SCORE</p>
            <h3 className="text-3xl font-bold text-purple-400">87/100</h3>
            <p className="text-xs text-white/50">
              ↑ 3pts from last PR · excellent
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="border-l border-white/10 p-6">
          <h3 className="text-sm text-white/60 mb-4">Dependency Graph</h3>

          <div className="space-y-3 text-sm text-white/70">
            <div className="bg-purple-600/20 px-3 py-2 rounded-lg w-fit">
              _app.tsx
            </div>
            <div className="ml-4">router.ts</div>
            <div className="ml-4">middleware.ts</div>
            <div className="ml-6">prisma.ts</div>
            <div className="ml-6">compiler.ts</div>
          </div>
        </div>

      </div>
    </div>
  );
}