import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";

import Sidebar from "./layout/Sidebar";
import CommandPalette from "./components/CommandPalette";

import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import KnowledgeBase from "./pages/KnowledgeBase";
import ResearchPage from "./pages/ResearchPage";
import ChatPage from "./pages/ChatPage";
import History from "./pages/History";
import Settings from "./pages/Settings";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0f172a",
            color: "#fff",
            border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: "16px",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <CommandPalette />

      <div className="relative flex min-h-screen overflow-hidden bg-[#020617]">

        {/* Animated Aurora Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-32 h-[32rem] w-[32rem] animate-pulse rounded-full bg-blue-600/15 blur-[140px]" />
          <div
            className="absolute top-1/3 -right-24 h-[28rem] w-[28rem] animate-pulse rounded-full bg-violet-600/12 blur-[140px]"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] animate-pulse rounded-full bg-cyan-500/10 blur-[120px]"
            style={{ animationDelay: "3s" }}
          />
        </div>

        {/* Sidebar */}
        <div className="relative z-20">
          <Sidebar />
        </div>

        {/* Main Content */}
        <main className="relative z-10 flex-1 overflow-y-auto p-8">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;