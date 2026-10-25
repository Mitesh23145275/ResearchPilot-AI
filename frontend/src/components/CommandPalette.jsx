import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const pages = [
  { name: "Dashboard", path: "/" },
  { name: "Upload Research Paper", path: "/upload" },
  { name: "Knowledge Base", path: "/knowledge" },
  { name: "Multi-Agent Research", path: "/research" },
  { name: "AI Chat", path: "/chat" },
  { name: "Report History", path: "/history" },
  { name: "Settings", path: "/settings" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }

      if (e.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    return pages.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  function go(path) {
    navigate(path);
    setOpen(false);
    setQuery("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex justify-center pt-28">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900/95 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800">
          <Search className="text-slate-400" size={20} />

          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages..."
            className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.map((page) => (
            <button
              key={page.path}
              onClick={() => go(page.path)}
              className="w-full text-left rounded-xl px-4 py-3 text-slate-300 hover:bg-blue-500/10 hover:text-white transition"
            >
              {page.name}
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-slate-500">
              No matching pages
            </div>
          )}
        </div>

        <div className="border-t border-slate-800 px-4 py-3 text-xs text-slate-500">
          Press <kbd>Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}