import React from "react";
import { Settings, ShieldCheck, Palette, Database } from "lucide-react";

export const SettingsView: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-4xl mx-auto">
      <div className="space-y-1 pb-3 border-b border-[#1c2130]">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-zinc-400" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-xs text-zinc-400">
          Manage developer workspace preferences, API keys, Scope Guard thresholds, and sandbox environments.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Developer Environment */}
        <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
            <Palette className="w-4 h-4 text-blue-400" />
            <span>Interface & Typography</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200">Theme</span>
                <p className="text-zinc-500 text-[11px]">Enforced Dark-First Charcoal system palette.</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#181c28] text-blue-400 border border-[#24293a]">
                Deep Charcoal (Default)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-zinc-200">Code Editor Font</span>
                <p className="text-zinc-500 text-[11px]">JetBrains Mono / Fira Code with ligatures.</p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#181c28] text-zinc-300 border border-[#24293a]">
                JetBrains Mono
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Scope Guard Thresholds */}
        <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Scope Guard Filtering Policy</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Content is automatically screened for technical depth and relevance. Generic entertainment, non-developer vlogs, and unverified claims are blocked before publishing.
          </p>
          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Threshold: 0.85 (Strict Developer Focus)
            </span>
          </div>
        </div>

        {/* Section 3: MicroVM Execution Sandbox */}
        <div className="p-5 rounded-xl bg-[#10121a] border border-[#1e2332] space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider font-mono">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>MicroVM Execution Sandbox</span>
          </div>
          <div className="space-y-2 text-xs text-zinc-400">
            <p>• Isolated Linux containers with zero host credential exposure.</p>
            <p>• Memory limit: 512 MB per challenge execution.</p>
            <p>• Timeout: 5.0 seconds maximum runtime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
