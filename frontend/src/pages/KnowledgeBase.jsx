import { useState } from "react";
import {
  Database,
  Sparkles,
  Cpu,
  Layers3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";

export default function KnowledgeBase() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function buildKnowledgeBase() {
    setLoading(true);

    try {
      const response = await api.post("/knowledge/build");
      setResult(response.data);
    } catch {
      setResult({
        status: "error",
        message: "Failed to build knowledge base.",
      });
    }

    setLoading(false);
  }

  return (
    <div className="relative min-h-screen px-8 py-8 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Sparkles size={16} />
            AI Knowledge Engine
          </div>

          <h1 className="mt-5 text-5xl font-bold text-white">
            Knowledge Base
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-400">
            Convert uploaded research papers into vector embeddings stored in
            ChromaDB for faster retrieval, semantic search, and AI-powered
            conversations.
          </p>
        </div>

        {/* Main Glass Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-blue-900/20">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-5">

              <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 p-5 shadow-lg shadow-blue-500/30">
                <Database size={34} className="text-white" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white">
                  Build Vector Knowledge Base
                </h2>

                <p className="mt-2 text-slate-400 max-w-xl">
                  Generate semantic embeddings from every uploaded research paper.
                  This powers AI search, retrieval, and intelligent responses.
                </p>
              </div>

            </div>

            <button
              onClick={buildKnowledgeBase}
              disabled={loading}
              className={`rounded-2xl px-8 py-4 font-semibold text-white transition-all duration-300 ${
                loading
                  ? "cursor-not-allowed bg-slate-700"
                  : "bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-600/30 hover:-translate-y-1 hover:shadow-blue-500/40"
              }`}
            >
              {loading ? "Building..." : "Build Knowledge Base"}
            </button>

          </div>

          {/* Feature Row */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Layers3 className="mb-3 text-blue-400" size={26} />
              <h3 className="font-semibold text-white">Chunking</h3>
              <p className="mt-2 text-sm text-slate-400">
                Breaks research papers into optimized semantic chunks.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Cpu className="mb-3 text-violet-400" size={26} />
              <h3 className="font-semibold text-white">Embeddings</h3>
              <p className="mt-2 text-sm text-slate-400">
                Creates AI vector representations for retrieval.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <Database className="mb-3 text-cyan-400" size={26} />
              <h3 className="font-semibold text-white">ChromaDB</h3>
              <p className="mt-2 text-sm text-slate-400">
                Stores embeddings for fast semantic search.
              </p>
            </div>

          </div>

          {/* Results */}
          {result && (
            <div className="mt-10 rounded-3xl border border-white/10 bg-slate-950/60 p-6">

              <div className="flex items-center gap-3 mb-6">

                {result.status === "success" ? (
                  <CheckCircle2 className="text-green-400" size={28} />
                ) : (
                  <AlertCircle className="text-red-400" size={28} />
                )}

                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {result.status === "success"
                      ? "Knowledge Base Ready"
                      : "Build Failed"}
                  </h3>

                  <p className="text-slate-400">
                    {result.message}
                  </p>
                </div>

              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-sm text-slate-400">Chunks Created</p>

                  <p className="mt-2 text-4xl font-bold text-white">
                    {result.chunks ?? 0}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-sm text-slate-400">Status</p>

                  <p
                    className={`mt-2 text-3xl font-bold ${
                      result.status === "success"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {result.status}
                  </p>
                </div>

              </div>

              <div className="mt-6 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                <p className="text-slate-300 leading-relaxed">
                  Your uploaded research papers have been processed into vector
                  embeddings and stored in ChromaDB, enabling semantic search
                  and AI-powered retrieval.
                </p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}