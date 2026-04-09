"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  updated_at: string;
  private: boolean;
  html_url: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Ruby: "#701516",
  Swift: "#F05138",
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [appInstalled, setAppInstalled] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/repos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRepos(data);
        else setError("Could not load repos.");
      })
      .catch(() => setError("Failed to fetch repos."))
      .finally(() => setLoading(false));

    fetch("/api/github/installations")
      .then((r) => r.json())
      .then((data) => { if (data.installed) setAppInstalled(true); })
      .catch(() => {});
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#07061a" }}>
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  const filtered = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const topLangs = [...new Set(repos.map(r => r.language).filter(Boolean))].slice(0, 4);
  const privateCount = repos.filter(r => r.private).length;
  const publicCount = repos.filter(r => !r.private).length;

  return (
    <div className="min-h-screen" style={{ background: "#07061a", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .repo-card:hover { border-color: rgba(167,139,250,0.25) !important; transform: translateY(-2px); }
        .repo-card { transition: all 0.2s ease; }
        .analyze-btn { opacity: 0; transition: opacity 0.15s; }
        .repo-card:hover .analyze-btn { opacity: 1; }
        @media (max-width: 640px) { .analyze-btn { opacity: 1; } }
      `}</style>

      {/* single centered glow — clean, not AI-slop */}
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(ellipse at top, rgba(167,139,250,0.11) 0%, transparent 60%)", zIndex: 0 }} />
      {/* grid */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)", backgroundSize: "48px 48px", zIndex: 0 }} />

      <div className="relative z-10 max-w-[1040px] mx-auto px-4 sm:px-6 pt-24 pb-20">

        {/* ── Header ── */}
        <div className="fade-up flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-4">
            {session?.user?.image && (
              <img src={session.user.image} alt="avatar" className="w-11 h-11 rounded-full border-2" style={{ borderColor: "rgba(167,139,250,0.4)" }} />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] sm:text-[22px] font-bold text-white">
                  Hey, {session?.user?.name?.split(" ")[0]} 👋
                </h1>
                {appInstalled && (
                  <span className="text-[10px] px-2 py-[2px] rounded-full font-medium" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                    ● App Connected
                  </span>
                )}
              </div>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                {repos.length} repositories · ready to analyze
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {!appInstalled && (
              <a
                href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_SLUG || "codeclaria"}/installations/new`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-[13px] font-medium px-3 py-2 rounded-lg transition-all hover:opacity-90"
                style={{ background: "#24292e", color: "#fff" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                Install GitHub App
              </a>
            )}
            <a href="/analyze" className="text-[13px] font-medium px-4 py-2 rounded-lg transition-all hover:bg-white/90" style={{ background: "#fff", color: "#07061a" }}>
              Analyze by URL →
            </a>
          </div>
        </div>

        {/* ── Stats row ── */}
        {!loading && repos.length > 0 && (
          <div className="fade-up grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8" style={{ animationDelay: "0.05s" }}>
            {[
              { label: "Total Repos", value: repos.length, icon: "⬡", color: "#a78bfa" },
              { label: "Public", value: publicCount, icon: "◎", color: "#60a5fa" },
              { label: "Private", value: privateCount, icon: "◈", color: "#f472b6" },
              { label: "Languages", value: topLangs.length, icon: "✦", color: "#34d399" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[18px]" style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-[22px] font-bold text-white">{s.value}</span>
                </div>
                <p className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Search ── */}
        <div className="fade-up mb-6" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories..."
              className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-white/20"
              style={{ color: "rgba(255,255,255,0.7)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>✕</button>
            )}
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-purple-400 animate-spin" />
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>Fetching your repositories...</p>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="py-10 text-center rounded-xl" style={{ background: "rgba(248,113,113,0.05)", border: "1px solid rgba(248,113,113,0.15)" }}>
            <p className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{error}</p>
            <a href="/login" className="text-[13px] font-medium px-4 py-2 rounded-lg" style={{ background: "#24292e", color: "#fff" }}>
              Reconnect GitHub
            </a>
          </div>
        )}

        {/* ── Repos grid ── */}
        {!loading && !error && (
          <div className="fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3" style={{ animationDelay: "0.15s" }}>
            {filtered.map((repo, i) => (
              <div
                key={repo.id}
                className="repo-card rounded-xl p-4 cursor-pointer"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", animationDelay: `${i * 0.03}s` }}
                onClick={() => router.push(`/analyze?url=https://github.com/${repo.full_name}`)}
              >
                {/* top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.15)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="rgba(167,139,250,0.8)"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                    </div>
                    <span className="text-[13px] font-semibold text-white truncate">{repo.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {repo.private && (
                      <span className="text-[9px] px-1.5 py-[2px] rounded" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        Private
                      </span>
                    )}
                    <button
                      className="analyze-btn text-[10px] font-semibold px-2.5 py-1 rounded-md"
                      style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.25)" }}
                      onClick={(e) => { e.stopPropagation(); router.push(`/analyze?url=https://github.com/${repo.full_name}`); }}
                    >
                      Analyze →
                    </button>
                  </div>
                </div>

                {/* description */}
                {repo.description ? (
                  <p className="text-[12px] mb-3 line-clamp-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {repo.description}
                  </p>
                ) : (
                  <p className="text-[12px] mb-3 italic" style={{ color: "rgba(255,255,255,0.18)" }}>No description</p>
                )}

                {/* footer */}
                <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[repo.language] || "#888" }} />
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>{repo.stargazers_count}</span>
                  </div>
                  <span className="text-[11px] ml-auto" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center">
                <div className="text-3xl mb-3">🔍</div>
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>No repos matching "{search}"</p>
                <button onClick={() => setSearch("")} className="mt-3 text-[12px]" style={{ color: "#a78bfa" }}>Clear search</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
