from services.groq_service import client

TITLE_SYSTEM_PROMPT = """
You generate a short, meaningful sidebar title for a chat application.

Rules:
- Output ONLY the title
- 3 to 6 words maximum
- No punctuation
- No markdown
- No quotes
- Fix grammar and spelling
- Use title case
- Summarize the core topic

Examples:
User: coal mining
Title: Coal Mining Overview

User: what are the different types of coal
Title: Types Of Coal

User: groq eroor i have given to you
Title: Groq Model Error Fix
"""

def generate_chat_title(query: str) -> str:
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": TITLE_SYSTEM_PROMPT},
                {"role": "user", "content": query}
            ],
            temperature=0.2,
            max_tokens=20
        )

        title = response.choices[0].message.content.strip()
        return title[:60]

    except Exception:
        return "New Chat"
