from flask import Blueprint, request
from flask_login import current_user, login_required
from marshmallow import ValidationError

from .database import db
from .models import Team
from .schemas import TeamSchema

bp = Blueprint("teams", __name__, url_prefix="/api/teams")


@bp.post("/create")
@login_required
def create_team():
    request_data = request.get_json()
    team_schema = TeamSchema()
    try:
        result = team_schema.load(request_data)
    except ValidationError as err:
        return err.messages.copy(), 400
    else:
        name: str = result.get("name")
        task = Team(name=name)
        db.session.add(task)
        task.users.append(current_user)
        db.session.commit()
        return team_schema.dump(task), 201
