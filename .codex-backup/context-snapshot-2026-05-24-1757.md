# Context Snapshot - 2026-05-24 17:57 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Path: `D:\03projects\bca-aicc-demo-v2`.
- Branch: `codex/customer-demo-optimization`.
- Release target: `v0.5.0` customer remote demo.
- Baseline: `v0.4.1` already freezes WhatsApp / BankApp demo detail and BankApp Video desktop share work.

## Current Change

- Implemented customer-requested effective agent presence for the top-right profile status dot.
- Presence dot now uses:
  - `offline` / grey for `Unsigned`.
  - `ready` / green only when signed in, Ready, and no active customer interaction.
  - `busy` / red when a customer is active in phone, video, or text interaction.
  - `away` / yellow for AUX, Not Ready, or ACW when no customer interaction is active.
- Phone/video interactions count as active from `Incoming` through `Talking`, `Hold`, and `Mute`.
- Live Chat interactions count as active when `activeLiveChatSessionIds` contains at least one session id.

## Key Files Changed

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Live Chat Rule

- Sign In still opens the fixed, non-closable `Live Chat` tab, but no customers are shown by default.
- BankApp Live Chat entry adds only `live-chat-002` / Sari Amelia.
- WhatsApp Demo entry adds only `live-chat-001` / Dimas Abimanyu.
- End Service removes the current active session; when no active sessions remain, the workspace returns to `No active conversation` and presence returns to green if Ready.
- Webchat mock data stays in `src/mock/inbound.ts` but is not visible and has no filter option until a Webchat entry flow exists.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown large chunk warning.
- Browser smoke `/`: Sign In shows green dot and empty Live Chat.
- Browser smoke `/`: PSTN Incoming/Talking shows red; Hang Up shows yellow ACW and returns green after the existing ACW timer.
- Browser smoke `/`: BankApp Live Chat shows only Sari and red dot; End Service returns empty/green.
- Browser smoke `/`: WhatsApp Demo shows only Dimas and red dot; End Service returns empty/green.
- Browser smoke `/design-system`: page loads.

## Risks

- End Service only closes the front-end text active session. It does not drive ACW, ticket closure, or a real routing release.
- Webchat is hidden, not deleted. Future Webchat work must re-add an entry trigger and enable the filter option.
- No automated browser test suite exists; release confidence still depends on lint/build and smoke scripts.
