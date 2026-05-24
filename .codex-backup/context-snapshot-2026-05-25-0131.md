# Context Snapshot - 2026-05-25 01:31 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/live-chat-timing-visual-cleanup`
- Baseline: `main@v0.5.5` (`c98e58d`)
- Target release: `v0.5.6`

## Current State

- Cleaned workspace tab label rendering so Home, BankApp Demo, WhatsApp Demo, Live Chat, PSTN / Voice Call, and Video Call use the same `WorkspaceTabLabel` structure.
- Fixed the widened icon/text gap caused by nested span selectors in interaction tab labels.
- Changed BankApp / WhatsApp Live Chat runtime timing to start from `00:00` when the simulated customer enters.
- Kept Live Chat customer list duration visible for every active customer, including single-session scenarios.
- Preserved Customer Information `accessDuration` semantics as static channel/queue/pre-agent access time, but merged it into the channel label as `Channel · duration`.
- Updated Live Chat warning SLA color to a clearer amber/yellow while preserving breach red behavior.
- Multi inbound tabs after Hang Up are explicitly out of scope for this release and planned for future `v0.6.0`.

## Key Files

- `src/store/appStore.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/components/ChannelTag.tsx`
- `src/components/CustomerInformationPanel.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/pages/DesignSystem.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke at 1366x768 passed:
  - Sign In opens `Live Chat` without duration.
  - Home and Live Chat tab label icon/text gaps are consistent.
  - PSTN tab shows `PSTN (00:xx)`.
  - BankApp Voice tab shows `Voice Call (00:xx)`.
  - BankApp Video tab shows `Video Call (00:xx)`.
  - BankApp and WhatsApp Live Chat runtime timing starts from `00:00`.
  - Live Chat list and Conversation header share the same runtime timing.
  - Customer Information access strip shows `Channel · duration` without a separate clock duration.
  - End Service clears the session timing and Live Chat tab duration.
  - `/design-system` loads.

## Risks

- The app still has one `inbound` tab, one `video-call` tab, and one fixed `live-chat` workspace; true multi inbound interaction tabs require separate store and tab key architecture work.
- Customer Information access duration and Live Chat runtime duration are intentionally different time concepts; demo narration should explain static channel access time versus live agent service time if asked.
- Webchat mock remains hidden until a Webchat entry flow is added.
