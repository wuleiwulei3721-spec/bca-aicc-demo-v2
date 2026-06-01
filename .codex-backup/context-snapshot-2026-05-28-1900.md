# Context Snapshot - 2026-05-28 19:00 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 修正 livechat2 服务时长初始化口径：`requestLiveChat2Workspace` 支持 `initialElapsedSeconds`。
- `BasicLayout` 打开 livechat2 时从 mock `customer.accessDuration` 解析初始服务时长。
- store 初始化 `liveChat2SessionTimings` 时用 `now - initialElapsedSeconds` 作为 `startedAt`。
- active 会话未回复计时在 `LiveChat2Page` 中被限制为不超过当前服务时长。
- `livechat2-005` customer-ended mock 的服务时长改为 `02:53`。
- customer-ended 系统消息统一为 `This user has ended the session.`，timeout 系统消息统一为 `This session was closed due to customer timeout.`。
- Conversation header 不再重复显示 customer/timeout ended 完整提示，结束原因只保留在对话系统消息中。

## 风险

- 需要人工复查目标演示分辨率下 active 服务时长、未回复计时、customer-ended `02:53`、灰态头像与 `Close` 是否符合演示预期。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载 Home tab。
- Browser `/design-system`：可加载 Design System。
- Browser `/`：`livechat2` 菜单文字存在于 DOM，但当前自动化判断入口不可见，细节仍需人工复查。
