# Context Snapshot - 2026-05-25 03:39 +08:00

项目：BANK 1 AICC Demo V2  
路径：`D:\03projects\bca-aicc-demo-v2`  
当前分支：`codex/live-chat-visibility-read-state`  
目标版本：`v0.6.1`

## 当前状态

- `main@v0.6.0` 已作为多 Inbound 弹屏与通话 tab 架构基线。
- 本轮只优化 Live Chat 新接入可见性、客户列表 flash、Conversation header SLA timer 颜色和 unread 已读状态。
- 未改 v0.6.0 的 PSTN / BankApp Voice / BankApp Video 多 call tab 架构。

## 本轮关键修改

- `AgentWorkspace`：Live Chat tab 新接入短闪不再要求当前 tab 不是 Live Chat；只要有新 session flash window 即显示。
- `appStore`：新增 `readLiveChatSessionIds` 和 `markLiveChatSessionRead()`，用于保存前端 demo 已读状态，避免 LiveChatPage 卸载后 unread badge 恢复。
- `LiveChatPage`：会话聚焦、点击客户、筛选切换、End Service 后自动选中下一个客户时都会清 unread badge；focus effect 只响应新的 focus request，避免已读更新后把用户选中的客户切回最近接入客户。
- `ConversationWorkspace`：接收 `slaState`，客户姓名旁边 timer 按 normal / warning / breach 变色。
- `index.less`：增强 workspace tab flash 与 Live Chat customer item flash；SLA marker 白色边框降为 `1px`。

## 验证状态

- `npm run lint` 通过。
- `npm run build` 通过；保留既有 bundle size warning。
- Browser smoke check `/`：WhatsApp Live Chat 和当前 Live Chat 下 BankApp 新接入均触发 tab/list 短闪；active unread badge 清零。
- Browser smoke check `/`：点击已有客户后 unread badge 不恢复；SLA marker CSS border 为 `1px`。
- Browser smoke check `/design-system`：正常加载。

## 风险

- unread 已读状态是前端 demo 状态，不接真实消息已读回执，刷新页面不持久化。
- Live Chat SLA 阈值仍固定为 60 秒 warning、120 秒 breach。
- 旧 ended call tab 的登记内容仍只保存在前端组件内存，刷新会丢失。
