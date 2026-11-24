import React, { useState } from "react";
import {
  Play,
  Save,
  CheckCircle2,
  FileCode,
  FolderOpen,
  Sparkles,
  Send,
  Cpu,
} from "lucide-react";

interface WorkspaceFile {
  name: string;
  path: string;
  language: string;
  content: string;
}

export const WorkspaceView: React.FC = () => {
  const [files, setFiles] = useState<WorkspaceFile[]>([
    {
      name: "raft_node.py",
      path: "src/raft_node.py",
      language: "python",
      content: `"""
TechRoom Build Workspace — Distributed Raft Consensus Engine
Milestone 3: Quorum Commit & State Machine Apply Loop
"""
import asyncio
import time
from typing import Dict, List, Optional

class RaftNode:
    def __init__(self, node_id: str, peers: List[str]):
        self.node_id = node_id
        self.peers = peers
        self.current_term = 0
        self.voted_for: Optional[str] = None
        self.log: List[Dict] = []
        self.commit_index = 0
        self.last_applied = 0
        self.state = "FOLLOWER"

    async def handle_append_entries(self, term: int, leader_id: str, prev_log_index: int, entries: List[Dict]) -> bool:
        """Handle AppendEntries RPC from leader with monotonic safety invariant."""
        if term < self.current_term:
            return False

        self.current_term = term
        self.state = "FOLLOWER"
        
        # Verify log continuity
        if prev_log_index > len(self.log):
            return False
            
        self.log.extend(entries)
        return True

    def calculate_quorum_commit(self, match_indices: Dict[str, int]) -> int:
        """Find the highest log index N replicated on a majority of nodes."""
        values = sorted(list(match_indices.values()))
        majority_index = len(values) // 2
        return values[majority_index]
`,
    },
    {
      name: "test_raft.py",
      path: "tests/test_raft.py",
      language: "python",
      content: `import pytest
from src.raft_node import RaftNode

def test_quorum_calculation():
    node = RaftNode("node-1", ["node-2", "node-3"])
    match_indices = {"node-1": 10, "node-2": 8, "node-3": 10}
    quorum_n = node.calculate_quorum_commit(match_indices)
    assert quorum_n == 10, f"Expected 10, got {quorum_n}"
`,
    },
    {
      name: "config.yaml",
      path: "config/config.yaml",
      language: "yaml",
      content: `cluster:
  name: "techroom-raft-dev"
  heartbeat_interval_ms: 150
  election_timeout_min_ms: 300
  election_timeout_max_ms: 600
peers:
  - "10.0.0.1:9000"
  - "10.0.0.2:9000"
  - "10.0.0.3:9000"
`,
    },
  ]);

  const [activeFile, setActiveFile] = useState<WorkspaceFile>(files[0]);
  const [activeTab, setActiveTab] = useState<"terminal" | "tests" | "problems">("terminal");
  const [logs, setLogs] = useState<string>(
    `[Kernel] TechRoom Ephemeral MicroVM Sandbox initialized.\n` +
      `[Workspace] Python 3.13.3 / PyPy JIT Ready. Container isolation: verified.\n` +
      `Type code and press 'Run' or 'Run Tests'.\n`
  );
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiChat, setAiChat] = useState<Array<{ sender: "user" | "copilot"; text: string }>>([
    {
      sender: "copilot",
      text: "TechRoom Copilot active. I can inspect your Raft quorum math, verify corner cases, or refactor state invariants.",
    },
  ]);
  const [running, setRunning] = useState(false);

  const handleRunCode = () => {
    setRunning(true);
    setActiveTab("terminal");
    setTimeout(() => {
      setLogs(
        (prev) =>
          prev +
          `\n$ python ${activeFile.path}\n` +
          `[RaftNode] Initialized cluster instance node-1 with 2 peers.\n` +
          `[Heartbeat] Term 0: Synchronized with 2 followers.\n` +
          `[Success] Process exited with code 0 (execution time: 14ms).\n`
      );
      setRunning(false);
    }, 400);
  };

  const handleRunTests = () => {
    setRunning(true);
    setActiveTab("tests");
    setTimeout(() => {
      setLogs(
        (prev) =>
          prev +
          `\n$ pytest tests/test_raft.py -v\n` +
          `tests/test_raft.py::test_quorum_calculation PASSED [100%]\n` +
          `====================== 1 passed in 0.08s ======================\n`
      );
      setRunning(false);
    }, 500);
  };

  const handleAskCopilot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    const q = aiPrompt;
    setAiPrompt("");
    setAiChat((prev) => [
      ...prev,
      { sender: "user", text: q },
      {
        sender: "copilot",
        text: `In 'calculate_quorum_commit', sorting match indices and selecting 'len(values) // 2' guarantees that at least (N/2 + 1) nodes have replicated the index. Also ensure that self.log[N].term == self.current_term to satisfy Section 5.4.2 of the Raft specification.`,
      },
    ]);
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#0b0d14] text-zinc-100 select-none overflow-hidden">
      {/* Top Workspace Bar */}
      <div className="h-11 border-b border-[#1c202e] bg-[#0e1017] px-4 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>raft-consensus-workspace</span>
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Runtime: Linux MicroVM (Clean)
          </span>
        </div>

        {/* Action Buttons: Run, Test, Save */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#181c28] hover:bg-[#222838] border border-[#262c3e] text-xs font-medium text-zinc-200 transition"
          >
            <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>Run</span>
          </button>
          <button
            onClick={handleRunTests}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Run Tests</span>
          </button>
          <button
            onClick={() => alert("Workspace saved successfully to local state.")}
            className="p-1.5 rounded hover:bg-[#1c202e] text-zinc-400 hover:text-white transition"
            title="Save files"
          >
            <Save className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: File Explorer */}
        <div className="w-52 shrink-0 border-r border-[#1c202e] bg-[#0c0e14] flex flex-col">
          <div className="p-3 text-[10px] font-mono font-semibold text-zinc-500 uppercase tracking-wider border-b border-[#181c28]">
            Explorer
          </div>
          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-zinc-400">
              <FolderOpen className="w-3.5 h-3.5 text-zinc-500" />
              <span className="font-mono text-[11px]">project_root</span>
            </div>
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => setActiveFile(file)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs transition ${
                  activeFile.path === file.path
                    ? "bg-[#181c28] text-blue-400 font-semibold border-l-2 border-blue-500"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-[#121520]"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-zinc-500" />
                <span className="font-mono text-[11px] truncate">{file.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Code Editor & Bottom Terminal */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0e1017]">
          {/* Active File Tab Bar */}
          <div className="h-9 border-b border-[#1c202e] bg-[#0c0e14] flex items-center px-2 gap-1 overflow-x-auto">
            <div className="flex items-center gap-2 px-3 py-1 bg-[#141824] border-t-2 border-blue-500 text-xs text-zinc-100 font-mono">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>{activeFile.name}</span>
            </div>
          </div>

          {/* Code Editor Area */}
          <div className="flex-1 relative overflow-auto p-4 font-mono text-xs leading-relaxed text-blue-200 bg-[#0d0f16]">
            <textarea
              value={activeFile.content}
              onChange={(e) => {
                const updated = e.target.value;
                setActiveFile((prev) => ({ ...prev, content: updated }));
                setFiles((prev) =>
                  prev.map((f) => (f.path === activeFile.path ? { ...f, content: updated } : f))
                );
              }}
              spellCheck={false}
              className="w-full h-full bg-transparent resize-none focus:outline-none font-mono text-xs leading-6 text-zinc-200"
            />
          </div>

          {/* Bottom Panel: Terminal, Tests, Problems */}
          <div className="h-44 border-t border-[#1c202e] bg-[#0a0c12] flex flex-col shrink-0">
            <div className="h-8 border-b border-[#181c28] bg-[#0c0e14] px-3 flex items-center gap-4 text-xs">
              <button
                onClick={() => setActiveTab("terminal")}
                className={`font-semibold pb-1 transition ${
                  activeTab === "terminal" ? "text-blue-400 border-b-2 border-blue-500" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Terminal
              </button>
              <button
                onClick={() => setActiveTab("tests")}
                className={`font-semibold pb-1 transition ${
                  activeTab === "tests" ? "text-blue-400 border-b-2 border-blue-500" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Test Results
              </button>
              <button
                onClick={() => setActiveTab("problems")}
                className={`font-semibold pb-1 transition ${
                  activeTab === "problems" ? "text-blue-400 border-b-2 border-blue-500" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Problems (0)
              </button>
            </div>

            <div className="flex-1 p-3 font-mono text-[11px] text-zinc-400 overflow-y-auto whitespace-pre-line leading-relaxed">
              {logs}
            </div>
          </div>
        </div>

        {/* Right: AI Assistant / Requirements Panel */}
        <div className="w-80 shrink-0 border-l border-[#1c202e] bg-[#0c0e14] flex flex-col">
          <div className="h-9 border-b border-[#181c28] px-3 flex items-center justify-between text-xs font-semibold text-zinc-300">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Copilot & Specs</span>
            </div>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {aiChat.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#181c28] text-zinc-200 ml-4 border border-[#262c3e]"
                    : "bg-[#121626] text-zinc-300 mr-4 border border-indigo-500/20"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleAskCopilot} className="p-2 border-t border-[#181c28] flex gap-1.5">
            <input
              type="text"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask Copilot about code..."
              className="flex-1 bg-[#141722] border border-[#222738] rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="p-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
