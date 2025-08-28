import os
from datetime import timedelta
from pymongo import MongoClient
from google.cloud import aiplatform
from google.oauth2 import service_account
import firebase_admin
from firebase_admin import credentials as fb_credentials

from dotenv import load_dotenv
load_dotenv()  # Load values from .env

class Config:
    # ------------------ DATABASE ------------------
    MONGO_URI = os.getenv("MONGO_URI")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)

    # ------------------ GOOGLE CLOUD ------------------
    GOOGLE_PROJECT_ID = os.getenv("PROJECT_ID", "craftmystory")
    GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "secrets/gcp_key.json")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")  # Optional (useful for REST APIs)
    FIRESTORE_DB = os.getenv("FIRESTORE_DB", "craftmystory-db")

    # ------------------ STRIPE ------------------
    STRIPE_SECRET = os.getenv("STRIPE_SECRET", "sk_test_...")

# ------------------ MongoDB ------------------
client = MongoClient(Config.MONGO_URI)
db = client.get_database()

# ------------------ Firebase ------------------
if not firebase_admin._apps:
    fb_cred = fb_credentials.Certificate(Config.GOOGLE_APPLICATION_CREDENTIALS)
    firebase_admin.initialize_app(fb_cred)

# ------------------ Vertex AI ------------------
vertex_credentials = service_account.Credentials.from_service_account_file(
    Config.GOOGLE_APPLICATION_CREDENTIALS
)

aiplatform.init(
    project=Config.GOOGLE_PROJECT_ID,
    location="us-central1",   # Imagen & genAI models
    credentials=vertex_credentials
)
