# Context Snapshot - 2026-05-28 19:56 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- `livechat2` Conversation composer 工具栏移除图片图标按钮。
- 底部输入区现在只保留 Emoji、File、Message Record 三个工具图标。
- 图片消息渲染能力仍保留，只是不再展示图片上传入口。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载 Home tab。
- Browser `/design-system`：可加载 Design System。

## 风险

- 需要人工复查输入区图标顺序和间距。
