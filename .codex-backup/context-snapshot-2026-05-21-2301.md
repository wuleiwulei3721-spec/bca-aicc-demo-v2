# Context Snapshot - 2026-05-21 23:01 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统，核心是企业级坐席工作台。当前分支为 `codex/videocall-popup`，本轮在既有 PSTN / Voice Call 与 Video Call 弹屏复用结构上新增 Live Chat 实时文字聊天工作台。

## 本次修改

- Sign In 后 Home 旁新增固定不可关闭 `Live Chat` tab。
- `Channel Simulation > Live Chat` 在坐席已签入时切换到固定 Live Chat tab，不触发语音/视频话务状态。
- `InteractionWorkspace` 新增 `leadPanel` 扩展点，Live Chat 通过该扩展点复用原三栏工作台。
- 新增 `LiveChatPage` 和 `LiveChatCustomerList`，在原 Customer Information / CRM / Assistant 三栏左侧增加可收起客户列表。
- 新增 `LiveChatSession` 类型与 `liveChatSessions` mock，包含 WhatsApp、Haloapps、Webchat 三个文字聊天渠道。
- `ChannelTag` 新增 WhatsApp、Haloapps、Webchat 渠道显示；文字聊天渠道不显示 IVR Journey。
- 同步更新 `PROJECT_CONTEXT.md`、`DEV_LOG.md` 和 `.codex-backup/key-prompts.md`。

## 关键文件

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/LiveChatPage.tsx`
- `src/pages/inbound/components/LiveChatCustomerList.tsx`
- `src/mock/inbound.ts`
- `src/types/inbound.ts`
- `src/styles/index.less`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite chunk size warning。
- Browser check `/`：Sign In 后出现不可关闭 Live Chat tab；客户列表可见 WhatsApp、Haloapps、Webchat；切换 Sari Amelia 后 Customer Information 同步更新；客户列表可收起。
- Browser check `/design-system`：页面正常加载。

## 风险

- Live Chat 当前是静态 demo mock，不接真实渠道网关，也未实现消息发送。
- 展开态为四列布局，仍需在目标演示分辨率下复查横向空间。
- 当前仓库仍有本分支既有未提交改动和备份文件，提交前需要统一确认纳入范围。
