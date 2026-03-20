from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from database.crud import users_collection
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta

router = APIRouter()


class ForgotPasswordRequest(BaseModel):
    email: EmailStr  # ✅ validates email format automatically


# 🔧 Gmail Config (Use App Password ONLY)
SMTP_EMAIL = "arunkumar.ct22@bitsathy.ac.in"
SMTP_PASSWORD = "xojz bxdk rvzq olep"  # App password


@router.post("/forgot-password")
def forgot_password(data: ForgotPasswordRequest):
    email = data.email.lower().strip()

    # 🔍 Check user exists (case-safe)
    user = users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    # 🔢 Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))

    # ⏰ OTP expiry (10 minutes)
    expiry = datetime.utcnow() + timedelta(minutes=10)

    # 💾 Save OTP in MongoDB
    users_collection.update_one(
        {"email": email},
        {
            "$set": {
                "otp": otp,
                "otp_expiry": expiry
            }
        }
    )

    # 📧 Email Content
    subject = "MineLex Password Reset OTP"
    body = f"""
Hello,

Your OTP for MineLex password reset is: {otp}

This OTP is valid for 10 minutes.
Do NOT share this OTP with anyone.

Regards,
MineLex Security Team
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SMTP_EMAIL
    msg["To"] = email

    try:
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        server.sendmail(SMTP_EMAIL, email, msg.as_string())
        server.quit()
    except Exception as e:
        print("Email Error:", e)
        raise HTTPException(status_code=500, detail="Failed to send OTP email")

    return {
        "success": True,
        "message": "OTP sent to your email"
    }