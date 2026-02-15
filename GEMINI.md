# Gemini Project Log: Ledger

This document tracks the evolution of the Ledger project as guided by Gemini CLI.

## Project Vision

A distraction-free, high-accuracy musical flashcard app that works flawlessly on mobile.

## Technical Milestones

### 1. Initial Prototype

- Scaffolded with Vite/React/TypeScript.
- Implemented basic note generation logic based on "diatonic steps" (C4 = 0).
- Initial rendering used raw Canvas, later migrated to VexFlow for better accuracy.

### 2. Migration to VexFlow 5

- Successfully integrated VexFlow 5 for professional-grade musical notation.
- Resolved type definition conflicts with the latest VexFlow versions (e.g., `stemDirection` vs `stem_direction`).

### 3. Aesthetic Iteration: "The Serif Look"

- Decision made to strictly support **Light Mode** only.
- Transitioned from Inter/Sans-serif to a high-contrast black-on-white serif theme (Georgia/serif).
- Implemented consistent CSS variable usage across the codebase.

### 4. Advanced Notation Rules

- Implemented specific stem direction rules:
  - Middle line and above: Stem Down.
  - Below middle line: Stem Up.
- Added "Only Ledger Lines" mode to support targeted practice.

### 5. Enhanced Game Flow & Scoring

- Moved settings into a focused modal overlay for a distraction-free experience.
- Implemented a "Right/Wrong" feedback system with Lucide icons (`Check`, `X`).
- Added real-time score tracking (`correct / total`) in the header.
- Integrated `lucide-react` for consistent, crisp iconography.

### 6. Timed Practice & Persistence

- Added a session timer feature to challenge users with time-constrained practice.
- Implemented settings persistence using `localStorage` to ensure user preferences (clef, difficulty, ledger lines) survive page reloads.
- Refined the settings UI for better clarity and touch-friendliness on mobile.

### 7. UI Refinement & SEO

- Migrated settings from a modal to a more space-efficient dropdown/popover menu.
- Optimized SEO meta tags and PWA manifest for better discoverability and "app-like" feel.
- Renamed the project to **Ledger** to reflect its focused purpose on ledger line mastery.

### 8. Modern PWA & Architectural Decoupling

- Migrated to `vite-plugin-pwa` for professional-grade manifest and service worker management.
- Decoupled `NoteRenderer` from `GameControls` (formerly `InteractionArea`) to allow independent interaction and clearer layout.
- Renamed `GameHeader` to `Scoreboard` to more accurately reflect its utility.
- Extracted VexFlow rendering logic into a specialized `useVexFlowRenderer` hook.
- Achieved >97% test coverage and standardized on Vitest globals for a better developer experience.
- Refined the progress bar with CSS-driven transitions for better performance.

### 9. Review Incorrect Mode

- Implemented a "Review Incorrect" feature to allow targeted practice of missed notes.
- Added logic to `useFlashcardGame` to track unique missed notes and manage a randomized review queue.
- Introduced a manual override capability in `useNoteSelection` to support queue-driven presentation.
- Updated the `Scoreboard` with a "Review" button (GraduationCap icon) that appears when missed notes are available.
- Added a visual "Review Mode" badge to provide clear context during targeted practice.
- Guaranteed that the game returns to normal generation only after all review items are correctly answered.
- Refactored review mode logic into a standalone `useReviewMode` hook for better maintainability and testability.
- Updated the `Scoreboard` with a "Review" button (`ListX` icon) that toggles review mode on and off.
- Enhanced the review button with an active visual state (inverted colors) to clearly indicate when review mode is active.
- Improved review mode UX: toggling review mode off returns the remaining queue to the missed notes list for later practice.
- Fixed a bug where the review button would disappear prematurely when answering the last note in review mode.
- Integrated `react-confetti` (lazily loaded) to celebrate with a confetti blast upon successfully completing a review session.

### 10. Standardized Styling & Code Quality

- Standardized conditional class management by integrating `clsx` across all components.
- Performed a codebase-wide cleanup of unnecessary comments and dead code to maintain a high signal-to-noise ratio.
- Updated developer documentation (`CONTRIBUTING.md`) to reflect the adoption of `clsx`.

## Architectural Notes

### Screen Constraints

- **Minimum Supported Size**: 352x339px (specifically targeting the Samsung Z-Flip 6 front cover display).
- **Responsive Strategy**: Fluid layouts using Flexbox/CSS Grid to ensure notation remains legible even on micro-displays.

### Diatonic Step System

We use a relative integer system where `C4 = 0`. This allows for easy range calculations and random generation across both clefs without complex mapping logic.

### State Management

The app uses a custom hook `useFlashcardGame` to separate the "game mechanics" (generating notes, revealing answers) from the UI components.

## Development Conventions

### Commit Messages

- We use [Gitmoji](https://gitmoji.dev/) to categorize commits.
- All commit messages MUST be in **all lowercase**.
- Example: `✨ add new scoring feature`

## Deployments

The app is deployed to GitHub Pages at `/ledger-app/`. The `vite.config.ts` includes the `base` configuration to ensure assets are resolved correctly.
