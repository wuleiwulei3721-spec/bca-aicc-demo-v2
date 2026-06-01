# Context Snapshot - 2026-05-28 16:20 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 用户要求 `livechat2` 页签显示客户服务时间最长的计时，并在新客户接入时闪烁，效果要贴近电话/视频来电弹屏。
- 已修改 `src/pages/AgentWorkspace.tsx`：
  - 新增 `WorkspaceDurationTiming` 与 `getLongestDurationTiming`。
  - 读取 `liveChat2SessionTimings` 和 `liveChat2SessionStatuses`。
  - `livechat2` tab 使用 active livechat2 客户中最长服务时长显示 `(mm:ss)`。
  - 只剩 ended 未关闭会话时，用 ended 会话的 `endedAt` 冻结最长时长。
  - 新接入客户使用 `flashUntil` 触发 `workspace-tab-label--tab-flash`。
- 未修改旧 `Live Chat`、电话/视频 tab、store 数据结构、客户列表、mock 或弹框逻辑。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载，Home tab 正常。
- Browser `/design-system`：可加载，Design System 文本可见。
- Browser livechat2 菜单点击：当前 in-app browser 未暴露可点击的左侧 livechat2 入口节点，未完成自动化点击验证。

## 风险

- 需要人工在目标演示分辨率下打开 `Channel Simulation > livechat2`，确认 tab 显示 `livechat2 (00:xx)` 并在新接入客户时短闪。
