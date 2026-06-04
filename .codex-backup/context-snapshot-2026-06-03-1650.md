# Context Snapshot - 2026-06-03 16:50 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`

## Current Focus

Working Time Plans modal schedule entry was simplified after user confirmation that the latest compact style was acceptable.

## Changes

- Work/Ramadan/Holiday/Special section action text changed from `Add Row` to `Add`.
- Schedule rows no longer use per-row borders, card backgrounds, or horizontal separators.
- Multiple schedule rows still show field labels only on the first row.
- Holiday Schedule no longer shows `Closed All Day` or `Non-working Start / Non-working End`.
- Holiday Schedule now uses Start Date, End Date, Holiday Name, Start, End.
- Holiday full-day non-working intent is represented by `00:00-23:59`.
- Ramadan, Holiday, and Special date inputs now use AntD DatePicker instead of native date inputs.
- `dayjs` was added as a direct dependency for DatePicker value conversion.

## Preserved Rules

- No timezone in this project.
- No real Default 24x7 working time plan record.
- Empty Skill Queue Work Time Plan still displays Default 24x7.
- Ramadan remains a regular workday date-range override.
- Runtime priority remains Special Working Plan > Holiday Schedule > Ramadan Work Schedule > Work Schedule.

## Verification

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk warning.
- Browser checked `/routing-config/working-time-plans`: Add modal no longer includes `Add Row`, `Closed All Day`, `Non-working`, or native date inputs; edit modal date picker dropdown uses English labels.
