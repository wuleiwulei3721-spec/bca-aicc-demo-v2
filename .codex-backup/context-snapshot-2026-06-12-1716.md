# Context Snapshot - 2026-06-12 17:16 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Current workspace already contains ongoing Verification Rule V2 and Routing Config changes.

## Latest Change

- Renamed the Business Types source mapping field from `External Business Code` to `Source Business Code`.
- Internal field name changed from `externalBusinessCode` to `sourceBusinessCode`.

## Rationale

- The field represents the business code coming from a source touchpoint, such as a customer page or IVR menu.
- `Source` avoids saying customer directly and is more precise than generic `External`.

## Current Business Types Behavior

- List column order:
  - Business Type ID
  - Source Business Code
  - Business Name
  - Status
- Keyword search covers:
  - Business Type ID
  - Source Business Code
  - Business Name
- Add/Edit/View forms show `Source Business Code` immediately after `Business Type ID`.
- Validation requires `Source Business Code` and checks uniqueness.
- Default mock values remain:
  - `MENU_PERBANKAN`
  - `MENU_KARTU_KREDIT`
  - `MENU_LOAN_INFORMATION`

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- `git diff --check` passed with existing CRLF working-copy warnings.
- Source check confirmed `src/` no longer contains `External Business Code` or `externalBusinessCode`.

## Risk

- The display name is now aligned with the current product wording. If a backend/interface contract later defines a different field name, update UI, type and mock together.
