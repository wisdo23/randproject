// Map game names to their specific brand images
import bingo4 from "@/assets/Bing4 lottery.jpeg";
import endowment from "@/assets/Endowment Thursday.jpeg";
import goldenSouvenir from "@/assets/Golden Souvenir Tuesday.jpeg";
import samediSoir from "@/assets/Samedi Soir Saturday.jpeg";
import starLotto from "@/assets/Star Sunday.jpeg";
import sikaKese from "@/assets/sika kese.jpeg";
import randLogo from "@/assets/rand_single-removebg-preview.png";

export const gameImages: Record<string, string> = {
  "BINGO4": bingo4,
  "ENDOWMENT LOTTO": endowment,
  "GOLDEN SOUVENIR": goldenSouvenir,
  "SAMEDI SOIR": samediSoir,
  "STAR LOTTO": starLotto,
  "SIKA KESE": sikaKese,
};

export const getGameImage = (gameName: string): string | null => {
  const normalized = gameName.toUpperCase().trim();
  return gameImages[normalized] || null;
};

export const assets = {
  randLogo,
  gameImages,
  getGameImage,
};

export default assets;
