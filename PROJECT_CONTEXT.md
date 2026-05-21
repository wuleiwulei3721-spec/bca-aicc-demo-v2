# BANK 1 AICC Demo V2 - 长期开发上下文

最后更新：2026-05-21 23:40 +08:00
项目路径：`D:\03projects\bca-aicc-demo-v2`  
当前目标：`codex/interaction-popup-base` 作为非生产集成分支，暂存 PSTN / Voice Call、Video Call 与 Live Chat 三类弹屏入口；后续视频与文字弹屏详细页面优化从该分支继续拆分，`main` 未合并、未推送，客户正式环境不更新。

## 0. 使用规则

每次继续开发前，优先按以下顺序恢复上下文：

1. 阅读项目级规则 `AGENTS.md`。
2. 阅读本文件 `PROJECT_CONTEXT.md`。
3. 阅读 `DEV_LOG.md` 中最近的变更记录。
4. 阅读 `.codex-backup/` 下最新的 `context-snapshot-*`、`current-todo-*`、`page-state-*`。
5. 执行 `git status --short --branch` 确认当前工作区状态。
6. 如需继续页面开发，先读取相关源码文件，再修改。

以后每次完成以下任一事项，必须同步更新本文件和 `DEV_LOG.md`：

- 完成页面或重要模块。
- 完成用户需求。
- 修改页面、组件、接口、类型、mock 数据结构、prompt 或业务话术。
- 修改架构、路由、全局状态、接口类型或 mock 数据结构。
- 修改重要 prompt、演示口径、业务规则或页面关系。
- 新增重大风险、已知问题或 TODO。

每次重大修改后，还需要在 `.codex-backup/` 中生成阶段性备份：

- `context-snapshot-YYYY-MM-DD-HHMM.md`
- `current-todo-YYYY-MM-DD-HHMM.md`
- `page-state-YYYY-MM-DD-HHMM.md`
- 如涉及 prompt 或恢复信息，同步更新 `key-prompts.md` 或新增恢复摘要。

禁止把重要开发上下文只留在聊天记录里。

项目级 AI 开发规则以 `AGENTS.md` 为准。若未来上下文丢失、切换账号或 Codex UI 异常，必须优先恢复项目文件和 rollout session，再继续开发。

## 1. 项目概览

项目名称：`bca-aicc-demo-v2`  
项目类型：银行 AICC 前端演示系统  
当前仓库：`https://github.com/wuleiwulei3721-spec/bca-aicc-demo-v2.git`  
当前分支：`codex/interaction-popup-base`
当前 HEAD：以 `git rev-parse HEAD` 为准；该分支用于非生产集成备份，未发布到 `main`
部署目标：Vercel 静态部署，产物目录 `dist`  
浏览器标题与 metadata：`BANK 1 AICC Demo`

当前项目不是从零开始的模板工程，而是已经迭代过多轮的企业级 AICC demo。主要演示对象是银行客服坐席工作台，核心页面是 Inbound 电话来电弹屏工作台。

## 2. 技术栈

- React `19.2.6`
- React DOM `19.2.6`
- TypeScript `~6.0.2`
- Vite `8.0.12`
- Ant Design `6.4.2`
- `@ant-design/icons` `6.2.3`
- React Router DOM `7.15.1`
- Zustand `5.0.13`
- Less `4.6.4`
- ESLint `10.3.0`

常用命令：

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## 3. 当前目录结构

关键目录：

```text
src/
  App.tsx
  main.tsx
  routes.tsx
  assets/
  components/
  layouts/
  mock/
  pages/
  store/
  styles/
  types/
public/
  favicon.svg
  icons.svg
.codex-backup/
AGENTS.md
PROJECT_CONTEXT.md
DEV_LOG.md
DEPLOY.md
codex-recovered-context.md
```

关键文件职责：

