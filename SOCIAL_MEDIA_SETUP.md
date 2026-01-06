# Social Media API Configuration

Add these environment variables to `backend/.env`:

```env
# Facebook Page
FACEBOOK_PAGE_ID=your_facebook_page_id
FACEBOOK_ACCESS_TOKEN=your_facebook_page_access_token

# Twitter/X API
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

# Instagram Business Account
INSTAGRAM_ACCOUNT_ID=your_instagram_business_account_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token

# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id
WHATSAPP_ACCESS_TOKEN=your_whatsapp_business_access_token
```

## How to Get API Credentials

### Facebook & Instagram (Meta)

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create an app and add **"Facebook Login"** and **"Instagram Graph API"** products
3. Get a **Page Access Token** from Graph API Explorer
4. For Instagram: Convert to Business Account and link to Facebook Page
5. Generate a **long-lived token** (60 days or permanent)

**Page ID**: Settings > About > Page ID  
**Instagram Account ID**: Graph API Explorer > `me/accounts?fields=instagram_business_account`

### Twitter/X API

1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a project and app
3. Generate **API Keys** and **Access Tokens**
4. Enable **OAuth 1.0a** or use **Bearer Token** for v2 API
5. Copy: API Key, API Secret, Access Token, Access Token Secret

### WhatsApp Business API

1. Go to [Meta Business Suite](https://business.facebook.com/)
2. Set up **WhatsApp Business API**
3. Get **Phone Number ID** from WhatsApp Manager
4. Generate **Access Token** from Meta Business settings
5. Verify phone number and get API access

## API Endpoint

### POST `/api/social/post`

Posts lottery result to multiple social media platforms.

**Request Body:**
```json
{
  "result_id": 123,
  "platforms": ["facebook", "twitter", "instagram", "whatsapp"],
  "image_url": "https://your-cdn.com/result-card.png"
}
```

**Response:**
```json
[
  {
    "platform": "facebook",
    "success": true,
    "message": "Posted successfully",
    "post_id": "123456789_987654321"
  },
  {
    "platform": "twitter",
    "success": true,
    "message": "Posted successfully",
    "post_id": "1234567890123456789"
  }
]
```

## Frontend Integration

The `SocialSharePanel` component automatically calls the backend API when sharing:

```tsx
// In PostResultsPage.tsx
<SocialSharePanel 
  result={result} 
  cardElementId="share-card" 
/>
```

When user clicks a platform button:
1. Frontend calls `POST /api/social/post`
2. Backend posts to the actual social media platform
3. User sees success/failure toast notification
4. Posted platforms are marked with checkmarks

## Image Upload (Optional)

For Instagram (requires images), you can:

1. **Upload card to CDN first:**
   - Capture card as PNG using html2canvas
   - Upload to S3/CloudFlare/Imgur
   - Pass public URL in `image_url` field

2. **Or modify backend to accept base64:**
   - Send image data in request
   - Backend uploads to hosting
   - Returns public URL

## Testing

Test without real credentials using mock mode:

```python
# In backend/app/services/social_media.py
async def post_to_facebook(message: str, image_url: Optional[str] = None) -> dict:
    # Mock mode for testing
    if not social_settings.facebook_access_token:
        return {"id": "mock_post_123", "success": True}
    # Real API call...
```

## Platform Limits

- **Facebook**: 250 posts/hour per page
- **Twitter**: 300 tweets/3 hours, 2400/day
- **Instagram**: 25 posts/day, 100 API calls/hour
- **WhatsApp**: Status updates, business messaging limits vary

## Security Notes

- Never commit `.env` files with real tokens
- Use environment variables in production
- Rotate tokens regularly (every 60 days)
- Store tokens securely (AWS Secrets Manager, Azure Key Vault)
- Use HTTPS only for API callbacks
