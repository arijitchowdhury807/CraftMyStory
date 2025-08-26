# # config.py
# import os
# import firebase_admin
# from firebase_admin import credentials, auth

# # Initialize Firebase Admin SDK once
# cred = credentials.Certificate("secrets/gcp_key.json")
# if not firebase_admin._apps:
#     firebase_admin.initialize_app(cred)

# class Config:
#     GOOGLE_PROJECT_ID = os.getenv("GOOGLE_PROJECT_ID", "craftmystory")
#     GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "secrets/gcp_key.json")
#     FIRESTORE_DB = os.getenv("FIRESTORE_DB", "craftmystory-db")
#     STRIPE_SECRET = os.getenv("STRIPE_SECRET", "sk_test_...")

import os
from datetime import timedelta
from pymongo import MongoClient

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/craftmystory")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")  # Change in prod
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

# Initialize MongoDB once
client = MongoClient(Config.MONGO_URI)
db = client.get_database()
