# Contributing to Sight Reader

Thank you for your interest in improving Sight Reader!

## Development Workflow

1. **Fork & Clone**: Create your own fork and clone it locally.
2. **Environment**: Ensure you are using Node.js v20+.
3. **Install**: Run `npm install`.
4. **Branch**: Create a feature branch for your changes.
5. **Develop**:
   - Follow the established black-on-white serif aesthetic.
   - Use CSS Modules and CSS Variables.
   - Maintain the "Smart Hook / Dumb Component" architecture.
6. **Test**:
   - Add unit tests in `src/utils/` or `src/hooks/` if you add new logic.
   - Run `npm test` to ensure everything passes.
   - Run `npm run lint` to check code style.
7. **Build**: Run `npm run build` to ensure the project compiles correctly.

## Commit Messages

This project uses [Gitmoji](https://gitmoji.dev/) for commit messages. Please use the appropriate emoji at the beginning of your commit message to categorize the change. All commit messages MUST be in **all lowercase**.

Example: `✨ add new scoring system`

## Project Structure

- `src/components/`: UI components and their CSS Modules.
- `src/hooks/`: Core game logic and state management.
- `src/utils/`: Pure musical utility functions (diatonic steps, stem rules).
- `src/types/`: TypeScript interfaces for musical concepts.

## Musical Accuracy

Accuracy is paramount. When modifying notation logic:

- Consult standard engraving references (like Gould's _Behind Bars_).
- Update `src/utils/noteUtils.test.ts` to reflect the desired behavior.

## Pull Request Process

- Ensure the build passes in CI.
- Provide a clear description of the changes.
- Keep PRs focused on a single feature or bug fix.
