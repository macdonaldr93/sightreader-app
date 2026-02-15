import { useState, useCallback } from 'react';
import type { Clef, Note, GameSettings } from '../types/musical';
import { getRandomNote } from '../utils/noteUtils';

export function useNoteSelection(settings: GameSettings) {
  const generateNote = useCallback((currentSettings: GameSettings): { note: Note, clef: Clef } => {
    const clef: Clef = currentSettings.clef === 'both' 
      ? (Math.random() > 0.5 ? 'treble' : 'bass') 
      : currentSettings.clef;
    
    return {
      note: getRandomNote(clef, currentSettings.maxLedgerLines, currentSettings.onlyLedgerLines),
      clef
    };
  }, []);

  const [gameState, setGameState] = useState(() => generateNote(settings));
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const nextNote = useCallback(() => {
    setGameState(generateNote(settings));
    setIsAnswerRevealed(false);
  }, [generateNote, settings]);

  const setNote = useCallback((note: Note, clef: Clef) => {
    setGameState({ note, clef });
    setIsAnswerRevealed(false);
  }, []);

  const revealAnswer = useCallback(() => {
    setIsAnswerRevealed(true);
  }, []);

  return {
    currentNote: gameState.note,
    currentClef: gameState.clef,
    isAnswerRevealed,
    nextNote,
    setNote,
    revealAnswer,
  };
}
