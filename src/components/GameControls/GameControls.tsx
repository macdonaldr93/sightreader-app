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
  onTimeoutContinue
}: GameControlsProps) {
  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className={styles.wrapper} onClick={onTap}>
      <div className={styles.feedbackArea}>
        {isAnswerRevealed ? (
          <div className={styles.feedbackControls}>
            {isTimeExpired ? (
              <>
                <div style={{ width: 48 }} /> 
                <div className={styles.answer}>{answer}</div>
                <button 
                  className={clsx(styles.feedbackButton, styles.right)} 
                  onClick={(e) => handleAction(e, onTimeoutContinue || (() => {}))}
                  aria-label="Continue"
                >
                  <ArrowRight size={40} />
                </button>
              </>
            ) : (
              <>
                <button 
                  className={clsx(styles.feedbackButton, styles.wrong)} 
                  onClick={(e) => handleAction(e, onIncorrect)}
                  aria-label="Incorrect"
                >
                  <X size={40} />
                </button>
                <div className={styles.answer}>{answer}</div>
                <button 
                  className={clsx(styles.feedbackButton, styles.right)} 
                  onClick={(e) => handleAction(e, onCorrect)}
                  aria-label="Correct"
                >
                  <Check size={40} />
                </button>
              </>
            )}
          </div>
        ) : (
          <div className={styles.prompt}>Tap to reveal</div>
        )}
      </div>
    </div>
  );
}
