"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionId =
  | "introduction" | "quick-start" | "installation"
  | "repo-analysis" | "ai-explanations" | "pr-review"
  | "commit-review" | "dependency-graph" | "chat-with-repo"
  | "github-app-install" | "webhooks" | "permissions"
  | "authentication" | "endpoints" | "rate-limits"
  | "self-hosting" | "env-vars" | "troubleshooting";

interface NavItem { id: SectionId; label: string; }
interface NavGroup { title: string; items: NavItem[]; }

// ─── Nav structure ────────────────────────────────────────────────────────────

const NAV: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { id: "introduction", label: "Introduction" },
      { id: "quick-start", label: "Quick Start" },
      { id: "installation", label: "Installation" },
    ],
  },
  {
    title: "Core Features",
    items: [
      { id: "repo-analysis", label: "Repo Analysis" },
      { id: "ai-explanations", label: "AI Explanations" },
      { id: "pr-review", label: "PR Review" },
      { id: "commit-review", label: "Commit Review" },
      { id: "dependency-graph", label: "Dependency Graph" },
      { id: "chat-with-repo", label: "Chat with Repo" },
    ],
  },
  {
    title: "GitHub App",
    items: [
      { id: "github-app-install", label: "Installation" },
      { id: "webhooks", label: "Webhooks" },
      { id: "permissions", label: "Permissions" },
    ],
  },
  {
    title: "API Reference",
    items: [
      { id: "authentication", label: "Authentication" },
      { id: "endpoints", label: "Endpoints" },
      { id: "rate-limits", label: "Rate Limits" },
    ],
  },
  {
    title: "Guides",
    items: [
      { id: "self-hosting", label: "Self Hosting" },
      { id: "env-vars", label: "Environment Variables" },
      { id: "troubleshooting", label: "Troubleshooting" },
    ],
  },
];

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: "#07061a",
  purple: "#a78bfa",
  blue: "#60a5fa",
  glass: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.5)",
  subtle: "rgba(255,255,255,0.25)",
};

// ─── Shared content styles ────────────────────────────────────────────────────
const h2: React.CSSProperties = {
  fontSize: 18, fontWeight: 700, color: "#fff", margin: "28px 0 12px",
  fontFamily: "'DM Sans', sans-serif", scrollMarginTop: 100,
};
const p: React.CSSProperties = {
  color: "rgba(255,255,255,0.55)", fontSize: 14.5, lineHeight: 1.7, margin: "0 0 16px",
};
const ul: React.CSSProperties = { paddingLeft: 20, margin: "0 0 20px" };
const li: React.CSSProperties = {
  color: "rgba(255,255,255,0.55)", fontSize: 14.5, lineHeight: 1.7, marginBottom: 6,
};
const inlineCode: React.CSSProperties = {
  background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)",
  borderRadius: 4, color: "#c4b5fd", fontFamily: "monospace", fontSize: 13, padding: "1px 6px",
};
const link: React.CSSProperties = { color: C.purple, textDecoration: "none" };

// ─── Reusable components ──────────────────────────────────────────────────────

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ position: "relative", background: "rgba(0,0,0,0.4)", border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 16px", borderBottom: `1px solid ${C.border}`, background: "rgba(255,255,255,0.02)" }}>
        <span style={{ color: C.subtle, fontSize: 12, fontFamily: "monospace" }}>{language}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          style={{ background: copied ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.05)", border: `1px solid ${copied ? C.purple : C.border}`, borderRadius: 6, color: copied ? C.purple : C.muted, cursor: "pointer", fontSize: 11, padding: "3px 10px", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}
        >{copied ? "Copied!" : "Copy"}</button>
      </div>
      <pre style={{ margin: 0, padding: "16px 20px", overflowX: "auto", fontSize: 13, lineHeight: 1.7, color: "#e2e8f0", fontFamily: "'Fira Code', 'Cascadia Code', monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Callout({ type, title, children }: { type: "info" | "warning" | "tip"; title: string; children: React.ReactNode }) {
  const meta = {
    info: { icon: "ℹ", color: C.blue, bg: "rgba(96,165,250,0.07)", border: "rgba(96,165,250,0.25)" },
    warning: { icon: "⚠", color: "#fbbf24", bg: "rgba(251,191,36,0.07)", border: "rgba(251,191,36,0.25)" },
    tip: { icon: "✦", color: C.purple, bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.25)" },
  }[type];
  return (
    <div style={{ background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12 }}>
      <span style={{ color: meta.color, fontSize: 16, marginTop: 1 }}>{meta.icon}</span>
      <div>
        <div style={{ color: meta.color, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{title}</div>
        <div style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.6 }}>{children}</div>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
      <div style={{ flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,rgba(167,139,250,0.3),rgba(96,165,250,0.2))", border: "1px solid rgba(167,139,250,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: C.purple, fontWeight: 700, fontSize: 13 }}>{n}</div>
      </div>
      <div style={{ flex: 1, paddingTop: 4 }}>
        <div style={{ color: C.text, fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{title}</div>
        <div style={{ color: C.muted, fontSize: 14, lineHeight: 1.65 }}>{children}</div>
      </div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: 20, borderRadius: 10, border: `1px solid ${C.border}` }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderBottom: `1px solid ${C.border}`, color: C.muted, fontWeight: 600, fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : "none" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: "10px 14px", color: j === 0 ? "#c4b5fd" : C.muted, fontFamily: j === 0 ? "monospace" : "inherit", fontSize: j === 0 ? 13 : 13.5 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionTitle({ title, desc, badge }: { title: string; desc: string; badge?: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      {badge && (
        <span style={{ display: "inline-block", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 20, color: C.purple, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", padding: "3px 10px", marginBottom: 12, textTransform: "uppercase" }}>{badge}</span>
      )}
      <h1 style={{ fontSize: 30, fontWeight: 700, color: C.text, margin: "0 0 10px", lineHeight: 1.25, fontFamily: "'DM Sans', sans-serif" }}>{title}</h1>
      <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.65, margin: 0 }}>{desc}</p>
      <div style={{ height: 1, background: C.border, marginTop: 28 }} />
    </div>
  );
}

// ─── 3D Wireframe Orb ────────────────────────────────────────────────────────

function ThreeOrb() {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let animId: number;
    let renderer: any;
    (async () => {
      const THREE = await import("three");
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
      camera.position.z = 4;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountRef.current.appendChild(renderer.domElement);

      const outerGeo = new THREE.IcosahedronGeometry(1.5, 1);
      const outerMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, transparent: true, opacity: 0.3 });
      const outer = new THREE.Mesh(outerGeo, outerMat);
      scene.add(outer);

      const innerGeo = new THREE.IcosahedronGeometry(0.9, 0);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.18 });
      const inner = new THREE.Mesh(innerGeo, innerMat);
      scene.add(inner);

      const ptGeo = new THREE.BufferGeometry();
      const count = 100;
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 5;
      ptGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const ptMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.025, transparent: true, opacity: 0.45 });
      scene.add(new THREE.Points(ptGeo, ptMat));

      const animate = () => {
        animId = requestAnimationFrame(animate);
        outer.rotation.x += 0.0025;
        outer.rotation.y += 0.004;
        inner.rotation.x -= 0.003;
        inner.rotation.y -= 0.002;
        renderer.render(scene, camera);
      };
      animate();
    })();
    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      if (mountRef.current) mountRef.current.innerHTML = "";
    };
  }, []);
  return <div ref={mountRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />;
}

