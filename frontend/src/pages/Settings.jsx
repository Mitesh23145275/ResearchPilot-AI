import { useEffect, useState } from "react";
import {
  Sparkles,
  Server,
  Cpu,
  Database,
  CheckCircle2,
  XCircle,
  Globe,
} from "lucide-react";
import api from "../services/api";

export default function Settings() {
  const [config, setConfig] = useState(null);
  const [ollamaStatus, setOllamaStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState("qwen2.5:3b-instruct");
  

  useEffect(() => {
    async function fetchSettings() {
      try {
        const [configRes, ollamaRes] = await Promise.all([
          api.get("/system/config"),
          api.get("/system/ollama-status"),
        ]);

        setConfig(configRes.data);
        setOllamaStatus(ollamaRes.data);
        setSelectedModel(configRes.data.ollama_model);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

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
            System Configuration
          </div>

          <h1 className="mt-5 text-5xl font-bold text-white">
            Settings
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-400">
            Monitor your Ollama server, configured AI models, and system
            configuration used by ResearchPilot AI.
          </p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-10 backdrop-blur-xl text-center text-slate-400">
            Loading configuration...
          </div>
        ) : (
          <div className="space-y-8">

            {/* Status Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl shadow-blue-900/20">

              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-5">

                  <div className="rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 p-5 shadow-lg shadow-blue-500/30">
                    <Server size={32} className="text-white" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Ollama Service
                    </h2>

                    <p className="mt-1 text-slate-400">
                      Local AI model server powering ResearchPilot.
                    </p>
                  </div>

                </div>

                <div
                  className={`flex items-center gap-2 rounded-full px-5 py-3 font-semibold ${
                    ollamaStatus?.ollama_running
                      ? "bg-green-500/15 text-green-400 border border-green-500/30"
                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                  }`}
                >
                  {ollamaStatus?.ollama_running ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}

                  {ollamaStatus?.ollama_running ? "ONLINE" : "OFFLINE"}
                </div>

              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">

                <InfoCard
                  icon={<Globe size={22} className="text-blue-400" />}
                  title="Base URL"
                  value={config?.ollama_base_url}
                />

                <InfoCard
                  icon={<Cpu size={22} className="text-emerald-400" />}
                  title="Current AI Model"
                  value={selectedModel}
                />

                <InfoCard
                  icon={<Database size={22} className="text-violet-400" />}
                  title="Embedding Model"
                  value={config?.embedding_model}
                />

              </div>

            </div>

            {/* Application Settings Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl shadow-blue-900/20">

              <div className="flex items-center gap-4 mb-8">
                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 p-3">
                  <Sparkles size={24} className="text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    AI Preferences
                  </h2>

                  <p className="text-slate-400">
                    Configure the AI model used for research tasks.
                  </p>
                </div>
              </div>

              <div className="space-y-8">

                {/* AI Model */}
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    AI Model
                  </label>

                  <select
                    value={selectedModel}
                    onChange={async (e) => {
                      const model = e.target.value;
                      setSelectedModel(model);

                      try {
                        await api.post("/system/set-model", { model });
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-white"
                  >
                    {ollamaStatus?.models?.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>

                  <p className="mt-2 text-sm text-slate-500">
                    Choose which local AI model answers research questions.
                  </p>
                </div>
              </div>
            </div>

            {/* Models Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-xl shadow-2xl shadow-blue-900/20">

              <div className="flex items-center gap-4 mb-6">

                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 p-3">
                  <Cpu size={24} className="text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    Installed Ollama Models
                  </h2>

                  <p className="text-slate-400">
                    Models available on your local AI server.
                  </p>
                </div>

              </div>

              {ollamaStatus?.models && ollamaStatus.models.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {ollamaStatus.models.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`rounded-xl border px-4 py-2 font-mono transition ${
                        selectedModel === model
                          ? "border-blue-400 bg-blue-500/20 text-white"
                          : "border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                      }`}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5 text-slate-400">
                  {ollamaStatus?.ollama_running
                    ? "No models found on the Ollama server."
                    : "Unable to retrieve models because the Ollama service is offline."}
                </div>
              )}

            </div>

            {/* About Card */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-600/15 to-violet-600/15 p-8 backdrop-blur-xl">

              <div className="flex items-center gap-4 mb-4">

                <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 p-3">
                  <Sparkles size={24} className="text-white" />
                </div>

                <h2 className="text-2xl font-bold text-white">
                  ResearchPilot AI
                </h2>

              </div>

              <p className="leading-8 text-slate-300">
                A collaborative AI-powered research assistant built with FastAPI,
                React, Ollama, ChromaDB, and a multi-agent workflow that generates
                IEEE-style research papers.
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3">{icon}</div>

      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-2 break-all font-mono text-white">{value}</p>
    </div>
  );
}