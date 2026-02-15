export type Clef = 'treble' | 'bass';

export type NoteName = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';

export interface Note {
  name: NoteName;
  octave: number;
  accidental?: string;
  diatonicStep: number;
}

export interface GameSettings {
  clef: Clef | 'both';
  maxLedgerLines: number;
  onlyLedgerLines: boolean;
  timeLimitEnabled: boolean;
  timeLimitSeconds: number;
}
