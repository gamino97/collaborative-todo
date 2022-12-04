from pprint import pprint

from flask import Blueprint, request
from flask_login import current_user, login_required, login_user
from marshmallow import ValidationError
from werkzeug.security import check_password_hash, generate_password_hash

from .database import db
from .models import RegisterSchema, User, UserModel

bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@bp.post("/register")
def register():
    request_data = request.get_json()
    try:
        result = RegisterSchema().load(request_data)
    except ValidationError as err:
        pprint(err.messages)
        pprint(err.valid_data)
        return err.messages.copy(), 400
    else:
        # return result.copy(), 201
        email: str = result["email"]
        password: str = result["password"]
        name: str = result["name"]
        user = User(name=name, email=email, password=generate_password_hash(password), active=True)
        db.session.add(user)
        db.session.commit()
        print(UserModel.from_orm(user))
        login_user(user)
        response = {"messsage": "User registered", "user": user.name}
        return response, 201


@bp.route("/user")
@login_required
def get_user():
    user = UserModel.from_orm(current_user)
    return user.json(), 200
