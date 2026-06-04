# Context Snapshot - 2026-06-03 15:57 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Stack: React 19, TypeScript 6, Vite 8, Ant Design 6, Zustand, Less

## Current Focus

Routing Config admin pages continue to use the compact management-table style. This snapshot records the final Working Time Plans adjustment for the Indonesia-only scenario:

- Working Time Plans no longer has `timezone`.
- Working Time Plans only maintains custom plans.
- There is no real `Default 24x7` plan record in mock data.
- Skill Queues may leave Work Time Plan empty; empty displays as `Default 24x7`.
- Working Time Plans supports Ramadan Work Schedule as a regular-workday date range override.

## Files Changed In This Step

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/store/routingConfigStore.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Working Time Rules

- No selected skill queue work time plan means `Default 24x7`.
- If a custom plan is selected, runtime priority is:
  `Special Working Plan > Holiday Schedule > Ramadan Work Schedule > Work Schedule`.
- Holiday rules are non-working overrides.
- Special Working Plans are highest-priority temporary working overrides.
- Ramadan Work Schedule is not a holiday and not a special working plan; it is a regular-workday schedule override within one Ramadan date range.
- A custom plan must have at least one Work Schedule row.
- Ramadan enabled requires date range and at least one Ramadan work schedule row.

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Browser checked `/routing-config/working-time-plans`.
- Browser checked `/routing-config/skill-queues`.
- Browser logs still show existing AntD deprecation warnings for `Alert.message` and `InputNumber.addonAfter`.

## Risks

- Ramadan currently supports one date range per plan. If administrators need historical or multi-year Ramadan periods, convert `ramadanSchedule` to an array.
- Runtime work-time calculation is documented and represented in UI/data only; there is no backend service in this demo.
- Existing AntD deprecation warnings remain outside this scope.
