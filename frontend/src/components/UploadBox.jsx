import { useState } from "react";
import { Upload, FileText, CheckCircle2 } from "lucide-react";
import api from "../services/api";

export default function UploadBox() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  function handleFile(selectedFile) {
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setResult(null);
    }
  }

  async function handleUpload() {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await api.post("/upload/", formData);
      setResult(response.data);
    } catch (error) {
      setResult({
        message: error.response?.data?.detail || "Upload failed.",
      });
    }

    setLoading(false);
  }

  return (
    <div className="text-white">

      {/* Drag & Drop Area */}
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files[0]);
        }}
        className={`group block cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          dragActive
            ? "border-blue-400 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,.25)]"
            : "border-blue-500/40 bg-slate-950/50 hover:border-blue-400 hover:bg-slate-900/70"
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFile(e.target.files[0])}
          className="hidden"
        />

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30 transition-transform duration-300 group-hover:scale-105">
          <Upload size={38} className="text-white" />
        </div>

        <h3 className="text-2xl font-bold">
          {dragActive ? "Drop your PDF here" : "Drag & Drop your PDF"}
        </h3>

        <p className="mt-3 text-slate-400">
          or click anywhere inside this box to browse your computer
        </p>

        <button
          type="button"
          className="mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:scale-105"
        >
          Choose PDF
        </button>

        {/* Selected File */}
        {file && (
          <div className="mt-8 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-400" size={24} />

              <div className="min-w-0">
                <p className="truncate font-semibold text-white">
                  {file.name}
                </p>
                <p className="text-sm text-slate-300">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
        )}
      </label>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`mt-8 w-full rounded-2xl py-4 font-semibold text-white transition-all duration-300 ${
          !file || loading
            ? "cursor-not-allowed bg-slate-700"
            : "bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-600/30 hover:-translate-y-0.5 hover:shadow-blue-500/40"
        }`}
      >
        {loading ? "Uploading..." : "Upload PDF"}
      </button>

      {/* Upload Result */}
      {result && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-6 backdrop-blur">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="text-blue-400" size={22} />
            <h3 className="text-lg font-semibold">Upload Result</h3>
          </div>

          <p className="mb-3">
            <strong>Status:</strong> {result.message}
          </p>

          {result.filename && (
            <>
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-800/60 p-3 text-center">
                  <p className="text-sm text-slate-400">Pages</p>
                  <p className="text-xl font-bold">{result.pages}</p>
                </div>

                <div className="rounded-xl bg-slate-800/60 p-3 text-center">
                  <p className="text-sm text-slate-400">Characters</p>
                  <p className="text-xl font-bold">{result.characters}</p>
                </div>

                <div className="rounded-xl bg-slate-800/60 p-3 text-center">
                  <p className="text-sm text-slate-400">File</p>
                  <p className="truncate text-sm font-semibold">
                    {result.filename}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-900/70 p-4">
                <p className="mb-2 font-semibold text-white">Preview</p>
                <p className="max-h-40 overflow-y-auto whitespace-pre-wrap text-sm text-slate-300">
                  {result.preview}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}