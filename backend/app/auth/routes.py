from datetime import date

from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import check_password_hash, generate_password_hash

from ..extensions import db
from ..models import User


auth_bp = Blueprint("auth", __name__)


def _parse_date_of_birth(raw_value: str | None) -> date | None:
    if not raw_value:
        return None
    return date.fromisoformat(raw_value)


@auth_bp.post("/register")
def register():
    payload = request.get_json(silent=True) or {}
    first_name = (payload.get("first_name") or "").strip()
    last_name = (payload.get("last_name") or "").strip()
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not first_name or not last_name or not email or not password:
        return jsonify({"message": "First name, last name, email, and password are required."}), 400

    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters long."}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"message": "An account with this email already exists."}), 409

    user = User(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=generate_password_hash(password),
        auth_provider="email",
    )
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify(
        {
            "message": "Account created successfully.",
            "access_token": access_token,
            "user": user.to_dict(),
        }
    ), 201


@auth_bp.post("/login")
def login():
    payload = request.get_json(silent=True) or {}
    email = (payload.get("email") or "").strip().lower()
    password = payload.get("password") or ""

    if not email or not password:
        return jsonify({"message": "Email and password are required."}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.password_hash:
        return jsonify({"message": "Invalid email or password."}), 401

    if not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid email or password."}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify(
        {
            "message": "Login successful.",
            "access_token": access_token,
            "user": user.to_dict(),
        }
    )


@auth_bp.post("/google")
def google_login():
    payload = request.get_json(silent=True) or {}
    google_token = payload.get("id_token") or ""
    client_id = current_app.config["GOOGLE_CLIENT_ID"]

    if not client_id:
        return jsonify({"message": "Google login is not configured on the server."}), 500

    if not google_token:
        return jsonify({"message": "Google id_token is required."}), 400

    try:
        token_info = id_token.verify_oauth2_token(
            google_token,
            google_requests.Request(),
            client_id,
            clock_skew_in_seconds=10,
        )
    except ValueError as exc:
        return jsonify(
            {
                "message": "Google token verification failed. Make sure frontend and backend use the same Google client ID.",
                "detail": str(exc),
            }
        ), 401

    email = (token_info.get("email") or "").strip().lower()
    google_sub = token_info.get("sub")

    if not email or not google_sub:
        return jsonify({"message": "Google account data is incomplete."}), 400

    user = User.query.filter_by(email=email).first()
    if user is None:
        full_name = (token_info.get("name") or "").strip().split()
        first_name = token_info.get("given_name") or (full_name[0] if full_name else "Google")
        last_name = token_info.get("family_name") or (" ".join(full_name[1:]) if len(full_name) > 1 else "User")
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            auth_provider="google",
            google_sub=google_sub,
            avatar_url=token_info.get("picture"),
        )
        db.session.add(user)
    else:
        user.google_sub = google_sub
        user.avatar_url = token_info.get("picture")
        if user.auth_provider == "email" and not user.password_hash:
            user.auth_provider = "google"

    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify(
        {
            "message": "Google login successful.",
            "access_token": access_token,
            "user": user.to_dict(),
        }
    )


@auth_bp.get("/me")
@jwt_required()
def current_user():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(int(user_id))
    return jsonify({"user": user.to_dict()})


@auth_bp.put("/me")
@jwt_required()
def update_current_user():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(int(user_id))
    payload = request.get_json(silent=True) or {}

    first_name = (payload.get("first_name") or "").strip()
    last_name = (payload.get("last_name") or "").strip()
    phone = (payload.get("phone") or "").strip() or None
    address = (payload.get("address") or "").strip() or None
    date_of_birth_raw = (payload.get("date_of_birth") or "").strip()

    if not first_name or not last_name:
        return jsonify({"message": "First name and last name are required."}), 400

    try:
        date_of_birth = _parse_date_of_birth(date_of_birth_raw)
    except ValueError:
        return jsonify({"message": "date_of_birth must be in YYYY-MM-DD format."}), 400

    user.first_name = first_name
    user.last_name = last_name
    user.phone = phone
    user.address = address
    user.date_of_birth = date_of_birth

    db.session.commit()
    return jsonify({"message": "Profile updated successfully.", "user": user.to_dict()})


@auth_bp.post("/change-password")
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(int(user_id))
    payload = request.get_json(silent=True) or {}
    current_password = payload.get("current_password") or ""
    new_password = payload.get("new_password") or ""
    confirm_password = payload.get("confirm_password") or ""

    if user.auth_provider != "email" or not user.password_hash:
        return jsonify({"message": "Password changes are only available for email login accounts."}), 400

    if not current_password or not new_password or not confirm_password:
        return jsonify({"message": "All password fields are required."}), 400

    if not check_password_hash(user.password_hash, current_password):
        return jsonify({"message": "Current password is incorrect."}), 401

    if len(new_password) < 8:
        return jsonify({"message": "New password must be at least 8 characters long."}), 400

    if new_password != confirm_password:
        return jsonify({"message": "New password and confirm password do not match."}), 400

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"message": "Password updated successfully."})
