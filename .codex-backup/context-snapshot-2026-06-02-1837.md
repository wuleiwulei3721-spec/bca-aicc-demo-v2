# Context Snapshot - 2026-06-02 18:37 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Branch: `codex/text-channel-config-settings`
- Goal: enterprise banking AICC front-end demo, with restrained admin/workbench UI density.
- Current delivery: split AICC routing configuration into a new first-level `Routing Config` menu with independent CRUD configuration pages.

## Latest Changes

- Added `src/pages/routing-config/*`:
  - `RoutingConfigCrudPage.tsx`
  - `RoutingConfigDataPages.tsx`
  - `SkillRoutingRulesPage.tsx`
  - `RoutingConfigStatusBadge.tsx`
  - `index.ts`
- Added `src/store/routingConfigStore.ts` and exported it from `src/store/index.ts`.
- Updated `src/routes.tsx` with `/routing-config/*` routes.
- Added `/routing-config` redirect to `/routing-config/route-elements`.
- Updated `src/layouts/BasicLayout.tsx`:
  - new first-level `Routing Config` menu
  - `Call Management` now only contains `Text Channel Settings`
  - route-driven menu selection and collapsed flyout support
- Replaced old `src/pages/call-management/RoutingConfigurationPage.tsx` with a redirect to `/routing-config/route-elements`.
- Removed `timezone` from `AccessSite` type/mock/page; kept timezone in `WorkingTimePlan`.
- Added CRUD styles and modal form styles in `src/styles/index.less`.

## Routing Config Pages

- `Route Elements`
- `VDN`
- `Sites`
- `Channels`
- `Channel Media`
- `Media Types`
- `Languages`
- `Business Types`
- `Site Access Volume`
- `Access Accounts`
- `Access Entries`
- `Working Time Plans`
- `Skill Queues`
- `Skill Routing Rules`

## Design Decisions

- `channel_media` remains separate from `channel`; channel media capacity, scan mode, scan interval, and extension config are edited on the `Channel Media` page.
- `ANY` remains an explicit routing value, not an empty field.
- Skill queues are reusable targets and do not hard-bind to VDN.
- Rule uniqueness is the active route factor combination; target skill queue is the route result.
- Sites do not carry timezone. Working time plans carry timezone because overseas routing availability, holidays, and reporting should be schedule-based.

## Validation

- `npm run lint`: passed.
- `npm run build`: passed; Vite chunk size warning remains.
- Browser smoke check passed:
  - `/`
  - `/design-system`
  - `/routing-config/route-elements`
  - `/routing-config/sites`
  - `/routing-config/channels`
  - `/routing-config/skill-routing-rules`
  - `/call-management/text-channel-settings`
  - `/call-management/routing-configuration` redirects to `/routing-config/route-elements`
- Browser interaction check passed:
  - Sites search
  - Sites Add modal
  - Sites referenced delete protection
  - Skill Routing Rules duplicate preview
  - Skill Routing Rules duplicate block when overwrite is unchecked

## Risks

- Routing Config remains front-end demo state only; refresh restores mock.
- No backend API, persistence, permission model, or production validation service exists yet.
- Automated checks covered representative pages and interactions, not every secondary page modal.

## Rollback

- Restore old `RoutingConfigurationPage` tabs page if needed.
- Remove `src/pages/routing-config/*` and `src/store/routingConfigStore.ts`.
- Restore `BasicLayout.tsx`, `routes.tsx`, `styles/index.less`, `PROJECT_CONTEXT.md`, `DEV_LOG.md`, and this backup set.
