import { useState, useCallback, useMemo } from 'react';
import type { Note, Clef } from '../types/musical';

export function useReviewMode() {
  const [incorrectNotes, setIncorrectNotes] = useState<{ note: Note; clef: Clef }[]>([]);
  const [reviewQueue, setReviewQueue] = useState<{ note: Note; clef: Clef }[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isReviewFinished, setIsReviewFinished] = useState(false);

  const canReview = useMemo(() => incorrectNotes.length > 0 || isReviewMode, [incorrectNotes, isReviewMode]);
  const reviewQueueSize = useMemo(() => reviewQueue.length, [reviewQueue]);
  const currentReviewNote = useMemo(() => (reviewQueue.length > 0 ? reviewQueue[0] : null), [reviewQueue]);

  const addIncorrectNote = useCallback((note: Note, clef: Clef) => {
    setIsReviewFinished(false);
    setIncorrectNotes(prev => {
      const alreadyExists = prev.some(
        n => n.note.name === note.name && n.note.octave === note.octave && n.clef === clef
      );
      if (alreadyExists) return prev;
      return [...prev, { note, clef }];
    });
  }, []);

  const startReview = useCallback(() => {
    if (incorrectNotes.length === 0) return null;

    const shuffled = [...incorrectNotes].sort(() => Math.random() - 0.5);
    setReviewQueue(shuffled);
    setIncorrectNotes([]);
    setIsReviewMode(true);
    setIsReviewFinished(false);

    return shuffled[0];
  }, [incorrectNotes]);

  const moveToNext = useCallback(() => {
    const newQueue = reviewQueue.slice(1);
    setReviewQueue(newQueue);
    
    if (newQueue.length === 0) {
      setIsReviewMode(false);
      setIsReviewFinished(true);
      return null;
    }
    
    return newQueue[0];
  }, [reviewQueue]);

  const requeueCurrent = useCallback(() => {
    if (reviewQueue.length === 0) return null;
    
    const current = reviewQueue[0];
    const newQueue = [...reviewQueue.slice(1), current];
    setReviewQueue(newQueue);
    
    return newQueue[0];
  }, [reviewQueue]);

  const resetReview = useCallback(() => {
    setIncorrectNotes([]);
    setReviewQueue([]);
    setIsReviewMode(false);
    setIsReviewFinished(false);
  }, []);

  const stopReview = useCallback(() => {
    setIncorrectNotes(prev => [...prev, ...reviewQueue]);
    setReviewQueue([]);
    setIsReviewMode(false);
    setIsReviewFinished(false);
  }, [reviewQueue]);

  const clearFinished = useCallback(() => {
    setIsReviewFinished(false);
  }, []);

  return {
    isReviewMode,
    isReviewFinished,
    canReview,
    reviewQueueSize,
    currentReviewNote,
    addIncorrectNote,
    startReview,
    stopReview,
    moveToNext,
    requeueCurrent,
    resetReview,
    clearFinished,
  };
}
