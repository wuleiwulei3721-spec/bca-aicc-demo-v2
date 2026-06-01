# Context Snapshot - 2026-05-28 18:13 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 用户指出 History 行第二行最新消息仍被第一行右侧结束时间列压缩。
- 已修改 `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`：
  - History 会话的消息行增加 `livechat2-session-card__message--full-row`。
- 已修改 `src/styles/index.less`：
  - `.livechat2-session-card__message--full-row` 使用 `grid-column: 1 / -1`。
- History 第一行仍保持客户名 + 挂断图标时间。
- 当前服务列表不改，继续保留第二行右侧星标 / Close 操作区。
- 未修改旧 `Live Chat`、store 数据结构、mock、弹框或 livechat2 其它交互。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载，Home tab 正常。
- Browser `/design-system`：可加载，Design System 文本可见。
- Browser livechat2 菜单点击：当前 in-app browser 未暴露可点击的左侧 livechat2 入口节点，未完成自动化点击验证。

## 风险

- 需要人工在目标演示分辨率下打开 `Channel Simulation > livechat2`，切到 History，确认第二行最新消息确实满宽且不和右侧时间冲突。
