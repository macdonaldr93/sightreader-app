import { useCallback } from 'react';
import type { GameSettings } from '../types/musical';
import { useScore } from './useScore';
import { useSettings } from './useSettings';
import { useNoteSelection } from './useNoteSelection';

export function useFlashcardGame(initialSettings: GameSettings) {
  const { settings, isSettingsOpen, updateSettings, openSettings, closeSettings } = useSettings(initialSettings);
  const { score, incrementCorrect, incrementTotal, resetScore } = useScore();
  const { currentNote, currentClef, isAnswerRevealed, nextNote, revealAnswer } = useNoteSelection(settings);

  const markCorrect = useCallback(() => {
    incrementCorrect();
    nextNote();
  }, [incrementCorrect, nextNote]);

  const markIncorrect = useCallback(() => {
    incrementTotal();
    nextNote();
  }, [incrementTotal, nextNote]);

  const startGame = useCallback(() => {
    closeSettings();
    resetScore();
    nextNote();
  }, [closeSettings, resetScore, nextNote]);

  const resetGame = useCallback(() => {
    openSettings();
  }, [openSettings]);

  return {
    currentNote,
    currentClef,
    isAnswerRevealed,
    settings,
    score,
    isSettingsOpen,
    nextNote,
    revealAnswer,
    markCorrect,
    markIncorrect,
    startGame,
    resetGame,
    updateSettings,
  };
}
