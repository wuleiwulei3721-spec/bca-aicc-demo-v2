# Context Snapshot - 2026-06-13 11:42 +08:00

## Project

- Workspace: `D:\03projects\bca-aicc-demo-v2`
- Focus: Admin management page style consistency for Call Management and Routing Config.
- Current button rule: Search is primary in the query action area, Reset is secondary, Add/Batch Add are primary actions on the toolbar right with natural text width, and Delete remains danger.

## This Session

- Corrected the Admin main action interpretation after user feedback.
- `Skill Routing Rules` Batch Add moved back to the toolbar right-side primary action area.
- `Skill Routing Rules` Batch Add now uses primary styling and natural text width instead of the fixed query action width.
- `Blacklist Management` Add and Batch Add now use primary styling.
- `Priority List Management` Add and Batch Add now use primary styling.
- Removed the rule-page nowrap override for query actions because Batch Add is no longer part of that fixed-width group.
- Updated `/design-system`, `AGENTS.md`, `PROJECT_CONTEXT.md`, and `DEV_LOG.md`.

## Key Files

- `AGENTS.md`
- `src/pages/DesignSystem.tsx`
- `src/pages/call-management/BlacklistManagementPage.tsx`
- `src/pages/call-management/PriorityListManagementPage.tsx`
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Chrome CDP 1366x768 check passed: Skill Routing Rules Batch Add is right-aligned, primary, same top as Search/Reset, and naturally wider than the fixed Search button; Blacklist and Priority Add/Batch Add are primary.

## Risks

- No business logic or store data changed.
