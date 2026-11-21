from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import BaseModel

class User(BaseModel):
    """Platform user model supporting role-based access control."""
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(30), default="developer")  # developer, creator, admin
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    github_id: Mapped[str | None] = mapped_column(String(100), nullable=True, unique=True)
