import type { DrawResult } from "@/types/lottery";

const DEFAULT_SHARE_URL = import.meta.env.VITE_PUBLIC_SITE_URL || "https://wisdo23.github.io/azure-work-site/";
const DEFAULT_HASHTAGS = ["RandLottery"];

export type SocialPlatformId =
  | "facebook"
  | "twitter"
  | "instagram"
  | "telegram"
  | "whatsapp"
  | "snapchat";

export function buildShareText(result: DrawResult): string {
  const base = result.shareCopy?.trim()
    ? result.shareCopy.trim()
    : (() => {
        const date = result.drawDate.toLocaleDateString();
        const time = result.drawTime;
        const win = result.winningNumbers.join(", ");
        const bonus = result.machineNumbers?.length
          ? ` • Bonus: ${result.machineNumbers.join(", ")}`
          : "";
        return `Rand Lottery • ${result.gameName} • ${date} ${time}\nWinning: ${win}${bonus}`;
      })();

  const hashtags = (result.shareHashtags?.length ? result.shareHashtags : DEFAULT_HASHTAGS)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

  return hashtags.length ? `${base}\n\n${hashtags.join(" ")}` : base;
}

export function shareUrl(
  platform: SocialPlatformId,
  params: { text: string; url?: string; hashtags?: string[] }
): string {
  const url = params.url || DEFAULT_SHARE_URL;
  const hashtagList = params.hashtags && params.hashtags.length ? params.hashtags : DEFAULT_HASHTAGS;
  const sanitizedHashtags = hashtagList.map((tag) => tag.replace(/^#/, ""));
  const encodedText = encodeURIComponent(params.text);
  const encodedUrl = encodeURIComponent(url);
  const encodedTags = encodeURIComponent(sanitizedHashtags.join(","));

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${encodedTags}`;
    case "instagram":
      // Instagram does not support web share URLs for feeds; instruct to download image
      return "https://www.instagram.com/";
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
    case "snapchat":
      // Snapchat share is app-first; open site as fallback
      return "https://www.snapchat.com/";
    default:
      return encodedUrl;
  }
}

export async function captureElementAsPng(element: HTMLElement): Promise<Blob> {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
  });
  return await new Promise((resolve) => canvas.toBlob((b) => resolve(b as Blob), "image/png"));
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
