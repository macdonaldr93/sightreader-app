import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  progress: number;
  isRunning: boolean;
  timeLeft: number;
  visible: boolean;
}

export function ProgressBar({ progress, isRunning, timeLeft, visible }: ProgressBarProps) {
  if (!visible) return <div className={styles.container} />;

  const style: React.CSSProperties = isRunning 
    ? { 
        transform: 'scaleX(0)', 
        transition: `transform ${timeLeft}s linear` 
      }
    : { 
        transform: `scaleX(${progress})`, 
        transition: 'none' 
      };

  return (
    <div className={styles.container}>
      <div 
        className={styles.bar} 
        style={style} 
      />
    </div>
  );
}
