from flask import url_for

from app.database import db
from app.models import Task, Team, User


def test_create_task_with_valid_data(app, user):
    # Arrange
    # Crea un usuario autenticado y un equipo para él
    team = Team(name="test_team")
    user.team = team
    db.session.add(team)
    db.session.commit()
    with app.test_client(user=user) as client:
        # Act
        response = client.post(
            url_for("tasks.create_task"),
            json={"title": "Task 1", "description": "Description 1"},
        )
    # Assert
    # Verifica que la respuesta sea correcta
    assert response.status_code == 201
    data = response.get_json()
    assert data["title"] == "Task 1"
    assert data["description"] == "Description 1"
    assert data["done"] is False
    assert data["team_id"] is None


def test_create_task_with_valid_data_and_team(app, user):
    # Arrange
    team = Team(name="test_team")
    user.team = team
    db.session.add(team)
    db.session.commit()

    with app.test_client(user=user) as client:
        # Act
        response = client.post(
            url_for("tasks.create_task"),
            json={"title": "Task 1", "description": "Description 1", "team": True},
        )
    # Assert
    # Verifica que la respuesta sea correcta
    assert response.status_code == 201
    data = response.get_json()
    assert data["title"] == "Task 1"
    assert data["description"] == "Description 1"
    assert data["author_id"] == user.id
    assert data["team_id"] == team.id


def test_create_task_with_invalid_data(app, user):
    # Inicia sesión con el usuario autenticado
    with app.test_client(user=user) as client:
        # Act
        response = client.post(url_for("tasks.create_task"), json={})

    # Assert
    # Verifica que se requiere un título
    assert response.status_code == 400
    data = response.get_json()
    assert "title" in data["description"]


def test_create_task_with_team_without_team_membership(app, user):
    # Arrange
    with app.test_client(user=user) as client:
        # Act
        response = client.post(url_for("tasks.create_task"), json={"title": "Task 1", "team": True})

    # Assert
    # Verifica que se devuelve un error de equipo
    assert response.status_code == 400
    data = response.get_json()
    assert data["description"] == "This user is not part of any team."


def test_create_task_with_unauthenticated_user(app, user):
    # Arrange
    with app.test_client() as client:
        # Act
        response = client.post(url_for("tasks.create_task"), json={"title": "Task 1", "team": True})
    # Assert
    # Verifica que se devuelve un error de autorización
    assert response.status_code == 401
    data = response.get_json()
    assert "description" in data
