"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#07061a" }}>
        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: "#07061a", fontFamily: "'DM Sans', sans-serif" }}>

      {/* top bar */}
      <div className="max-w-[1100px] mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <Image src="/icon.svg" alt="logo" width={28} height={28} />
          <span className="text-white font-bold text-[16px]">CodeClaria</span>
        </div>
        <div className="flex items-center gap-4">
          {session?.user?.image && (
            <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full border border-white/10" />
          )}
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.5)" }}>{session?.user?.name}</span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-[13px] font-medium px-4 py-2 rounded-lg border border-white/10 transition-all hover:bg-white/5"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* welcome */}
      <div className="max-w-[1100px] mx-auto">
        <h1 className="font-extrabold text-white tracking-[-0.02em] mb-2" style={{ fontSize: "clamp(24px, 3vw, 36px)" }}>
          Welcome, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-[14px] mb-10" style={{ color: "rgba(255,255,255,0.4)" }}>
          Paste a GitHub repo URL below to start analyzing.
        </p>

        {/* repo input */}
        <div className="flex items-center gap-3 p-4 rounded-xl border border-white/10 mb-10" style={{ background: "rgba(255,255,255,0.03)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <input
            type="text"
            placeholder="https://github.com/your-org/your-repo"
            className="flex-1 bg-transparent text-[14px] outline-none font-mono"
            style={{ color: "rgba(255,255,255,0.6)" }}
          />
          <button
            className="text-[13px] font-semibold text-[#07061a] bg-white rounded-lg px-5 py-2 hover:bg-white/90 transition-all"
          >
            Analyze →
          </button>
        </div>

        {/* empty state */}
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border border-white/10 border-dashed" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
          </div>
          <p className="text-[14px] font-medium text-white mb-1">No repos analyzed yet</p>
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.3)" }}>Paste a GitHub URL above to get started</p>
        </div>
      </div>
    </div>
  );
}
