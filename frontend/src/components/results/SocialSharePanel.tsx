import { useMemo, useState } from "react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { buildShareText, shareUrl, captureElementAsPng, downloadBlob, type SocialPlatformId } from "@/lib/share";
import { DrawResult } from "@/types/lottery";
import {
  Camera,
  Copy,
  Facebook,
  Instagram,
  MessageCircle,
  Send as TelegramIcon,
  Twitter,
} from "lucide-react";

interface SocialSharePanelProps {
  result: DrawResult;
  onShare?: (platform: string) => void;
  cardElementId?: string;
}

type PlatformType = "link" | "manual";

const PLATFORM_CONFIG: Record<
  string,
  {
    id: string;
    name: string;
    icon: ComponentType<{ className?: string }>;
    color: string;
    type: PlatformType;
    helper?: string;
  }
> = {
  facebook: {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-[#1877F2]",
    type: "link",
  },
  twitter: {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "bg-[#000000]",
    type: "link",
  },
  instagram: {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]",
    type: "manual",
    helper: "Upload the downloaded card to the Instagram app.",
  },
  telegram: {
    id: "telegram",
    name: "Telegram",
    icon: TelegramIcon,
    color: "bg-[#0088CC]",
    type: "link",
  },
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "bg-[#25D366]",
    type: "link",
  },
  snapchat: {
    id: "snapchat",
    name: "Snapchat",
    icon: Camera,
    color: "bg-[#FFFC00] text-black",
    type: "manual",
    helper: "Open Snapchat and post using the saved PNG card.",
  },
};

export function SocialSharePanel({ result, onShare, cardElementId }: SocialSharePanelProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const shareText = useMemo(() => buildShareText(result), [result]);
  const recommendedPlatforms = useMemo(() => {
    const uniqueTargets = Array.from(new Set(result.shareTargets || []));
    return uniqueTargets.length ? uniqueTargets : ["facebook", "twitter", "instagram", "whatsapp", "telegram"];
  }, [result.shareTargets]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({ title: "Copied", description: "Share message copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ title: "Copy failed", description: "Unable to copy text.", variant: "destructive" });
    }
  };

  const handleDownload = async () => {
    try {
      const el = cardElementId ? document.getElementById(cardElementId) : null;
      if (!el) throw new Error("Result card not found");
      const blob = await captureElementAsPng(el);
      downloadBlob(blob, `${result.gameName}-${result.id}.png`);
      toast({ title: "Card downloaded", description: "PNG saved to your device." });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Download failed";
      toast({ title: "Download failed", description: message, variant: "destructive" });
    }
  };

  const handleShare = (platformId: string) => {
    const platform = PLATFORM_CONFIG[platformId];
    if (!platform) return;

    if (platform.type === "link") {
      const url = shareUrl(platform.id as SocialPlatformId, {
        text: shareText,
        hashtags: result.shareHashtags,
      });
      window.open(url, "_blank", "noopener");
      toast({
        title: `${platform.name} opened`,
        description: "Complete your post in the new tab.",
      });
      onShare?.(platformId);
      return;
    }

    toast({
      title: "Manual posting required",
      description: platform.helper || "Use the downloaded card and paste the copied message.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="share-message" className="text-xs uppercase tracking-wide text-muted-foreground">
          Share message
        </Label>
        <div className="flex gap-2 flex-col">
          <Textarea id="share-message" value={shareText} readOnly className="text-sm" rows={4} />
          <Button type="button" variant="secondary" size="sm" className="self-start" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-1" />
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Paste this caption into Facebook, X, Telegram, or WhatsApp after opening each share link.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" type="button" onClick={handleDownload}>
          Download Card
        </Button>
        <span className="text-xs text-muted-foreground">Instagram and Snapchat require the downloaded image.</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {recommendedPlatforms
          .map((platformId) => PLATFORM_CONFIG[platformId])
          .filter((platform): platform is (typeof PLATFORM_CONFIG)[string] => Boolean(platform))
          .map((platform) => {
            const Icon = platform.icon;
            return (
              <Button
                key={platform.id}
                variant="social"
                type="button"
                className="h-auto py-4 flex-col gap-2"
                onClick={() => handleShare(platform.id)}
              >
                <div className={`p-2 rounded-lg ${platform.color}`}>
                  <Icon className="h-5 w-5 text-secondary-foreground" />
                </div>
                <span className="text-xs font-medium text-center">
                  {platform.name}
                </span>
                {platform.type === "manual" && (
                  <span className="text-[10px] text-muted-foreground text-center">
                    Manual share
                  </span>
                )}
              </Button>
            );
          })}
      </div>

      <div className="rounded-md border border-dashed border-muted-foreground/30 p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Workflow reminder</p>
        <p>
          Stay signed in on each social platform, click the buttons above to open the official posting page,
          paste the copied caption, attach the downloaded result card, and publish. No API credentials are needed.
        </p>
      </div>
    </div>
  );
}
