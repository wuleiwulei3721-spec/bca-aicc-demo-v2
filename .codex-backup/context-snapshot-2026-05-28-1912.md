# Context Snapshot - 2026-05-28 19:12 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 微调 Conversation Transfer 弹框的 `Transfer Agent` 表格行内按钮文案。
- 两个主按钮从 `Request Transfer` / `Request Conference` 改为 `Transfer` / `Conference`。
- `Force Transfer` / `Force Conference` 下拉动作保持不变。
- 本轮只改 `TransferModal.tsx` 显示文案和项目文档/备份。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。

## 风险

- 需要人工复查 Conversation Transfer 弹框按钮文案是否符合演示口径。
