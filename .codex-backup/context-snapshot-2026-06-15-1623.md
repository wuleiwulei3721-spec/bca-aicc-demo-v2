# Context Snapshot - 2026-06-15 16:23 +08:00

Project: `D:\03projects\bca-aicc-demo-v2`

## Current Goal

Make the customer-facing Identifier tooltip in `Call Management > Priority List Management` easier to understand without adding new form fields or changing the data model.

## Completed In This Snapshot

- Rewrote the Identifier tooltip in `PriorityListManagementPage`.
- New tooltip structure:
  - Explains that Identifier is the customer value used for priority queue matching.
  - Lists supported values: phone number, Bank ID, social media account, email address, email domain.
  - Clarifies that email domain values must start with `@`, for example `@ojk.co.id` or `@bi.go.id`.
  - Clarifies matching behavior: email domains use domain match; all other values use exact match.
  - Shows batch examples as three scan-friendly lines: Phone, Social Media, Email/Webchat.
- Added `.priority-list-management__identifier-examples` styles for the batch example block.
- No changes to duplicate filtering, Match Rule derivation, store, mock data or blacklist logic.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed; only the existing Vite/Rolldown chunk size warning remains.
- HTTP smoke for `/call-management/priority-list` returned 200.

## Risks

- Browser hover-level validation was not completed in this snapshot.
- Tooltip wording is still English to match the current management UI language.

## Rollback

- Restore the previous three-paragraph `identifierTooltip` content.
- Remove `.priority-list-management__identifier-examples` styles from `src/styles/index.less`.
