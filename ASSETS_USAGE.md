# Assets Usage Guide

## Current Assets in `frontend/src/assets/`

### Logo (Currently Used)
- **`rand_single-removebg-preview.png`** - Rand Lottery logo (transparent)
  - Used in: Result cards header, games page, all branding elements

### Game-Specific Images (Now Integrated)
These branded images are automatically displayed when their corresponding games are shown:

- **`Bing4 lottery.jpeg`** → Shows for "BINGO4" game
- **`Endowment Thursday.jpeg`** → Shows for "ENDOWMENT LOTTO" game  
- **`Golden Souvenir Tuesday.jpeg`** → Shows for "GOLDEN SOUVENIR" game
- **`Samedi Soir Saturday.jpeg`** → Shows for "SAMEDI SOIR" game
- **`Star Sunday.jpeg`** → Shows for "STAR LOTTO" game
- **`sika kese.jpeg`** → Shows for "SIKA KESE" game

**Where You'll See Them:**
1. **Games Page** (`/games`) - Each game card shows its branded image
2. **Result Cards** - When posting results, the game's branded image appears alongside Rand logo
3. **Post Results Preview** - Shows game branding in the preview card
4. **History Page** - Result cards in history display game-specific images

### Background Styling
- Result cards use gradient backgrounds defined in CSS/Tailwind
- Professional, branded look for social media posts using color themes

### Reference Template (Now Viewable in App)
- **`Draw facebook social media sample.jpeg`** - Official social media template
  - **View in app**: Navigate to **Design Guide** page (`/design-guide`)
  - Shows official format for social media posts
  - Displays proper branding, layout, and styling standards
  - Use as reference when creating new designs or templates
  - Helpful for training team members on brand standards

## How It Works

### Automatic Game Image Mapping
The system automatically matches game names to images:

```typescript
// Example: When you create a result for "BINGO4"
// The card will show: Rand logo + Bingo4 lottery.jpeg

// Supported mappings:
"BINGO4" → Bingo4 lottery.jpeg
"ENDOWMENT LOTTO" → Endowment Thursday.jpeg
"GOLDEN SOUVENIR" → Golden Souvenir Tuesday.jpeg
"SAMEDI SOIR" → Samedi Soir Saturday.jpeg
"STAR LOTTO" → Star Sunday.jpeg
"SIKA KESE" → sika kese.jpeg
```

### Adding More Game Images

To add images for additional games:

1. **Add the image file** to `frontend/src/assets/`
2. **Update the mapping** in `frontend/src/lib/gameAssets.ts`:

```typescript
import newGame from "@/assets/NewGame.jpeg";

export const gameImages: Record<string, string> = {
  "BINGO4": bingo4,
  "NEW GAME NAME": newGame, // Add your game here
  // ... other games
};
```

3. The image will automatically appear for that game throughout the app

## Usage Examples

### Result Cards
When you post results for BINGO4:
- Background: `background.jpeg` (subtle overlay)
- Top Left: Rand logo + BINGO4 branded image
- Content: Winning numbers with gold styling
- Bottom: Verification badge

### Downloaded Social Media Cards
The "Download Card" button captures the entire styled card as PNG, including:
- Background image
- Game branding
- Rand logo
- All numbers and styling

Perfect for posting to Instagram/Snapchat/other platforms!

### Games Management Page
Each game shows:
- Its specific branded image (if available)
- Generic gold icon (if no branded image exists)
- Game name and description

## Best Practices

1. **Image Formats**: Use `.jpeg` or `.png` for game images
2. **Naming**: Keep filenames descriptive (e.g., "GameName Day.jpeg")
3. **Size**: Keep images under 500KB for fast loading
4. **Aspect Ratio**: Square or landscape images work best (1:1 or 16:9)
5. **Quality**: Use high-res images - they'll be scaled down for display

## Future Enhancements

Potential uses for additional assets:
- Game-specific backgrounds for result cards
- Different card templates per game type
- Animated game logos
- Season/holiday themed variants
- Mobile app splash screens