- `src/main.tsx`：React 入口，引入 Ant Design reset 和全局 Less。
- `src/App.tsx`：Ant Design `ConfigProvider` + `RouterProvider`。
- `src/routes.tsx`：定义 `/`、`/design-system` 和通配重定向。
- `src/layouts/BasicLayout.tsx`：全局 Header、可展开/收起左侧菜单、坐席工具条、内部聊天入口和主内容出口。
- `src/pages/AgentWorkspace.tsx`：Home tab 与 Inbound tab 容器。
- `src/pages/inbound/InteractionWorkspace.tsx`：电话与视频弹屏共用的三栏工作台。
- `src/pages/inbound/InboundPage.tsx`：PSTN / Voice Call 电话弹屏 wrapper。
- `src/pages/inbound/VideoCallPage.tsx`：Video Call 弹屏 wrapper，复用三栏工作台并叠加 OpenEye 浮窗。
- `src/pages/inbound/LiveChatPage.tsx`：Live Chat 固定页签页面，复用三栏工作台并增加文字聊天客户列表。
- `src/pages/inbound/components/LiveChatCustomerList.tsx`：WhatsApp / Haloapps / Webchat 客户聊天列表，可收起展开。
- `src/pages/DesignSystem.tsx`：设计系统展示页。
- `src/store/appStore.ts`：workspace tab 与 inbound popup 全局状态。
- `src/mock/inbound.ts`：Inbound 演示数据。
- `src/types/inbound.ts`：Inbound 业务类型。
- `src/styles/index.less`：全局样式与页面样式主文件。

## 4. 路由与页面关系

当前路由：

- `/` -> `BasicLayout` -> `AgentWorkspace`
- `/design-system` -> `BasicLayout` -> `DesignSystem`
- `*` -> 重定向到 `/`

页面关系：

- `BasicLayout` 是所有页面的壳，包含顶部 Header、坐席状态、话务工具条、侧栏和内容区。
- `AgentWorkspace` 默认显示 Home tab。
- 坐席点击右上角 `Sign In` 后，`Live Chat` tab 会固定插入 Home tab 旁边，`closable: false`，用于承载实时文字聊天工作台。
- 当坐席处于 Ready 且无通话时，点击左侧 `Channel Simulation > PSTN / Voice Call` 进入 Incoming 并打开电话弹屏 tab；点击 `Channel Simulation > Video Call` 进入 Incoming 并打开 Video Call tab。
- 点击左侧 `Channel Simulation > Live Chat` 时，如坐席已签入，则切换到固定 `Live Chat` tab，不改变语音/视频通话状态。
- `requestInboundPopup()` 会打开 Inbound tab，并切换 active workspace tab 到 `inbound`。
- `requestVideoCallPopup()` 会打开 Video Call tab，并切换 active workspace tab 到 `video-call`。
- `requestLiveChatWorkspace()` 会打开并切换到固定 Live Chat tab，`setLiveChatTabOpen(false)` 会在签出时移除该 tab。
- Inbound tab 可关闭，关闭后回到 Home tab。
- Live Chat tab 不可关闭，签出后自动从 workspace tabs 移除。
- Video Call tab 可关闭，关闭后隐藏 OpenEye 独立客户端截图浮窗。
- `/design-system` 独立展示设计规范与基础组件，不参与通话流程。

## 5. 全局布局与状态机

`BasicLayout` 当前包含：

- 顶部蓝色渐变 BANK 1 Header，恢复旧版主工作台视觉。
- 可展开/收起左侧系统菜单，默认收起，`collapsedWidth` 为 `48px`，展开宽度使用 `--aicc-layout-sider-width`。
- 左侧菜单支持 2 层级：展开态顶部显示折叠按钮与菜单搜索框，点击一级菜单在下方展开二级菜单；收起态仅显示一级图标，鼠标悬浮在一级图标时在右侧显示二级菜单浮层，鼠标移出浮层或点击菜单后浮层关闭。
- 当前侧栏菜单使用英文企业呼叫中心文案：Channel Simulation（PSTN / Voice Call、Video Call、Live Chat）、Agent Center（Agent Profile、Service History）、Operations（Alert KPI Management、Floor Management）、Call Management、Reports。
- Agent Toolbar：Answer、Hold、Mute、Transfer、Hang Up、More。
- Agent Profile Area：Ready、Not Ready、AUX - Ibadah、AUX - Makan、Unsigned 等状态。
- Notifications 和 Internal Chat 入口。
- Internal Chat Modal。

坐席状态类型：

```ts
type AgentStatus =
  | 'Unsigned'
  | 'Ready'
  | 'Not Ready'
  | 'AUX - Ibadah'
  | 'AUX - Makan'
```

话务状态类型：

```ts
type CallStatus =
  | 'Idle'
  | 'Incoming'
  | 'Talking'
  | 'Hold'
  | 'Mute'
```

关键逻辑：

