# Context Snapshot - 2026-06-04 21:19 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Scope: Routing Config Channels UI refinements after the channel type/channel/account refactor.

## Current Work

- Channels list now uses Account Count instead of Access Parameters.
- Row action order is Edit, Accounts, Business Config.
- Edit Channel modal is split into Basic Information and Access Parameters blocks.
- Business Config modal removes the extra Customer Service Configuration nesting and starts directly with Access Configuration.
- Business Config message fields restore field-level Insert Variable controls.
- Account Management table width is reduced and constrained inside the modal.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; only existing Vite/Rolldown chunk size warning.

## Risk

- Manual browser review is still needed for variable insertion at an arbitrary cursor position.
- Manual browser review is still needed for Account Management modal width at the target demo resolution.
