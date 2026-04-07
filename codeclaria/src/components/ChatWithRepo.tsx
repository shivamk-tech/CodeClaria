"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "ai";
  content: string;
  referencedFiles?: string[];
}

interface Props {
  repoUrl: string;
  filesContent: Record<string, string>;
}

export default function ChatWithRepo({ repoUrl, filesContent }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "I've analyzed this repo. Ask me anything about the codebase — architecture, auth, how files connect, what a function does, anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl, question: q, filesContent }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.answer || data.error || "No response",
          referencedFiles: data.referencedFiles || [],
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: "ai", content: "Failed to get a response. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const SUGGESTIONS = [
    "Where is auth handled?",
    "How does the database connect?",
    "What does the API layer do?",
    "Explain the folder structure",
  ];

  return (
    <div
      className="w-full rounded-xl border border-white/10 overflow-hidden"
      style={{ background: "#0d0b1f", fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* header */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-white/10" style={{ background: "#07061a" }}>
        <div className="w-2 h-2 rounded-full bg-green-400" />
        <p className="text-[13px] font-medium text-white">Chat with Repo</p>
        <span className="text-[11px] font-mono ml-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          {repoUrl.replace("https://github.com/", "")}
        </span>
      </div>

      {/* messages */}
      <div ref={messagesRef} className="flex flex-col gap-4 px-5 py-5 overflow-y-auto" style={{ maxHeight: 420, minHeight: 200 }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[85%] rounded-xl px-4 py-3 text-[13px] leading-relaxed"
              style={
                msg.role === "user"
                  ? { background: "rgba(167,139,250,0.15)", color: "#e2e8f0", border: "1px solid rgba(167,139,250,0.2)" }
                  : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.07)" }
              }
            >
              {/* render content with code formatting */}
              {msg.content.split(/(`[^`]+`)/g).map((part, j) =>
                part.startsWith("`") && part.endsWith("`") ? (
                  <code key={j} className="px-1 py-0.5 rounded text-[12px] font-mono" style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}>
                    {part.slice(1, -1)}
                  </code>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}

              {/* referenced files */}
              {msg.referencedFiles && msg.referencedFiles.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-1">
                  {msg.referencedFiles.map((f, j) => (
                    <span key={j} className="text-[10px] font-mono px-2 py-[2px] rounded" style={{ background: "rgba(96,165,250,0.1)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.2)" }}>
                      {f.split("/").pop()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-xl border border-white/10 flex items-center gap-2" style={{ background: "rgba(255,255,255,0.04)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* suggestions */}
      {messages.length === 1 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setInput(s); }}
              className="text-[11px] px-3 py-1.5 rounded-lg transition-all hover:border-white/20"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)" }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* input */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything about this codebase..."
          className="flex-1 bg-transparent text-[13px] outline-none"
          style={{ color: "rgba(255,255,255,0.7)" }}
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-lg text-[12px] font-semibold transition-all"
          style={{
            background: input.trim() ? "#fff" : "rgba(255,255,255,0.08)",
            color: input.trim() ? "#07061a" : "rgba(255,255,255,0.3)",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
