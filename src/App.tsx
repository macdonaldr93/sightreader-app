import React, { Suspense } from 'react';
import { Scoreboard } from './components/Scoreboard/Scoreboard';
import { GameControls } from './components/GameControls/GameControls';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { Settings } from './components/Settings/Settings';
import { NoteRendererSkeleton } from './components/NoteRenderer/NoteRendererSkeleton';
import { useFlashcardGame } from './hooks/useFlashcardGame';
import styles from './App.module.css';

const NoteRenderer = React.lazy(() => import('./components/NoteRenderer/NoteRenderer').then(m => ({ default: m.NoteRenderer })));

function App() {
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
    revealAnswer,
    markCorrect,
    markIncorrect,
    handleTimeoutContinue,
    startGame,
    resetGame,
    updateSettings,
  } = useFlashcardGame({
    clef: 'treble',
    maxLedgerLines: 1,
    onlyLedgerLines: false,
    timeLimitEnabled: false,
    timeLimitSeconds: 10,
  });

  const handleTap = () => {
    if (!isAnswerRevealed) {
      revealAnswer();
    }
  };

  return (
    <div className={styles.app}>
      <ProgressBar
        progress={timerProgress}
        isRunning={timerIsRunning}
        timeLeft={timerTimeLeft}
        visible={settings.timeLimitEnabled && !isSettingsOpen && !isAnswerRevealed}
      />

      <main className={styles.main}>
        <Scoreboard score={score} onReset={resetGame} />
        <Suspense fallback={<NoteRendererSkeleton />}>
          <NoteRenderer
            note={currentNote}
            clef={currentClef}
            onClick={handleTap}
          />
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
      />
    </div>
  );
}

export default App;
