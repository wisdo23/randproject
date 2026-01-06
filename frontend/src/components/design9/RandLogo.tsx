import logoImg from "@/assets/design9/rand-logo.png";

interface RandLogoProps {
  className?: string;
}

export function RandLogo({ className }: RandLogoProps) {
  return (
    <img
      src={logoImg}
      alt="Rand Lottery"
      className={`object-contain drop-shadow-lg ${className || "w-16 h-16 md:w-20 md:h-20"}`}
    />
  );
}
