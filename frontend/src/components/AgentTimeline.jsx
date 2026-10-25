import { Brain, Search, PenTool, ShieldCheck, CheckCircle2 } from "lucide-react";

const agentNames = {
  supervisor: "Supervisor Agent",
  research: "Research Agent",
  writer: "Writer Agent",
  critique: "Critique Agent",
};

const agentIcons = {
  supervisor: Brain,
  research: Search,
  writer: PenTool,
  critique: ShieldCheck,
};

export default function AgentTimeline({ currentStep }) {
  const order = ["supervisor", "research", "writer", "critique"];

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl p-6 shadow-2xl shadow-blue-900/20 mb-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h3 className="text-xl font-bold text-white">
            Live AI Activity
          </h3>

          <p className="text-sm text-slate-400">
            Real-time multi-agent workflow
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-3 py-1">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-sm text-green-300">Live</span>
        </div>

      </div>

      {/* Agents */}
      <div className="space-y-4">

        {order.map((step, index) => {
          let status = "Pending";

          if (order.indexOf(currentStep) > index) status = "Done";
          if (currentStep === step) status = "Running";

          const Icon = agentIcons[step];

          return (
            <div
              key={step}
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                status === "Running"
                  ? "border-blue-500/40 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                  : status === "Done"
                  ? "border-green-500/30 bg-green-500/5"
                  : "border-white/10 bg-slate-950/60"
              }`}
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div
                    className={`rounded-xl p-3 ${
                      status === "Running"
                        ? "bg-blue-500 text-white"
                        : status === "Done"
                        ? "bg-green-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {status === "Done" ? (
                      <CheckCircle2 size={22} />
                    ) : (
                      <Icon size={22} />
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      {agentNames[step]}
                    </p>

                    <p className="text-sm text-slate-400">
                      {status === "Running"
                        ? "Currently processing..."
                        : status === "Done"
                        ? "Completed successfully."
                        : "Waiting for execution."}
                    </p>
                  </div>

                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    status === "Running"
                      ? "bg-blue-500/20 text-blue-300"
                      : status === "Done"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {status}
                </span>

              </div>

              {status === "Running" && (
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500 animate-pulse"></div>
                </div>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}