- Sign In 后 `BasicLayout` 调用 `setLiveChatTabOpen(true)`，使 Home 旁出现固定 `Live Chat` tab；Sign Out 后调用 `setLiveChatTabOpen(false)` 并在当前 tab 是 Live Chat 时退回 Home。
- Ready + Idle 时点击 `Channel Simulation > PSTN / Voice Call` 可触发电话弹屏。
- Ready + Idle 时点击 `Channel Simulation > Video Call` 可触发 Video Call。
- 已签入时点击 `Channel Simulation > Live Chat` 只激活 Live Chat 工作台，不触发 `Incoming` 话务状态。
- Incoming 支持手动 Answer，也支持按 `autoAnswerSeconds` 自动接听。
- Talking 可切换 Hold 或 Mute。
- Hold 和 Mute 有独立累计计时。
- Hang Up 后进入 After Call Work 逻辑：先 Not Ready，约 5 秒后回 Ready。
- Unsigned 或 AUX 状态会重置 call 状态与计时。

## 6. Inbound 工作台

入口文件：`src/pages/inbound/InboundPage.tsx`

共用容器：`src/pages/inbound/InteractionWorkspace.tsx`

Inbound 是当前最核心演示页面，采用三栏结构：

- Left：客户资料与业务卡片。
- Center：CRM workspace。
- Right：Assistant 与连接状态。

`InteractionWorkspace` 当前被 PSTN / Voice Call、Video Call 和 Live Chat 复用。Live Chat 通过 `leadPanel` 在三栏左侧注入客户聊天列表，避免复制一套 Inbound 三栏代码。

### Left Column

文件：`src/pages/inbound/components/LeftColumn.tsx`

包含：

- Customer Information。
- Customer Journey。
- Ticketing History。
- Next Best Action。
- Quick Action。

已实现交互：

- Customer Journey 支持打开详情 modal。
- Ticketing History 支持打开 CRM 动态业务 tab。
- Next Best Action 支持打开 CRM 动态业务 tab。
- Quick Action 支持打开 CRM 动态业务 tab。
- Customer Verification Modal 包含 10 个验证问题。
- Send Email Modal 已存在。
- Call Flow Detail Modal 已存在。

### Center CRM Panel

文件：`src/pages/inbound/components/CrmPanel.tsx`

当前状态：

- 固定 CRM tab，key 为 `crm`。
- 动态业务 tabs 来自 `CrmWorkspaceTab[]`。
- 动态 tab 可关闭。
- CRM tab 优先加载客户提供的截图资源：`public/screenshots/crm-workspace.jpg`。
- 截图采用 `object-fit: contain`，完整等比显示在 CRM 面板内，不拉伸面板、不裁切图片、不变形。
- 截图加载失败时显示代码内 BANK 1 CRM fallback。
- fallback 模拟 BANK 1 CRM：Profil Nasabah、Rekening & Kartu、Ticketing、Penawaran、Aktivitas。

动态 tab 类型：

```ts
type CrmWorkspaceTabKind =
  | 'ticket'
  | 'next-best-action'
  | 'quick-action'

interface CrmWorkspaceTab {
  key: string
  title: string
  kind: CrmWorkspaceTabKind
  crmLink: string
  reference?: string
  description?: string
}
```

### Right Assistant Panel

文件：`src/pages/inbound/components/AssistantPanel.tsx`

包含：

- Assistant tab。
- Connection tab。

当前状态：

- Assistant tab 优先加载客户提供的截图资源：`public/screenshots/assistant-workspace.jpg`。
- 截图采用 `object-fit: contain`，完整等比显示在 Assistant 面板内，不拉伸面板、不裁切图片、不变形。
- 截图加载失败时显示代码内 BANK 1 Assistant fallback。
- Assistant fallback 使用印尼语业务内容，展示意图识别、时间线和 Suggested Response。
- Connection tab 展示 CRM Core、Knowledge Base、Voice Analytics、Case Workflow 状态。

## 6.1 Live Chat 工作台

入口文件：`src/pages/inbound/LiveChatPage.tsx`

当前状态：

- 坐席 Sign In 后，Home tab 旁新增固定 `Live Chat` tab，不能关闭。
- `LiveChatPage` 复用 `InteractionWorkspace`，在原三栏左侧增加 `LiveChatCustomerList`。
- 客户列表展示 WhatsApp、Haloapps、Webchat 三个文字聊天渠道，支持 unread count、优先级、最后消息和最后消息时间。
- 客户列表支持收起/展开；收起后保留头像与未读数，右侧仍保持 Customer Information、CRM、Assistant 三栏。
- 切换客户后，Customer Information 的客户姓名、渠道、时长、验证状态会随选中聊天会话更新。
- 文字聊天渠道不显示 IVR Journey；`Call Flow Detail` 仅保留可用的非 IVR 内容。

