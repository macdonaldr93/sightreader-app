import { renderHook, act } from '@testing-library/react';
import { usePracticeTracker } from './usePracticeTracker';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('usePracticeTracker', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-15T12:00:00Z')); // A Sunday
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with zero seconds', () => {
    const { result } = renderHook(() => usePracticeTracker(false));
    expect(result.current.totalSeconds).toBe(0);
    expect(result.current.thisWeekSeconds).toBe(0);
  });

  it('tracks time via interval', () => {
    const { result } = renderHook(() => usePracticeTracker(true));

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.totalSeconds).toBe(10);
  });

  it('tracks time when stopping session', () => {
    const { result, rerender } = renderHook(({ isActive }) => usePracticeTracker(isActive), {
      initialProps: { isActive: true },
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      rerender({ isActive: false });
    });

    expect(result.current.totalSeconds).toBe(5);
  });

  it('calculates this week seconds correctly', () => {
    // Manually set some data
    localStorage.setItem(
      'ledger-practice-data',
      JSON.stringify({
        '2026-02-15': 100, // Today (Sunday)
        '2026-02-14': 200, // Yesterday (Saturday)
        '2026-02-08': 500, // Last Sunday (exactly 1 week ago)
        '2026-02-01': 1000, // Long ago
      })
    );

    const { result } = renderHook(() => usePracticeTracker(false));
    
    // startOfWeek(Feb 15) is Feb 15 (Sunday)
    // Wait, date-fns startOfWeek(Feb 15) is Feb 15.
    // So "this week" includes today and anything after Feb 15 00:00.
    
    expect(result.current.totalSeconds).toBe(1800);
    expect(result.current.thisWeekSeconds).toBe(100); 
  });
});
