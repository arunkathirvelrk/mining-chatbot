from fastapi import APIRouter, HTTPException
from schemas.register import RegisterRequest
from database.crud import create_user, find_user, save_otp
from passlib.context import CryptContext  # 🔥 IMPORTANT (for password hashing)
import random
import smtplib
from email.mime.text import MIMEText
from datetime import datetime

router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def generate_otp():
    return str(random.randint(100000, 999999))


# 📩 Send OTP Email (HARDCODED SMTP - No .env needed)
def send_otp_email(to_email: str, otp: str):
    sender_email = "arunkumar.ct22@bitsathy.ac.in"
    sender_password = "xojz bxdk rvzq olep"
    # 🔥 CHANGE THESE TWO VALUES


    subject = "MineLex - Email Verification OTP"
    body = f"""
Welcome to MineLex!

Your Email Verification OTP is: {otp}

This OTP is valid for 10 minutes.
Do not share this code with anyone.

- MineLex Team
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = to_email

    try:
        # Gmail SMTP Server
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.ehlo()          # Important for Gmail
        server.starttls()
        server.ehlo()          # Prevents 535 authentication error
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()

        print(f"✅ OTP sent successfully to {to_email}")

    except smtplib.SMTPAuthenticationError:
        raise HTTPException(
            status_code=500,
            detail="Email authentication failed. Use Gmail App Password, not your normal password."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Email send failed: {str(e)}"
        )


# 🧾 REGISTER API (Username + Email + Password + OTP)
@router.post("/register")
def register(data: RegisterRequest):
    # 🔎 Normalize email
    email = data.email.lower().strip()

    # Check if user already exists
    existing_user = find_user(email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User already exists"
        )

    # 🔐 Hash password securely
    hashed_password = hash_password(data.password)

    # 👤 Create user object for MongoDB
    user_data = {
        "username": data.username.strip(),
        "email": email,
        "password": hashed_password,
        "role": data.role if hasattr(data, "role") else "user",
        "is_verified": False,  # Important for email verification
        "created_at": datetime.utcnow()
    }

    # 💾 Save user in MongoDB
    create_user(user_data)

    # 🔢 Generate OTP
    otp = generate_otp()

    # 💾 Save OTP in otp collection (MongoDB)
    save_otp(email, otp)

    # 📩 Send OTP to user's email
    send_otp_email(email, otp)

    return {
        "message": "User registered successfully. OTP sent to your email for verification."
    }