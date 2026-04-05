"use client";

import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Nav from "@/components/Nav";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#07061a" }}>
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="min-h-screen" style={{ background: "#07061a", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
      <Nav />

      <div className="max-w-[680px] mx-auto px-6 pt-36 pb-24">

        {/* header */}
        <div className="flex items-start gap-5 mb-10 pb-10" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {user?.image ? (
            <img src={user.image} alt="avatar" className="w-16 h-16 rounded-full border border-white/10 shrink-0" />
          ) : (
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl shrink-0" style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)" }}>
              {user?.name?.[0]}
            </div>
          )}
          <div>
            <h1 className="text-[22px] font-bold text-white mb-1">{user?.name}</h1>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              {session?.accessToken ? (
                <span className="text-[11px] px-2 py-[2px] rounded" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                  ● GitHub Connected
                </span>
              ) : (
                <button
                  onClick={() => signIn("github", { callbackUrl: "/profile" })}
                  className="text-[11px] px-3 py-[3px] rounded font-medium transition-all hover:opacity-90"
                  style={{ background: "#24292e", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Connect GitHub
                </button>
              )}
            </div>
          </div>
        </div>

        {/* info rows */}
        <div className="space-y-0 mb-10">
          {[
            { label: "Full name", value: user?.name },
            { label: "Email", value: user?.email || "Not provided" },
            { label: "User ID", value: user?.id, mono: true },
            { label: "Auth provider", value: "GitHub OAuth" },
            { label: "GitHub", value: session?.accessToken ? "Connected" : "Not connected" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>{row.label}</span>
              <span className={`text-[13px] ${row.mono ? "font-mono" : ""}`} style={{ color: "rgba(255,255,255,0.7)" }}>
                {row.value || "—"}
              </span>
            </div>
          ))}
        </div>

        {/* actions */}
        <div className="space-y-3">
          <h2 className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>Actions</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/dashboard"
              className="flex-1 text-center text-[13px] font-medium py-3 rounded-lg transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
            >
              Go to Dashboard
            </a>
            <a
              href="/analyze"
              className="flex-1 text-center text-[13px] font-medium py-3 rounded-lg transition-all hover:bg-white/90"
              style={{ background: "#fff", color: "#07061a" }}
            >
              Analyze a Repo
            </a>
          </div>

          {!session?.accessToken && (
            <button
              onClick={() => signIn("github", { callbackUrl: "/profile" })}
              className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-3 rounded-lg transition-all hover:opacity-90"
              style={{ background: "#24292e", color: "#fff" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Connect GitHub
            </button>
          )}

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-[13px] py-3 rounded-lg transition-all hover:bg-red-500/10 mt-2"
            style={{ border: "1px solid rgba(239,68,68,0.2)", color: "rgba(239,68,68,0.6)" }}
          >
            Sign out
          </button>
        </div>

      </div>
    </div>
  );
}
