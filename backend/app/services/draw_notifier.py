import asyncio
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.exc import ProgrammingError
from ..db.session import engine
from ..models.draw import Draw
from ..models.game import Game
from ..models.manager import Manager
from ..services.email import EmailService
from ..core.config import settings


async def _notify_due_draws_loop():
    # Simple loop to check draws every 60 seconds (dev use)
    while True:
        async with engine.begin() as conn:
            async with AsyncSession(bind=conn) as session:
                now = datetime.utcnow()
                try:
                    stmt = await session.execute(
                        # select draws that are due; notified may not exist in older databases
                        select(Draw).where(Draw.draw_datetime <= now)
                    )
                except ProgrammingError as error:
                    message = str(error.orig or error)
                    if "UndefinedColumn" in message or "does not exist" in message:
                        # Column missing in legacy database; disable notifier gracefully
                        return
                    raise
                draws = stmt.scalars().all()
                if not draws:
                    await session.commit()
                    await asyncio.sleep(60)
                    continue

                managers_stmt = await session.execute(
                    select(Manager).where(Manager.is_active == True)  # noqa: E712
                )
                managers = managers_stmt.scalars().all()
                recipient_emails = [mgr.email for mgr in managers if mgr.email]

                for draw in draws:
                    game = await session.get(Game, draw.game_id)
                    date_str = draw.draw_datetime.strftime("%Y-%m-%d")
                    time_str = draw.draw_datetime.strftime("%H:%M")
                    subject = f"Draw reminder: {game.name} {date_str}"
                    help_url = settings.help_portal_url.strip() if settings.help_portal_url else ""
                    body_lines = [
                        f"Hi team,",
                        "",
                        f"The draw for {game.name} is scheduled on {date_str} at {time_str}.",
                        "Please log in and enter the winning and machine numbers once available.",
                    ]
                    if help_url:
                        body_lines.extend(
                            [
                                "",
                                "Need help? Use the link below to open the manager portal:",
                                help_url,
                            ]
                        )
                    body_lines.extend(["", "Thank you."])
                    body_text = "\n".join(body_lines)

                    if recipient_emails:
                        try:
                            await EmailService.send_email(
                                subject=subject,
                                recipients=recipient_emails,
                                body=body_text,
                            )
                        except Exception:
                            # avoid crashing the notifier if email fails
                            pass

                    if hasattr(draw, "notified"):
                        draw.notified = True
                await session.commit()
        await asyncio.sleep(60)


def start_notifier_task(loop):
    loop.create_task(_notify_due_draws_loop())
