# Context Snapshot - 2026-05-22 17:48 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/live-chat-detail`
- Focus: Conversation header color and action alignment calibration.

## Current State

- This round intentionally touched only the Live Chat Conversation header and required project documentation/backups.
- Conversation channel icon now uses both `live-chat-channel-icon` and the customer-list row modifier `live-chat-channel-icon--customer`, keeping channel color rules shared while matching customer-list visual weight.
- Transfer / Invite hover and focus states now use system tokens `--aicc-hover` and `--aicc-primary` instead of darker local overrides.
- End Service is still icon-only, but the close icon is reduced to 16px inside a 28px button box and has a light danger hover background.
- Message area, composer, customer list, Customer Information, CRM, and Assistant were not intentionally changed.

## Key Files Changed

- `src/pages/inbound/components/ConversationWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: after Sign In and opening Live Chat, Conversation header still exposes channel icon, Transfer / Invite icons, and End Service close icon.
- Browser smoke check `/`: End Service still opens the confirmation dialog.
- Browser smoke check `/design-system`: page loads normally.

## Recovery Notes

- To revert only this round, remove the channel icon `live-chat-channel-icon--customer` class addition and restore the previous Conversation header action hover / End Service sizing styles.
- Do not revert the Conversation tab feature, message layout, composer layout, customer switching, send logic, or End Service confirmation unless explicitly requested.
