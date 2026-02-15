import { getDiatonicStep, fromDiatonicStep, getRandomNote, getStemDirection, isLedgerLine, formatNoteName, getNoteRange } from './noteUtils';

describe('noteUtils', () => {
  it('should correctly calculate diatonic step', () => {
    expect(getDiatonicStep({ name: 'C', octave: 4 })).toBe(0);
    expect(getDiatonicStep({ name: 'D', octave: 4 })).toBe(1);
    expect(getDiatonicStep({ name: 'C', octave: 5 })).toBe(7);
    expect(getDiatonicStep({ name: 'B', octave: 3 })).toBe(-1);
  });

  it('should correctly convert step to note', () => {
    expect(fromDiatonicStep(0)).toEqual({ name: 'C', octave: 4, diatonicStep: 0 });
    expect(fromDiatonicStep(1)).toEqual({ name: 'D', octave: 4, diatonicStep: 1 });
    expect(fromDiatonicStep(7)).toEqual({ name: 'C', octave: 5, diatonicStep: 7 });
    expect(fromDiatonicStep(-1)).toEqual({ name: 'B', octave: 3, diatonicStep: -1 });
  });

  it('should generate notes within range for treble clef', () => {
    const maxLedgerLines = 1;
    for (let i = 0; i < 100; i++) {
      const note = getRandomNote('treble', maxLedgerLines);
      const step = getDiatonicStep(note);
      expect(step).toBeGreaterThanOrEqual(1);
      expect(step).toBeLessThanOrEqual(11);
    }
  });

  it('should generate notes within range for bass clef', () => {
    const maxLedgerLines = 1;
    for (let i = 0; i < 100; i++) {
      const note = getRandomNote('bass', maxLedgerLines);
      const step = getDiatonicStep(note);
      expect(step).toBeGreaterThanOrEqual(-11);
      expect(step).toBeLessThanOrEqual(-1);
    }
  });

  it('should correctly calculate stem direction', () => {
    expect(getStemDirection({ name: 'A', octave: 4, diatonicStep: 5 }, 'treble')).toBe('up');
    expect(getStemDirection({ name: 'B', octave: 4, diatonicStep: 6 }, 'treble')).toBe('down');
    expect(getStemDirection({ name: 'C', octave: 5, diatonicStep: 7 }, 'treble')).toBe('down');

    expect(getStemDirection({ name: 'C', octave: 3, diatonicStep: -7 }, 'bass')).toBe('up');
    expect(getStemDirection({ name: 'D', octave: 3, diatonicStep: -6 }, 'bass')).toBe('down');
    expect(getStemDirection({ name: 'E', octave: 3, diatonicStep: -5 }, 'bass')).toBe('down');
  });

  it('should generate only ledger lines when requested', () => {
    const maxLedgerLines = 2;
    for (let i = 0; i < 100; i++) {
      const note = getRandomNote('treble', maxLedgerLines, true);
      const step = getDiatonicStep(note);
      const isOutside = step < 2 || step > 10;
      expect(isOutside).toBe(true);
    }

    for (let i = 0; i < 100; i++) {
      const note = getRandomNote('bass', maxLedgerLines, true);
      const step = getDiatonicStep(note);
      const isOutside = step < -10 || step > -2;
      expect(isOutside).toBe(true);
    }
  });

  it('should correctly identify ledger lines', () => {
    expect(isLedgerLine(0, 'treble')).toBe(true);
    expect(isLedgerLine(2, 'treble')).toBe(false);
    expect(isLedgerLine(10, 'treble')).toBe(false);
    expect(isLedgerLine(11, 'treble')).toBe(true);

    expect(isLedgerLine(-11, 'bass')).toBe(true);
    expect(isLedgerLine(-10, 'bass')).toBe(false);
    expect(isLedgerLine(-2, 'bass')).toBe(false);
    expect(isLedgerLine(-1, 'bass')).toBe(true);
  });

  it('should format note names correctly', () => {
    expect(formatNoteName({ name: 'C', octave: 4, diatonicStep: 0 })).toBe('C4');
    expect(formatNoteName({ name: 'F', octave: 4, accidental: '#', diatonicStep: 3 })).toBe('F#4');
  });

  it('should calculate note range correctly', () => {
    const settings = {
      clef: 'treble' as const,
      maxLedgerLines: 1,
      onlyLedgerLines: false,
      timeLimitEnabled: false,
      timeLimitSeconds: 10,
    };
    expect(getNoteRange(settings)).toEqual({ min: 1, max: 11 });

    expect(getNoteRange({ ...settings, clef: 'bass' })).toEqual({ min: -11, max: -1 });
    expect(getNoteRange({ ...settings, clef: 'both' })).toEqual({ min: -11, max: 11 });
  });
});
