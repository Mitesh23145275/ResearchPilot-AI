import {
  LayoutDashboard,
  Upload,
  BookOpen,
  History,
  Settings,
  Sparkles,
  MessageSquare,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const items = [
    { icon: Upload, label: "Upload Papers", path: "/upload" },
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: BookOpen, label: "Knowledge Base", path: "/knowledge" },
    { icon: Sparkles, label: "Research", path: "/research" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: History, label: "History", path: "/history" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-72 min-h-screen bg-slate-950/80 backdrop-blur-xl border-r border-white/10 flex flex-col p-5">

      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Sparkles size={22} className="text-white" />
          </div>

          <div>
            <h1 className="text-white text-2xl font-bold tracking-tight">
              ResearchPilot
            </h1>
            <p className="text-slate-400 text-sm">AI Research Assistant</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg shadow-blue-600/25"
                  : "text-slate-300 hover:bg-white/5 hover:text-white hover:translate-x-1"
              }`
            }
          >
            <item.icon
              size={20}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Card */}
      <div className="mt-8 rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-violet-500/10 p-4 backdrop-blur">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={18} className="text-blue-400" />
          <span className="text-white font-semibold">AI Ready</span>
        </div>

        <p className="text-sm text-slate-400 leading-relaxed">
          Upload papers, generate IEEE reports, and chat with your research assistant.
        </p>
      </div>
    </aside>
  );
}