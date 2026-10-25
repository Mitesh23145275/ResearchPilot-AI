import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  Clock3,
  FileText,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import api from "../services/api";

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const response = await api.get("/report/history");
        setReports(response.data);
      } catch (err) {
        console.error("Failed to load report history:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  async function downloadPDF(topic, draft) {
    if (!draft) return;

    try {
      const response = await api.post(
        "/pdf/download",
        { topic, draft },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${topic.trim().replace(/\s+/g, "_")}_research.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("PDF download failed.");
    }
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
            Research Timeline
          </div>

          <h1 className="mt-5 text-5xl font-bold text-white">
            Report History
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-400">
            Browse every AI-generated research report, reopen drafts, and
            download IEEE-formatted PDFs anytime.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-blue-900/20">

          {loading ? (
            <div className="py-12 text-center text-slate-400">
              Loading history...
            </div>
          ) : reports.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              No generated reports found yet.
            </div>
          ) : (
            <div className="space-y-8">

              {reports.map((report) => (
                <div
                  key={report.id}
                  className="relative rounded-3xl border border-white/10 bg-slate-950/60 p-6 transition-all duration-300 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10"
                >

                  {/* Timeline Dot */}
                  <div className="absolute -left-3 top-8 h-6 w-6 rounded-full border-4 border-slate-900 bg-blue-500 shadow-lg shadow-blue-500/50"></div>

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 p-3">
                          <FileText size={22} className="text-white" />
                        </div>

                        <div>
                          <h3 className="text-2xl font-bold text-white">
                            {report.topic}
                          </h3>

                          <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                            <Clock3 size={14} />
                            {new Date(
                              report.created_at * 1000
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">

                      <button
                        onClick={() =>
                          setSelectedReport(
                            selectedReport?.id === report.id ? null : report
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/60 px-4 py-2 text-white transition hover:border-blue-500/30 hover:bg-slate-800"
                      >
                        {selectedReport?.id === report.id ? (
                          <>
                            <EyeOff size={18} />
                            Hide Draft
                          </>
                        ) : (
                          <>
                            <Eye size={18} />
                            View Draft
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => downloadPDF(report.topic, report.draft)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 font-semibold text-white shadow-lg shadow-red-600/20 transition hover:-translate-y-0.5 hover:shadow-red-500/30"
                      >
                        <Download size={18} />
                        PDF
                      </button>

                    </div>
                  </div>

                  {/* Expanded Draft */}
                  {selectedReport?.id === report.id && (
                    <div className="mt-8 space-y-6">

                      <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
                        <h4 className="mb-4 text-xl font-bold text-white">
                          Draft Paper
                        </h4>

                        <div className="prose prose-invert max-w-none text-slate-300">
                          <ReactMarkdown>{report.draft}</ReactMarkdown>
                        </div>
                      </div>

                      {report.critique && (
                        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6">
                          <h4 className="mb-4 text-xl font-bold text-blue-300">
                            AI Critique
                          </h4>

                          <div className="prose prose-invert max-w-none text-slate-300">
                            <ReactMarkdown>{report.critique}</ReactMarkdown>
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}