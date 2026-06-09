# Context Snapshot - 2026-06-09 11:50 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `main`.
- Current focus: login demo account and captcha behavior.

## Latest Change

- Demo LDAP account is now `888888 / 888888`.
- Login captcha/PIN is now a random 6-digit number.
- The separate refresh icon button beside captcha was removed.
- Clicking the captcha image/button refreshes the captcha and clears the PIN input.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Local Chrome CDP smoke confirmed 6-digit captcha display, click-to-refresh behavior, no standalone `Refresh PIN` button, `admin / 888888` rejection, and `888888 / 888888` successful login.

## Risks

- The simplified `888888 / 888888` account is demo-only and must not be treated as a production auth policy.
