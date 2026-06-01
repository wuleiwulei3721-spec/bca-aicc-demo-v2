# Context Snapshot - 2026-05-28 01:28 +08:00

项目：BANK 1 AICC Demo V2
路径：`D:\03projects\bca-aicc-demo-v2`
当前分支：`codex/livechat2-popup`

## 当前状态

- 当前继续在本地 `livechat2` 分支调试新版文字客服弹屏。
- 本轮只调整 `livechat2` 客户列表的视觉细节，不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。
- 当前未 push 到 GitHub。

## 本轮关键修改

- 收起态 warning / breach 不再显示头像左下角 SLA 小圆点，恢复为和展开态一致的左侧色条。
- 收起态只读星标移动到渠道头像内部右下角，并略微放大。
- 展开态 Current / History 切换改为参考 Assistant 的轻量下划线 tab。
- 排序按钮取消边框和白底，图标改为更简洁的菜单图标。

## 验证状态

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载并可 Sign In；受当前 in-app browser 中侧栏按钮无可点击 bounding box/后续 CDP timeout 影响，未完成 `livechat2` 菜单入口自动化点击验证。
- Browser `/design-system`：页面可加载，标题为 `BANK 1 AICC Demo`。

## 风险

- 仍需在目标演示分辨率下人工复查收起态左侧色条是否足够清晰。
- 仍需浏览器复查头像内星标不会遮挡渠道识别和 unread badge。
