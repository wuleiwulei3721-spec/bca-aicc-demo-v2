# Context Snapshot - 2026-06-13 11:31 +08:00

## Project

- Workspace: `D:\03projects\bca-aicc-demo-v2`
- Main focus: BANK 1 AICC demo with Customer Verification Rule V2 and unified Admin management page standards.
- Current Admin rule: use `src/components/admin/*` for Call Management and Routing Config maintenance pages; default page size is 10 with `10/20/50/100` options.

## This Session

- Completed the second Admin UI correction round requested by the user.
- `AdminTable` default page size changed from 20 to 10.
- `Verification Rule V2` list Status changed from a switch to `Enabled/Disabled` badges; switches remain only in Add/Edit modals.
- V2 list tags are single-line with ellipsis so 10-row pagination is visible at 1366x768.
- `Question Bank` modal no longer forces a 390px internal table body; default 10 rows render without an unnecessary internal table scrollbar.
- `Blacklist Management` Add and Batch Add now use the same button weight, and table columns are tightened to avoid default desktop horizontal overflow.
- `Priority List Management` Channel and Priority Number filter widths are both 220px.
- `Busy Reason Management` keeps busy reason names unchanged and only replaces active `remark` text with concise English descriptions.
- `Skill Routing Rules` places Search, Reset, and Batch Add in one action group.
- `/design-system` Admin Management Page contract now reflects the revised standards.

## Key Files

- `AGENTS.md`
- `src/components/admin/adminTableUtils.ts`
- `src/pages/DesignSystem.tsx`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/pages/call-management/BlacklistManagementPage.tsx`
- `src/pages/call-management/PriorityListManagementPage.tsx`
- `src/pages/call-management/BusyReasonManagementPage.tsx`
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/mock/busyReasons.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## Validation

- `npm run lint` passed.
- `npm run build` passed with the existing Vite/Rolldown chunk size warning.
- Busy Reason mock sensitive-brand scan passed.
- Chrome CDP 1366x768 checks passed for `/design-system`, V2, Question Bank, Blacklist, Busy Reason, Priority List, and Skill Routing Rules.

## Risks

- Business logic and store structures were not changed.
- Some older historical docs still contain past recovery wording; current customer-visible code and new summaries should follow the updated desensitized wording rule.
