# Context Snapshot - 2026-05-28 18:34 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 用户要求调整 `livechat2` conversation 顶部，并补充用户主动结束/超时结束的状态表现。
- 已修改 conversation 顶部：
  - 左侧显示渠道图标 + 客户名 + 服务时长。
  - 移除 `intent` 业务类型文案。
  - active 右侧只显示 `Transfer` + `End Service`。
  - ended 右侧只显示 `Close`。
  - customer ended 显示 `This user has ended the session.`。
  - timeout ended 显示 `This session was closed due to customer timeout.`。
- `Message Record` 从 header 移到消息区顶部的紧凑按钮。
- `LiveChat2SessionView` 增加 `endReason`。
- `requestLiveChat2Workspace` 支持 `initialSessionStatuses`，用于初始化 mock ended 会话。
- 新增 Haloapps mock `livechat2-005`，状态为 `ended`、`endReason: customer`，用于展示客户主动结束。
- 不实现真实 timeout 自动结束计时器，不接 Call Management 配置页。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载，Home tab 正常。
- Browser `/design-system`：可加载，Design System 文本可见。
- Browser livechat2 菜单点击：当前 in-app browser 未暴露可点击的左侧 livechat2 入口节点，未完成自动化点击验证。

## 风险

- 需要人工在目标演示分辨率下打开 `Channel Simulation > livechat2`，复查 active/customer ended 两类 header、Close 行为、头像灰度和 Message Record 入口。
