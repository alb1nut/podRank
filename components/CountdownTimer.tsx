"use client";

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  startTime: number;
  duration: number;
  onComplete: () => void;
}

export function CountdownTimer({ startTime, duration, onComplete }: CountdownTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(0, Math.ceil((duration - (Date.now() - startTime)) / 1000))
  );

  useEffect(() => {
    if (remainingSeconds <= 0) {
      onComplete();
      return;
    }

    const interval = setInterval(() => {
      const newRemaining = Math.max(0, Math.ceil((duration - (Date.now() - startTime)) / 1000));
      setRemainingSeconds(newRemaining);
      
      if (newRemaining <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration, onComplete, remainingSeconds]);

  return <span className="text-white text-sm block mt-1">{remainingSeconds}s</span>;
}