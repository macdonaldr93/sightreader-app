import { RotateCcw, ListX } from 'lucide-react';
import clsx from 'clsx';
import styles from './Scoreboard.module.css';

interface ScoreboardProps {
  score: { correct: number; total: number };
  onReset: () => void;
  canReview?: boolean;
  isReviewMode?: boolean;
  onReview?: () => void;
}

export function Scoreboard({ score, onReset, canReview, isReviewMode, onReview }: ScoreboardProps) {
  return (
    <div className={styles.header}>
      <div className={styles.score}>
        {score.correct} / {score.total}
      </div>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={onReset} aria-label="Reset game">
          <RotateCcw size={24} />
        </button>
        {canReview && (
          <button
            className={clsx(styles.actionButton, isReviewMode && styles.active)}
            onClick={onReview}
            aria-label="Review missed notes"
          >
            <ListX size={24} />
          </button>
        )}
      </div>
    </div>
  );
}
