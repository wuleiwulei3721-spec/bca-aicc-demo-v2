# Context Snapshot - 2026-05-25 15:34 +08:00

项目：BANK 1 AICC Demo V2  
路径：`D:\03projects\bca-aicc-demo-v2`  
当前分支：`codex/inbound-tab-card-visual-polish`  
目标版本：`v0.6.5`

## 当前状态

- `main@v0.6.4` 已作为当前客户可查看版本，包含 Ready-aware 通话接入提示。
- 本轮只做 Inbound 弹屏视觉稳定优化，不修改 store、路由、mock、tab key 或话务状态机。
- 重点范围是左栏 `Ticketing History` 卡片和中部 CRM workspace tabs。

## 本轮关键修改

- `TicketingHistoryCard` 将 ticket 编号和日期合并到右侧 meta 区，统一右对齐。
- `CrmPanel` 新增统一 CRM tab label 渲染结构，固定 CRM、Conversation 和动态业务 tab 的图标/文字排列。
- `index.less` 锁定中部 CRM tabs nav 单行固定高度，压缩 overflow 更多按钮，并让 content holder 填满剩余高度。

## 验证状态

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：主路由加载，Sign In 后固定 `Live Chat` tab 可见。
- Browser smoke check `/design-system`：页面正常加载。

## 风险

- 该改动为视觉层优化，主要风险是 AntD Tabs overflow 在目标演示分辨率下仍需人工复查。
- 受 in-app browser 当前可见导航区域限制，本轮未完整点击 PSTN 后逐项打开 CRM 动态 tab，需用常规浏览器补做视觉复查。
- 动态 tab 开启、关闭和去重逻辑未改，预期业务风险低。
