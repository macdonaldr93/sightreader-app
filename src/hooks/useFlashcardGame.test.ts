import { renderHook, act } from '@testing-library/react';
import { useFlashcardGame } from './useFlashcardGame';
import type { GameSettings } from '../types/musical';

const initialSettings: GameSettings = {
  clef: 'treble',
  maxLedgerLines: 1,
  onlyLedgerLines: false,
  timeLimitEnabled: false,
  timeLimitSeconds: 10,
};

describe('useFlashcardGame', () => {
  it('should initialize with settings and score', () => {
    const { result } = renderHook(() => useFlashcardGame(initialSettings));
    expect(result.current.settings).toEqual(initialSettings);
    expect(result.current.score).toEqual({ correct: 0, total: 0 });
    expect(result.current.isSettingsOpen).toBe(true);
  });

  it('should start game and update score', () => {
    const { result } = renderHook(() => useFlashcardGame(initialSettings));
    
    act(() => {
      result.current.startGame();
    });
    
    expect(result.current.isSettingsOpen).toBe(false);
    
    act(() => {
      result.current.markCorrect();
    });
    
    expect(result.current.score).toEqual({ correct: 1, total: 1 });
    
    act(() => {
      result.current.markIncorrect();
    });
    
    expect(result.current.score).toEqual({ correct: 1, total: 2 });
  });

  it('should handle timeout continue', () => {
    const { result } = renderHook(() => useFlashcardGame(initialSettings));
    
    act(() => {
      result.current.startGame();
      result.current.handleTimeoutContinue();
    });
    
    expect(result.current.score).toEqual({ correct: 0, total: 1 });
  });

  it('should reset game to settings screen', () => {
    const { result } = renderHook(() => useFlashcardGame(initialSettings));
    
    act(() => {
      result.current.startGame();
      result.current.resetGame();
    });
    
    expect(result.current.isSettingsOpen).toBe(true);
  });
});
