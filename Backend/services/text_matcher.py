import re

def extract_relevant_text(content: str, query: str, max_length=800):
    """
    Extract meaningful, complete regulation text related to the query.
    Fixes broken PDF text and avoids unrelated clauses.
    """

    if not content:
        return None

    query_lower = query.lower()

    # 🔹 Topic keywords (extendable)
    ventilation_keywords = [
        "ventilation", "fresh air", "airflow", "air",
        "noxious gas", "toxic gas", "inflammable gas",
        "dust", "atmosphere", "fumes"
    ]

    # 🔹 Keywords to ignore (administrative noise)
    ignore_keywords = [
        "certificate", "register", "form",
        "appointment", "driver", "manager",
        "returns", "result of measurements"
    ]

    # 🔹 Clean PDF text (fix broken words & lines)
    def clean_text(text: str) -> str:
        # Join broken words split across lines
        text = re.sub(r"(\w+)-\s+(\w+)", r"\1\2", text)
        text = re.sub(r"(\w+)\s+\n\s*(\w+)", r"\1 \2", text)

        # Replace newlines with spaces
        text = text.replace("\n", " ")

        # Normalize spaces
        text = re.sub(r"\s{2,}", " ", text)

        return text.strip()

    # 🔹 Split into large enough blocks
    raw_blocks = [
        clean_text(p)
        for p in content.split("\n\n")
        if len(p.strip()) > 120
    ]

    scored_blocks = []

    for block in raw_blocks:
        block_lower = block.lower()

        # Skip unrelated admin/legal sections
        if any(k in block_lower for k in ignore_keywords):
            continue

        # Score relevance
        score = sum(1 for kw in ventilation_keywords if kw in block_lower)

        # Prefer rule-like language
        if "shall" in block_lower or "must" in block_lower:
            score += 2

        # Ensure it actually talks about ventilation
        if score >= 2:
            scored_blocks.append((score, block))

    if not scored_blocks:
        return None

    # 🔹 Pick the best-scoring block
    scored_blocks.sort(reverse=True, key=lambda x: x[0])
    best_text = scored_blocks[0][1]

    # 🔹 Safety check: avoid broken clauses
    if len(best_text.split()) < 25:
        return None

    return best_text[:max_length]
