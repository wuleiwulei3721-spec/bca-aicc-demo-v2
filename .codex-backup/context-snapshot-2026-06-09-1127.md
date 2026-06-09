# Context Snapshot - 2026-06-09 11:27 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `main`.
- Current focus: login/auth presentation and post-login media sign-in experience.

## Latest Change

- System-level `Log Out` is now a standalone red power button in the Header, beside the agent status dropdown.
- `AgentProfileArea` dropdown now owns only media state: `Sign In`, `AUX`, and `Sign Out`.
- Unsigned dropdown uses a `Sign In` group with text-only choices: `Voice only`, `Digital only`, `Voice + Digital`.
- Signed-in dropdown shows current service mode, `AUX` group, enabled busy reasons, and media `Sign Out`; it no longer contains `Log Out`.
- `Voice only` live chat handoff blocking now shows the handoff warning for WhatsApp/BankApp live chat flows.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Local Chrome CDP smoke checks passed for auth redirect, login errors, successful `admin / 888888` login, unsigned grouped sign-in menu, signed-in menu without `Log Out`, media `Sign Out`, red system `Log Out`, Digital-only PSTN block, Voice + Digital PSTN allow, `/design-system`, and Voice-only WhatsApp live chat block warning.

## Risks

- Auth and system logout remain front-end demo behavior backed by `sessionStorage`; real deployment needs backend session/token invalidation.
- The red Header logout button passed DOM smoke checks; still needs final visual confirmation at the customer demo resolution.
