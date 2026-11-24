import React, { useState } from "react";
import {
  Brain,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export const ResearchView: React.FC = () => {
  const [topic, setTopic] = useState("Distributed Task Queues & Outbox Pattern");
  const [loading, setLoading] = useState(false);
  const [report] = useState<{
    summary: string;
    key_findings: string[];
    comparisons: Array<{ aspect: string; optionA: string; optionB: string }>;
    citations: Array<{ source: string; timestamp: string; note: string }>;
  }>({
    summary:
      "A systematic evaluation of the Transactional Outbox Pattern combined with Celery and Redis vs pure 2-Phase Commit (2PC). The findings show that outbox patterns achieve near zero message drops and remove distributed locks, at the cost of requiring idempotent consumers.",
    key_findings: [
      "Transactional outbox eliminates race conditions between relational state commits and message broker publishing.",
      "Dual-write bugs without an outbox table result in up to 1.8% orphaned state records under network partition tests.",
      "Redis sorted set token bucket implementations handle ~40K ops/sec with sub-millisecond latency when using Lua scripts.",
    ],
    comparisons: [
      {
        aspect: "Consistency Guarantee",
        optionA: "Transactional Outbox: At-Least-Once (Consumer Idempotency required)",
        optionB: "Two-Phase Commit: Strictly Serialized (Heavy distributed lock overhead)",
      },
      {
        aspect: "Throughput Limit",
        optionA: "Outbox Pattern: Scales horizontally with DB read replicas",
        optionB: "2PC: Bottlenecked by slowest responding transaction participant",
      },
    ],
    citations: [
      {
        source: "Building Resilient Task Queues (TechRoom)",
        timestamp: "⏱ 03:15",
        note: "Relational write and event insertion occur in atomic local transaction block.",
      },
      {
        source: "Designing a Distributed Rate Limiter (TechRoom)",
        timestamp: "⏱ 08:40",
        note: "Sliding window log vs token bucket memory trade-offs.",
      },
    ],
  });

  const handleSynthesize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <span>AI Research Lab & Video Synthesis</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Synthesize technical concepts across verified tutorial transcripts, architectural whitepapers, and benchmark traces.
        </p>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSynthesize} className="p-4 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter research topic (e.g. Raft vs Paxos in distributed databases)..."
            className="flex-1 bg-[#141722] border border-[#222738] rounded-lg px-4 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? "Synthesizing..." : "Synthesize Research"}</span>
          </button>
        </div>
      </form>

      {/* Report Canvas */}
      <div className="p-6 rounded-xl bg-[#10131d] border border-[#1e2230] space-y-6">
        {/* Executive Summary */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider font-semibold">
            Executive Architecture Brief
          </span>
          <h2 className="text-lg font-bold text-white">{topic}</h2>
          <p className="text-xs text-zinc-300 leading-relaxed bg-[#141722] p-4 rounded-lg border border-[#222738]">
            {report.summary}
          </p>
        </div>

        {/* Key Findings */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Verified Findings & Benchmarks
          </h3>
          <div className="space-y-2">
            {report.key_findings.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Architectural Trade-off Comparison */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Architectural Trade-offs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.comparisons.map((c, i) => (
              <div key={i} className="p-4 rounded-lg bg-[#141722] border border-[#222738] space-y-2 text-xs">
                <h4 className="font-bold text-blue-400">{c.aspect}</h4>
                <div className="space-y-1.5 text-zinc-300 text-[11px]">
                  <p>{c.optionA}</p>
                  <p className="text-zinc-400">{c.optionB}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Citations & Timestamps */}
        <div className="space-y-3 pt-3 border-t border-[#1c2130]">
          <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Transcript Grounding & Timestamp Citations
          </h3>
          <div className="space-y-2">
            {report.citations.map((cit, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-[#0e1017] border border-[#1c202e] text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">{cit.timestamp}</span>
                  <span className="text-zinc-200">{cit.source}</span>
                </div>
                <span className="text-zinc-500 text-[11px] truncate max-w-sm">{cit.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
