# Context Snapshot - 2026-05-24 02:42 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- Change: BankApp Voice Calling / Connected screenshot replacement.

## Latest Change

- Extracted the two user-provided Voice call screenshots from the local Codex session.
- Added `public/screenshots/bankapp/voice-calling.png`.
- Added `public/screenshots/bankapp/voice-connected.png`.
- BankApp Voice `Calling Agent` now renders `voice-calling.png` directly.
- BankApp Voice `Connected` now renders `voice-connected.png` directly.
- Voice `Agent Workspace` return state continues to show the connected screenshot through the existing connected renderer.
- Video, Live Chat, WhatsApp, workspace handoff, process rail, and layout behavior are unchanged.

## Key Files

- `public/screenshots/bankapp/voice-calling.png`
- `public/screenshots/bankapp/voice-connected.png`
- `src/mock/bankapp.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- Local image check: both Voice screenshots opened successfully and are `747x1624`.
- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser `/`: BankApp Voice Registered and Guest use the new Voice screenshots; signed-in Voice handoff opens `PSTN / Voice Call`, and returning to BankApp Demo preserves the connected screenshot before `Service Closed`.
- Browser `/`: BankApp Video and Chat screenshot paths are unchanged.
- Browser `/design-system`: passed.

## Risks

- The two Voice screenshots are user-provided original attachments. Confirm authorization and shareability before public distribution.
- The worktree already contains prior uncommitted BankApp / WhatsApp flow changes; do not revert unrelated dirty files.
