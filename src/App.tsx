import { Scoreboard } from './components/Scoreboard/Scoreboard';
import { GameControls } from './components/GameControls/GameControls';
import { NoteRenderer } from './components/NoteRenderer/NoteRenderer';
import { ProgressBar } from './components/ProgressBar/ProgressBar';
import { Settings } from './components/Settings/Settings';
import { useFlashcardGame } from './hooks/useFlashcardGame';
import styles from './App.module.css';

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
        <NoteRenderer 
          note={currentNote} 
          clef={currentClef} 
          onClick={handleTap}
        />
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
