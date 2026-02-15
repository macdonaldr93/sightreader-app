import React, { Suspense, useEffect } from 'react';
import { useWindowSize } from 'react-use';
import { Scoreboard } from './components/Scoreboard/Scoreboard';
import { GameControls } from './components/GameControls/GameControls';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { Settings } from './components/Settings/Settings';
import { NoteRendererSkeleton } from './components/NoteRenderer/NoteRendererSkeleton';
import { useFlashcardGame } from './hooks/useFlashcardGame';
import { usePracticeTracker } from './hooks/usePracticeTracker';
import styles from './App.module.css';

const NoteRenderer = React.lazy(() =>
  import('./components/NoteRenderer/NoteRenderer').then((m) => ({ default: m.NoteRenderer }))
);
const Confetti = React.lazy(() => import('react-confetti'));

function App() {
  const { width, height } = useWindowSize();

  const {
    currentNote,
    currentClef,
    isAnswerRevealed,
    isTimeExpired,
    timerProgress,
    timerIsRunning,
    timerTimeLeft,
    settings,
    score,
    isSettingsOpen,
    isReviewMode,
    isReviewFinished,
    canReview,
    revealAnswer,
    markCorrect,
    markIncorrect,
    handleTimeoutContinue,
    startGame,
    resetGame,
    updateSettings,
    toggleReview,
    clearFinished,
  } = useFlashcardGame({
    clef: 'treble',
    maxLedgerLines: 1,
    onlyLedgerLines: false,
    timeLimitEnabled: false,
    timeLimitSeconds: 10,
  });

  const { totalSeconds, thisWeekSeconds } = usePracticeTracker(!isSettingsOpen);

  useEffect(() => {
    if (isReviewFinished) {
      const timer = setTimeout(() => {
        clearFinished();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isReviewFinished, clearFinished]);

  const handleTap = () => {
    if (!isAnswerRevealed) {
      revealAnswer();
    }
  };

  return (
    <>
      <Suspense fallback={null}>
        {isReviewFinished && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
            initialVelocityY={25}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000, pointerEvents: 'none' }}
          />
        )}
      </Suspense>
      <div className={styles.app}>
        <ProgressBar
          progress={timerProgress}
          isRunning={timerIsRunning}
          timeLeft={timerTimeLeft}
          visible={settings.timeLimitEnabled && !isSettingsOpen && !isAnswerRevealed}
        />

        <main className={styles.main}>
          <div className={styles.topRow}>
            <Scoreboard
              score={score}
              onReset={resetGame}
              canReview={canReview}
              isReviewMode={isReviewMode}
              onReview={toggleReview}
            />
          </div>
          <Suspense fallback={<NoteRendererSkeleton />}>
            <NoteRenderer note={currentNote} clef={currentClef} onClick={handleTap} />
          </Suspense>
          <GameControls
            isAnswerRevealed={isAnswerRevealed}
            isTimeExpired={isTimeExpired}
            answer={currentNote.name}
            onTap={handleTap}
            onCorrect={markCorrect}
            onIncorrect={markIncorrect}
            onTimeoutContinue={handleTimeoutContinue}
          />
        </main>

        <Settings
          settings={settings}
          onUpdate={updateSettings}
          onStart={startGame}
          isOpen={isSettingsOpen}
          totalSeconds={totalSeconds}
          thisWeekSeconds={thisWeekSeconds}
        />
      </div>
    </>
  );
}

export default App;
