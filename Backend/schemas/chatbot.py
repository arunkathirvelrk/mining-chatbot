from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    email: str
    query: str
    chat_id: Optional[str] = None
