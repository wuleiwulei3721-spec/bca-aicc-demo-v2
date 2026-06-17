# Context Snapshot - 2026-06-17 18:50 +08:00

## Project

- Repository: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- App: BANK 1 AICC Demo V2, React + TypeScript + Vite + Ant Design.
- Current customer-visible management focus: `Call Management`, including Verification Rules, Blacklist Management, Priority List Management, Busy Reason Management, plus Routing Config visibility controlled by feature flag.

## Latest Change

`Priority List Management` match rules have been simplified after customer and teammate feedback:

- `Match Rule` is now user-selected in the Batch Add modal.
- Only two rules exist:
  - `Exact Match`: customer identifier must equal the configured value.
  - `Partial Match`: customer identifier contains the configured value.
- Default value is always `Exact Match`.
- Automatic email-domain detection has been removed.
- `Email Domain Match` is no longer part of the type, mock data, or page logic.
- Default priority list mock entries all use `Exact Match`.
- Duplicate detection still uses `Channel + normalized Identifier + Match Rule`.
- Blacklist Management was not changed.

## Key Files

- `src/types/priorityList.ts`
- `src/mock/priorityList.ts`
- `src/pages/call-management/PriorityListManagementPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed, with the existing Vite/Rolldown large chunk warning only.
- HTTP smoke passed:
  - `/call-management/priority-list` -> 200
  - `/call-management/blacklist` -> 200
- `git diff --check` found no actual whitespace errors; only Windows LF/CRLF warnings.
- Target file scan confirmed old email-domain match identifiers were removed.

## Risks

- The frontend remains a demo configuration store. Backend execution still needs to implement the same semantics later.
- `Partial Match` is intentionally broad contains matching; very short configured values can match more customers than expected.
