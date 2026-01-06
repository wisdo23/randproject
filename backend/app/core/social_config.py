from pydantic_settings import BaseSettings, SettingsConfigDict


class SocialMediaSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False, extra="ignore")

    # Facebook
    facebook_page_id: str = ""
    facebook_access_token: str = ""

    # Twitter/X
    twitter_api_key: str = ""
    twitter_api_secret: str = ""
    twitter_access_token: str = ""
    twitter_access_token_secret: str = ""

    # Instagram
    instagram_account_id: str = ""
    instagram_access_token: str = ""

    # WhatsApp Business
    whatsapp_phone_number_id: str = ""
    whatsapp_access_token: str = ""
    whatsapp_default_recipient: str = ""

    # Telegram
    telegram_bot_token: str = ""
    telegram_default_chat: str = ""


social_settings = SocialMediaSettings()
