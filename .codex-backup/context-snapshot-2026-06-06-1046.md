# Context Snapshot - 2026-06-06 10:46 +08:00

## Project

- Project: BANK 1 AICC Demo V2.
- Branch: `codex/admin-config-latest`.
- Base: latest `main`, with `codex/routing-vdn-sites-remove-status` merged in locally.

## Current State

- `main` remains the customer-safe production line and keeps `Call Management` / `Routing Config` hidden.
- `codex/admin-config-latest` is the local internal admin branch for continuing Call Management and Routing Config work.
- The branch keeps customer-facing updates from `main`: AUX reason modal, PSTN customer identity refresh, Customer Information access duration fix, IVR `Menu` hint, and Live Chat Current empty state.
- The branch also restores admin menus and routes for `Call Management` and `Routing Config`.

## Admin Configuration Highlights

- Call Management includes Global Control Configuration and Busy Reason Management.
- Busy Reason data is shared by the right-avatar AUX modal and the internal management page.
- Routing Config includes Channel Type Management, Channels, Skill Queues, Working Time Plan preview, Phone exception working time plan, VDN / Access Sites / Skill Queues status-field removal, and `Default 24/7` work time wording.

## Risks

- This branch exposes internal management menus and must not be published directly to customer Production.
- Future customer-visible changes should branch from `main` or another customer-safe baseline.
