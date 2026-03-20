import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB configuration
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "mining_chatbot")

# Optional Gemini key (kept for future use)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
