import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer(enabled: boolean, durationSeconds: number, onTimeout: () => void) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const startTimeRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const reset = useCallback(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    startTimeRef.current = null;
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  const isActuallyRunning = enabled && timeLeft > 0;

  useEffect(() => {
    if (isActuallyRunning) {
      startTimeRef.current = performance.now();
      
      timeoutRef.current = window.setTimeout(() => {
        setTimeLeft(0);
        onTimeoutRef.current();
      }, timeLeft * 1000);
    } else {
      if (startTimeRef.current !== null) {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        setTimeLeft((prev) => Math.max(0, prev - elapsed));
        startTimeRef.current = null;
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isActuallyRunning, timeLeft]);

  const progress = timeLeft / durationSeconds;

  return {
    timeLeft,
    progress,
    isRunning: isActuallyRunning,
    durationSeconds,
    reset,
  };
}
