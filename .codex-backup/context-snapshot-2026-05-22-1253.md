# Context Snapshot - 2026-05-22 12:53 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/live-chat-detail`
- Focus: Live Chat Customer Information card behavior across WhatsApp, BankApp, and Webchat customers.

## Current State

- Live Chat remains a fixed workspace tab after agent Sign In.
- Live Chat continues to reuse `InteractionWorkspace`; the customer list remains the lead panel and defaults to collapsed.
- Customer Information is still the shared `CustomerInformationPanel` component.
- WhatsApp Live Chat customer uses a generated local female avatar: `public/avatars/whatsapp-customer-female.png`.
- BankApp and Webchat Live Chat customers have empty `avatarUrl` and show initials via `avatarInitials`.
- `Regular Customer` no longer renders a customer level badge; `Priority Customer` still renders `Priority`.
- Customer Information email text can wrap without shrinking the mail icon.
- Webchat channel tag now uses the same orange palette as the Live Chat customer list Webchat icon.

## Key Files Changed

- `src/components/CustomerInformationPanel.tsx`
- `src/mock/inbound.ts`
- `src/styles/index.less`
- `public/avatars/whatsapp-customer-female.png`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite chunk size warning.
- Browser smoke/visual check `/`: WhatsApp shows the new female avatar and keeps `Priority`; BankApp shows `SA` and no level; Webchat shows `RF`, no level, and orange Webchat tag.

## Recovery Notes

- To revert only this Customer Information change, restore `CustomerInformationPanel.tsx`, `src/mock/inbound.ts`, and the `.aicc-customer-info__fact-action` / `.aicc-customer-info__email-value` / `.inbound-channel-tag--webchat` style changes.
- Do not revert the preceding Live Chat customer list panel work unless explicitly requested.
