import pytest
from flask import json, url_for

from app.database import db
from app.models import Team


def test_join_team_with_no_team_associated(app, user):
    # Create team
    team = Team(name="Team 1")
    db.session.add(team)
    db.session.commit()
    # Make the response
    with app.test_client(user=user) as client:
        response = client.post(url_for("teams.join_team"), json={"code": team.uuid})
    # Assert successfully response
    assert response.status_code == 200
    assert response.get_json() == {"message": f'You successfully joined to "{team.name}"'}
    # Verificar que el usuario actual se haya unido al equipo correcto en la base de datos
    db.session.refresh(user)
    assert user.team_id == team.id


def test_join_team_with_existing_team_association(app, user):

    # Asociar un equipo actual al usuario actual
    team = Team(name="Existing Team")
    db.session.add(team)
    user.team = team
    # Create team to join
    team2 = Team(name="Another Team")
    db.session.add(team2)
    db.session.commit()
    # Probar unirse a un nuevo equipo
    with app.test_client(user=user) as client:
        response = client.post(url_for("teams.join_team"), json={"code": team2.uuid})
    assert response.status_code == 400
    assert response.get_json() == {"message": "Currently you are associated with a team, abandon it to join this team."}


def test_join_team_with_invalid_input(app, user):
    with app.test_client(user=user) as client:
        response = client.post(url_for("teams.join_team"), json={})
    assert response.status_code == 400
    assert response.get_json() == {"code": ["Missing data for required field."]}


def test_join_team_with_nonexistent_team(app, user):
    from uuid import uuid4

    with app.test_client(user=user) as client:
        response = client.post(url_for("teams.join_team"), json={"code": uuid4()})
    assert response.status_code == 404
    assert response.json["description"] == {"message": "Team does not exist"}


def test_join_team_without_login(client):
    response = client.post(url_for("teams.join_team"), json={"code": "67890"})
    assert response.status_code == 401
    assert response.json["name"] == "Unauthorized"
