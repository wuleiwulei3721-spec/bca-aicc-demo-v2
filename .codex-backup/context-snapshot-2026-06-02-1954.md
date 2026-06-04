# Context Snapshot - 2026-06-02 19:54 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`

## Latest Change

Standardized ordinary `Routing Config` CRUD toolbars.

## Behavior

- Route Elements management-console style is now the standard for ordinary Routing Config pages.
- All ordinary CRUD pages use an in-card toolbar above the table:
  - Left: query fields or `Keyword`.
  - Middle: `Search` primary and `Reset` secondary.
  - Right: independent `Add` primary.
- Page title no longer carries the Add button for ordinary no-filter pages such as VDN.
- Generic keyword search now uses draft/apply behavior:
  - Typing changes the draft value.
  - Clicking `Search` applies the filter.
  - Clicking `Reset` clears the filter.
- Toolbar controls share one height: 32px.

## Files Changed

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed.
- Browser `/routing-config/route-elements`: toolbar and table visible.
- Browser `/routing-config/vdn`: unified Keyword/Search/Reset/Add toolbar and table visible.

## Risk

- All ordinary Routing Config CRUD pages inherit this toolbar. Manual review is still recommended for wrapping and density on pages with long titles or narrow viewport.

## Rollback Notes

To roll back:

- Restore no-filter `RoutingConfigCrudPage` pages to PageContainer `extra` Add and old `routing-config-page__toolbar`.
- Remove the 32px Routing Config toolbar height rules from `src/styles/index.less`.
