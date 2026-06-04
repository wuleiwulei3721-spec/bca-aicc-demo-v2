# Context Snapshot - 2026-06-02 19:18 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Tech stack: React 19, TypeScript, Vite, Ant Design, Zustand, Less

## Current Focus

The current workstream is `Routing Config`, especially the first child page `Route Elements`.

User feedback for this iteration:

- Use English UI.
- Keep Search and Reset close to the filter fields.
- Add button must be independent and right aligned.
- Search filter select width should match text input width.
- Table should use compact management-console density and bottom pagination.
- Modal title should be black.
- Modal footer background should remain visible.
- Search/Reset and modal Cancel/Save style buttons should have the same width.
- Status switch should be a short pill switch, not a long On/Off control.

## Latest Changes

- `src/pages/routing-config/RoutingConfigCrudPage.tsx`
  - Toolbar markup now separates the left query group from the right Add action.
  - Add remains independent and right aligned.
  - Search and Reset stay grouped next to filters.

- `src/styles/index.less`
  - Added `routing-config-page__query-group` and `routing-config-page__add-action`.
  - Search/Reset and CRUD modal footer buttons use a fixed 82px width.
  - CRUD modal footer restored with shallow background and top border.
  - `routing-config-status-switch` is now a fixed 34px x 18px short pill switch.
  - Mobile rules include query group and add action.

- Documentation updated:
  - `PROJECT_CONTEXT.md`
  - `DEV_LOG.md`
  - `.codex-backup/key-prompts.md`

## Validation

- `npm run lint`: passed.
- `npm run build`: passed.
- Build still reports the existing Vite chunk size warning.
- Browser check on `/routing-config/route-elements`:
  - English page title visible.
  - Filter fields visible.
  - Add button visible as a separate action.
  - Table columns remain `Element ID`, `Element Name`, `Status`, `Actions`.
  - Bottom pagination shows record count and page size.
  - Add modal opens without initial validation error.
  - Clicking Save shows a compact validation alert.

## Risks

- The latest CRUD toolbar, footer, button width and short switch styles apply to the shared Routing Config CRUD container, so other ordinary Routing Config pages inherit the same management-console style.
- This is intended for consistency, but each child page still needs manual visual review in the target demo resolution.

## Rollback Notes

To roll back this iteration only:

- Restore `RoutingConfigCrudPage.tsx` toolbar markup to the previous single action group if needed.
- Remove or revert `routing-config-page__query-group`, `routing-config-page__add-action`, modal footer, fixed button width and short switch CSS changes in `src/styles/index.less`.
- Restore the 19:11 versions of `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and `.codex-backup/key-prompts.md`.
