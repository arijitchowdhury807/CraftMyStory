from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from config import db
import os

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

# Setup Mongo
users_collection = db["users"]
artisans_collection = db["artisans"]

# -------------------------
# Signup
# -------------------------
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    artisan_data = {
        "name": data.get("name"),
        "craft": data.get("craft"),
        "location": data.get("location"),
    }

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    # Save user
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    users_collection.insert_one({"email": email, "password": hashed_pw})
    artisans_collection.insert_one({"email": email, **artisan_data})

    access_token = create_access_token(identity=email)
    return jsonify({"message": "Signup successful", "token": access_token}), 201


# -------------------------
# Login
# -------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})
    if not user or not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=email)
    return jsonify({"message": "Login successful", "token": access_token}), 200


# -------------------------
# Profile (JWT Protected)
# -------------------------
@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    current_user = get_jwt_identity()
    artisan = artisans_collection.find_one({"email": current_user}, {"_id": 0, "password": 0})
    return jsonify({"user": current_user, "artisan_profile": artisan}), 200
