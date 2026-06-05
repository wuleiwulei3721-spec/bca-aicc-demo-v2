# Context Snapshot - 2026-06-04 21:50 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC front-end demo for enterprise contact center workflows.
- Current local focus: continue Routing Config / Call Management development after customer production release.

## Current State

- Customer production on `main` remains the hidden-management-menu version.
- Local development branch exposes `Call Management` and `Routing Config`.
- Routing Config channel model is split into `Channel Type`, `Channel`, and `Channel Account`.
- `Channels` is the main place to configure engineering-provisioned channels, business behavior, and channel accounts.
- `Access Accounts` and `Media Service Rule Plans` menu entries are removed; old routes redirect to `Channels`.
- Queue settings live in `Skill Queues`.

## Latest Change

- Account Management table modal was widened from `880` to `1120` after user feedback that the table still overflowed.
- Business Config for Voice and Video no longer shows `Access Success Welcome Message`.
- Text still shows and validates `Access Success Welcome Message`.
- Voice/Video validation no longer requires `accessSuccessWelcomeMessage`.

## Key Files

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk size warning.
- Browser opened `http://127.0.0.1:5184/routing-config/channels`.
- Instagram Account Management table opened through DOM click.
- Haloapp Business Config opened through DOM click.
- Voice tab shows Max Concurrent Access and Min Scan Interval Seconds only.
- Video tab shows Max Concurrent Access and Min Scan Interval Seconds only.

## Risks

- 1120px modal should be manually reviewed at the user's real demo resolution.
- If the modal is too wide on smaller screens, switch to a responsive width expression such as `min(1120px, calc(100vw - 48px))` via CSS or modal width calculation.
