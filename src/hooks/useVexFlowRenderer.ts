import { useEffect, useRef, useState } from 'react';
import { Renderer, Stave, StaveNote, Formatter, Voice, Accidental } from 'vexflow/bravura';
import type { Note, Clef } from '../types/musical';
import { getStemDirection } from '../utils/noteUtils';

export interface VexFlowOptions {
  height?: number;
  stavePadding?: number;
  staveY?: number;
}

export function useVexFlowRenderer(note: Note, clef: Clef, options: VexFlowOptions = {}) {
  const {
    height = 160,
    stavePadding = 20,
    staveY: providedStaveY,
  } = options;

  const staveY = providedStaveY ?? (height / 2 - 16);

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(300);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const entryWidth = entry.contentRect.width;
        if (entryWidth > 0) {
          setWidth(entryWidth);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current || width === 0) return;

    containerRef.current.innerHTML = '';

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);

    renderer.resize(width, height);

    const context = renderer.getContext();

    const actualStaveWidth = width - stavePadding * 2;
    const stave = new Stave(stavePadding, 20, actualStaveWidth);
    stave.addClef(clef);
    stave.setContext(context).draw();

    const keys = [`${note.name}/${note.octave}`];
    const stemDirection = getStemDirection(note, clef) === 'up' ? 1 : -1;

    const staveNote = new StaveNote({
      clef: clef,
      keys: keys,
      duration: 'q',
      stemDirection: stemDirection,
    });

    if (note.accidental) {
      staveNote.addModifier(new Accidental(note.accidental));
    }

    const voice = new Voice({ numBeats: 1, beatValue: 4 });
    voice.addTickables([staveNote]);

    new Formatter().joinVoices([voice]).format([voice], actualStaveWidth);

    voice.draw(context, stave);
  }, [note, clef, width, height, stavePadding, staveY]);

  return { containerRef };
}
