from marshmallow import EXCLUDE, fields, validate

from .ma import ma
from .models import Task


class CreateTaskSchema(ma.Schema):
    title = fields.Str(required=True, validate=[validate.Length(max=255)])
    description = fields.Str(required=False, validate=[validate.Length(max=1024)])

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