## 7. 设计系统

页面：`src/pages/DesignSystem.tsx`  
路由：`/design-system`

已沉淀内容：

- Color System。
- Typography。
- Spacing System。
- Button System。
- Status System。
- Card System。
- Modal System。
- Table System。
- Tabs System。
- Timeline / Journey System。
- Chat System。
- Toolbar System。
- Reusable Component Contracts。

核心公共组件：

- `BaseButton`
- `BaseCard`
- `BaseModal`
- `BaseTable`
- `BaseTabs`
- `PageContainer`
- `SearchInput`
- `StatusBadge`
- `ToolbarButton`
- `TimelineFlow`
- `CustomerInformationPanel`

兼容组件：

- `AppButton`
- `AppCard`
- `AppTable`

后续新增页面应优先复用这些组件和 `src/styles/tokens.less` / `src/styles/theme.ts` 中的主题能力。

## 8. Mock 数据与业务内容

主要 mock 文件：

- `src/mock/agent.ts`
- `src/mock/chat.ts`
- `src/mock/inbound.ts`
- `src/mock/transfer.ts`

Inbound 当前主要数据：

- 客户：`Dimas Abimanyu Prabowo`
- 手机号：`087825100234`
- 邮箱：`Dimas@gmail.com`
- CIS：`00000078987`
- 客户类型：`Priority Customer`
- 当前验证状态：`Unverified`

Live Chat 当前 mock：

- `liveChatSessions` 位于 `src/mock/inbound.ts`。
- 当前包含 WhatsApp、Haloapps、Webchat 三个文字聊天会话。
- 每个会话包含 `LiveChatSession` 类型字段：channel、customer、intent、lastMessage、lastMessageTime、priority、unreadCount。

当前语言状态：

- UI 框架和多数控件仍为英文。
- 部分业务数据已改为印尼语。
- Customer Verification 10 个问题为印尼语。
- Ticketing History、Next Best Action、Quick Action 部分内容为印尼语。

需要注意：历史早期要求页面内容使用英文展示，后续又要求部分业务内容印尼语本地化。当前状态是英文 UI 框架 + 印尼语业务数据混合，后续演示前需要确认最终语言口径。

## 9. 已完成模块

- React + TypeScript + Vite 工程骨架。
- Ant Design 主题接入。
- React Router 路由。
- Zustand 全局 store。
- 企业级 BANK 1 AICC Header。
- 收起侧栏。
- 左侧系统菜单已改为可展开/收起的 2 层级英文菜单，默认收起并保持图标居中；展开态支持菜单搜索。
- Home / PSTN / Voice Call / Video Call 工作台 tabs。
- PSTN / Voice Call 菜单点击触发电话来电逻辑。
- Video Call 菜单点击触发视频来电 tab，复用电话弹屏三栏内容。
- Sign In 后自动显示固定不可关闭 Live Chat tab。
- Live Chat 页面复用 `InteractionWorkspace`，新增可收起客户文字聊天列表，支持 WhatsApp、Haloapps、Webchat 会话切换。
- OpenEye 独立客户端截图浮窗模拟，使用 `public/screenshots/openeye-video-call.png`，仅视频通话接通后显示，挂断或关闭 Video Call tab 后隐藏。
- 坐席状态机。
- 话务状态机。
- 自动应答配置。
- Hold / Mute 独立计时。
- Transfer Modal。
- Outbound Call Modal。
- Internal Chat Modal。
- Toolbar Settings Modal。
- Customer Information。
- Customer Verification Modal。
- Call Flow Detail Modal。
- Customer Journey Detail。
- Send Email Modal。
- Ticketing / NBA / Quick Action 打开 CRM workspace tab。
- CRM 客户截图优先加载与 fallback。
- Assistant 客户截图优先加载与 fallback。
- Connection 状态面板。
- `/design-system` 统一设计系统页面。
- 主 Workspace 旧版视觉已恢复：
  - 顶部蓝色渐变 Header。
  - 旧版浅色应用背景与白色 Workspace/card hierarchy。
  - Customer Information、Ticketing History、Next Best Action、Customer Journey 等卡片恢复旧版层级和背景。
  - Agent Toolbar 恢复蓝色 Header 上的半透明话务条与深蓝 active 状态。
