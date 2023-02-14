from app.models import User


def test_register(client):
    data = {"name": "Carlos", "email": "example@example.com", "password": "strong_password"}
    response = client.post("/api/auth/register", json=data)
    assert response.status_code == 201
    user = User.query.one()
    assert user.name == data["name"]
    assert user.email == data["email"]
    assert user.password != data["password"]
    assert user.active is True
    assert user.is_authenticated is True
    assert user.team is None
    assert user.username is None
    assert user.uuid
    response_user: dict = response.json
    assert set(response_user.keys()) == {"name", "active", "created_at", "email", "uuid", "updated_at"}


def test_no_name_register(client):
    data = {"name": "", "email": "example@example.com", "password": "strong_password"}
    response = client.post("/api/auth/register", json=data)
    assert response.status_code == 422
    data = response.json["detail"]["json"]
    assert type(data["name"]) == list
    assert not data.get("password")
    assert not data.get("email")
    assert User.query.count() == 0


def test_no_email_register(client):
    data = {"name": "Carlos", "email": "", "password": "strong_password"}
    response = client.post("/api/auth/register", json=data)
    assert response.status_code == 422
    data = response.json["detail"]["json"]
    assert type(data["email"]) == list
    assert not data.get("password")
    assert not data.get("name")
    assert User.query.count() == 0


def test_invalid_email_register(client):
    data = {"name": "Carlos", "email": "wrong_email_format", "password": "strong_password"}
    response = client.post("/api/auth/register", json=data)
    assert response.status_code == 422
    data = response.json["detail"]["json"]
    assert type(data["email"]) == list
    assert not data.get("password")
    assert not data.get("name")
    assert User.query.count() == 0


def test_no_password_register(client):
    data = {"name": "Carlos", "email": "example@example.com", "password": ""}
    response = client.post("/api/auth/register", json=data)
    assert response.status_code == 422
    data = response.json["detail"]["json"]
    assert type(data["password"]) == list
    assert not data.get("email")
    assert not data.get("name")
    assert User.query.count() == 0


def test_already_registered_email(client):
    data = {"name": "Carlos", "email": "example@example.com", "password": "strong_password"}
    response = client.post("/api/auth/register", json=data)
    assert response.status_code == 201
    assert User.query.count() == 1
    first_user = User.query.one()
    assert first_user.email == data["email"]
    data = {"name": "Rodrigo", "email": "example@example.com", "password": "another_strong_password"}
    response = client.post("/api/auth/register", json=data)
    assert response.status_code == 400
    assert User.query.count() == 1
    assert response.json["message"] == "Email is already registered."
