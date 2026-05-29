from flask import Flask, jsonify
from sqlalchemy.exc import OperationalError

from .config import Config
from .extensions import cors, db, jwt
from .auth.routes import auth_bp
from .reports.routes import reports_bp


def create_app(config_class: type[Config] = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_class)

    _ensure_directories(app)
    _register_extensions(app)
    _register_blueprints(app)
    _register_cli_commands(app)
    _register_error_handlers(app)
    _register_routes(app)

    return app


def _ensure_directories(app: Flask) -> None:
    app.config["UPLOAD_ROOT"].mkdir(parents=True, exist_ok=True)


def _register_extensions(app: Flask) -> None:
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        supports_credentials=False,
    )


def _register_blueprints(app: Flask) -> None:
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")


def _register_cli_commands(app: Flask) -> None:
    @app.cli.command("init-db")
    def init_db_command() -> None:
        with app.app_context():
            db.create_all()
        print("Database tables created.")


def _register_error_handlers(app: Flask) -> None:
    @app.errorhandler(OperationalError)
    def handle_db_operational_error(error: OperationalError):
        return jsonify(
            {
                "message": "Database connection failed. Ensure the database server is running and the DATABASE_URL is valid.",
                "detail": str(error),
            }
        ), 500


def _register_routes(app: Flask) -> None:
    @app.get("/api/health")
    def health_check():
        return jsonify({"message": "Backend is running"})