- BANK 1 品牌口径已同步到 Header、Browser Title、Design System、CRM、Assistant 和 mock 显示文案。
- Vercel 配置 `vercel.json`。
- GitHub remote 与基础提交。

## 10. 当前开发状态

截至 2026-05-21 23:40 +08:00，当前工作已切到 `codex/interaction-popup-base` 非生产集成分支。该分支承接 `codex/videocall-popup` 的视频弹屏与 Live Chat 框架成果，用于后续继续拆分视频来电详情和文字弹屏详情优化；`main` 未合并、未推送，客户正式环境不更新。

当前 `git status --short --branch` 主要状态：

```text
## codex/interaction-popup-base
M .codex-backup/key-prompts.md
M DEV_LOG.md
M PROJECT_CONTEXT.md
M src/layouts/BasicLayout.tsx
M src/mock/inbound.ts
M src/pages/AgentWorkspace.tsx
M src/pages/inbound/InboundPage.tsx
M src/pages/inbound/components/CallFlowDetailModal.tsx
M src/pages/inbound/components/ChannelTag.tsx
M src/pages/inbound/components/CustomerInformationCard.tsx
M src/pages/inbound/index.ts
M src/store/appStore.ts
M src/styles/index.less
M src/types/inbound.ts
?? .codex-backup/context-snapshot-2026-05-21-1801.md
?? .codex-backup/context-snapshot-2026-05-21-1903.md
?? .codex-backup/context-snapshot-2026-05-21-1933.md
?? .codex-backup/context-snapshot-2026-05-21-2212.md
?? .codex-backup/context-snapshot-2026-05-21-2301.md
?? .codex-backup/current-todo-2026-05-21-1801.md
?? .codex-backup/current-todo-2026-05-21-1903.md
?? .codex-backup/current-todo-2026-05-21-1933.md
?? .codex-backup/current-todo-2026-05-21-2212.md
?? .codex-backup/current-todo-2026-05-21-2301.md
?? .codex-backup/page-state-2026-05-21-1801.md
?? .codex-backup/page-state-2026-05-21-1903.md
?? .codex-backup/page-state-2026-05-21-1933.md
?? .codex-backup/page-state-2026-05-21-2212.md
?? .codex-backup/page-state-2026-05-21-2301.md
?? public/screenshots/openeye-video-call.png
?? src/pages/inbound/InteractionWorkspace.tsx
?? src/pages/inbound/LiveChatPage.tsx
?? src/pages/inbound/VideoCallPage.tsx
?? src/pages/inbound/components/LiveChatCustomerList.tsx
?? src/pages/inbound/components/OpenEyeVideoWindow.tsx
```

当前 tracked diff 统计包含本分支历史未提交改动与本轮 Live Chat 调整：

```text
14 files changed, 960 insertions(+), 154 deletions(-)
```

本轮业务改动：

