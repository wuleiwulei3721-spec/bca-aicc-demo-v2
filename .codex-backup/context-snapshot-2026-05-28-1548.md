# Context Snapshot - 2026-05-28 15:48 +08:00

项目：BANK 1 AICC Demo V2
路径：`D:\03projects\bca-aicc-demo-v2`
当前分支：`codex/livechat2-popup`

## 当前状态

- 当前继续在本地 `livechat2` 分支调试新版文字客服弹屏。
- 本轮只调整 `livechat2` 客户列表面板，不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。
- 当前未 push 到 GitHub。

## 本轮关键修改

- Current / History 改为居中图标-only tab，保留计数 badge、`aria-label` 和 `title`。
- 排序按钮固定在 tab 行右侧，默认隐藏，hover/focus 整行时显示。
- 客户卡片改为两行 grid：客户名与未回复计时对齐，最新消息与转接/星标/Close 工具对齐。
- 星标菜单改为 hover 触发，去掉下拉箭头；灰色未关注星标默认隐藏，行 hover/focus 时显示空心灰星。
- 收起态头像内星标去掉白色圆形背景，仅保留星标并加轻量白色描边阴影。

## 验证状态

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning；本轮额外出现插件耗时提示，不影响构建结果。
- Browser `/design-system`：页面可加载，标题为 `BANK 1 AICC Demo`。
- Browser `/`：页面可加载；自动化可数到侧栏和 `livechat2` 按钮，但当前 in-app browser 仍报告侧栏按钮无可点击 bounding box，未完成菜单点击验证。

## 风险

- 仍需在目标演示分辨率下人工复查 `livechat2` 入口、图标 tab 的识别度和 hover 排序按钮的可发现性。
- 灰色星标默认隐藏后，用户需要通过行 hover 才能发现未关注星标入口。