// ─── Doc Sections Content ─────────────────────────────────────────────────────

type SectionDef = { toc: string[]; content: () => JSX.Element };

const SECTIONS: Record<SectionId, SectionDef> = {
  introduction: {
    toc: ["What is CodeClaria", "How it works", "Tech stack", "Key concepts"],
    content: () => (
      <>
        <SectionTitle badge="Getting Started" title="Introduction to CodeClaria" desc="An AI-powered code intelligence platform that helps you understand, review, and navigate any GitHub repository." />
        <h2 id="what-is-codeclaria" style={h2}>What is CodeClaria?</h2>
        <p style={p}>CodeClaria connects to your GitHub repositories and provides deep AI-powered insights — from automated PR reviews to full codebase explanations. Built for engineers who want to move faster without sacrificing code quality.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, margin: "24px 0" }}>
          {[
            { icon: "⬡", t: "Repo Analysis", d: "Health scores, issue detection, quality metrics" },
            { icon: "✦", t: "AI Explanations", d: "Plain-English summaries for every file" },
            { icon: "⟳", t: "Auto PR Review", d: "Inline GitHub comments posted automatically" },
            { icon: "◈", t: "Chat with Repo", d: "Ask natural language questions about code" },
          ].map(f => (
            <div key={f.t} style={{ background: C.glass, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
              <div style={{ color: C.purple, fontSize: 20, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ color: C.text, fontWeight: 600, fontSize: 13.5, marginBottom: 4 }}>{f.t}</div>
              <div style={{ color: C.muted, fontSize: 13 }}>{f.d}</div>
            </div>
          ))}
        </div>
        <h2 id="how-it-works" style={h2}>How it works</h2>
        <Step n={1} title="Connect your repository">Paste a GitHub URL or install the CodeClaria GitHub App. OAuth via NextAuth v4 authenticates your account securely.</Step>
        <Step n={2} title="AI analyses your codebase">Groq's llama-3.3-70b and Google Gemini parse and reason about your repository — generating a health score, file explanations, and dependency graph.</Step>
        <Step n={3} title="Automation kicks in">Once the GitHub App is installed, webhooks trigger automatically on every PR or push to main — zero manual setup.</Step>
        <h2 id="tech-stack" style={h2}>Tech Stack</h2>
        <Table headers={["Layer", "Technology", "Purpose"]} rows={[
          ["Frontend", "Next.js 16 + React 19", "App router, server components"],
          ["Auth", "NextAuth v4", "GitHub OAuth flow"],
          ["Database", "MongoDB + Mongoose", "Repo metadata, analysis cache"],
          ["AI", "Groq llama-3.3-70b + Gemini", "Code reasoning & explanations"],
          ["Visualisation", "Three.js, D3.js, @xyflow/react", "3D orbs, dependency graphs, flow diagrams"],
          ["Styling", "Tailwind CSS v4 + shadcn/ui", "Design system"],
        ]} />
        <h2 id="key-concepts" style={h2}>Key Concepts</h2>
        <Callout type="tip" title="Analysis vs Automation"><strong>Analysis</strong> is triggered manually by pasting a GitHub URL. <strong>Automation</strong> (PR Review, Commit Review) requires the GitHub App and fires on every relevant event.</Callout>
      </>
    ),
  },
  "quick-start": {
    toc: ["Prerequisites", "1-minute setup", "First analysis", "Next steps"],
    content: () => (
      <>
        <SectionTitle badge="Getting Started" title="Quick Start" desc="Get up and running with CodeClaria in under 5 minutes." />
        <h2 id="prerequisites" style={h2}>Prerequisites</h2>
        <ul style={ul}>
          <li style={li}>Node.js 20+ and npm/pnpm</li>
          <li style={li}>A GitHub account (for OAuth)</li>
          <li style={li}>MongoDB Atlas URI (free tier works)</li>
          <li style={li}>Groq API key — free at <a href="https://console.groq.com" style={link} target="_blank">console.groq.com</a></li>
        </ul>
        <h2 id="1-minute-setup" style={h2}>1-Minute Setup</h2>
        <CodeBlock language="bash" code={`git clone https://github.com/your-org/codeclaria
cd codeclaria
pnpm install
cp .env.example .env.local
# Fill in your .env.local, then:
pnpm dev
# → http://localhost:3000`} />
        <h2 id="first-analysis" style={h2}>First Analysis</h2>
        <Step n={1} title="Sign in with GitHub">Click Sign In at the top-right. This grants read access to your public repositories.</Step>
        <Step n={2} title="Paste a repository URL">On the dashboard, enter any public GitHub URL — e.g. <code style={inlineCode}>https://github.com/vercel/next.js</code>.</Step>
        <Step n={3} title="View your results">Within seconds you'll see a health score, file tree, AI explanations, and a dependency graph.</Step>
        <h2 id="next-steps" style={h2}>Next Steps</h2>
        <Callout type="info" title="Enable automation">Install the <a href="#github-app-install" style={link}>GitHub App</a> to unlock PR Review and Commit Review — fully automatic, zero config.</Callout>
      </>
    ),
  },
  installation: {
    toc: ["Clone & install", "Environment setup", "Database setup", "Running in production"],
    content: () => (
      <>
        <SectionTitle badge="Getting Started" title="Installation" desc="Detailed setup for local development and production deployment." />
        <h2 id="clone-install" style={h2}>Clone & Install</h2>
        <CodeBlock language="bash" code={`git clone https://github.com/your-org/codeclaria
cd codeclaria
pnpm install`} />
        <h2 id="environment-setup" style={h2}>Environment Setup</h2>
        <CodeBlock language="bash" code={`NEXTAUTH_SECRET=your-random-secret-min-32-chars
NEXTAUTH_URL=http://localhost:3000
GITHUB_CLIENT_ID=your-github-oauth-app-id
GITHUB_CLIENT_SECRET=your-github-oauth-app-secret
GITHUB_APP_ID=123456
GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n..."
GITHUB_WEBHOOK_SECRET=your-webhook-hmac-secret
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codeclaria
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...`} />
        <h2 id="database-setup" style={h2}>Database Setup</h2>
        <p style={p}>Create a free cluster at <a href="https://cloud.mongodb.com" target="_blank" style={link}>cloud.mongodb.com</a> and copy your connection URI into <code style={inlineCode}>MONGODB_URI</code>.</p>
        <Callout type="warning" title="IP Allowlist">In MongoDB Atlas, add <code style={inlineCode}>0.0.0.0/0</code> to Network Access for local dev, or your specific IP / Vercel CIDR for production.</Callout>
        <h2 id="running-production" style={h2}>Running in Production</h2>
        <CodeBlock language="bash" code={`pnpm build && pnpm start
# Or push to GitHub and deploy with Vercel — zero additional config needed`} />
      </>
    ),
  },
  "repo-analysis": {
    toc: ["Overview", "Health score", "Issue detection", "API usage"],
    content: () => (
      <>
        <SectionTitle badge="Core Features" title="Repo Analysis" desc="Paste a GitHub URL and receive a comprehensive AI-powered health report in seconds." />
        <h2 id="overview" style={h2}>Overview</h2>
        <p style={p}>Repo Analysis fetches repository contents via the GitHub REST API, runs them through Groq's llama-3.3-70b model, and returns a structured health report with a numeric score and categorised issue list.</p>
        <h2 id="health-score" style={h2}>Health Score</h2>
        <Table headers={["Dimension", "Weight", "What's checked"]} rows={[
          ["Code Quality", "25%", "Complexity, duplication, anti-patterns"],
          ["Documentation", "20%", "README, inline comments, JSDoc coverage"],
          ["Test Coverage", "20%", "Test file presence, coverage config"],
          ["Dependencies", "15%", "Outdated packages, known CVEs"],
          ["Structure", "10%", "Folder conventions, separation of concerns"],
          ["Security", "10%", "Hardcoded secrets, unsafe patterns"],
        ]} />
        <h2 id="issue-detection" style={h2}>Issue Detection</h2>
        <p style={p}>Issues are categorised as <strong style={{ color: "#f87171" }}>Critical</strong>, <strong style={{ color: "#fbbf24" }}>Warning</strong>, or <strong style={{ color: C.blue }}>Info</strong>. Each includes an affected file path, line range, plain-English description, and suggested fix.</p>
        <h2 id="api-usage" style={h2}>Triggering via API</h2>
        <CodeBlock language="bash" code={`curl -X POST https://your-domain/api/analyse \\
  -H "Authorization: Bearer cc_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{ "repoUrl": "https://github.com/owner/repo" }'`} />
        <CodeBlock language="json" code={`{
  "id": "64f3a1b2c8e4f5d6e7a8b9c0",
  "healthScore": 82,
  "issues": [
    {
      "severity": "warning",
      "file": "src/lib/db.ts",
      "description": "Database connection not pooled",
      "suggestion": "Use a singleton Mongoose connection pattern"
    }
  ],
  "analysedAt": "2025-11-14T10:32:00Z"
}`} />
      </>
    ),
  },
  "ai-explanations": {
    toc: ["How it works", "File metadata", "Tags & roles", "Example output"],
    content: () => (
      <>
        <SectionTitle badge="Core Features" title="AI File Explanations" desc="Every file gets a plain-English summary, semantic tags, and its architectural role." />
        <h2 id="how-it-works" style={h2}>How It Works</h2>
        <p style={p}>After a repo is analysed, each file's content (with surrounding context) is passed to Google Gemini. Explanations are stored in MongoDB and surfaced in the file tree panel.</p>
        <h2 id="file-metadata" style={h2}>File Metadata Schema</h2>
        <CodeBlock language="json" code={`{
  "path": "src/lib/auth.ts",
  "summary": "Configures NextAuth v4 with GitHub OAuth. Exports authOptions used by the [...nextauth] route handler. Handles session callbacks and JWT token enrichment.",
  "role": "Authentication configuration",
  "complexity": "low",
  "linesOfCode": 84,
  "tags": ["auth", "oauth", "nextauth", "session"]
}`} />
        <h2 id="tags-roles" style={h2}>Tags & Roles</h2>
        <Table headers={["Role", "Typical files"]} rows={[
          ["API route handler", "app/api/**/route.ts"],
          ["Database model", "models/*.ts, lib/db/*.ts"],
          ["UI component", "components/**/*.tsx"],
          ["Authentication config", "lib/auth.ts, [...nextauth]"],
          ["Utility / helper", "lib/utils.ts, helpers/**"],
          ["Type definitions", "types/**/*.ts, *.d.ts"],
        ]} />
        <h2 id="example-output" style={h2}>Quality Note</h2>
        <Callout type="tip" title="Repository-wide context">Explanations are generated with awareness of the full file tree — Gemini sees the entire directory structure before explaining any individual file, ensuring roles and cross-file dependencies are accurate.</Callout>
      </>
    ),
  },
  "pr-review": {
    toc: ["How it works", "Webhook flow", "Comment format", "Configuration"],
    content: () => (
      <>
        <SectionTitle badge="Core Features" title="PR Review" desc="Automatic AI code review on every pull request — inline comments posted directly to GitHub." />
        <h2 id="how-it-works" style={h2}>How It Works</h2>
        <Step n={1} title="PR is opened on GitHub">GitHub fires a pull_request webhook event to CodeClaria's endpoint.</Step>
        <Step n={2} title="Diff is fetched & analysed">CodeClaria fetches the PR diff, splits it into logical chunks, and sends each to Groq for review.</Step>
        <Step n={3} title="Comments are posted">Using the GitHub REST API, inline review comments are posted directly to the changed lines.</Step>
        <h2 id="webhook-flow" style={h2}>Webhook Handler</h2>
        <CodeBlock language="typescript" code={`// app/api/webhooks/github/route.ts
export async function POST(req: Request) {
  const payload = await req.json();
  const event = req.headers.get("x-github-event");

  if (event === "pull_request" && payload.action === "opened") {
    await reviewPullRequest({
      owner: payload.repository.owner.login,
      repo:  payload.repository.name,
      pullNumber:     payload.pull_request.number,
      installationId: payload.installation.id,
    });
  }
  return Response.json({ ok: true });
}`} />
        <h2 id="comment-format" style={h2}>Comment Format</h2>
        <div style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 20 }}>
          <div style={{ color: "#fbbf24", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>⚠ Warning — N+1 Query Risk</div>
          <div style={{ color: C.muted, fontSize: 13.5, lineHeight: 1.6 }}>This loop calls <code style={inlineCode}>findById</code> inside a <code style={inlineCode}>for...of</code> — one DB round-trip per iteration. Consider batching with <code style={inlineCode}>$in</code> to a single query.</div>
        </div>
        <h2 id="configuration" style={h2}>Configuration</h2>
        <Table headers={["Env var", "Default", "Description"]} rows={[
          ["REVIEW_MAX_FILES", "20", "Max files reviewed per PR"],
          ["REVIEW_SEVERITY_THRESHOLD", "warning", "Minimum severity to post (info/warning/critical)"],
          ["REVIEW_MODEL", "llama-3.3-70b-versatile", "Groq model used for review"],
          ["REVIEW_POST_SUMMARY", "true", "Post a top-level PR summary comment"],
        ]} />
      </>
    ),
  },
  "commit-review": {
    toc: ["Overview", "Trigger conditions", "Diff analysis", "Skipping reviews"],
    content: () => (
      <>
        <SectionTitle badge="Core Features" title="Commit Review" desc="Every push to main triggers an AI review — inline comments posted to the commit on GitHub." />
        <h2 id="overview" style={h2}>Overview</h2>
        <p style={p}>Commit Review listens for <code style={inlineCode}>push</code> webhook events on protected branches (default: <code style={inlineCode}>main</code>). It analyses the diff and posts review comments on the commit page in GitHub.</p>
        <Callout type="info" title="Commit vs PR Review">Commit Review catches direct pushes to main that bypass PRs. PR Review runs on pull requests regardless of target branch.</Callout>
        <h2 id="trigger-conditions" style={h2}>Trigger Conditions</h2>
        <ul style={ul}>
          <li style={li}>Branch matches <code style={inlineCode}>REVIEW_BRANCHES</code> (default: <code style={inlineCode}>main,master</code>)</li>
          <li style={li}>Commit message does not include <code style={inlineCode}>[skip-review]</code></li>
          <li style={li}>Changed files are not entirely in <code style={inlineCode}>REVIEW_IGNORE_PATHS</code></li>
        </ul>
        <h2 id="diff-analysis" style={h2}>Diff Analysis</h2>
        <CodeBlock language="typescript" code={`export async function reviewCommit(commit: CommitPayload) {
  const diff = await fetchCommitDiff(commit.sha, commit.repo);
  const chunks = splitDiff(diff, { maxLines: 150 });

  for (const chunk of chunks) {
    const review = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: CODE_REVIEW_PROMPT },
        { role: "user",   content: chunk.content },
      ],
    });

    await postCommitComment({
      sha:      commit.sha,
      path:     chunk.file,
      position: chunk.startLine,
      body:     review.choices[0].message.content ?? "",
    });
  }
}`} />
        <h2 id="skipping-reviews" style={h2}>Skipping Reviews</h2>
        <CodeBlock language="bash" code={`git commit -m "chore: update lockfile [skip-review]"`} />
      </>
    ),
  },
  "dependency-graph": {
    toc: ["Overview", "Graph rendering", "Interactivity", "Data format"],
    content: () => (
      <>
        <SectionTitle badge="Core Features" title="Dependency Graph" desc="An interactive D3.js force-directed graph visualising file import relationships across your repository." />
        <h2 id="overview" style={h2}>Overview</h2>
        <p style={p}>After analysis, CodeClaria parses all <code style={inlineCode}>import</code> and <code style={inlineCode}>require</code> statements to build a directed dependency graph rendered with D3.js and @xyflow/react.</p>
        <h2 id="graph-rendering" style={h2}>Graph Rendering</h2>
        <CodeBlock language="typescript" code={`"use client";
import * as d3 from "d3";
import { useEffect, useRef } from "react";

export function DependencyGraph({ nodes, edges }: GraphData) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const simulation = d3.forceSimulation(nodes)
      .force("link",   d3.forceLink(edges).id((d: any) => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));
    // ... render nodes & links
  }, [nodes, edges]);

  return <svg ref={svgRef} width={width} height={height} />;
}`} />
        <h2 id="interactivity" style={h2}>Interactivity</h2>
        <ul style={ul}>
          <li style={li}><strong style={{ color: C.text }}>Click a node</strong> — opens the file's AI explanation panel</li>
          <li style={li}><strong style={{ color: C.text }}>Hover</strong> — highlights direct imports and importers</li>
          <li style={li}><strong style={{ color: C.text }}>Drag</strong> — reposition nodes; simulation re-anchors</li>
          <li style={li}><strong style={{ color: C.text }}>Scroll to zoom</strong> — standard D3 zoom behaviour</li>
        </ul>
        <h2 id="data-format" style={h2}>Data Format</h2>
        <CodeBlock language="json" code={`{
  "nodes": [
    { "id": "src/lib/auth.ts",            "group": "lib", "loc": 84  },
    { "id": "src/app/api/analyse/route.ts","group": "api", "loc": 120 }
  ],
  "edges": [
    { "source": "src/app/api/analyse/route.ts", "target": "src/lib/auth.ts" }
  ]
}`} />
      </>
    ),
  },
  "chat-with-repo": {
    toc: ["Overview", "How context is built", "Example queries", "Limitations"],
    content: () => (
      <>
        <SectionTitle badge="Core Features" title="Chat with Repo" desc="Ask natural language questions about any analysed repository and get context-aware answers." />
        <h2 id="overview" style={h2}>Overview</h2>
        <p style={p}>After analysis, a conversational chat interface becomes available. The AI has access to the full file tree, AI summaries, and relevant file contents.</p>
        <h2 id="context-building" style={h2}>How Context Is Built</h2>
        <ul style={ul}>
          <li style={li}>Repository metadata (name, tech stack, health score)</li>
          <li style={li}>AI-generated file summaries (not raw code — token efficient)</li>
          <li style={li}>Relevant file contents retrieved via semantic similarity to the query</li>
          <li style={li}>Conversation history (last 10 turns)</li>
        </ul>
        <h2 id="example-queries" style={h2}>Example Queries</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
          {[
            "How does authentication work in this repo?",
            "Where is the database connection initialised?",
            "What API routes are available and what do they do?",
            "Are there any security vulnerabilities I should know about?",
            "How is state management structured across components?",
          ].map(q => (
            <div key={q} style={{ background: C.glass, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", color: C.muted, fontSize: 13.5, display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ color: C.purple }}>›</span> {q}
            </div>
          ))}
        </div>
        <h2 id="limitations" style={h2}>Limitations</h2>
        <Callout type="warning" title="Context window limits">For repositories with &gt;500 files, CodeClaria includes only the top 60 most-relevant files per query based on semantic similarity. Full file content is included only for files directly referenced in the question.</Callout>
      </>
    ),
  },
  "github-app-install": {
    toc: ["Installing the app", "What gets configured", "Uninstalling"],
    content: () => (
      <>
        <SectionTitle badge="GitHub App" title="GitHub App Installation" desc="Install the CodeClaria GitHub App to enable zero-config automated PR and commit reviews." />
        <h2 id="installing" style={h2}>Installing the App</h2>
        <Step n={1} title="Click 'Install GitHub App'">From the CodeClaria dashboard, click the button. You'll be redirected to GitHub's installation page.</Step>
        <Step n={2} title="Choose repositories">Select all repositories or specific ones. We recommend starting with one repo to test the integration.</Step>
        <Step n={3} title="Authorise">GitHub redirects back with an installation ID. CodeClaria stores this securely and immediately configures required webhooks — no manual setup.</Step>
        <Callout type="tip" title="Zero manual webhook setup">CodeClaria automatically registers all webhooks during installation using the GitHub App's installation access token.</Callout>
        <h2 id="what-configured" style={h2}>What Gets Configured</h2>
        <Table headers={["Webhook event", "Trigger", "Action"]} rows={[
          ["pull_request", "PR opened / synchronised", "AI PR Review → inline comments"],
          ["push", "Push to main/master", "AI Commit Review → commit comments"],
          ["installation", "App installed / removed", "Update DB installation record"],
          ["installation_repositories", "Repos added / removed", "Sync repo access list"],
        ]} />
        <h2 id="uninstalling" style={h2}>Uninstalling</h2>
        <p style={p}>Go to GitHub Settings → Applications → Installed GitHub Apps → CodeClaria → Uninstall. CodeClaria receives an <code style={inlineCode}>installation.deleted</code> event and removes all stored installation data.</p>
      </>
    ),
  },
  webhooks: {
    toc: ["Endpoint", "Signature verification", "Supported events", "Retry policy"],
    content: () => (
      <>
        <SectionTitle badge="GitHub App" title="Webhooks" desc="All GitHub events are routed through a single HMAC-verified webhook endpoint." />
        <h2 id="endpoint" style={h2}>Webhook Endpoint</h2>
        <CodeBlock language="bash" code={`POST https://your-domain.com/api/webhooks/github`} />
        <h2 id="signature" style={h2}>Signature Verification</h2>
        <CodeBlock language="typescript" code={`import { createHmac, timingSafeEqual } from "crypto";

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expected = createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET!)
    .update(payload)
    .digest("hex");
  return timingSafeEqual(
    Buffer.from("sha256=" + expected),
    Buffer.from(signature)
  );
}`} />
        <Callout type="warning" title="Never skip verification">Always verify webhook signatures. Skipping this allows anyone to spoof GitHub events and trigger AI reviews on arbitrary diffs.</Callout>
        <h2 id="events" style={h2}>Supported Events</h2>
        <Table headers={["Event", "Actions handled", "Feature"]} rows={[
          ["pull_request", "opened, synchronize", "PR Review"],
          ["push", "branches matching REVIEW_BRANCHES", "Commit Review"],
          ["installation", "created, deleted", "App lifecycle"],
          ["installation_repositories", "added, removed", "Repo access sync"],
        ]} />
        <h2 id="retry" style={h2}>Retry Policy</h2>
        <p style={p}>GitHub retries failed deliveries up to 3 times with exponential backoff. CodeClaria returns <code style={inlineCode}>200 OK</code> immediately and processes reviews asynchronously to avoid timeouts.</p>
      </>
    ),
  },
  permissions: {
    toc: ["Required permissions", "Why each is needed", "Minimal scope mode"],
    content: () => (
      <>
        <SectionTitle badge="GitHub App" title="Permissions" desc="CodeClaria requests the minimum GitHub permissions required to function." />
        <h2 id="required" style={h2}>Required Permissions</h2>
        <Table headers={["Permission", "Access", "Reason"]} rows={[
          ["Contents", "Read", "Fetch file tree and file contents for analysis"],
          ["Pull requests", "Read & Write", "Read diffs, post inline review comments"],
          ["Commit statuses", "Write", "Post commit-level review comments"],
          ["Metadata", "Read", "Required by all GitHub Apps"],
          ["Webhooks", "Read & Write", "Auto-configure webhook subscriptions"],
        ]} />
        <Callout type="info" title="We don't request broad access">CodeClaria does not request Issues, Discussions, Actions, or Secrets permissions — only the scopes listed above.</Callout>
        <h2 id="minimal-scope-mode" style={h2}>Minimal Scope Mode</h2>
        <p style={p}>If you only want Repo Analysis and Chat without automated reviews, install with <strong style={{ color: C.text }}>Contents: Read</strong> and <strong style={{ color: C.text }}>Metadata: Read</strong> only. Webhook automation will be disabled.</p>
      </>
    ),
  },
  authentication: {
    toc: ["GitHub OAuth", "API tokens", "Token format", "Revoking access"],
    content: () => (
      <>
        <SectionTitle badge="API Reference" title="Authentication" desc="GitHub OAuth for user login and bearer tokens for programmatic API access." />
        <h2 id="github-oauth" style={h2}>GitHub OAuth</h2>
        <CodeBlock language="typescript" code={`// lib/auth.ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token;
    },
  },
};`} />
        <h2 id="api-tokens" style={h2}>API Tokens</h2>
        <p style={p}>Generate a token from Settings → API Tokens and include it as a bearer header:</p>
        <CodeBlock language="bash" code={`curl https://your-domain.com/api/analyse \\
  -H "Authorization: Bearer cc_live_xxxxxxxxxxxxxxxxxxxx"`} />
        <h2 id="token-format" style={h2}>Token Format</h2>
        <Table headers={["Prefix", "Environment", "Expiry"]} rows={[
          ["cc_live_", "Production", "Never (revoke manually)"],
          ["cc_test_", "Development", "30 days"],
        ]} />
        <h2 id="revoking-access" style={h2}>Revoking Access</h2>
        <p style={p}>Tokens can be revoked from the dashboard Settings page. Revocation is immediate — subsequent API calls return <code style={inlineCode}>401 Unauthorized</code>.</p>
      </>
    ),
  },
  endpoints: {
    toc: ["Base URL", "Endpoints overview", "Request & response", "Error codes"],
    content: () => (
      <>
        <SectionTitle badge="API Reference" title="API Endpoints" desc="Full reference for all CodeClaria REST API endpoints." />
        <h2 id="base-url" style={h2}>Base URL</h2>
        <CodeBlock language="bash" code={`https://your-domain.com/api`} />
        <h2 id="endpoints-overview" style={h2}>Endpoints Overview</h2>
        <Table headers={["Method", "Path", "Description"]} rows={[
          ["POST", "/analyse", "Trigger repo analysis"],
          ["GET", "/repos/:id", "Get analysis result"],
          ["GET", "/repos/:id/files", "List files with AI explanations"],
          ["GET", "/repos/:id/graph", "Get dependency graph data"],
          ["POST", "/repos/:id/chat", "Send a chat message"],
          ["GET", "/tokens", "List API tokens"],
          ["POST", "/tokens", "Create a new API token"],
          ["DELETE", "/tokens/:id", "Revoke a token"],
        ]} />
        <h2 id="request-response" style={h2}>Request & Response Example</h2>
        <CodeBlock language="bash" code={`curl -X POST https://your-domain.com/api/analyse \\
  -H "Authorization: Bearer cc_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{ "repoUrl": "https://github.com/owner/repo" }'`} />
        <CodeBlock language="json" code={`{
  "id": "64f3a1b2c8e4f5d6e7a8b9c0",
  "status": "queued",
  "repoUrl": "https://github.com/owner/repo",
  "estimatedSeconds": 12
}`} />
        <h2 id="error-codes" style={h2}>Error Codes</h2>
        <Table headers={["HTTP", "Error", "Meaning"]} rows={[
          ["400", "INVALID_URL", "Repo URL is malformed or inaccessible"],
          ["401", "UNAUTHORIZED", "Missing or invalid bearer token"],
          ["403", "FORBIDDEN", "Token lacks required permissions"],
          ["404", "NOT_FOUND", "Repo or resource not found"],
          ["429", "RATE_LIMITED", "Too many requests — see Rate Limits"],
          ["500", "INTERNAL_ERROR", "Unexpected server error"],
        ]} />
      </>
    ),
  },
  "rate-limits": {
    toc: ["Limits by tier", "Response headers", "Handling 429s"],
    content: () => (
      <>
        <SectionTitle badge="API Reference" title="Rate Limits" desc="Per-token rate limits to ensure fair usage across all users." />
        <h2 id="limits-tier" style={h2}>Limits by Tier</h2>
        <Table headers={["Tier", "Analyses / hr", "Chat / hr", "Requests / min"]} rows={[
          ["Free", "5", "50", "30"],
          ["Pro", "50", "500", "120"],
          ["Team", "Unlimited", "Unlimited", "300"],
        ]} />
        <h2 id="response-headers" style={h2}>Response Headers</h2>
        <CodeBlock language="bash" code={`X-RateLimit-Limit: 30
X-RateLimit-Remaining: 27
X-RateLimit-Reset: 1731600000`} />
        <h2 id="handling-429s" style={h2}>Handling 429s</h2>
        <CodeBlock language="typescript" code={`async function fetchWithRetry(url: string, opts: RequestInit, retries = 3): Promise<Response> {
  const res = await fetch(url, opts);
  if (res.status === 429 && retries > 0) {
    const resetAt = Number(res.headers.get("X-RateLimit-Reset")) * 1000;
    const wait = Math.max(resetAt - Date.now() + 500, 1000);
    await new Promise(r => setTimeout(r, wait));
    return fetchWithRetry(url, opts, retries - 1);
  }
  return res;
}`} />
      </>
    ),
  },
  "self-hosting": {
    toc: ["Requirements", "Docker setup", "Nginx config", "Updates"],
    content: () => (
      <>
        <SectionTitle badge="Guides" title="Self Hosting" desc="Run CodeClaria on your own infrastructure with Docker or bare Node.js." />
        <h2 id="requirements" style={h2}>Requirements</h2>
        <ul style={ul}>
          <li style={li}>Node.js 20+ or Docker + Docker Compose</li>
          <li style={li}>MongoDB 7.0+ (or Atlas)</li>
          <li style={li}>4 GB RAM minimum (8 GB recommended for large repos)</li>
          <li style={li}>A public HTTPS domain (required for GitHub webhooks)</li>
        </ul>
        <h2 id="docker-setup" style={h2}>Docker Setup</h2>
        <CodeBlock language="yaml" code={`# docker-compose.yml
version: "3.9"
services:
  app:
    image: ghcr.io/your-org/codeclaria:latest
    ports:
      - "3000:3000"
    env_file: .env.production
    depends_on: [mongo]
  mongo:
    image: mongo:7
    volumes:
      - mongo_data:/data/db
volumes:
  mongo_data:`} />
        <CodeBlock language="bash" code={`docker compose up -d`} />
        <h2 id="nginx-config" style={h2}>Nginx Config</h2>
        <CodeBlock language="nginx" code={`server {
  listen 443 ssl;
  server_name codeclaria.yourdomain.com;
  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}`} />
        <h2 id="updates" style={h2}>Updates</h2>
        <CodeBlock language="bash" code={`docker compose pull && docker compose up -d --force-recreate`} />
      </>
    ),
  },
  "env-vars": {
    toc: ["All variables", "Required vs optional", "Generating secrets"],
    content: () => (
      <>
        <SectionTitle badge="Guides" title="Environment Variables" desc="Complete reference for all CodeClaria environment variables." />
        <h2 id="all-variables" style={h2}>All Variables</h2>
        <Table headers={["Variable", "Req", "Description"]} rows={[
          ["NEXTAUTH_SECRET", "✓", "Random secret for JWT signing (≥32 chars)"],
          ["NEXTAUTH_URL", "✓", "Full URL of your deployment"],
          ["GITHUB_CLIENT_ID", "✓", "GitHub OAuth App client ID"],
          ["GITHUB_CLIENT_SECRET", "✓", "GitHub OAuth App client secret"],
          ["GITHUB_APP_ID", "✓", "GitHub App numeric ID"],
          ["GITHUB_APP_PRIVATE_KEY", "✓", "GitHub App RSA private key (PEM)"],
          ["GITHUB_WEBHOOK_SECRET", "✓", "HMAC secret for webhook verification"],
          ["MONGODB_URI", "✓", "MongoDB connection string"],
          ["GROQ_API_KEY", "✓", "Groq API key (gsk_...)"],
          ["GEMINI_API_KEY", "✓", "Google Gemini API key"],
          ["REVIEW_BRANCHES", "–", "Comma-separated branches (default: main,master)"],
          ["REVIEW_MAX_FILES", "–", "Max files per review (default: 20)"],
          ["REVIEW_SEVERITY_THRESHOLD", "–", "Min severity to post (default: warning)"],
        ]} />
        <h2 id="generating-secrets" style={h2}>Generating Secrets</h2>
        <CodeBlock language="bash" code={`# NEXTAUTH_SECRET
openssl rand -base64 32

# GITHUB_WEBHOOK_SECRET
openssl rand -hex 20`} />
        <Callout type="warning" title="Never commit .env files">Add <code style={inlineCode}>.env.local</code> and <code style={inlineCode}>.env.production</code> to <code style={inlineCode}>.gitignore</code>. Use your hosting provider's secrets manager in production.</Callout>
      </>
    ),
  },
  troubleshooting: {
    toc: ["Common errors", "Webhook not firing", "Analysis stuck", "Getting help"],
    content: () => (
      <>
        <SectionTitle badge="Guides" title="Troubleshooting" desc="Solutions to the most common CodeClaria setup and runtime issues." />
        <h2 id="common-errors" style={h2}>Common Errors</h2>
        <Table headers={["Error", "Cause", "Fix"]} rows={[
          ["NEXTAUTH_URL mismatch", "URL doesn't match request origin", "Set NEXTAUTH_URL to your exact domain with protocol"],
          ["JWT decode failed", "NEXTAUTH_SECRET was rotated", "Re-login; all existing sessions are invalidated"],
          ["MongoDB ECONNREFUSED", "Wrong URI or IP not allowlisted", "Check Atlas Network Access settings"],
          ["GitHub 401 on webhook", "Wrong GITHUB_WEBHOOK_SECRET", "Regenerate and update both GitHub App and .env"],
          ["Groq 429 Too Many Requests", "Rate limit exceeded", "Upgrade plan or implement exponential backoff"],
        ]} />
        <h2 id="webhook-not-firing" style={h2}>Webhook Not Firing</h2>
        <ul style={ul}>
          <li style={li}>Check GitHub App → Advanced → Recent Deliveries for delivery logs</li>
          <li style={li}>Your server must be publicly reachable — use ngrok for local dev</li>
          <li style={li}>Verify <code style={inlineCode}>GITHUB_WEBHOOK_SECRET</code> matches the value in your GitHub App settings</li>
        </ul>
        <CodeBlock language="bash" code={`# Expose localhost with ngrok for local webhook testing
npx ngrok http 3000
# Use the HTTPS ngrok URL in your GitHub App webhook settings`} />
        <h2 id="analysis-stuck" style={h2}>Analysis Stuck</h2>
        <ul style={ul}>
          <li style={li}>Check server logs for Groq / Gemini API errors</li>
          <li style={li}>Very large repos (&gt;1000 files) may timeout — set <code style={inlineCode}>ANALYSE_MAX_FILES</code> to limit scope</li>
          <li style={li}>Restart from the dashboard — duplicate analyses are deduplicated automatically</li>
        </ul>
        <h2 id="getting-help" style={h2}>Getting Help</h2>
        <Callout type="info" title="Support channels">Open an issue on GitHub or join the Discord community. Include your CodeClaria version (<code style={inlineCode}>pnpm list codeclaria</code>) and relevant server logs when reporting bugs.</Callout>
      </>
    ),
  },
};

// ─── Main Page Component ──────────────────────────────────────────────────────

export default function DocsPage() {
  const [active, setActive] = useState<SectionId>("introduction");
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => Object.fromEntries(NAV.map(g => [g.title, true]))
  );
  const mainRef = useRef<HTMLElement>(null);

  const toggleGroup = (title: string) =>
    setOpenGroups(prev => ({ ...prev, [title]: !prev[title] }));

  const filteredNav = search
    ? NAV.map(g => ({ ...g, items: g.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())) })).filter(g => g.items.length > 0)
    : NAV;

  const scrollTo = useCallback((anchor: string) => {
    const el = document.getElementById(anchor);
    if (!el || !mainRef.current) return;
    const mainTop = mainRef.current.getBoundingClientRect().top + window.scrollY;
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elTop - 100, behavior: "smooth" });
  }, []);

  const section = SECTIONS[active];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        * { scroll-behavior: smooth; }
        body { background: #07061a; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(167,139,250,0.25); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(167,139,250,0.45); }
        .nav-btn:hover { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.9) !important; }
        .toc-btn:hover { color: #a78bfa !important; }
        .search-inp:focus { outline: none; border-color: rgba(167,139,250,0.45) !important; background: rgba(255,255,255,0.06) !important; }
        strong { color: rgba(255,255,255,0.88); }
        a { color: #a78bfa; }
        a:hover { opacity: 0.8; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .doc-content { animation: fadeUp 0.25s ease; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, minHeight: "100vh", color: C.text, paddingTop: 74 }}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${C.border}`, background: "linear-gradient(180deg, rgba(167,139,250,0.07) 0%, transparent 100%)" }}>
          <ThreeOrb />
          {/* subtle grid bg */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto", textAlign: "center", padding: "72px 24px 60px" }}>
            {/* badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", borderRadius: 20, padding: "4px 14px", marginBottom: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.purple, display: "inline-block", boxShadow: "0 0 8px #a78bfa" }} />
              <span style={{ color: C.purple, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em" }}>DOCUMENTATION</span>
            </div>
            <h1 style={{ fontSize: "clamp(26px,5vw,44px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 16, background: "linear-gradient(135deg,#fff 25%,#a78bfa 55%,#60a5fa 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Everything you need to<br />build with CodeClaria
            </h1>
            <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.6, marginBottom: 32 }}>
              Guides, API references, and examples for the AI-powered code intelligence platform.
            </p>
            {/* search */}
            <div style={{ position: "relative", maxWidth: 460, margin: "0 auto" }}>
              <span style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: C.subtle, fontSize: 17, pointerEvents: "none", lineHeight: 1 }}>⌕</span>
              <input
                className="search-inp"
                type="text"
                placeholder="Search documentation..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}`, borderRadius: 12, color: C.text, fontSize: 14, padding: "12px 48px 12px 42px", fontFamily: "'DM Sans',sans-serif", transition: "border-color 0.2s, background 0.2s" }}
              />
              <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, borderRadius: 5, color: C.subtle, fontSize: 10, padding: "2px 6px" }}>⌘K</div>
            </div>
          </div>
        </div>

        {/* ── 3-column layout ─────────────────────────────────────────── */}
        <div style={{ display: "flex", maxWidth: 1380, margin: "0 auto", padding: "0 16px" }}>

          {/* Left Sidebar */}
          <aside style={{ width: 236, flexShrink: 0, position: "sticky", top: 74, height: "calc(100vh - 74px)", overflowY: "auto", padding: "28px 12px 40px 0" }}>
            {filteredNav.map(group => (
              <div key={group.title} style={{ marginBottom: 4 }}>
                <button
                  onClick={() => toggleGroup(group.title)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "5px 8px", borderRadius: 6, marginBottom: 2 }}
                >
                  <span style={{ color: C.subtle, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>{group.title}</span>
                  <span style={{ color: C.subtle, fontSize: 9, display: "inline-block", transform: openGroups[group.title] ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }}>▾</span>
                </button>
                {openGroups[group.title] && group.items.map(item => {
                  const isActive = active === item.id;
                  return (
                    <button
                      key={item.id}
                      className="nav-btn"
                      onClick={() => { setActive(item.id); setSearch(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      style={{
                        width: "100%", background: isActive ? "rgba(167,139,250,0.08)" : "none",
                        border: "none", borderLeft: isActive ? "2px solid #a78bfa" : "2px solid transparent",
                        borderRadius: "0 7px 7px 0", cursor: "pointer", textAlign: "left",
                        color: isActive ? C.purple : C.muted, fontSize: 13.5,
                        fontWeight: isActive ? 600 : 400, padding: "7px 10px 7px 14px",
                        marginBottom: 1, transition: "all 0.14s", fontFamily: "'DM Sans',sans-serif",
                        display: "block",
                      }}
                    >{item.label}</button>
                  );
                })}
              </div>
            ))}
          </aside>

          {/* Main Content */}
          <main ref={mainRef} className="doc-content" key={active} style={{ flex: 1, minWidth: 0, padding: "36px 36px 80px", maxWidth: 800 }}>
            {section.content()}
          </main>

          {/* Right TOC */}
          <aside style={{ width: 196, flexShrink: 0, position: "sticky", top: 74, height: "calc(100vh - 74px)", overflowY: "auto", padding: "36px 0 40px 20px" }}>
            <div style={{ color: C.subtle, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 12 }}>On this page</div>
            {section.toc.map(item => {
              const anchor = item.toLowerCase().replace(/[^a-z0-9]+/g, "-");
              return (
                <button
                  key={item}
                  className="toc-btn"
                  onClick={() => scrollTo(anchor)}
                  style={{ display: "block", width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer", color: C.muted, fontSize: 12.5, padding: "5px 0", fontFamily: "'DM Sans',sans-serif", transition: "color 0.15s", lineHeight: 1.4 }}
                >{item}</button>
              );
            })}
            <div style={{ marginTop: 28, height: 1, background: C.border }} />
            <div style={{ marginTop: 18 }}>
              <div style={{ color: C.subtle, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 10 }}>Resources</div>
              {[
                { label: "✎ Edit this page", href: "https://github.com/your-org/codeclaria" },
                { label: "⊘ Report an issue", href: "https://github.com/your-org/codeclaria/issues" },
                { label: "◆ GitHub App", href: "https://github.com/apps/codeclaria" },
              ].map(r => (
                <a key={r.label} href={r.href} target="_blank" style={{ display: "block", color: C.muted, fontSize: 12.5, marginBottom: 7, textDecoration: "none" }}>{r.label}</a>
              ))}
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}