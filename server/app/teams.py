from http import HTTPStatus

from apiflask import APIBlueprint
from flask import Blueprint, abort, request
from flask.typing import ResponseReturnValue
from flask_login import current_user, login_required
from marshmallow import ValidationError

from .database import db
from .models import Team, User
from .schemas import JoinTeamSchema, TeamSchema

bp = APIBlueprint("teams", __name__, url_prefix="/api/teams")


@bp.post("/create")
@login_required
def create_team() -> ResponseReturnValue:
    user: User = current_user
    if user.team_id:
        return abort(
            HTTPStatus.BAD_REQUEST,
            description="Currently you are associated with a team, abandon it to join this team.",
        )
    request_data = request.get_json()
    team_schema = TeamSchema()
    try:
        result = team_schema.load(request_data)
    except ValidationError as err:
        abort(HTTPStatus.BAD_REQUEST, description=err.messages.copy())
    else:
        name: str = result.get("name")
        team = Team(name=name)
        db.session.add(team)
        team.users.append(current_user)
        db.session.commit()
        return team_schema.dump(team), 201


@bp.get("/myteam")
@login_required
def my_team() -> ResponseReturnValue:
    user = current_user
    if not user.team_id:
        return {"message": "No team is associated with this user"}
    team_schema = TeamSchema()
    return team_schema.dump(current_user.team)


@bp.post("/<int:team_id>/leave")
@login_required
def leave_team(team_id) -> ResponseReturnValue:
    team: Team = db.get_or_404(Team, team_id)
    if current_user.team_id == team.id:
        team.users.remove(current_user)
        db.session.commit()
    return {"message": "You successfully leave the team"}, 200


@bp.post("/join")
@login_required
def join_team() -> ResponseReturnValue:
    if current_user.team_id:
        return {"message": "Currently you are associated with a team, abandon it to join this team."}, 400
    # team: Team | None = db.get(Team, team_id)
    join_team_schema = JoinTeamSchema()
    request_data = request.get_json()
    try:
        result = join_team_schema.load(request_data)
    except ValidationError as err:
        return abort(HTTPStatus.BAD_REQUEST, description=err.messages.copy())
    team_code = str(result.get("code"))
    team: Team | None = Team.query.filter(Team.uuid == team_code).one_or_none()
    if team is None:
        return abort(404, description="Team does not exist")
    team.users.append(current_user)
    db.session.commit()
    return {"message": f'You successfully joined to "{team.name}"'}, 200
