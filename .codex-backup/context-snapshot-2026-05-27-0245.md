# Context Snapshot - 2026-05-27 02:45 +08:00

项目：BANK 1 AICC Demo V2  
路径：`D:\03projects\bca-aicc-demo-v2`  
当前分支：`codex/livechat2-popup`

## 当前状态

- 已先在本地提交弹框修复分支：`9408bc9 fix: refine toolbar modal styles`。
- 已从该本地 commit 创建 `codex/livechat2-popup`，本轮未 push 到 GitHub。
- 新增并行 `livechat2` 弹屏方案，不替换旧 `Live Chat`。

## 本轮关键修改

- `BasicLayout` 新增 `Channel Simulation > livechat2`，位于 `WhatsApp` 下方。
- `AgentWorkspace` 新增独立 `livechat2` workspace tab。
- `appStore` 新增 `liveChat2*` 独立状态与动作，覆盖批量接入、聚焦、已读、排序、星标、草稿、未回复计时、结束/关闭、历史列表、消息发送和撤回。
- `types/inbound.ts` 新增 `LiveChat2Session`、`LiveChat2Message`、排序、星标、状态等类型。
- `mock/inbound.ts` 新增 `liveChat2Sessions`，包含 4 个当前服务客户和 1 个历史客户。
- 新增 `LiveChat2Page`、`LiveChat2CustomerPanel`、`LiveChat2ConversationWorkspace`。
- `InteractionWorkspace` / `CrmPanel` 新增自定义 Conversation 插槽，旧 Live Chat 仍走原组件。
- `styles/index.less` 新增 `livechat2-*` 作用域样式。

## 验证状态

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 chunk size warning。
- Browser `/`：旧 `Live Chat` tab 正常。
- Browser `/`：`Channel Simulation > livechat2` 可打开新版 tab 并显示多个客户。
- Browser `/`：`livechat2` 已验证客户切换、快捷回复发送、未回复计时清零、消息记录打开、Transfer 弹框打开。
- Browser `/`：`Channel Simulation > WhatsApp` 仍可打开 WhatsApp Demo。
- Browser `/design-system`：正常加载。

## 风险

- `livechat2` 是演示模拟，不接真实聊天网关、文件库、拼写检查、截图插件、敏感词服务或后台配置。
- 当前分支依赖本地弹框修复 commit，未 push；如果后续要给客户看，需要先明确发布分支策略。
- 仍需在客户目标分辨率下人工复查四列布局、消息记录侧栏和快捷回复浮层。
