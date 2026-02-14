# Sight Reader

A mobile-first Progressive Web App (PWA) for practicing musical sight-reading. Master notes on the treble and bass clefs with a clean, distraction-free serif interface.

[Live Demo](https://macdonaldr93.github.io/sightreader-app/)

## Features

- **Treble & Bass Clefs**: Practice on either clef or both simultaneously.
- **Scoring System**: Track your progress with a "Right/Wrong" scoring system.
- **Modal Settings**: A distraction-free setup screen that stays out of the way during practice.
- **Customizable Difficulty**: Adjust the number of ledger lines (0 to 6) to challenge your reading.
- **Ledger Line Focus**: Toggle "Only Ledger Lines" mode to specifically target notes outside the standard staff.
- **Professional Notation**: Powered by VexFlow 5 for accurate musical rendering.
- **Mobile First**: Designed for touch interaction—tap to reveal, then select if you were right or wrong.
- **PWA Support**: Install it on your home screen and use it offline.
- **Light Theme**: A classic black-on-white serif aesthetic for maximum legibility.

## Musical Rules

The app follows standard engraving rules for better learning:

- **Stem Direction**:
  - Notes below the middle line have stems pointing up (right side).
  - Notes on or above the middle line have stems pointing down (left side).
- **Clef Ranges**: Support for up to 6 ledger lines above and below the staff for comprehensive practice.

## Getting Started

### Prerequisites

- Node.js (v20 or later recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/macdonaldr93/sightreader-app.git
   cd sightreader-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

## Development

- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Test**: `npm run test`

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Notation**: VexFlow 5
- **Testing**: Vitest
- **PWA**: vite-plugin-pwa
- **Deployment**: GitHub Actions + GitHub Pages

## License

MIT
