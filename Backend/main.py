from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes import (
    register,
    login,
    admin,
    chatbot,
    history,
    reset_password,
    forgot_password,
    google_auth,
    verify  # 🔥 ADD THIS
)

app = FastAPI(title="Mining Laws Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔐 AUTH ROUTES
app.include_router(register.router, prefix="/auth", tags=["Auth"])
app.include_router(login.router, prefix="/auth", tags=["Auth"])
app.include_router(google_auth.router, prefix="/auth", tags=["Google Auth"])
app.include_router(forgot_password.router, prefix="/auth", tags=["Auth"])
app.include_router(reset_password.router, prefix="/auth", tags=["Auth"])
app.include_router(verify.router, prefix="/auth", tags=["Auth"])  # 🔥 ADD THIS LINE

# 🛠 ADMIN
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

# 💬 CHAT
app.include_router(chatbot.router, prefix="/chat", tags=["Chatbot"])
app.include_router(history.router, prefix="/chat", tags=["History"])


@app.get("/")
def root():
    return {"message": "Mining Laws Chatbot Backend Running"}