- `appStore` 新增 `isLiveChatTabOpen`、`setLiveChatTabOpen()`、`requestLiveChatWorkspace()`，签出时如当前停留在 Live Chat 会退回 Home。
- `BasicLayout` 在坐席 Sign In 后打开 Live Chat 固定 tab，Sign Out 后移除；左侧 `Channel Simulation > Live Chat` 在已签入时切换到该 tab。
- `AgentWorkspace` 新增固定不可关闭 `Live Chat` tab，显示顺序为 Home、Live Chat、PSTN / Voice Call、Video Call。
- 新增 `LiveChatPage` 和 `LiveChatCustomerList`，客户列表可收起展开，选中客户会驱动共用三栏里的 Customer Information。
- `InteractionWorkspace` 新增 `leadPanel` 能力，用于在三栏前插入 Live Chat 客户列表，电话和视频页面保持原复用路径。
- `AccessChannel` 和 mock 新增 WhatsApp、Haloapps、Webchat 文字聊天渠道与 `LiveChatSession` 数据结构。
- `ChannelTag` 支持 WhatsApp、Haloapps、Webchat 渠道图标和样式。
- 非语音文字聊天渠道打开 `Call Flow Detail` 时不显示 IVR Journey。
- 移除 `BasicLayout` 中 Ready + Idle 后 2 秒自动来电的 effect。
- 新增 `triggerVoiceInboundCall()`，仅当坐席 `Ready` 且 `callStatus === 'Idle'` 时触发。
- 点击左侧 `Channel Simulation > PSTN / Voice Call` 后进入 `Incoming`，打开电话弹屏 tab，并使话务条 Answer 按钮亮起。
- 新增 `triggerVideoInboundCall()`，点击左侧 `Channel Simulation > Video Call` 后进入 `Incoming`，打开 Video Call tab，并使话务条 Answer 按钮亮起。
- 抽出 `InteractionWorkspace`，电话与视频弹屏共用 LeftColumn、CRM、Assistant 和动态 CRM tabs。
- Video Call 的 Customer Information 渠道显示为 `Haloapps`，使用视频图标。
- OpenEye 截图从 `D:\03projects\BCA AICC\需求文档\openeye视频通话.png` 复制到 `public/screenshots/openeye-video-call.png`，并以固定高层级、可拖动浮窗形式显示，不额外添加可见文案；现在仅视频通话已接通时显示，挂断后隐藏。
- Haloapps 视频渠道的 `Call Flow Detail` 弹框不显示 `IVR Journey`，只保留可用的转接历史等非 IVR 内容。
- Home tab 已去掉固定最小宽度，标签宽度随内容适配并居中显示。
- 保留 Answer、Talking、Hold、Mute、Hang Up、After Call Work 与自动接听倒计时逻辑。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/`：签入后出现不可关闭 `Live Chat` tab；打开后可见 WhatsApp / Haloapps / Webchat 客户列表，切换 Sari Amelia 后 Customer Information 同步更新，客户列表收起后仍保留三栏内容。
- Browser smoke check `/`：菜单顺序已确认为 `PSTN / Voice Call`、`Video Call`、`Live Chat`；点击 `PSTN / Voice Call` 后 workspace tab 文案同步显示为 `PSTN / Voice Call`。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`。

本次项目级 AI 规则创建新增或更新：

