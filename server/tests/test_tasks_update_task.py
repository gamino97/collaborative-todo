from flask import url_for

from app.database import db
from app.models import Task, Team


def test_update_task_with_valid_data(app, user):
    task = Task(title="Test task", author=user)
    db.session.add(task)
    db.session.commit()

    # make request
    request_data = {"title": "Updated test task", "description": "This is an updated test task", "done": True}
    with app.test_client(user=user) as client:
        response = client.put(url_for("tasks.update_task", task_id=task.id), json=request_data)
    data = response.get_json()

    # check response
    assert response.status_code == 200
    assert data["title"] == "Updated test task"
    assert data["description"] == "This is an updated test task"
    assert data["done"] is True


def test_update_task_with_invalid_data(app, user):
    # setup test data
    task = Task(title="Test task", author=user)
    db.session.add(task)
    db.session.commit()

    # make request
    request_data = {"title": "", "description": "This is an updated test task", "done": True}
    with app.test_client(user=user) as client:
        response = client.put(url_for("tasks.update_task", task_id=task.id), json=request_data)
    data = response.get_json()

    # check response
    assert response.status_code == 400
    assert data["title"] == ["Length must be between 1 and 255."]


def test_update_task_with_unauthorized_user(app, client, user):
    # setup test data
    task = Task(title="Test task", author=user)
    db.session.add(task)
    db.session.commit()

    # make request
    request_data = {"title": "Updated test task", "description": "This is an updated test task", "done": True}
    response = client.put(url_for("tasks.update_task", task_id=task.id), json=request_data)

    # check response
    assert response.status_code == 401
    assert "description" in response.json


def test_update_task_with_deleted_task(app, client, user):
    task = Task(title="Test task", author=user, deleted=True)
    db.session.add(task)
    db.session.commit()
    # make request
    request_data = {"title": "Updated test task", "description": "This is an updated test task", "done": True}
    with app.test_client(user=user) as client:
        response = client.put(url_for("tasks.update_task", task_id=task.id), json=request_data)
    # check response
    assert response.status_code == 404
    assert "description" in response.json


def test_update_task_with_wrong_team_membership(app, user):
    team = Team(name="Team 1")
    # User is not part of team
    task = Task(title="Test task", done=True, team=team)
    db.session.add(task)
    db.session.commit()

    # make request
    request_data = {"title": "Updated test task", "description": "This is an updated test task", "done": False}
    with app.test_client(user=user) as client:
        response = client.put(url_for("tasks.update_task", task_id=task.id), json=request_data)
    # check response
    assert response.status_code == 403
    assert "description" in response.json
