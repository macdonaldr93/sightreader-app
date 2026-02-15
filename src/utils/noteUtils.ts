import type { Note, Clef, GameSettings, NoteName } from '../types/musical';

const NOTES: NoteName[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

export function getDiatonicStep(note: Pick<Note, 'name' | 'octave'>): number {
  const noteIndex = NOTES.indexOf(note.name as NoteName);
  return (note.octave - 4) * 7 + noteIndex;
}

export function fromDiatonicStep(step: number): Note {
  const name = NOTES[((step % 7) + 7) % 7];
  const octave = Math.floor(step / 7) + 4;

  return {
    name,
    octave,
    diatonicStep: step,
  };
}

export function getRandomNote(
  clef: Clef,
  maxLedgerLines: number,
  onlyLedgerLines: boolean = false
): Note {
  let min: number;
  let max: number;

  if (clef === 'treble') {
    min = 2 - maxLedgerLines * 2;
    max = 10 + maxLedgerLines * 2;
  } else {
    min = -10 - maxLedgerLines * 2;
    max = -2 + maxLedgerLines * 2;
  }

  let step: number;
  if (onlyLedgerLines) {
    const isStaffNote = (s: number) => {
      if (clef === 'treble') return s >= 2 && s <= 10;
      return s >= -10 && s <= -2;
    };

    const validSteps: number[] = [];
    for (let s = min; s <= max; s++) {
      if (!isStaffNote(s)) {
        validSteps.push(s);
      }
    }
    step = validSteps[Math.floor(Math.random() * validSteps.length)];
  } else {
    step = Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return fromDiatonicStep(step);
}

export function isLedgerLine(step: number, clef: Clef): boolean {
  if (clef === 'treble') {
    return step < 2 || step > 10;
  } else {
    return step < -10 || step > -2;
  }
}

export function getStemDirection(
  note: Pick<Note, 'diatonicStep' | 'name' | 'octave'>,
  clef: Clef
): 'up' | 'down' {
  const step = 'diatonicStep' in note ? (note.diatonicStep as number) : getDiatonicStep(note);
  const middleLineStep = clef === 'treble' ? 6 : -6;
  return step >= middleLineStep ? 'down' : 'up';
}

export function formatNoteName(note: Note): string {
  return `${note.name}${note.accidental || ''}${note.octave}`;
}

export function getNoteRange(settings: GameSettings): { min: number; max: number } {
  const { clef, maxLedgerLines } = settings;

  let min = 0;
  let max = 0;

  if (clef === 'treble') {
    min = 2 - maxLedgerLines * 2;
    max = 10 + maxLedgerLines * 2;
  } else if (clef === 'bass') {
    min = -10 - maxLedgerLines * 2;
    max = -2 + maxLedgerLines * 2;
  } else {
    const trebleMin = 2 - maxLedgerLines * 2;
    const trebleMax = 10 + maxLedgerLines * 2;
    const bassMin = -10 - maxLedgerLines * 2;
    const bassMax = -2 + maxLedgerLines * 2;
    return {
      min: Math.min(trebleMin, bassMin),
      max: Math.max(trebleMax, bassMax),
    };
  }

  return { min, max };
}
