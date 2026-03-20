from pymongo import MongoClient
from core.config import MONGODB_URL, DB_NAME

client = MongoClient(MONGODB_URL)
db = client[DB_NAME]

users_collection = db["users"]
documents_collection = db["documents"]
history_collection = db["chat_history"]
