# Context Snapshot - 2026-06-13 11:54 +08:00

## 项目目标

- `bca-aicc-demo-v2` 是 BANK 1 AICC 前端演示系统，当前继续收敛 Call Management 与 Routing Config 的管理台统一样式规范。
- 本轮只处理 `Routing Config > Skill Routing Rules` 查询区布局问题，不修改业务流程、store、mock 或表格数据。

## 本轮修改

- `Skill Routing Rules` 的 Search/Reset 从 AdminToolbar 独立 actions 行移入 filters flex 流，放在 `Status` 后面。
- Batch Add 保持右侧 `primaryActions`，primary 样式，自然宽度，不使用 Search/Reset 的固定宽度。
- 规则页 toolbar 使用两列 grid：左侧查询条件可换行，右侧主操作底部对齐。
- `/design-system` 的 Admin Management Page 文案同步为“复杂筛选可换行；Search/Reset 留左，主操作留右”。

## 关键文件

- `src/pages/routing-config/SkillRoutingRulesPage.tsx`
- `src/styles/index.less`
- `src/pages/DesignSystem.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## 风险

- 若后续启用更多 Route Factors，查询条件会继续自然换行；右侧 Batch Add 仍应独立保留在主操作区。
- 本轮未改业务数据和 CRUD 流程，主要风险集中在不同宽度下的视觉回归。
