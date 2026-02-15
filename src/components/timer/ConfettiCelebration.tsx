'use client';

import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

interface ConfettiCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ConfettiCelebration({ trigger, onComplete }: ConfettiCelebrationProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    if (trigger && !showing) {
      setShowing(true);
      
      // Generate confetti pieces
      const colors = [
        'oklch(0.7 0.16 180)', // teal
        'oklch(0.7 0.14 150)', // green
        'oklch(0.7 0.14 280)', // purple
        'oklch(0.75 0.12 200)', // blue
        'oklch(0.8 0.14 60)', // yellow
      ];
      
      const newPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 1,
        size: 6 + Math.random() * 6,
      }));
      
      setPieces(newPieces);
      
      // Clear after animation
      setTimeout(() => {
        setPieces([]);
        setShowing(false);
        onComplete?.();
      }, 3000);
    }
  }, [trigger, showing, onComplete]);

  if (!showing || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute rounded-sm"
          style={{
            left: `${piece.x}%`,
            top: '-20px',
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animation: `confetti-fall ${piece.duration}s ease-out forwards`,
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}
