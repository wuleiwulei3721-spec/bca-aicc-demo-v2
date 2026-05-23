# Context Snapshot - 2026-05-23 19:40 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/video-screenshare-demo`
- Change: GitHub Actions CI for milestone workflow.

## Latest Change

- Added `.github/workflows/ci.yml`.
- CI runs on pull requests to `main`.
- CI also runs on pushes to `main` and `codex/**`.
- CI steps: `npm ci`, `npm run lint`, `npm run build`.

## Validation

- Local `npm run lint`: passed before CI file creation.
- Local `npm run build`: passed before CI file creation with the existing Vite/Rolldown chunk size warning.

## Risks

- GitHub Actions has not run until the branch is pushed.
