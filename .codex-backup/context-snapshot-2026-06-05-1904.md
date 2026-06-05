# Context Snapshot - 2026-06-05 19:04 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/customer-identity-refresh`.
- Base: `main`, customer Production-safe hidden-management-menu version.

## Latest Change

- Fixed formal `LiveChat2Page` Customer Information access duration continuing to count.
- Customer Information `accessDuration` now keeps its intended meaning: channel entry / queue / pre-agent handoff duration.
- Service duration remains live only in workspace tab, Live Chat customer list, Conversation header, SLA, and unanswered timers.

## Files Changed

- `src/pages/inbound/LiveChat2Page.tsx`
  - Passes `customer={activeSession.customer}` to `InteractionWorkspace`.
  - No longer overrides `customer.accessDuration` with `activeSession.elapsedSeconds`.
- `src/store/appStore.ts`
  - `createLiveChat2HandoffSession()` preserves `sourceSession.customer.accessDuration`.
  - Handoff sessions no longer reset Customer Information access duration to `00:00`.
- `PROJECT_CONTEXT.md`, `DEV_LOG.md`, `.codex-backup/key-prompts.md`
  - Updated the access duration business rule and recovery notes.

## Behavior

- Formal Live Chat Customer Information channel tag shows a fixed mock access duration, such as `WhatsApp · 00:18`.
- Live Chat tab and customer list continue to show service duration, such as `Live Chat (00:10)` and customer row `00:10`.
- PSTN / Voice / Video continue using static access duration values.
- Customer identity refresh behavior is unchanged.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Browser `/`:
  - Sign In -> WhatsApp Demo -> route to Live Chat.
  - Customer Information stayed at `WhatsApp 00:18` while service timer advanced to `00:10`.
  - PSTN still opened as `Unidentified Customer` with `PSTN 05:23`.
  - PSTN identity refresh `Paste` filled `00000078987`; `Confirm` refreshed Customer Information, Customer Journey, and Ticketing History.
- Browser `/design-system` loaded successfully.

## Risks

- The split between access duration and service duration is still front-end mock driven.
- Future backend integration must preserve separate fields for pre-agent access duration and live service duration.
