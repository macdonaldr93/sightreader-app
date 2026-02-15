import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import type { GameSettings } from '../../types/musical';
import { formatDuration } from '../../utils/timeUtils';
import styles from './Settings.module.css';

interface SettingsProps {
  settings: GameSettings;
  onUpdate: (newSettings: Partial<GameSettings>) => void;
  onStart: () => void;
  isOpen: boolean;
  totalSeconds?: number;
  thisWeekSeconds?: number;
}

export function Settings({
  settings,
  onUpdate,
  onStart,
  isOpen,
  totalSeconds = 0,
  thisWeekSeconds = 0,
}: SettingsProps) {
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className={styles.modalContent}>
        <h1 id="modal-title" className={styles.title}>
          Ledger
        </h1>

        <button className={styles.startButton} onClick={onStart}>
          Start Game
        </button>

        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>This Week</span>
            <span className={styles.statValue}>{formatDuration(thisWeekSeconds)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{formatDuration(totalSeconds)}</span>
          </div>
        </div>

        <div className={styles.dropdownContainer}>
          <button
            className={styles.dropdownHeader}
            onClick={() => setIsSettingsExpanded(!isSettingsExpanded)}
            aria-expanded={isSettingsExpanded}
            aria-controls="settings-content"
          >
            <span>Settings</span>
            {isSettingsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {isSettingsExpanded && (
            <div id="settings-content" className={styles.settingsContent}>
              <div className={styles.field}>
                <label className={styles.label}>Clef</label>
                <div className={styles.buttonGroup}>
                  {(['treble', 'bass', 'both'] as const).map((c) => (
                    <button
                      key={c}
                      className={clsx({ [styles.active]: settings.clef === c })}
                      onClick={() => onUpdate({ clef: c })}
                      aria-pressed={settings.clef === c}
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
                    className={clsx({ [styles.active]: !settings.onlyLedgerLines })}
                    onClick={() => onUpdate({ onlyLedgerLines: false })}
                    aria-pressed={!settings.onlyLedgerLines}
                  >
                    All
                  </button>
                  <button
                    className={clsx({ [styles.active]: settings.onlyLedgerLines })}
                    onClick={() => onUpdate({ onlyLedgerLines: true })}
                    aria-pressed={settings.onlyLedgerLines}
                  >
                    Ledger Lines
                  </button>
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label} id="ledger-lines-label">
                  Max Ledger Lines: {settings.maxLedgerLines}
                </label>
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={settings.maxLedgerLines}
                  onChange={(e) => onUpdate({ maxLedgerLines: parseInt(e.target.value) })}
                  className={styles.range}
                  aria-labelledby="ledger-lines-label"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} id="time-limit-label">
                  Time Limit:{' '}
                  {settings.timeLimitEnabled ? `${settings.timeLimitSeconds} seconds` : 'Off'}
                </label>
                <input
                  type="range"
                  min="1"
                  max="31"
                  value={settings.timeLimitEnabled ? settings.timeLimitSeconds : 31}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (val === 31) {
                      onUpdate({ timeLimitEnabled: false });
                    } else {
                      onUpdate({ timeLimitEnabled: true, timeLimitSeconds: val });
                    }
                  }}
                  className={styles.range}
                  aria-labelledby="time-limit-label"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
