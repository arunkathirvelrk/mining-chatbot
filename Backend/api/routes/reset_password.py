from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from database.crud import users_collection
from passlib.context import CryptContext
from datetime import datetime

router = APIRouter()

# 🔒 Use bcrypt safely
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class ResetPasswordRequest(BaseModel):
    email: str
    otp: str = Field(..., min_length=4, max_length=10)
    new_password: str = Field(..., min_length=6, max_length=128)


@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest):
    try:
        # 🧹 Normalize email
        email = data.email.lower().strip()

        # 🔍 Find user in MongoDB
        user = users_collection.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # 🔐 Get OTP fields safely
        otp_in_db = user.get("otp")
        otp_expiry = user.get("otp_expiry")

        # ❌ If OTP not generated
        if not otp_in_db or not otp_expiry:
            raise HTTPException(status_code=400, detail="OTP not generated")

        # 🔢 Compare OTP as string (Mongo may store as str/int)
        if str(otp_in_db).strip() != str(data.otp).strip():
            raise HTTPException(status_code=400, detail="Invalid OTP")

        # ⏰ Validate expiry safely
        if not isinstance(otp_expiry, datetime):
            raise HTTPException(status_code=400, detail="Invalid OTP expiry format")

        if datetime.utcnow() > otp_expiry:
            raise HTTPException(status_code=400, detail="OTP expired")

        # 🔥 VERY IMPORTANT FIX: bcrypt supports only 72 bytes
        password_bytes = data.new_password.encode("utf-8")

        if len(password_bytes) > 72:
            # Truncate safely to avoid bcrypt crash
            safe_password = password_bytes[:72].decode("utf-8", errors="ignore")
        else:
            safe_password = data.new_password

        # 🔒 Hash password (crash-protected)
        try:
            hashed_password = pwd_context.hash(safe_password)
        except Exception as hash_error:
            print("HASHING ERROR:", hash_error)
            raise HTTPException(
                status_code=500,
                detail="Password hashing failed (bcrypt issue)"
            )

        # 🔄 Update password and remove OTP fields
        result = users_collection.update_one(
            {"email": email},
            {
                "$set": {
                    "password": hashed_password,
                    "updated_at": datetime.utcnow()
                },
                "$unset": {
                    "otp": "",
                    "otp_expiry": ""
                }
            }
        )

        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Password update failed")

        return {
            "success": True,
            "message": "Password reset successful"
        }

    except HTTPException:
        raise

    except Exception as e:
        # 🔥 This will print real error in terminal (very useful for debugging)
        print("RESET PASSWORD CRITICAL ERROR:", str(e))
        raise HTTPException(
            status_code=500,
            detail="Internal server error during password reset"
        )