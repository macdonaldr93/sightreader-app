import React from 'react';
import type { GameSettings } from '../../types/musical';
import styles from './Settings.module.css';

interface SettingsProps {
  settings: GameSettings;
  onUpdate: (newSettings: Partial<GameSettings>) => void;
  onStart: () => void;
  isOpen: boolean;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate, onStart, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h1 className={styles.title}>Sight Reader</h1>
        
        <div className={styles.field}>
          <label className={styles.label}>Clef</label>
          <div className={styles.buttonGroup}>
            {(['treble', 'bass', 'both'] as const).map(c => (
              <button
                key={c}
                className={settings.clef === c ? styles.active : ''}
                onClick={() => onUpdate({ clef: c })}
              >
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className={styles.field}>
          <label className={styles.label}>Notes</label>
          <div className={styles.buttonGroup}>
            <button
              className={!settings.onlyLedgerLines ? styles.active : ''}
              onClick={() => onUpdate({ onlyLedgerLines: false })}
            >
              All
            </button>
            <button
              className={settings.onlyLedgerLines ? styles.active : ''}
              onClick={() => onUpdate({ onlyLedgerLines: true })}
            >
              Ledger Lines
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Max Ledger Lines: {settings.maxLedgerLines}</label>
          <input
            type="range"
            min="0"
            max="6"
            value={settings.maxLedgerLines}
            onChange={(e) => onUpdate({ maxLedgerLines: parseInt(e.target.value) })}
            className={styles.range}
          />
        </div>

        <button className={styles.startButton} onClick={onStart}>
          Start Game
        </button>
      </div>
    </div>
  );
};
