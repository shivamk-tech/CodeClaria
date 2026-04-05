"use client";

import { useState } from "react";

interface Props {
  files: string[];
  onFileClick?: (path: string) => void;
  selectedFile?: string;
}

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "dir";
  children: TreeNode[];
}

const FILE_ICONS: Record<string, string> = {
  ts: "🔷", tsx: "⚛️", js: "🟨", jsx: "⚛️",
  py: "🐍", go: "🐹", rs: "🦀", java: "☕",
  json: "📋", md: "📝", prisma: "🗄️",
  css: "🎨", scss: "🎨", sass: "🎨", less: "🎨",
  html: "🌐", yaml: "⚙️", yml: "⚙️",
  env: "🔐", sql: "🗃️", graphql: "🔗",
  vue: "💚", svelte: "🔥",
};

function getIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() || "";
  return FILE_ICONS[ext] || "📄";
}

function buildTree(files: string[]): TreeNode {
  const root: TreeNode = { name: "root", path: "", type: "dir", children: [] };

  for (const file of files) {
    const parts = file.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const path = parts.slice(0, i + 1).join("/");

      let existing = current.children.find((c) => c.name === part);
      if (!existing) {
        existing = { name: part, path, type: isLast ? "file" : "dir", children: [] };
        current.children.push(existing);
      }
      current = existing;
    }
  }

  // sort: dirs first, then files, alphabetically
  function sortNode(node: TreeNode) {
    node.children.sort((a, b) => {
      if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    node.children.forEach(sortNode);
  }
  sortNode(root);

  return root;
}

function TreeItem({
  node,
  depth,
  onFileClick,
  selectedFile,
}: {
  node: TreeNode;
  depth: number;
  onFileClick?: (path: string) => void;
  selectedFile?: string;
}) {
  const [open, setOpen] = useState(depth < 2);
  const isSelected = node.path === selectedFile;

  if (node.type === "dir") {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 w-full text-left py-[3px] px-2 rounded hover:bg-white/5 transition-colors"
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <span className="text-[10px] transition-transform duration-150" style={{ color: "rgba(255,255,255,0.3)", transform: open ? "rotate(90deg)" : "rotate(0deg)", display: "inline-block" }}>
            ▶
          </span>
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            {open ? "📂" : "📁"} {node.name}
          </span>
          <span className="ml-auto text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            {node.children.length}
          </span>
        </button>
        {open && (
          <div>
            {node.children.map((child) => (
              <TreeItem
                key={child.path}
                node={child}
                depth={depth + 1}
                onFileClick={onFileClick}
                selectedFile={selectedFile}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onFileClick?.(node.path)}
      className="flex items-center gap-1.5 w-full text-left py-[3px] px-2 rounded transition-colors"
      style={{
        paddingLeft: `${depth * 14 + 8}px`,
        background: isSelected ? "rgba(167,139,250,0.1)" : "transparent",
        color: isSelected ? "#a78bfa" : "rgba(255,255,255,0.45)",
      }}
      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}
    >
      <span className="text-[11px]">{getIcon(node.name)}</span>
      <span className="text-[11px] font-mono truncate">{node.name}</span>
    </button>
  );
}

export default function FileTree({ files, onFileClick, selectedFile }: Props) {
  const [search, setSearch] = useState("");

  const filteredFiles = search
    ? files.filter((f) => f.toLowerCase().includes(search.toLowerCase()))
    : files;

  const tree = buildTree(filteredFiles);

  return (
    <div className="flex flex-col h-full" style={{ background: "#0d0b1f" }}>
      {/* search */}
      <div className="px-3 py-2 border-b border-white/10">
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-white/10" style={{ background: "#07061a" }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter files..."
            className="bg-transparent text-[11px] outline-none flex-1"
            style={{ color: "rgba(255,255,255,0.6)" }}
          />
        </div>
      </div>

      {/* tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {tree.children.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            depth={0}
            onFileClick={onFileClick}
            selectedFile={selectedFile}
          />
        ))}
        {tree.children.length === 0 && (
          <p className="text-[11px] text-center py-8" style={{ color: "rgba(255,255,255,0.2)" }}>
            No files match
          </p>
        )}
      </div>

      {/* footer */}
      <div className="px-3 py-2 border-t border-white/10">
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          {files.length} files analyzed
        </p>
      </div>
    </div>
  );
}
