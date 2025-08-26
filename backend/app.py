# from flask import Flask, request, jsonify
# from google.cloud import firestore
# from config import auth

# app = Flask(__name__)
# db = firestore.Client()

# from functools import wraps

# # def firebase_required(f):
# #     @wraps(f)
# #     def decorated_function(*args, **kwargs):
# #         user = verify_token()
# #         if not user:
# #             return jsonify({"error": "Unauthorized"}), 401
# #         return f(user, *args, **kwargs)
# #     return decorated_function

# # # Middleware to check Firebase ID token
# # def verify_token():
# #     auth_header = request.headers.get("Authorization")
# #     if not auth_header:
# #         return None
# #     try:
# #         id_token = auth_header.split("Bearer ")[1]
# #         decoded_token = auth.verify_id_token(id_token)
# #         return decoded_token
# #     except Exception as e:
# #         print("Auth Error:", e)
# #         return None

# @app.route('/add_artisan', methods=['POST'])
# # @firebase_required
# def add_artisan():
#     # user = verify_token()
#     # if not user:
#     #     return jsonify({"error": "Unauthorized"}), 401

#     data = request.json
#     name = data.get('name')
#     craft = data.get('craft')

#     doc_ref = db.collection('artisans').add({
#         'name': name,
#         'craft': craft,
#         # 'created_by': user['uid']
#     })

#     return jsonify({"message": "Artisan added!", "id": doc_ref[1].id})

# @app.route('/artisans', methods=['GET'])
# # @firebase_required
# def get_artisans():
#     # user = verify_token()
#     # if not user:
#     #     return jsonify({"error": "Unauthorized"}), 401

#     artisans_ref = db.collection('artisans')
#     docs = artisans_ref.stream()
#     artisans = [{"id": doc.id, **doc.to_dict()} for doc in docs]
#     return jsonify(artisans)

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from pymongo import MongoClient
import os

# Blockchain service
from services.blockchain import Blockchain

app = Flask(__name__)

from routes.trust import trust_bp
app.register_blueprint(trust_bp, url_prefix="/trust")
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env

# Config
app.config["JWT_SECRET_KEY"] = "supersecretkey"  # change in production
MONGO_URI = os.getenv("MONGO_URI")

# Setup
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
client = MongoClient(MONGO_URI)
db = client["craftmystory"]
users_collection = db["users"]
artisans_collection = db["artisans"]

# Blockchain instance
blockchain = Blockchain()

# -------------------------
# Signup (user + artisan + blockchain)
# -------------------------
@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    artisan_data = {
        "name": data.get("name"),
        "craft": data.get("craft"),
        "location": data.get("location")
    }

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 400

    # Save user in MongoDB
    hashed_pw = bcrypt.generate_password_hash(password).decode("utf-8")
    users_collection.insert_one({"email": email, "password": hashed_pw})
    artisans_collection.insert_one({"email": email, **artisan_data})

    # Record on blockchain
    blockchain.add_transaction(user_id=email, artisan_data=artisan_data)
    blockchain.mine_block()

    # Generate token
    access_token = create_access_token(identity=email)
    return jsonify({"message": "Signup successful", "token": access_token}), 201


# -------------------------
# Login
# -------------------------
@app.route("/login", methods=["POST"])
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
@app.route("/me", methods=["GET"])
@jwt_required()
def me():
    current_user = get_jwt_identity()
    artisan = artisans_collection.find_one({"email": current_user}, {"_id": 0, "password": 0})
    return jsonify({"user": current_user, "artisan_profile": artisan}), 200


# -------------------------
# Run App
# -------------------------
if __name__ == "__main__":
    app.run(debug=True)
