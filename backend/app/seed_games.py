"""Seed initial games into the database.

Run with:
    docker compose exec api python -m app.seed_games
"""

import asyncio
from sqlalchemy import select
from .db.session import SessionLocal
from .models.game import Game


GAMES = [
    # National games
    ("VAG MONDAY", "National - shutoff 10:00am"),
    ("VAG TUESDAY", "National - shutoff 10:00am"),
    ("VAG WEDNESDAY", "National - shutoff 10:00am"),
    ("VAG THURSDAY", "National - shutoff 10:00am"),
    ("VAG FRIDAY", "National - shutoff 10:00am"),
    ("VAG SATURDAY", "National - shutoff 10:00am"),
    ("MONDAY NOONRUSH", "National - shutoff 1:30pm"),
    ("TUESDAY NOONRUSH", "National - shutoff 1:30pm"),
    ("WEDNESDAY NOONRUSH", "National - shutoff 1:30pm"),
    ("THURSDAY NOONRUSH", "National - shutoff 1:30pm"),
    ("FRIDAY NOONRUSH", "National - shutoff 1:30pm"),
    ("SATURDAY NOONRUSH", "National - shutoff 1:30pm"),
    ("MONDAY SPECIAL", "National - shutoff 7:15pm"),
    ("LUCKY TUESDAY", "National - shutoff 7:15pm"),
    ("MID-WEEK", "National - shutoff 7:15pm"),
    ("FORTUNE THURSDAY", "National - shutoff 7:15pm"),
    ("FRIDAY BONANZA", "National - shutoff 7:15pm"),
    ("NATIONAL", "National - shutoff 7:15pm"),
    ("ASEDA", "National - shutoff 7:15pm"),
    # Rand lottery games
    ("BINGO4", "Rand Lottery - shutoff 6:50am"),
    ("GOLDEN SOUVENIR", "Rand Lottery - shutoff 6:50am"),
    ("CASH4LIFE", "Rand Lottery - shutoff 6:50am"),
    ("ENDOWMENT LOTTO", "Rand Lottery - shutoff 6:50am"),
    ("SIKA KESE", "Rand Lottery - shutoff 6:50am"),
    ("SAMEDI SOIR", "Rand Lottery - shutoff 6:50am"),
    ("STAR LOTTO", "Rand Lottery - shutoff 6:50am"),
]


async def main():
    async with SessionLocal() as session:
        for name, description in GAMES:
            existing = await session.execute(select(Game).where(Game.name == name))
            if existing.scalar_one_or_none():
                continue
            session.add(Game(name=name, description=description))
        await session.commit()
        print("Seeding complete")


if __name__ == "__main__":
    asyncio.run(main())