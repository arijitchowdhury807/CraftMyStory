# import os
# from flask import Blueprint, request, jsonify
# import vertexai
# from google.cloud import storage
# from vertexai.generative_models import GenerativeModel   # ✅ use new import
# from datetime import timedelta

# media_bp = Blueprint("media_bp", __name__)

# PROJECT_ID = os.getenv("PROJECT_ID", "craftmystory")
# LOCATION = "us-central1"
# BUCKET_NAME = os.getenv("BUCKET_NAME", "craftmystory-reels")

# # ---- Helper: Upload to GCS ----
# def upload_to_gcs(local_file, bucket_name, dest_blob):
#     """Upload file to GCS and return gs:// URI + signed URL"""
#     storage_client = storage.Client()
#     bucket = storage_client.bucket(bucket_name)
#     blob = bucket.blob(dest_blob)
#     blob.upload_from_filename(local_file)

#     # 1-hour signed URL for testing
#     signed_url = blob.generate_signed_url(expiration=timedelta(hours=1))

#     return f"gs://{bucket_name}/{dest_blob}", signed_url


# # ---- Route: Generate Reel ----
# @media_bp.route("/generate_reel", methods=["POST"])
# def generate_reel():
#     try:
#         prompt = request.form.get("prompt")
#         image_file = request.files.get("image")

#         if not prompt or not image_file:
#             return jsonify({"error": "Both prompt and image required"}), 400

#         # Save uploaded image temporarily
#         tmp_dir = os.path.join(os.getcwd(), "tmp")
#         os.makedirs(tmp_dir, exist_ok=True)
#         local_path = os.path.join(tmp_dir, image_file.filename)
#         image_file.save(local_path)

#         # Upload to GCS
#         gcs_uri, image_url = upload_to_gcs(
#             local_path, BUCKET_NAME, f"uploads/{image_file.filename}"
#         )

#         # Init Vertex AI
#         vertexai.init(project=PROJECT_ID, location=LOCATION)

#         # ✅ Load Veo model for video generation
#         model = GenerativeModel("veo-2.0-generate-001")

#         # ---- Generate video with prompt + reference image ----
#         result = model.generate_content(
#             [
#                 {
#                     "role": "user",
#                     "parts": [
#                         {"text": prompt},
#                         {
#                             "file_data": {
#                                 "mime_type": "image/png",   # adjust if JPEG
#                                 "file_uri": gcs_uri,
#                             }
#                         },
#                     ],
#                 }
#             ],
#             generation_config={
#                 "response_mime_type": "video/mp4"
#             },
#         )
#         # 🔍 Debug log the full response for inspection
#         try:
#             print("=== RAW MODEL RESPONSE ===")
#             print(result.to_dict())
#         except Exception as e:
#             print("Could not serialize result:", e)

#         # Extract reel gs:// path
#         reel_gcs = None
#         for cand in getattr(result, "candidates", []):
#             for part in cand.content.parts:
#                 if getattr(part, "file_data", None) and "video" in part.file_data.mime_type:
#                     reel_gcs = part.file_data.file_uri

#         if not reel_gcs:
#             return jsonify({"error": "No reel generated"}), 500

#         # Convert gs:// → public URL
#         reel_url = reel_gcs.replace("gs://", "https://storage.googleapis.com/")

#         return jsonify({
#             "reel_url": reel_url,
#             "input_image_url": image_url
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

import os
import uuid
import random
from flask import Blueprint, request, jsonify, send_file

media_bp = Blueprint("media_bp", __name__)

# Folder to store placeholder videos
PLACEHOLDER_FOLDER = os.path.join(os.getcwd(), "placeholders_reel")

# Folder to store uploaded images
UPLOAD_FOLDER = os.path.join(os.getcwd(), "backend_storage", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Folder to store generated reels
GENERATED_FOLDER = os.path.join(os.getcwd(), "backend_storage", "generated_reels")
os.makedirs(GENERATED_FOLDER, exist_ok=True)

@media_bp.route("/generate_reel", methods=["POST"])
def generate_reel():
    """
    Mock route to simulate AI-generated reels.
    Accepts 'prompt' + image file, returns placeholder video URL.
    """
    try:
        prompt = request.form.get("prompt")
        image_file = request.files.get("image")

        if not prompt or not image_file:
            return jsonify({"error": "Both prompt and image required"}), 400

        # Save uploaded image
        image_filename = f"{uuid.uuid4().hex}_{image_file.filename}"
        image_path = os.path.join(UPLOAD_FOLDER, image_filename)
        image_file.save(image_path)
        image_url = f"/uploads/{image_filename}"  # mock URL for frontend

        # Pick a random placeholder video
        placeholder_videos = [
            f for f in os.listdir(PLACEHOLDER_FOLDER) if f.endswith(".mp4")
        ]
        if not placeholder_videos:
            return jsonify({"error": "No placeholder videos found"}), 500

        selected_video = random.choice(placeholder_videos)
        new_video_filename = f"reel_{uuid.uuid4().hex}.mp4"
        new_video_path = os.path.join(GENERATED_FOLDER, new_video_filename)

        # Copy placeholder video to generated folder
        with open(os.path.join(PLACEHOLDER_FOLDER, selected_video), "rb") as src:
            with open(new_video_path, "wb") as dst:
                dst.write(src.read())

        video_url = f"/generated_reels/{new_video_filename}"  # mock URL for frontend

        return jsonify({
            "reel_url": video_url,
            "input_image_url": image_url,
            "message": "Reel generated successfully (mock)"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Optional route to serve uploaded/generated files locally
@media_bp.route("/uploads/<filename>")
def serve_upload(filename):
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    return send_file(file_path, as_attachment=False)

@media_bp.route("/generated_reels/<filename>")
def serve_generated_reel(filename):
    file_path = os.path.join(GENERATED_FOLDER, filename)
    return send_file(file_path, as_attachment=False)
