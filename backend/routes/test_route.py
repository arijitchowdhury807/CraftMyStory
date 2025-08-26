from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from services.gcp_speech import transcribe_audio
from services.gcp_translate import translate_text
from services.gcp_vertex import generate_content
from config import db
import os

test_bp = Blueprint("test", __name__)
content_collection = db["content"]

@test_bp.route("/test-voice-content", methods=["POST"])
def test_voice_content():
    try:
        # Accept file + parameters
        audio_file = request.files.get("file")
        target_lang = request.form.get("language", "en")
        mode = request.form.get("mode", "description")
        user_id = request.form.get("user_id", "test_user")  # For testing

        if not audio_file:
            return jsonify({"error": "Audio file is required"}), 400

        # Save temp file
        temp_path = os.path.join("temp", audio_file.filename)
        os.makedirs("temp", exist_ok=True)
        audio_file.save(temp_path)

        # 1️⃣ Speech → Text
        raw_text = transcribe_audio(temp_path)

        # 2️⃣ Translate to English for AI processing
        translated_prompt = translate_text(raw_text, target_lang="en")

        # 3️⃣ Generate AI content
        generated_en = generate_content(translated_prompt, "en", mode)

        # 4️⃣ Translate back into user’s chosen language
        final_output = translate_text(generated_en, target_lang)

        # 5️⃣ Save in MongoDB
        record = {
            "user_id": user_id,
            "prompt_voice": raw_text,
            "generated_text": final_output,
            "language": target_lang,
            "mode": mode
        }
        content_collection.insert_one(record)

        return jsonify({
            "message": "Test content generated successfully",
            "transcribed_text": raw_text,
            "generated_text": final_output,
            "mode": mode,
            "language": target_lang
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
