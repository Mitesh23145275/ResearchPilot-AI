import { useEffect, useState } from "react";
import { Sparkles, Activity, ShieldCheck } from "lucide-react";
import api from "../services/api";
import StatCard from "../layout/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    papers: 0,
    reports: 0,
    ollama: false,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await api.get("/stats/");
        setStats(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="relative min-h-screen px-8 py-8 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Sparkles size={16} />
            AI Research Command Center
          </div>

          <h1 className="mt-5 text-5xl font-bold text-white">
            Welcome back
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-slate-400">
            Monitor your uploaded papers, generated IEEE reports, and AI system
            status from one place.
          </p>
        </div>

        {/* Hero Banner */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/25 via-slate-900/80 to-violet-600/25 p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                ResearchPilot AI
              </h2>
              <p className="mt-2 max-w-lg text-slate-300">
                Upload research papers, build a knowledge base, generate IEEE-style reports, and collaborate with AI.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <Activity className="mx-auto mb-2 text-blue-400" />
                <p className="text-xs text-slate-400">Status</p>
                <p className="font-semibold text-white">
                  {stats.ollama ? "Online" : "Offline"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <ShieldCheck className="mx-auto mb-2 text-emerald-400" />
                <p className="text-xs text-slate-400">System</p>
                <p className="font-semibold text-white">Ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-1 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
            <StatCard title="Uploaded Papers" value={stats.papers} />
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-1 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
            <StatCard title="Reports Generated" value={stats.reports} />
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-1 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10">
            <StatCard
              title="Ollama"
              value={stats.ollama ? "Online" : "Offline"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}