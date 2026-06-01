# Context Snapshot - 2026-05-28 00:54 +08:00

项目：BANK 1 AICC Demo V2
路径：`D:\03projects\bca-aicc-demo-v2`
当前分支：`codex/livechat2-popup`

## 当前状态

- 当前继续在本地 livechat2 分支上调试新版文字客服弹屏。
- 本轮只调整 livechat2 客户列表结构和样式，不修改旧 Live Chat、store、mock、路由或弹框逻辑。
- 当前未 push 到 GitHub。

## 本轮关键修改

- 删除 livechat2 客户列表 Serving 工具行。
- Current / History 改为简洁 tab 行，排序改为右侧小图标下拉。
- 客户卡片删除最新消息时间，未回复计时去掉时钟图标。
- 恢复 warning / breach 左侧色条和收起态小圆点。
- 转接与星标放在右侧同一行；星标菜单只显示图标。
- 收起态渠道筛选、badge、星标小标记和横向溢出已优化。
- 展开态第一列收窄到接近旧 Live Chat。

## 验证状态

- `npm run lint`：通过。
- `npm run build`：通过，仍有既有 Vite/Rolldown chunk size warning。

## 风险

- 仍需在浏览器中人工复查目标分辨率下收起态无横向滚动。
- 后续如继续压缩 livechat2 面板，需要同时关注 Conversation 与 Assistant 列是否被挤压。
