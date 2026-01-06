from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from ..db.session import get_session
from ..schemas.social import SocialPostRequest, SocialPostResponse
from ..services.social_media import SocialMediaService
from ..repositories.results import ResultRepository

router = APIRouter(prefix="/social", tags=["social"])


@router.post("/post", response_model=list[SocialPostResponse])
async def post_to_social_media(
    payload: SocialPostRequest,
    session: AsyncSession = Depends(get_session),
):
    """Post lottery result to multiple social media platforms"""
    # Get result from database
    result = await ResultRepository.get(session, payload.result_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")

    # Load draw and game info
    await session.refresh(result, ["draw"])
    await session.refresh(result.draw, ["game"])

    # Format message
    message = SocialMediaService.format_result_message(
        game_name=result.draw.game.name,
        draw_date=result.draw.draw_datetime.strftime("%d %b %Y"),
        draw_time=result.draw.draw_datetime.strftime("%I:%M %p"),
        winning_numbers=result.winning_numbers,
        machine_numbers=result.machine_numbers,
    )

    responses = []

    for platform in payload.platforms:
        try:
            if platform == "facebook":
                response = await SocialMediaService.post_to_facebook(
                    message, payload.image_url
                )
                responses.append(
                    SocialPostResponse(
                        platform="facebook",
                        success=True,
                        message="Posted successfully",
                        post_id=response.get("id"),
                    )
                )

            elif platform == "twitter":
                response = await SocialMediaService.post_to_twitter(message)
                responses.append(
                    SocialPostResponse(
                        platform="twitter",
                        success=True,
                        message="Posted successfully",
                        post_id=response.get("data", {}).get("id"),
                    )
                )

            elif platform == "instagram":
                if not payload.image_url:
                    raise ValueError("Instagram requires an image URL")
                response = await SocialMediaService.post_to_instagram(
                    message, payload.image_url
                )
                responses.append(
                    SocialPostResponse(
                        platform="instagram",
                        success=True,
                        message="Posted successfully",
                        post_id=response.get("id"),
                    )
                )

            elif platform == "whatsapp":
                response = await SocialMediaService.post_to_whatsapp(
                    message,
                    recipient=payload.whatsapp_recipient,
                    image_url=payload.image_url,
                    image_base64=payload.image_base64,
                )
                responses.append(
                    SocialPostResponse(
                        platform="whatsapp",
                        success=True,
                        message="Posted successfully",
                        post_id=response.get("messages", [{}])[0].get("id"),
                    )
                )

            else:
                responses.append(
                    SocialPostResponse(
                        platform=platform,
                        success=False,
                        message=f"Platform '{platform}' not supported",
                    )
                )

        except Exception as e:
            responses.append(
                SocialPostResponse(
                    platform=platform,
                    success=False,
                    message=str(e),
                )
            )

    return responses
