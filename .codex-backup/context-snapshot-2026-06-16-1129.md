# Context Snapshot - 2026-06-16 11:29 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- Focus: `Priority List Management` batch-only maintenance and per-channel saved rows.

## Current Change

- `Priority List Management` now exposes only `Batch Add` and `Delete`.
- `PriorityListEntry` uses a single `channel: string` instead of `channels: string[]`.
- Saving expands `selected Channel x Identifier` into separate displayed records.
- `Match Rule` is derived by channel and identifier:
  - `Webchat`, `Email Contact`, and `Email Priority` + valid email domain identifier -> `Email Domain Match`.
  - All other combinations -> `Exact Match`.
- Email domain identifier format:
  - starts with `@`;
  - has at least one dot after `@`;
  - every domain label contains only letters, numbers, and hyphens;
  - empty labels, spaces, and labels starting or ending with hyphen are rejected.
- Default priority-list mock data was rebuilt from the customer's examples and split into per-channel rows.
- Duplicate filtering remains `Channel + normalized Identifier + Match Rule`; duplicates are shown with `Existing No.` and skipped on save.

## Key Files

- `src/pages/call-management/PriorityListManagementPage.tsx`
- `src/types/priorityList.ts`
- `src/mock/priorityList.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npx tsc --noEmit --pretty false`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed with existing Vite/Rolldown chunk-size and plugin timing warnings.
- HTTP smoke:
  - `/call-management/priority-list`: 200.
  - `/call-management/blacklist`: 200.
- `git diff --check`: passed with existing Windows LF/CRLF warnings.

## Risk

- Screenshot-level browser validation was not performed because this session did not expose an in-app Browser operation tool.
- Non Email/Webchat channels can save email-domain-looking strings as `Exact Match`; this is intentional for the demo and may not take effect in a real routing engine if source identifiers never match that value.

## Rollback

- Restore `PriorityListEntry.channels`.
- Restore the Priority List `Add` button and multi-channel tag display.
- Restore older mock data and previous `Match Rule` derivation behavior.
