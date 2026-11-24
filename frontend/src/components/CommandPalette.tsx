import React, { useEffect, useState } from "react";
import {
  Search,
  LayoutDashboard,
  Compass,
  Target,
  Terminal,
  FolderGit2,
  Swords,
  Cpu,
  Brain,
  Users,
  Video,
  Settings,
  ShieldCheck,
  X,
  ArrowRight,
} from "lucide-react";
import { AppView } from "../types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
}

interface PaletteAction {
  id: string;
  title: string;
  category: "Navigation" | "Action" | "Tools";
  icon: React.ElementType;
  shortcut?: string;
  perform: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions: PaletteAction[] = [
    {
      id: "nav-home",
      title: "Go to Home Operating Dashboard",
      category: "Navigation",
      icon: LayoutDashboard,
      shortcut: "G H",
      perform: () => {
        onNavigate("home");
        onClose();
      },
    },
    {
      id: "nav-explore",
      title: "Explore Systems & Technical Video Catalog",
      category: "Navigation",
      icon: Compass,
      shortcut: "G E",
      perform: () => {
        onNavigate("explore");
        onClose();
      },
    },
    {
      id: "nav-missions",
      title: "Active Engineering Missions",
      category: "Navigation",
      icon: Target,
      shortcut: "G M",
      perform: () => {
        onNavigate("missions");
        onClose();
      },
    },
    {
      id: "nav-build",
      title: "Open Build Workspace (IDE)",
      category: "Tools",
      icon: Terminal,
      shortcut: "G B",
      perform: () => {
        onNavigate("build");
        onClose();
      },
    },
    {
      id: "nav-projects",
      title: "View Recent Projects & Genome",
      category: "Navigation",
      icon: FolderGit2,
      shortcut: "G P",
      perform: () => {
        onNavigate("projects");
        onClose();
      },
    },
    {
      id: "nav-challenges",
      title: "Battle Arena & Break My Code Challenges",
      category: "Tools",
      icon: Swords,
      shortcut: "G C",
      perform: () => {
        onNavigate("challenges");
        onClose();
      },
    },
    {
      id: "nav-architecture",
      title: "Project Genome Architecture Visualizer",
      category: "Tools",
      icon: Cpu,
      perform: () => {
        onNavigate("genome");
        onClose();
      },
    },
    {
      id: "nav-research",
      title: "AI Research Lab & Video Synthesis",
      category: "Tools",
      icon: Brain,
      perform: () => {
        onNavigate("research");
        onClose();
      },
    },
    {
      id: "nav-passport",
      title: "Skill Passport & Verifiable Evidence",
      category: "Navigation",
      icon: ShieldCheck,
      perform: () => {
        onNavigate("passport");
        onClose();
      },
    },
    {
      id: "nav-rooms",
      title: "Live Collaborative Engineering Rooms",
      category: "Navigation",
      icon: Users,
      perform: () => {
        onNavigate("rooms");
        onClose();
      },
    },
    {
      id: "nav-creator",
      title: "Creator Studio & Analytics",
      category: "Navigation",
      icon: Video,
      perform: () => {
        onNavigate("creator");
        onClose();
      },
    },
    {
      id: "nav-settings",
      title: "Platform Settings & Preferences",
      category: "Navigation",
      icon: Settings,
      perform: () => {
        onNavigate("settings");
        onClose();
      },
    },
  ];

  const filtered = actions.filter((act) =>
    act.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-xl bg-[#0f1118] border border-[#24293a] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#1e2334]">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to feature..."
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.id}
                  onClick={action.perform}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-zinc-300 hover:text-white hover:bg-[#1a1f2e] transition text-left group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 shrink-0" />
                    <span className="truncate">{action.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {action.shortcut && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161a26] text-zinc-400 border border-[#262c3e]">
                        {action.shortcut}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 transition" />
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-8 text-xs text-zinc-500 font-mono">
              No matching commands or destinations found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#0c0e14] border-t border-[#1e2334] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
          <span>Navigation Quick-Jump</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};
