import { RotateCcw } from 'lucide-react';
import styles from './Scoreboard.module.css';

interface ScoreboardProps {
  score: { correct: number; total: number };
  onReset: () => void;
}

export function Scoreboard({ score, onReset }: ScoreboardProps) {
  return (
    <div className={styles.header}>
      <div className={styles.score}>
        {score.correct} / {score.total}
      </div>
      <button className={styles.restartButton} onClick={onReset} aria-label="Reset game">
        <RotateCcw size={24} />
      </button>
    </div>
  );
}
