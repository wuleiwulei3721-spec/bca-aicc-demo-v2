# Context Snapshot - 2026-06-16 17:05 +08:00

## Current Focus

- Top call toolbar Skill label now follows the customer's exact casing.
- `e.g.` in the customer annotation is understood as "for example", not UI copy.

## Change

- Visible toolbar label changed from `SKILL` back to `Skill`.
- Tooltip / aria title also uses `Skill`.
- The adaptive two-column identification layout remains unchanged:
  - row 1: `IVR 08123456789` or `BankID 00012345`
  - row 2: `Skill Credit card activation`
- Caller ID and business menu value remain aligned in the same value column.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk-size warning.
- HTTP smoke passed for `/` and `/design-system`.

## Risk

- Manual visual verification at the target demo resolution is still recommended.
