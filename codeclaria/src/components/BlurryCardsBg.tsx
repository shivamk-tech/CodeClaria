import DemoCard from "./DemoCard";

import { Link, Brain, GitPullRequest, BarChart2, Network, MessageCircle, Lock } from "lucide-react";

const FEATURES = [
  {
    icon: <Link size={18} color="#2563eb" />,
    title: "Paste Any Repo URL",
    desc: "Drop a GitHub link. We clone it, read every file, and get to work — no setup needed.",
    badge: "Input",
    badgeColor: { background: "#dbeafe", color: "#1d4ed8" },
    files: [{ name: "github.com/user/repo", label: "URL" }],
  },
  {
    icon: <Brain size={18} color="#6d28d9" />,
    title: "AI Code Explanation",
    desc: "Plain-English breakdown of what the codebase does, how it's structured, and how every piece connects.",
    badge: "AI",
    badgeColor: { background: "#ede9fe", color: "#6d28d9" },
    files: [
      { name: "app/router.ts", label: "TS" },
      { name: "middleware.ts", label: "TS" },
    ],
  },
  {
    icon: <GitPullRequest size={18} color="#15803d" />,
    title: "Auto PR Reviews",
    desc: "Webhook fires on PR open. GPT-4o reviews the diff and posts inline comments on GitHub.",
    badge: "Webhook",
    badgeColor: { background: "#dcfce7", color: "#15803d" },
    files: [
      { name: "pull_request.diff", label: "PR" },
      { name: "review-comments.ts", label: "TS" },
    ],
  },
  {
    icon: <BarChart2 size={18} color="#a16207" />,
    title: "Code Health Score",
    desc: "Per-file quality scores, cleanliness ratings, and update recommendations tracked across every PR.",
    badge: "Score",
    badgeColor: { background: "#fef9c3", color: "#a16207" },
    files: [
      { name: "health-score.ts", label: "TS" },
      { name: "analytics.ts", label: "TS" },
    ],
  },
  {
    icon: <Network size={18} color="#be185d" />,
    title: "Dependency Graph",
    desc: "Interactive visual graph showing how every file depends on every other. Understand architecture instantly.",
    badge: "Graph",
    badgeColor: { background: "#fce7f3", color: "#be185d" },
    files: [
      { name: "dep-graph.ts", label: "TS" },
      { name: "visualizer.tsx", label: "TSX" },
    ],
  },
  {
    icon: <MessageCircle size={18} color="#065f46" />,
    title: "Chat with Repo",
    desc: 'Ask "where is auth handled?" and get an instant, accurate, context-aware answer from the AI.',
    badge: "Chat",
    badgeColor: { background: "#d1fae5", color: "#065f46" },
    files: [
      { name: "chat-handler.ts", label: "TS" },
      { name: "context-builder.ts", label: "TS" },
    ],
  },
  {
    icon: <Lock size={18} color="#b91c1c" />,
    title: "GitHub OAuth",
    desc: "Secure login with GitHub OAuth. Connect your account and start analyzing repos in one click.",
    badge: "Auth",
    badgeColor: { background: "#fee2e2", color: "#b91c1c" },
    files: [
      { name: "auth.config.ts", label: "TS" },
      { name: "session.ts", label: "TS" },
    ],
  },
];

function FeatureCards() {
  const positions = [
    { top: "0%",   left: "0%",    rotate: "-3deg"  },
    { top: "8%",   left: "38%",   rotate: "1.5deg"  },
    { top: "1%",   left: "72%",   rotate: "-1.5deg" },
    { top: "38%",  left: "12%",   rotate: "2deg"    },
    { top: "42%",  left: "48%",   rotate: "-2deg"   },
    { top: "35%",  left: "78%",   rotate: "3deg"    },
    { top: "72%",  left: "25%",   rotate: "-1deg"   },
  ];

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-[11px] font-medium px-4 py-[6px] rounded-full mb-4"
          style={{ color: "#a78bfa", border: "1px solid rgba(167,139,250,0.2)", background: "rgba(167,139,250,0.07)" }}
        >
          ✦ Features
        </div>
        <h2 className="font-extrabold text-white tracking-[-0.02em] leading-[1.1] mb-3"
          style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
        >
          Everything in one place.
        </h2>
        <p className="text-[14px] max-w-[400px] mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
          From repo URL to full AI-powered insights in seconds.
        </p>
      </div>

      <div className="relative h-[1100px]">
        {FEATURES.map((feat, i) => {
          const pos = positions[i];
          return (
            <div
              key={feat.title}
              className="absolute w-[240px] rounded-2xl p-4 shadow-2xl transition-transform duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(241, 240, 255, 0.97)",
                top: pos.top,
                left: pos.left,
                transform: `rotate(${pos.rotate})`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#f1f0ff" }}>
                  {feat.icon}
                </div>
                <span className="text-[12px] font-bold text-gray-800">{feat.title}</span>
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0" style={feat.badgeColor}>
                  {feat.badge}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-3">{feat.desc}</p>
              <div className="rounded-lg p-2 space-y-1.5" style={{ background: "#f8f7ff", border: "1px solid #ebe8ff" }}>
                {feat.files.map((f) => (
                  <div key={f.name} className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={feat.badgeColor}>
                      {f.label}
                    </span>
                    <span className="font-semibold text-gray-700">{f.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AuroraBackground({
    children,
}: {
    children?: React.ReactNode;
}) {
    return (
        <div className="relative w-full min-h-screen overflow-hidden" style={{ background: "#07061a" }}>

            {/* base dark blue-gray gradient */}
            <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(160deg, #0d0b1f 0%, #07061a 40%, #07061a 100%)" }}
            />

            {/* big soft purple bloom top-center */}
            <div
                className="absolute"
                style={{
                    top: "-120px", left: "50%", transform: "translateX(-50%)",
                    width: "700px", height: "500px",
                    background: "radial-gradient(ellipse at 50% 20%, rgba(139, 92, 246, 0.45) 0%, rgba(109, 40, 217, 0.2) 35%, rgba(76, 29, 149, 0.08) 60%, transparent 75%)",
                    filter: "blur(40px)",
                }}
            />

            {/* slightly brighter core at top-center */}
            <div
                className="absolute"
                style={{
                    top: "-60px", left: "50%", transform: "translateX(-50%)",
                    width: "320px", height: "260px",
                    background: "radial-gradient(ellipse at 50% 10%, rgba(192, 132, 252, 0.5) 0%, rgba(167, 139, 250, 0.2) 45%, transparent 70%)",
                    filter: "blur(24px)",
                }}
            />

            {/* faint pink tinge */}
            <div
                className="absolute"
                style={{
                    top: "-40px", left: "50%", transform: "translateX(-50%)",
                    width: "200px", height: "160px",
                    background: "radial-gradient(ellipse at 50% 0%, rgba(232, 121, 249, 0.3) 0%, transparent 65%)",
                    filter: "blur(16px)",
                }}
            />

            {/* subtle blue tint lower area */}
            <div
                className="absolute inset-0"
                style={{ background: "radial-gradient(ellipse 80% 50% at 50% 100%, rgba(30, 58, 138, 0.15) 0%, transparent 70%)" }}
            />

            {/* fade in from top */}
            <div
                className="absolute top-0 left-0 right-0 h-40 z-10 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, #07061a, transparent)" }}
            />
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-24">
                {children ?? <FeatureCards />}
            </div>
        </div>
    );
}
