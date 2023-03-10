# pyright: reportOptionalCall=false
from apiflask import Schema, fields
from apiflask.validators import Length
from marshmallow import EXCLUDE, validate

from .ma import ma
from .models import Task, Team, User


class UserSchema(ma.SQLAlchemySchema):
    name = ma.auto_field()
    active = ma.auto_field()
    created_at = ma.auto_field()
    email = ma.auto_field()
    uuid = ma.auto_field()
    updated_at = ma.auto_field()

    class Meta:
        model = User
        unknown = EXCLUDE


class CreateTaskSchema(ma.Schema):
    title = fields.String(required=True, validate=Length(max=255))
    description = fields.String(required=False, validate=Length(max=1024))
    team = fields.Boolean(load_default=False)

    class Meta:
        unknown = EXCLUDE


class TaskSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Task
        unknown = EXCLUDE

    id = ma.auto_field(dump_only=True)
    title = ma.auto_field(validate=[validate.Length(min=1, max=255)])
    description = ma.auto_field()
    done = ma.auto_field()
    created_at = ma.auto_field(dump_only=True)
    team_id = ma.auto_field(dump_only=True)
    author_id = ma.auto_field(dump_only=True)


class TeamSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Team
        unknown = EXCLUDE

    id = ma.auto_field(dump_only=True)
    uuid = ma.auto_field(dump_only=True)
    name = ma.auto_field(validate=[validate.Length(min=1, max=255)])
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
    new_password = fields.String(required=True, validate=validate.Length(max=255))

    class Meta:
        unknown = EXCLUDE


class RegisterSchema(Schema):
    name = fields.String(required=True, validate=Length(min=1, max=300))
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=Length(max=255, min=8))


class RegisterOutput(Schema):
    message = fields.String()
    user = UserSchema()


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.String(required=True, validate=validate.Length(max=255))
    remember_me = fields.Boolean(required=True)

    class Meta:
        unknown = EXCLUDE


class LogoutSchema(Schema):
    message = fields.String()
