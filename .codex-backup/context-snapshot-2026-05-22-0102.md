# Context Snapshot - 2026-05-22 01:02 +08:00

## Project Goal

`bca-aicc-demo-v2` is a BANK 1 AICC frontend demo for an enterprise banking agent workspace. The current branch is `codex/live-chat-detail`, focused on improving the Live Chat inbound popup detail page while keeping `main` untouched.

## This Change

- Live Chat customer list now defaults to collapsed.
- The top of `LiveChatCustomerList` now provides four icon-only channel filters: ALL, WhatsApp, BankApp, Webchat.
- Customer rows now use the session channel icon instead of customer avatars.
- Inline channel tag and High priority tag were removed from the customer row to reduce row height.
- Collapsed state remains compact: a simple arrow, 2x2 channel filter icons, then channel icons with unread counts.
- Internal `Haloapps` channel keys remain unchanged, but visible UI labels now show `BankApp`.
- `ChannelTag` renders `Haloapps` as BankApp with a Mobile icon; `Haloapps Video` displays BankApp.
- Contact Management text was aligned from `Bankapp` to `BankApp`.

## Key Files

- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/pages/inbound/components/ChannelTag.tsx`
- `src/pages/inbound/components/ContactManagementModal.tsx`
- `src/pages/inbound/components/contactManagementData.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; existing Vite chunk size warning remains.
- Browser `/`: Sign In shows fixed Live Chat tab; Live Chat list defaults collapsed; filters show ALL, WhatsApp, BankApp, Webchat; expanded rows no longer show channel/High tags; BankApp filter shows Sari Amelia and updates Customer Information.
- Browser `/design-system`: loads successfully with title `BANK 1 AICC Demo`.

## Risks

- Live Chat remains static demo mock data and does not connect to real WhatsApp / BankApp / Webchat gateways.
- Expanded Live Chat layout still needs final review at the target demo resolution.
- Build chunk size warning is unchanged and not caused by this change.
