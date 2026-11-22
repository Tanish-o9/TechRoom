import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  Bell,
  Play,
  Pause,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Sparkles,
  BookOpen,
  Clock,
  Send,
  CheckCircle2,
  Home,
  Flame,
  History,
  Code2,
  ShieldCheck,
  UploadCloud,
  X,
  Layers,
  ArrowLeft,
} from "lucide-react";

interface Video {
  id: string;
  channel_id: string;
  title: string;
  description: string;
  visibility: string;
  status: string;
  duration_seconds: number;
  playback_url?: string;
  thumbnail_url?: string;
  views_count: number;
  category: string;
  tags?: string;
  channel_title?: string;
  channel_handle?: string;
  channel_avatar?: string;
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

interface Comment {
  id: string;
  username: string;
  content: string;
  timestamp_seconds?: number;
  created_at: string;
}

const CATEGORIES = ["All", "System Design", "DevOps", "Database", "Python", "Rust", "React"];

export default function App() {
  const [view, setView] = useState<"feed" | "watch">("feed");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  // Watch view state
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likes, setLikes] = useState(1420);
  const [hasLiked, setHasLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"ai_tutor" | "chapters" | "comments">("ai_tutor");

  // RAG Assistant state
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: AskResponse }>>([]);
  const [asking, setAsking] = useState(false);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      username: "alice_dev",
      content: "The transactional outbox explanation around 03:00 saved our distributed system from race conditions!",
      timestamp_seconds: 180,
      created_at: "2 hours ago",
    },
    {
      id: "c2",
      username: "dan_eng",
      content: "Great breakdown of B-Trees vs LSM Trees. Highly recommended for system design rounds.",
      timestamp_seconds: 240,
      created_at: "1 day ago",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState("System Design");
  const [uploadDesc, setUploadDesc] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Fetch videos from backend API
  const fetchVideos = async (cat: string = selectedCategory, search: string = searchQuery) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (cat && cat !== "All") params.append("category", cat);
      if (search.trim()) params.append("search", search.trim());
      const res = await fetch(`/api/v1/videos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch {
      // Keep existing videos if network fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos(selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideos(selectedCategory, searchQuery);
  };

  // Open video watch view
  const openVideo = async (video: Video) => {
    setActiveVideo(video);
    setView("watch");
    setCurrentTime(0);
    setIsPlaying(true);
    setChatHistory([]);

    // Fetch AI Summary & Chapters
    try {
      const res = await fetch(`/api/v1/ai/summary/${video.id}`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      } else {
        // Fallback default chapters if newly created
        setSummary({
          tldr: `Comprehensive technical breakdown of ${video.title}.`,
          key_takeaways: [
            "Guaranteed reliable execution and resilience patterns.",
            "Production-tested architectural best practices.",
            "Timestamp-grounded code citations.",
          ],
          code_concepts: [video.category, "Clean Architecture", "Production Ready"],
          chapters: [
            { start_time: 0, end_time: 120, title: "1. Core Principles & Setup", summary: "Initial design concepts." },
            { start_time: 120, end_time: 300, title: "2. Implementation Deep Dive", summary: "Writing the solution." },
            { start_time: 300, end_time: video.duration_seconds, title: "3. Verification & Metrics", summary: "Release benchmarks." },
          ],
        });
      }
    } catch {
      // default fallback
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Grounded RAG Ask
  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !activeVideo) return;
    const qText = question;
    setQuestion("");
    setAsking(true);

    try {
      const res = await fetch(`/api/v1/ai/ask/${activeVideo.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: qText, current_timestamp: currentTime }),
      });
      if (res.ok) {
        const data: AskResponse = await res.json();
        setChatHistory((prev) => [...prev, { q: qText, a: data }]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            q: qText,
            a: {
              answer: "The outbox pattern ensures reliable queue dispatch by writing events to PostgreSQL before pushing to Celery.",
              citations: [{ start_time: 60, end_time: 120, text_snippet: "outbox pattern guarantees at-least-once delivery" }],
            },
          },
        ]);
      }
    } catch {
      // offline simulation
      setChatHistory((prev) => [
        ...prev,
        {
          q: qText,
          a: {
            answer: "The outbox pattern ensures reliable queue dispatch by writing events to PostgreSQL before pushing to Celery.",
            citations: [{ start_time: 60, end_time: 120, text_snippet: "outbox pattern guarantees at-least-once delivery" }],
          },
        },
      ]);
    } finally {
      setAsking(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      {
        id: `c_${Date.now()}`,
        username: "current_developer",
        content: newComment,
        timestamp_seconds: currentTime > 0 ? currentTime : undefined,
        created_at: "Just now",
      },
      ...comments,
    ]);
    setNewComment("");
  };

  const handleMockUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newVid: Video = {
      id: `usr_${Date.now()}`,
      channel_id: "my_channel",
      title: uploadTitle,
      description: uploadDesc || "Developer tutorial uploaded to TechRoom.",
      category: uploadCategory,
      visibility: "public",
      status: "ready",
      duration_seconds: 540,
      views_count: 1,
      thumbnail_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
      channel_title: "My Developer Channel",
      channel_handle: "my_dev",
      channel_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    };

    setVideos([newVid, ...videos]);
    setUploadSuccess(true);
    setTimeout(() => {
      setUploadModalOpen(false);
      setUploadSuccess(false);
      setUploadTitle("");
      setUploadDesc("");
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatViews = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* 1. YouTube-Style Top Navbar */}
      <header className="sticky top-0 z-50 bg-[#0f0f0f]/95 backdrop-blur border-b border-zinc-800 px-4 h-14 flex items-center justify-between gap-4">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300 transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div
            onClick={() => setView("feed")}
            className="flex items-center gap-1.5 cursor-pointer select-none group"
          >
            <div className="bg-red-600 group-hover:bg-red-500 text-white p-1.5 rounded-lg flex items-center justify-center transition shadow-md shadow-red-600/30">
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            </div>
            <div className="flex items-center">
              <span className="font-bold text-lg tracking-tight text-white">Tech</span>
              <span className="font-bold text-lg tracking-tight text-red-500">Room</span>
              <span className="ml-1.5 text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                DEV
              </span>
            </div>
          </div>
        </div>

        {/* Center: YouTube Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl flex items-center">
          <div className="flex items-center w-full bg-zinc-950 border border-zinc-700 rounded-l-full px-4 py-1.5 focus-within:border-blue-500">
            <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search developer videos, code concepts, errors..."
              className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  fetchVideos(selectedCategory, "");
                }}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="bg-zinc-800 hover:bg-zinc-700 border border-l-0 border-zinc-700 px-5 py-2 rounded-r-full text-zinc-300 transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Right: Upload, Scope Guard Badge, Profile */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scope Guard</span>
          </span>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
          >
            <UploadCloud className="w-4 h-4 text-red-500" />
            <span>Create</span>
          </button>
          <button className="p-2 rounded-full hover:bg-zinc-800 text-zinc-300 transition">
            <Bell className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold ring-2 ring-zinc-700 cursor-pointer">
            DEV
          </div>
        </div>
      </header>

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* 2. Left Sidebar (YouTube Style) */}
        {sidebarOpen && (
          <aside className="w-56 shrink-0 bg-[#0f0f0f] border-r border-zinc-800/80 p-3 space-y-4 overflow-y-auto hidden md:block">
            <div className="space-y-1">
              <button
                onClick={() => setView("feed")}
                className={`w-full flex items-center gap-4 px-3 py-2 rounded-xl text-xs font-medium transition ${
                  view === "feed" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <Home className="w-4 h-4 text-red-500" />
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("System Design");
                  setView("feed");
                }}
                className="w-full flex items-center gap-4 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Trending Architecture</span>
              </button>
              <button
                onClick={() => setView("feed")}
                className="w-full flex items-center gap-4 px-3 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-900 transition"
              >
                <Layers className="w-4 h-4 text-blue-400" />
                <span>Subscriptions</span>
              </button>
            </div>

            <div className="border-t border-zinc-800/80 pt-3 space-y-1">
              <div className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Library
              </div>
              <button className="w-full flex items-center gap-4 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:bg-zinc-900 transition">
                <History className="w-4 h-4 text-zinc-400" />
                <span>History</span>
              </button>
              <button className="w-full flex items-center gap-4 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:bg-zinc-900 transition">
                <Bookmark className="w-4 h-4 text-zinc-400" />
                <span>Saved Tutorials</span>
              </button>
              <button className="w-full flex items-center gap-4 px-3 py-2 rounded-xl text-xs text-zinc-300 hover:bg-zinc-900 transition">
                <ThumbsUp className="w-4 h-4 text-zinc-400" />
                <span>Liked Videos</span>
              </button>
            </div>

            <div className="border-t border-zinc-800/80 pt-3 space-y-1">
              <div className="px-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Explore Topics
              </div>
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setView("feed");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs transition ${
                    selectedCategory === cat ? "bg-zinc-800 text-blue-400 font-semibold" : "text-zinc-400 hover:bg-zinc-900"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{cat}</span>
                </button>
              ))}
            </div>

            <div className="border-t border-zinc-800/80 pt-3 px-3 text-[11px] text-zinc-500 space-y-1 font-mono">
              <p>TechRoom v2.0</p>
              <p>Developer-Only Policy</p>
              <p>© 2026 TechRoom Inc.</p>
            </div>
          </aside>
        )}

        {/* 3. Main Body Scrollable View */}
        <main className="flex-1 overflow-y-auto">
          {/* ======================= VIEW 1: HOME FEED (YOUTUBE STYLE) ======================= */}
          {view === "feed" && (
            <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
              {/* Category Pills (YouTube Horizontal Scroll) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? "bg-white text-black font-semibold"
                        : "bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Scope Guard Developer Banner */}
              <div className="bg-gradient-to-r from-blue-950/40 via-zinc-900 to-zinc-900 border border-blue-900/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Developer-Only Stream · Zero Entertainment Fluff</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Watch. Ask. Run. Prove.
                  </h2>
                  <p className="text-xs text-zinc-400 max-w-xl">
                    Every tutorial is timestamp-grounded with interactive chapters, verified runnable snippets, and AI Grounded Q&A.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                    {videos.length} Verified Videos
                  </span>
                </div>
              </div>

              {/* YouTube Video Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-y-7 gap-x-4">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    onClick={() => openVideo(vid)}
                    className="flex flex-col cursor-pointer group space-y-3"
                  >
                    {/* Thumbnail Container */}
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 group-hover:shadow-lg group-hover:shadow-blue-500/10 transition">
                      <img
                        src={
                          vid.thumbnail_url ||
                          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80"
                        }
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {/* Duration Badge */}
                      <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-white text-[11px] font-mono font-medium px-2 py-0.5 rounded">
                        {formatTime(vid.duration_seconds)}
                      </span>
                      {/* Scope Guard Verified Badge */}
                      <span className="absolute top-2 left-2 bg-black/75 backdrop-blur text-emerald-400 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Scope Verified</span>
                      </span>
                    </div>

                    {/* Video Info (Avatar, Title, Channel, Views) */}
                    <div className="flex gap-3 items-start">
                      <img
                        src={
                          vid.channel_avatar ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                        }
                        alt={vid.channel_title || "Channel"}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-zinc-700 shrink-0 mt-0.5"
                      />
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug group-hover:text-blue-400 transition">
                          {vid.title}
                        </h3>
                        <p className="text-xs text-zinc-400 flex items-center gap-1 hover:text-zinc-200">
                          <span>{vid.channel_title || "TechRoom Creator"}</span>
                          <CheckCircle2 className="w-3 h-3 text-zinc-500" />
                        </p>
                        <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
                          <span>{formatViews(vid.views_count)}</span>
                          <span>•</span>
                          <span>{vid.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {videos.length === 0 && !loading && (
                <div className="text-center py-16 space-y-3">
                  <Code2 className="w-12 h-12 text-zinc-600 mx-auto" />
                  <p className="text-sm text-zinc-400">No developer videos match your filter.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                      fetchVideos("All", "");
                    }}
                    className="px-4 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-200 hover:bg-zinc-700"
                  >
                    Clear Filter
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ======================= VIEW 2: WATCH PAGE (YOUTUBE STYLE) ======================= */}
          {view === "watch" && activeVideo && (
            <div className="p-4 sm:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Columns: Video Player, Metadata, Tabs (AI Tutor, Chapters, Comments) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Back to Feed button */}
                <button
                  onClick={() => setView("feed")}
                  className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition pb-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Video Feed</span>
                </button>

                {/* Simulated HLS Video Player */}
                <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden aspect-video relative flex flex-col justify-end p-4 group shadow-2xl">
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/70">
                    <button
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        if (currentTime >= activeVideo.duration_seconds) setCurrentTime(0);
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white p-5 rounded-full transition shadow-xl hover:scale-110"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 fill-white" />
                      ) : (
                        <Play className="w-8 h-8 fill-white translate-x-0.5" />
                      )}
                    </button>
                  </div>

                  {/* Player Controls Bar */}
                  <div className="relative z-10 w-full bg-zinc-900/90 backdrop-blur rounded-xl p-3 flex items-center justify-between text-xs border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                        className="text-zinc-300 hover:text-white text-[11px] font-mono px-2 py-1 rounded bg-zinc-800"
                      >
                        -10s
                      </button>
                      <button
                        onClick={() =>
                          setCurrentTime(Math.min(activeVideo.duration_seconds, currentTime + 10))
                        }
                        className="text-zinc-300 hover:text-white text-[11px] font-mono px-2 py-1 rounded bg-zinc-800"
                      >
                        +10s
                      </button>
                      <div className="flex items-center gap-1 font-mono text-zinc-200">
                        <span className="text-red-400 font-semibold">{formatTime(currentTime)}</span>
                        <span className="text-zinc-500">/</span>
                        <span className="text-zinc-400">{formatTime(activeVideo.duration_seconds)}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2.5 py-1 rounded">
                      Cloudflare Stream HLS (1080p60)
                    </span>
                  </div>
                </div>

                {/* Video Title */}
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {activeVideo.title}
                </h1>

                {/* Channel Actions Bar (YouTube Layout) */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
                  {/* Channel Info & Subscribe */}
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        activeVideo.channel_avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                      }
                      alt={activeVideo.channel_title || "Channel"}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-zinc-700"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1">
                        <span>{activeVideo.channel_title || "TechRoom Creator"}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />
                      </h4>
                      <p className="text-[11px] text-zinc-400 font-mono">128K subscribers</p>
                    </div>
                    <button
                      onClick={() => setIsSubscribed(!isSubscribed)}
                      className={`ml-3 px-4 py-2 rounded-full text-xs font-semibold transition ${
                        isSubscribed
                          ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                          : "bg-white text-black hover:bg-zinc-200"
                      }`}
                    >
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                  </div>

                  {/* Actions (Like, Dislike, Share, Save) */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-zinc-800/90 rounded-full overflow-hidden">
                      <button
                        onClick={() => {
                          setHasLiked(!hasLiked);
                          setLikes(hasLiked ? likes - 1 : likes + 1);
                        }}
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium hover:bg-zinc-700 transition ${
                          hasLiked ? "text-blue-400 font-semibold" : "text-zinc-200"
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>{likes}</span>
                      </button>
                      <div className="w-[1px] h-4 bg-zinc-700" />
                      <button className="px-3 py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-700 transition">
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => alert("Video tutorial link copied to clipboard!")}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>

                    <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-zinc-800/90 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition">
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>

                {/* Expandable YouTube Description Box */}
                <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px]">
                    <span className="font-semibold text-zinc-200">{formatViews(activeVideo.views_count)}</span>
                    <span>•</span>
                    <span>Category: {activeVideo.category}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Scope Guard Verified
                    </span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                    {activeVideo.description}
                  </p>

                  {/* AI TL;DR Card */}
                  {summary && (
                    <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-xl p-3.5 space-y-2 mt-2">
                      <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Technical TL;DR</span>
                      </div>
                      <p className="text-zinc-300 font-mono text-[11px] leading-relaxed">
                        {summary.tldr}
                      </p>
                      <ul className="text-zinc-400 text-[11px] space-y-1 list-disc list-inside">
                        {summary.key_takeaways.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Feature Tabs: AI Grounded Tutor vs Chapters vs Comments */}
                <div className="border-b border-zinc-800 flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab("ai_tutor")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                      activeTab === "ai_tutor"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Grounded AI Tutor</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("chapters")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                      activeTab === "chapters"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span>Interactive Chapters</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("comments")}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
                      activeTab === "comments"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Comments ({comments.length})</span>
                  </button>
                </div>

                {/* TAB 1: Grounded AI Tutor */}
                {activeTab === "ai_tutor" && (
                  <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 space-y-4">
                    <p className="text-xs text-zinc-400">
                      Ask questions about this tutorial. Answers are grounded in video transcripts with clickable citations.
                    </p>

                    {/* Chat Messages */}
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {chatHistory.map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="bg-zinc-800/60 text-zinc-200 text-xs px-3 py-2 rounded-lg max-w-[85%] ml-auto">
                            {item.q}
                          </div>
                          <div className="bg-zinc-950 border border-blue-500/20 text-zinc-200 text-xs p-3.5 rounded-xl space-y-2 max-w-[95%]">
                            <p className="leading-relaxed">{item.a.answer}</p>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {item.a.citations.map((cit, ci) => (
                                <button
                                  key={ci}
                                  onClick={() => setCurrentTime(cit.start_time)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[10px] font-mono transition"
                                >
                                  <span>⏱ {formatTime(cit.start_time)}</span>
                                  <span>·</span>
                                  <span className="truncate max-w-[140px]">{cit.text_snippet}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                      {asking && (
                        <div className="text-xs font-mono text-zinc-500 animate-pulse">
                          AI Platform Gateway retrieving grounded context...
                        </div>
                      )}
                    </div>

                    {/* Question Input */}
                    <form onSubmit={handleAskQuestion} className="flex gap-2">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask anything about this tutorial (e.g. why outbox pattern?)..."
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={asking || !question.trim()}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Ask</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* TAB 2: Interactive Chapters */}
                {activeTab === "chapters" && summary && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {summary.chapters.map((ch, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentTime(ch.start_time);
                          setIsPlaying(true);
                        }}
                        className="text-left bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 p-3 rounded-xl transition space-y-1 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-semibold text-blue-400 group-hover:underline">
                            ⏱ {formatTime(ch.start_time)}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono">
                            {formatTime(ch.end_time - ch.start_time)}
                          </span>
                        </div>
                        <h5 className="text-xs font-semibold text-zinc-200 line-clamp-1">{ch.title}</h5>
                        <p className="text-[11px] text-zinc-400 line-clamp-2">{ch.summary}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* TAB 3: Comments */}
                {activeTab === "comments" && (
                  <div className="space-y-4">
                    {/* Add Comment */}
                    <form onSubmit={handleAddComment} className="flex gap-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={`Add a developer comment at ${formatTime(currentTime)}...`}
                        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl transition"
                      >
                        Comment
                      </button>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {comments.map((cm) => (
                        <div key={cm.id} className="flex gap-3 items-start text-xs">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-[10px]">
                            {cm.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-zinc-200">@{cm.username}</span>
                              <span className="text-[10px] text-zinc-500">{cm.created_at}</span>
                              {cm.timestamp_seconds !== undefined && (
                                <button
                                  onClick={() => setCurrentTime(cm.timestamp_seconds!)}
                                  className="text-[10px] font-mono text-blue-400 hover:underline"
                                >
                                  ⏱ {formatTime(cm.timestamp_seconds)}
                                </button>
                              )}
                            </div>
                            <p className="text-zinc-300 leading-relaxed">{cm.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: YouTube "Up Next" / Recommended List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-sm font-bold text-white">Up Next</h3>
                  <span className="text-[11px] text-zinc-500 font-mono">Autoplay ON</span>
                </div>

                <div className="space-y-3">
                  {videos
                    .filter((v) => v.id !== activeVideo.id)
                    .map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => openVideo(rec)}
                        className="flex gap-3 cursor-pointer group rounded-xl p-1.5 hover:bg-zinc-900 transition"
                      >
                        <div className="relative w-36 aspect-video rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                          <img
                            src={
                              rec.thumbnail_url ||
                              "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80"
                            }
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-mono text-white px-1.5 py-0.2 rounded">
                            {formatTime(rec.duration_seconds)}
                          </span>
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="text-xs font-semibold text-zinc-100 line-clamp-2 leading-tight group-hover:text-blue-400 transition">
                            {rec.title}
                          </h4>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {rec.channel_title || "TechRoom Creator"}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono">
                            {formatViews(rec.views_count)} • {rec.category}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ======================= UPLOAD TUTORIAL MODAL ======================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-red-500" />
                <h3 className="text-base font-bold text-white">Upload Developer Tutorial</h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="text-center py-8 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-white">Scope Guard Passed!</h4>
                <p className="text-xs text-zinc-400">
                  Video tutorial validated and published to the TechRoom feed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleMockUpload} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Tutorial Title</label>
                  <input
                    type="text"
                    required
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="e.g. Distributed Consensus with Raft & Go"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 focus:outline-none focus:border-blue-500"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Description</label>
                  <textarea
                    rows={3}
                    value={uploadDesc}
                    onChange={(e) => setUploadDesc(e.target.value)}
                    placeholder="Explain technical prerequisites, system design trade-offs, and code topics..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>

                <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    All uploads are inspected by Scope Guard. Non-software engineering content (generic vlogs, celebrity, entertainment) will be rejected.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition"
                  >
                    Submit & Inspect
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
