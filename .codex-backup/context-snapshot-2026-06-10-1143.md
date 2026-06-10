# Context Snapshot - 2026-06-10 11:43 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/livechat-copy-update`
- Worktree: `D:\03projects\bca-aicc-demo-v2-main-fix`
- Purpose: continue customer-safe formal Live Chat preview fixes and push the same Vercel Preview branch.

## Latest Change

- Default Live Chat Current customers seeded on Sign In no longer flash as new access.
- Channel Simulation handoff sessions still receive a short flash and are created as new `*-handoff-*` customer rows.
- WhatsApp hides `Recall` and `Re-edit`; Haloapps and Webchat keep recall capability.
- Message Record defaults now use the active session's latest message timestamp so existing mock records show by default.
- Handoff cloned messages are retimed near the current handoff time.
- Haloapps text sessions support an optional `lastMenuName`, currently using session intent as the single-level menu.
- Customer Information displays `Menu` only for PSTN/voice IVR and Haloapps text sessions.
- Call Flow Detail can now show either PSTN multi-level IVR Journey or a Haloapps single-level menu.
- Live Chat workspace tab unread badge position was adjusted to avoid top clipping.

## Key Files

- `src/types/inbound.ts`
- `src/mock/inbound.ts`
- `src/store/appStore.ts`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/LeftColumn.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CallFlowDetailModal.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`

## Scope Guard

- Do not modify the original dirty `D:\03projects\bca-aicc-demo-v2` worktree or internal branch `codex/admin-config-latest`.
- Do not expose internal Call/Routing admin work in this customer preview branch.
- Do not change routes, real backend contracts, or legacy `LiveChatPage.tsx` unless explicitly requested.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Browser smoke check passed for Sign In, Live Chat default no-flash, Message Record records and Locate, WhatsApp no Recall, Haloapps menu card/detail, PSTN IVR Journey, WhatsApp handoff flash, unread badge bounds, and customer-visible menu safety.

## Risk

- Haloapps menu naming currently follows `intent` / `lastMenuName`; customer should confirm final business menu labels.
- Message Record remains frontend-demo only and reads local session messages, not a real backend record query.
