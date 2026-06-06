# Context Snapshot - 2026-06-04 15:32 +08:00

## 项目目标

- `bca-aicc-demo-v2` 是 BANK 1 AICC 企业级客服坐席工作台前端演示系统。
- 客户 Production `main` 版本仍隐藏 `Call Management` / `Routing Config`。
- 当前本地开发分支为 `codex/text-channel-config-settings`，管理菜单已恢复，用于继续开发未完成配置页。

## 本轮状态

- 本轮只优化 `Routing Config > Media Service Rule Plans` 弹框。
- Add/Edit/View/Delete 弹框临时中文展示，方便先确认 Text 媒体规则配置逻辑。
- 弹框布局改成类似 `Working Time Plans` 的块状 section。
- `Channels`、列表列结构、路由和 `MediaServiceRulePlan` 类型均未调整。

## 关键变化

- 顶层块：基础信息、客户服务配置、坐席服务配置。
- 子块：接入量配置、排队配置、人工开场/结束配置、客户未回复配置、坐席未回复配置、Webchat 消息撤回、坐席未回复服务级别。
- 数字输入框收窄到约 160px。
- 最大排队人数 + 排队提示语、排队超时时长 + 排队超时提示语、未回复提醒时间 + 提醒话术、客户未回复超时 + 客户提醒、坐席未回复超时 + 自动回复内容同行展示。
- Add 默认话术和现有 Text rule plan mock 话术临时改为中文。

## 验证状态

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/media-service-rule-plans` 已检查 Add/View/Edit/Delete guard。
- Browser `/routing-config/channels` 已回归检查 Rule Plan 绑定列。

## 风险

- 本轮是临时中文确认版本；中文确认无误后需要再转回英文。
- 浏览器控制台仍有既有 Google Identity / FedCM 与 AntD deprecation 日志。
