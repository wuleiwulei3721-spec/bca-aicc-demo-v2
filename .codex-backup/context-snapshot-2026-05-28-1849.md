# Context Snapshot - 2026-05-28 18:49 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 按用户反馈微调 `livechat2` conversation header。
- 未回复计时从可见 `Unanswered mm:ss` 改为告警图标 + `mm:ss`，减少 header 文案长度。
- 未回复提示保留 `title` / `aria-label`，悬浮或读屏仍能表达 `Unanswered` 语义。
- `End Service` 增加专属危险 hover/focus 样式：浅红背景 + 深红文字。
- 本轮只修改 `LiveChat2ConversationWorkspace.tsx`、`src/styles/index.less` 和项目文档/备份。

## 风险

- 需要人工复查目标演示分辨率下未回复图标是否清晰，且 End Service hover 红色是否符合危险操作预期。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载 Home tab。
- Browser `/design-system`：可加载 Design System。
