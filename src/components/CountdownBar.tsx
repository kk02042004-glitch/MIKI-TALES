import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../store/PortfolioContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const CountdownBar: React.FC = () => {
  const { data } = usePortfolio();
  const { targetDate, label, isEnabled } = data.countdown;

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDate));

  function calculateTimeLeft(target: string): TimeLeft {
    const diff = new Date(target).getTime() - new Date().getTime();

    if (isNaN(diff) || diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isExpired: false };
  }

  useEffect(() => {
    // Initial compute
    setTimeLeft(calculateTimeLeft(targetDate));

    // Live update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isEnabled) return null;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const completionMessage =
    (data.countdown as any).completionMessage ||
    'Currently accepting select commissions for 2D Animation & Storytelling.';

  return (
    <div className="w-full bg-[#000066] border-b border-white/10 text-slate-300 py-1.5 px-4 text-xs tracking-wider transition-colors">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-medium">
        {timeLeft.isExpired ? (
          <span className="font-mono text-[#ffea00] font-semibold tracking-wide text-xs">
            {completionMessage}
          </span>
        ) : (
          <>
            <span className="text-slate-300 select-none">
              {label}
            </span>
            <span className="font-mono tabular-nums text-[#ffea00] font-semibold tracking-widest text-[11px] sm:text-xs">
              [ {pad(timeLeft.days)} DAYS : {pad(timeLeft.hours)} HOURS : {pad(timeLeft.minutes)} MINUTES : {pad(timeLeft.seconds)} SECONDS ]
            </span>
          </>
        )}
      </div>
    </div>
  );
};
