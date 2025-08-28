import os
from flask import Blueprint, request, jsonify
import vertexai
from google.cloud import storage
from vertexai.generative_models import GenerativeModel   # ✅ use new import
from datetime import timedelta

media_bp = Blueprint("media_bp", __name__)

PROJECT_ID = os.getenv("PROJECT_ID", "craftmystory")
LOCATION = "us-central1"
BUCKET_NAME = os.getenv("BUCKET_NAME", "craftmystory-reels")

# ---- Helper: Upload to GCS ----
def upload_to_gcs(local_file, bucket_name, dest_blob):
    """Upload file to GCS and return gs:// URI + signed URL"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(dest_blob)
    blob.upload_from_filename(local_file)

    # 1-hour signed URL for testing
    signed_url = blob.generate_signed_url(expiration=timedelta(hours=1))

    return f"gs://{bucket_name}/{dest_blob}", signed_url


# ---- Route: Generate Reel ----
@media_bp.route("/generate_reel", methods=["POST"])
def generate_reel():
    try:
        prompt = request.form.get("prompt")
        image_file = request.files.get("image")

        if not prompt or not image_file:
            return jsonify({"error": "Both prompt and image required"}), 400

        # Save uploaded image temporarily
        tmp_dir = os.path.join(os.getcwd(), "tmp")
        os.makedirs(tmp_dir, exist_ok=True)
        local_path = os.path.join(tmp_dir, image_file.filename)
        image_file.save(local_path)

        # Upload to GCS
        gcs_uri, image_url = upload_to_gcs(
            local_path, BUCKET_NAME, f"uploads/{image_file.filename}"
        )

        # Init Vertex AI
        vertexai.init(project=PROJECT_ID, location=LOCATION)

        # ✅ Load Veo model for video generation
        model = GenerativeModel("veo-2.0-generate-001")

        # ---- Generate video with prompt + reference image ----
        result = model.generate_content(
            [
                {
                    "role": "user",
                    "parts": [
                        {"text": prompt},
                        {
                            "file_data": {
                                "mime_type": "image/png",   # adjust if JPEG
                                "file_uri": gcs_uri,
                            }
                        },
                    ],
                }
            ],
            generation_config={
                "response_mime_type": "video/mp4"
            },
        )
        # 🔍 Debug log the full response for inspection
        try:
            print("=== RAW MODEL RESPONSE ===")
            print(result.to_dict())
        except Exception as e:
            print("Could not serialize result:", e)

        # Extract reel gs:// path
        reel_gcs = None
        for cand in getattr(result, "candidates", []):
            for part in cand.content.parts:
                if getattr(part, "file_data", None) and "video" in part.file_data.mime_type:
                    reel_gcs = part.file_data.file_uri

        if not reel_gcs:
            return jsonify({"error": "No reel generated"}), 500

        # Convert gs:// → public URL
        reel_url = reel_gcs.replace("gs://", "https://storage.googleapis.com/")

        return jsonify({
            "reel_url": reel_url,
            "input_image_url": image_url
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
