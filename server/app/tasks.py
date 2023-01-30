from functools import wraps

from flask import Blueprint, abort, request
from flask_login import current_user, login_required
from marshmallow import ValidationError
from sqlalchemy import or_

from .database import db
from .models import Task, TaskModel
from .schemas import CreateTaskSchema, TaskSchema

bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


@bp.get("/list")
@login_required
def list_tasks():
    tasks = Task.query.filter(
        or_(Task.author == current_user, Task.team_id == current_user.team_id), Task.deleted == False
    )
    task_schema = TaskSchema(many=True)
    return task_schema.dump(tasks)


def task_editable_required(f):
    "This decorator should be after login_required decorator"

    @wraps(f)
    def decorated_function(*args, **kwargs):
        task_id = kwargs.get("task_id", None)
        if not task_id:
            raise Exception("Your endpoint should have <task_id> as a param")
        task: Task = db.get_or_404(Task, task_id)
        if task.deleted:
            return {"non_field_errors": "Task does not exist"}, 404
        if not task.author == current_user or not task.team_id == current_user.team_id:
            return {"non_field_errors": "This task is not editable"}, 400
        return f(*args, **kwargs)

    return decorated_function


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
        team = result.get("team", False)
        task = Task(title=title, description=description, author=current_user)
        if team:
            if not current_user.team_id:
                return {"message": "This user is not part of any team."}, 400
            task.team_id = current_user.team_id
        db.session.add(task)
        db.session.commit()
        task_orm = TaskModel.from_orm(task)
        return task_orm.json(), 201


@bp.post("/update/<int:task_id>")
@login_required
@task_editable_required
def update_task(task_id):
    task: Task = db.get_or_404(Task, task_id)
    request_data = request.get_json()
    task_schema = TaskSchema()
    try:
        result = task_schema.load(request_data, partial=True)
    except ValidationError as err:
        return err.messages.copy(), 400
    else:
        title = result.get("title", "")
        description = result.get("description", "")
        done = result.get("done", "")
        if task.title != title:
            task.title = title
        if task.description != description:
            task.description = description
        if task.done != done:
            task.done = done
        db.session.commit()
        return task_schema.dump(task), 200


@bp.post("/delete/<int:task_id>")
@login_required
@task_editable_required
def delete_task(task_id):
    task: Task = db.get_or_404(Task, task_id)
    task.deleted = True
    db.session.commit()
    return {"message": "Task deleted succesfully"}
