# pyright: reportOptionalCall=false
from marshmallow import EXCLUDE, Schema, fields, validate
from marshmallow_sqlalchemy.fields import Nested

from .ma import ma
from .models import Task, Team


class CreateTaskSchema(ma.Schema):
    title = fields.Str(required=True, validate=[validate.Length(max=255)])
    description = fields.Str(required=False, validate=[validate.Length(max=1024)])
    team = fields.Boolean(load_default=False)

    class Meta:
        unknown = EXCLUDE


class TaskSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Task
        unknown = EXCLUDE

    id = ma.auto_field(dump_only=True)
    title = ma.auto_field()
    description = ma.auto_field()
    done = ma.auto_field()
    created_at = ma.auto_field(dump_only=True)
    team_id = ma.auto_field()


class TeamSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Team
        unknown = EXCLUDE

    id = ma.auto_field(dump_only=True)
    uuid = ma.auto_field(dump_only=True)
    name = ma.auto_field()
    created_at = ma.auto_field(dump_only=True)
    # tasks = Nested(TaskSchema, many=True, exclude=("team_id",))


class JoinTeamSchema(ma.Schema):
    code = fields.UUID(required=True)

    class Meta:
        unknown = EXCLUDE


class ResetPasswordSchema(ma.Schema):
    email = fields.Email(required=True)

    class Meta:
        unknown = EXCLUDE


class ResetPasswordTokenSchema(ma.Schema):
    new_password = fields.Str(required=True, validate=validate.Length(max=255))

    class Meta:
        unknown = EXCLUDE


class RegisterSchema(Schema):
    name = fields.Str(required=True, validate=validate.Length(min=1, max=300))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(max=255, min=8))


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(max=255))
    remember_me = fields.Boolean(required=True)

    class Meta:
        unknown = EXCLUDE
