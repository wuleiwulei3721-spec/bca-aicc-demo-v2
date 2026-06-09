# Context Snapshot - 2026-06-09 11:20 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `main`.
- Current focus: customer-visible toolbar modal refinement.

## Latest Change

- `Transfer > Transfer Agent` no longer has a Status filter.
- `Outbound Call > Call Agent` no longer has a Status filter.
- `transferAgents` mock statuses are all `Ready`.
- Status columns remain visible, but every row shows `Ready`.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Local Chrome CDP smoke checks passed for `Outbound Call > Call Agent` and in-call `Transfer > Transfer Agent`: no `All status` filter and all 6 rows show `Ready`.

## Risks

- This is demo mock behavior. Real-time agent status filtering should be restored later only if connected to a backend agent state source.
