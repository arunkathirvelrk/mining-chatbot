from pymongo import MongoClient
from core.config import MONGO_URL, DB_NAME
from datetime import datetime, timedelta

# MongoDB connection
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

users_collection = db["users"]
documents_collection = db["documents"]
chat_collection = db["chat_history"]
otp_collection = db["otp"]  # 🔥 NEW COLLECTION FOR OTP

# ---------------- USER OPERATIONS ----------------

def create_user(user: dict):
    """
    Create user with default verification status
    """
    user["email"] = user["email"].lower().strip()
    user["is_verified"] = False  # 🔥 IMPORTANT FOR EMAIL VERIFICATION
    user["created_at"] = datetime.utcnow()
    return users_collection.insert_one(user)


def find_user(email: str):
    return users_collection.find_one(
        {"email": email.lower().strip()}
    )


def activate_user(email: str):
    """
    Activate user after OTP verification
    """
    return users_collection.update_one(
        {"email": email.lower().strip()},
        {
            "$set": {
                "is_verified": True,
                "verified_at": datetime.utcnow()
            }
        }
    )

# ---------------- OTP OPERATIONS (NEW) ----------------

def save_otp(email: str, otp: str):
    """
    Save OTP with 10 minutes expiry (upsert)
    """
    expiry_time = datetime.utcnow() + timedelta(minutes=10)

    return otp_collection.update_one(
        {"email": email.lower().strip()},
        {
            "$set": {
                "email": email.lower().strip(),
                "otp": otp,
                "expires_at": expiry_time,
                "created_at": datetime.utcnow()
            }
        },
        upsert=True
    )


def verify_user_otp(email: str, otp: str):
    """
    Verify OTP and check expiry
    """
    record = otp_collection.find_one(
        {"email": email.lower().strip()}
    )

    if not record:
        return False

    # Check OTP match
    if record.get("otp") != otp:
        return False

    # Check expiry
    if datetime.utcnow() > record.get("expires_at"):
        return False

    return True


def delete_otp(email: str):
    """
    Delete OTP after successful verification (security)
    """
    return otp_collection.delete_one(
        {"email": email.lower().strip()}
    )

# ---------------- DOCUMENT OPERATIONS ----------------

def save_document(doc: dict):
    return documents_collection.insert_one(doc)


def search_document(query: str):
    keywords = query.lower().split()

    for word in keywords:
        if len(word) > 3:
            result = documents_collection.find_one(
                {"content": {"$regex": word, "$options": "i"}}
            )
            if result:
                return result
    return None

# ---------------- CHAT HISTORY (SESSION SAFE) ----------------

def save_chat(
    email: str,
    chat_id: str,
    title: str,
    messages: list,
    source: str
):
    """
    Save or update a FULL chat session
    (same chat_id = same conversation)
    """
    return chat_collection.update_one(
        {
            "email": email.lower().strip(),
            "chat_id": chat_id
        },
        {
            "$set": {
                "title": title,
                "messages": messages,
                "source": source,
                "updated_at": datetime.utcnow()
            },
            "$setOnInsert": {
                "created_at": datetime.utcnow()
            }
        },
        upsert=True
    )


def get_chat_history(email: str):
    return list(
        chat_collection.find(
            {"email": email.lower().strip()},
            {"_id": 0}
        ).sort("updated_at", -1)
    )


def get_chat_by_id(email: str, chat_id: str):
    return chat_collection.find_one(
        {
            "email": email.lower().strip(),
            "chat_id": chat_id
        },
        {"_id": 0}
    )