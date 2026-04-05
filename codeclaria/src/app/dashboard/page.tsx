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

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/repos")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRepos(data);
        else setError("Could not load repos. Make sure GitHub is connected.");
      })
      .catch(() => setError("Failed to fetch repos."))
      .finally(() => setLoading(false));
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

  return (
    <div className="min-h-screen pt-28 pb-20 px-6" style={{ background: "#07061a", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <div className="max-w-[1000px] mx-auto">

        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-bold text-white mb-1">
              Hey, {session?.user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
              {repos.length} repos · pick one to analyze
            </p>
          </div>
          <a
            href="/analyze"
            className="text-[13px] font-medium px-4 py-2 rounded-lg transition-all hover:bg-white/90"
            style={{ background: "#fff", color: "#07061a" }}
          >
            Analyze by URL →
          </a>
        </div>

        {/* search */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border mb-6" style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search repos..."
            className="flex-1 bg-transparent text-[13px] outline-none"
            style={{ color: "rgba(255,255,255,0.7)" }}
          />
        </div>

        {/* loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
          </div>
        )}

        {/* error */}
        {error && (
          <div className="py-10 text-center">
            <p className="text-[13px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{error}</p>
            <a href="/profile" className="text-[13px] font-medium px-4 py-2 rounded-lg" style={{ background: "#24292e", color: "#fff" }}>
              Connect GitHub
            </a>
          </div>
        )}

        {/* repos grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map((repo) => (
              <div
                key={repo.id}
                className="group p-4 rounded-xl border transition-all hover:border-white/20"
                style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-white">{repo.name}</span>
                    {repo.private && (
                      <span className="text-[10px] px-1.5 py-[1px] rounded" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        Private
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => router.push(`/analyze?url=https://github.com/${repo.full_name}`)}
                    className="text-[11px] font-medium px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    style={{ background: "#fff", color: "#07061a" }}
                  >
                    Analyze
                  </button>
                </div>

                {repo.description && (
                  <p className="text-[12px] mb-3 line-clamp-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {repo.description}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[repo.language] || "#888" }} />
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{repo.stargazers_count}</span>
                  </div>
                  <span className="text-[11px] ml-auto" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                </div>
              </div>
            ))}

            {filtered.length === 0 && !loading && (
              <div className="col-span-2 py-16 text-center">
                <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>No repos found matching "{search}"</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
