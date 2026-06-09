# Context Snapshot - 2026-06-09 19:07 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Purpose: BANK 1 AICC customer-facing demo with login/auth, media sign-in, Channel Simulation, Live Chat, and customer-visible Call Management.

## Latest Change

- Customer login no longer requires PIN/captcha.
- `/login` now shows only User Name, Password, and optional EXT.
- Demo LDAP credentials remain `888888 / 888888`.
- Media `Sign Out` now opens `Confirm Sign Out`; cancellation keeps the current media sign-in mode.
- System `Log Out` now opens `Confirm Log Out`; cancellation keeps the session, confirmation clears auth session and returns to `/login`.

## Key Files

- `src/pages/LoginPage.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Local Chrome CDP smoke confirmed no login PIN/captcha, successful `888888 / 888888` login, Sign Out cancel/confirm behavior, Log Out cancel/confirm behavior, and authenticated `/design-system`.

## Risks

- This is still front-end demo auth. Real LDAP/SSO security controls, including any future captcha or risk control policy, must come from the backend/security design.
