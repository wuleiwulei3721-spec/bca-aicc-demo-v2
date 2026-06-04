# Context Snapshot - 2026-06-04 14:54 +08:00

## 项目目标

- `bca-aicc-demo-v2` 是 BANK 1 AICC 企业级客服坐席工作台前端演示系统。
- 客户 Production 版本位于 `main`，继续隐藏 `Call Management` / `Routing Config` 菜单和直达路由。
- 当前本地开发分支为 `codex/text-channel-config-settings`，管理菜单已恢复，用于继续开发 Routing Config / Call Management。

## 本轮状态

- 本轮完成 `Routing Config > Media Service Rule Plans` 的 Text 媒体规则方案新增/编辑/查看页改造。
- `Basic Info` 保持 Plan ID、Plan Name、Media Type、Status、Description。
- Text 规则方案字段重组为 `Customer Service Configuration` 和 `Agent Service Configuration`。
- `Customer Service Configuration` 包含 Access、Queue、Agent Opening / Ending、Customer No Reply、Agent No Reply 五个子分区。
- `Agent Service Configuration` 包含 Webchat Message Recall Limit 和 Agent No Reply Service Level。
- 旧的页面内 `Queue Alert / Recipients` 区块已移除。
- `Channels` 本轮未改字段，只继续展示和维护 Channel + Text 的 Rule Plan 绑定。

## 关键文件

- `src/pages/routing-config/RoutingConfigDataPages.tsx`：Media Service Rule Plans 表单结构、校验、Add/Edit/View/Delete 逻辑。
- `src/types/routingConfiguration.ts`：`MediaServiceRulePlan` 新字段类型。
- `src/mock/routingConfiguration.ts`：Text rule plan mock 默认值和英文话术。
- `src/store/routingConfigStore.ts`：Routing Config 本地 store 初始化。
- `src/styles/index.less`：Media Service Rule Plans 子分区样式。
- `PROJECT_CONTEXT.md`、`DEV_LOG.md`、`.codex-backup/key-prompts.md`：本轮上下文、日志和恢复口径。

## 验证状态

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/media-service-rule-plans`：Add / View / Edit / Delete guard 已检查。
- Browser `/routing-config/channels`：Rule Plan 绑定列表仍正常显示。

## 风险

- `Channels` 后续仍需按用户计划继续调整，只绑定并引用规则方案。
- `Call Management > Text Channel Settings` 旧页面仍存在，未来需要决定废弃、迁移或继续保留的关系。
- 浏览器控制台仍有既有 Google Identity / FedCM 网络日志，不是本轮改造引入。
