import { useEffect, useState } from "react";
import {
  Video as VideoIcon,
  Play,
  Sparkles,
  BookOpen,
  ThumbsUp,
  Upload,
  Clock,
  Send,
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  status: string;
  duration_seconds: number;
  playback_url?: string;
}

interface Chapter {
  start_time: number;
  end_time: number;
  title: string;
  summary: string;
}

interface SummaryData {
  tldr: string;
  key_takeaways: string[];
  code_concepts: string[];
  chapters: Chapter[];
}

interface Citation {
  start_time: number;
  end_time: number;
  text_snippet: string;
}

interface AskResponse {
  answer: string;
  citations: Citation[];
}

export default function App() {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [question, setQuestion] = useState("");
  const [chatAnswer, setChatAnswer] = useState<AskResponse | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [likes, setLikes] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const demoVideo: Video = {
      id: "demo-v1",
      title: "Building Resilient Task Queues with Redis, Celery & PostgreSQL Outbox",
      description: "Complete guide to transactional outbox patterns, reliable async processing, and idempotent workers.",
      status: "ready",
      duration_seconds: 420,
      playback_url: "https://customer-m0.cloudflarestream.com/demo/manifest/video.m3u8",
    };
    setSelectedVideo(demoVideo);

    setSummary({
      tldr: "Architecting resilient distributed task queues with Redis and Celery.",
      key_takeaways: [
        "Outbox pattern guarantees reliable at-least-once task dispatching.",
        "PostgreSQL commits state changes and outbox events in a single transaction.",
        "Celery workers process events idempotently using provider event logs.",
      ],
      code_concepts: ["FastAPI", "SQLAlchemy 2.0 Async", "Redis", "Celery", "Outbox Pattern"],
      chapters: [
        { start_time: 0, end_time: 60, title: "1. Intro to Task Queues", summary: "Queue pitfalls and race conditions." },
        { start_time: 60, end_time: 240, title: "2. The Transactional Outbox", summary: "Writing outbox events inside DB commits." },
        { start_time: 240, end_time: 420, title: "3. Idempotent Worker Processing", summary: "Safe retries and deduplication." },
      ],
    });
  }, []);

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setChatAnswer({
      answer: "The outbox pattern ensures reliable queue dispatch by writing events to PostgreSQL before pushing to Celery.",
      citations: [{ start_time: 60, end_time: 120, text_snippet: "outbox pattern guarantees at-least-once delivery" }],
    });
    setQuestion("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/20">
            <VideoIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">TechRoom</h1>
            <p className="text-[11px] text-slate-400 font-mono">Watch · Ask · Run · Prove</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 px-3 py-1 text-xs rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Scope Guard Active</span>
          </span>
          <button className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Tutorial</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-black border border-slate-800 rounded-xl overflow-hidden aspect-video relative flex flex-col justify-end p-4 group">
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
              <div className="text-center space-y-3">
                <button
                  onClick={() => setCurrentTime(currentTime + 15)}
                  className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full transition shadow-xl"
                >
                  <Play className="w-7 h-7 fill-white translate-x-0.5" />
                </button>
                <p className="text-xs text-slate-400 font-mono">Simulated HLS Player: {formatTime(currentTime)} / 7:00</p>
              </div>
            </div>

            <div className="relative z-10 w-full bg-slate-900/90 backdrop-blur rounded-lg p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-blue-400">{formatTime(currentTime)}</span>
                <span className="text-slate-500">/</span>
                <span className="font-mono text-slate-400">7:00</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setHasLiked(!hasLiked);
                    setLikes(hasLiked ? likes - 1 : likes + 1);
                  }}
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition ${
                    hasLiked ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{likes}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight">{selectedVideo?.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedVideo?.description}</p>
          </div>

          {summary && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>AI Chapter Index</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {summary.chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTime(ch.start_time)}
                    className="text-left bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 p-2.5 rounded-lg transition"
                  >
                    <div className="text-[11px] font-mono text-blue-400">{formatTime(ch.start_time)}</div>
                    <div className="text-xs font-medium text-slate-200 truncate">{ch.title}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {summary && (
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>AI Technical Summary</span>
              </div>
              <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded border border-slate-800/80">
                {summary.tldr}
              </p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                {summary.key_takeaways.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex flex-col h-full space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-semibold">Grounded RAG Assistant</h3>
            </div>
            <p className="text-xs text-slate-400">
              Ask questions about the video. Answers are strictly grounded with clickable timestamp citations.
            </p>

            {chatAnswer && (
              <div className="bg-slate-950 border border-blue-500/20 rounded-lg p-3.5 space-y-3">
                <p className="text-xs text-slate-200 leading-relaxed">{chatAnswer.answer}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {chatAnswer.citations.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTime(c.start_time)}
                      className="inline-flex items-center space-x-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded text-[10px] font-mono"
                    >
                      <span>⏱ {formatTime(c.start_time)}</span>
                      <span>·</span>
                      <span className="truncate max-w-[120px]">{c.text_snippet}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleAsk} className="mt-auto space-y-2">
              <div className="relative">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask about this video..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-9 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 text-slate-400 hover:text-blue-400 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>9-layer injection defense</span>
                <span>Token budget: 50k/day</span>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
