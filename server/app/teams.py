from http import HTTPStatus

from apiflask import APIBlueprint, abort
from apiflask.fields import String
from flask.typing import ResponseReturnValue
from flask_login import current_user, login_required
from marshmallow import ValidationError

from .database import db
from .models import Team, User
from .schemas import JoinTeamSchema, TeamSchema

bp = APIBlueprint("teams", __name__, url_prefix="/api/teams")


@bp.post("/create")
@bp.input(TeamSchema)
@bp.output(TeamSchema, status_code=HTTPStatus.CREATED.value)
@bp.doc(
    responses={
        HTTPStatus.BAD_REQUEST.value: "User associated with a team",
        HTTPStatus.UNAUTHORIZED.value: HTTPStatus.UNAUTHORIZED.phrase,
    }
)
@login_required
def create_team(data) -> ResponseReturnValue:
    user: User = current_user
    if user.team_id:
        abort(
            HTTPStatus.BAD_REQUEST,
            message="Currently you are associated with a team, abandon it to join this team.",
        )
    name: str = data.get("name")
    team = Team(name=name)
    db.session.add(team)
    team.users.append(current_user)
    db.session.commit()
    return team


@bp.get("/myteam")
@bp.output(TeamSchema)
@bp.doc(responses={HTTPStatus.UNAUTHORIZED.value: HTTPStatus.UNAUTHORIZED.phrase})
@login_required
def my_team() -> ResponseReturnValue:
    user = current_user
    if not user.team_id:
        return {}
    return current_user.team


@bp.post("/<int:team_id>/leave")
@bp.output({"message": String()})
@bp.doc(responses={HTTPStatus.UNAUTHORIZED.value: HTTPStatus.UNAUTHORIZED.phrase})
@login_required
def leave_team(team_id) -> ResponseReturnValue:
    team: Team = db.get_or_404(Team, team_id)
    if current_user.team_id == team.id:
        team.users.remove(current_user)
        db.session.commit()
    return {"message": "You successfully leave the team"}


@bp.post("/join")
@bp.input(JoinTeamSchema)
@bp.output(TeamSchema)
@bp.doc(
    responses={
        HTTPStatus.BAD_REQUEST.value: "User associated with a team",
        HTTPStatus.NOT_FOUND.value: HTTPStatus.NOT_FOUND.phrase,
        HTTPStatus.UNAUTHORIZED.value: HTTPStatus.UNAUTHORIZED.phrase,
    }
)
@login_required
def join_team(data) -> ResponseReturnValue:
    if current_user.team_id:
        abort(400, message="Currently you are associated with a team, abandon it to join this team.")
    team_code = str(data.get("code"))
    team: Team | None = Team.query.filter(Team.uuid == team_code).one_or_none()
    if team is None:
        abort(404)
    team.users.append(current_user)
    db.session.commit()
    return team
