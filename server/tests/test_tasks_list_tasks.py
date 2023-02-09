from flask import url_for

from app.database import db
from app.models import Task, Team


def test_list_tasks_with_authenticated_user(app, user):
    # Arrange
    team = Team(name="test_team")
    user.team = team
    db.session.add(team)
    db.session.commit()

    # Crea un par de tareas para el usuario y el equipo
    task1 = Task(author=user, team=team, title="Task 1")
    task2 = Task(author=user, team=team, title="Task 2")
    task3 = Task(author=user, team=None, title="Task 3")
    db.session.add(task1)
    db.session.add(task2)
    db.session.add(task3)
    db.session.commit()

    # Log in
    with app.test_client(user=user) as client:
        # Act
        response = client.get(url_for("tasks.list_tasks"))
    # Assert
    # Verifica que la respuesta es correcta
    assert response.status_code == 200
    data = response.get_json()
    assert len(data) == 3
    assert data[0]["title"] == "Task 1"
    assert data[1]["title"] == "Task 2"
    assert data[2]["title"] == "Task 3"


def test_list_tasks_with_unauthenticated_user(client):
    # Arrange

    # Act
    response = client.get(url_for("tasks.list_tasks"))

    # Assert
    # Verifica que se requiere autenticación
    assert response.status_code == 401
