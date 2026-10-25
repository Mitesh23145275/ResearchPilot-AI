export default function Header() {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h2 className="text-3xl font-bold text-white">
          Dashboard
        </h2>

        <p className="text-slate-400">
          AI-powered Collaborative Research Assistant
        </p>
      </div>

      <div className="px-4 py-2 rounded-full bg-green-500/20 text-green-400">
        ● Backend Connected
      </div>
    </header>
  );
}