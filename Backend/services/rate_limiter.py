import time

RATE_LIMIT = {}
MAX_REQUESTS = 5      # max requests
WINDOW = 60           # per 60 seconds

def is_rate_limited(email: str) -> bool:
    now = time.time()
    email = email.lower().strip()

    timestamps = RATE_LIMIT.get(email, [])
    timestamps = [t for t in timestamps if now - t < WINDOW]

    if len(timestamps) >= MAX_REQUESTS:
        return True

    timestamps.append(now)
    RATE_LIMIT[email] = timestamps
    return False
