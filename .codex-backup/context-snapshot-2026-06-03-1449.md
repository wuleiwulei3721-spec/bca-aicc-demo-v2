# Context Snapshot - 2026-06-03 14:49 +08:00

## Project

- Project: BANK 1 AICC Demo V2
- Path: `D:\03projects\bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current focus: `Routing Config > Working Time Plans`

## Current State

- `Working Time Plans` is no longer a flat generic CRUD page.
- The page now uses a custom admin CRUD layout with:
  - Keyword / Timezone / Schedule Mode / Status filters.
  - Table columns: Plan ID, Plan Name, Timezone, Schedule Mode, Description, Created Date, Updated Date, Status, Actions.
  - Add/Edit/View/Delete modal actions.
- The modal is structured into:
  - Basic Info
  - Work Schedule
  - Holiday Schedule
  - Special Working Plan
- `Schedule Mode = 24x7` shows an all-day coverage note and does not require schedule rows.
- `Schedule Mode = Custom Schedule` shows editable work, holiday, and special working sections.

## Data Model

- `WorkingTimePlan` now has structured arrays:
  - `workSchedules`
  - `holidayRules`
  - `specialWorkingPlans`
- Legacy summary fields remain for list display and compatibility:
  - `weekdayRule`
  - `holidayRule`
  - `specialDateRule`
- Mock data now includes `createdAt`, `updatedAt`, `description`, and sample work/holiday/special rules.
- `routingConfigStore` deep-clones nested working time plan arrays.

## Validation

- Plan ID, Plan Name, Timezone, Schedule Mode, and Status are required.
- Custom Schedule requires at least one Work Schedule row.
- Date ranges and time ranges are validated.
- Working time plans referenced by Skill Queues cannot be deleted directly.

## Verification

- `npm run lint`: passed.
- `npm run build`: passed; Vite/Rolldown chunk size warning remains.
- Browser checked `/routing-config/working-time-plans`:
  - List fields render.
  - Add modal renders.
  - 24x7 note renders.
  - Custom Schedule sections render.
  - Empty Custom Schedule save shows validation.

## Risks

- Each schedule row currently edits one time range. The type supports arrays, so UI can later expand to multiple ranges per rule.
- Existing AntD 6 deprecation warnings remain for `Alert.message` and `InputNumber.addonAfter`.
