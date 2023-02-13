from http import HTTPStatus

from apiflask import APIBlueprint
from flask import Blueprint, abort, request
from flask.typing import ResponseReturnValue
from flask_login import current_user, login_required
from marshmallow import ValidationError
from sqlalchemy import or_

from .database import db
from .models import Task
from .schemas import CreateTaskSchema, TaskSchema

bp = APIBlueprint("tasks", __name__, url_prefix="/api/tasks")


@bp.get("/list")
@login_required
def list_tasks() -> ResponseReturnValue:
    tasks = Task.query.filter(
        or_(Task.author == current_user, Task.team_id == current_user.team_id), Task.deleted == False
    )
    task_schema = TaskSchema(many=True)
    return task_schema.dump(tasks)


@bp.post("/create")
@login_required
def create_task() -> ResponseReturnValue:
    request_data = request.get_json()
    try:
        result = CreateTaskSchema().load(request_data)
    except ValidationError as err:
        abort(400, err.messages.copy())
    else:
        title = result.get("title")
        description = result.get("description", "")
        team = result.get("team", False)
        task = Task(title=title, description=description, author=current_user)
        if team:
            if not current_user.team_id:
                abort(400, description="This user is not part of any team.")
            task.team_id = current_user.team_id
        db.session.add(task)
        db.session.commit()
        return TaskSchema().dump(task), 201


def verify_is_task_editable(task: Task):
    message = task.is_task_editable_by_user(current_user)
    if message == "authorized":
        return
    if message == "deleted":
        abort(404, description="Task does not exist")
    if message == "unauthorized":
        abort(HTTPStatus.FORBIDDEN, description="You are not authorized to modify this task")


@bp.put("/update/<int:task_id>")
@login_required
def update_task(task_id) -> ResponseReturnValue:
    task: Task = db.get_or_404(Task, task_id)
    verify_is_task_editable(task)
    request_data = request.get_json()
    task_schema = TaskSchema()
    try:
        result = task_schema.load(request_data)
    except ValidationError as err:
        abort(400, err.messages.copy())
    else:
        title = result.get("title")
        description = result.get("description")
        done = result.get("done")
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
def delete_task(task_id) -> ResponseReturnValue:
    task: Task = db.get_or_404(Task, task_id)
    verify_is_task_editable(task)
    task.deleted = True
    db.session.commit()
    return {"message": "Task deleted succesfully"}
