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

function ConnectRepoModal({ repos, onClose }: { repos: Repo[]; onClose: () => void }) {
  const [search, setSearch] = useState("");
  const [connecting, setConnecting] = useState<number | null>(null);
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [alreadyConnected, setAlreadyConnected] = useState<Set<string>>(new Set());

  // fetch already connected repos on mount
  useEffect(() => {
    fetch("/api/connect-repo")
      .then((r) => r.json())
      .then((data) => {
        if (data.repos) {
          setAlreadyConnected(new Set(data.repos.map((r: any) => r.repoFullName)));
        }
      });
  }, []);

  const handleConnect = async (repo: Repo) => {
    setConnecting(repo.id);
    setError(null);
    try {
      const res = await fetch("/api/connect-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repoFullName: repo.full_name,
          name: repo.name,
          description: repo.description,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setConnected((prev) => new Set([...prev, repo.full_name]));
      } else {
        setError(data.error || "Failed to connect");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setConnecting(null);
    }
  };

  const filtered = repos.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[600px] rounded-2xl overflow-hidden"
        style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.1)" }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <p className="text-[15px] font-semibold text-white">Connect a Repository</p>
            <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
              {repos.length} repos available
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            ✕
          </button>
        </div>

        {/* search */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10" style={{ background: "#07061a" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories..."
              className="flex-1 bg-transparent text-[13px] outline-none"
              style={{ color: "rgba(255,255,255,0.7)" }}
              autoFocus
            />
          </div>
        </div>

        {/* error */}
        {error && (
          <div className="px-5 py-2 text-[12px]" style={{ color: "#f87171" }}>{error}</div>
        )}

        {/* repo list */}
        <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>No repos found</p>
            </div>
          ) : (
            filtered.map((repo) => (
              <div
                key={repo.id}
                className="flex items-center justify-between px-5 py-4 border-b border-white/5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-medium text-white truncate">{repo.name}</span>
                    {repo.private && (
                      <span className="text-[10px] px-1.5 py-[1px] rounded shrink-0" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        Private
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-[12px] truncate mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                      {repo.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[repo.language] || "#888" }} />
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>{repo.stargazers_count}</span>
                    </div>
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {new Date(repo.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* connect button */}
                <button
                  onClick={() => handleConnect(repo)}
                  disabled={connecting === repo.id || connected.has(repo.full_name) || alreadyConnected.has(repo.full_name)}
                  className="shrink-0 text-[12px] font-medium px-4 py-2 rounded-lg transition-all"
                  style={{
                    background: (connected.has(repo.full_name) || alreadyConnected.has(repo.full_name)) ? "rgba(34,197,94,0.1)" : "#fff",
                    color: (connected.has(repo.full_name) || alreadyConnected.has(repo.full_name)) ? "#4ade80" : "#07061a",
                    border: (connected.has(repo.full_name) || alreadyConnected.has(repo.full_name)) ? "1px solid rgba(34,197,94,0.2)" : "none",
                    opacity: connecting === repo.id ? 0.6 : 1,
                    cursor: (connected.has(repo.full_name) || alreadyConnected.has(repo.full_name)) ? "default" : "pointer",
                  }}
                >
                  {connecting === repo.id ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                      Connecting...
                    </span>
                  ) : (connected.has(repo.full_name) || alreadyConnected.has(repo.full_name)) ? "✓ Connected" : "Connect"}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-lg transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Connect Repo
            </button>
            <a
              href="/analyze"
              className="text-[13px] font-medium px-4 py-2 rounded-lg transition-all hover:bg-white/90"
              style={{ background: "#fff", color: "#07061a" }}
            >
              Analyze by URL →
            </a>
          </div>
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

      {/* modal */}
      {showModal && <ConnectRepoModal repos={repos} onClose={() => setShowModal(false)} />}
    </div>
  );
}
