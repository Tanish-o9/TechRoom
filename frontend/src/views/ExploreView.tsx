import React, { useState } from "react";
import { Filter, ShieldCheck, Cpu, Code2 } from "lucide-react";
import { Video } from "../types";

interface ExploreViewProps {
  videos: Video[];
  onOpenVideo: (video: Video) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const TOPICS = ["All", "System Design", "DevOps", "Database", "Python", "Rust", "React"];
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"];

export const ExploreView: React.FC<ExploreViewProps> = ({
  videos,
  onOpenVideo,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredVideos = videos.filter((v) => {
    const matchesCategory =
      selectedCategory === "All" || v.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty =
      selectedDifficulty === "All" || (v.difficulty && v.difficulty === selectedDifficulty);
    const matchesSearch =
      !searchQuery.trim() ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.tags && v.tags.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatViews = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Header & Filter Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-400" />
            <span>Technical Discovery & Engineering Library</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Explore verified tutorials, production architecture deep dives, and live system design case studies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#1c2130]">
          {/* Topic Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => onSelectCategory(topic)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === topic
                    ? "bg-blue-600 text-white font-semibold shadow-sm"
                    : "bg-[#131622] hover:bg-[#1a1f2e] text-zinc-300 border border-[#212738]"
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Difficulty Dropdown / Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-3.5 h-3.5 text-zinc-400" />
            <span className="text-xs text-zinc-400">Level:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#131622] border border-[#212738] rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Curated Collections Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#121626] to-[#0f111a] border border-blue-500/20 space-y-1.5">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider font-semibold">
            Track 1 · High Scale
          </span>
          <h4 className="text-sm font-bold text-white">Distributed Consensus & Raft</h4>
          <p className="text-[11px] text-zinc-400">Log replication, RPC heartbeat, and split-brain recovery.</p>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-[#121a22] to-[#0f111a] border border-emerald-500/20 space-y-1.5">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
            Track 2 · Zero Downtime
          </span>
          <h4 className="text-sm font-bold text-white">Production Kubernetes & Ingress</h4>
          <p className="text-[11px] text-zinc-400">Blue/green deployments, OOMKilled post-mortems, and Traefik routing.</p>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-br from-[#191426] to-[#0f111a] border border-purple-500/20 space-y-1.5">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
            Track 3 · Frontend Systems
          </span>
          <h4 className="text-sm font-bold text-white">React 19 Server Components</h4>
          <p className="text-[11px] text-zinc-400">Module Federation, Server Actions, and micro-frontend state.</p>
        </div>
      </div>

      {/* Video Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
          <span>Showing {filteredVideos.length} verified sessions</span>
          <span>Scope Guard 100% Policy Pass</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => onOpenVideo(vid)}
              className="flex flex-col rounded-xl bg-[#10121a] border border-[#1e2332] hover:border-blue-500/40 cursor-pointer overflow-hidden group transition-all"
            >
              <div className="relative aspect-video bg-zinc-950 overflow-hidden">
                <img
                  src={vid.thumbnail_url}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  {formatDuration(vid.duration_seconds)}
                </span>
                <span className="absolute top-2 left-2 bg-black/75 backdrop-blur text-emerald-400 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Scope Verified</span>
                </span>
                <span className="absolute top-2 right-2 bg-[#121522]/90 backdrop-blur text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/20">
                  {vid.category}
                </span>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold text-zinc-100 group-hover:text-blue-400 line-clamp-2 leading-snug transition">
                    {vid.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#181c28] flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={vid.channel_avatar}
                      alt={vid.channel_title}
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
                    />
                    <span className="text-zinc-300 truncate">{vid.channel_title}</span>
                  </div>
                  <span className="text-zinc-500 font-mono text-[10px] shrink-0">
                    {formatViews(vid.views_count)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16 space-y-3 bg-[#10121a] rounded-xl border border-[#1e2332]">
            <Code2 className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">
              No technical sessions found matching your criteria.
            </p>
            <button
              onClick={() => {
                onSelectCategory("All");
                setSelectedDifficulty("All");
                onSearchChange("");
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
