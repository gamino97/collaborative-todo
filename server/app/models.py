from datetime import datetime
from uuid import uuid4

from flask_login import UserMixin
from marshmallow import Schema, fields, validate
from pydantic import UUID4, BaseModel
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func

from .database import db


class User(UserMixin, db.Model):
    __tablename__ = "user_table"
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(UUID(as_uuid=True), default=uuid4)
    name = db.Column(db.String(300), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())
    email = db.Column(db.String(255), unique=True)
    username = db.Column(db.String(255), unique=True, nullable=True)
    password = db.Column(db.String(255), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team_table.id"), nullable=True)
    team = db.relationship("Team", backref="users")
    active = db.Column(db.Boolean())

    def __repr__(self):
        return f"<User {self.name}>"


class UserModel(BaseModel):
    id: int
    uuid: UUID4
    name: str
    created_at: datetime
    updated_at: datetime | None
    email: str
    username: str | None
    password: str
    active: bool

    class Config:
        orm_mode = True


class RegisterSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(max=300))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(max=255))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(max=255))
    remember_me = fields.Boolean()


class Task(db.Model):
    __tablename__ = "task_table"
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(UUID(as_uuid=True), default=uuid4)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(1024), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey("user_table.id"))
    author = db.relationship("User", backref="tasks")
    team_id = db.Column(db.Integer, db.ForeignKey("team_table.id"), nullable=True)
    team = db.relationship("Team", backref="tasks")
    done = db.Column(db.Boolean(), default=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    deleted = db.Column(db.Boolean(), default=False, nullable=False)

    def __repr__(self):
        return f"<Task {self.title}>"


class TaskModel(BaseModel):
    id: int
    uuid: UUID4
    title: str
    description: str
    done: bool
    team_id: int | None
    created_at: datetime

    class Config:
        orm_mode = True

class Team(db.Model):
    __tablename__ = "team_table"
    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(UUID(as_uuid=True), default=uuid4)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())


class TeamModel(BaseModel):
    id: int
    uuid: UUID4
    name: str
    created_at: datetime
    tasks: list[TaskModel]

    class Config:
        orm_mode = True
