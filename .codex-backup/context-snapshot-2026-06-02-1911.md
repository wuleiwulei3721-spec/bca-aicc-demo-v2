# Context Snapshot - 2026-06-02 19:11 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Branch: `codex/text-channel-config-settings`
- Current focus: continue refining `Routing Config > Route Elements` to match admin CRUD list standards.

## Latest Changes

- `Route Elements` UI switched back to English:
  - `Route Element Configuration`
  - `Element ID`
  - `Element Name`
  - `Status`
  - `Search`, `Reset`, `Add`
- Search/reset/add controls now sit next to the query fields instead of being separated from them.
- Status filter width now matches the text input widths.
- Generic CRUD table pagination is enabled:
  - default page size 20
  - page size options 10 / 20 / 50 / 100
  - total count shown in pagination footer
- Routing Config CRUD table density was reduced:
  - smaller table font
  - tighter cell padding
  - smaller row action icon buttons
- CRUD modal refinements:
  - title color is black
  - extra read-only/input-like white field backgrounds removed
  - status switch is shorter

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; Vite chunk size warning remains.
- Browser `/routing-config/route-elements` passed:
  - English title and fields
  - Search / Reset / Add visible next to filters
  - table has only `Element ID`, `Element Name`, `Status`, `Actions`
  - footer pagination shows `1-9 of 9 records` and `20 / page`
  - Add modal has no initial validation error
  - Save shows English validation after missing required fields

## Risk

- Pagination now applies to all pages using `RoutingConfigCrudPage`. This is aligned with admin table behavior, but individual pages may need an opt-out later.

## Rollback

- Restore `RoutingConfigCrudPage.tsx`, `RoutingConfigDataPages.tsx`, and `styles/index.less` to the 19:03 state.
