# Context Snapshot - 2026-06-12 17:05 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Current workspace already contains ongoing Verification Rule V2 and Routing Config changes.

## Latest Change

- Added `External Business Code` to `Routing Config > Business Types`.
- This field corresponds to the user's “对方业务代码”.
- Purpose: map customer page or IVR menu IDs to internal Business Type records.

## Implementation

- `BusinessType` now includes `externalBusinessCode`.
- Default mock values:
  - `01 / General Service` -> `MENU_PERBANKAN`
  - `02 / Card Lost` -> `MENU_KARTU_KREDIT`
  - `03 / Loan Information` -> `MENU_LOAN_INFORMATION`
- `BusinessTypesPage` now shows `External Business Code` immediately after `Business Type ID`.
- Keyword search covers Business Type ID, External Business Code and Business Name.
- Add/Edit/View forms show `External Business Code` immediately after `Business Type ID`.
- Validation requires External Business Code and checks uniqueness.

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- `git diff --check` passed with existing CRLF working-copy warnings.
- Source check confirmed `External Business Code` is wired through type, mock, list, search, form and validation.

## Risk

- The field is demo front-end master data only. It is not yet connected to a real customer page, IVR payload or backend routing matcher.
