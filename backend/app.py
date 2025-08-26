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

from flask import Flask
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Blockchain
from services.blockchain import Blockchain

# Blueprints
from routes.auth import auth_bp
from routes.trust import trust_bp
from routes.content import content_bp
from routes.test_route import test_bp

load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "supersecretkey")

# Setup
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
blockchain = Blockchain()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(trust_bp, url_prefix="/trust")
app.register_blueprint(content_bp, url_prefix="/content")
app.register_blueprint(test_bp, url_prefix="/test")

if __name__ == "__main__":
    app.run(debug=True)
