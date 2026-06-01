# Context Snapshot - 2026-05-28 18:00 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 用户确认 `livechat2` 历史列表需要展示结束会话时间，使用时分秒。
- 已修改 `src/pages/inbound/LiveChat2Page.tsx`：
  - 新增历史结束时间格式化逻辑。
  - `LiveChat2SessionView` 数据新增 `endTimeDisplay`。
  - 历史会话优先使用真实 `endedAt`；初始历史 mock 使用 `lastMessageAt` 兜底。
  - 当天显示 `Ended HH:mm:ss`，非当天显示 `Ended MM-DD HH:mm:ss`。
- 已修改 `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`：
  - 仅历史列表展开态在客户行第一行右侧渲染结束时间。
- 已修改 `src/styles/index.less`：
  - 新增 `.livechat2-session-card__end-time` 浅灰、紧凑、tabular nums 样式。
- 未修改旧 `Live Chat`、store 数据结构、mock、弹框或 livechat2 其它交互。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载，Home tab 正常。
- Browser `/design-system`：可加载，Design System 文本可见。
- Browser livechat2 菜单点击：当前 in-app browser 未暴露可点击的左侧 livechat2 入口节点，未完成自动化点击验证。

## 风险

- 需要人工在目标演示分辨率下打开 `Channel Simulation > livechat2`，切到 History，确认结束时间不挤压客户名，且当前列表和收起态不显示结束时间。
