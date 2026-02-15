import type { Note, Clef } from '../../types/musical';
import { useVexFlowRenderer, type VexFlowOptions } from '../../hooks/useVexFlowRenderer';
import styles from './NoteRenderer.module.css';

interface NoteRendererProps extends VexFlowOptions {
  note: Note;
  clef: Clef;
  onClick?: () => void;
}

export function NoteRenderer({ note, clef, onClick, ...options }: NoteRendererProps) {
  const { containerRef } = useVexFlowRenderer(note, clef, options);

  return (
    <div className={styles.container} onClick={onClick}>
      <div ref={containerRef} className={styles.renderer}></div>
    </div>
  );
}
