from marshmallow import Schema, fields, validate


class CreateTaskSchema(Schema):
    title = fields.Str(required=True, validate=[validate.Length(max=255)])
    description = fields.Str(required=False, validate=[validate.Length(max=1024)])
