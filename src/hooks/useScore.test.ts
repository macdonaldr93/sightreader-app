import { renderHook, act } from '@testing-library/react';
import { useScore } from './useScore';

describe('useScore', () => {
  it('should initialize with zero score', () => {
    const { result } = renderHook(() => useScore());
    expect(result.current.score).toEqual({ correct: 0, total: 0 });
  });

  it('should increment correct and total', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.incrementCorrect();
    });
    expect(result.current.score).toEqual({ correct: 1, total: 1 });
  });

  it('should increment only total', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.incrementTotal();
    });
    expect(result.current.score).toEqual({ correct: 0, total: 1 });
  });

  it('should reset score', () => {
    const { result } = renderHook(() => useScore());
    act(() => {
      result.current.incrementCorrect();
      result.current.resetScore();
    });
    expect(result.current.score).toEqual({ correct: 0, total: 0 });
  });
});
