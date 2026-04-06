"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import FileTree from "./FileTree";

interface Props {
  files: string[];
  dependencies: Record<string, string[]>;
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  folder: string;
  connections: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
}

const FOLDER_COLORS: Record<string, string> = {
  src: "#a78bfa", app: "#60a5fa", lib: "#34d399",
  utils: "#fb923c", components: "#f472b6", api: "#facc15",
  hooks: "#38bdf8", models: "#4ade80", server: "#c084fc",
  pages: "#818cf8", root: "#94a3b8", default: "#94a3b8",
};

function getFolder(path: string) {
  const parts = path.split("/");
  return parts.length > 1 ? parts[0] : "root";
}

function getColor(path: string) {
  return FOLDER_COLORS[getFolder(path)] || FOLDER_COLORS.default;
}

function shortName(path: string) {
  return path.split("/").pop() || path;
}

export default function DependencyGraph({ files, dependencies }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeTab, setActiveTab] = useState<"graph" | "tree">("graph");
  const [selected, setSelected] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | undefined>();

  useEffect(() => {
    if (!files?.length || activeTab !== "graph") return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const container = svgRef.current!.parentElement!;
    const W = container.clientWidth || 800;
    const H = container.clientHeight || 560;

    // build nodes & links
    const nodeMap = new Map<string, GraphNode>();
    const connectionCount: Record<string, number> = {};

    for (const file of files) {
      connectionCount[file] = 0;
    }

    const links: GraphLink[] = [];
    for (const [src, imports] of Object.entries(dependencies || {})) {
      for (const imp of imports) {
        const match = files.find((f) => {
          const base = f.replace(/\.(ts|tsx|js|jsx)$/, "");
          const impClean = imp.replace(/^[@~]\//, "").replace(/^\.\//, "").replace(/^\.\.\//, "");
          return base.endsWith(impClean) || f.endsWith(impClean + ".ts") || f.endsWith(impClean + ".tsx");
        });
        if (match && match !== src) {
          links.push({ source: src, target: match });
          connectionCount[src] = (connectionCount[src] || 0) + 1;
          connectionCount[match] = (connectionCount[match] || 0) + 1;
        }
      }
    }

    const nodes: GraphNode[] = files.map((f) => ({
      id: f,
      name: shortName(f),
      folder: getFolder(f),
      connections: connectionCount[f] || 0,
    }));

    // zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (e) => g.attr("transform", e.transform));

    svg
      .attr("width", W)
      .attr("height", H)
      .style("background", "#07061a")
      .call(zoom);

    // grid background
    const defs = svg.append("defs");
    const pattern = defs.append("pattern")
      .attr("id", "grid").attr("width", 30).attr("height", 30)
      .attr("patternUnits", "userSpaceOnUse");
    pattern.append("path")
      .attr("d", "M 30 0 L 0 0 0 30")
      .attr("fill", "none").attr("stroke", "rgba(255,255,255,0.03)").attr("stroke-width", 1);
    svg.append("rect").attr("width", W).attr("height", H).attr("fill", "url(#grid)");

    const g = svg.append("g");

    // arrow markers
    const folders = [...new Set(files.map(getFolder))];
    folders.forEach((folder) => {
      const color = FOLDER_COLORS[folder] || FOLDER_COLORS.default;
      defs.append("marker")
        .attr("id", `arrow-${folder}`)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 20).attr("refY", 0)
        .attr("markerWidth", 6).attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", color + "80");
    });

    // force simulation
    const sim = d3.forceSimulation<GraphNode>(nodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(120).strength(0.5))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(W / 2, H / 2))
      .force("collision", d3.forceCollide().radius((d: any) => 20 + d.connections * 3));

    // links
    const link = g.append("g").selectAll("line")
      .data(links).join("line")
      .attr("stroke", (d: any) => getColor(typeof d.source === "string" ? d.source : d.source.id) + "50")
      .attr("stroke-width", 1.5)
      .attr("marker-end", (d: any) => {
        const src = typeof d.source === "string" ? d.source : d.source.id;
        return `url(#arrow-${getFolder(src)})`;
      });

    // node groups
    const node = g.append("g").selectAll("g")
      .data(nodes).join("g")
      .attr("cursor", "pointer")
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; })
          .on("end", (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      )
      .on("click", (_, d) => {
        const imports = dependencies[d.id] || [];
        const importedBy = Object.entries(dependencies)
          .filter(([, imps]) => imps.some((imp) => {
            const base = d.id.replace(/\.(ts|tsx|js|jsx)$/, "");
            const impClean = imp.replace(/^[@~]\//, "").replace(/^\.\//, "").replace(/^\.\.\//, "");
            return base.endsWith(impClean);
          }))
          .map(([f]) => shortName(f));
        setSelected({ name: d.name, path: d.id, folder: d.folder, connections: d.connections, imports, importedBy });

        // highlight
        node.selectAll("circle").attr("opacity", (n: any) => {
          const connected = links.some((l: any) =>
            (l.source.id === d.id && l.target.id === n.id) ||
            (l.target.id === d.id && l.source.id === n.id) ||
            n.id === d.id
          );
          return connected ? 1 : 0.15;
        });
        link.attr("opacity", (l: any) =>
          l.source.id === d.id || l.target.id === d.id ? 1 : 0.05
        );
      });

    // circles
    node.append("circle")
      .attr("r", (d) => 8 + d.connections * 2.5)
      .attr("fill", (d) => getColor(d.id) + "20")
      .attr("stroke", (d) => getColor(d.id))
      .attr("stroke-width", 1.5);

    // labels
    node.append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => -(10 + d.connections * 2.5) - 4)
      .attr("font-size", 10)
      .attr("font-family", "monospace")
      .attr("fill", (d) => getColor(d.id))
      .attr("pointer-events", "none");

    // folder badge
    node.append("text")
      .text((d) => d.folder)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (10 + d.connections * 2.5) + 14)
      .attr("font-size", 8)
      .attr("font-family", "monospace")
      .attr("fill", (d) => getColor(d.id) + "60")
      .attr("pointer-events", "none");

    // click on bg to reset
    svg.on("click", (e) => {
      if (e.target === svgRef.current) {
        setSelected(null);
        node.selectAll("circle").attr("opacity", 1);
        link.attr("opacity", 0.5);
      }
    });

    // tick
    sim.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    // search highlight
    if (search.trim()) {
      node.selectAll("circle").attr("opacity", (d: any) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ? 1 : 0.1
      );
    }

    return () => { sim.stop(); };
  }, [files, dependencies, activeTab, search]);

  if (!files?.length) return null;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-white/10" style={{ background: "#07061a" }}>
      {/* toolbar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10" style={{ background: "#0d0b1f" }}>
        {/* tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#07061a" }}>
          {(["graph", "tree"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
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
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search nodes..." className="bg-transparent text-[12px] outline-none flex-1"
              style={{ color: "rgba(255,255,255,0.6)" }} />
            {search && <button onClick={() => setSearch("")} className="text-white/30 text-[10px]">✕</button>}
          </div>
        )}

        <div className="flex items-center gap-3 text-[11px] ml-auto" style={{ color: "rgba(255,255,255,0.3)" }}>
          <span>{files.length} files</span>
          <span>{Object.values(dependencies).flat().length} imports</span>
        </div>
        {selected && (
          <button onClick={() => setSelected(null)} className="text-[11px] text-white/40 hover:text-white/70">Clear</button>
        )}
      </div>

      <div className="flex" style={{ height: 580 }}>
        {activeTab === "tree" ? (
          <FileTree files={files} selectedFile={selectedFile}
            onFileClick={(path) => { setSelectedFile(path); setActiveTab("graph"); setSearch(shortName(path)); }} />
        ) : (
          <>
            <div className="flex-1 relative">
              <svg ref={svgRef} className="w-full h-full" />
              {/* legend */}
              <div className="absolute bottom-3 left-3 flex flex-wrap gap-2">
                {[...new Set(files.map(getFolder))].map((folder) => (
                  <div key={folder} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ background: FOLDER_COLORS[folder] || FOLDER_COLORS.default }} />
                    <span className="text-[10px] font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>{folder}</span>
                  </div>
                ))}
              </div>
              <div className="absolute top-3 right-3 text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                Drag nodes · Scroll to zoom · Click to inspect
              </div>
            </div>

            {/* side panel */}
            {selected && (
              <div className="w-[220px] border-l border-white/10 p-4 overflow-y-auto" style={{ background: "#0d0b1f" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: getColor(selected.path) }} />
                  <p className="text-[13px] font-semibold text-white truncate">{selected.name}</p>
                </div>
                <p className="text-[10px] font-mono mb-1 break-all" style={{ color: "rgba(255,255,255,0.25)" }}>{selected.path}</p>
                <p className="text-[10px] mb-4" style={{ color: getColor(selected.path) + "80" }}>{selected.folder}/</p>

                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Imports ({selected.imports.length})</p>
                  {selected.imports.length === 0
                    ? <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>None</p>
                    : selected.imports.slice(0, 8).map((imp: string, i: number) => (
                      <p key={i} className="text-[11px] font-mono mb-1 truncate" style={{ color: "rgba(255,255,255,0.45)" }}>→ {imp}</p>
                    ))}
                </div>

                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.25)" }}>Imported by ({selected.importedBy.length})</p>
                  {selected.importedBy.length === 0
                    ? <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.2)" }}>None</p>
                    : selected.importedBy.slice(0, 8).map((f: string, i: number) => (
                      <p key={i} className="text-[11px] font-mono mb-1 truncate" style={{ color: "rgba(255,255,255,0.45)" }}>← {f}</p>
                    ))}
                </div>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.25)" }}>Connections</p>
                  <p className="text-[28px] font-bold leading-none" style={{ color: getColor(selected.path) }}>{selected.connections}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
