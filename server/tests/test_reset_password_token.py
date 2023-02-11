from datetime import datetime, timedelta

from flask import url_for
from freezegun import freeze_time
from werkzeug.security import check_password_hash

from app.database import db
from app.models import User


def test_reset_password_token_verify(client, user: User):
    access_token = user.get_reset_token()
    request_data = {"new_password": "my_new_strong_and_complicated_password"}
    response = client.post(url_for("auth.reset_password_token", token=access_token), json=request_data)
    assert response.status_code == 200
    assert response.json == {"message": "Your password has been updated! You are now able to log in"}
    # Verify that we updated the password
    db.session.refresh(user)
    assert check_password_hash(user.password, request_data["new_password"])


def test_reset_password_token_verify_authenticated_user(app, user: User):
    access_token = user.get_reset_token()
    request_data = {"new_password": "my_new_strong_and_complicated_password"}
    with app.test_client(user=user) as client:
        response = client.post(url_for("auth.reset_password_token", token=access_token), json=request_data)
        assert response.status_code == 400
        assert response.json["description"] == {"message": False}
        # Verify that we did not update the password
        db.session.refresh(user)
        assert not check_password_hash(user.password, request_data["new_password"])


def test_reset_password_token_expired_token(client, user: User):
    access_token = user.get_reset_token()
    request_data = {"new_password": "my_new_strong_and_complicated_password"}
    fake_time = datetime.utcnow() + timedelta(seconds=2000)

    with freeze_time(fake_time):
        assert datetime.now() == fake_time
        response = client.post(url_for("auth.reset_password_token", token=access_token), json=request_data)
    assert response.status_code == 400
    assert response.json["description"] == {"message": "That is an invalid or expired token"}
    # Verify that we did not update the password
    db.session.refresh(user)
    assert not check_password_hash(user.password, request_data["new_password"])


def test_reset_password_token_invalid_token(client):
    request_data = {"new_password": "my_new_strong_and_complicated_password"}
    response = client.post(url_for("auth.reset_password_token", token="token"), json=request_data)
    assert response.status_code == 400
    assert response.json["description"] == {"message": "That is an invalid or expired token"}
