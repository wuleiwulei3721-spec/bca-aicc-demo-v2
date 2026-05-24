# Context Snapshot - 2026-05-24 19:16 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Path: `D:\03projects\bca-aicc-demo-v2`.
- Branch: `codex/customer-demo-incoming-identification`.
- Release target: `v0.5.1`.
- Baseline: `main@v0.5.0`.

## Current Change

- Added incoming identification display to the top agent toolbar.
- PSTN / IVR voice calls show `IVR: 08123456789`.
- BankApp Voice and BankApp Video show the sanitized identifier `BankID: 00012345`.
- Identification displays only during `Incoming`, `Talking`, `Hold`, and `Mute`.
- Identification hides after Hang Up, during ACW/Ready, and for Live Chat / WhatsApp text interactions.

## Key Files Changed

- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Implementation Notes

- `BasicLayout` computes a display-only `callIdentification` from existing call source state: `activeCallChannel`, `inboundPopupSource`, and `videoCallPopupSource`.
- `AgentToolbar` accepts an optional `callIdentification` prop and renders a small pill next to Answer/Hold.
- The existing call state machine, presence dot, customer information, contact data, outbound request behavior, and BankApp/WhatsApp flows are unchanged.
- Toolbar max width was increased to fit the pill without overlapping the header controls.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown large chunk warning.
- Browser smoke `/`: no identification after Sign In with no call.
- Browser smoke `/`: PSTN Incoming/Talking shows IVR and hides after Hang Up.
- Browser smoke `/`: BankApp Voice/Video shows BankID and hides after Hang Up.
- Browser smoke `/`: BankApp and WhatsApp Live Chat do not show IVR/BankID.
- Browser smoke `/`: BankApp Video still shows OpenEye `Desktop Share`.
- Browser smoke `/design-system`: page loads.

## Risks

- IVR ANI and BankID are demo constants and are not wired to a real CTI payload.
- The toolbar is wider than `v0.5.0`; target remote-demo resolution should still be checked before the live demo.
