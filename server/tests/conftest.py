import pytest
from flask_login import FlaskLoginClient
from werkzeug.security import generate_password_hash

from app.database import db
from app.main import create_app
from app.models import User


@pytest.fixture()
def app():
    extra_config = {"TESTING": True, "WTF_CSRF_ENABLED": False, "MAIL_SUPPRESS_SEND": True}
    app = create_app(env_file=".env.test", extra_config=extra_config)
    app.test_client_class = FlaskLoginClient
    # other setup can go here
    with app.app_context():
        db.create_all()
        yield app
        db.session.close()
        # clean up / reset resources here
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def runner(app):
    return app.test_cli_runner()


password = "strong_password"
remember_me = True
name = "Rodrigo"
email = "example@example.com"


@pytest.fixture()
def user():
    user = User(
        name=name,
        email=email,
        active=remember_me,
        password=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.commit()
    return user
