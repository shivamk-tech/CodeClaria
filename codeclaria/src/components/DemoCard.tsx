export default function DemoCard() {
    return (
        <div
            className="w-[400px] rounded-2xl p-6 shadow-2xl"
            style={{ background: "rgba(241, 240, 255, 0.97)" }}
        >
            <p className="text-[13.5px] text-gray-700 leading-relaxed mb-3">
                The search functionality is now fully implemented. Users can:
            </p>
            <ol className="text-[13px] text-gray-700 leading-loose list-decimal pl-5 mb-4">
                <li>Search for running races by name using the search box</li>
                <li>See filtered results matching their search term</li>
                <li>Navigate through paginated search results</li>
                <li>The search term is preserved when navigating between pages</li>
            </ol>

            <p className="text-[11px] text-gray-400 mb-2 font-medium">3 files changed</p>

            <div
                className="rounded-xl p-3 space-y-2 mb-4"
                style={{ background: "#f8f7ff", border: "1px solid #ebe8ff" }}
            >
                {[
                    { badge: "TS", badgeStyle: { background: "#dbeafe", color: "#1d4ed8" }, name: "race-service.ts", path: "src/lib/data" },
                    { badge: "TS", badgeStyle: { background: "#dbeafe", color: "#1d4ed8" }, name: "+page.server.ts", path: "src/routes" },
                    { badge: "S", badgeStyle: { background: "#fee2e2", color: "#b91c1c" }, name: "+page.svelte", path: "src/routes" },
                ].map((f) => (
                    <div key={f.name} className="flex items-center gap-2 font-mono text-[12px]">
                        <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={f.badgeStyle}
                        >
                            {f.badge}
                        </span>
                        <span className="font-semibold text-gray-800">{f.name}</span>
                        <span className="text-gray-400">{f.path}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-2">
                <button
                    className="text-[13px] font-semibold px-4 py-1.5 rounded-lg text-white transition-all hover:opacity-90"
                    style={{ background: "#2563eb" }}
                >
                    Keep
                </button>
                <button className="text-[13px] px-4 py-1.5 rounded-lg text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all">
                    Undo
                </button>
            </div>
        </div>
    );
}
