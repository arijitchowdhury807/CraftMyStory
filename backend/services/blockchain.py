import hashlib
import json
import time
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()  # take environment variables from .env

class Blockchain:
    def __init__(self):
        # Connect to MongoDB
        MONGO_URI = os.getenv("MONGO_URI")
        client = MongoClient(MONGO_URI)
        db = client["craftmystory"]
        self.blocks_collection = db["blocks"]

        # Load chain from DB
        self.chain = list(self.blocks_collection.find().sort("index", 1))
        self.pending_transactions = []

        # Create genesis block only if collection is empty
        if not self.chain:
            genesis_block = self.create_block(previous_hash="0")
            # insert only if truly new
            self.blocks_collection.insert_one(genesis_block)
            self.chain.append(genesis_block)  # keep it in memory

    def hash_block(self, block):
        """
        Creates a SHA-256 hash of a block.
        """
        # Exclude the "hash" field itself when hashing
        block_copy = {k: v for k, v in block.items() if k != "hash"}
        return hashlib.sha256(json.dumps(block_copy, sort_keys=True).encode()).hexdigest()

    def get_last_block(self):
        """
        Returns the last block in the chain.
        """
        if self.chain:
            return self.chain[-1]
        return None

    def create_block(self, previous_hash):
        """
        Creates a new block, hashes it, and adds it to the chain + DB.
        """
        block = {
            "index": len(self.chain) + 1,
            "timestamp": time.time(),
            "transactions": self.pending_transactions,
            "previous_hash": previous_hash
        }

        # Generate block hash
        block["hash"] = self.hash_block(block)

        # Reset pending transactions
        self.pending_transactions = []

        # Append to in-memory chain
        self.chain.append(block)

        # Save to MongoDB
        self.blocks_collection.insert_one(block)

        return block

    def add_transaction(self, user_id, artisan_data):
        """
        Adds a new transaction to the list of pending transactions.
        """
        transaction = {
            "user_id": user_id,
            "artisan_hash": hashlib.sha256(
                json.dumps(artisan_data, sort_keys=True).encode()
            ).hexdigest()
        }
        self.pending_transactions.append(transaction)
        return transaction

    def mine_block(self):
        """
        Mines a new block by including all pending transactions.
        """
        last_block = self.get_last_block()
        prev_hash = last_block["hash"] if last_block else "0"
        return self.create_block(previous_hash=prev_hash)

    def verify_chain(self):
        """
        Verifies the integrity of the blockchain.
        """
        for i in range(1, len(self.chain)):
            prev_block = self.chain[i - 1]
            current_block = self.chain[i]

            if current_block["previous_hash"] != self.hash_block(prev_block):
                return False
            if current_block["hash"] != self.hash_block(current_block):
                return False
        return True
