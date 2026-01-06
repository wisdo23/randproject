import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import sampleTemplate from "@/assets/Draw facebook social media sample.jpeg";

export default function DesignGuidePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold">
          Design Guide
        </h1>
        <p className="text-muted-foreground mt-1">
          Brand standards and social media templates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Official Social Media Template</CardTitle>
          <CardDescription>
            Reference design for Facebook, Instagram, and other social platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-muted/20">
            <img 
              src={sampleTemplate} 
              alt="Social Media Template Example" 
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Usage:</strong> This template shows the official format for social media posts.</p>
            <p><strong>Elements included:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Rand Lottery branding and logo placement</li>
              <li>Game name and draw date/time positioning</li>
              <li>Winning numbers display style</li>
              <li>Bonus/machine numbers format</li>
              <li>Color scheme and typography</li>
            </ul>
            <p className="pt-2"><strong>Note:</strong> Your generated result cards automatically follow this design standard.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h3 className="font-semibold mb-1">Logo Usage</h3>
            <p className="text-muted-foreground">Always use the transparent Rand logo on dark or gradient backgrounds for maximum visibility.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Game-Specific Images</h3>
            <p className="text-muted-foreground">Each major game (BINGO4, GOLDEN SOUVENIR, etc.) has branded imagery that appears automatically in result cards.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Color Palette</h3>
            <p className="text-muted-foreground">Gold gradients for winning numbers, dark backgrounds for contrast, accent colors for verification badges.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
