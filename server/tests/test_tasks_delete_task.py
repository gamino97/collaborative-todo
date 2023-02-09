from flask import url_for

from app.database import db
from app.models import Task, Team


def test_delete_task_valid(app, user):
    task = Task(title="Test task", author=user, deleted=False)
    db.session.add(task)
    db.session.commit()

    with app.test_client(user=user) as client:
        response = client.post(url_for("tasks.delete_task", task_id=task.id))
    data = response.get_json()

    # check response
    assert response.status_code == 200
    assert response.json == {"message": "Task deleted succesfully"}


def test_delete_task_with_unauthorized_user(app, client, user):
    """Verify that a 401 Unauthorized error occurs if the user
    is not authenticated when trying to delete a task."""
    # setup test data
    task = Task(title="Test task", author=user, deleted=False)
    db.session.add(task)
    db.session.commit()

    # make request
    response = client.post(url_for("tasks.delete_task", task_id=task.id))

    # check response
    assert response.status_code == 401
    assert "error" in response.json


def test_delete_task_with_wrong_team_membership(app, user):
    """Verify that a 403 Forbidden error occurs if the user
    has no permissions to edit a task."""
    team = Team(name="Team 1")
    # User is not part of team
    task = Task(title="Test task", done=True, team=team)
    db.session.add(task)
    db.session.commit()

    # make request
    with app.test_client(user=user) as client:
        response = client.post(url_for("tasks.delete_task", task_id=task.id))
    # check response
    assert response.status_code == 403


def test_delete_task_with_wrong_author(app, user):
    """Verify that a 403 Forbidden error occurs if the user
    has no permissions to edit a task."""
    task = Task(title="Test task", done=True)
    db.session.add(task)
    db.session.commit()

    # make request
    with app.test_client(user=user) as client:
        response = client.post(url_for("tasks.delete_task", task_id=task.id))
    # check response
    assert response.status_code == 403


def test_delete_task_with_not_found_task(app, user):
    # setup test data
    task = Task(title="Test task", author=user, deleted=False)
    db.session.add(task)
    db.session.commit()
    with app.test_client(user=user) as client:
        # make request
        response = client.post(url_for("tasks.delete_task", task_id=task.id + 1))

    # check response
    assert response.status_code == 404
    assert "error" in response.json


def test_delete_task_with_deleted_task(app, client, user):
    task = Task(title="Test task", author=user, deleted=True)
    db.session.add(task)
    db.session.commit()
    # make request
    with app.test_client(user=user) as client:
        response = client.post(url_for("tasks.delete_task", task_id=task.id))
    # check response
    assert response.status_code == 404
    assert "error" in response.json
