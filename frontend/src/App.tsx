import { useEffect, useState } from "react";
import { Terminal, Shield, Video, Code2, Sparkles, BookOpen } from "lucide-react";

interface HealthStatus {
  status: string;
  service: string;
}

export default function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);

  useEffect(() => {
    fetch("/api/v1/health")
      .then((res) => res.json())
      .then((data) => setHealth(data))
      .catch(() => setHealth({ status: "offline", service: "techroom-api" }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">TechRoom</h1>
            <p className="text-xs text-slate-400 font-mono">developer-only · AI-native</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 text-xs rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                health?.status === "ok" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="font-mono">API: {health?.status ?? "connecting..."}</span>
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-8">
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Watch · Ask · Run · Prove</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            The Video Platform Built Exclusively for Software Developers
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Every technical tutorial is searchable by concept, answerable with timestamped citations,
            runnable in sandboxed playgrounds, and backed by verifiable code proof.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
              <Code2 className="w-5 h-5 text-blue-400" />
              <h3 className="text-sm font-semibold">Code-Native Video</h3>
              <p className="text-xs text-slate-400">
                Frames become code via OCR/VLM. Extract snippets, run in isolated playgrounds, and inspect diffs.
              </p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold">Scope Guard Enforced</h3>
              <p className="text-xs text-slate-400">
                Strict automated moderation keeps out vanity entertainment, clickbait, and non-technical fluff.
              </p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-4 space-y-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-semibold">Grounded RAG & Proof</h3>
              <p className="text-xs text-slate-400">
                Timestamp-grounded answers with citations, FSRS spaced-repetition flashcards, and verified skill badges.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-3">
            <Terminal className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold font-mono">Platform Status & Architecture</h3>
          </div>
          <div className="text-xs font-mono bg-slate-950 p-4 rounded-lg border border-slate-800 text-slate-300 space-y-1">
            <p>✓ Core: FastAPI Modular Monolith + SQLAlchemy 2.0 (async)</p>
            <p>✓ Storage: PostgreSQL 16 (Transactional) + Qdrant (Derivable Vectors)</p>
            <p>✓ Async: PostgreSQL Outbox Pattern + Celery / Redis Workers</p>
            <p>✓ Ingestion: Cloudflare Stream Direct Upload Adapter</p>
            <p>✓ AI Platform: Single Gateway with Token/Cost Budgets & Prompt Registry</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500 font-mono">
        TechRoom Platform v2.0 · Developer-Only AI Video Streaming
      </footer>
    </div>
  );
}
