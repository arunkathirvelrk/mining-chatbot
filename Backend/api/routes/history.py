from fastapi import APIRouter
from database.crud import get_chat_history

router = APIRouter()

@router.get("/history/{email}")
def history(email: str):
    email = email.lower().strip()
    chats = get_chat_history(email)

    # 🔥 Always return list (frontend-safe)
    return chats if isinstance(chats, list) else []
