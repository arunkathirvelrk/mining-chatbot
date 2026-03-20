from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter()

# 🔴 PUT YOUR GOOGLE CLIENT ID HERE
GOOGLE_CLIENT_ID = "#"


class GoogleToken(BaseModel):
    token: str


@router.post("/google-login")
def google_login(data: GoogleToken):
    try:
        # Verify Google token
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        email = idinfo.get("email")
        name = idinfo.get("name")
        picture = idinfo.get("picture")

        if not email:
            raise HTTPException(status_code=400, detail="Email not found from Google")

        # 🔥 TODO: Save or check user in database
        # Example:
        # user = get_user_by_email(email)
        # if not user:
        #     create_user(email=email, name=name, provider="google")

        return {
            "message": "Google login successful",
            "user": {
                "email": email,
                "name": name,
                "picture": picture,
                "provider": "google"
            }
        }

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Google token")
