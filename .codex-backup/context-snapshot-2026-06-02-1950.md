# Context Snapshot - 2026-06-02 19:50 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`

## Latest Change

Implemented unified status display for ordinary `Routing Config` CRUD pages.

## Behavior

- Page-facing status language is `Enabled / Disabled`.
- Internal values remain `Active / Disabled`.
- `Active` maps to `Enabled` in `RoutingConfigStatusBadge`.
- List and View modal status display use the same small dot badge.
- Add/Edit modal status fields use the short pill switch plus text.
- Route Elements no longer uses a standalone AntD Tag for status.
- VDN and other ordinary CRUD pages no longer use `select Active/Disabled` for status editing.
- Skill Routing Rules can still show lifecycle states such as `Draft` and `Replaced`.

## Files Changed

- `src/pages/routing-config/RoutingConfigStatusBadge.tsx`
- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed.
- Browser `/routing-config/route-elements`: list, view modal and add modal status are consistent.
- Browser `/routing-config/vdn`: list, view modal and add modal status are consistent and no `Active` label is shown.

## Risk

- The `statusSwitch` field now affects all ordinary Routing Config CRUD pages. Manual visual review is still recommended for pages with denser forms.

## Rollback Notes

To roll back:

- Restore `RoutingConfigStatusBadge` to direct `status` label behavior.
- Restore `RoutingConfigCrudPage` `statusSwitch` view formatting to text and edit formatting to switch-only.
- Restore ordinary CRUD status fields in `RoutingConfigDataPages` from `statusSwitch` to select options.
- Restore Route Elements status list renderer to its previous AntD Tag renderer.
