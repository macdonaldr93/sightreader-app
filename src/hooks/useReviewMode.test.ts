import { renderHook, act } from '@testing-library/react';
import { useReviewMode } from './useReviewMode';
import type { Note, Clef } from '../types/musical';

const mockNote1: Note = { name: 'C', octave: 4, diatonicStep: 0 };
const mockNote2: Note = { name: 'D', octave: 4, diatonicStep: 1 };
const mockClef: Clef = 'treble';

describe('useReviewMode', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useReviewMode());
    expect(result.current.isReviewMode).toBe(false);
    expect(result.current.canReview).toBe(false);
    expect(result.current.reviewQueueSize).toBe(0);
    expect(result.current.currentReviewNote).toBe(null);
  });

  it('should add incorrect notes and allow starting review', () => {
    const { result } = renderHook(() => useReviewMode());

    act(() => {
      result.current.addIncorrectNote(mockNote1, mockClef);
    });

    expect(result.current.canReview).toBe(true);

    let firstNote;
    act(() => {
      firstNote = result.current.startReview();
    });

    expect(result.current.isReviewMode).toBe(true);
    expect(result.current.reviewQueueSize).toBe(1);
    expect(firstNote).toEqual({ note: mockNote1, clef: mockClef });
    expect(result.current.currentReviewNote).toEqual({ note: mockNote1, clef: mockClef });
    expect(result.current.canReview).toBe(true);
  });

  it('should not add duplicate notes', () => {
    const { result } = renderHook(() => useReviewMode());

    act(() => {
      result.current.addIncorrectNote(mockNote1, mockClef);
      result.current.addIncorrectNote(mockNote1, mockClef);
    });

    act(() => {
      result.current.startReview();
    });

    expect(result.current.reviewQueueSize).toBe(1);
  });

  it('should handle moving to next and finishing review', () => {
    const { result } = renderHook(() => useReviewMode());

    act(() => {
      result.current.addIncorrectNote(mockNote1, mockClef);
      result.current.addIncorrectNote(mockNote2, mockClef);
    });

    act(() => {
      result.current.startReview();
    });

    expect(result.current.reviewQueueSize).toBe(2);

    act(() => {
      const next = result.current.moveToNext();
      expect(next).not.toBeNull();
    });

    expect(result.current.reviewQueueSize).toBe(1);

    act(() => {
      const next = result.current.moveToNext();
      expect(next).toBeNull();
    });

    expect(result.current.isReviewMode).toBe(false);
    expect(result.current.reviewQueueSize).toBe(0);
  });

  it('should handle requeueing current note', () => {
    const { result } = renderHook(() => useReviewMode());

    act(() => {
      result.current.addIncorrectNote(mockNote1, mockClef);
      result.current.addIncorrectNote(mockNote2, mockClef);
    });

    act(() => {
      result.current.startReview();
    });

    const initialCurrent = result.current.currentReviewNote;

    act(() => {
      const next = result.current.requeueCurrent();
      expect(next).not.toEqual(initialCurrent);
    });

    expect(result.current.reviewQueueSize).toBe(2);
    expect(result.current.currentReviewNote).not.toEqual(initialCurrent);
  });

  it('should reset review state', () => {
    const { result } = renderHook(() => useReviewMode());

    act(() => {
      result.current.addIncorrectNote(mockNote1, mockClef);
      result.current.startReview();
      result.current.resetReview();
    });

    expect(result.current.isReviewMode).toBe(false);
    expect(result.current.canReview).toBe(false);
    expect(result.current.reviewQueueSize).toBe(0);
  });

  it('should handle stopping review and moving notes back to incorrectNotes', () => {
    const { result } = renderHook(() => useReviewMode());

    act(() => {
      result.current.addIncorrectNote(mockNote1, mockClef);
      result.current.addIncorrectNote(mockNote2, mockClef);
    });

    act(() => {
      result.current.startReview();
    });

    expect(result.current.reviewQueueSize).toBe(2);

    act(() => {
      result.current.stopReview();
    });

    expect(result.current.isReviewMode).toBe(false);
    expect(result.current.reviewQueueSize).toBe(0);
    expect(result.current.canReview).toBe(true);
  });

  it('should track and clear review finished state', () => {
    const { result } = renderHook(() => useReviewMode());

    act(() => {
      result.current.addIncorrectNote(mockNote1, mockClef);
      result.current.startReview();
    });

    expect(result.current.isReviewFinished).toBe(false);

    act(() => {
      result.current.moveToNext();
    });

    expect(result.current.isReviewFinished).toBe(true);
    expect(result.current.isReviewMode).toBe(false);

    act(() => {
      result.current.clearFinished();
    });

    expect(result.current.isReviewFinished).toBe(false);
  });
});
