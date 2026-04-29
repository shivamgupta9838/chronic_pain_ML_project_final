from datetime import datetime
from pathlib import Path
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request, send_file
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename

from ..extensions import db
from ..models import Report, User
from ..services.prediction import PredictionError, predict_pain_from_csv


reports_bp = Blueprint("reports", __name__)
ALLOWED_EXTENSIONS = {".csv"}


def _build_report_storage_path(user_id: int, original_name: str) -> tuple[Path, str]:
    today = datetime.utcnow()
    safe_name = secure_filename(original_name)
    extension = Path(safe_name).suffix.lower()
    stored_name = f"{uuid4().hex}{extension}"
    relative_dir = Path(f"user_{user_id}") / today.strftime("%Y") / today.strftime("%m") / today.strftime("%d")
    absolute_dir = current_app.config["UPLOAD_ROOT"] / relative_dir
    absolute_dir.mkdir(parents=True, exist_ok=True)
    return absolute_dir / stored_name, str((relative_dir / stored_name).as_posix())


def _validate_file_extension(filename: str) -> bool:
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS


@reports_bp.post("")
@jwt_required()
def upload_report():
    user_id = int(get_jwt_identity())
    user = User.query.get_or_404(user_id)
    uploaded_file = request.files.get("file")

    if uploaded_file is None or not uploaded_file.filename:
        return jsonify({"message": "CSV file is required."}), 400

    if not _validate_file_extension(uploaded_file.filename):
        return jsonify({"message": "Only CSV files are allowed."}), 400

    file_destination, relative_path = _build_report_storage_path(user.id, uploaded_file.filename)
    uploaded_file.save(file_destination)

    try:
        prediction = predict_pain_from_csv(str(file_destination))
    except PredictionError as exc:
        if file_destination.exists():
            file_destination.unlink()
        return jsonify({"message": str(exc)}), 400
    except Exception:
        if file_destination.exists():
            file_destination.unlink()
        current_app.logger.exception("Pain prediction failed for uploaded file.")
        return jsonify({"message": "Model prediction failed for the uploaded CSV."}), 500

    report = Report(
        user_id=user.id,
        original_file_name=uploaded_file.filename,
        stored_file_name=file_destination.name,
        file_path=relative_path,
        pain_score=prediction["pain_score"],
        assessment_result=prediction["assessment_result"],
    )
    db.session.add(report)
    db.session.commit()

    return jsonify(
        {
            "message": "Report uploaded and scored successfully.",
            "report": report.to_dict(),
            "prediction": prediction,
        }
    ), 201


@reports_bp.get("")
@jwt_required()
def list_reports():
    user_id = int(get_jwt_identity())
    reports = (
        Report.query.filter_by(user_id=user_id)
        .order_by(Report.uploaded_at.desc())
        .all()
    )
    return jsonify({"reports": [report.to_dict() for report in reports]})


@reports_bp.get("/<int:report_id>")
@jwt_required()
def get_report(report_id: int):
    user_id = int(get_jwt_identity())
    report = Report.query.filter_by(id=report_id, user_id=user_id).first_or_404()
    return jsonify({"report": report.to_dict()})


@reports_bp.get("/<int:report_id>/download")
@jwt_required()
def download_report(report_id: int):
    user_id = int(get_jwt_identity())
    report = Report.query.filter_by(id=report_id, user_id=user_id).first_or_404()
    file_path = current_app.config["UPLOAD_ROOT"] / Path(report.file_path)

    if not file_path.exists():
        return jsonify({"message": "Stored file was not found on disk."}), 404

    return send_file(file_path, as_attachment=True, download_name=report.original_file_name)


@reports_bp.delete("/<int:report_id>")
@jwt_required()
def delete_report(report_id: int):
    user_id = int(get_jwt_identity())
    report = Report.query.filter_by(id=report_id, user_id=user_id).first_or_404()
    file_path = current_app.config["UPLOAD_ROOT"] / Path(report.file_path)

    db.session.delete(report)
    db.session.commit()

    if file_path.exists():
        file_path.unlink()

    return jsonify({"message": "Report deleted successfully."})
