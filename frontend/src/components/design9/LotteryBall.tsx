interface LotteryBallProps {
  number: number | string;
  color?: string;
}

export function LotteryBall({ number, color = 'blue' }: LotteryBallProps) {
  const strokeColors: Record<string, string> = {
    red: '#f44336',
    green: '#1f9d55',
    purple: '#7c3aed',
    blue: '#2563eb',
    orange: '#f97316',
    yellow: '#facc15',
    pink: '#ec4899',
    teal: '#14b8a6',
    indigo: '#4f46e5',
    brown: '#92400e',
  };

  const stroke = strokeColors[color] || strokeColors.blue;

  const digits = String(number).length;
  const fontSize = digits <= 1 ? 38 : digits === 2 ? 34 : 30;

  return (
    <div className="relative flex-shrink-0 w-10 sm:w-12 md:w-14 lg:w-18 aspect-square">
      <div className="absolute inset-0 bg-black/10 rounded-full blur-sm translate-y-1" />
      <svg viewBox="0 0 100 100" className="relative w-full h-full drop-shadow-lg">
        <circle cx="50" cy="50" r="46" fill="#ffffff" stroke={stroke} strokeWidth="8" />
        <text
          x="50"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#111827"
          fontWeight="700"
          fontFamily="'Space Grotesk', 'Plus Jakarta Sans', sans-serif"
          fontSize={fontSize}
        >
          {number}
        </text>
      </svg>
    </div>
  );
}
