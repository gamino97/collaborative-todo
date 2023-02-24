from http import HTTPStatus

from apiflask import APIBlueprint, abort
from apiflask.fields import String
from flask.typing import ResponseReturnValue
from flask_login import current_user, login_required
from sqlalchemy import and_, or_

from .database import db
from .models import Task
from .schemas import CreateTaskSchema, TaskSchema

bp = APIBlueprint("tasks", __name__, url_prefix="/api/tasks")


@bp.get("/list")
@bp.output(TaskSchema(many=True))
@bp.doc(responses=[HTTPStatus.UNAUTHORIZED.value])
@login_required
def list_tasks() -> ResponseReturnValue:
    tasks = Task.query.filter(
        or_(Task.author == current_user, and_(Task.team_id != None, Task.team_id == current_user.team_id)),
        Task.deleted == False,
    )
    return tasks


@bp.post("/create")
@bp.input(CreateTaskSchema)
@bp.output(TaskSchema, status_code=201)
@bp.doc(
    responses={
        400: "Trying to create a task in a team the user is not part of",
        HTTPStatus.UNAUTHORIZED.value: HTTPStatus.UNAUTHORIZED.phrase,
    }
)
@login_required
def create_task(data) -> ResponseReturnValue:
    title = data.get("title")
    description = data.get("description", "")
    team = data.get("team", False)
    task = Task(title=title, description=description, author=current_user)
    if team:
        if not current_user.team_id:
            abort(400, message="This user is not part of any team.")
        task.team_id = current_user.team_id
    db.session.add(task)
    db.session.commit()
    return task


def verify_is_task_editable(task: Task):
    message = task.is_task_editable_by_user(current_user)
    if message == "authorized":
        return
    if message == "deleted":
        abort(404)
    if message == "unauthorized":
        abort(HTTPStatus.FORBIDDEN, message="You are not authorized to modify this task")


@bp.patch("/update/<int:task_id>")
@bp.input(TaskSchema(partial=True))
@bp.output(TaskSchema)
@bp.doc(responses=[HTTPStatus.FORBIDDEN.value, HTTPStatus.UNAUTHORIZED.value])
@login_required
def update_task(task_id, data) -> ResponseReturnValue:
    task: Task = db.get_or_404(Task, task_id)
    verify_is_task_editable(task)
    title = data.get("title")
    description = data.get("description")
    done = data.get("done")
    if task.title != title:
        task.title = title
    if task.description != description:
        task.description = description
    if task.done != done:
        task.done = done
    db.session.commit()
    return task


@bp.post("/delete/<int:task_id>")
@bp.output({"message": String()})
@bp.doc(
    responses={
        HTTPStatus.FORBIDDEN.value: HTTPStatus.FORBIDDEN.phrase,
        HTTPStatus.UNAUTHORIZED.value: HTTPStatus.UNAUTHORIZED.phrase,
    }
)
@login_required
def delete_task(task_id) -> ResponseReturnValue:
    task: Task = db.get_or_404(Task, task_id)
    verify_is_task_editable(task)
    task.deleted = True
    db.session.commit()
    return {"message": "Task deleted succesfully"}
