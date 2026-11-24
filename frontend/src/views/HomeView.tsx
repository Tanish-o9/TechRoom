import React from "react";
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
  const activeMissions: Mission[] = [
    {
      id: "m_consensus",
      title: "Distributed Raft Consensus Engine",
      domain: "System Design",
      difficulty: "Advanced",
      description: "Implement leader election, log replication, and RPC heartbeat mechanisms in Go/Rust.",
      estimated_hours: 14,
      progress_percent: 65,
      current_milestone: "Milestone 3: Quorum Commit & State Machine Safety",
      skills: ["Raft", "Distributed Systems", "RPC", "Concurrency"],
      tasks: [
        { id: "t1", title: "Implement Election Timer & RequestVote RPC", completed: true },
        { id: "t2", title: "AppendEntries Log Matching Protocol", completed: true },
        { id: "t3", title: "Quorum Commit & State Machine Apply Loop", completed: false },
        { id: "t4", title: "Network Partition & Split Brain Recovery Tests", completed: false },
      ],
    },
    {
      id: "m_k8s",
      title: "Zero-Downtime Blue/Green Operator",
      domain: "DevOps",
      difficulty: "Intermediate",
      description: "Author a custom Kubernetes operator using Kubebuilder for canary routing and automated rollbacks.",
      estimated_hours: 8,
      progress_percent: 30,
      current_milestone: "Milestone 2: Traefik Ingress Traffic Splitting",
      skills: ["Kubernetes", "CRD", "Go", "Docker", "Traefik"],
      tasks: [
        { id: "t5", title: "Define Custom Resource Definition (CanaryDeployment)", completed: true },
        { id: "t6", title: "Reconciliation Loop for Pod Health Checks", completed: false },
      ],
    },
  ];

  const recentProjects: ProjectGenome[] = [
    {
      id: "p_nexus",
      name: "nexus-edge-gateway",
      description: "High-throughput reverse proxy with eBPF metrics and distributed token bucket rate limiting.",
      tech_stack: ["Rust", "Tokio", "eBPF", "Redis"],
      health_score: 98,
      last_updated: "24m ago",
      modules: [
        { name: "proxy_core", type: "Network", status: "optimized" },
        { name: "rate_limiter", type: "State", status: "healthy" },
        { name: "metrics_ebpf", type: "Kernel", status: "optimized" },
      ],
      endpoints: [
        { method: "POST", path: "/v1/dispatch", latency_ms: 1.8 },
        { method: "GET", path: "/healthz", latency_ms: 0.4 },
      ],
    },
    {
      id: "p_stream",
      name: "stream-analytics-olap",
      description: "Event streaming ingestion pipeline targeting ClickHouse with sub-second aggregate views.",
      tech_stack: ["Python", "ClickHouse", "FastAPI", "Kafka"],
      health_score: 92,
      last_updated: "2h ago",
      modules: [
        { name: "kafka_consumer", type: "Queue", status: "healthy" },
        { name: "batch_writer", type: "DB Engine", status: "warning" },
      ],
      endpoints: [
        { method: "POST", path: "/ingest/batch", latency_ms: 12.4 },
      ],
    },
  ];

  const formatViews = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* A. Welcome Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#1c2130]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-blue-400">tanish_dev</span>
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Online
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Production Engineering Environment · Week 47 · Level 4 Principal Track
          </p>
        </div>

        {/* Learning Streak & Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141824] border border-[#23293a]">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <div className="text-left">
              <div className="text-xs font-bold text-zinc-100 font-mono">14 Days</div>
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
              Distributed Raft Consensus Engine
            </h2>
            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
              Resuming Milestone 3: Quorum Commit & State Machine Apply Loop. 2 of 4 verification test suites passed.
            </p>
            {/* Progress bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Progress: 65% Completed</span>
                <span>Milestone 3 of 4</span>
              </div>
              <div className="w-full h-1.5 bg-[#1a1f2e] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-[65%]" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenMission("m_consensus")}
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
          <div className="text-xl font-bold text-white font-mono">2</div>
          <div className="text-[10px] text-zinc-500">1 awaiting code review</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Arena Challenges</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">18 / 20</div>
          <div className="text-[10px] text-emerald-400 font-mono">90% pass rate</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Projects Monitored</span>
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">4</div>
          <div className="text-[10px] text-zinc-500">Project Genome active</div>
        </div>

        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-medium">Verified XP</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">920 XP</div>
          <div className="text-[10px] text-zinc-500 font-mono">Top 4% percentile</div>
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
