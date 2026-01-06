import type { ComponentType, CSSProperties } from "react";
import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import { GameBadge } from "@/components/design9/GameBadge";
import { LotteryBall } from "@/components/design9/LotteryBall";
import { RandLogo } from "@/components/design9/RandLogo";
import { DrawResult } from "@/types/lottery";
import { Facebook, Instagram, MessageCircle, Send, Check } from "lucide-react";

const WINNING_COLORS = ["red", "brown", "green", "purple", "orange"];
const MACHINE_COLORS = ["red", "brown", "green", "purple", "orange"];

interface ResultCardDesign9Props {
  result: DrawResult;
  className?: string;
}

export function ResultCardDesign9({ result, className }: ResultCardDesign9Props) {
  const drawDate = result.drawDate instanceof Date ? result.drawDate : new Date(result.drawDate);
  const formattedDate = formatDate(drawDate);
  const heading = buildHeading(result.gameName);
  const eventNumber = buildEventNumber(result.id);

  const winningBalls = result.winningNumbers.map((value, index) => ({
    number: value,
    color: WINNING_COLORS[index % WINNING_COLORS.length],
  }));

  const machineBalls = (result.machineNumbers || []).map((value, index) => ({
    number: value,
    color: MACHINE_COLORS[index % MACHINE_COLORS.length],
  }));

  return (
    <Card
      className={`relative overflow-hidden border-none shadow-2xl bg-gradient-to-b from-amber-50 via-orange-50 to-amber-100 text-[#2d2a24] w-full max-w-[600px] mx-auto rounded-2xl sm:rounded-3xl ${className || ""}`}
    >
      <div className="relative p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-7">
        <header className="space-y-5">
          <h2 className="text-center font-display text-xl sm:text-2xl md:text-3xl tracking-[0.18em] text-[#1f1d1a] uppercase">
            {heading}
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between items-center gap-6">
            <div className="flex flex-col items-center sm:items-start gap-2">
              <RandLogo className="w-16 h-16 sm:w-[72px] sm:h-[72px] md:w-20 md:h-20" />
              <p className="text-amber-900 text-xs sm:text-sm font-semibold tracking-wide text-center sm:text-left uppercase">
                DATE: {formattedDate}
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2">
              <GameBadge gameName={result.gameName} className="w-24 h-24 sm:w-[104px] sm:h-[104px] md:w-28 md:h-28 drop-shadow-lg" />
              <div className="text-center sm:text-right">
                <p className="text-xs text-gray-600 uppercase tracking-wide">Event Number</p>
                <p className="text-blue-800 text-lg sm:text-xl md:text-2xl font-extrabold">{eventNumber}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-4">
          <h3 className="text-center text-lg sm:text-xl md:text-2xl font-extrabold uppercase tracking-wider text-[#c15c00]">
            Winning Numbers
          </h3>
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-nowrap">
            {winningBalls.map(({ number, color }, index) => (
              <LotteryBall key={`${number}-${index}`} number={number} color={color} />
            ))}
          </div>
        </section>

        {machineBalls.length > 0 && (
          <section className="space-y-4">
            <h3 className="text-center text-lg sm:text-xl md:text-2xl font-extrabold uppercase tracking-wider text-[#b0641c]">
              Machine Numbers
            </h3>
            <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 flex-nowrap">
              {machineBalls.map(({ number, color }, index) => (
                <LotteryBall key={`machine-${number}-${index}`} number={number} color={color} />
              ))}
            </div>
          </section>
        )}

        <footer className="space-y-3 sm:space-y-4 text-center">
          {result.isVerified && (
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#5c4121]">
              <Check className="h-4 w-4 text-emerald-600" />
              <span>
                Verified Official Result {result.verifiedAt ? `• ${format(result.verifiedAt, "dd MMM yyyy HH:mm")}` : ""
                }
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <SocialIcon icon={Facebook} label="Facebook" color="#1877F2" />
            <SocialIcon icon={Instagram} label="Instagram" color="#E1306C" />
            <SocialIcon icon={Send} label="Telegram" color="#0088cc" />
            <SocialIcon icon={XIcon} label="X" color="#0f1419" />
            <SocialIcon icon={MessageCircle} label="WhatsApp" color="#25D366" />
            <SocialIcon icon={SnapchatIcon} label="Snapchat" color="#0f1419" />
          </div>
        </footer>
      </div>
    </Card>
  );
}

function formatDate(date: Date) {
  const day = date.getDate();
  const suffix = getOrdinalSuffix(day);
  const month = date.toLocaleDateString("en-GB", { month: "long" }).toUpperCase();
  const year = date.getFullYear();
  return `${day}${suffix} ${month}, ${year}`;
}

function getOrdinalSuffix(day: number) {
  if (day >= 11 && day <= 13) return "TH";
  const lastDigit = day % 10;
  if (lastDigit === 1) return "ST";
  if (lastDigit === 2) return "ND";
  if (lastDigit === 3) return "RD";
  return "TH";
}

function buildHeading(gameName: string) {
  const cleaned = gameName.replace(/rand/gi, "").trim();
  const base = cleaned.length ? cleaned : gameName;
  const upper = base.toUpperCase();
  const hasDraw = upper.includes("DRAW");
  const titleCore = hasDraw ? upper : `${upper} DRAW`;
  return `RAND ${titleCore} RESULTS`;
}

function buildEventNumber(id: string) {
  const digits = id.replace(/\D/g, "");
  if (digits.length >= 3) {
    return digits.slice(-3).padStart(3, "0");
  }
  return id.slice(-3).padStart(3, "0");
}

interface SocialIconProps {
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  label: string;
  color: string;
  background?: string;
}

function SocialIcon({ icon: Icon, label, color, background }: SocialIconProps) {
  if (background) {
    return (
      <span
        className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full shadow-sm border border-white/60"
        title={label}
        style={{ backgroundColor: background }}
      >
        <Icon className="h-4 w-4" style={{ color }} />
      </span>
    );
  }

  return <Icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color }} title={label} />;
}

function SnapchatIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M12 2.2c-2.9 0-4.8 1.9-4.8 4.5v1.9c0 1.9-1 3.1-2.7 3.8-.4.2-.7.6-.7 1a.96.96 0 0 0 .7.9c1 .3 1.4.7 1.5 1 .2.6-.3 1.2-1.1 1.5-.4.1-.6.4-.6.7 0 .5.4.9 1 .9.3 0 .5 0 .7-.1.8-.2 1.3-.4 1.8-.4.6 0 1 .2 1.5.4.8.4 1.9.9 3.2.9s2.4-.5 3.2-.9c.5-.2.9-.4 1.5-.4.5 0 1 .2 1.8.4.2.1.4.1.7.1.6 0 1-.4 1-.9 0-.3-.2-.6-.6-.7-.8-.3-1.3-.9-1.1-1.5.1-.3.5-.7 1.5-1 .5-.1.7-.5.7-.9 0-.4-.3-.8-.7-1-1.6-.6-2.6-1.8-2.6-3.7V6.7c0-2.6-1.9-4.5-4.8-4.5Z"
      />
    </svg>
  );
}

function XIcon({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={style}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="m6.4 4.5 5.1 6.8-5.4 8.2h2.4l4.1-6.1 4.7 6.1h5.1l-5.3-6.8 5-7.3h-2.4l-3.8 5.5-4.2-5.5H6.4Z"
      />
    </svg>
  );
}
