from http import HTTPStatus

from flask import Flask, abort, jsonify
from flask_login import LoginManager
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFError, CSRFProtect, generate_csrf

from .config import Settings, build_database_uri
from .database import db
from .ma import ma
from .mail import mail
from .models import User

csrf = CSRFProtect()
# https://testdriven.io/blog/flask-spa-auth/#frontend-served-separately-cross-domain
migrate = Migrate()
login_manager = LoginManager()


def create_app(env_file=None, extra_config: dict | None = None):

    config = Settings(_env_file=env_file, _env_file_encoding="utf-8")
    DATABASE_URI = build_database_uri(config)

    app = Flask(__name__, static_folder="../static", static_url_path="/static")

    app.config.update(
        DEBUG=config.DEBUG,
        SECRET_KEY=config.SECRET_KEY,
        SQLALCHEMY_DATABASE_URI=DATABASE_URI,
        WTF_CSRF_TIME_LIMIT=None,
        MAIL_SERVER=config.MAIL_SERVER,
        MAIL_PORT=config.MAIL_PORT,
        MAIL_USE_SSL=config.MAIL_USE_SSL,
        MAIL_USERNAME=config.MAIL_USERNAME,
        MAIL_PASSWORD=config.MAIL_PASSWORD,
        MAIL_DEFAULT_SENDER=config.MAIL_DEFAULT_SENDER
        # SQLALCHEMY_ECHO=True,
    )
    # Have cookie sent
    app.secret_key = config.SECRET_KEY
    if extra_config is not None:
        app.config.update(extra_config)
    db.init_app(app)

    csrf.init_app(app)

    migrate.init_app(app, db)
    ma.init_app(app)

    # Set up the login manager
    login_manager.init_app(app)
    mail.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return User.query.get(int(user_id))

    @login_manager.unauthorized_handler
    def unauthorized():
        abort(HTTPStatus.UNAUTHORIZED)

    if config.DEBUG:
        from flask_cors import CORS

        app.config.update(
            SESSION_COOKIE_DOMAIN="dev.localhost:5173", SESSION_COOKIE_SAMESITE="Lax", SERVER_NAME="dev.localhost:5000"
        )
        cors = CORS(
            app,
            resources={r"*": {"origins": "http://dev.localhost:5173"}},
            expose_headers=["Content-Type", "X-CSRFToken"],
            supports_credentials=True,
        )

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def hello_world(path):
        return app.send_static_file("index.html")

    @app.get("/api/getcsrf")
    def get_csrf():
        token = generate_csrf()
        response = jsonify({"detail": "CSRF cookie set"})
        response.headers.set("X-CSRFToken", token)
        return response

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e):
        return {"error": e.description}, 400

    from . import auth, tasks, teams

    app.register_blueprint(auth.bp)
    app.register_blueprint(tasks.bp)
    app.register_blueprint(teams.bp)

    return app
