import { DrawResult } from "@/types/lottery";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { getGameImage } from "@/lib/gameAssets";
import randLogo from "@/assets/rand_single-removebg-preview.png";

interface ResultCardProps {
  result: DrawResult;
  className?: string;
}

export function ResultCard({ result, className }: ResultCardProps) {
  const gameImage = getGameImage(result.gameName);
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Card Header with Gradient */}
      <div className="gradient-dark p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={randLogo} alt="Rand Lottery" className="h-10 w-10 md:h-12 md:w-12 object-contain" />
            {gameImage && (
              <img src={gameImage} alt={result.gameName} className="h-10 w-auto md:h-12 object-contain rounded" />
            )}
            <div>
              <h3 className="font-display text-lg md:text-xl font-bold text-secondary-foreground">
                Rand Lottery
              </h3>
              <p className="text-xs md:text-sm text-secondary-foreground/70">
                Official Results
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-base md:text-lg font-bold text-gradient-gold">
              {result.gameName}
            </p>
            <p className="text-xs text-secondary-foreground/70">
              {format(result.drawDate, "dd MMM yyyy")} • {result.drawTime}
            </p>
          </div>
        </div>
      </div>

      {/* Winning Numbers */}
      <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
            Winning Numbers
          </p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
            {result.winningNumbers.map((num, idx) => (
              <div
                key={idx}
                className="w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full gradient-gold flex items-center justify-center shadow-gold animate-scale-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <span className="font-display text-base sm:text-lg md:text-xl font-bold text-primary-foreground">
                  {num}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Numbers / Bonus Ball */}
        {result.machineNumbers && result.machineNumbers.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3">
              Bonus Ball
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
              {result.machineNumbers.map((num, idx) => (
                <div
                  key={idx}
                  className="w-9 h-9 sm:w-11 sm:h-11 md:w-14 md:h-14 rounded-full bg-accent flex items-center justify-center shadow-medium animate-scale-in"
                  style={{ animationDelay: `${(result.winningNumbers.length + idx) * 100}ms` }}
                >
                  <span className="font-display text-base sm:text-lg md:text-xl font-bold text-accent-foreground">
                    {num}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verification Badge */}
        {result.isVerified && (
          <div className="flex items-center gap-2 pt-2">
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-muted-foreground">
              Verified {result.verifiedAt ? format(result.verifiedAt, "dd MMM yyyy HH:mm") : "and ready to share"}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
