from datetime import datetime, timedelta

from flask import url_for
from freezegun import freeze_time

from app.models import User


def test_reset_password_token_verify(client, user: User):
    access_token = user.get_reset_token()
    response = client.get(url_for("auth.reset_password_token_verify", token=access_token))
    assert response.status_code == 200
    assert response.json == {"valid": True}


def test_reset_password_token_verify_authenticated_user(app, user: User):
    access_token = user.get_reset_token()
    with app.test_client(user=user) as client:
        response = client.get(url_for("auth.reset_password_token_verify", token=access_token))
        assert response.status_code == 200
        assert response.json == {"valid": False}


def test_reset_password_token_expired_token(client, user: User):
    access_token = user.get_reset_token()
    fake_time = datetime.utcnow() + timedelta(seconds=2000)

    with freeze_time(fake_time):
        assert datetime.now() == fake_time
        response = client.get(url_for("auth.reset_password_token_verify", token=access_token))
    assert response.status_code == 200
    assert response.json == {"valid": "That is an invalid or expired token"}


def test_reset_password_token_invalid_token(client):
    response = client.get(url_for("auth.reset_password_token_verify", token="token"))
    assert response.status_code == 200
    assert response.json == {"valid": "That is an invalid or expired token"}
