# Context Snapshot - 2026-06-09 11:13 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `main`.
- Current focus: login page, demo LDAP authentication, and media skill sign-in for AICC agent workflow.

## Latest Change

- Added `/login` as the public entry page and protected existing business routes behind auth.
- Demo login uses `admin / 888888`, optional EXT, and a random 5-digit PIN/captcha.
- Login success stores only auth session/profile/role/CRM SSO metadata in `sessionStorage`; password is never stored.
- Agent remains `Unsigned` after login and chooses media skill from the profile dropdown:
  - `Voice only`
  - `Digital only`
  - `Voice + Digital`
- Header profile second line displays the selected mode after media sign-in.

## Key Files

- `src/pages/LoginPage.tsx`: BANK 1 login UI and form validation.
- `src/components/AuthRouteGuards.tsx`: public login route and protected business route guards.
- `src/mock/auth.ts`: demo LDAP result and service mode options.
- `src/store/authStore.ts`: sessionStorage-backed demo auth store.
- `src/store/appStore.ts`: `agentServiceMode`, voice/video readiness, and digital readiness.
- `src/layouts/BasicLayout.tsx`: media sign-in wiring, auth logout, and skill mismatch warnings.
- `src/layouts/components/AgentProfileArea.tsx`: direct sign-in mode dropdown, mode display, media sign-out, and log out.
- `src/pages/bankapp/BankAppDemoPage.tsx`: live chat handoff blocks when the agent is signed in as `Voice only`.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed, with the existing Vite chunk size warning.
- Local dev server responds at `http://127.0.0.1:5173/login`.
- Headless Chrome smoke passed for route guard, captcha error, LDAP error, successful login, unsigned state, sign-in menu, `Digital only` PSTN block, `Voice + Digital` PSTN allow, and authenticated `/design-system`.

## Risks

- LDAP, permissions, roles, and CRM SSO metadata remain front-end demo mock.
- Browser close clears session because auth uses `sessionStorage`.
- Headless Chrome did not advance WhatsApp Demo `Next Step`, so `Voice only` Live Chat blocking should still be manually checked even though the code path is wired.
