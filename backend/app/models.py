from datetime import date, datetime, timezone

from sqlalchemy import UniqueConstraint

from .extensions import db


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(120), nullable=False)
    last_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=True)
    auth_provider = db.Column(db.String(50), nullable=False, default="email")
    google_sub = db.Column(db.String(255), unique=True, nullable=True)
    avatar_url = db.Column(db.String(500), nullable=True)
    phone = db.Column(db.String(30), nullable=True)
    address = db.Column(db.String(500), nullable=True)
    date_of_birth = db.Column(db.Date, nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        onupdate=utc_now,
    )

    reports = db.relationship(
        "Report",
        back_populates="user",
        cascade="all, delete-orphan",
        lazy=True,
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "auth_provider": self.auth_provider,
            "avatar_url": self.avatar_url,
            "phone": self.phone,
            "address": self.address,
            "date_of_birth": self.date_of_birth.isoformat() if self.date_of_birth else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Report(db.Model):
    __tablename__ = "reports"
    __table_args__ = (
        UniqueConstraint("user_id", "stored_file_name", name="uq_report_user_file_name"),
    )

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    original_file_name = db.Column(db.String(255), nullable=False)
    stored_file_name = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)
    pain_score = db.Column(db.Float, nullable=True)
    assessment_result = db.Column(db.Text, nullable=True)
    uploaded_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utc_now)

    user = db.relationship("User", back_populates="reports")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "user_id": self.user_id,
            "original_file_name": self.original_file_name,
            "stored_file_name": self.stored_file_name,
            "file_path": self.file_path,
            "pain_score": self.pain_score,
            "assessment_result": self.assessment_result,
            "uploaded_at": self.uploaded_at.isoformat() if self.uploaded_at else None,
        }
