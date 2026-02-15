import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import styles from './GameControls.module.css';

interface GameControlsProps {
  isAnswerRevealed: boolean;
  isTimeExpired?: boolean;
  answer: string;
  onTap: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
  onTimeoutContinue?: () => void;
}

export function GameControls({
  isAnswerRevealed,
  isTimeExpired,
  answer,
  onTap,
  onCorrect,
  onIncorrect,
  onTimeoutContinue,
}: GameControlsProps) {
  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.feedbackArea}>
        {isAnswerRevealed ? (
          <div className={styles.feedbackControls}>
            {isTimeExpired ? (
              <>
                <div style={{ width: 48 }} />
                <div className={styles.answer} aria-live="polite">
                  {answer}
                </div>
                <button
                  className={clsx(styles.feedbackButton, styles.right)}
                  onClick={(e) => handleAction(e, onTimeoutContinue || (() => {}))}
                  aria-label={`Correct answer is ${answer}. Continue to next note.`}
                >
                  <ArrowRight size={40} />
                </button>
              </>
            ) : (
              <>
                <button
                  className={clsx(styles.feedbackButton, styles.wrong)}
                  onClick={(e) => handleAction(e, onIncorrect)}
                  aria-label="Mark incorrect and move to next"
                >
                  <X size={40} />
                </button>
                <div className={styles.answer} aria-live="polite">
                  {answer}
                </div>
                <button
                  className={clsx(styles.feedbackButton, styles.right)}
                  onClick={(e) => handleAction(e, onCorrect)}
                  aria-label="Mark correct and move to next"
                >
                  <Check size={40} />
                </button>
              </>
            )}
          </div>
        ) : (
          <button className={styles.promptButton} onClick={onTap} aria-label="Reveal answer">
            Tap to reveal
          </button>
        )}
      </div>
    </div>
  );
}
