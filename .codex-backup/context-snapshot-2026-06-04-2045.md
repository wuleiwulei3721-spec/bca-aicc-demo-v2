# Context Snapshot - 2026-06-04 20:45 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC enterprise demo. Customer Production on `main` hides unfinished management menus; local development branch keeps Routing Config visible.

## Current Work

- Scope: `Routing Config` channel access model.
- UI copy for affected pages is English.
- Channel model is now three-layered:
  - `Channel Type`: engineering-defined license dictionary and access parameter template.
  - `Channel`: concrete access configuration under a channel type.
  - `Channel Account`: one or more official service accounts under a channel.

## Key Changes

- Added `Channel Types` menu and `/routing-config/channel-types`.
- `Channel Types` lists Phone, Haloapp, Webchat, WhatsApp, Email, Instagram, LinkedIn, Facebook, X, Tik Tok, YouTube, AppStore, PlayStore.
- Phone has no access parameters.
- `Channels` no longer has Add/Delete Channel actions.
- `Channels` row actions are now Edit, Business Config, Accounts.
- Channel Edit can update Media Type, Status, and concrete technical access parameters; Channel ID, Name, and Type are read-only.
- Business Config is stored on Channel and rendered by media type:
  - Text: access, agent opening/ending, customer no reply, agent no reply, agent service.
  - Voice/Video: access configuration only.
- Account Management supports Account, Account Name, Credential / Secret Ref, Purpose, Status.
- Email mock demonstrates multiple channels under the Email channel type for different mail server settings.
- Instagram mock demonstrates one channel with multiple accounts.
- Standalone `Access Accounts` and `Media Service Rule Plans` menu entries are removed.
- `/routing-config/access-accounts` and `/routing-config/media-service-rule-plans` redirect to `/routing-config/channels`.
- Queue configuration moved to `Skill Queues`: Non-working Time Message, Max Queue Customers, Queue Waiting Message, Queue Timeout, Queue Timeout Message.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; only existing Vite/Rolldown chunk size warning.
- Local dev server `http://127.0.0.1:5184` returned 200 for:
  - `/routing-config/channel-types`
  - `/routing-config/channels`
  - `/routing-config/skill-queues`

## Risk

- This is a front-end mock refactor only, not backend schema integration.
- Browser automation was unavailable in this environment because Playwright/browser tools were not installed or exposed, so visual/modal checks remain manual.
- `MediaServiceRulePlansPage` source remains in the repo as historical code but is no longer reachable from menu or route.
