# Context Snapshot - 2026-06-04 21:39 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC front-end demo for enterprise contact center workflows.
- Current local focus: continue Routing Config / Call Management development after customer production release.

## Current State

- Customer production on `main` remains the hidden-management-menu version.
- Local development branch exposes `Call Management` and `Routing Config`.
- Routing Config channel model is split into `Channel Type`, `Channel`, and `Channel Account`.
- `Channels` is the main place to configure engineering-provisioned channels, business behavior, and channel accounts.
- `Access Accounts` and `Media Service Rule Plans` menu entries are removed; old routes redirect to `Channels`.
- Queue settings live in `Skill Queues`.

## Latest Change

- Reverted the Account Management account list from the 21:32 card layout back to a table after user feedback.
- Current Account Management table columns:
  - Account
  - Account Name
  - Credential / Secret Ref
  - Purpose
  - Status
  - Actions
- The table is wrapped in `routing-config-channel-account-table` so horizontal scroll is contained inside the modal instead of widening the dialog.
- Account Management modal width is back to `880`.
- Add/Edit Account secondary modal remains single-column to avoid crowding long fields.

## Key Files

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk size warning.
- Browser opened `http://127.0.0.1:5184/routing-config/channels`.
- Instagram row Account Management modal opened with account table restored.
- DOM confirmed table headers are present and `routing-config-channel-account-card` is absent.
- `git diff --check` only reported Windows line-ending conversion warnings.

## Risks

- The table may still need a final manual review at the user's target demo resolution to confirm the internal horizontal scroll feels acceptable.
- No backend integration exists; all Routing Config changes are front-end mock behavior.
