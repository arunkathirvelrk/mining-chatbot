from fastapi import APIRouter, HTTPException
from schemas.chatbot import ChatRequest
from database.crud import (
    search_document,
    save_document,
    save_chat,
    get_chat_by_id
)
from services.groq_service import ask_groq
from services.text_matcher import extract_relevant_text
from services.title_generator import generate_chat_title
from uuid import uuid4

router = APIRouter()


@router.post("/query")
def chat(data: ChatRequest):
    try:
        email = data.email.lower().strip()
        user_query = data.query

        # ✅ CHAT SESSION (ChatGPT-style)
        if data.chat_id is None:
            chat_id = str(uuid4())
            messages = []
            title = generate_chat_title(user_query)   # 🔥 NEW
        else:
            chat_id = data.chat_id
            chat = get_chat_by_id(email, chat_id)
            messages = chat["messages"] if chat else []
            title = chat["title"] if chat else "New Chat"

        # 1️⃣ Search in PDFs
        doc = search_document(user_query)
        answer = None
        source = None

        if doc and isinstance(doc.get("content"), str):
            snippet = extract_relevant_text(doc["content"], user_query)
            if snippet:
                answer = snippet
                source = doc.get("source", "Uploaded PDF")

        # 2️⃣ Fallback to GROQ
        if not answer:
            answer = ask_groq(user_query)
            source = "Groq AI"

            save_document({
                "title": user_query,
                "content": answer,
                "source": source
            })

        # 3️⃣ Append messages
        messages.extend([
            {"role": "user", "text": user_query},
            {"role": "bot", "text": answer}
        ])

        # 4️⃣ Save chat (same logic, just better title)
        save_chat(
            email=email,
            chat_id=chat_id,
            title=title,
            messages=messages,
            source=source
        )

        # 5️⃣ Return SAME chat_id
        return {
            "answer": answer,
            "messages": messages,
            "chat_id": chat_id
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Chatbot failed: {str(e)}"
        )
