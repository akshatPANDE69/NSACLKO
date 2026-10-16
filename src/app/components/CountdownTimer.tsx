'use client';

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  className?: string;
  style?: React.CSSProperties;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ className = '', style }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const targetDate = new Date('2026-11-14T03:30:00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setIsRunning(false);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isRunning) {
    return (
      <div className={`countdown-timer ${className}`} style={style}>
        <div className="text-center text-cyan-400 font-mono text-lg">
          Event Started!
        </div>
      </div>
    );
  }

  return (
    <div className={`countdown-timer ${className}`} style={style}>
      <div className="flex items-center justify-center gap-8 font-mono">
        <div className="text-center">
          <div className="text-4xl font-bold text-cyan-400 cyber-glow">{timeLeft.days}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">DAYS</div>
        </div>
        <div className="text-3xl text-cyan-400 font-bold -mt-4">:</div>
        <div className="text-center">
          <div className="text-4xl font-bold text-cyan-400 cyber-glow">{timeLeft.hours.toString().padStart(2, '0')}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">HRS</div>
        </div>
        <div className="text-3xl text-cyan-400 font-bold -mt-4">:</div>
        <div className="text-center">
          <div className="text-4xl font-bold text-cyan-400 cyber-glow">{timeLeft.minutes.toString().padStart(2, '0')}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">MIN</div>
        </div>
        <div className="text-3xl text-cyan-400 font-bold -mt-4">:</div>
        <div className="text-center">
          <div className="text-4xl font-bold text-cyan-400 cyber-glow">{timeLeft.seconds.toString().padStart(2, '0')}</div>
          <div className="text-sm text-gray-500 uppercase tracking-wider">SEC</div>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;