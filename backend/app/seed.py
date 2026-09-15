from datetime import datetime


SEED_TIME = datetime(2026, 6, 18, 9, 0, 0)
SEED_ACTOR = "1234-Admin"

SEED_CATEGORIES = (
    {"category_id": "public-verification", "category_name": "Verification", "sort_order": 1},
    {"category_id": "public-security", "category_name": "Security", "sort_order": 2},
)

SEED_PHRASES = (
    {
        "category_id": "public-verification",
        "phrase_id": "public-ab",
        "phrase_text": "For verification, please confirm your registered mobile number and date of birth.",
        "remark": "Use before collecting verification answers.",
        "sort_order": 1,
        "shortcut_code": "ab",
    },
    {
        "category_id": "public-security",
        "phrase_id": "public-ad",
        "phrase_text": "For your security, never share OTP, PIN, CVV, password, or full card number in this chat.",
        "remark": "Security reminder for chat conversations.",
        "sort_order": 2,
        "shortcut_code": "ad",
    },
    {
        "category_id": "public-security",
        "phrase_id": "public-af",
        "phrase_text": "I can help with one more request before we close this conversation.",
        "remark": "Conversation closing prompt.",
        "sort_order": 3,
        "shortcut_code": "af",
    },
)
