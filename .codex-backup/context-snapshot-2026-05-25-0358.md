# Context Snapshot - 2026-05-25 03:58 +08:00

项目：BANK 1 AICC Demo V2  
路径：`D:\03projects\bca-aicc-demo-v2`  
当前分支：`codex/live-chat-flash-sla-visual-polish`  
目标版本：`v0.6.2`

## 当前状态

- `main@v0.6.1` 已作为 Live Chat 新接入可见性与已读状态基线。
- 本轮只优化 Live Chat 现有新 active session 的闪烁范围和 SLA 颜色。
- 未新增真实消息到达事件，不修改 unread 已读状态模型，不改多通话 tab 架构。

## 本轮关键修改

- `AgentWorkspace`：`WorkspaceTabLabel` 增加 `flashScope`，Live Chat 使用 tab 级 flash 标记，PSTN / Voice / Video 仍保留 label 级 flash。
- `index.less`：通过 `:has(.workspace-tab-label--tab-flash)` 将 Live Chat flash 动画应用到整个 `.ant-tabs-tab`。
- `index.less`：客户列表 flash overlay 改为 `inset: 0` / `border-radius: inherit`，贴合整行 item。
- `tokens.less`：新增 Live Chat SLA warning / breach token：`#f59e0b` / `#f04438` 及 RGB token。
- Live Chat tab duration、客户列表 duration、Conversation timer、SLA marker 和左侧 accent 统一使用新 SLA token。

## 验证状态

- `npm run lint` 通过。
- `npm run build` 通过；保留既有 bundle size warning。
- Browser smoke check `/`：Live Chat 无 active session 时无 duration。
- Browser smoke check `/`：WhatsApp/BankApp Live Chat 新接入后，Live Chat tab 整块闪烁，客户列表 flash overlay 为 `inset: 0px`。
- Browser smoke check `/`：warning / breach 颜色在 tab/list/conversation/marker 中统一为 `rgb(245, 158, 11)` / `rgb(240, 68, 56)`。
- Browser smoke check `/design-system`：正常加载。

## 风险

- Live Chat tab 整块闪烁依赖 CSS `:has()`，目标演示浏览器 Chrome/Edge 支持。
- 本轮只做视觉优化；如后续要实现“已有会话收到新消息也闪烁”，需要新增消息事件状态，不应混在本次样式调整里。
