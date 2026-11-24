import React from "react";
import {
  Compass,
  Search,
  Target,
  Terminal,
  FolderGit2,
  Swords,
  Cpu,
  Brain,
  BookmarkCheck,
  Users,
  Video,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { AppView } from "../types";

interface AppSidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenCommandPalette: () => void;
  activeMissionCount?: number;
  liveRoomCount?: number;
}

interface NavItem {
  id: AppView | "search_palette";
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  action?: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentView,
  onNavigate,
  collapsed,
  onToggleCollapse,
  onOpenCommandPalette,
  activeMissionCount = 2,
  liveRoomCount = 3,
}) => {
  const sections: NavSection[] = [
    {
      title: "DISCOVER",
      items: [
        { id: "home", label: "Home", icon: LayoutDashboard },
        { id: "explore", label: "Explore", icon: Compass },
        {
          id: "search_palette",
          label: "Search & Cmd+K",
          icon: Search,
          badge: "⌘K",
          action: onOpenCommandPalette,
        },
      ],
    },
    {
      title: "ENGINEER",
      items: [
        { id: "missions", label: "Missions", icon: Target, badge: activeMissionCount },
        { id: "build", label: "Build Workspace", icon: Terminal },
        { id: "projects", label: "Projects", icon: FolderGit2 },
        { id: "challenges", label: "Battle Arena", icon: Swords, badge: "Live" },
        { id: "genome", label: "Architecture", icon: Cpu },
      ],
    },
    {
      title: "INTELLIGENCE",
      items: [
        { id: "research", label: "AI Research", icon: Brain },
        { id: "memory", label: "Personal Memory", icon: BookmarkCheck },
        { id: "passport", label: "Skill Passport", icon: ShieldCheck },
      ],
    },
    {
      title: "COMMUNITY",
      items: [
        { id: "rooms", label: "Engineering Rooms", icon: Users, badge: `${liveRoomCount} Live` },
        { id: "creator", label: "Creator Studio", icon: Video },
      ],
    },
  ];

  return (
    <aside
      className={`relative shrink-0 flex flex-col justify-between border-r border-[#1e2230] bg-[#0c0e14] transition-all duration-300 z-30 select-none ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top Header / Brand */}
      <div className="h-14 border-b border-[#1e2230] flex items-center justify-between px-3.5">
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 cursor-pointer group overflow-hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform shrink-0">
            <Cpu className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="font-bold text-sm tracking-tight text-white">Tech</span>
              <span className="font-bold text-sm tracking-tight text-blue-400">Room</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181b26] text-blue-300 border border-[#252b3d]">
                v2.4
              </span>
            </div>
          )}
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-[#1a1e2c] transition"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!collapsed && (
              <div className="px-2.5 py-1 text-[10px] font-mono font-semibold tracking-wider text-zinc-500 uppercase">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (item.id !== "search_palette") {
                      onNavigate(item.id as AppView);
                    }
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                    isActive
                      ? "bg-[#181c2b] text-blue-400 font-semibold border border-blue-500/20 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-[#131620]"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? "text-blue-400" : "text-zinc-400 group-hover:text-zinc-200"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span
                      className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-[#1e2333] text-zinc-400 group-hover:text-zinc-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Profile & Settings */}
      <div className="border-t border-[#1e2230] p-2 space-y-1">
        <button
          onClick={() => onNavigate("settings")}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs text-zinc-400 hover:text-zinc-100 hover:bg-[#131620] transition ${
            currentView === "settings" ? "bg-[#181c2b] text-blue-400 font-semibold" : ""
          } ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </button>

        <div
          className={`flex items-center gap-2.5 px-2 py-2 rounded-lg bg-[#11131c] border border-[#1e2230] ${
            collapsed ? "justify-center p-2" : ""
          }`}
        >
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white ring-1 ring-blue-400/30">
              TR
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#0c0e14]" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-zinc-200 truncate">tanish_dev</span>
                <span className="text-[9px] font-mono px-1 rounded bg-blue-950/60 text-blue-400 border border-blue-900/40">
                  STAFF
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono truncate">Level 4 · 920 XP</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
