# Context Snapshot - 2026-06-16 16:46 +08:00

## Current Focus

- Top call toolbar Skill display has been compacted to avoid blocking Header actions.
- The call context remains visible immediately during ringing and throughout the active call lifecycle.

## Change

- `AgentToolbar` call context now stacks inside the identification block:
  - first row: `IVR 08123456789` or `BankID 00012345`
  - second row: `Skill Credit card activation`
- Toolbar buttons, Ready, timer, and more actions remain single-line.
- `.aicc-agent-toolbar` is back to the original safe max width.
- `.aicc-agent-toolbar__identification` uses a fixed compact width with ellipsis for long values.
- `CallInteraction.skillDisplayName` from the 16:02 change remains unchanged.

## Validation

- `npx tsc --noEmit --pretty false` passed.
- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk-size warning.
- HTTP smoke passed for `/` and `/design-system`.
- `git diff --check` reported no whitespace errors, only existing LF/CRLF warnings.
- Headless Edge CDP geometry check was attempted but blocked by a Windows permission error before measurement.

## Risk

- Browser screenshot verification remains pending; manually verify the toolbar at the target demo resolution before customer playback.
- Skill is still a demo default value rather than a dynamic source-menu mapping.
