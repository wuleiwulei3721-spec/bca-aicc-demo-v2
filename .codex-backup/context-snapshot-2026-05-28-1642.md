# Context Snapshot - 2026-05-28 16:42 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 用户要求：
  - `livechat2` 页签时间不用变色。
  - 页签只展示当前服务客户中最长的服务时长。
  - 当前没有服务客户时，页签不显示时长。
  - 历史会话在客户列表面板收起态不显示星标。
- 已修改 `src/pages/AgentWorkspace.tsx`：
  - `livechat2` tab duration 只来自 active livechat2 timings。
  - 移除 ended livechat2 timings fallback。
  - 移除 `livechat2` tab 的 SLA state 传参，避免页签时间变色。
  - 新客户接入 flash 仍基于 active timings 的 `flashUntil`。
- 已修改 `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`：
  - 收起态头像内星标只在非历史会话且有标记颜色时渲染。
- 未修改旧 `Live Chat`、电话/视频 tab、store 数据结构、mock、弹框或客户列表其它交互。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载，Home tab 正常。
- Browser `/design-system`：可加载，Design System 文本可见。
- Browser livechat2 菜单点击：当前 in-app browser 未暴露可点击的左侧 livechat2 入口节点，未完成自动化点击验证。

## 风险

- 需要人工在目标演示分辨率下打开 `Channel Simulation > livechat2`，确认 tab 计时不变色、无 active 客户时不显示时长、新接入仍短闪，以及历史会话收起态无星标。
