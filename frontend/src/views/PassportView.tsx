import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  FileCheck,
} from "lucide-react";
import { SkillEvidenceItem } from "../types";

export const PassportView: React.FC = () => {
  const evidenceList: SkillEvidenceItem[] = [
    {
      id: "ev_1",
      skill: "Distributed Systems & Consensus",
      level: "Expert",
      score: 96,
      verified_date: "2026-11-20",
      evidence_type: "Mission: Distributed Raft Consensus Engine (Quorum Proof)",
    },
    {
      id: "ev_2",
      skill: "High-Throughput PostgreSQL Indexing",
      level: "Advanced",
      score: 92,
      verified_date: "2026-11-18",
      evidence_type: "Challenge: EXPLAIN ANALYZE B-Tree/GIN Tuning",
    },
    {
      id: "ev_3",
      skill: "Concurrency & Atomic State Locking",
      level: "Proficient",
      score: 88,
      verified_date: "2026-11-23",
      evidence_type: "Battle Arena: Token Bucket Parallel Race Condition Fix",
    },
    {
      id: "ev_4",
      skill: "React 19 Server Components & Actions",
      level: "Advanced",
      score: 94,
      verified_date: "2026-11-24",
      evidence_type: "Session: Micro-Frontend Module Federation Build-Along",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Profile Header */}
      <div className="p-6 rounded-xl bg-gradient-to-r from-[#121626] via-[#10131e] to-[#0c0e14] border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-xl font-bold text-white ring-2 ring-blue-400/30">
            TR
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">tanish_dev</h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Staff Engineer Track
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Verifiable Developer Passport · Public SHA: <code className="text-blue-300 font-mono">0x9c4f...a28e</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-[#141724] border border-[#22283a] text-center">
            <div className="text-base font-bold text-white">Level 4</div>
            <span className="text-zinc-500 text-[10px]">Rank</span>
          </div>
          <div className="p-3 rounded-lg bg-[#141724] border border-[#22283a] text-center">
            <div className="text-base font-bold text-emerald-400">920 XP</div>
            <span className="text-zinc-500 text-[10px]">Total XP</span>
          </div>
          <div className="p-3 rounded-lg bg-[#141724] border border-[#22283a] text-center">
            <div className="text-base font-bold text-blue-400">4 Verified</div>
            <span className="text-zinc-500 text-[10px]">Credentials</span>
          </div>
        </div>
      </div>

      {/* Competencies Progress Bars */}
      <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-blue-400" />
          <span>Competency Progress & Verified Benchmark Radar</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[#131622] border border-[#202536] space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-200">Distributed Consensus & Partition Safety</span>
              <span className="text-blue-400 font-bold">96%</span>
            </div>
            <div className="w-full h-1.5 bg-[#1b2030] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[96%]" />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#131622] border border-[#202536] space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-200">Database Optimization & Index Planning</span>
              <span className="text-blue-400 font-bold">92%</span>
            </div>
            <div className="w-full h-1.5 bg-[#1b2030] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[92%]" />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#131622] border border-[#202536] space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-200">Frontend State Architecture (React 19)</span>
              <span className="text-blue-400 font-bold">94%</span>
            </div>
            <div className="w-full h-1.5 bg-[#1b2030] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[94%]" />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#131622] border border-[#202536] space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-200">Kubernetes Operators & CI/CD Pipelines</span>
              <span className="text-blue-400 font-bold">88%</span>
            </div>
            <div className="w-full h-1.5 bg-[#1b2030] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[88%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Verifiable Skill Records */}
      <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Cryptographically Grounded Evidence Records</span>
        </h3>

        <div className="space-y-3">
          {evidenceList.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-xl bg-[#131622] border border-[#202536] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{ev.skill}</h4>
                  <p className="text-[11px] text-zinc-400">{ev.evidence_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                <span className="px-2 py-0.5 rounded bg-[#1a1f2e] text-blue-400 border border-[#272e42]">
                  {ev.level} ({ev.score}%)
                </span>
                <span className="text-zinc-500">{ev.verified_date}</span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
