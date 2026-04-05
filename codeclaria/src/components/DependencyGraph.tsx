"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Handle,
  Position,
  NodeProps,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import FileTree from "./FileTree";

interface Props {
  files: string[];
  dependencies: Record<string, string[]>;
}

const FOLDER_COLORS: Record<string, string> = {
  src: "#a78bfa",
  app: "#60a5fa",
  lib: "#34d399",
  utils: "#fb923c",
  components: "#f472b6",
  api: "#facc15",
  hooks: "#38bdf8",
  models: "#4ade80",
  server: "#c084fc",
  pages: "#818cf8",
  default: "#94a3b8",
};

function getFolder(path: string): string {
  const parts = path.split("/");
  return parts.length > 1 ? parts[0] : "root";
}

function getFolderColor(path: string): string {
  const folder = getFolder(path);
  return FOLDER_COLORS[folder] || FOLDER_COLORS.default;
}

function shortName(path: string) {
  return path.split("/").pop() || path;
}

function FileNode({ data }: NodeProps) {
  const d = data as any;
  return (
    <div
      className="relative px-3 py-2 rounded-lg font-mono text-[11px] transition-all"
      style={{
        background: d.highlighted ? `${d.color}20` : "#0d0b1f",
        border: `1.5px solid ${d.highlighted ? d.color : d.color + "50"}`,
        color: d.highlighted ? d.color : d.color + "cc",
        width: d.size || 160,
        boxShadow: d.highlighted ? `0 0 16px ${d.color}50` : "none",
        opacity: d.dimmed ? 0.2 : 1,
        transition: "all 0.2s ease",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: d.color, width: 6, height: 6, border: "none" }} />
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: d.color }} />
        <span className="truncate max-w-[140px]">{d.label}</span>
        {d.connections > 0 && (
          <span className="ml-auto text-[9px] px-1 rounded" style={{ background: d.color + "20", color: d.color }}>
            {d.connections}
          </span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: d.color, width: 6, height: 6, border: "none" }} />
    </div>
  );
}

const nodeTypes = { file: FileNode };

