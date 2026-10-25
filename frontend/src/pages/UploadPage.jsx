import { Sparkles, FileText } from "lucide-react";
import UploadBox from "../components/UploadBox";

export default function UploadPage() {
  return (
    <div className="relative min-h-screen px-8 py-8 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-32 right-0 h-80 w-80 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 mb-5">
          <Sparkles size={16} />
          AI Research Assistant
        </div>

        {/* Heading */}
        <h1 className="text-5xl font-bold text-white leading-tight">
          Upload your
          <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
            {" "}Research Paper
          </span>
        </h1>

        <p className="mt-4 max-w-2xl text-slate-400 text-lg leading-relaxed">
          Drop your research paper and let ResearchPilot AI analyze it,
          build a knowledge base, generate IEEE-style reports, and assist
          you throughout your research workflow.
        </p>

        {/* Upload Card */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-8 shadow-2xl shadow-blue-900/20">

          <div className="flex items-center gap-3 mb-6">
            <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 p-3">
              <FileText className="text-white" size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white">
                Upload Research Paper
              </h2>
              <p className="text-slate-400 text-sm">
                PDF • Drag & Drop or Browse
              </p>
            </div>
          </div>

          <UploadBox />
        </div>
      </div>
    </div>
  );
}