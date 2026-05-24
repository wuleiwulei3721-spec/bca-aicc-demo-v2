# Context Snapshot - 2026-05-24 00:58 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- Change: BankApp / WhatsApp Demo AICC Process controls and step rail polish.

## Latest Change

- BankApp Demo process controls now show Channel, Customer Type, Next Step, and Reset in the same control area.
- BankApp right-side Channel control is clickable and resets the flow to `Choose Channel` when switching Voice / Video / Chat.
- WhatsApp Demo process controls show read-only `Channel: WhatsApp` with Next Step and Reset, without Customer Type.
- Final steps now replace `Next Step` with a disabled `Completed` button; Reset remains the only restart control.
- Step rail markers now use neutral numbered dots and subtle arrows instead of blue/green status icons.
- WhatsApp Demo `View Agent Workspace` now uses the `Netinfo` badge; the other WhatsApp steps remain `Bank1`.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: BankApp controls, channel switching reset, final `Completed`, neutral numbered rail passed.
- Browser smoke check `/`: WhatsApp read-only channel, no Customer Type, `View Agent Workspace` `Netinfo`, final `Completed` passed.
- Browser smoke check `/design-system`: passed.

## Risks

- The right-side controls are designed to stay in one row at demo desktop widths, but very narrow viewports can wrap to prevent text overflow.
- No automated browser regression tests exist yet; this change relies on lint/build and manual browser smoke checks.
