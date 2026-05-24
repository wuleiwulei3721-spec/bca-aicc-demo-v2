# Context Snapshot - 2026-05-24 12:45 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- Change: BankApp Video Calling / Connected screenshot replacement.

## Latest Change

- Extracted the user-provided Video connected screenshot from the local Codex session.
- Replaced `public/screenshots/bankapp/video-connected.png` with the new original attachment.
- BankApp Video `Calling Agent` now renders `public/screenshots/bankapp/voice-calling.png`, matching the Voice fourth step.
- BankApp Video `Connected` continues to render `public/screenshots/bankapp/video-connected.png`, now updated to the new attachment.
- Existing Video connected screen share overlay remains unchanged.
- Voice, Live Chat, WhatsApp, workspace handoff, process rail, and layout behavior are otherwise unchanged.

## Key Files

- `public/screenshots/bankapp/video-connected.png`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- Local image check: `video-connected.png` opened successfully and is `750x1624`; `voice-calling.png` remains `747x1624`.
- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning and one plugin timing warning.
- Browser `/`: BankApp Video Registered and Guest use `voice-calling.png` for `Calling Agent` and the updated `video-connected.png` for `Connected`.
- Browser `/`: BankApp Video handoff opens `Video Call`; returning to BankApp Demo preserves the connected screenshot before `Service Closed`.
- Browser `/`: BankApp Voice and Chat screenshot paths are unchanged.
- Browser `/design-system`: passed.

## Risks

- The new Video connected screenshot is a user-provided original attachment. Confirm authorization and shareability before public distribution.
- Video connected still has the existing screen share overlay. If the demo requires screenshot-only presentation, remove or hide that control in a separate pass.
- The worktree already contains prior uncommitted BankApp / WhatsApp flow changes; do not revert unrelated dirty files.
