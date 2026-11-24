import React from "react";
import {
  Search,
  Bell,
  Sparkles,
  Plus,
  ShieldCheck,
  Terminal,
  Keyboard,
} from "lucide-react";
import { AppView } from "../types";

interface AppHeaderProps {
  onOpenCommandPalette: () => void;
  onOpenUploadModal: () => void;
  onOpenAIAssistant: () => void;
  onNavigate: (view: AppView) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenCommandPalette,
  onOpenUploadModal,
  onOpenAIAssistant,
  onNavigate,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  return (
    <header className="sticky top-0 z-40 h-14 bg-[#0c0e14]/90 backdrop-blur-md border-b border-[#1e2230] px-4 flex items-center justify-between gap-4">
      {/* Search & Command Palette Bar */}
      <div className="flex-1 max-w-xl flex items-center gap-2">
        <form onSubmit={onSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search systems, code concepts, errors, missions..."
            className="w-full bg-[#121520] hover:bg-[#151926] focus:bg-[#151926] border border-[#222738] focus:border-blue-500/60 rounded-lg pl-9 pr-20 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none transition-all"
          />
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="absolute right-2 top-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1c2130] text-[10px] font-mono text-zinc-400 hover:text-zinc-200 border border-[#293044] transition"
            title="Open Command Palette (Cmd+K)"
          >
            <Keyboard className="w-3 h-3" />
            <span>⌘K</span>
          </button>
        </form>
      </div>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Scope Guard Status Badge */}
        <div className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Scope Guard Active</span>
        </div>

        {/* Quick Launch IDE */}
        <button
          onClick={() => onNavigate("build")}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151824] hover:bg-[#1c2132] border border-[#24293a] text-zinc-300 hover:text-white text-xs font-medium transition"
          title="Open Build Workspace IDE"
        >
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span>IDE</span>
        </button>

        {/* AI Assistant Trigger */}
        <button
          onClick={onOpenAIAssistant}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition"
          title="Open AI Engineering Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Create / Upload */}
        <button
          onClick={onOpenUploadModal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#161a26] border border-transparent hover:border-[#222738] transition"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#0c0e14]" />
        </div>
      </div>
    </header>
  );
};
