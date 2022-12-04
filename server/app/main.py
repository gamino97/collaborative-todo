from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from flask_login import LoginManager
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFError, CSRFProtect, generate_csrf

from .config import DATABASE_URI, config
from .database import db
from .models import Task, User

csrf = CSRFProtect()
# https://testdriven.io/blog/flask-spa-auth/#frontend-served-separately-cross-domain
migrate = Migrate()
ma = Marshmallow()
login_manager = LoginManager()


def create_app():
    app = Flask(__name__, static_folder="../static", static_url_path="/static")

    app.config.update(
        DEBUG=config.DEBUG,
        SECRET_KEY=config.SECRET_KEY,
        SQLALCHEMY_DATABASE_URI=DATABASE_URI,
        WTF_CSRF_TIME_LIMIT=None,
    )
    # Have cookie sent
    app.secret_key = config.SECRET_KEY
    db.init_app(app)

    csrf.init_app(app)

    migrate.init_app(app, db)
    ma.init_app(app)

    # Setup the login manager
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        # since the user_id is just the primary key of our user table, use it in the query for the user
        return User.query.get(int(user_id))

    if config.DEBUG:
        app.config.update(
            SESSION_COOKIE_DOMAIN="dev.localhost:5173",
            SESSION_COOKIE_SAMESITE="Lax",
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
        tasks = Task.query.all()
        print(tasks)
        print(generate_csrf())
        return app.send_static_file("index.html")

    @app.get("/api/getcsrf")
    def get_csrf():
        token = generate_csrf()
        response = jsonify({"detail": "CSRF cookie set"})
        response.headers.set("X-CSRFToken", token)
        return response

    @app.get("/api/user")
    def get_user():
        return jsonify({"username": "pedro"})

    @app.post("/api/user")
    def post_user():
        request_data = request.get_json()
        return {"username": "pedro"}

    @app.errorhandler(CSRFError)
    def handle_csrf_error(e):
        return {"error": e.description}, 400

    from . import auth

    app.register_blueprint(auth.bp)

    return app
