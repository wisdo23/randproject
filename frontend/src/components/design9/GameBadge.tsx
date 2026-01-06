import starImg from "@/assets/design9/game-badge.png";

interface GameBadgeProps {
  gameName?: string;
  className?: string;
}

export function GameBadge({ gameName, className }: GameBadgeProps) {
  return (
    <img
      src={starImg}
      alt={gameName || "Game"}
      className={`object-contain drop-shadow-lg ${className || "w-24 h-24 md:w-28 md:h-28"}`}
    />
  );
}
