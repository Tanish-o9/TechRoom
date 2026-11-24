export interface Video {
  id: string;
  channel_id: string;
  title: string;
  description: string;
  visibility: string;
  status: string;
  duration_seconds: number;
  playback_url?: string;
  thumbnail_url?: string;
  views_count: number;
  category: string;
  tags?: string;
  channel_title?: string;
  channel_handle?: string;
  channel_avatar?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
}

export interface Chapter {
  start_time: number;
  end_time: number;
  title: string;
  summary: string;
}

export interface SummaryData {
  tldr: string;
  key_takeaways: string[];
  code_concepts: string[];
  chapters: Chapter[];
}

export interface Citation {
  start_time: number;
  end_time: number;
  text_snippet: string;
}

export interface AskResponse {
  answer: string;
  citations: Citation[];
}

export interface Comment {
  id: string;
  username: string;
  content: string;
  timestamp_seconds?: number;
  created_at: string;
}

export interface CreatorChannel {
  handle: string;
  title: string;
  avatar: string;
  subscribers: string;
  description: string;
  category: string;
}

export interface Mission {
  id: string;
  title: string;
  domain: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  estimated_hours: number;
  progress_percent: number;
  current_milestone: string;
  skills: string[];
  tasks: Array<{ id: string; title: string; completed: boolean }>;
  architecture_ref?: string;
}

export interface ProjectGenome {
  id: string;
  name: string;
  description: string;
  tech_stack: string[];
  health_score: number;
  last_updated: string;
  modules: Array<{ name: string; type: string; status: "healthy" | "warning" | "optimized" }>;
  endpoints: Array<{ method: string; path: string; latency_ms: number }>;
}

export interface Challenge {
  id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  language: string;
  description: string;
  broken_code: string;
  test_cases: Array<{ input: string; expected: string }>;
  solution_code: string;
}

export interface SkillEvidenceItem {
  id: string;
  skill: string;
  level: "Proficient" | "Advanced" | "Expert";
  score: number;
  verified_date: string;
  evidence_type: string;
}

export interface EngineeringRoomItem {
  id: string;
  title: string;
  topic: string;
  host: string;
  participants_count: number;
  is_live: boolean;
  shared_code: string;
  shared_notes: string;
}

export type AppView =
  | "home"
  | "explore"
  | "watch"
  | "missions"
  | "build"
  | "projects"
  | "challenges"
  | "research"
  | "memory"
  | "genome"
  | "rooms"
  | "passport"
  | "creator"
  | "settings";
