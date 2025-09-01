from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import db
from bson import ObjectId
from datetime import datetime

marketplace_bp = Blueprint("marketplace", __name__)

# ------------------ CREATE ------------------
@marketplace_bp.route("/card", methods=["POST"])
@jwt_required()
def add_card():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        card = {
            "user_id": user_id,
            "title": data.get("title"),
            "description": data.get("description"),
            "image_url": data.get("image_url"),
            "price": data.get("price"),
            "created_at": datetime.utcnow()
        }

        result = db.cards.insert_one(card)

        return jsonify({
            "message": "Card added successfully",
            "card_id": str(result.inserted_id)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------ READ ------------------
@marketplace_bp.route("/cards", methods=["GET"])
def get_cards():
    try:
        cards = list(db.cards.find())
        for card in cards:
            card["_id"] = str(card["_id"])
        return jsonify(cards), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@marketplace_bp.route("/my-cards", methods=["GET"])
@jwt_required()
def get_my_cards():
    try:
        user_id = get_jwt_identity()
        cards = list(db.cards.find({"user_id": user_id}))
        for card in cards:
            card["_id"] = str(card["_id"])
        return jsonify(cards), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------ UPDATE ------------------
@marketplace_bp.route("/card/<card_id>", methods=["PUT"])
@jwt_required()
def update_card(card_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        card = db.cards.find_one({"_id": ObjectId(card_id)})

        if not card:
            return jsonify({"error": "Card not found"}), 404

        if card["user_id"] != user_id:
            return jsonify({"error": "Unauthorized"}), 403

        update_fields = {
            "title": data.get("title", card["title"]),
            "description": data.get("description", card["description"]),
            "image_url": data.get("image_url", card.get("image_url")),
            "price": data.get("price", card.get("price")),
        }

        db.cards.update_one(
            {"_id": ObjectId(card_id)},
            {"$set": update_fields}
        )

        return jsonify({"message": "Card updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------ DELETE ------------------
@marketplace_bp.route("/card/<card_id>", methods=["DELETE"])
@jwt_required()
def delete_card(card_id):
    try:
        user_id = get_jwt_identity()
        card = db.cards.find_one({"_id": ObjectId(card_id)})

        if not card:
            return jsonify({"error": "Card not found"}), 404

        if card["user_id"] != user_id:
            return jsonify({"error": "Unauthorized"}), 403

        db.cards.delete_one({"_id": ObjectId(card_id)})
        return jsonify({"message": "Card deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
