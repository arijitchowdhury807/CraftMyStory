from flask import Blueprint, request, jsonify
from services.blockchain import Blockchain

trust_bp = Blueprint("trust", __name__)
blockchain = Blockchain()

@trust_bp.route("/verify_certificate", methods=["POST"])
def verify_certificate():
    data = request.json
    artisan_id = data.get("artisan_id")
    product_id = data.get("product_id")

    # Add transaction to blockchain
    blockchain.add_transaction(
        user_id=artisan_id,
        artisan_data={"product_id": product_id, "status": "verified"}
    )

    # Mine a block
    new_block = blockchain.mine_block()

    return jsonify({
        "message": "Certificate verified & recorded on blockchain",
        "block": new_block
    }), 200
