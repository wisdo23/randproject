from pydantic import BaseModel
from typing import Optional


class SocialPostRequest(BaseModel):
    result_id: int
    platforms: list[str]  # ["facebook", "twitter", "instagram", "whatsapp"]
    image_url: Optional[str] = None  # Public URL to result card image
    image_base64: Optional[str] = None  # Base64-encoded image data (data URL or raw)
    whatsapp_recipient: Optional[str] = None  # E.164 phone number or status@broadcast


class SocialPostResponse(BaseModel):
    platform: str
    success: bool
    message: str
    post_id: Optional[str] = None
