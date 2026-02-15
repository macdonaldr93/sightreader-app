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

  it('should handle review mode logic', () => {
    const { result } = renderHook(() => useFlashcardGame(initialSettings));
    
    act(() => {
      result.current.startGame();
    });

    const firstNote = result.current.currentNote;
    const firstClef = result.current.currentClef;

    act(() => {
      result.current.markIncorrect();
    });

    expect(result.current.canReview).toBe(true);
    expect(result.current.isReviewMode).toBe(false);

    act(() => {
      result.current.toggleReview();
    });

    expect(result.current.isReviewMode).toBe(true);
    expect(result.current.reviewQueueSize).toBe(1);
    expect(result.current.currentNote).toEqual(firstNote);
    expect(result.current.currentClef).toEqual(firstClef);

    act(() => {
      result.current.toggleReview();
    });

    expect(result.current.isReviewMode).toBe(false);
    expect(result.current.canReview).toBe(true);

    act(() => {
      result.current.toggleReview();
    });

    expect(result.current.isReviewMode).toBe(true);

    act(() => {
      result.current.markIncorrect();
    });

    expect(result.current.isReviewMode).toBe(true);
    expect(result.current.reviewQueueSize).toBe(1);
    expect(result.current.currentNote).toEqual(firstNote);

    act(() => {
      result.current.markCorrect();
    });

    expect(result.current.isReviewMode).toBe(false);
    expect(result.current.reviewQueueSize).toBe(0);
    expect(result.current.canReview).toBe(false);
  });

  it('should handle multiple notes in review mode', () => {
    const { result } = renderHook(() => useFlashcardGame(initialSettings));
    
    act(() => {
      result.current.startGame();
    });

    const note1 = { ...result.current.currentNote };

    act(() => {
      result.current.markIncorrect();
    });

    const note2 = { ...result.current.currentNote };

    act(() => {
      result.current.markIncorrect();
    });

    expect(result.current.canReview).toBe(true);

    act(() => {
      result.current.toggleReview();
    });

    expect(result.current.reviewQueueSize).toBe(2);

    const currentInReview = result.current.currentNote;
    expect([note1.diatonicStep, note2.diatonicStep]).toContain(currentInReview.diatonicStep);

    act(() => {
      result.current.markCorrect();
    });

    expect(result.current.reviewQueueSize).toBe(1);
    expect(result.current.isReviewMode).toBe(true);

    act(() => {
      result.current.markCorrect();
    });

    expect(result.current.isReviewMode).toBe(false);
    expect(result.current.reviewQueueSize).toBe(0);
  });
});
