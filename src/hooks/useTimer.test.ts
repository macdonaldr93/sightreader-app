import { renderHook, act } from '@testing-library/react';
import { useTimer } from './useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with full progress', () => {
    const { result } = renderHook(() => useTimer(true, 10, () => {}));
    expect(result.current.progress).toBe(1);
    expect(result.current.timeLeft).toBe(10);
  });

  it('should decrease timeLeft over time', () => {
    const { result, rerender } = renderHook(({ enabled }) => useTimer(enabled, 10, () => {}), {
      initialProps: { enabled: true }
    });
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    rerender({ enabled: false });
    
    expect(result.current.timeLeft).toBeLessThan(10);
    expect(result.current.progress).toBeLessThan(1);
  });

  it('should call onTimeout when time is up', () => {
    const onTimeout = vi.fn();
    renderHook(() => useTimer(true, 1, onTimeout));
    
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    
    expect(onTimeout).toHaveBeenCalled();
  });

  it('should use the latest onTimeout callback', () => {
    const onTimeout1 = vi.fn();
    const onTimeout2 = vi.fn();
    const { rerender } = renderHook(
      ({ onTimeout }) => useTimer(true, 1, onTimeout),
      { initialProps: { onTimeout: onTimeout1 } }
    );
    
    rerender({ onTimeout: onTimeout2 });
    
    act(() => {
      vi.advanceTimersByTime(1100);
    });
    
    expect(onTimeout1).not.toHaveBeenCalled();
    expect(onTimeout2).toHaveBeenCalled();
  });

  it('should reset time', () => {
    const { result, rerender } = renderHook(({ enabled }) => useTimer(enabled, 10, () => {}), {
      initialProps: { enabled: true }
    });
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    rerender({ enabled: false });
    expect(result.current.timeLeft).toBeLessThan(10);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.timeLeft).toBe(10);
  });

  it('should not decrease time if disabled', () => {
    const { result } = renderHook(() => useTimer(false, 10, () => {}));
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.timeLeft).toBe(10);
  });
});
