from flask import url_for

from app.database import db
from app.models import Team


def test_leave_team_with_valid_team(app, user):
    team = Team(name="Team 1")
    team.users.append(user)
    db.session.add(team)
    db.session.commit()
    db.session.refresh(user)
    # Iniciar sesión con un usuario que tenga un equipo asociado
    with app.test_client(user=user) as client:

        # Realizar una solicitud POST al endpoint "leave_team" con el ID de equipo correcto
        response = client.post(url_for("teams.leave_team", team_id=team.id))

    # Verificar que la respuesta tenga un estatus 200 (OK)
    assert response.status_code == 200

    # Deserializar la respuesta como JSON
    data = response.json

    # Verificar que la respuesta contenga un mensaje de éxito
    assert "message" in data
    assert data["message"] == "You successfully leave the team"


def test_leave_team_with_invalid_team(app, user):
    team = Team(name="Team 1")
    team.users.append(user)
    db.session.add(team)
    db.session.commit()
    db.session.refresh(user)
    # Iniciar sesión con un usuario que tenga un equipo asociado
    with app.test_client(user=user) as client:
        # Realizar una solicitud POST al endpoint "leave_team" con un ID de equipo inválido
        response = client.post(url_for("teams.leave_team", team_id=team.id + 1))

    # Verificar que la respuesta tenga un estatus 404 (No encontrado)
    assert response.status_code == 404


def test_leave_team_without_login(client):
    # Realizar una solicitud POST al endpoint "leave_team" sin haber iniciado sesión
    response = client.post(url_for("teams.leave_team", team_id=1))

    # Verificar que la respuesta tenga un estatus 401 (No autorizado)
    assert response.status_code == 401
