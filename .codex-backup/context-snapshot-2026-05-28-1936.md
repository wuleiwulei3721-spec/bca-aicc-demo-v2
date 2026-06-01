# Context Snapshot - 2026-05-28 19:36 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- `Message Record` 入口从消息区顶部移到 composer 工具栏，位于文件发送图标旁边。
- 消息区不再显示 `Click to load more` / `No more records`，历史消息和当前消息直接滚动展示。
- 坐席端过滤客户端欢迎语系统消息，不显示在 Conversation 或 Message Record。
- 已撤回消息不再可引用；当前坐席已撤回消息显示 `Re-edit`，点击后将原消息内容带回输入框。
- 本轮只调整 `LiveChat2ConversationWorkspace.tsx`、`src/styles/index.less` 和项目文档/备份。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载 Home tab。
- Browser `/design-system`：可加载 Design System。

## 风险

- 需要人工复查 active Conversation 的历史记录图标位置、欢迎语过滤和撤回消息重新编辑行为。
