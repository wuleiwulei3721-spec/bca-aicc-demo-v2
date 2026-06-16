# Context Snapshot - 2026-06-15 14:47 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Workspace: `D:\03projects\bca-aicc-demo-v2`
- Main branch: `main`
- Current focus: `Call Management > Priority List Management` channel and identifier model.

## This Update

- `Priority List Management` now uses `Identifier` instead of `Priority Number`.
- Channel selection is multi-select in search and Add / Batch Add.
- The page keeps one business configuration record with multiple selected channels instead of splitting the UI row by channel.
- Match rule is derived automatically from the Identifier.

## Priority List Management

- Route: `/call-management/priority-list`.
- Search fields:
  - Channel multi-select; empty means All Channels.
  - Identifier.
- Add / Batch Add fields:
  - Channel multi-select using active Routing Config channel names only.
  - Identifier, with tooltip examples for Phone Number, Bank ID, Social Media Account, Email Address, and Email Domain.
  - Remark.
- Batch Add still splits Identifier values by semicolon.
- One Identifier creates one page record; selected channels remain grouped on that record.
- Table fields:
  - No.
  - Channel
  - Identifier
  - Match Rule
  - Remark
  - Created Date
  - Created By
- Channel displays multiple tags.
- Match Rule:
  - `Exact Match` for normal values.
  - `Email Domain Match` for values matching `@domain.tld`, such as `@ojk.co.id`.
- Social handles such as `@bank_help` remain exact match because they do not contain a domain dot.
- Checkbox delete behavior is unchanged.

## Data / Store

- `PriorityListEntry` now uses:
  - `channels: string[]`
  - `identifier`
  - `matchRule`
  - `remark`
  - `createdAt`
  - `createdBy`
- Default mock data covers phone number, Bank ID, social media account, and email domain examples.
- Store methods remain `addPriorityListEntries`, `deletePriorityListEntries`, and `resetPriorityListEntries`.

## Verification

- `npx tsc --noEmit --pretty false`: passed.
- `npm.cmd run lint`: passed.
- `npm.cmd run build`: passed with existing Vite/Rolldown chunk size warning.
- HTTP smoke for `/call-management/priority-list`: returned 200.
- HTTP smoke for `/call-management/blacklist`: returned 200.
- Browser plugin initialization timed out; click-level visual verification was not completed.

## Risk

- Match Rule is front-end demo behavior only and is not connected to a real queue priority engine.
- A future backend may store the UI record as separate channel and matching-rule rows for execution.