function buildLayout(files: string[], dependencies: Record<string, string[]>) {
  // count connections per file
  const connectionCount: Record<string, number> = {};
  for (const file of files) connectionCount[file] = 0;
  for (const [src, imports] of Object.entries(dependencies)) {
    for (const imp of imports) {
      const match = files.find((f) => {
        const base = f.replace(/\.(ts|tsx|js|jsx)$/, "");
        const impClean = imp.replace(/^[@~]\//, "").replace(/^\.\//, "").replace(/^\.\.\//, "");
        return base.endsWith(impClean) || f.endsWith(impClean + ".ts") || f.endsWith(impClean + ".tsx");
      });
      if (match) {
        connectionCount[src] = (connectionCount[src] || 0) + 1;
        connectionCount[match] = (connectionCount[match] || 0) + 1;
      }
    }
  }

  // group by folder
  const groups: Record<string, string[]> = {};
  for (const file of files) {
    const folder = getFolder(file);
    if (!groups[folder]) groups[folder] = [];
    groups[folder].push(file);
  }

  const nodes: Node[] = [];
  let colX = 0;

  for (const [folder, folderFiles] of Object.entries(groups)) {
    const color = getFolderColor(folderFiles[0]);
    const colWidth = 200;
    const rowHeight = 60;

    folderFiles.forEach((file, i) => {
      const conns = connectionCount[file] || 0;
      nodes.push({
        id: file,
        type: "file",
        position: { x: colX, y: i * rowHeight },
        data: {
          label: shortName(file),
          fullPath: file,
          color: getFolderColor(file),
          connections: conns,
          size: Math.max(140, Math.min(200, 140 + conns * 8)),
          highlighted: false,
          dimmed: false,
          folder,
        },
      });
    });

    colX += colWidth + 80;
  }

  return { nodes, connectionCount };
}

export default function DependencyGraph({ files, dependencies }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any>(null);
  const [connectionCount, setConnectionCount] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<"graph" | "tree">("graph");
  const [selectedFile, setSelectedFile] = useState<string | undefined>();

  useEffect(() => {
    if (!files?.length) return;

    const { nodes: layoutNodes, connectionCount: cc } = buildLayout(files, dependencies);
    setConnectionCount(cc);

    // build edges
    const newEdges: Edge[] = [];
    const fileSet = new Set(files);

    for (const [source, imports] of Object.entries(dependencies || {})) {
      if (!fileSet.has(source)) continue;
      for (const imp of imports) {
        const match = files.find((f) => {
          const base = f.replace(/\.(ts|tsx|js|jsx)$/, "");
          const impClean = imp.replace(/^[@~]\//, "").replace(/^\.\//, "").replace(/^\.\.\//, "");
          return base.endsWith(impClean) || f.endsWith(impClean + ".ts") || f.endsWith(impClean + ".tsx");
        });
        if (match && match !== source) {
          newEdges.push({
            id: `${source}->${match}`,
            source,
            target: match,
            animated: true,
            style: { stroke: getFolderColor(source) + "60", strokeWidth: 1.5 },
            markerEnd: { type: MarkerType.ArrowClosed, color: getFolderColor(source) + "60", width: 12, height: 12 },
          });
        }
      }
    }

    setNodes(layoutNodes);
    setEdges(newEdges);
  }, [files, dependencies]);

  // search highlight
  useEffect(() => {
    if (!search.trim()) {
      setNodes((nds) =>
        nds.map((n) => n.type === "file" ? { ...n, data: { ...n.data, highlighted: false, dimmed: false } } : n)
      );
      return;
    }
    setNodes((nds) =>
      nds.map((n) => {
        if (n.type !== "file") return n;
        const matches = (n.data as any).label.toLowerCase().includes(search.toLowerCase()) ||
          (n.data as any).fullPath.toLowerCase().includes(search.toLowerCase());
        return { ...n, data: { ...n.data, highlighted: matches, dimmed: !matches } };
      })
    );
  }, [search]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.type !== "file") return;
    const d = node.data as any;
    const imports = dependencies[d.fullPath] || [];
    const importedBy = Object.entries(dependencies)
      .filter(([, imps]) => imps.some((imp) => {
        const base = d.fullPath.replace(/\.(ts|tsx|js|jsx)$/, "");
        const impClean = imp.replace(/^[@~]\//, "").replace(/^\.\//, "").replace(/^\.\.\//, "");
        return base.endsWith(impClean);
      }))
      .map(([f]) => shortName(f));

    setSelected({ name: d.label, path: d.fullPath, imports, importedBy, connections: d.connections });

    // highlight connected nodes
    setNodes((nds) =>
      nds.map((n) => {
        if (n.type !== "file") return n;
        const isSelected = n.id === d.fullPath;
        const isConnected = edges.some(
          (e) => (e.source === d.fullPath && e.target === n.id) || (e.target === d.fullPath && e.source === n.id)
        );
        return { ...n, data: { ...n.data, highlighted: isSelected || isConnected, dimmed: !isSelected && !isConnected } };
      })
    );
  }, [dependencies, edges]);

  if (!files?.length) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10" style={{ background: "#07061a" }}>
      {/* toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10" style={{ background: "#0d0b1f" }}>
        {/* tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#07061a" }}>
          {(["graph", "tree"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="text-[11px] font-medium px-3 py-1 rounded-md capitalize transition-all"
              style={{
                background: activeTab === tab ? "rgba(167,139,250,0.15)" : "transparent",
                color: activeTab === tab ? "#a78bfa" : "rgba(255,255,255,0.35)",
                border: activeTab === tab ? "1px solid rgba(167,139,250,0.2)" : "1px solid transparent",
              }}
            >
              {tab === "graph" ? "🕸 Graph" : "🌲 Tree"}
            </button>
          ))}
        </div>

        {activeTab === "graph" && (
          <div className="flex items-center gap-2 flex-1 px-3 py-1.5 rounded-lg border border-white/10" style={{ background: "#07061a" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className="bg-transparent text-[12px] outline-none flex-1"
              style={{ color: "rgba(255,255,255,0.6)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-white/30 hover:text-white/60 text-[10px]">✕</button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 text-[11px] ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>
          <span>{files.length} files</span>
          <span>{edges.length} connections</span>
        </div>
        {selected && (
          <button onClick={() => {
            setSelected(null);
            setNodes((nds) => nds.map((n) => n.type === "file" ? { ...n, data: { ...n.data, highlighted: false, dimmed: false } } : n));
          }} className="text-[11px] text-white/40 hover:text-white/70">
            Clear
          </button>
        )}
      </div>

      <div className="flex" style={{ height: 600 }}>
        {activeTab === "tree" ? (
          <FileTree
            files={files}
            selectedFile={selectedFile}
            onFileClick={(path) => {
              setSelectedFile(path);
              // also highlight in graph when switching
              setActiveTab("graph");
              setNodes((nds) =>
                nds.map((n) => {
                  if (n.type !== "file") return n;
                  const isSelected = n.id === path;
                  const isConnected = edges.some(
                    (e) => (e.source === path && e.target === n.id) || (e.target === path && e.source === n.id)
                  );
                  return { ...n, data: { ...n.data, highlighted: isSelected || isConnected, dimmed: !isSelected && !isConnected } };
                })
              );
            }}
          />
        ) : (
          <>
            {/* graph */}
            <div className="flex-1">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.3, minZoom: 0.5 }}
                minZoom={0.1}
                maxZoom={3}
                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                proOptions={{ hideAttribution: true }}
              >
                <Background color="rgba(255,255,255,0.03)" gap={20} />
                <Controls style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }} />
                <MiniMap
                  style={{ background: "#0d0b1f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                  nodeColor={(n) => getFolderColor((n.data as any)?.fullPath || "") }
                  maskColor="rgba(7,6,26,0.8)"
                />
              </ReactFlow>
            </div>

            {/* side panel */}
            {selected && (
              <div className="w-[220px] border-l border-white/10 p-4 overflow-y-auto" style={{ background: "#0d0b1f" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: getFolderColor(selected.path) }} />
                  <p className="text-[12px] font-semibold text-white truncate">{selected.name}</p>
                </div>
                <p className="text-[10px] font-mono mb-4 break-all" style={{ color: "rgba(255,255,255,0.3)" }}>{selected.path}</p>

                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Imports ({selected.imports.length})
                  </p>
                  {selected.imports.length === 0 ? (
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>None</p>
                  ) : (
                    selected.imports.slice(0, 8).map((imp: string, i: number) => (
                      <p key={i} className="text-[11px] font-mono mb-1 truncate" style={{ color: "rgba(255,255,255,0.45)" }}>→ {imp}</p>
                    ))
                  )}
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>
                    Imported by ({selected.importedBy.length})
                  </p>
                  {selected.importedBy.length === 0 ? (
                    <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>None</p>
                  ) : (
                    selected.importedBy.slice(0, 8).map((f: string, i: number) => (
                      <p key={i} className="text-[11px] font-mono mb-1 truncate" style={{ color: "rgba(255,255,255,0.45)" }}>← {f}</p>
                    ))
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>Connections</p>
                  <p className="text-[20px] font-bold" style={{ color: getFolderColor(selected.path) }}>{selected.connections}</p>
                </div>

                <button
                  onClick={() => setActiveTab("tree")}
                  className="mt-3 w-full text-[11px] py-1.5 rounded-lg border border-white/10 text-white/40 hover:text-white/70 transition-colors"
                >
                  View in tree →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
