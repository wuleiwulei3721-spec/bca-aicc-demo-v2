# Context Snapshot - 2026-06-10 17:03 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/admin-config-latest`
- Scope: local internal admin branch for Call Management and Routing Config.

## Latest Change

- `Routing Config > Skill Queues` was simplified.
- The page no longer shows `Supports Video`.
- The page no longer shows the `Queue Configuration` section.
- The list no longer shows `Max Queue Customers`, `Queue Timeout`, or `Supports Video`.

## Data Handling

- `supportsVideo` and queue fields remain in the `SkillQueue` type/mock data.
- Add/Edit/View no longer expose those fields, but save still preserves existing draft values.
- This avoids breaking current mock data and keeps the fields available for future recovery if the design changes again.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- `git diff --check` passed with existing CRLF working tree warnings.

## Risk

- If the Word requirement document still states that Skill Queues owns queue configuration, it should be updated separately to match this demo change.
