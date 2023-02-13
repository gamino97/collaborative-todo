import http

from apiflask import APIBlueprint, abort
from flask import current_app, request
from flask.typing import ResponseReturnValue
from flask_login import current_user, login_user, logout_user
from flask_mail import Message
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from app.schemas import (
    LoginSchema,
    RegisterSchema,
    ResetPasswordSchema,
    ResetPasswordTokenSchema,
    UserSchema,
)

from .database import db
from .mail import mail
from .models import User

bp = APIBlueprint("auth", __name__, url_prefix="/api/auth")


@bp.post("/register")
def register() -> ResponseReturnValue:
    request_data = request.get_json()
    try:
        result = RegisterSchema().load(request_data)
    except ValidationError as err:
        abort(400, description=err.messages.copy())
    else:
        email: str = result["email"]
        password: str = result["password"]
        name: str = result["name"]
        user = User(name=name, email=email, password=generate_password_hash(password, method="sha256"), active=True)
        try:
            db.session.add(user)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            abort(400, description={"email": ["Email is already registered."]})
        login_user(user)
        user_schema = UserSchema()
        response = {
            "message": f"User {user.name} registered successfully",
            "user": user_schema.dump(user),
        }
        return response, 201


@bp.post("/login")
@bp.input(LoginSchema)
@bp.doc(responses={400: "Invalid Credentials"})
@bp.output(UserSchema)
def login(data) -> ResponseReturnValue:
    email: str = data["email"]
    password: str = data["password"]
    remember_me: bool = data["remember_me"]
    user = User.query.filter(User.email == email).first()
    if not user or not check_password_hash(user.password, password):
        abort(400, message="Please check your login details and try again.")
    login_user(user, remember=remember_me)
    user_schema = UserSchema()
    return user
    # request_data = request.get_json()
    # try:
    #     result = LoginSchema().load(request_data)
    # except ValidationError as err:
    #     abort(400, detail=err.messages.copy())
    # else:
    #     email: str = result["email"]
    #     password: str = result["password"]
    #     remember_me: bool = result["remember_me"]
    #     user = User.query.filter(User.email == email).first()
    #     if not user or not check_password_hash(user.password, password):
    #         abort(400, detail="Please check your login details and try again.")
    #     login_user(user, remember=remember_me)
    #     user_schema = UserSchema()
    #     return user_schema.dump(user), 200


@bp.post("/logout")
def logout() -> ResponseReturnValue:
    logout_user()
    return {"message": "Logged Out Successfully"}, 200


@bp.route("/user")
def get_user() -> ResponseReturnValue:
    if current_user.is_anonymous:
        return {}, 200
    user_schema = UserSchema()
    return user_schema.dump(current_user), 200


# https://medium.com/@stevenrmonaghan/password-reset-with-flask-mail-protocol-ddcdfc190968
# https://github.com/CoreyMSchafer/code_snippets/blob/master/Python/Flask_Blog/10-Password-Reset-Email/flaskblog/routes.py
def frontend_url(url):
    server_name = current_app.config["SERVER_NAME"]
    if current_app.config["DEBUG"]:
        server_name = "dev.localhost:5173"
    return f"{current_app.config['PREFERRED_URL_SCHEME']}://{server_name}{url}/"


def send_reset_email(user: User):
    token = user.get_reset_token()
    msg = Message("Password Reset Request", recipients=[user.email])
    msg.body = f"""To reset your password, visit the following link:
{frontend_url(f'/reset-password-token/{token}')}
If you did not make this request then simply ignore this email and no changes will be made.
"""
    mail.send(msg)


@bp.post("/reset-password")
def reset_password() -> ResponseReturnValue:
    if current_user.is_authenticated:
        abort(http.HTTPStatus.UNAUTHORIZED)
    request_data = request.get_json()
    try:
        result = ResetPasswordSchema().load(request_data)
    except ValidationError as err:
        return abort(400, description=err.messages.copy())
    email: str = result["email"]
    user = User.query.filter(User.email == email).first()
    if user:
        send_reset_email(user)
    return {
        "message": """If your account exists, a new password was sent to your registered email address.
If you do not receive an email, it may be because you are banned, your account is not activated, or you are not allowed to change your password. Contact admin if any of those reasons apply. Also, check your spam filter."""
    }


@bp.get("/reset-password-token/<token>")
def reset_password_token_verify(token: str) -> ResponseReturnValue:
    if current_user.is_authenticated:
        return {"valid": False}
    user = User.verify_reset_token(token)
    if user is None:
        return {"valid": "That is an invalid or expired token"}
    return {"valid": True}


@bp.post("/reset-password-token/<token>")
def reset_password_token(token) -> ResponseReturnValue:
    if current_user.is_authenticated:
        abort(400, description={"message": False})
    user = User.verify_reset_token(token)
    if user is None:
        abort(400, description={"message": "That is an invalid or expired token"})
    try:
        result = ResetPasswordTokenSchema().load(request.get_json())
    except ValidationError as err:
        return abort(400, description=err.messages.copy())
    hashed_password = generate_password_hash(result["new_password"], method="sha256")
    user.password = hashed_password
    db.session.commit()
    return {"message": "Your password has been updated! You are now able to log in"}
