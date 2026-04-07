"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import DependencyGraph from "@/components/DependencyGraph";
import ChatWithRepo from "@/components/ChatWithRepo";

function AnalyzeContent() {
    const searchParams = useSearchParams();
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState("");
    const [parsed, setParsed] = useState<any>(null);
    const [deps, setDeps] = useState<{ files: string[], dependencies: Record<string, string[]> } | null>(null);
    const [filesContent, setFilesContent] = useState<Record<string, string>>({});

    const handleAnalyze = async (analyzeUrl?: string) => {
        const target = (analyzeUrl || url).trim();
        if (!target) return;
        const finalUrl = target.startsWith("http") ? target : `https://github.com/${target}`;
        try {
            setLoading(true);
            setParsed(null);
            setResult("");
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: finalUrl }),
            });
            const data = await res.json();
            setResult(data.result);
            setDeps({ files: data.files || [], dependencies: data.dependencies || {} });
            setFilesContent(data.filesContent || {});
            console.log(`📁 Total files found: ${data.totalFiles}`);
            console.log(`📊 Files analyzed: ${data.analyzedFiles}`);
            console.log("📂 File contents:", data.filesContent);
            try {
                const jsonMatch = data.result.match(/\{[\s\S]*\}/);
                if (jsonMatch) setParsed(JSON.parse(jsonMatch[0]));
            } catch {}
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlParam = searchParams.get("url");
        if (urlParam) {
            setUrl(urlParam);
            handleAnalyze(urlParam);
        }
    }, []);

    const repoName = url.replace("https://github.com/", "");

    return (
        <div className="min-h-screen" style={{ background: "#07061a", fontFamily: "'DM Sans', sans-serif", color: "#fff" }}>
            <Nav />

            {/* hero input section */}
            <div className="flex flex-col items-center justify-center px-6 pt-40 pb-16">
                <p className="text-[12px] uppercase tracking-[0.15em] mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                    Code Intelligence
                </p>
                <h1 className="font-bold text-white text-center mb-3" style={{ fontSize: "clamp(26px, 4vw, 44px)", letterSpacing: "-0.02em" }}>
                    Drop a repo. Get the full picture.
                </h1>
                <p className="text-[14px] text-center mb-10 max-w-[400px]" style={{ color: "rgba(255,255,255,0.35)" }}>
                    AI reads every file and tells you exactly what's going on.
                </p>

                {/* input row */}
                <div className="w-full max-w-[580px] flex gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border" style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeLinecap="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                            placeholder="github.com/vercel/next.js"
                            className="flex-1 bg-transparent text-[13px] outline-none font-mono"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                        />
                    </div>
                    <button
                        onClick={() => handleAnalyze()}
                        suppressHydrationWarning
                        className="px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all"
                        style={{ background: "#fff", color: "#07061a", opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto" }}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                                Running...
                            </span>
                        ) : "Analyze"}
                    </button>
                </div>

                {/* quick picks */}
                <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>e.g.</span>
                    {["vercel/next.js", "prisma/prisma", "supabase/supabase"].map((r) => (
                        <button key={r} onClick={() => setUrl(`https://github.com/${r}`)}
                            className="text-[11px] font-mono px-2 py-[2px] rounded transition-colors hover:text-white/60"
                            style={{ color: "rgba(255,255,255,0.25)" }}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* results */}
            {parsed && (
                <div className="max-w-[1000px] mx-auto px-6 pb-24">

                    {/* repo label */}
                    <div className="flex items-center gap-3 mb-8 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-[13px] font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>{repoName}</span>
                        <span className="text-[11px] px-2 py-[2px] rounded" style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.2)" }}>
                            Analysis ready
                        </span>
                    </div>

                    {/* dependency graph */}
                    {deps && deps.files.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>Dependency Graph</h2>
                            <DependencyGraph files={deps.files} dependencies={deps.dependencies} />
                        </div>
                    )}

                    {/* chat with repo */}
                    <div className="mb-8">
                        <h2 className="text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>Chat with Repo</h2>
                        <ChatWithRepo repoUrl={url} filesContent={filesContent} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* left col */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* summary */}
                            <div>
                                <h2 className="text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>What this repo does</h2>
                                <p className="text-[15px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.75)" }}>{parsed.summary}</p>
                            </div>

                            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

                            {/* architecture */}
                            {parsed.architecture && (
                                <div>
                                    <h2 className="text-[11px] uppercase tracking-[0.12em] mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>Architecture</h2>
                                    <p className="text-[14px] leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>{parsed.architecture.overview}</p>

                                    {/* flow */}
                                    {parsed.architecture.flow?.length > 0 && (
                                        <div className="mb-5">
                                            <p className="text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Data flow</p>
                                            <div className="flex flex-wrap items-center gap-2">
                                                {parsed.architecture.flow.map((step: string, i: number) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <span className="text-[12px] px-3 py-1.5 rounded-md" style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>{step}</span>
                                                        {i < parsed.architecture.flow.length - 1 && (
                                                            <span style={{ color: "rgba(255,255,255,0.2)" }}>→</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* components */}
                                    {parsed.architecture.components?.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[11px] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>Key files</p>
                                            {parsed.architecture.components.map((c: any, i: number) => (
                                                <div key={i} className="flex items-start gap-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                                                    <code className="text-[12px] shrink-0 mt-[1px]" style={{ color: "#a78bfa" }}>{c.name}</code>
                                                    <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>{c.role}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

                            {/* issues */}
                            {parsed.issues?.length > 0 && (
                                <div>
                                    <h2 className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Issues — {parsed.issues.length} found</h2>
                                    <div className="space-y-3">
                                        {parsed.issues.map((issue: any, i: number) => {
                                            const s = issue.severity;
                                            const dot = s === "high" ? "#f87171" : s === "medium" ? "#facc15" : "#4ade80";
                                            return (
                                                <div key={i} className="py-3 pl-4" style={{ borderLeft: `2px solid ${dot}` }}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="text-[13px] font-medium text-white">{issue.title}</p>
                                                        <span className="text-[10px] capitalize px-1.5 py-[1px] rounded" style={{ color: dot, background: `${dot}15` }}>{s}</span>
                                                    </div>
                                                    <p className="text-[12px] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>{issue.description}</p>
                                                    <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>→ {issue.fix}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* right col — quality score */}
                        {parsed.code_quality && (
                            <div className="space-y-4">
                                <div className="p-5 rounded-xl" style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.07)" }}>
                                    <p className="text-[11px] uppercase tracking-[0.12em] mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>Quality Score</p>
                                    <div className="flex items-end gap-2 mb-1">
                                        <span className="text-[48px] font-bold leading-none text-white">{parsed.code_quality.score}</span>
                                        <span className="text-[18px] mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>/10</span>
                                    </div>
                                    <p className="text-[12px] mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
                                        {parsed.code_quality.score >= 8 ? "Excellent" : parsed.code_quality.score >= 6 ? "Good" : parsed.code_quality.score >= 4 ? "Needs work" : "Poor"}
                                    </p>
                                    {/* bar */}
                                    <div className="h-1 rounded-full w-full mb-5" style={{ background: "rgba(255,255,255,0.06)" }}>
                                        <div className="h-1 rounded-full" style={{ width: `${parsed.code_quality.score * 10}%`, background: parsed.code_quality.score >= 7 ? "#4ade80" : parsed.code_quality.score >= 5 ? "#facc15" : "#f87171" }} />
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>Strengths</p>
                                            {parsed.code_quality.strengths?.map((s: string, i: number) => (
                                                <p key={i} className="text-[12px] mb-1 flex items-start gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                                                    <span style={{ color: "#4ade80" }}>+</span>{s}
                                                </p>
                                            ))}
                                        </div>
                                        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)" }} />
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>Weaknesses</p>
                                            {parsed.code_quality.weaknesses?.map((w: string, i: number) => (
                                                <p key={i} className="text-[12px] mb-1 flex items-start gap-2" style={{ color: "rgba(255,255,255,0.5)" }}>
                                                    <span style={{ color: "#f87171" }}>−</span>{w}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AnalyzePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ background: "#07061a" }}>
                <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            </div>
        }>
            <AnalyzeContent />
        </Suspense>
    );
}
