import { useCallback, useEffect, useState } from 'react';
import type { GameSettings } from '../types/musical';
import { useScore } from './useScore';
import { useSettings } from './useSettings';
import { useNoteSelection } from './useNoteSelection';
import { useReviewMode } from './useReviewMode';
import { useGameStatePersistence } from './useGameStatePersistence';
import { useGameTimer } from './useGameTimer';

export function useFlashcardGame(initialSettings: GameSettings, height?: number) {
  const { initialPersistedState, saveState, flushSave } = useGameStatePersistence();

  const { settings, isSettingsOpen, updateSettings, openSettings, closeSettings } = useSettings(
    initialSettings,
    !initialPersistedState
  );

  const [isPaused, setIsPaused] = useState(!!initialPersistedState);

  const { score, incrementCorrect, incrementTotal, resetScore } = useScore(
    initialPersistedState?.score
  );

  const {
    currentNote,
    currentClef,
    isAnswerRevealed,
    nextNote,
    setNote,
    revealAnswer: revealInternal,
  } = useNoteSelection(settings, height, initialPersistedState?.noteSelection);

  const {
    isReviewMode,
    isReviewFinished,
    canReview,
    reviewQueueSize,
    currentReviewNote,
    incorrectNotes,
    reviewQueue,
    addIncorrectNote,
    startReview: initiateReview,
    stopReview,
    moveToNext,
    requeueCurrent,
    resetReview,
    clearFinished,
  } = useReviewMode(initialPersistedState?.review);

  const { isTimeExpired, setIsTimeExpired, progress, isRunning, timeLeft, resetTimer } =
    useGameTimer(
      settings.timeLimitEnabled,
      settings.timeLimitSeconds,
      isAnswerRevealed || isSettingsOpen || isPaused,
      revealInternal
    );

  useEffect(() => {
    saveState({
      score,
      noteSelection: {
        note: currentNote,
        clef: currentClef,
        isAnswerRevealed,
      },
      review: {
        incorrectNotes,
        reviewQueue,
        isReviewMode,
      },
    });
  }, [
    score,
    currentNote,
    currentClef,
    isAnswerRevealed,
    incorrectNotes,
    reviewQueue,
    isReviewMode,
    saveState,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushSave();
      }
    };

    const handlePageHide = () => {
      flushSave();
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [flushSave]);

  const revealAnswer = useCallback(() => {
    revealInternal();
    resetTimer();
  }, [revealInternal, resetTimer]);

  const handleNextNote = useCallback(() => {
    if (isReviewMode && currentReviewNote) {
      setNote(currentReviewNote.note, currentReviewNote.clef);
    } else {
      nextNote();
    }
    setIsTimeExpired(false);
    resetTimer();
  }, [isReviewMode, currentReviewNote, nextNote, setNote, setIsTimeExpired, resetTimer]);

  const markCorrect = useCallback(() => {
    if (isReviewMode) {
      const next = moveToNext();
      if (next) {
        setNote(next.note, next.clef);
      } else {
        nextNote();
      }
      setIsTimeExpired(false);
      resetTimer();
    } else {
      incrementCorrect();
      handleNextNote();
    }
  }, [
    isReviewMode,
    moveToNext,
    nextNote,
    setNote,
    incrementCorrect,
    handleNextNote,
    setIsTimeExpired,
    resetTimer,
  ]);

  const markIncorrect = useCallback(() => {
    if (isReviewMode) {
      const next = requeueCurrent();
      if (next) {
        setNote(next.note, next.clef);
      }
      setIsTimeExpired(false);
      resetTimer();
    } else {
      addIncorrectNote(currentNote, currentClef);
      incrementTotal();
      handleNextNote();
    }
  }, [
    isReviewMode,
    requeueCurrent,
    currentNote,
    currentClef,
    addIncorrectNote,
    incrementTotal,
    handleNextNote,
    setNote,
    setIsTimeExpired,
    resetTimer,
  ]);

  const handleTimeoutContinue = useCallback(() => {
    markIncorrect();
  }, [markIncorrect]);

  const toggleReview = useCallback(() => {
    if (isReviewMode) {
      stopReview();
      nextNote();
      setIsTimeExpired(false);
      resetTimer();
    } else {
      const first = initiateReview();
      if (first) {
        setNote(first.note, first.clef);
        setIsTimeExpired(false);
        resetTimer();
      }
    }
  }, [isReviewMode, stopReview, initiateReview, setNote, nextNote, setIsTimeExpired, resetTimer]);

  const startGame = useCallback(() => {
    closeSettings();
    setIsPaused(false);
    resetScore();
    resetReview();
    nextNote();
    setIsTimeExpired(false);
    resetTimer();
  }, [closeSettings, resetScore, resetReview, nextNote, setIsTimeExpired, resetTimer]);

  const resumeGame = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetGame = useCallback(() => {
    openSettings();
  }, [openSettings]);

  return {
    currentNote,
    currentClef,
    isAnswerRevealed,
    isTimeExpired,
    isPaused,
    timerProgress: progress,
    timerIsRunning: isRunning,
    timerTimeLeft: timeLeft,
    settings,
    score,
    isSettingsOpen,
    isReviewMode,
    isReviewFinished,
    reviewQueueSize,
    canReview,
    nextNote: handleNextNote,
    revealAnswer,
    markCorrect,
    markIncorrect,
    handleTimeoutContinue,
    startGame,
    resumeGame,
    resetGame,
    updateSettings,
    toggleReview,
    clearFinished,
  };
}
