# Context Snapshot - 2026-05-28 20:10 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- `livechat2` composer 中的 `Message Record` 图标现在打开右侧 Assistant 区域的新页签。
- 新页签显示在 `Assistant` / `Connection` 旁边，标题为 `Message Record`，支持关闭。
- Conversation 中间消息区不再因为历史消息记录被挤压。
- 记录面板继续保留时间范围筛选、搜索、消息高亮和客户端欢迎语过滤。
- `AssistantPanel` 增加 extra tabs 支持，当前只由 `livechat2` 使用。

## 关键文件

- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/liveChat2MessageUtils.ts`
- `src/styles/index.less`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser livechat2 点击链路：当前 in-app browser 可见 DOM 未暴露左侧菜单项，临时桌面 viewport 后仍只能看到 Home tab，需人工复查。

## 风险

- 需要人工复查点击历史消息图标后，右侧 `Message Record` tab 是否出现在 `Connection` 旁且可关闭。
- 右侧页签扩展目前为通用能力，但只有 `livechat2` 传入额外页签；旧 Inbound / Live Chat 默认不受影响。
- 当前浏览器自动化未能从左侧菜单打开 `livechat2`，因此该交互仍需人工确认。
