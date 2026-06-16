# Context Snapshot - 2026-06-15 18:12 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `main`
- Focus: Verification Rule V2 Max Wrong semantics and legacy scenario inheritance.

## Current Change

- Reconfirmed the Indonesian rule phrase `maksimal 3 kali salah jawab`.
- Correct interpretation: maximum 3 wrong answers, so `Max Wrong = 3`.
- Only `tidak ada ketentuan maksimal salah jawab/salah` means `No Limit`.
- Fixed legacy `groups` to scenario conversion so generated default scenarios inherit the rule-level `maxWrongAttempts`.
- Fixed legacy special scenario generation so it inherits the base scenario max wrong policy.
- Added compatibility for current session data that may already contain stale legacy scenario `maxWrongAttempts: null` under a rule with `maxWrongAttempts: 3`.

## Key Files

- `src/utils/verificationRuleV2.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npx tsc --noEmit --pretty false`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with existing chunk-size warning.
- `rg -n -i "halo|bca" src`: no matches.
- HTTP smoke:
  - `/`: 200.
  - `/call-management/verification-rule-v2`: 200.
  - `/design-system`: 200.
- `git diff --check`: passed with existing LF/CRLF warnings.

## Risk

- Browser screenshot validation was not performed.
- Manual check recommended: only Personal Banker, Layanan Cabang, KPR, and Merchant Solution should show No Limit by default.
