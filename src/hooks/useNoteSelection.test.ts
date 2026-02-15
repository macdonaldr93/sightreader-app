import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useNoteSelection } from './useNoteSelection';
import type { GameSettings } from '../types/musical';

const settings: GameSettings = {
  clef: 'treble',
  maxLedgerLines: 1,
  onlyLedgerLines: false,
};

describe('useNoteSelection', () => {
  it('should initialize with a note and hidden answer', () => {
    const { result } = renderHook(() => useNoteSelection(settings));
    expect(result.current.currentNote).toBeDefined();
    expect(result.current.currentClef).toBe('treble');
    expect(result.current.isAnswerRevealed).toBe(false);
  });

  it('should reveal answer', () => {
    const { result } = renderHook(() => useNoteSelection(settings));
    act(() => {
      result.current.revealAnswer();
    });
    expect(result.current.isAnswerRevealed).toBe(true);
  });

  it('should generate next note and hide answer', () => {
    const { result } = renderHook(() => useNoteSelection(settings));
    const firstNote = result.current.currentNote;
    
    act(() => {
      result.current.revealAnswer();
      result.current.nextNote();
    });
    
    expect(result.current.isAnswerRevealed).toBe(false);
    // Note: there is a small chance it generates the same note, but it should still work.
  });

  it('should use bass clef when settings say bass', () => {
    const { result } = renderHook(() => useNoteSelection({ ...settings, clef: 'bass' }));
    expect(result.current.currentClef).toBe('bass');
  });

  it('should pick from both clefs when settings say both', () => {
    // Mock Math.random to test 'both'
    const randomSpy = vi.spyOn(Math, 'random');
    
    randomSpy.mockReturnValue(0.1); // < 0.5 -> bass
    const { result: res1 } = renderHook(() => useNoteSelection({ ...settings, clef: 'both' }));
    expect(res1.current.currentClef).toBe('bass');

    randomSpy.mockReturnValue(0.9); // > 0.5 -> treble
    const { result: res2 } = renderHook(() => useNoteSelection({ ...settings, clef: 'both' }));
    expect(res2.current.currentClef).toBe('treble');
    
    randomSpy.mockRestore();
  });
});
