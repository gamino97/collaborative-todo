from uuid import UUID

from flask import Blueprint, request
from flask_login import current_user, login_required
from marshmallow import ValidationError

from .database import db
from .models import Team, TeamModel, User
from .schemas import JoinTeamSchema, TeamSchema

bp = Blueprint("teams", __name__, url_prefix="/api/teams")


@bp.post("/create")
@login_required
def create_team():
    user: User = current_user
    if user.team_id:
        return {"message": "Currently you are associated with a team, abandon it to join this team."}, 400
    request_data = request.get_json()
    team_schema = TeamSchema()
    try:
        result = team_schema.load(request_data)
    except ValidationError as err:
        return err.messages.copy(), 400
    else:
        name: str = result.get("name")
        team = Team(name=name)
        db.session.add(team)
        team.users.append(current_user)
        db.session.commit()
        return team_schema.dump(team), 201


@bp.get("/myteam")
@login_required
def my_team():
    user = current_user
    if not user.team_id:
        return {"message": "No team is associated with this user"}
    team_schema = TeamSchema()
    return team_schema.dump(current_user.team)


@bp.post("/<int:team_id>/leave")
@login_required
def leave_team(team_id):
    team: Team = db.get_or_404(Team, team_id)
    if current_user.team_id == team.id:
        team.users.remove(current_user)
        db.session.commit()
    return {"message": "You successfully leave the team"}, 200


@bp.post("/join")
@login_required
def join_team():
    if current_user.team_id:
        return {"message": "Currently you are associated with a team, abandon it to join this team."}, 400
    # team: Team | None = db.get(Team, team_id)
    join_team_schema = JoinTeamSchema()
    request_data = request.get_json()
    try:
        result = join_team_schema.load(request_data)
    except ValidationError as err:
        return err.messages.copy(), 400
    team_code = str(result.get("code"))
    team: Team | None = Team.query.filter(Team.uuid == team_code).one_or_none()
    if team is None:
        return {"message": "Team does not exist"}, 404
    team.users.append(current_user)
    db.session.commit()
    return {"message": f'You successfully joined to "{team.name}"'}, 200
