import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.gcp_speech import transcribe_audio
from services.gcp_translate import translate_text
from services.gcp_vertex import generate_content
from config import db

content_bp = Blueprint("content", __name__)
content_collection = db["content"]

@content_bp.route("/voice-generate", methods=["POST"])
@jwt_required()
def voice_generate_content():
    try:
        user_id = get_jwt_identity()

        if "file" not in request.files:
            return jsonify({"error": "Audio file is required"}), 400

        audio_file = request.files["file"]
        print(audio_file)
        target_lang = request.form.get("language", "en")
        print(target_lang)
        mode = request.form.get("mode", "description")

        # Save temp file
        temp_path = os.path.join("temp", audio_file.filename)
        os.makedirs("temp", exist_ok=True)
        audio_file.save(temp_path)

        # 1. Speech → Text
        raw_text = transcribe_audio(temp_path)
        print(raw_text)

        # 2. Translate to English for AI processing
        translated_prompt = translate_text(raw_text, target_lang="en")
        print(translated_prompt)

        # 3. Generate AI content
        generated_en = generate_content(translated_prompt, "en", mode)
        print(generated_en)

        # 4. Translate back into user’s chosen language
        final_output = translate_text(generated_en, target_lang)
        print(final_output)

        # Save in MongoDB
        record = {
            "user_id": user_id,
            "prompt_voice": raw_text,
            "generated_text": final_output,
            "language": target_lang,
            "mode": mode
        }
        content_collection.insert_one(record)

        return jsonify({
            "message": "Voice content generated successfully",
            "transcribed_text": raw_text,
            "generated_text": final_output,
            "mode": mode,
            "language": target_lang
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

