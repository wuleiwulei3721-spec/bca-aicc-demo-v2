# Context Snapshot - 2026-05-28 19:17 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 修正 Conversation Transfer 弹框中 `Transfer Agent` 表格动作列过宽的问题。
- 动作列宽从 262px 收窄为 198px。
- `Transfer` / `Conference` 主按钮宽度从 112px 收窄为 80px。
- Transfer 弹框表头设置 `white-space: nowrap`，避免被动作列挤压后换行。
- Conversation 行内按钮补齐 `inline-flex`、`box-sizing` 和行高，避免边框被裁切。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载 Home tab。
- Browser `/design-system`：可加载 Design System。

## 风险

- 需要人工复查 Conversation Transfer 弹框表格，确认表头不换行、按钮边框完整。
