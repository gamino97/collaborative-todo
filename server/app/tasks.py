from pprint import pprint

from flask import Blueprint, abort, request
from flask_login import current_user, login_required
from marshmallow import ValidationError

from .database import db
from .models import Task, TaskModel
from .schemas import CreateTaskSchema, TaskSchema

bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


@bp.get("/list")
@login_required
def list_tasks():
    tasks = Task.query.filter(Task.author == current_user, Task.deleted == False)
    task_schema = TaskSchema(many=True)
    return task_schema.dump(tasks)


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


@bp.post("/update/<int:task_id>")
@login_required
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
        print(task.description != description)
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
def delete_task(task_id):
    task: Task = db.get_or_404(Task, task_id)
    if task.deleted:
        abort(404)
    task.deleted = True
    db.session.commit()
    return {"message": "Task deleted succesfully"}
