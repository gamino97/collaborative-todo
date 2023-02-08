from flask import url_for

from app.mail import mail


def test_reset_password(client, user):
    request_data = {"email": user.email}
    with mail.record_messages() as outbox:
        response = client.post(url_for("auth.reset_password"), json=request_data)
        assert response.status_code == 200
        assert len(outbox) == 1
        assert outbox[0].subject == "Password Reset Request"
        assert "message" in response.json


def test_reset_password_invalid_email(client):
    with mail.record_messages() as outbox:
        request_data = {"email": ""}

        response = client.post(url_for("auth.reset_password"), json=request_data)
        assert len(outbox) == 0
        assert response.status_code == 400
        assert response.json == {"email": ["Not a valid email address."]}


def test_reset_password_user_logged(app, user):
    with app.test_client(user=user) as client:
        request_data = {"email": user.email}
        with mail.record_messages() as outbox:
            response = client.post(url_for("auth.reset_password"), json=request_data)
            assert response.status_code == 401
            assert len(outbox) == 0


def test_reset_password_email_does_not_exist(client, user):
    request_data = {"email": f"otro{user.email}"}
    with mail.record_messages() as outbox:
        response = client.post(url_for("auth.reset_password"), json=request_data)
        assert response.status_code == 200
        assert len(outbox) == 0
        assert "message" in response.json
