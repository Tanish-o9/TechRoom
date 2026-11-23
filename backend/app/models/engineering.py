from datetime import datetime
from sqlalchemy import Boolean, DateTime, Float, ForeignKey, Integer, JSON, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class Mission(BaseModel):
    """Structured, hands-on engineering missions (Feature 1)."""
    __tablename__ = "missions"

    title: Mapped[str] = mapped_column(String(200), index=True)
    domain: Mapped[str] = mapped_column(String(50), index=True)  # AI/ML, System Design, DevOps, Security
    difficulty: Mapped[str] = mapped_column(String(20), default="Intermediate")
    description: Mapped[str] = mapped_column(Text)
    stages: Mapped[list] = mapped_column(JSON, default=list)  # list of stages with tasks & acceptance criteria
    estimated_hours: Mapped[int] = mapped_column(Integer, default=10)

class MissionProgress(BaseModel):
    """Tracks developer progress through engineering missions."""
    __tablename__ = "mission_progress"
    __table_args__ = (UniqueConstraint("user_id", "mission_id", name="uq_user_mission"),)

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    mission_id: Mapped[str] = mapped_column(ForeignKey("missions.id", ondelete="CASCADE"), index=True)
    current_stage: Mapped[int] = mapped_column(Integer, default=0)
    completed_tasks: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(30), default="in_progress")  # in_progress, completed

class Challenge(BaseModel):
    """Break My Code & Arena Engineering Challenges (Feature 3 & 4)."""
    __tablename__ = "challenges"

    title: Mapped[str] = mapped_column(String(200), index=True)
    category: Mapped[str] = mapped_column(String(50), index=True)  # Race Condition, Memory Leak, DB Indexing
    difficulty: Mapped[str] = mapped_column(String(20), default="Medium")
    language: Mapped[str] = mapped_column(String(30), default="python")
    description: Mapped[str] = mapped_column(Text)
    broken_code: Mapped[str] = mapped_column(Text)
    test_cases: Mapped[list] = mapped_column(JSON, default=list)
    solution_code: Mapped[str] = mapped_column(Text)

class ChallengeSubmission(BaseModel):
    """Evaluated challenge submissions with scoring and logs."""
    __tablename__ = "challenge_submissions"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    challenge_id: Mapped[str] = mapped_column(ForeignKey("challenges.id", ondelete="CASCADE"), index=True)
    submitted_code: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(30), default="passed")  # passed, failed, error
    score: Mapped[int] = mapped_column(Integer, default=100)
    execution_time_ms: Mapped[int] = mapped_column(Integer, default=45)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)

class Project(BaseModel):
    """Project Genome project intelligence entity (Feature 5)."""
    __tablename__ = "projects"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(150), index=True)
    repo_url: Mapped[str | None] = mapped_column(String(300), nullable=True)
    description: Mapped[str] = mapped_column(Text)
    tech_stack: Mapped[list] = mapped_column(JSON, default=list)
    architecture_map: Mapped[dict] = mapped_column(JSON, default=dict)

class EngineeringRoom(BaseModel):
    """Live collaborative engineering rooms (Feature 8)."""
    __tablename__ = "engineering_rooms"

    host_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    topic: Mapped[str] = mapped_column(String(100))
    is_live: Mapped[bool] = mapped_column(Boolean, default=True)
    shared_code: Mapped[str] = mapped_column(Text, default="# Shared Engineering Workspace\n")
    shared_notes: Mapped[str] = mapped_column(Text, default="# Collaborative Notes\n")

class RoomMessage(BaseModel):
    """Messages inside live engineering rooms."""
    __tablename__ = "room_messages"

    room_id: Mapped[str] = mapped_column(ForeignKey("engineering_rooms.id", ondelete="CASCADE"), index=True)
    user_name: Mapped[str] = mapped_column(String(100))
    message: Mapped[str] = mapped_column(Text)

class SystemCaseStudy(BaseModel):
    """Inside The System interactive architectural studies (Feature 6)."""
    __tablename__ = "system_case_studies"

    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(50))
    summary: Mapped[str] = mapped_column(Text)
    architecture_diagram: Mapped[str] = mapped_column(Text)  # Mermaid or structured flow
    components: Mapped[list] = mapped_column(JSON, default=list)
    tradeoffs: Mapped[list] = mapped_column(JSON, default=list)

class SkillEvidence(BaseModel):
    """Verifiable Skill Evidence Passport records (Feature 10)."""
    __tablename__ = "skill_evidence"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    skill_name: Mapped[str] = mapped_column(String(100), index=True)  # e.g., "Distributed Systems", "PostgreSQL Optimization"
    level: Mapped[str] = mapped_column(String(30), default="Proficient")
    score: Mapped[int] = mapped_column(Integer, default=85)
    evidence_type: Mapped[str] = mapped_column(String(50))  # challenge_completed, mission_approved, test_passed
    reference_id: Mapped[str | None] = mapped_column(String(100), nullable=True)

class PersonalMemory(BaseModel):
    """Personal engineering memory notes & decisions (Feature 7 / Module C)."""
    __tablename__ = "personal_memories"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(50), default="Note")  # Note, Decision, Snippet, Bookmark
    content: Mapped[str] = mapped_column(Text)
    tags: Mapped[list] = mapped_column(JSON, default=list)
