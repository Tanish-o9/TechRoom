import React, { useEffect, useState } from "react";
import {
  Users,
  Send,
  MessageSquare,
  FileCode,
} from "lucide-react";
import { EngineeringRoomItem } from "../types";

export const RoomsView: React.FC = () => {
  const [rooms, setRooms] = useState<EngineeringRoomItem[]>([
    {
      id: "room_1",
      title: "Raft Log Compaction & Snapshotting Working Group",
      topic: "Distributed Systems",
      host: "alex_xu",
      participants_count: 12,
      is_live: true,
      shared_code: `# Live Collaborative Workspace — Raft Log Compaction\n\ndef install_snapshot(term: int, snapshot_data: bytes):\n    # Synchronize state machine directly from snapshot\n    pass\n`,
      shared_notes: `## Working Group Notes\n- Compacting logs before index 1000\n- Preserving last_included_term in metadata header\n`,
    },
    {
      id: "room_2",
      title: "FastAPI Async Connection Pooling Benchmark & Debug",
      topic: "Python Architecture",
      host: "tiangolo",
      participants_count: 18,
      is_live: true,
      shared_code: `# Asyncpg pool scaling tests\nimport asyncpg\n\nasync def run_pool():\n    pool = await asyncpg.create_pool(max_size=20)\n`,
      shared_notes: `## Investigation\n- P99 latency spikes during burst traffic\n- Checking Postgres max_connections vs pgBouncer queue\n`,
    },
  ]);

  const [activeRoom, setActiveRoom] = useState<EngineeringRoomItem>(rooms[0]);
  const [chatLog, setChatLog] = useState<Array<{ user: string; text: string }>>([
    { user: "alex_xu", text: "Welcome everyone. Let's look at line 14 of the log snapshotting logic." },
    { user: "kelsey_h", text: "Agreed. When receiving an InstallSnapshot RPC, we must discard conflicting log entries." },
  ]);
  const [msgInput, setMsgInput] = useState("");

  useEffect(() => {
    fetch("/api/v1/engineering/rooms")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: EngineeringRoomItem[] = data.map((d: any, idx: number) => ({
            id: d.id,
            title: d.title,
            topic: d.topic,
            host: d.host || (idx === 0 ? "alex_xu" : "tiangolo"),
            participants_count: 12 + idx * 6,
            is_live: d.is_live,
            shared_code: d.shared_code,
            shared_notes: d.shared_notes,
          }));
          setRooms(mapped);
          setActiveRoom(mapped[0]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    const text = msgInput;
    setMsgInput("");
    setChatLog((prev) => [...prev, { user: "tanish_dev", text }]);

    try {
      await fetch(`/api/v1/engineering/rooms/${activeRoom.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: "tanish_dev", message: text }),
      });
    } catch {
      // Offline fallback
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-400" />
          <span>Live Engineering Rooms</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Collaborate synchronously with principal engineers, review distributed systems code, and debug production architectures live.
        </p>
      </div>

      {/* Main Room View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Collaborative Space */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#181c28]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold">
                    Live Session ({activeRoom.participants_count} Engineers Online)
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">{activeRoom.title}</h3>
              </div>
              <span className="text-xs font-mono text-zinc-400 bg-[#161a26] px-3 py-1 rounded border border-[#24293a]">
                Host: @{activeRoom.host}
              </span>
            </div>

            {/* Shared Code View */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span>Shared Code Workspace</span>
              </span>
              <pre className="p-4 rounded-lg bg-[#0e1017] border border-[#1c202e] font-mono text-xs text-blue-300 overflow-x-auto leading-relaxed">
                {activeRoom.shared_code}
              </pre>
            </div>

            {/* Shared Notes View */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-400">Shared Notes & RFC</span>
              <pre className="p-3.5 rounded-lg bg-[#0e1017] border border-[#1c202e] font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-line">
                {activeRoom.shared_notes}
              </pre>
            </div>
          </div>
        </div>

        {/* Right Col: Live Chat & Room Directory */}
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-[#10121a] border border-[#1e2332] flex flex-col h-[400px]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono pb-2 border-b border-[#181c28] flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span>Room Chat</span>
            </h3>

            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {chatLog.map((c, i) => (
                <div key={i} className="text-xs space-y-0.5">
                  <span className="font-semibold text-blue-400 font-mono text-[11px]">@{c.user}:</span>
                  <p className="text-zinc-300 leading-relaxed bg-[#141722] p-2 rounded border border-[#1e2332]">
                    {c.text}
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="pt-2 flex gap-1.5 border-t border-[#181c28]">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Message engineering room..."
                className="flex-1 bg-[#141722] border border-[#222738] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          <div className="p-4 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-2">
            <h4 className="text-xs font-bold text-white uppercase font-mono">Other Active Rooms</h4>
            {rooms
              .filter((r) => r.id !== activeRoom.id)
              .map((r) => (
                <div
                  key={r.id}
                  onClick={() => setActiveRoom(r)}
                  className="p-3 rounded-lg bg-[#141722] hover:bg-[#181c28] border border-[#222738] cursor-pointer transition text-xs"
                >
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>{r.topic}</span>
                    <span>{r.participants_count} online</span>
                  </div>
                  <h5 className="font-semibold text-zinc-100 mt-1">{r.title}</h5>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