- `AGENTS.md`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1042.md`
- `.codex-backup/current-todo-2026-05-21-1042.md`
- `.codex-backup/page-state-2026-05-21-1042.md`
- `.codex-backup/key-prompts.md`

## 11. 已知问题与风险

- CRM/Assistant 当前使用客户提供的截图资源，组件保留代码 fallback；如截图资源丢失，页面会自动显示 fallback。
- 左侧菜单当前已有 `PSTN / Voice Call` 电话来电模拟入口；其他菜单仍主要负责展示和选中态，后续若新增页面，需要再明确路由、权限和菜单选中规则。
- `PSTN / Voice Call` 触发来电后仍保留既有 `autoAnswerSeconds` 自动接听倒计时；如演示需要必须手动 Answer，需另行停用自动接听。
- `Video Call` 当前为演示型弹屏和截图浮窗，不接真实 OpenEye 协议、不实现真实音视频能力。
- `Live Chat` 当前为演示型固定工作台与静态 mock 会话，不接真实 WhatsApp / Haloapps / Webchat 消息网关，也不实现真实消息发送。
- Live Chat 扩展为四列布局，虽然客户列表可收起，但仍需在目标演示分辨率下复查展开态是否会压缩三栏内容。
- 关闭 Video Call tab 只隐藏 workspace 与 OpenEye 浮窗，不自动 Hang Up；Hang Up 会同步隐藏 OpenEye 浮窗。
- 菜单搜索当前只在展开态显示，收起菜单时会清空搜索条件，避免影响收起态图标列表。
- 收起态二级菜单浮层当前通过 CSS hover 打开，并通过 `closedFlyoutKey` 控制点击后关闭；如后续增加键盘导航，需要再补充键盘触发规则。
- 本轮已重新运行 `npm run lint` 和 `npm run build`，均通过；build 仍有 Vite chunk size warning。
- 当前项目没有自动化测试体系。
- 历史 build 出现过 Vite chunk size warning，但不影响运行。
- `codex-recovered-context.md` 是 UTF-8 中文文件，PowerShell 非 UTF-8 读取时可能显示乱码；应使用 `Get-Content -Raw -Encoding UTF8 codex-recovered-context.md`。
- `DEPLOY.md` 同样应按 UTF-8 读取。
- 不要继续投入时间修复 Codex sidebar/cache/sqlite/session_index，当前策略是把上下文落入项目文件。
- 本轮已使用 Browser smoke check 验证 `/` 的菜单文案、菜单顺序和 `PSTN / Voice Call` tab 文案。

## 12. TODO

P0：

- 在目标演示分辨率下复查 Live Chat 展开态与收起态，确认客户列表不会让 Customer Information、CRM、Assistant 三栏不可用。
- 在目标演示分辨率下复查左侧菜单展开态是否不会压缩 Inbound 三栏到不可用宽度。
- 确认 Video Call 演示是否接受“关闭 tab 不自动 Hang Up”的行为；如需关闭页签即挂断，后续应统一调整 tab 与话务状态机关系。
- 重新打开浏览器后检查 `/` 主 Workspace 是否恢复蓝色渐变 Header、旧版背景、Customer Information 卡片和话务条风格。
- 重新打开浏览器后检查 CRM/Assistant 区域是否完整等比显示客户截图，而不是 fallback、裁切或变形。
- 确认 Inbound 三栏布局在目标演示分辨率下不溢出。
- 确认 Ticketing / Next Best Action / Quick Action 能正确打开和关闭 CRM 动态 tab。
- 确认 Contact Management 弹窗相关入口和数据状态。

P1：

- 确认最终语言策略：全英文、全印尼语，或英文 UI + 印尼语业务数据。
- 如后续重新处理 Modal/Dialog，必须先明确新的设计方向，避免再次影响主 Workspace 视觉体系。
- 如演示必须使用真实系统图，补充已脱敏 BANK 1 CRM/Assistant 截图，再恢复图片加载策略。
- 当前 dirty changes 验收后再 commit/push，并确认 `AGENTS.md`、上下文文档和备份文件是否一并纳入提交。

P2：

- 后续新增 Online Chat、Video Call、Dashboard、Admin、Supervisor 页面时复用已恢复的主 Workspace 视觉体系。
- 考虑补充 Playwright smoke test。
- 如 Vite chunk warning 影响部署评分，再考虑 code splitting。

## 13. 关键 prompt 摘要

这些 prompt 是项目方向的关键依据：

- 创建企业级前端 Demo 工程，项目名 `bca-aicc-demo-v2`。
- 当前阶段禁止生成业务页面，只允许生成基础工程与通用布局。
- 创建 Inbound 电话来电弹屏页面，页面所有内容使用英文展示。
- 优化 Inbound 页面 UI，提升信息密度，像企业级银行 AICC 工作台。
- 重新实现 Header 中的话务条与坐席状态逻辑，按真实 AICC 坐席状态机与话务状态机实现。
- 增加 Agent Toolbar 与 Inbound 页面联动。
- 新增 Transfer / Outbound Call / Internal Chat / Toolbar Settings / Call Flow Detail 功能。
- 正式建立统一 UI Design System 与公共组件体系。
- Demo Enhancement & Localization：Customer Verification、Ticketing History、Next Best Action 改为印尼语。
- CRM 与 Assistant 区域替换为真实系统截图，保持当前页面比例，不撑高布局。
- 曾要求重新建立 Enterprise Workspace Surface Hierarchy，但 2026-05-21 12:03 已按用户纠偏恢复主 Workspace 旧版视觉；保留 BANK 1 品牌替换，Modal/Dialog 本轮暂停。
- 保密要求：系统可见品牌统一替换为 BANK 1，禁止出现旧品牌字样或 Logo。
- 停止继续修复 Codex UI/sidebar/cache，改为从 rollout session 文件恢复开发上下文。
- 从现在开始建立长期开发上下文管理机制，避免 sidebar 丢失、session 消失、切换账号或 Codex UI bug 导致上下文丢失。
- 创建 `AGENTS.md`，将项目级 AI 开发规则固化到仓库根目录，使未来 Codex 会话自动继承规则。

## 14. 回滚说明

本次上下文机制只新增或更新文档与备份目录，不修改业务源码。

如果只想回滚 2026-05-21 的项目级 AI 规则创建：

- 删除 `AGENTS.md`
- 恢复 `PROJECT_CONTEXT.md` 和 `DEV_LOG.md` 中 2026-05-21 的文档更新
- 删除 `.codex-backup/context-snapshot-2026-05-21-1042.md`
- 删除 `.codex-backup/current-todo-2026-05-21-1042.md`
- 删除 `.codex-backup/page-state-2026-05-21-1042.md`
- 恢复 `.codex-backup/key-prompts.md` 中 2026-05-21 的新增记录

如果要回滚之前的业务改动，必须先确认这些改动是否为用户需要保留的当前开发状态，不要直接执行破坏性 Git 命令。


