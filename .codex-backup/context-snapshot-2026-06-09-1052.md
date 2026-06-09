# Context Snapshot - 2026-06-09 10:52 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `main`.
- Current focus: customer-visible AUX dropdown refinement.

## Latest Change

- Signed-in avatar menu now uses `AUX` as a non-clickable group title.
- Busy reason rows under `AUX` are plain text menu items without repeated icons.
- `Busy Reason Management` does not gain icon configuration fields.
- Clicking a busy reason still immediately changes agent status to `AUX - {reasonName}`.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Local Chrome CDP smoke check confirmed the `AUX` group title, no icons on reason items, group title click does not change status, and `Break` / `Keperluan Pribadi` still switch status.

## Risks

- Busy Reason data is still front-end demo state only.
- If BCA later requires per-reason icons, that should be a separate schema and management UI change.
