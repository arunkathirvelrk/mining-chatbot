from fastapi import APIRouter, HTTPException
from schemas.login import LoginRequest
from database.crud import find_user
from passlib.context import CryptContext

router = APIRouter()

# 🔒 bcrypt context (same as reset password)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/login")
def login(data: LoginRequest):
    # 🧹 Normalize email (VERY IMPORTANT for MongoDB match)
    email = data.email.lower().strip()
    password = data.password

    # 🔍 Find user in MongoDB
    user = find_user(email)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    stored_password = user.get("password", "")

    # 🔥 CRITICAL FIX: Support BOTH plain + hashed passwords
    try:
        # Case 1: New users / reset password users (bcrypt hashed)
        if stored_password.startswith("$2b$") or stored_password.startswith("$2a$"):
            is_valid = pwd_context.verify(password, stored_password)

        # Case 2: Old users (plain text password in DB)
        else:
            is_valid = (password == stored_password)

            # 🔒 OPTIONAL: Auto-upgrade plain password to hashed (recommended)
            if is_valid:
                new_hashed = pwd_context.hash(password)
                from database.crud import users_collection
                users_collection.update_one(
                    {"email": email},
                    {"$set": {"password": new_hashed}}
                )

    except Exception as e:
        print("LOGIN ERROR:", e)
        raise HTTPException(status_code=500, detail="Login verification failed")

    if not is_valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "role": user.get("role", "user"),
        "email": user.get("email")
    }