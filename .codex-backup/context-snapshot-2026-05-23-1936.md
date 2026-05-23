# Context Snapshot - 2026-05-23 19:36 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/nav-whatsapp-simulator`
- Milestone: `v0.3.1` menu restructure and WhatsApp simulator.
- Baseline: local `main` has been fast-forwarded to BankApp Demo baseline and tagged `v0.3.0`.

## Latest Change

- Left menu visible channel entries are now `PSTN`, `BankApp`, and `WhatsApp` under `Channel Simulation`.
- Removed the visible `Customer Simulator`, `Video Call`, and `Live Chat` menu entries.
- Added a closable `WhatsApp Demo` workspace tab.
- `WhatsApp Demo` reuses the BankApp customer-side flow shell with a WhatsApp variant and focuses `live-chat-001` on Live Chat handoff.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with the existing Vite/Rolldown chunk size warning.

## Risks

- WhatsApp Demo is intentionally a v1 copy of the BankApp shell, not a final WhatsApp-native UI.
- Video Call and Live Chat menu entries are hidden, but their page/store capabilities remain for BankApp and future work.
