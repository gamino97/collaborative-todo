from flask import Flask
from werkzeug.security import generate_password_hash

from app.database import db
from app.models import User

password = "strong_password"
remember_me = True
name = "Rodrigo"
email = "example@example.com"


def create_user():
    user = User(
        name=name,
        email=email,
        active=True,
        password=generate_password_hash(password),
    )
    db.session.add(user)
    db.session.commit()
    return user


def test_login_success(app: Flask):
    user = create_user()

    with app.test_client() as client:
        with client.session_transaction() as session:
            assert "_user_id" not in session
        response = client.post(
            "/api/auth/login", json={"email": email, "password": password, "remember_me": remember_me}
        )
        assert response.status_code == 200
        assert "name" in response.get_json()
        with client.session_transaction() as session:
            assert session.get("_user_id") == str(user.id)


def test_login_failure_bad_credentials(app: Flask):
    create_user()
    with app.test_client() as client:
        response = client.post(
            "/api/auth/login", json={"email": "test@example.com", "password": "bad_password", "remember_me": True}
        )
        assert response.status_code == 400
        assert response.json["message"] == "Please check your login details and try again."
        with client.session_transaction() as session:
            assert "_user_id" not in session


def test_login_failure_missing_data(app: Flask):
    create_user()
    with app.test_client() as client:
        response = client.post("api/auth/login", json={})
        assert response.status_code == 422
        data = response.json["detail"]["json"]
        assert "email" in data
        assert "password" in data
        with client.session_transaction() as session:
            assert "_user_id" not in session
