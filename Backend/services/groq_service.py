import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# 🔑 Indian Coal Mining Keywords
INDIAN_COAL_MINING_KEYWORDS = [
    "coal", "coal mine", "coal mining",
    "lignite", "bituminous", "anthracite",
    "coking coal", "non coking coal",
    "opencast", "underground",
    "mines act", "coal mines act",
    "mmrd act",
    "dgms", "directorate general of mines safety",
    "coal india", "cil",
    "mine safety", "ventilation",
    "blasting", "explosives",
    "mine manager", "overman",
    "environment clearance", "forest clearance",
    "coal mines regulations", "cmr 2017"
]


def is_indian_coal_mining_question(query: str) -> bool:
    q = query.lower()

    # ✅ Always accept if "coal" appears
    if "coal" in q:
        return True

    return any(keyword in q for keyword in INDIAN_COAL_MINING_KEYWORDS)


# 🧠 UPDATED SYSTEM PROMPT (Numeric points, no **, clean UI output)
SYSTEM_PROMPT = """
You are MineLex, an AI assistant specialized in COAL MINING IN INDIA.

Answer structure rules:
- Use clear numbered headings (1–5 max)
- Each point must add new, meaningful information
- Use dash-style explanation lines
- Avoid repetition and filler
- No bold text or markdown emphasis

Answer behavior:
- Adjust depth based on intent (general, safety, legal, operations)
- Prefer Indian coal mining context
- Keep explanations practical and accurate

If applicable, include:
- A section titled "Relevant law" listing applicable Acts or Regulations
- A short "Key takeaway" (1–2 lines)

Tone modes:
- Student mode: simple explanations
- Officer mode: formal, compliance-focused language

If the question is too broad:
- Ask one clarifying question before answering

If the question is NOT related to coal mining:
Reply politely with:
"I don’t have data related to this. I’m mainly designed for coal mining rules and regulations in India."


"""


def ask_groq(query: str) -> str:
    # 🚫 Fallback for unrelated questions
    if not is_indian_coal_mining_question(query):
        return (
            "I don’t have data related to this. "
            "I’m mainly designed for coal mining rules and regulations in India."
        )

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query}
            ],
            temperature=0.25,
            max_tokens=600
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        raise Exception(f"GROQ error: {str(e)}")
