import asyncio
import smtplib
import ssl
from email.message import EmailMessage
from typing import Iterable

from ..core.config import settings


class EmailService:
    """Simple async-compatible SMTP email sender."""

    @staticmethod
    async def send_email(*, subject: str, recipients: Iterable[str], body: str) -> None:
        recipients_list = [addr.strip() for addr in recipients if addr and addr.strip()]
        if not recipients_list:
            return
        if not settings.smtp_host or not settings.smtp_from_address:
            raise RuntimeError("SMTP settings are not configured")

        message = EmailMessage()
        message["Subject"] = subject
        message["From"] = settings.smtp_from_address
        message["To"] = ", ".join(recipients_list)
        message.set_content(body)

        async def _send() -> None:
            context = ssl.create_default_context()
            if settings.smtp_use_ssl:
                with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=context) as server:
                    if settings.smtp_username:
                        server.login(settings.smtp_username, settings.smtp_password)
                    server.send_message(message)
                    return
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
                server.ehlo()
                if settings.smtp_use_tls:
                    server.starttls(context=context)
                    server.ehlo()
                if settings.smtp_username:
                    server.login(settings.smtp_username, settings.smtp_password)
                server.send_message(message)

        await asyncio.to_thread(_send)
