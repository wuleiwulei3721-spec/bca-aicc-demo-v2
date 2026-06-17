# Context Snapshot - 2026-06-17 18:57 +08:00

## Project

- Repository: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- App: BANK 1 AICC Demo V2.
- Current area: `Call Management > Priority List Management`.

## Latest Change

`Priority List Management` was adjusted after user feedback:

- Search filters now include `Match Rule`.
- Empty `Match Rule` means all match rules.
- The filter can narrow the list to `Exact Match` or `Partial Match`.
- Default priority list examples now show email-domain-style identifiers as partial matches:
  - `@ojk.co.id`
  - `@bi.go.id`
- Other sample identifiers remain exact matches:
  - Bank ID
  - phone numbers
  - social media account names
  - full email address `123@gmail.com`
- Batch Add behavior remains manual: the user chooses `Exact Match` or `Partial Match`; no automatic email-domain detection was restored.
- `Blacklist Management` was not changed.

## Key Files

- `src/pages/call-management/PriorityListManagementPage.tsx`
- `src/mock/priorityList.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed with the existing large chunk warning.
- HTTP smoke passed:
  - `/call-management/priority-list` -> 200
  - `/call-management/blacklist` -> 200

## Risks

- Frontend remains a demo configuration layer. Backend execution should later align `Partial Match` with contains matching.
- Partial-match values that are too short can broaden priority matching.
