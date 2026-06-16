# Context Snapshot - 2026-06-12 11:11 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Customer production line remains `main`.
- `Call Management` is customer-visible; `Routing Config` remains controlled by `VITE_ENABLE_ADMIN_MENUS`.

## Latest Change

- Updated `Routing Config > Skill Queues` default mock data.
- Active skill queues now use 12 customer-safe names:
  - `Perbankan`
  - `Kartu Kredit`
  - `Prio Soli Perbankan`
  - `Prio Soli Kartu Kredit`
  - `Bank Bisnis`
  - `Personal Banker`
  - `Layanan Cabang`
  - `KlikBank Bisnis`
  - `KPR`
  - `Personal Loan`
  - `Merchant Solution`
  - `Paylater`

## Data Notes

- `SQ_GENERAL_ID` remains the default skill queue code and now displays `Perbankan`.
- `SQ_CARD_PRIORITY` remains referenced by existing routing rules and now displays `Kartu Kredit`.
- `SQ_DIGITAL_EN` remains referenced by existing routing rules and now displays `KlikBank Bisnis`.
- New queues are active and available in Skill Queues / Skill Routing Rules / Default Skill Queue options, but are not yet targeted by existing default routing rules.
- Skill queue names avoid BCA/Halo customer-sensitive wording.

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- `git diff --check` passed with existing CRLF working-copy warnings.
- Source check confirmed all 12 skill queue names are present in the requested order.

## Risk

- `Prio Soli` is an abbreviation. It is acceptable if it is an agreed business term; otherwise it may need a fuller display name before customer-facing documentation.
