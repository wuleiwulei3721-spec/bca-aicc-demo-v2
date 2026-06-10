# Context Snapshot - 2026-06-10 18:17 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Worktree: `D:\03projects\bca-aicc-demo-v2-main-fix`
- Target: customer Production main line.

## Latest Change

- Added `Pre-AUX - {reason}` as a first-class agent status.
- Ready / Not Ready profile dropdown still shows the `AUX` group and enabled busy reasons.
- Once the agent is in `AUX - {reason}` or `Pre-AUX - {reason}`, the profile dropdown only shows current status, `Ready`, and media `Sign Out`.
- Selecting an AUX reason while any active work exists enters `Pre-AUX - {reason}` instead of clearing current work.
- Pre-AUX blocks new routing/handoff because the agent is no longer `Ready`.
- When active call and active Live Chat session counts reach zero, Pre-AUX automatically becomes final `AUX - {reason}`.
- Media `Sign Out` remains available from AUX/Pre-AUX and still requires confirmation.

## Key Files

- `src/types/agent.ts`
- `src/utils/agentStatus.ts`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `src/store/appStore.ts`
- `src/store/callManagementStore.ts`

## Validation

- `npx tsc --noEmit` passed.
- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Headless Chrome/CDP smoke passed on temporary local port 5177 for:
  - workspace opens with injected auth session;
  - Ready menu still shows AUX reasons;
  - final AUX menu no longer shows other reasons and keeps `Sign Out`;
  - AUX `Sign Out` confirmation opens;
  - Voice + Digital with default active Live Chat enters `Pre-AUX - Break`.

## Risk

- Pre-AUX auto-finalization is based on frontend active call and active Live Chat session counts. Real backend lifecycle events should become the source of truth if integrated later.
- The user's current 5176 page was served from `D:\03projects\bca-aicc-demo-v2`, not this `main-fix` worktree; validation used temporary port 5177 and the server was stopped afterward.
