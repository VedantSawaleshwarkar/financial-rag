"""
auth.py — Minimal auth backend using SQLite + bcrypt + JWT.
No extra database service needed; uses Python's built-in sqlite3.
"""

import sqlite3
import bcrypt
import jwt
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
DB_PATH = Path(__file__).parent / "users.db"
JWT_SECRET = os.environ.get("JWT_SECRET", "finai-rag-super-secret-change-in-prod")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_HOURS = 72


# ── Database setup ─────────────────────────────────────────────────────────────
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Create users table if it doesn't exist."""
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                name      TEXT    NOT NULL,
                email     TEXT    NOT NULL UNIQUE,
                password  TEXT    NOT NULL,
                created   TEXT    NOT NULL
            )
            """
        )
        conn.commit()


# ── Password helpers ───────────────────────────────────────────────────────────
def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


# ── JWT helpers ────────────────────────────────────────────────────────────────
def create_token(user_id: int, email: str, name: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "name": name,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRE_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    """Returns decoded payload or raises jwt.PyJWTError."""
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])


# ── User operations ────────────────────────────────────────────────────────────
def create_user(name: str, email: str, password: str) -> dict:
    """Create a new user. Raises ValueError if email already taken."""
    hashed = hash_password(password)
    now = datetime.now(timezone.utc).isoformat()
    try:
        with get_db() as conn:
            cursor = conn.execute(
                "INSERT INTO users (name, email, password, created) VALUES (?, ?, ?, ?)",
                (name.strip(), email.strip().lower(), hashed, now),
            )
            conn.commit()
            user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        raise ValueError("An account with this email already exists.")
    return {"id": user_id, "name": name.strip(), "email": email.strip().lower()}


def authenticate_user(email: str, password: str) -> dict:
    """Verify credentials. Raises ValueError on bad email/password."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, name, email, password FROM users WHERE email = ?",
            (email.strip().lower(),),
        ).fetchone()

    if row is None or not verify_password(password, row["password"]):
        raise ValueError("Invalid email or password.")

    return {"id": row["id"], "name": row["name"], "email": row["email"]}


def get_user_by_id(user_id: int) -> dict | None:
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, name, email FROM users WHERE id = ?", (user_id,)
        ).fetchone()
    if row is None:
        return None
    return {"id": row["id"], "name": row["name"], "email": row["email"]}
