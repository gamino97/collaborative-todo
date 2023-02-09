from datetime import datetime

import pytest
from flask import json, url_for

from app.database import db
from app.models import Team


def test_my_team_with_valid_user(app, user):
    # Iniciar sesión con un usuario que tenga un equipo asociado
    team = Team(name="Team 1")
    team.users.append(user)
    db.session.add(team)
    db.session.commit()
    db.session.refresh(user)
    with app.test_client(user=user) as client:
        response = client.get(url_for("teams.my_team"))

    # Verificar que la respuesta tenga un estatus 200 (OK)
    assert response.status_code == 200
    data = response.json

    # Verificar que la respuesta contenga información sobre el equipo
    assert data["id"] == team.id
    assert data["name"] == team.name
    assert data["uuid"] == str(team.uuid)
    assert datetime.fromisoformat(data["created_at"]) == team.created_at


def test_my_team_with_invalid_user(app, user):
    with app.test_client(user=user) as client:
        # Realizar una solicitud GET al endpoint "myteam"
        response = client.get(url_for("teams.my_team"))

    # Verificar que la respuesta tenga un estatus 200 (OK)
    assert response.status_code == 200

    # Deserializar la respuesta como JSON
    data = json.loads(response.data.decode())

    # Verificar que la respuesta contenga un mensaje de error
    assert "message" in data
    assert data["message"] == "No team is associated with this user"


def test_my_team_without_login(client):
    # Realizar una solicitud GET al endpoint "myteam" sin haber iniciado sesión
    response = client.get(url_for("teams.my_team"))

    # Verificar que la respuesta tenga un estatus 401 (No autorizado)
    assert response.status_code == 401
