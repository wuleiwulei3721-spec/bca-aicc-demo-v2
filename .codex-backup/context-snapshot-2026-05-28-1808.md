# Context Snapshot - 2026-05-28 18:08 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 用户澄清：历史列表不是不要具体时间，而是把可见的 `Ended` 前缀换成图标。
- 已修改 `src/pages/inbound/LiveChat2Page.tsx`：
  - `formatHistoryEndTime` 现在返回纯时间。
  - 当天为 `HH:mm:ss`，非当天为 `MM-DD HH:mm:ss`。
- 已修改 `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`：
  - 历史客户行右侧渲染 `DisconnectOutlined + endTimeDisplay`。
  - `aria-label` / `title` 保留 `Ended ${time}`。
- 已修改 `src/styles/index.less`：
  - 结束标识保持浅灰、紧凑、tabular nums，并给图标设置小尺寸。
- 当前列表、收起态、旧 `Live Chat`、store 数据结构和 mock 不变。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载，Home tab 正常。
- Browser `/design-system`：可加载，Design System 文本可见。
- Browser livechat2 菜单点击：当前 in-app browser 未暴露可点击的左侧 livechat2 入口节点，未完成自动化点击验证。

## 风险

- 需要人工在目标演示分辨率下打开 `Channel Simulation > livechat2`，切到 History，确认右侧图标 + 时间不再明显压缩最新消息。
