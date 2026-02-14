# Gemini Project Log: Sight Reader

This document tracks the evolution of the Sight Reader project as guided by Gemini CLI.

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

## Architectural Notes

### Diatonic Step System

We use a relative integer system where `C4 = 0`. This allows for easy range calculations and random generation across both clefs without complex mapping logic.

### State Management

The app uses a custom hook `useFlashcardGame` to separate the "game mechanics" (generating notes, revealing answers) from the UI components.

## Deployments

The app is deployed to GitHub Pages at `/sightreader-app/`. The `vite.config.ts` includes the `base` configuration to ensure assets are resolved correctly.
