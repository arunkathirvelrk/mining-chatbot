from pydantic import BaseModel

class HistoryRequest(BaseModel):
    email: str
