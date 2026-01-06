export function Confetti() {
  const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    rotation: Math.random() * 360,
    color: ['text-yellow-400', 'text-orange-400', 'text-pink-400', 'text-blue-400', 'text-green-400', 'text-purple-400'][Math.floor(Math.random() * 6)],
    size: Math.random() > 0.5 ? 'text-xs' : 'text-sm',
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`${piece.color} ${piece.size} opacity-60 absolute`}
          style={{ left: piece.left, top: piece.top, transform: `rotate(${piece.rotation}deg)` }}
        >
          ✦
        </div>
      ))}
    </div>
  );
}
