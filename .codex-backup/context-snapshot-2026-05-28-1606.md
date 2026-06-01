# Context Snapshot - 2026-05-28 16:06 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- 用户要求继续优化 `livechat2` 客户列表面板：
  - Current / History 切换恢复文字展示。
  - 去除客户行转接图标。
  - 顶部 `ALL` 渠道标识文字使用系统主题深蓝色。
- 已修改 `LiveChat2CustomerPanel.tsx`：
  - 移除 Current/History 图标 tab 相关图标 import。
  - 移除客户行转接来源图标渲染。
  - Current / History 使用居中文字 tab，保留计数。
- 已修改 `src/styles/index.less`：
  - 调整 view tab 为文字 tab 间距与计数样式。
  - `ALL` 渠道头像颜色使用 `var(--aicc-primary-strong)`，非选中态也保持主题深蓝。
  - 移除不再使用的转接图标样式。
- 未修改旧 `Live Chat`、store、mock、路由或弹框逻辑。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载，标题为 `BANK 1 AICC Demo`，Home tab 正常。
- Browser `/design-system`：可加载，标题为 `BANK 1 AICC Demo`，Design System 文本可见。
- Browser `/`：自动化可检测到隐藏的 `livechat2` 文本，但当前 in-app browser 没有暴露侧栏入口的可点击可见节点，未完成菜单点击自动化验证。

## 风险

- 仍需在目标演示分辨率下人工复查 `livechat2` 入口、文字 tab 视觉、客户行无转接图标后的信息完整度，以及 `ALL` 深蓝色在选中/非选中态下是否自然。
