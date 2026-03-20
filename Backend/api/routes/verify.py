from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database.crud import verify_user_otp, activate_user, delete_otp

router = APIRouter()

class VerifyEmailRequest(BaseModel):
    email: str
    otp: str

@router.post("/verify-email")
def verify_email(data: VerifyEmailRequest):
    # Check OTP validity
    is_valid = verify_user_otp(data.email, data.otp)

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OTP"
        )

    # Activate user account
    activate_user(data.email)

    # Delete OTP after success (security best practice)
    delete_otp(data.email)

    return {
        "message": "Email verified successfully. You can now login."
    }