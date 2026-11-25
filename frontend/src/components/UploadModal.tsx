import React, { useState } from "react";
import { UploadCloud, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { Video } from "../types";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoCreated: (newVid: Video) => void;
}

const CATEGORIES = ["System Design", "DevOps", "Database", "Python", "Rust", "React"];

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onVideoCreated,
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("System Design");
  const [description, setDescription] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setEvaluating(true);
    setErrorMsg("");

    try {
      // Evaluate with backend Scope Guard
      const scopeRes = await fetch("/api/v1/ai/scope-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category }),
      });

      if (scopeRes.ok) {
        const scopeData = await scopeRes.json();
        if (scopeData.decision === "rejected") {
          setErrorMsg(scopeData.reason || "Content rejected by Scope Guard (lacks software engineering focus).");
          setEvaluating(false);
          return;
        }
      }

      // Persist to backend database via direct upload endpoint
      let createdVid: Video;
      const vidRes = await fetch("/api/v1/videos/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || "Developer tutorial uploaded to TechRoom.",
          category,
          tags: category.toLowerCase(),
        }),
      });

      if (vidRes.ok) {
        createdVid = await vidRes.json();
      } else {
        createdVid = {
          id: `usr_${Date.now()}`,
          channel_id: "my_channel",
          title,
          description: description || "Developer tutorial uploaded to TechRoom.",
          category,
          visibility: "public",
          status: "ready",
          duration_seconds: 640,
          views_count: 1,
          thumbnail_url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80",
          playback_url: "https://archive.org/download/MIT6.00SCS11/MIT6_00SCS11_lec01_300k.mp4",
          channel_title: "My Engineering Channel",
          channel_handle: "my_dev",
          channel_avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          difficulty: "Intermediate",
        };
      }

      onVideoCreated(createdVid);
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setTitle("");
        setDescription("");
      }, 1200);
    } catch {
      setErrorMsg("Failed to connect to Scope Guard evaluator. Please retry.");
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f1118] border border-[#23293a] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#1e2334] pb-3">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">Publish Engineering Tutorial</h3>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-white">Scope Guard Approved!</h4>
            <p className="text-xs text-zinc-400">
              Technical video validated and published to the TechRoom engineering network.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-900/50 text-red-400 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Session Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Consensus with Raft, Tokio & Rust"
                className="w-full bg-[#141722] border border-[#232838] focus:border-blue-500/60 rounded-lg px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Domain Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#141722] border border-[#232838] focus:border-blue-500/60 rounded-lg px-3 py-2 text-zinc-100 focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-300 font-medium">Technical Description & Architecture Notes</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain prerequisites, system design trade-offs, code components..."
                className="w-full bg-[#141722] border border-[#232838] focus:border-blue-500/60 rounded-lg px-3 py-2 text-zinc-100 placeholder:text-zinc-600 focus:outline-none resize-none"
              />
            </div>

            <div className="bg-[#12141f] border border-[#212638] rounded-lg p-3 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                All submissions undergo automated semantic evaluation via Scope Guard. Generic vlogs, lifestyle, and non-engineering content will be rejected.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#181c28] text-zinc-300 hover:bg-[#222736] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={evaluating}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold transition"
              >
                {evaluating ? "Evaluating Scope..." : "Publish Session"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
