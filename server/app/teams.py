from flask import Blueprint, request
from flask_login import current_user, login_required
from marshmallow import ValidationError

from .database import db
from .models import Team, User, TeamModel
from .schemas import TeamSchema

bp = Blueprint("teams", __name__, url_prefix="/api/teams")


@bp.post("/create")
@login_required
def create_team():
    user: User = current_user
    if user.team_id:
        return {"message": "Invalid user"}, 400
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
