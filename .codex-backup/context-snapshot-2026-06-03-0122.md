# Context Snapshot - 2026-06-03 01:22 +08:00

## Project

- Project: `bca-aicc-demo-v2`
- Branch: `codex/text-channel-config-settings`
- Current workstream: `Routing Config` menu naming and ordering.

## Current Change

- Updated `Routing Config` secondary menu labels to Chinese business names.
- Reordered the secondary menu as requested.
- Kept all route paths unchanged.
- Synced page titles with the menu names so the top-left page title matches the selected menu.

## Menu Order

1. `路由要素配置`
2. `VDN配置`
3. `接入站点配置`
4. `渠道配置`
5. `业务类型配置`
6. `技能队列配置`
7. `接入账号配置`
8. `站点接入量配置`
9. `技能路由规则配置`
10. `工作时间方案配置`

## Key Files

- `src/layouts/BasicLayout.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## Verification

- `npm run lint`: passed.
- `npm run build`: passed with existing Vite/Rolldown chunk size warning.
- Browser `/routing-config/route-elements`: expanded left navigation and confirmed the 10 labels appear in the requested order.

## Risks

- Only menu labels and page titles were localized to Chinese. Internal table columns, filters, and modal field labels remain in the existing English admin style.
