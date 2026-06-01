# Context Snapshot - 2026-05-28 19:24 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- Conversation Transfer 弹框的 `Transfer Agent` 行内更多按钮已移除。
- 行内动作只保留 `Transfer` / `Conference`。
- `Force Transfer` / `Force Conference` 下拉入口不再显示。
- Conversation actions 列宽从 198px 收窄为 180px。
- 移除 `TransferModal.tsx` 中 Dropdown / DownOutlined / MenuProps 相关代码和 more 按钮样式。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载 Home tab。
- Browser `/design-system`：可加载 Design System。

## 风险

- 需要人工复查 Conversation Transfer 弹框，确认只剩两个按钮且表格布局不回归。
