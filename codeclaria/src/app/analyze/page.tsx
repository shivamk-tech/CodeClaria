"use client";

import { useState } from "react";
import Nav from "@/components/Nav";

export default function AnalyzePage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!url.trim()) return;

        try {
            setLoading(true);

            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url }),
            });

            const data = await res.json();
            console.log("RESULT:", data);

            // later → show result in UI
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden"
            style={{ background: "#07061a", fontFamily: "'DM Sans', sans-serif" }}
        >
            {/* bg glow */}
            <div
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(100px)" }}
            />

            <Nav />

            {/* content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 -mt-16">

                {/* badge */}
                <div
                    className="inline-flex items-center gap-2 text-[11px] font-medium px-4 py-[6px] rounded-full mb-6"
                    style={{ color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}
                >
                    ✦ No sign up required
                </div>

                <h1
                    className="font-extrabold text-white text-center tracking-[-0.03em] leading-[1.05] mb-4"
                    style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
                >
                    Analyze any GitHub repo.<br />
                    <span style={{ color: "rgba(255,255,255,0.4)" }}>Instantly.</span>
                </h1>

                <p
                    className="text-[15px] text-center mb-10 max-w-[480px]"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                >
                    Paste a public GitHub repo URL and get a full AI-powered breakdown — no account needed.
                </p>

                {/* input */}
                <div className="w-full max-w-[620px]">
                    <div
                        className="flex items-center gap-3 rounded-xl px-4 py-3 border transition-all"
                        style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.1)",
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                            placeholder="https://github.com/vercel/next.js"
                            className="flex-1 bg-transparent text-[14px] outline-none font-mono placeholder:text-white/20"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={loading || !url.trim()}
                            className="shrink-0 text-[13px] font-semibold text-[#07061a] bg-white rounded-lg px-5 py-2 hover:bg-white/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full border-2 border-[#07061a]/30 border-t-[#07061a] animate-spin" />
                                    Analyzing...
                                </span>
                            ) : (
                                "Analyze →"
                            )}
                        </button>
                    </div>

                    {/* examples */}
                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>Try:</span>
                        {[
                            "vercel/next.js",
                            "prisma/prisma",
                            "supabase/supabase",
                        ].map((repo) => (
                            <button
                                key={repo}
                                onClick={() => setUrl(`https://github.com/${repo}`)}
                                className="text-[11px] font-mono px-2 py-[3px] rounded-md transition-all hover:border-white/20 hover:text-white/50"
                                style={{ color: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                            >
                                {repo}
                            </button>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
