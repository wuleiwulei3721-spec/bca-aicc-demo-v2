# Context Snapshot - 2026-05-28 23:01 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- `livechat2` 右侧 `Message Record` 页签改为日期范围 + 文字搜索 + `Search` 按钮。
- 默认日期范围为近 7 天；修改条件后需要点击 `Search` 或按 Enter 才刷新结果。
- 结果按发送时间倒序展示，并显示发送人、消息内容、发送时间。
- 消息内容命中的关键字继续高亮。
- 结果行 hover / focus 显示 `Locate` 按钮；点击后重置搜索条件，并定位到中间 Conversation 原消息且短暂高亮。
- 定位请求使用 `messageId + requestId`，支持重复定位同一条消息。

## 关键文件

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/liveChat2MessageUtils.ts`
- `src/styles/index.less`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 plugin timings 与 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser livechat2 点击链路：当前 in-app browser 可见 DOM 未暴露左侧 `livechat2` 菜单项，需人工复查。

## 风险

- 需要人工复查 livechat2 实际交互：Search 触发、结果倒序、Locate 定位和中间消息高亮。
- 当前改动只作用于 `livechat2` 的右侧 `Message Record` 和中间 Conversation 定位行为，旧 `Live Chat` 不应受影响。
- 当前浏览器自动化未能从左侧菜单打开 `livechat2`，因此该交互仍需人工确认。
