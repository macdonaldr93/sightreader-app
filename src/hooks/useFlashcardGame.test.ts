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
    const randomSpy = vi.spyOn(Math, 'random');
    const { result } = renderHook(() => useFlashcardGame(initialSettings));

    act(() => {
      result.current.startGame();
    });

    // Mock random to get first note
    randomSpy.mockReturnValue(0.1);
    const note1 = { ...result.current.currentNote };

    act(() => {
      result.current.markIncorrect();
    });

    // Mock random to get a different second note
    randomSpy.mockReturnValue(0.9);
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
    randomSpy.mockRestore();
  });

  it('should reset timer when answer is revealed', () => {
    vi.useFakeTimers();
    const settingsWithTimer = { ...initialSettings, timeLimitEnabled: true };
    const { result } = renderHook(() => useFlashcardGame(settingsWithTimer));

    act(() => {
      result.current.startGame();
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    // In useTimer, timeLeft only updates when paused/stopped
    // But since startGame sets isSettingsOpen to false, it starts running.
    // To check timeLeft, we need to "pause" it or check progress if it were JS-driven.
    // Actually, useTimer updates timeLeft when isActuallyRunning becomes false.

    act(() => {
      result.current.revealAnswer();
    });

    expect(result.current.timerTimeLeft).toBe(10);
    vi.useRealTimers();
  });

  it('should pass height to note selection and constrain ledger lines', () => {
    const manyLedgerLines: GameSettings = { ...initialSettings, maxLedgerLines: 6 };
    // Treble max with 6 lines = 10 + 12 = 22
    // Treble max with 3 lines = 10 + 6 = 16

    const { result } = renderHook(() => useFlashcardGame(manyLedgerLines, 300));

    act(() => {
      result.current.startGame();
    });

    for (let i = 0; i < 50; i++) {
      act(() => {
        result.current.nextNote();
      });
      expect(result.current.currentNote.diatonicStep).toBeLessThanOrEqual(16);
    }
  });
});
