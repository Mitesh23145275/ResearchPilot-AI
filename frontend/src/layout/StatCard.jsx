import { useEffect, useState } from "react";
import { FileText, Sparkles, Bot } from "lucide-react";

const iconMap = {
  "Uploaded Papers": FileText,
  "Reports Generated": Sparkles,
  Ollama: Bot,
};

export default function StatCard({ title, value }) {
  const [count, setCount] = useState(0);

  const isNumber = typeof value === "number";

  useEffect(() => {
    if (!isNumber) return;

    let current = 0;
    const duration = 1000;
    const stepTime = Math.max(20, duration / Math.max(value, 1));
    const step = Math.max(1, Math.ceil(value / 30));

    const timer = setInterval(() => {
      current += step;

      if (current >= value) {
        current = value;
        clearInterval(timer);
      }

      setCount(current);
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, isNumber]);

  const Icon = iconMap[title] || Sparkles;

  return (
    <div className="group rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-500/30 hover:shadow-blue-900/30">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-slate-400 text-sm">{title}</p>

          <h3 className="mt-3 text-4xl font-bold text-white">
            {isNumber ? count : value}
          </h3>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 p-3 text-white shadow-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
          <Icon size={24} />
        </div>

      </div>

      <div className="mt-6 h-1 overflow-hidden rounded-full bg-slate-800">
        <div className="h-full w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 transition-transform duration-700 group-hover:scale-x-100"></div>
      </div>

    </div>
  );
}