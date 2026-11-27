import React from "react";
import { Video as VideoIcon, Plus, ShieldCheck } from "lucide-react";
import { Video } from "../types";

interface CreatorViewProps {
  videos: Video[];
  onOpenUploadModal: () => void;
  onOpenVideo: (video: Video) => void;
}

export const CreatorView: React.FC<CreatorViewProps> = ({
  videos,
  onOpenUploadModal,
  onOpenVideo,
}) => {
  const totalViews = videos.reduce((acc, v) => acc + (v.views_count || 0), 0);
  const subscribers = Math.max(12, videos.length * 11);
  const scopeGuardApproved = videos.filter((v) => v.status !== "rejected").length;
  const scopeGuardPercent = videos.length > 0 ? ((scopeGuardApproved / videos.length) * 100).toFixed(1) : "100.0";

  const formatViews = (count: number) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return `${count}`;
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#1c2130]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <VideoIcon className="w-6 h-6 text-blue-400" />
            <span>Creator Studio</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your engineering video sessions, track telemetry, and inspect Scope Guard validation reports.
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Session</span>
        </button>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <span className="text-xs text-zinc-500">Total Views</span>
          <div className="text-xl font-bold text-white font-mono">{formatViews(totalViews)}</div>
          <span className="text-[10px] text-emerald-400 font-mono">+18% this month</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <span className="text-xs text-zinc-500">Subscribers</span>
          <div className="text-xl font-bold text-white font-mono">{subscribers}K</div>
          <span className="text-[10px] text-zinc-500">Principal Engineers</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <span className="text-xs text-zinc-500">Published Sessions</span>
          <div className="text-xl font-bold text-white font-mono">{videos.length}</div>
          <span className="text-[10px] text-emerald-400 font-mono">100% Verified</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10121a] border border-[#1d2230] space-y-1">
          <span className="text-xs text-zinc-500">Scope Guard Score</span>
          <div className="text-xl font-bold text-emerald-400 font-mono">{scopeGuardPercent}%</div>
          <span className="text-[10px] text-zinc-500">0 policy violations</span>
        </div>
      </div>

      {/* Video Content Table */}
      <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Published Engineering Sessions ({videos.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#1c2130] text-[10px] font-mono text-zinc-500 uppercase">
              <tr>
                <th className="pb-3 font-semibold">Video Session</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Views</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 font-semibold">Scope Guard</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181c28]">
              {videos.map((vid) => (
                <tr
                  key={vid.id}
                  onClick={() => onOpenVideo(vid)}
                  className="hover:bg-[#141824] cursor-pointer transition"
                >
                  <td className="py-3 pr-4 flex items-center gap-3">
                    <img
                      src={vid.thumbnail_url}
                      alt={vid.title}
                      className="w-16 aspect-video rounded object-cover bg-zinc-950 shrink-0"
                    />
                    <span className="font-semibold text-zinc-200 line-clamp-1 max-w-sm">
                      {vid.title}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-zinc-400 text-[11px]">{vid.category}</td>
                  <td className="py-3 font-mono text-zinc-300">{formatViews(vid.views_count)}</td>
                  <td className="py-3 font-mono text-zinc-400">{formatDuration(vid.duration_seconds)}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Approved</span>
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Live
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
