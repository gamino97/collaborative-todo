from pprint import pprint

from flask import Blueprint, request
from flask_login import current_user, login_required
from marshmallow import ValidationError

from .database import db
from .models import Task, TaskModel
from .schemas import CreateTaskSchema

bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


@bp.get("/list")
@login_required
def list_tasks():
    pprint(current_user.tasks)
    tasks = current_user.tasks
    return [TaskModel.from_orm(task).dict() for task in tasks]


@bp.post("/create")
@login_required
def create_tasks():
    request_data = request.get_json()
    try:
        result = CreateTaskSchema().load(request_data)
    except ValidationError as err:
        return err.messages.copy(), 400
    else:
        title = result.get("title")
        description = result.get("description", "")
        task = Task(title=title, description=description, author=current_user)
        db.session.add(task)
        db.session.commit()
        task_orm = TaskModel.from_orm(task)
        return task_orm.json(), 201
