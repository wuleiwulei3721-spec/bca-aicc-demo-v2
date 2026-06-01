# Context Snapshot - 2026-05-29 18:02 +08:00

Project: `bca-aicc-demo-v2`
Branch: `codex/livechat2-popup`
Goal: Continue polishing the official `Live Chat` replacement after manual review feedback.

## Current State

- Official `Live Chat` still uses tab key `live-chat` and renders `LiveChat2Page`.
- Repeated WhatsApp / BankApp demo handoff still creates new livechat2 runtime session instances.
- New text handoff sessions now start service timing from `00:00`; runtime `startedAt` uses the current time and Customer Information receives the active session elapsed duration.
- Customer list stars default to gray `No flag`; mock `initialStarColor` no longer controls the initial list state.
- For no-flag current sessions, the star hover target floats over the row and no longer reserves the second column, so the latest message can span the full row.
- Assistant extra tabs now use a flat icon/text/close label structure, matching the compact Assistant / Connection spacing.
- CRM and Assistant tab more buttons are narrowed to reduce overlap with the final close button.

## Key Files

- `src/store/appStore.ts`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/styles/index.less`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser `/`: loaded; Sign In exposed the fixed `Live Chat` tab. The in-app browser did not stably complete detailed Live Chat tab interaction.
- Browser `/design-system`: loaded; `UI Design System` and `Color System` were visible.

## Risks

- Manual target-resolution review is still needed for the right-side final tab close button and Live Chat visual spacing.
