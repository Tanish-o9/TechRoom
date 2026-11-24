import React, { useState } from "react";
import { Cpu, Layers, ArrowRight, Server, Database } from "lucide-react";

interface ArchNode {
  id: string;
  label: string;
  type: "Client" | "Gateway" | "Service" | "Database" | "Cache";
  status: "healthy" | "warning" | "optimized";
  throughput: string;
  latency: string;
  description: string;
}

export const GenomeView: React.FC = () => {
  const [nodes] = useState<ArchNode[]>([
    {
      id: "n_edge",
      label: "Envoy Edge Gateway",
      type: "Gateway",
      status: "optimized",
      throughput: "24.8K req/s",
      latency: "1.2ms",
      description: "TLS termination, JWT validation, and distributed rate limiting with sliding window Redis counter.",
    },
    {
      id: "n_api",
      label: "FastAPI Core Dispatcher",
      type: "Service",
      status: "healthy",
      throughput: "18.2K req/s",
      latency: "8.4ms",
      description: "Async request handler orchestrating transactional outbox events to PostgreSQL.",
    },
    {
      id: "n_worker",
      label: "Celery Task Consumer",
      type: "Service",
      status: "healthy",
      throughput: "6.4K jobs/s",
      latency: "22ms",
      description: "Background worker pool handling AI transcript chunk indexing and vector generation.",
    },
    {
      id: "n_db",
      label: "PostgreSQL 16 Primary",
      type: "Database",
      status: "optimized",
      throughput: "14.2K queries/s",
      latency: "2.1ms",
      description: "Relational persistence with B-Tree and GIN indexes, declarative partition tables.",
    },
    {
      id: "n_cache",
      label: "Redis Cluster 7.2",
      type: "Cache",
      status: "optimized",
      throughput: "82.4K ops/s",
      latency: "0.4ms",
      description: "Sub-millisecond distributed cache and idempotency locking layer.",
    },
  ]);

  const [selectedNode, setSelectedNode] = useState<ArchNode>(nodes[0]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Cpu className="w-6 h-6 text-blue-400" />
          <span>Project Genome — Architecture Intelligence</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Automated structural mapping, interactive topology graph, and component health monitoring.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <span className="text-xs text-zinc-500">Architecture Health</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">98 / 100</div>
          <span className="text-[10px] text-zinc-500">0 critical bottlenecks</span>
        </div>
        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <span className="text-xs text-zinc-500">P99 System Latency</span>
          <div className="text-xl font-bold text-white font-mono">8.4ms</div>
          <span className="text-[10px] text-emerald-400 font-mono">Within SLA (15ms)</span>
        </div>
        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <span className="text-xs text-zinc-500">Live Active Nodes</span>
          <div className="text-xl font-bold text-white font-mono">5 Modules</div>
          <span className="text-[10px] text-zinc-500">All replicated</span>
        </div>
        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <span className="text-xs text-zinc-500">Code Boundaries</span>
          <div className="text-xl font-bold text-indigo-400 font-mono">Isolated</div>
          <span className="text-[10px] text-zinc-500">Clean domain separation</span>
        </div>
      </div>

      {/* Interactive Topology Graph + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Visualizer */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#181c28]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Interactive System Topology (Select Node)</span>
            </h3>
            <span className="text-[10px] font-mono text-zinc-500">Auto-Refreshed via Trace Spans</span>
          </div>

          <div className="space-y-3">
            {nodes.map((node) => {
              const isSelected = selectedNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-[#141826] border-blue-500 shadow-md shadow-blue-500/10"
                      : "bg-[#11131c] hover:bg-[#151824] border-[#1e2332]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                        node.type === "Gateway"
                          ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          : node.type === "Database"
                          ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                          : node.type === "Cache"
                          ? "bg-amber-600/20 text-amber-400 border border-amber-500/30"
                          : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      }`}
                    >
                      {node.type === "Database" ? (
                        <Database className="w-4 h-4" />
                      ) : (
                        <Server className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-100">{node.label}</h4>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        {node.type} · {node.throughput}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <span className="text-zinc-400">P95: {node.latency}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                      {node.status}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? "text-blue-400" : "text-zinc-600"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Node Inspector Panel */}
        <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#181c28]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Module Inspector
            </h3>
            <span className="text-[10px] font-mono text-blue-400">{selectedNode.type}</span>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-bold text-white">{selectedNode.label}</h4>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {selectedNode.description}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0e1017] border border-[#1c202e] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Peak Ingestion:</span>
                <span className="text-zinc-200">{selectedNode.throughput}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Latency SLA:</span>
                <span className="text-emerald-400">{selectedNode.latency}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Health State:</span>
                <span className="text-blue-400">{selectedNode.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="pt-2">
              <h5 className="text-[11px] font-bold text-zinc-300 font-mono mb-2 uppercase">
                Observed API Endpoints
              </h5>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-[#131622] text-[11px]">
                  <span className="text-blue-400 font-semibold">POST /v1/dispatch</span>
                  <span className="text-zinc-500">1.8ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#131622] text-[11px]">
                  <span className="text-emerald-400 font-semibold">GET /healthz</span>
                  <span className="text-zinc-500">0.4ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
