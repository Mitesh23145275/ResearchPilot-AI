/*
import { motion } from "framer-motion";
import { Sparkles, Bot } from "lucide-react";

export default function LoadingOverlay({ show, title, subtitle }) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.92 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.25 }}
        className="glass-card w-[420px] rounded-3xl p-8 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "linear",
          }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-2xl shadow-blue-500/30"
        >
          <Bot size={34} className="text-white" />
        </motion.div>

        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-300">
          <Sparkles size={14} />
          AI Processing
        </div>

        <h2 className="mt-3 text-2xl font-bold text-white">
          {title || "Working..."}
        </h2>

        <p className="mt-3 text-slate-400">
          {subtitle || "Your AI agents are processing the request."}
        </p>

        <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-violet-500"
            initial={{ x: "-100%" }}
            animate={{ x: "220%" }}
            transition={{
              repeat: Infinity,
              duration: 1.6,
              ease: "easeInOut",
            }}
            style={{ width: "35%" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
*/