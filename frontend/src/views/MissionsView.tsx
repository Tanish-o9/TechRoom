import React, { useState } from "react";
import {
  Target,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowLeft,
  Send,
  Cpu,
} from "lucide-react";
import { Mission, AppView } from "../types";

interface MissionsViewProps {
  onNavigate: (view: AppView) => void;
  selectedMissionId?: string;
  onSelectMission?: (id: string | null) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  onNavigate,
  selectedMissionId: initialMissionId,
  onSelectMission,
}) => {
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: "m_consensus",
      title: "Distributed Raft Consensus Engine",
      domain: "System Design",
      difficulty: "Advanced",
      description: "Build a distributed replicated state machine implementing Raft consensus: leader election, log compaction, RPC heartbeats, and network partition recovery.",
      estimated_hours: 14,
      progress_percent: 65,
      current_milestone: "Milestone 3: Quorum Commit & State Machine Safety",
      skills: ["Raft", "Distributed Systems", "RPC", "Concurrency", "Go"],
      architecture_ref: "Client -> Leader -> [Follower 1, Follower 2] -> WAL Log -> State Machine Apply",
      tasks: [
        { id: "t1", title: "Implement Election Timer & RequestVote RPC Handler", completed: true },
        { id: "t2", title: "AppendEntries Log Matching and Heartbeat Protocol", completed: true },
        { id: "t3", title: "Quorum Commit Calculation and State Machine Apply Loop", completed: false },
        { id: "t4", title: "Network Partition Handling & Split Brain Recovery Suite", completed: false },
      ],
    },
    {
      id: "m_k8s",
      title: "Zero-Downtime Blue/Green Kubernetes Operator",
      domain: "DevOps",
      difficulty: "Intermediate",
      description: "Build a production Kubernetes custom controller that reconciles CanaryDeployments, automates traffic shifting with Traefik/Ingress, and executes automatic rollback on 5xx error spikes.",
      estimated_hours: 8,
      progress_percent: 30,
      current_milestone: "Milestone 2: Traefik Ingress Traffic Splitting",
      skills: ["Kubernetes", "CRD", "Golang", "Docker", "Traefik"],
      architecture_ref: "Ingress Router -> Traefik Service Split -> [Blue Pods (90%), Green Pods (10%)] -> Prometheus Health Probe",
      tasks: [
        { id: "t5", title: "Define Custom Resource Definition (CanaryDeployment)", completed: true },
        { id: "t6", title: "Reconciliation Loop for Pod Readiness and Health Checks", completed: false },
        { id: "t7", title: "Automated Metric-Driven Rollback on Error Rate Spikes", completed: false },
      ],
    },
    {
      id: "m_db_engine",
      title: "LSM-Tree Key-Value Storage Engine",
      domain: "Database",
      difficulty: "Advanced",
      description: "Implement an append-only log-structured merge-tree storage engine with in-memory MemTable (SkipList), immutable SSTables on disk, Bloom filters, and compaction.",
      estimated_hours: 16,
      progress_percent: 0,
      current_milestone: "Milestone 1: SkipList MemTable & Write-Ahead Log",
      skills: ["Rust", "Storage Engines", "LSM-Trees", "Memory Mapping"],
      architecture_ref: "Write -> WAL -> MemTable (SkipList) -> Flush to SSTable -> Multi-way Merge Compaction",
      tasks: [
        { id: "t8", title: "Write-Ahead Log (WAL) with CRC32 Verification", completed: false },
        { id: "t9", title: "Lock-Free SkipList MemTable Implementation", completed: false },
        { id: "t10", title: "SSTable Serialization & Sparse Indexing", completed: false },
        { id: "t11", title: "Tiered Compaction Strategy & Bloom Filter Lookup", completed: false },
      ],
    },
  ]);

  const [activeMissionId, setActiveMissionId] = useState<string | null>(
    initialMissionId || null
  );
  const [aiMentorMsg, setAiMentorMsg] = useState("");
  const [aiMentorLog, setAiMentorLog] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: "TechRoom AI Mentor standing by. Ask about consensus invariants, trade-offs, or debugging edge cases.",
    },
  ]);

  const activeMission = missions.find((m) => m.id === activeMissionId);

  const toggleTask = (taskId: string) => {
    if (!activeMission) return;
    const updatedTasks = activeMission.tasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const completedCount = updatedTasks.filter((t) => t.completed).length;
    const newProgress = Math.round((completedCount / updatedTasks.length) * 100);

    setMissions((prev) =>
      prev.map((m) =>
        m.id === activeMission.id
          ? { ...m, tasks: updatedTasks, progress_percent: newProgress }
          : m
      )
    );
  };

  const handleAskMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMentorMsg.trim()) return;
    const q = aiMentorMsg;
    setAiMentorMsg("");

    setAiMentorLog((prev) => [
      ...prev,
      { sender: "user", text: q },
      {
        sender: "ai",
        text: `In Raft Milestone 3, ensure the leader only commits log entries from its current term by counting replicas. Applying entries to the state machine must be strictly monotonic to avoid split-brain states.`,
      },
    ]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* If looking at Mission Detail Workspace */}
      {activeMission ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c2130]">
            <button
              onClick={() => {
                setActiveMissionId(null);
                if (onSelectMission) onSelectMission(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Mission Catalog</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {activeMission.domain}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161a26] text-zinc-300 border border-[#24293a]">
                {activeMission.difficulty}
              </span>
            </div>
          </div>

          {/* Mission Hero Header */}
          <div className="p-6 rounded-xl bg-gradient-to-r from-[#121626] to-[#0f111a] border border-blue-500/20 space-y-3 shadow-xl">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeMission.title}
            </h1>
            <p className="text-xs text-zinc-300 max-w-3xl leading-relaxed">
              {activeMission.description}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Est. {activeMission.estimated_hours} Hours</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>{activeMission.progress_percent}% Completed</span>
              </div>
            </div>
          </div>

          {/* Mission Workspace 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Architecture, Milestones & Task Checklist */}
            <div className="lg:col-span-2 space-y-6">
              {/* Architecture Reference */}
              {activeMission.architecture_ref && (
                <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span>Target Architecture Blueprint</span>
                  </h3>
                  <div className="p-3.5 rounded-lg bg-[#0b0d14] border border-[#1c2130] font-mono text-xs text-blue-300">
                    {activeMission.architecture_ref}
                  </div>
                </div>
              )}

              {/* Task Checklist */}
              <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Implementation Milestones ({activeMission.tasks.filter((t) => t.completed).length} / {activeMission.tasks.length})</span>
                  </h3>
                  <button
                    onClick={() => onNavigate("build")}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
                  >
                    Open in IDE
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeMission.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${
                        task.completed
                          ? "bg-[#121622] border-emerald-500/30 text-zinc-300"
                          : "bg-[#141722] hover:bg-[#181c28] border-[#222738] text-zinc-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => {}} // handled by parent div
                        className="mt-0.5 rounded border-zinc-700 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                      <span className={`text-xs ${task.completed ? "line-through text-zinc-500" : "font-medium"}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: AI Engineering Mentor */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] flex flex-col h-[480px]">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1c2130]">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    AI Mission Mentor
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto py-3 space-y-3">
                  {aiMentorLog.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg text-xs leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#181c28] text-zinc-200 ml-4 border border-[#23293a]"
                          : "bg-[#121524] text-zinc-300 mr-4 border border-indigo-500/20"
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAskMentor} className="pt-2 flex gap-2 border-t border-[#1c2130]">
                  <input
                    type="text"
                    value={aiMentorMsg}
                    onChange={(e) => setAiMentorMsg(e.target.value)}
                    placeholder="Ask mentor a technical question..."
                    className="flex-1 bg-[#141722] border border-[#222738] rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mission Catalog View */
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-400" />
              <span>Engineering Missions</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Structured hands-on assignments simulating real production infrastructure challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {missions.map((mission) => (
              <div
                key={mission.id}
                onClick={() => setActiveMissionId(mission.id)}
                className="flex flex-col justify-between p-5 rounded-xl bg-[#10121a] border border-[#1e2332] hover:border-blue-500/40 cursor-pointer group transition-all space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-blue-400 uppercase font-semibold">
                      {mission.domain}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181c28] text-zinc-400 border border-[#242a3a]">
                      {mission.difficulty}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-blue-400 transition">
                    {mission.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                    {mission.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-[#181c28]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span>Est. {mission.estimated_hours} Hours</span>
                    <span>{mission.progress_percent}% Done</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a1f2e] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${mission.progress_percent}%` }}
                    />
                  </div>
                  <button className="w-full py-2 rounded-lg bg-[#141824] group-hover:bg-blue-600 group-hover:text-white text-zinc-300 text-xs font-semibold border border-[#222738] group-hover:border-transparent transition flex items-center justify-center gap-1.5">
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
