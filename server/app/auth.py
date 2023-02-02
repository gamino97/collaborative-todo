from pprint import pprint


from flask import Blueprint, current_app, request, url_for
from flask_login import current_user, login_required, login_user, logout_user
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash
from flask_mail import Message
from .mail import mail

from app.schemas import ResetPasswordSchema, ResetPasswordTokenSchema

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
            response = {"message": f"Email is already registered"}, 400
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
def reset_password():
    request_data = request.get_json()
    try:
        result = ResetPasswordSchema().load(request_data)
    except ValidationError as err:
        return err.messages.copy(), 400
    email: str = result["email"]
    user = User.query.filter(User.email == email).first()
    if user:
        send_reset_email(user)
    return {
        "message": """If your account exists, a new password was sent to your registered email address.
If you do not receive an email, it may be because you are banned, your account is not activated, or you are not allowed to change your password. Contact admin if any of those reasons apply. Also, check your spam filter."""
    }


@bp.get("/reset-password-token/<token>")
def reset_password_token_verify(token: str):
    if current_user.is_authenticated:
        return {"valid": False}
    user = User.verify_reset_token(token)
    if user is None:
        return {"valid": "That is an invalid or expired token"}
    return {"valid": True}


@bp.post("/reset-password-token/<token>")
def reset_password_token(token):
    if current_user.is_authenticated:
        return {"message": False}
    user = User.verify_reset_token(token)
    if user is None:
        return {"message": "That is an invalid or expired token"}
    try:
        result = ResetPasswordTokenSchema().load(request.get_json())
    except ValidationError as err:
        return err.messages.copy(), 400
    hashed_password = generate_password_hash(result["new_password"], method="sha256")
    user.password = hashed_password
    db.session.commit()
    return {"message": "Your password has been updated! You are now able to log in"}
