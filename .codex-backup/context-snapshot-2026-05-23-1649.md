# Context Snapshot - 2026-05-23 16:49 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Purpose: BANK 1 AICC demo with agent workspace and BankApp customer-side access simulation.
- Current focus: BankApp voice/video/live chat customer-side flow and accurate agent-side channel handoff.

## Latest Change

- Added `BankApp` and `Video` access channel values.
- BankApp voice and BankApp video customer profiles now pass `BankApp` into Customer Information.
- `ChannelTag` renders `BankApp` with the mobile BankApp icon and visible text `BankApp`.
- Added `standard | bankapp-video` video popup source state so normal Video Call remains independent from BankApp Video.
- Live Chat BankApp flow now shows `Personal Information` only for `Guest`; `Registered Customer` skips directly to `Select Business`.
- BankApp video connected screen now references `public/screenshots/bankapp/video-connected.png`.
- `channel-selection-sanitized.png` has larger `Voice Call`, `Video Call`, and `Live Chat` labels.
- Updated `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and `.codex-backup/key-prompts.md`.

## Behavior

- Registered Customer + Live Chat:
  - `Live Chat -> Select Business -> Confirm Business -> Connecting to Agent -> Chat Page -> Live Chat workspace`.
- Guest + Live Chat:
  - `Live Chat -> Personal Information -> Select Business -> Confirm Business -> Connecting to Agent -> Chat Page -> Live Chat workspace`.
- BankApp Voice:
  - After customer connected step, opens `PSTN / Voice Call`.
  - Customer Information channel shows `mobile BankApp`.
- BankApp Video:
  - Connected step displays `/screenshots/bankapp/video-connected.png`.
  - After customer connected step, opens `Video Call`.
  - Customer Information channel shows `mobile BankApp`.
- Standard Channel Simulation Video:
  - Still opens `Video Call`.
  - Customer Information channel shows `video-camera Video Call`, not BankApp.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser `/` passed:
  - Registered Live Chat skips `Personal Information`.
  - Guest Live Chat shows `Personal Information`.
  - Video connected screen loads `/screenshots/bankapp/video-connected.png`.
  - BankApp Voice Customer Information shows `mobile BankApp`.
  - BankApp Video Customer Information shows `mobile BankApp`.
  - Standard `Channel Simulation > Video Call` shows `video-camera Video Call`.
- Browser `/design-system` loaded normally and displayed `UI Design System`.

## Risks

- `video-connected.png` is a project-local video call image resource. If the exact user attachment must be used pixel-for-pixel, replace this file after the original attachment is saved to a local path.
- BankApp voice/video handoff still depends on agent status `Ready` and call status `Idle`.
- Existing bundle-size warning remains unchanged.
