import React, { useEffect, useState } from "react";
import {
  Flame,
  ArrowRight,
  CheckCircle2,
  Terminal,
  FolderGit2,
  Sparkles,
  GitCommit,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Activity,
  Code2,
  Target,
} from "lucide-react";
import { Video, Mission, ProjectGenome, AppView } from "../types";

interface HomeViewProps {
  videos: Video[];
  onOpenVideo: (video: Video) => void;
  onNavigate: (view: AppView) => void;
  onOpenMission: (missionId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  videos,
  onOpenVideo,
  onNavigate,
  onOpenMission,
}) => {
  const [activeMissions, setActiveMissions] = useState<Mission[]>([]);
  const [recentProjects, setRecentProjects] = useState<ProjectGenome[]>([]);
  const [stats, setStats] = useState<any>({
    username: "tanish_dev",
    streak_days: 14,
    active_missions_count: 3,
    total_challenges: 2,
    completed_challenges: 1,
    monitored_projects: 3,
    verified_xp: 920,
    pass_rate: "94%",
    level: 4,
  });

  useEffect(() => {
    // 1. Fetch live engineering missions
    fetch("/api/v1/engineering/missions")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((m: any, idx: number) => ({
            id: m.id,
            title: m.title,
            domain: m.domain,
            difficulty: m.difficulty,
            description: m.description,
            estimated_hours: m.estimated_hours || 10,
            progress_percent: idx === 0 ? 65 : idx === 1 ? 40 : 15,
            current_milestone: m.stages?.[0]?.name || "Milestone 1: Foundations",
            skills: [m.domain, "Architecture", "Testing"],
            tasks: m.stages?.flatMap((s: any) => s.tasks || []) || [],
          }));
          setActiveMissions(mapped);
        }
      })
      .catch(() => {});

    // 2. Fetch live projects
    fetch("/api/v1/engineering/projects")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ProjectGenome[] = data.map((p: any, idx: number) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            tech_stack: p.tech_stack || ["FastAPI", "React", "PostgreSQL"],
            health_score: 95 - (idx * 3),
            last_updated: `${(idx + 1) * 20}m ago`,
            modules: [
              { name: "core_service", type: "Service", status: "optimized" },
              { name: "data_layer", type: "DB Engine", status: "healthy" },
            ],
            endpoints: [
              { method: "GET", path: "/health", latency_ms: 1.2 },
            ],
          }));
          setRecentProjects(mapped);
        }
      })
      .catch(() => {});

    // 3. Fetch aggregated stats
    fetch("/api/v1/engineering/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setStats(data);
      })
      .catch(() => {});
  }, []);

  const formatViews = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const topMission = activeMissions[0] || {
    id: "m_consensus",
    title: "Distributed Raft Consensus Engine",
    current_milestone: "Milestone 3: Quorum Commit & State Machine Safety",
    progress_percent: 65,
    description: "Resuming Milestone 3: Quorum Commit & State Machine Apply Loop. 2 of 4 verification test suites passed.",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* A. Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#1c2130]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-blue-400">{stats?.username || "tanish_dev"}</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Online
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Production Engineering Environment · Level {stats?.level || 4} Principal Track
          </p>
        </div>

        {/* Learning Streak & Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141824] border border-[#23293a]">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <div className="text-left">
              <div className="text-xs font-bold text-zinc-100 font-mono">{stats?.streak_days || 14} Days</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Streak</div>
            </div>
          </div>
          <button
            onClick={() => onNavigate("build")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Launch IDE</span>
          </button>
        </div>
      </div>

      {/* B. Continue Your Journey Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#121624] via-[#10131d] to-[#0d0f17] border border-blue-500/20 p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-blue-400 font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Current In-Progress Mission</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {topMission.title}
            </h2>
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              {topMission.description}
            </p>
            {/* Progress bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Progress: {topMission.progress_percent}% Completed</span>
                <span>{topMission.current_milestone}</span>
              </div>
              <div className="w-full h-1.5 bg-[#1a1f2e] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${topMission.progress_percent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenMission(topMission.id)}
              className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition"
            >
              <span>Resume Mission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate("build")}
              className="px-3 py-2.5 rounded-lg bg-[#181c28] hover:bg-[#222736] border border-[#272e40] text-zinc-300 text-xs font-medium transition"
            >
              Open in IDE
            </button>
          </div>
        </div>
      </div>

      {/* C. Engineering Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Active Missions</span>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{stats?.active_missions_count || activeMissions.length}</div>
          <div className="text-[10px] text-zinc-500">All stages verified</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Arena Challenges</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{stats?.completed_challenges || 1} / {stats?.total_challenges || 2}</div>
          <div className="text-[10px] text-emerald-400 font-mono">{stats?.pass_rate || "94%"} pass rate</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Projects Monitored</span>
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{stats?.monitored_projects || recentProjects.length}</div>
          <div className="text-[10px] text-zinc-500">Project Genome active</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Verified XP</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">{stats?.verified_xp || 920} XP</div>
          <div className="text-[10px] text-zinc-500 font-mono">Verifiable Skill Passport</div>
        </div>
      </div>

      {/* D. Recommended Technical Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Recommended Engineering Deep Dives</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Curated architectural breakdowns grounded with interactive runnable code and verifiable benchmarks.
            </p>
          </div>
          <button
            onClick={() => onNavigate("explore")}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.slice(0, 3).map((vid) => (
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
                <span className="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                  {formatDuration(vid.duration_seconds)}
                </span>
                <span className="absolute top-2 left-2 bg-black/75 backdrop-blur text-emerald-400 text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Scope Guard</span>
                </span>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-blue-400 line-clamp-2 leading-snug transition">
                    {vid.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">{vid.channel_title}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#181c28] text-[10px] font-mono text-zinc-500">
                  <span>{vid.category}</span>
                  <span>{formatViews(vid.views_count)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* E & F: Active Missions & Recent Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Missions */}
        <div className="p-5 rounded-xl bg-[#10131d] border border-[#1e2230] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Active Missions</span>
            </h3>
            <button
              onClick={() => onNavigate("missions")}
              className="text-xs text-blue-400 hover:underline font-medium"
            >
              View Catalog
            </button>
          </div>

          <div className="space-y-3">
            {activeMissions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => onOpenMission(mission.id)}
                className="p-3.5 rounded-lg bg-[#141722] hover:bg-[#181c28] border border-[#222738] cursor-pointer transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold">
                    {mission.domain}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c2230] text-zinc-400">
                    {mission.difficulty}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-zinc-100 group-hover:text-blue-400 transition">
                  {mission.title}
                </h4>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{mission.current_milestone}</p>
                <div className="w-full h-1 bg-[#1c2130] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${mission.progress_percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Genome Highlights */}
        <div className="p-5 rounded-xl bg-[#10131d] border border-[#1e2230] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <span>Recent Projects (Genome)</span>
            </h3>
            <button
              onClick={() => onNavigate("genome")}
              className="text-xs text-blue-400 hover:underline font-medium"
            >
              Explore Genome
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onNavigate("genome")}
                className="p-3.5 rounded-lg bg-[#141722] hover:bg-[#181c28] border border-[#222738] cursor-pointer transition space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-100 group-hover:text-indigo-400">
                    <Cpu className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{proj.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Health: {proj.health_score}%
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{proj.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.tech_stack.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1c2130] text-zinc-400"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* G & H: Activity Timeline & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#10131d] border border-[#1e2230] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-zinc-400" />
            <span>Engineering Activity</span>
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#141722] border border-[#1f2434]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-zinc-200">
                  Passed all verification tests for <span className="font-semibold text-blue-400">Battle Arena: Token Bucket Race Condition</span>
                </p>
                <span className="text-[10px] font-mono text-zinc-500">Today at 18:42</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#141722] border border-[#1f2434]">
              <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-zinc-200">
                  Completed Milestone 2 on <span className="font-semibold text-zinc-100">Distributed Raft Consensus Engine</span>
                </p>
                <span className="text-[10px] font-mono text-zinc-500">Yesterday at 21:15</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-[#141722] border border-[#1f2434]">
              <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
              <div className="space-y-0.5">
                <p className="text-zinc-200">
                  Indexed project architecture for <span className="font-mono text-zinc-300">nexus-edge-gateway</span> into Project Genome
                </p>
                <span className="text-[10px] font-mono text-zinc-500">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Engineering Insights */}
        <div className="p-5 rounded-xl bg-gradient-to-b from-[#131625] to-[#10121b] border border-indigo-500/20 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>AI Architecture Suggestion</span>
          </div>
          <h4 className="text-sm font-bold text-white">
            Connection Pooling Bottleneck
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Your recent project <code className="text-blue-300 font-mono">stream-analytics-olap</code> showed an N+1 query pattern during batch ingestion. Switching to SQLAlchemy bulk insert with <code className="text-blue-300 font-mono">executemany</code> will reduce network roundtrips by ~70%.
          </p>
          <button
            onClick={() => onNavigate("build")}
            className="w-full py-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition"
          >
            Review in Build Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
