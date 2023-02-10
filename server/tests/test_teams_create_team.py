import pytest
from flask import url_for

from app.database import db
from app.models import Team, User


@pytest.fixture
def team_data():
    return {"name": "Test Team"}


def test_create_team_with_authenticated_user(app, user, team_data):
    with app.test_client(user=user) as client:
        response = client.post(url_for("teams.create_team"), json=team_data)
    assert response.status_code == 201
    team = Team.query.filter_by(name=team_data["name"]).first()
    assert team is not None
    user = User.query.filter_by(id=user.id).first()
    assert user.team_id == team.id


def test_create_team_with_unauthenticated_user(client, user, team_data):
    response = client.post(url_for("teams.create_team"), json=team_data)
    assert response.status_code == 401
    assert "code" in response.json


def test_create_team_with_user_already_associated_to_team(app, user, team_data):
    team = Team(**team_data)
    db.session.add(team)
    db.session.commit()
    user.team_id = team.id
    db.session.commit()
    with app.test_client(user=user) as client:
        response = client.post(url_for("teams.create_team"), json=team_data)
    assert response.status_code == 400
    assert response.json["description"] == "Currently you are associated with a team, abandon it to join this team."


def test_create_team_with_invalid_data(app, user, team_data):
    team_data["name"] = ""
    with app.test_client(user=user) as client:
        response = client.post(url_for("teams.create_team"), json=team_data)
    assert response.status_code == 400
    assert "name" in response.json["description"]
