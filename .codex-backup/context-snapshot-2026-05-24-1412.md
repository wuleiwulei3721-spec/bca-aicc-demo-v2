# Context Snapshot - 2026-05-24 14:12 +08:00

## Project

- Repo: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- App: BANK 1 AICC Demo V2, React 19 / TypeScript / Vite / Ant Design 6.

## Current State

- BankApp Video desktop sharing remains OpenEye-driven after `Agent Workspace`.
- `Select Sharing Program` and `View Agent Screen Sharing` remain Netinfo-owned steps.
- OpenEye sharing entry is now visible as English `Desktop Share` with a translucent dark background.
- OpenEye selection and BankApp customer-side sharing screens are direct decoded user attachment assets.

## Recent Change

- Replaced generated `public/screenshots/openeye-share-selection.png` with the original uploaded attachment from the current session.
- Replaced incorrect `public/screenshots/bankapp/video-screen-sharing.png` with the original uploaded attachment 2 from the current session.
- Updated the OpenEye share button visible label and styling.

## Key Files

- `public/screenshots/openeye-share-selection.png`
- `public/screenshots/bankapp/video-screen-sharing.png`
- `src/pages/inbound/components/OpenEyeVideoWindow.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- Local image check: `openeye-share-selection.png` is `533x920`.
- Local image check: `video-screen-sharing.png` is `750x1624`.
- `npm run lint`: passed.
- `npm run build`: passed, with existing Vite/Rolldown chunk size warning.
- Browser `/`: OpenEye shows `Desktop Share`, loads `/screenshots/openeye-share-selection.png`, then BankApp step 8 loads `/screenshots/bankapp/video-screen-sharing.png`.
- Browser `/design-system`: loaded successfully.

## Risks

- Both images come from user-provided current-session attachments; confirm sharing authorization before public deployment.
