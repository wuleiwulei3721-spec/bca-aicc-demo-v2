# Context Snapshot - 2026-05-23 00:07 +08:00

## Project

- Repository: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/bankapp-channel-demo`
- Purpose: BANK 1 AICC frontend demo for enterprise bank customer service workflows.
- Current focus: BankApp customer-side entry demo for Voice, Video, and Livechat, integrated with existing agent workspace tabs.

## Current BankApp Direction

- BankApp Demo is now a phone-led stage, not a three-panel dashboard.
- Left/main visual: Customer BankApp phone simulator with fixed real-phone ratio `1320 / 2868`.
- Adjacent explainer: lightweight `AICC Process` vertical rail showing customer type, language, channel, business type, routed skill, phone/profile context, and step status.
- Top controls only: `Customer Type`, `Language`, `Next Step`, `Reset`.
- Removed the heavy standalone `Agent Desktop Outcome` panel; agent result is shown by real workspace navigation:
  - Voice -> `PSTN / Voice Call`
  - Video -> `Video Call`
  - Livechat -> `Live Chat / Conversation`

## Implemented Flow

- Voice registered customer skips phone number input.
- Voice guest customer shows `Input Phone Number` before business selection.
- Video follows the same registered/guest phone-number rule.
- Livechat starts from `Personal Information`, then business selection and chat connection.
- Business skills are generated from `language + customerType + contactMethod`.
- AICC-controlled screens are React components, not embedded screenshots.
- Pre-AICC entry screens were also componentized to avoid visible old brand text.

## Key Files Changed

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/mock/bankapp.ts`
- `src/types/bankapp.ts`
- `src/styles/index.less`
- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/store/appStore.ts`
- `src/mock/inbound.ts`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/ChannelTag.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/`: BankApp tab opens from `Customer Simulator > BankApp`.
- Browser `/`: no visible `Haloapps` text on the BankApp demo path.
- Browser `/`: Registered Voice skips `Input Phone Number`.
- Browser `/`: Guest Voice shows `Input Phone Number`.
- Browser `/`: Voice handoff opens `PSTN / Voice Call` with `BankApp Voice`.
- Browser `/`: Video handoff opens `Video Call` with `BankApp Video`; OpenEye appears after connected.
- Browser `/`: Livechat handoff opens Live Chat and focuses Sari Amelia BankApp conversation.
- Browser `/design-system`: loads normally.

## Risks

- BankApp Demo is a frontend-only simulation and has no real BankApp, AICC routing backend, message gateway, or audio/video protocol integration.
- Voice/Video handoff requires the agent to be signed in, `Ready`, and `Idle`.
- `public/screenshots/bankapp/` keeps original customer-provided screenshots as source material; current BankApp demo pages do not directly expose them.
