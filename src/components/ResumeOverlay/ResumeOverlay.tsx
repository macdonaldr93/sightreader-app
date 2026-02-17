import React, { useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import styles from './ResumeOverlay.module.css';

interface ResumeOverlayProps {
  isVisible: boolean;
  onResume: () => void;
}

export function ResumeOverlay({ isVisible, onResume }: ResumeOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible) {
      overlayRef.current?.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onResume();
    }
  };

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      onClick={onResume}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Resume session"
    >
      <div className={styles.content}>
        <Play size={64} className={styles.icon} aria-hidden="true" />
        <h2 className={styles.title}>Session Paused</h2>
        <p className={styles.subtitle}>Tap or press space to resume</p>
      </div>
    </div>
  );
}
