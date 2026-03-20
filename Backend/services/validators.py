def validate_question(query: str) -> str | None:
    if not query or not query.strip():
        return "Please ask a valid coal mining related question."

    if len(query.strip()) < 5:
        return "Your question is too short. Please be more specific."

    return None
