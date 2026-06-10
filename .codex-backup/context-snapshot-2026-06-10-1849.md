# Context Snapshot - 2026-06-10 18:49 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `main`
- Worktree: `D:\03projects\bca-aicc-demo-v2-main-fix`
- Target: customer Production main line.

## Latest Change

- Live Chat default Current customers are now seeded only by the media sign-in action.
- `setLiveChatTabOpen()` accepts `seedDefaultCurrentSessions`; ordinary Ready / Not Ready / AUX / Pre-AUX transitions no longer recreate `livechat2-001` and `livechat2-005`.
- `Digital only` and `Voice + Digital` sign-in seed default Live Chat customers once. `Voice only` sign-in does not seed text customers.
- Media `Sign Out` is still visible in the profile dropdown, but active call / voice-video / Live Chat work blocks the action before the confirmation modal.
- System `Log Out` is still the independent red power button, but active customer work blocks logout before the confirmation modal.
- The blocking modal uses `Active Service in Progress` and asks the agent to finish or close current customer services first.

## Key Files

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite chunk size warning.
- Browser plugin connection timed out twice; fallback validation used Headless Chrome/CDP against temporary local port 5177.
- Live Chat smoke passed: login, `Digital only` sign-in default customers, active Live Chat blocks `Sign Out` and `Log Out`, closing default customers leaves Current empty, AUX -> Ready does not reseed, and no-active-service exit confirmations still appear.
- PSTN smoke passed: `Voice only` sign-in, active PSTN call, active call blocks `Sign Out` and `Log Out`.

## Risk

- Active service detection is still frontend-derived from `callStatus`, `activeLiveChatSessionIds`, and `activeLiveChat2SessionIds`.
- When backend integration exists, sign-out/logout blocking should use backend service lifecycle state as the source of truth.
