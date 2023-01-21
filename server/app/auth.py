from pprint import pprint

from flask import Blueprint, request
from flask_login import current_user, login_required, login_user, logout_user
from marshmallow import ValidationError
from werkzeug.security import check_password_hash, generate_password_hash
from sqlalchemy.exc import IntegrityError

from .database import db
from .models import LoginSchema, RegisterSchema, User, UserModel

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
        user = User(name=name, email=email, password=generate_password_hash(password, method="sha256"), active=True)
        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            response = {'message': f'Email is already registered'}, 400
        login_user(user)
        response = {"message": f"User {user.name} registered successfully", "user": user.name}
        return response, 201


@bp.post("/login")
def login():
    request_data = request.get_json()
    try:
        result = LoginSchema().load(request_data)
    except ValidationError as err:
        return err.messages.copy(), 400
    else:
        email: str = result["email"]
        password: str = result["password"]
        remember_me: bool = result["remember_me"]
        user = User.query.filter(User.email == email).first()
        if not user or not check_password_hash(user.password, password):
            return {"non_field_errors": ["Please check your login details and try again."]}, 400
        login_user(user, remember=remember_me)
        return {"message": "Logged In Successfully"}, 200


@bp.post("/logout")
@login_required
def logout():
    logout_user()
    return {"message": "Logged Out Successfully"}, 200


@bp.route("/user")
def get_user():
    if current_user.is_anonymous:
        return {}, 200
    user = UserModel.from_orm(current_user)
    return user.json(include={"name", "active", "created_at", "email", "uuid", "updated_at"}), 200
