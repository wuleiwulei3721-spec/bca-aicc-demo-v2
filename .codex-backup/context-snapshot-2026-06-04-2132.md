# Context Snapshot - 2026-06-04 21:32 +08:00

## Project

- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Purpose: BANK 1 AICC front-end demo for enterprise contact center workflows.
- Current local focus: continue Routing Config / Call Management development after customer production release.

## Current State

- Customer production on `main` remains the hidden-management-menu version.
- Local development branch exposes `Call Management` and `Routing Config`.
- Routing Config channel model is now split into `Channel Type`, `Channel`, and `Channel Account`.
- `Channel Types` is a read-only engineering-defined template page.
- `Channels` is an engineering-provisioned channel configuration page:
  - No Add/Delete Channel.
  - List shows Channel Type, Media Type, Account Count, Status, Actions.
  - Actions order is Edit, Accounts, Business Config.
  - Edit manages Media Type, Status, and channel-type access parameters.
  - Business Config manages media-specific service behavior and keeps field-level variable insertion.
  - Account Management manages multiple official accounts per channel.
- `Access Accounts` and `Media Service Rule Plans` menu entries are removed; old routes redirect to `Channels`.
- Queue settings have moved to `Skill Queues`.

## Latest Change

- Fixed `Channels > Account Management` modal overflow.
- Account Management no longer renders accounts in a wide table.
- Account list now uses stacked account cards with wrapping Account, Account Name, Credential / Secret Ref, Purpose, Status, and Edit/Delete actions.
- Account Management content area now scrolls vertically inside the modal when needed.
- Add/Edit Account secondary modal uses a single-column form to avoid long field labels and inputs crowding a two-column layout.

## Key Files

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `src/mock/routingConfiguration.ts`
- `src/types/routingConfiguration.ts`
- `src/store/routingConfigStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint` passed.
- `npm run build` passed with only the existing Vite/Rolldown chunk size warning.
- Browser opened `http://127.0.0.1:5184/routing-config/channels`.
- Instagram row Account Management modal opened with two accounts rendered as cards.
- Add Account secondary modal opened with all required fields and Save/Cancel controls.
- `git diff --check` only reported Windows line-ending conversion warnings.

## Risks

- Browser screenshot output in the Codex in-app browser appeared scaled/tiled, so visual confirmation should still be repeated manually at the user's actual demo resolution.
- No backend integration exists; all Routing Config changes are front-end mock behavior.
