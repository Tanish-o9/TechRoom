import React, { useEffect, useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
import { AppHeader } from "./components/AppHeader";
import { CommandPalette } from "./components/CommandPalette";
import { UploadModal } from "./components/UploadModal";
import { HomeView } from "./views/HomeView";
import { ExploreView } from "./views/ExploreView";
import { WatchView } from "./views/WatchView";
import { MissionsView } from "./views/MissionsView";
import { WorkspaceView } from "./views/WorkspaceView";
import { GenomeView } from "./views/GenomeView";
import { ResearchView } from "./views/ResearchView";
import { ChallengesView } from "./views/ChallengesView";
import { PassportView } from "./views/PassportView";
import { RoomsView } from "./views/RoomsView";
import { CreatorView } from "./views/CreatorView";
import { SettingsView } from "./views/SettingsView";
import { Video, SummaryData, AppView } from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Video catalogue state
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  // Mission selection state
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);

  // Persistent user state
  const [subscribedChannels, setSubscribedChannels] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("techroom_subscribed");
    return saved ? new Set(JSON.parse(saved)) : new Set(["systemdesign", "react_architecture"]);
  });
  const [savedVideoIds, setSavedVideoIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("techroom_saved");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [likedVideoIds, setLikedVideoIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("techroom_liked");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [watchHistory, setWatchHistory] = useState<Array<{ video: Video; watchedAt: string }>>(() => {
    const saved = localStorage.getItem("techroom_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("techroom_subscribed", JSON.stringify(Array.from(subscribedChannels)));
  }, [subscribedChannels]);
  useEffect(() => {
    localStorage.setItem("techroom_saved", JSON.stringify(Array.from(savedVideoIds)));
  }, [savedVideoIds]);
  useEffect(() => {
    localStorage.setItem("techroom_liked", JSON.stringify(Array.from(likedVideoIds)));
  }, [likedVideoIds]);
  useEffect(() => {
    localStorage.setItem("techroom_history", JSON.stringify(watchHistory));
  }, [watchHistory]);

  // Global keydown for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch videos from backend
  const fetchVideos = async (cat: string = selectedCategory, search: string = searchQuery) => {
    try {
      const params = new URLSearchParams();
      if (cat && cat !== "All") params.append("category", cat);
      if (search.trim()) params.append("search", search.trim());
      const res = await fetch(`/api/v1/videos?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setVideos(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchVideos(selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView("explore");
    fetchVideos(selectedCategory, searchQuery);
  };

  // Open video in WatchView
  const handleOpenVideo = async (vid: Video) => {
    setActiveVideo(vid);
    setCurrentView("watch");
    setCurrentTime(0);

    // Record into watch history
    setWatchHistory((prev) => {
      const filtered = prev.filter((item) => item.video.id !== vid.id);
      return [{ video: vid, watchedAt: "Just now" }, ...filtered];
    });

    try {
      fetch(`/api/v1/videos/${vid.id}/history`, { method: "POST" }).catch(() => {});
    } catch {
      // ignore
    }

    // Fetch AI Summary
    try {
      const res = await fetch(`/api/v1/ai/summary/${vid.id}`);
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      } else {
        setSummary({
          tldr: `Comprehensive technical breakdown of ${vid.title}.`,
          key_takeaways: [
            "Guaranteed reliable execution and resilience patterns.",
            "Production-tested architectural best practices.",
            "Timestamp-grounded code citations.",
          ],
          code_concepts: [vid.category, "Clean Architecture", "Production Ready"],
          chapters: [
            { start_time: 0, end_time: 120, title: "1. Core Principles & Setup", summary: "Initial design concepts." },
            { start_time: 120, end_time: 300, title: "2. Implementation Deep Dive", summary: "Writing the solution." },
            { start_time: 300, end_time: vid.duration_seconds, title: "3. Verification & Metrics", summary: "Release benchmarks." },
          ],
        });
      }
    } catch {
      // fallback
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleLike = (videoId: string) => {
    setLikedVideoIds((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId);
      else next.add(videoId);
      return next;
    });
    try {
      fetch(`/api/v1/videos/${videoId}/like`, { method: "POST" }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const handleToggleSave = (videoId: string) => {
    setSavedVideoIds((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) next.delete(videoId);
      else next.add(videoId);
      return next;
    });
    try {
      fetch(`/api/v1/videos/${videoId}/save`, { method: "POST" }).catch(() => {});
    } catch {
      // ignore
    }
  };

  const handleToggleSubscribe = (handle: string) => {
    setSubscribedChannels((prev) => {
      const next = new Set(prev);
      if (next.has(handle)) next.delete(handle);
      else next.add(handle);
      return next;
    });
  };

  const handleOpenMission = (missionId: string) => {
    setSelectedMissionId(missionId);
    setCurrentView("missions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <AppHeader
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        onOpenUploadModal={() => setUploadModalOpen(true)}
        onOpenAIAssistant={() => setCurrentView("research")}
        onNavigate={(v) => setCurrentView(v)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Body Shell: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <AppSidebar
          currentView={currentView}
          onNavigate={(v) => {
            if (v === "home") {
              setSelectedCategory("All");
              setSearchQuery("");
              fetchVideos("All", "");
            }
            setCurrentView(v);
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />

        {/* Center / Main Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto bg-[#0a0c12]">
          {currentView === "home" && (
            <HomeView
              videos={videos}
              onOpenVideo={handleOpenVideo}
              onNavigate={(v) => setCurrentView(v)}
              onOpenMission={handleOpenMission}
            />
          )}

          {currentView === "explore" && (
            <ExploreView
              videos={videos}
              onOpenVideo={handleOpenVideo}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                fetchVideos(cat, searchQuery);
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {currentView === "watch" && activeVideo && (
            <WatchView
              video={activeVideo}
              onBack={() => setCurrentView("explore")}
              onNavigate={(v) => setCurrentView(v)}
              summary={summary}
              onSeek={(s) => setCurrentTime(s)}
              currentTime={currentTime}
              onTimeUpdate={(t) => setCurrentTime(t)}
              allVideos={videos}
              onOpenVideo={handleOpenVideo}
              isLiked={likedVideoIds.has(activeVideo.id)}
              onToggleLike={handleToggleLike}
              isSaved={savedVideoIds.has(activeVideo.id)}
              onToggleSave={handleToggleSave}
              isSubscribed={subscribedChannels.has(activeVideo.channel_handle || "")}
              onToggleSubscribe={handleToggleSubscribe}
            />
          )}

          {currentView === "missions" && (
            <MissionsView
              onNavigate={(v) => setCurrentView(v)}
              selectedMissionId={selectedMissionId || undefined}
              onSelectMission={setSelectedMissionId}
            />
          )}

          {currentView === "build" && <WorkspaceView />}

          {(currentView === "genome" || currentView === "projects") && <GenomeView />}

          {currentView === "research" && <ResearchView />}

          {currentView === "challenges" && <ChallengesView />}

          {currentView === "passport" && <PassportView />}

          {currentView === "rooms" && <RoomsView />}

          {currentView === "creator" && (
            <CreatorView
              videos={videos}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onOpenVideo={handleOpenVideo}
            />
          )}

          {(currentView === "settings" || currentView === "memory") && <SettingsView />}
        </main>
      </div>

      {/* Global Command Palette (⌘K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={(v) => setCurrentView(v)}
      />

      {/* Creator Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onVideoCreated={(newVid) => {
          setVideos([newVid, ...videos]);
        }}
      />
    </div>
  );
}
