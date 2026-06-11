# Context Snapshot - 2026-06-05 00:49 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/text-channel-config-settings`.
- Customer Production `main` remains the hidden management-menu version; local development branch exposes `Call Management` and `Routing Config` for continued admin configuration work.

## Latest Change

- Added `Call Management > 全局控制配置`.
- Route: `/call-management/global-control-configuration`.
- Sidebar location: under `Call Management`, above `Text Channel Settings`.
- New files:
  - `src/pages/call-management/GlobalControlConfigurationPage.tsx`
  - `src/mock/globalControlConfiguration.ts`
  - `src/types/globalControlConfiguration.ts`
- Updated route/menu/style exports in `src/routes.tsx`, `src/layouts/BasicLayout.tsx`, `src/pages/call-management/index.ts`, `src/types/index.ts`, and `src/styles/index.less`.

## Configuration Scope

- Answer configuration:
  - Answer Mode: required select, default `Auto Answer`.
  - Answer Duration: required positive seconds, default `3`, shown only when answer mode is auto.
- Sign-in and ACW:
  - Sign-in Default Status: required select, default ready.
  - Auto Cancel ACW Duration: required positive seconds, default `5`.
- Idle control:
  - Idle Auto Sign-out Duration: required positive minutes, default `30`.
  - Idle Warning Lead Time: required positive minutes, default `10`, must be less than auto sign-out duration.
- Text capacity:
  - Max Text Media Services: required positive count, default `3`.

## Current Behavior

- The page stores values in local React state only.
- `Save Configuration` shows a local success notice.
- `Restore Defaults` resets the local form to mock defaults.
- No backend API, app store, BasicLayout call-state machine, or runtime channel capacity logic is connected yet.

## Verification

- `npm run lint` passed.
- `npm run build` passed; only the existing Vite/Rolldown chunk size warning remains.
- Browser checked `http://127.0.0.1:5184/call-management/global-control-configuration`:
  - Page and all fields render.
  - Manual Answer hides Answer Duration.
  - Save shows success notice.

## Risks

- Business users may expect these values to affect real agent sign-in/call behavior; currently they are demo-only.
- A future backend integration needs a formal API/store contract before wiring runtime behavior.
