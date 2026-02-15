import { useCallback, useState } from 'react';
import type { GameSettings } from '../types/musical';
import { useScore } from './useScore';
import { useSettings } from './useSettings';
import { useNoteSelection } from './useNoteSelection';
import { useTimer } from './useTimer';
import { useReviewMode } from './useReviewMode';

export function useFlashcardGame(initialSettings: GameSettings) {
  const { settings, isSettingsOpen, updateSettings, openSettings, closeSettings } = useSettings(initialSettings);
  const { score, incrementCorrect, incrementTotal, resetScore } = useScore();
  const { currentNote, currentClef, isAnswerRevealed, nextNote, setNote, revealAnswer } = useNoteSelection(settings);
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  
  const {
    isReviewMode,
    isReviewFinished,
    canReview,
    reviewQueueSize,
    currentReviewNote,
    addIncorrectNote,
    startReview: initiateReview,
    stopReview,
    moveToNext,
    requeueCurrent,
    resetReview,
    clearFinished,
  } = useReviewMode();

  const handleTimeout = useCallback(() => {
    revealAnswer();
    setIsTimeExpired(true);
  }, [revealAnswer]);

  const { progress, isRunning, timeLeft, reset: resetTimer } = useTimer(
    settings.timeLimitEnabled && !isAnswerRevealed && !isSettingsOpen,
    settings.timeLimitSeconds,
    handleTimeout
  );

  const handleNextNote = useCallback(() => {
    if (isReviewMode && currentReviewNote) {
      setNote(currentReviewNote.note, currentReviewNote.clef);
    } else {
      nextNote();
    }
    setIsTimeExpired(false);
    resetTimer();
  }, [isReviewMode, currentReviewNote, nextNote, setNote, resetTimer]);

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
  }, [isReviewMode, moveToNext, nextNote, setNote, incrementCorrect, handleNextNote, resetTimer]);

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
  }, [isReviewMode, requeueCurrent, currentNote, currentClef, addIncorrectNote, incrementTotal, handleNextNote, setNote, resetTimer]);

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
  }, [isReviewMode, stopReview, initiateReview, setNote, nextNote, resetTimer]);

  const startGame = useCallback(() => {
    closeSettings();
    resetScore();
    resetReview();
    nextNote();
    setIsTimeExpired(false);
    resetTimer();
  }, [closeSettings, resetScore, resetReview, nextNote, resetTimer]);

  const resetGame = useCallback(() => {
    openSettings();
  }, [openSettings]);

  return {
    currentNote,
    currentClef,
    isAnswerRevealed,
    isTimeExpired,
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
    resetGame,
    updateSettings,
    toggleReview,
    clearFinished,
  };
}
