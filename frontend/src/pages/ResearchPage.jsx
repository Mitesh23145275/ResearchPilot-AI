import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import api from "../services/api";
import AgentTimeline from "../components/AgentTimeline";
import { connectSocket, disconnectSocket } from "../services/socket";
// import LoadingOverlay from "../components/LoadingOverlay";

export default function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState("supervisor");
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer;

    if (loading || reportLoading) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      setSeconds(0);
    }

    return () => clearInterval(timer);
  }, [loading, reportLoading]);

  useEffect(() => {
    connectSocket((event) => {
      const name = event.agent.toLowerCase();

      if (event.status === "running") {
        if (name.includes("supervisor")) setCurrentStep("supervisor");
        else if (name.includes("research")) setCurrentStep("research");
        else if (name.includes("writer")) setCurrentStep("writer");
        else if (name.includes("critique")) setCurrentStep("critique");
      }

      if (event.status === "completed") {
        if (name.includes("supervisor")) setCurrentStep("research");
        else if (name.includes("research")) setCurrentStep("writer");
        else if (name.includes("writer")) setCurrentStep("critique");
        else if (name.includes("critique")) setCurrentStep("done");
      }
    });

    return () => disconnectSocket();
  }, []);

  async function runResearch() {
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);
    setCurrentStep("supervisor");

    try {
      const response = await api.post("/research/", { topic });
      setResult(response.data);
      setCurrentStep("done");
    } catch {
      toast.error("Research failed.");
    }

    setLoading(false);
  }

  async function generateReport() {
    if (!result) return;

    setReportLoading(true);
    setCurrentStep("writer");

    try {
      const response = await api.post("/report/generate", {
        topic,
        research: result.research,
      });

      setResult({
        ...result,
        draft: response.data.draft,
        critique: response.data.critique,
      });

      setCurrentStep("done");
    } catch {
      toast.error("Report generation failed.");
    }

    setReportLoading(false);
  }

  async function downloadPDF() {
    if (!result?.draft) return;

    try {
      const response = await api.post(
        "/pdf/download",
        {
          topic,
          draft: result.draft,
        },
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${topic.trim().replace(/\s+/g, "_")}_research.pdf`;
      link.click();

      window.URL.revokeObjectURL(url);
      toast.success("IEEE PDF downloaded.");
    } catch {
      toast.error("PDF download failed.");
    }
  }

  return (
    <div className="relative min-h-screen px-8 py-8 overflow-hidden">

      {/* <LoadingOverlay
        show={loading || reportLoading}
        title={loading ? "Researching your topic" : "Generating IEEE Paper"}
        subtitle={
          loading
            ? "Supervisor, Research and Analysis agents are working..."
            : "Writer and Critique agents are finalizing your paper."
        }
      /> */}

      {/* Background Glow */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Hero */}
        <div className="mb-8">

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            ✨ Multi-Agent AI System
          </div>

          <h1 className="mt-5 text-5xl font-bold text-white">
            Multi-Agent Research
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-400">
            Launch your AI research workflow where specialized agents plan,
            research, write, critique, and generate IEEE-style papers.
          </p>

        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-blue-900/20">

          {(loading || reportLoading) && (
            <>
              <AgentTimeline currentStep={currentStep} />

              <div className="mt-5 flex items-center justify-center">

                <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-blue-300 font-semibold">
                  ⏱ {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                  {String(seconds % 60).padStart(2, "0")}
                </div>

              </div>
            </>
          )}

          {/* Research Input */}
          <div className="mt-8">

            <label className="mb-3 block text-sm font-medium text-slate-300">
              Research Topic
            </label>

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Example: Explainable AI in Healthcare"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />

          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">

            <button
              onClick={runResearch}
              disabled={loading || reportLoading}
              className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {loading ? "Researching..." : "Start Research"}
            </button>

            <button
              onClick={generateReport}
              disabled={!result || loading || reportLoading}
              className="rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-4 font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {reportLoading ? "Generating..." : "Generate Report"}
            </button>

          </div>

          {/* Results */}
          {result && (
            <div className="mt-10 space-y-6">

              {result.cached && (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5 text-green-300">
                  ⚡ Loaded instantly from local cache.
                </div>
              )}

              <SupervisorSection text={result.plan} />

              <Section title="🌐 Web Research" text={result.web} />

              <Section title="📚 Literature Review" text={result.literature} />

              <Section title="⚙ Technical Analysis" text={result.technical} />

              <Section title="🏭 Industry Applications" text={result.industry} />

              {result.draft && (
                <>
                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={downloadPDF}
                      className="rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-6 py-3 font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-red-500/30"
                    >
                      📄 Download IEEE PDF
                    </button>

                  </div>

                  <Section title="📝 Draft Paper" text={result.draft} />

                  <Section title="🔍 Critique" text={result.critique} />
                </>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

function SupervisorSection({ text }) {
  const sections = (text || "").split(/\n\s*\n/);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-xl shadow-md">
          🧠
        </div>

        <h3 className="text-2xl font-bold text-blue-400">
          Supervisor Plan
        </h3>
      </div>

      <div className="space-y-5">
        {sections.map((section, index) => {
          const lines = section
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          if (!lines.length) return null;

          return (
            <div
              key={index}
              className="bg-slate-950 rounded-xl border border-slate-700 p-5"
            >
              <h4 className="text-lg font-bold text-white mb-3">
                {lines[0].replace(/^#+\s*/, "")}
              </h4>

              <ul className="space-y-2">
                {lines.slice(1).map((line, i) => (
                  <li key={i} className="flex gap-3 text-slate-300 leading-6">
                    <span className="text-blue-400">•</span>
                    <span>{line.replace(/^[-•*+]\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Section({ title, text }) {
  const iconMap = {
    "Key Findings": "✅",
    "Important Facts": "ℹ️",
    "Recent Developments": "✨",
    "Major Themes": "📖",
    "Important Studies": "📚",
    "Research Gaps": "🔍",
    "Core Technologies": "⚙️",
    "Important Algorithms": "🧮",
    "Important Algorithms or Methods": "🧮",
    "Technical Challenges": "🛠️",
    "Real-world Applications": "🏭",
    "Leading Organizations or Companies": "🏢",
    Companies: "🏢",
    "Future Opportunities": "🚀",
  };

  const isDraft = title.includes("Draft Paper");
  const isCritique = title.includes("Critique");

  const formatHeading = (text) => {
    if (!text) return "";

    const smallWords = [
      "of",
      "and",
      "the",
      "for",
      "to",
      "in",
      "on",
      "with",
      "by",
      "at",
      "from",
    ];

    return text
      .trim()
      .split(/\s+/)
      .map((word, index) => {
        if (word.toUpperCase() === "AI") return "AI";

        if (index > 0 && smallWords.includes(word.toLowerCase())) {
          return word.toLowerCase();
        }

        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  if (isDraft) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-blue-400 mb-5">{title}</h3>

        <div className="bg-slate-950 border border-slate-700 rounded-xl p-8">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-5xl font-bold text-white text-center leading-tight mb-8 border-b border-slate-700 pb-4">
                  {formatHeading(
                    Array.isArray(children)
                      ? children.join("")
                      : String(children)
                  )}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-white mt-8 mb-4">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 leading-9 mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 text-slate-300 space-y-2 mb-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 text-slate-300 space-y-2 mb-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-slate-300">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-bold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-slate-200 italic">{children}</em>
              ),
              code: ({ children }) => (
                <code className="bg-slate-800 text-green-400 px-1 py-0.5 rounded">
                  {children}
                </code>
              ),
              hr: () => <hr className="border-slate-700 my-6" />,
            }}
          >
            {text || "No information available."}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  if (isCritique) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-700 p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-blue-400 mb-5">{title}</h3>

        <div className="bg-slate-950 border border-slate-700 rounded-xl p-8">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-white mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-slate-300 leading-8 mb-3">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 text-slate-300 space-y-2 mb-4">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="text-slate-300">{children}</li>
              ),
            }}
          >
            {text || "No critique available."}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  const knownTitles = Object.keys(iconMap);
  const sections = [];
  let current = null;

  for (const raw of (text || "").split("\n")) {
    let line = raw.trim();

    if (!line) continue;

    line = line.replace(/^#{1,6}\s*/, "");
    line = line.replace(/\*\*/g, "");
    line = line.replace(/^[*+-]\s*/, "");

    const matched = knownTitles.find((k) => line.includes(k));

    if (matched) {
      if (current) sections.push(current);

      current = {
        title: line.replace(/:$/, "").trim(),
        body: [],
      };

      continue;
    }

    if (current) {
      current.body.push(line.replace(/^[-•*+]\s*/, "").trim());
    }
  }

  if (current) sections.push(current);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 p-6 shadow-lg">
      <h3 className="text-2xl font-bold text-blue-400 mb-5">{title}</h3>

      <div className="space-y-4">
        {sections.map((section, index) => {
          const key = knownTitles.find((k) => section.title.includes(k));

          return (
            <div
              key={index}
              className="bg-slate-950 border border-slate-700 rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{iconMap[key] || "📌"}</span>

                <h4 className="text-xl font-bold text-white">
                  {section.title}
                </h4>
              </div>

              <ul className="space-y-3">
                {section.body.map((item, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-slate-300 leading-7"
                  >
                    <span className="text-slate-400 mt-1">•</span>

                    <div className="flex-1 prose prose-invert max-w-none prose-p:my-0 prose-strong:text-white prose-strong:font-semibold">
                      <ReactMarkdown>{item}</ReactMarkdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}