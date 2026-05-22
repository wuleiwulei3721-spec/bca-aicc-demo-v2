# Context Snapshot - 2026-05-22 13:10 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/live-chat-detail`
- Focus: Customer Information email hover affordance and per-customer outbound request state.

## Current State

- Customer Information remains a shared card flow composed of `CustomerInformationCard` and `CustomerInformationPanel`.
- Email rows still support wrapping for long addresses and keep the mail icon fixed width.
- Email hover/focus now explicitly highlights the email text and underlines it to show clickability.
- Outbound request state is keyed by `accessChannel + CIS + phoneNumber`; Live Chat customer switching no longer shares one outbound status across all customers.
- Previous avatar and customer level changes remain in place: WhatsApp uses a generated female avatar, BankApp/Webchat use initials, and `Regular Customer` level is hidden.

## Key Files Changed

- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite chunk size warning.
- Browser smoke check `/`: agent can sign in, Live Chat loads, and Customer Information renders with the email button present.

## Recovery Notes

- To revert only the hover affordance, remove the `.aicc-customer-info__email-value` hover/focus styles added in `src/styles/index.less`.
- To revert outbound request isolation, restore the single `outboundRequestStatus` state and single timer ref in `CustomerInformationCard.tsx`.
- Do not revert the preceding Live Chat list, avatar, customer level, or Webchat channel color work unless explicitly requested.
