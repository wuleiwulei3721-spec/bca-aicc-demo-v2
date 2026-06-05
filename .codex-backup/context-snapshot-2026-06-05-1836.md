# Context Snapshot - 2026-06-05 18:36 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/customer-identity-refresh`.
- Base: `main`, customer Production-safe hidden-management-menu version.

## Latest Change

- Added customer identity refresh to the inbound Customer Information card.
- PSTN now starts with an unidentified customer and empty Journey / Ticketing cards.
- Fixed the Customer Information header action layout so both identity refresh and edit contact icons are visible in the top-right corner.

## Files Changed

- `src/types/inbound.ts`: added `CustomerIdentityRefreshResult`.
- `src/mock/inbound.ts`: added unidentified PSTN data, fixed demo ID `00000078987`, and `lookupCustomerIdentityRefresh()`.
- `src/pages/inbound/InboundPage.tsx`: PSTN uses unidentified initial data; BankApp Voice keeps existing identified customer.
- `src/pages/inbound/InteractionWorkspace.tsx`: stores identity refresh override at the current workspace instance level.
- `src/pages/inbound/components/CustomerInformationCard.tsx`: added refresh icon, popover, Paste/Confirm behavior, and inline errors.
- `src/pages/inbound/components/CustomerJourneyCard.tsx`, `TicketingHistoryCard.tsx`: added not-loaded empty states.
- `src/styles/index.less`: added identity refresh popover styles, empty-state styles, and fixed `.aicc-base-card__header-extra` from fixed 20px to auto-width so two header actions are not clipped.

## Behavior

- PSTN initial state:
  - `Unidentified Customer`
  - `Caller ID unavailable`
  - `Customer ID not loaded`
  - `Customer journey is not loaded.`
  - `Ticketing history is not loaded.`
- Identity refresh:
  - Refresh icon and Edit Contact icon are both visible in Customer Information header.
  - `Paste` fills `00000078987` without reading the real clipboard.
  - Wrong ID shows `No customer found for this ID.`
  - Correct ID refreshes to Dimas and replaces Journey / Ticketing empty states with data.

## Validation

- `npm run lint` passed.
- `npm run build` passed with existing Vite chunk size warning.
- Browser checked `/`:
  - Sign In -> PSTN opens unidentified customer.
  - `Refresh customer identity` button count: 1.
  - `Edit contact` button count: 1.
  - Empty/error/success refresh flow works.

## Risks

- Identity lookup is front-end mock only and supports one fixed demo ID.
- `Paste` is a demo shortcut, not clipboard integration.
- CRM dynamic tabs opened before refresh are not automatically updated.
