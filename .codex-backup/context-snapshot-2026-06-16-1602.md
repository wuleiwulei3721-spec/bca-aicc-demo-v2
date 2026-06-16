# Context Snapshot - 2026-06-16 16:02 +08:00

## Current Focus

- Inbound ringing pop-up / top call toolbar now surfaces the routed business Skill immediately when the agent receives a call.
- Customer-confirmed display example is `Skill: Credit card activation`.

## Change

- `CallInteraction` now carries `skillDisplayName`.
- New voice/video call interactions use demo skill `Credit card activation`.
- `BasicLayout` passes the active call skill to `AgentToolbar` whenever the call is not Idle.
- `AgentToolbar` shows a compact call context in Incoming, Talking, Hold, and Mute states:
  - `IVR 08123456789 | Skill Credit card activation`
  - `BankID 00012345 | Skill Credit card activation`
- Header toolbar width and identification area styles were adjusted so long Skill labels truncate instead of overlapping Header actions.
- The existing Customer Information `Menu` hint remains as secondary context.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk-size warning.
- HTTP smoke passed for `/` and `/design-system`.

## Risk

- Skill is currently a demo default value, not yet dynamically mapped from IVR/Haloapp/BankApp selected business.
- Browser-level interaction verification was blocked because Browser plugin tab connection timed out twice and local Playwright/Puppeteer dependencies are not installed.
