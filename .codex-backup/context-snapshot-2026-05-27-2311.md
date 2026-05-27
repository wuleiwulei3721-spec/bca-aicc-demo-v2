# Context Snapshot - 2026-05-27 23:11 +08:00

项目：BANK 1 AICC Demo V2  
路径：`D:\03projects\bca-aicc-demo-v2`  
当前分支：`codex/modal-review-fixes`

## 当前状态

- 当前分支仍是弹框评审发布线，不包含 `codex/livechat2-popup` 的 livechat2 commits。
- 本轮继续修正 Transfer / Outbound 坐席列表宽度和查询栏控件对齐。
- 本轮未 push 到 GitHub。

## 本轮关键修改

- `Transfer Agent` 与 `Outbound Call > Call Agent` 坐席列表移除 `Department` 列。
- `Name`、`Skill Name` 列放宽，Conversation Transfer 动作列放宽，保证行内按钮能完整展示。
- `.aicc-transfer-search` 统一使用 30px 控件高度。
- 为 SearchInput、Skill Queue、Status、Search 按钮增加高优先级样式覆盖，避免被通用 modal toolbar 28px 规则覆盖造成高低不齐。
- `PROJECT_CONTEXT.md` 与 `DEV_LOG.md` 已同步更新。

## 验证状态

- `npm run lint`：通过。
- `npm run build`：通过，仍有既有 Vite/Rolldown chunk size warning。

## 风险

- Transfer / Outbound 弹框仍建议用户在本地浏览器中人工最终复查。
- 发布前必须确认只发布 `codex/modal-review-fixes`，不要 push `codex/livechat2-popup`。
