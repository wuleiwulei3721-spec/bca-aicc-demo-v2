# Context Snapshot - 2026-05-24 00:10 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/whatsapp-demo-detail`
- Change: BankApp Demo now follows the WhatsApp-style agent workspace review step and progressive process rail.

## Latest Change

- BankApp Voice / Video sequences now include `agent-workspace` after `connected` and before `closed`.
- BankApp Live Chat sequence now includes `agent-workspace` after `chat` and before `closed`.
- BankApp `Agent Workspace` keeps the existing `Netinfo` badge; `Customer Type` remains available.
- `requestBankAppVoiceCall(activate?)` and `requestBankAppVideoCall(activate?)` carry workspace activation intent through the store.
- `BasicLayout` passes BankApp voice/video activation flags into the existing voice/video inbound call triggers.
- `AgentWorkspace` keeps BankApp Demo mounted while inactive so returning from a voice/video/livechat workspace preserves the current demo step.
- BankApp and WhatsApp process rails now render only reached steps.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.
- Browser smoke check `/`: BankApp Voice Registered opens `PSTN / Voice Call`, returns to `Agent Workspace`, then advances to `Service Closed`.
- Browser smoke check `/`: BankApp Voice Guest still reaches `Input Phone Number` and the process rail stays progressive.
- Browser smoke check `/`: BankApp Video opens `Video Call`, returns to `Agent Workspace` with the video connected screen, then advances to `Service Closed`.
- Browser smoke check `/`: BankApp Live Chat opens `Live Chat`, focuses the BankApp customer, returns to `Agent Workspace`, then advances to `Service Closed`.
- Browser smoke check `/design-system`: passed.

## Risks

- BankApp Voice / Video still require the agent to be `Ready` and the call state to be `Idle`; otherwise the customer-side demo can reach `Agent Workspace` without opening a new agent call.
- Voice/video/livechat workspace behavior remains static front-end demo state and does not connect to real BankApp, telephony, video, or messaging services.
