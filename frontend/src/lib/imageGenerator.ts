import html2canvas from "html2canvas";

export async function generateResultImage(elementId: string): Promise<string> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Element not found");
  }

  // Ensure web fonts and images are fully ready before capture
  if ("fonts" in document && (document as Document & { fonts: FontFaceSet }).fonts?.ready) {
    try {
      await (document as Document & { fonts: FontFaceSet }).fonts.ready;
    } catch {
      // ignore font readiness errors
    }
  }

  const imgs = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    imgs.map(img => {
      if (img.complete) return Promise.resolve();
      // Prefer decode() if available to avoid layout shifts
      if (typeof img.decode === "function") {
        return img.decode().catch(() => void 0);
      }
      return new Promise<void>(resolve => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }),
  );

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: null,
    logging: false,
    useCORS: true,
    allowTaint: true,
    // Improve text metrics consistency in some environments
    // (helps keep number text visually centered inside circles)
    windowWidth: document.documentElement.clientWidth,
    windowHeight: document.documentElement.clientHeight,
  });

  return canvas.toDataURL("image/png");
}

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
