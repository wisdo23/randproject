import base64
import mimetypes
from typing import Optional

import httpx
from ..core.social_config import social_settings


class SocialMediaService:
    """Service for posting lottery results to social media platforms"""

    @staticmethod
    async def post_to_facebook(message: str, image_url: Optional[str] = None) -> dict:
        """Post to Facebook Page"""
        if not social_settings.facebook_access_token:
            raise ValueError("Facebook access token not configured")

        url = f"https://graph.facebook.com/v18.0/{social_settings.facebook_page_id}/feed"
        data = {
            "message": message,
            "access_token": social_settings.facebook_access_token,
        }
        if image_url:
            data["link"] = image_url

        async with httpx.AsyncClient() as client:
            response = await client.post(url, data=data)
            response.raise_for_status()
            return response.json()

    @staticmethod
    async def post_to_twitter(message: str) -> dict:
        """Post to Twitter/X"""
        raise NotImplementedError("Twitter posting is disabled. Use manual sharing instead.")

    @staticmethod
    async def post_to_instagram(caption: str, image_url: str) -> dict:
        """Post to Instagram (requires image)"""
        if not social_settings.instagram_access_token:
            raise ValueError("Instagram access token not configured")

        # Step 1: Create container
        container_url = f"https://graph.facebook.com/v18.0/{social_settings.instagram_account_id}/media"
        container_data = {
            "image_url": image_url,
            "caption": caption,
            "access_token": social_settings.instagram_access_token,
        }

        async with httpx.AsyncClient() as client:
            container_response = await client.post(container_url, data=container_data)
            container_response.raise_for_status()
            container_id = container_response.json()["id"]

            # Step 2: Publish container
            publish_url = f"https://graph.facebook.com/v18.0/{social_settings.instagram_account_id}/media_publish"
            publish_data = {
                "creation_id": container_id,
                "access_token": social_settings.instagram_access_token,
            }
            publish_response = await client.post(publish_url, data=publish_data)
            publish_response.raise_for_status()
            return publish_response.json()

    @staticmethod
    async def post_to_whatsapp(
        message: str,
        *,
        recipient: Optional[str] = None,
        image_url: Optional[str] = None,
        image_base64: Optional[str] = None,
    ) -> dict:
        """Post to WhatsApp Status/Business API"""
        if not social_settings.whatsapp_access_token:
            raise ValueError("WhatsApp access token not configured")

        url = f"https://graph.facebook.com/v18.0/{social_settings.whatsapp_phone_number_id}/messages"
        headers = {
            "Authorization": f"Bearer {social_settings.whatsapp_access_token}",
            "Content-Type": "application/json",
        }
        media_id: Optional[str] = None

        async with httpx.AsyncClient() as client:
            if image_base64:
                # Support full data URLs or raw base64 payloads
                mime_type = "image/png"
                payload = image_base64
                if image_base64.startswith("data:"):
                    header, payload = image_base64.split(",", 1)
                    mime_type = header.split(";")[0].split(":", 1)[1]
                try:
                    media_bytes = base64.b64decode(payload)
                except Exception as exc:
                    raise ValueError("Invalid base64 image data") from exc

                media_url = f"https://graph.facebook.com/v18.0/{social_settings.whatsapp_phone_number_id}/media"
                media_headers = {
                    "Authorization": f"Bearer {social_settings.whatsapp_access_token}",
                }
                file_extension = mimetypes.guess_extension(mime_type) or ".png"
                files = {
                    "file": (f"result{file_extension}", media_bytes, mime_type),
                }
                data_form = {"messaging_product": "whatsapp"}

                upload_response = await client.post(
                    media_url,
                    headers=media_headers,
                    data=data_form,
                    files=files,
                )
                upload_response.raise_for_status()
                media_id = upload_response.json().get("id")

            # Prepare payload
            to_value = (
                recipient
                or social_settings.whatsapp_default_recipient
                or "status@broadcast"
            )

            data = {
                "messaging_product": "whatsapp",
                "to": to_value,
            }

            if media_id:
                data["type"] = "image"
                data["image"] = {"id": media_id, "caption": message}
            elif image_url:
                data["type"] = "image"
                data["image"] = {"link": image_url, "caption": message}
            else:
                data["type"] = "text"
                data["text"] = {"body": message}

            response = await client.post(url, headers=headers, json=data)
            response.raise_for_status()
            return response.json()

    @staticmethod
    def format_result_message(
        game_name: str,
        draw_date: str,
        draw_time: str,
        winning_numbers: str,
        machine_numbers: str = None,
    ) -> str:
        """Format lottery result as social media message"""
        message = f"🎰 Rand Lottery Results\n\n"
        message += f"Game: {game_name}\n"
        message += f"Draw: {draw_date} at {draw_time}\n\n"
        message += f"🎯 Winning Numbers: {winning_numbers}\n"
        if machine_numbers:
            message += f"🔢 Bonus: {machine_numbers}\n"
        message += f"\n#RandLottery #{game_name.replace(' ', '')}"
        return message

    @staticmethod
    async def post_to_telegram(message: str, chat_id: str | None = None) -> dict:
        """Post message via Telegram Bot API"""
        if not social_settings.telegram_bot_token:
            raise ValueError("Telegram bot token not configured")
        bot_token = social_settings.telegram_bot_token
        target = chat_id or social_settings.telegram_default_chat
        url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        data = {"chat_id": target, "text": message}
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=data)
            resp.raise_for_status()
            return resp.json()

    @staticmethod
    async def post_to_snapchat(message: str) -> dict:
        raise NotImplementedError(
            "Snapchat posting is not implemented. Manual workflow only."
        )
