import { useEffect, useState } from "react";
import { Sparkles, Send, Bot, User, FileText } from "lucide-react";
import api from "../services/api";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [mode, setMode] = useState("all");

  useEffect(() => {
    async function loadDocuments() {
      try {
        const response = await api.get("/upload/documents");
        setDocuments(response.data);
      } catch (err) {
        console.error(err);
      }
    }

    loadDocuments();
  }, []);

  async function askAI() {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await api.post("/chat/ask", {
        question,
        mode,
        document_id: mode === "selected" ? selectedDocument : null,
      });
      setAnswer(response.data);
    } catch {
      setAnswer({
        answer: "Something went wrong.",
        sources: [],
      });
    }

    setLoading(false);
  }

  return (
    <div className="relative min-h-screen px-8 py-8 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-blue-600/15 blur-[140px]" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
            <Sparkles size={16} />
            AI Research Chat
          </div>

          <h1 className="mt-5 text-5xl font-bold text-white">
            Ask Your Research Papers
          </h1>

          <p className="mt-3 max-w-3xl text-lg text-slate-400">
            Ask questions about your uploaded papers and get AI-powered answers
            grounded in your knowledge base.
          </p>
        </div>

        {/* Chat Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-blue-900/20">

          {/* Input */}
          <div className="space-y-4">
            {/* Chat Mode */}
            <div className="space-y-4 mb-4">

              <div>
                <label className="block text-slate-300 text-sm mb-2">
                  Chat Mode
                </label>

                <div className="inline-flex rounded-xl border border-slate-700 bg-slate-900 p-1">
                  <button
                    onClick={() => setMode("all")}
                    className={`px-4 py-2 rounded-lg transition ${
                      mode === "all"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    🌍 All Documents
                  </button>

                  <button
                    onClick={() => setMode("selected")}
                    className={`px-4 py-2 rounded-lg transition ${
                      mode === "selected"
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    📄 Selected Document
                  </button>
                </div>
              </div>

              {mode === "selected" && (
                <div>
                  <label className="block text-slate-300 text-sm mb-2">
                    Select Document
                  </label>

                  <select
                    value={selectedDocument}
                    onChange={(e) => setSelectedDocument(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-slate-700 text-white p-3"
                  >
                    <option value="">Choose a document...</option>

                    {documents.map((doc) => (
                      <option key={doc.id} value={doc.id}>
                        {doc.file_type.toUpperCase()} • {doc.filename}
                      </option>
                    ))}
                  </select>
                </div>
              )}

            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about your uploaded research papers..."
              className="h-36 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-5 text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
            />

            <button
              onClick={askAI}
              disabled={loading || (mode === "selected" && !selectedDocument)}
              className={`flex items-center justify-center gap-2 rounded-2xl px-8 py-4 font-semibold text-white transition-all duration-300 ${
                loading
                  ? "cursor-not-allowed bg-slate-700"
                  : "bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-600/30 hover:-translate-y-1 hover:shadow-blue-500/40"
              }`}
            >
              <Send size={18} />
              {loading ? "Thinking..." : "Ask AI"}
            </button>

          </div>

          {/* Conversation */}
          {answer && (
            <div className="mt-10 space-y-6">

              {/* User Bubble */}
              <div className="flex justify-end">
                <div className="max-w-3xl rounded-3xl rounded-br-lg bg-gradient-to-r from-blue-600 to-violet-600 p-5 text-white shadow-lg">
                  <div className="mb-2 flex items-center gap-2">
                    <User size={18} />
                    <span className="text-sm font-semibold">You</span>
                  </div>

                  <p className="whitespace-pre-wrap">{question}</p>
                </div>
              </div>

              {/* AI Bubble */}
              <div className="flex justify-start">
                <div className="max-w-3xl rounded-3xl rounded-bl-lg border border-white/10 bg-slate-950/70 p-6 shadow-lg">

                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-full bg-gradient-to-br from-blue-500 to-violet-600 p-2">
                      <Bot size={18} className="text-white" />
                    </div>

                    <span className="font-semibold text-white">
                      ResearchPilot AI
                    </span>
                  </div>

                  <p className="whitespace-pre-wrap leading-8 text-slate-300">
                    {answer.answer}
                  </p>

                  {/* Sources */}
                  {answer.sources && answer.sources.length > 0 && (
                    <div className="mt-6 border-t border-white/10 pt-5">

                      <div className="mb-3 flex items-center gap-2">
                        <FileText size={18} className="text-blue-400" />
                        <span className="font-semibold text-white">
                          Sources
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        {answer.sources.map((source) => (
                          <div
                            key={source}
                            className="rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 transition hover:bg-blue-500/20"
                          >
                            {source}
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}