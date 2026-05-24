# BANK 1 AICC Demo V2 - 长期开发上下文

最后更新：2026-05-25 03:58 +08:00
项目路径：`D:\03projects\bca-aicc-demo-v2`  
当前目标：`codex/live-chat-flash-sla-visual-polish` 基于 `main@v0.6.1` 优化 Live Chat 新接入闪烁范围与 SLA 颜色；完成后发布 `v0.6.2`。

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
当前分支：`codex/live-chat-flash-sla-visual-polish`
当前 HEAD：以 `git rev-parse HEAD` 为准；该分支用于 v0.6.2 Live Chat 闪烁范围与 SLA 颜色优化，完成验证后合入 `main` 并打 tag `v0.6.2`
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
  hooks/
  layouts/
  mock/
  pages/
  store/
  styles/
  types/
  utils/
public/
  favicon.svg
  icons.svg
.codex-backup/
.github/workflows/
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
- `src/pages/AgentWorkspace.tsx`：Home tab 与工作区交互 tab 容器，负责 Demo tabs、Live Chat 固定 tab、多个 PSTN / Voice Call / Video Call 通话实例 tab 的页签名称、持续时间、SLA 和短闪提示。
- `src/pages/bankapp/BankAppDemoPage.tsx`：BankApp 客户侧模拟器，采用真实手机比例的客户端舞台和轻量 AICC Process rail，坐席侧结果通过真实 workspace tab 跳转体现。
- `src/pages/inbound/InteractionWorkspace.tsx`：电话与视频弹屏共用的三栏工作台。
- `src/pages/inbound/InboundPage.tsx`：PSTN / Voice Call 电话弹屏 wrapper。
- `src/pages/inbound/VideoCallPage.tsx`：Video Call 弹屏 wrapper，复用三栏工作台并叠加 OpenEye 浮窗。
- `src/pages/inbound/LiveChatPage.tsx`：Live Chat 固定页签页面，复用三栏工作台并增加文字聊天客户列表。
- `src/pages/inbound/components/LiveChatCustomerList.tsx`：WhatsApp / BankApp 客户聊天列表，默认收起，支持 ALL 与渠道图标筛选、会话运行持续时间、SLA 状态、短闪提示，可收起展开；Webchat mock 暂时隐藏。
- `src/pages/inbound/components/ChannelTag.tsx`：统一渠道标签，Customer Information 中可合并展示静态渠道接入耗时，例如 `PSTN · 05:23`、`BankApp · 02:11`。
- `src/pages/DesignSystem.tsx`：设计系统展示页。
- `src/store/appStore.ts`：workspace tab、BankApp demo tab、WhatsApp demo tab、Live Chat 聚焦/已读状态、多 `CallInteraction` 通话实例、interaction timing 和 demo-only screen share 全局状态。
- `src/hooks/useNow.ts`：前端运行时每秒 tick hook，用于 workspace tab 和 Live Chat 列表计时刷新。
- `src/mock/bankapp.ts`：BankApp 联系方式、业务类型、客户身份/语言驱动的技能路由和截图素材路径配置。
- `src/mock/inbound.ts`：Inbound 演示数据。
- `src/types/bankapp.ts`：BankApp demo 联系方式、业务类型和步骤类型。
- `src/types/inbound.ts`：Inbound 业务类型。
- `src/utils/duration.ts`：共享持续时间解析、格式化、elapsed 计算和 Live Chat SLA 阈值工具。
- `src/styles/index.less`：全局样式与页面样式主文件，包含 workspace tab、Live Chat 客户列表、Conversation 和 SLA 视觉状态。
- `src/styles/tokens.less`：全局 CSS token；Live Chat SLA warning / breach 使用独立 token，当前为 `#f59e0b` / `#f04438`。
- `.github/workflows/ci.yml`：GitHub Actions 最小 CI，PR 到 `main` 或 push 到 `main` / `codex/**` 时运行 `npm ci`、`npm run lint`、`npm run build`。

## 4. 路由与页面关系

当前路由：

- `/` -> `BasicLayout` -> `AgentWorkspace`
- `/design-system` -> `BasicLayout` -> `DesignSystem`
- `*` -> 重定向到 `/`

页面关系：

- `BasicLayout` 是所有页面的壳，包含顶部 Header、坐席状态、话务工具条、侧栏和内容区。
- `AgentWorkspace` 默认显示 Home tab。
- 点击左侧 `Channel Simulation > BankApp` 会打开可关闭的 `BankApp Demo` tab，用于演示客户在 BankApp 内选择文字、语音或视频服务后进入 AICC；BankApp Demo tab 在切到坐席工作台时保持挂载，返回后不会重置当前步骤。
- 点击左侧 `Channel Simulation > WhatsApp` 会打开可关闭的 `WhatsApp Demo` tab；当前使用用户提供的脱敏 WhatsApp 原图，并在第三步后切到 Live Chat 坐席工作台查看 WhatsApp 接入会话。
- 坐席点击右上角 `Sign In` 后，`Live Chat` tab 会固定插入 Home tab 旁边，`closable: false`，用于承载实时文字聊天工作台。
- 当坐席处于 Ready 且无通话时，点击左侧 `Channel Simulation > PSTN` 进入 Incoming 并打开电话弹屏 tab。
- `Video Call` 与 `Live Chat` 已从左侧可见菜单移除；底层 workspace、store 和页面能力保留，供 BankApp Video、WhatsApp/BankApp chat 和后续调试复用。
- `createCallInteraction(kind, source?, activate?)` 会创建独立通话实例 tab；tab key 使用稳定递增格式 `call-1`、`call-2`、`call-3`，不会覆盖旧通话弹屏。
- PSTN 创建 `voice/pstn` 实例，tab 显示 `PSTN (mm:ss)`；BankApp Voice 创建 `voice/bankapp-voice` 实例，tab 显示 `Voice Call (mm:ss)`；BankApp Video 创建 `video/bankapp-video` 实例，tab 显示 `Video Call (mm:ss)`。
- `requestBankAppVoiceCall(activate?)` / `requestBankAppVideoCall(activate?)` 会通过 request id 触发 `BasicLayout` 话务状态机，并携带是否激活坐席工作台的语义。
- `bankAppVideoShareState` / `isScreenShareActive` 表示 demo-only 桌面共享状态；BankApp Video 的桌面共享入口已移到坐席侧 OpenEye 浮窗，点击 `桌面共享` 后显示选择共享程序截图，点击 `确定` 后切回 BankApp Demo 展示客户侧共享画面；Hang Up、关闭 Video Call tab、新普通视频呼叫、Reset BankApp Demo 会清理该状态。
- `requestLiveChatWorkspace(sessionId?, activate?)` 会打开固定 Live Chat tab；传入 WhatsApp 或 BankApp 会话 id 时会把该会话加入 `activeLiveChatSessionIds` 并聚焦对应客户，`activate` 默认为 `true`，BankApp 演示可传 `false` 在后台准备文字坐席页；`setLiveChatTabOpen(false)`、Sign Out、AUX 会清空 active live chat sessions 和已读状态。
- Workspace 交互页签现在统一使用同一套 label 结构和样式，图标与文字间距保持普通 tab 的 4px；PSTN 电话呼入为 `PSTN (mm:ss)`，BankApp Voice 为 `Voice Call (mm:ss)`，BankApp Video 为 `Video Call (mm:ss)`，Live Chat 有 active session 时显示最长会话运行时长 `Live Chat (mm:ss)`。
- 新通话交互进入且当前不在该 tab 时，workspace tab 会轻微短闪约 5 秒；Live Chat tab key 仍保持 `live-chat`，只要有新 active session 进入就会短闪，即使当前已停留在 Live Chat tab；Live Chat 的短闪作用在整个 tab item 背景范围，不只包住 label 文本；通话 tab key 改为动态 `call-n`。
- 当前正在通话的 call tab 不可关闭；Hang Up 后该 tab 保留、duration 冻结并变为可关闭。旧 ended tab 用于坐席继续登记，不代表仍有客户互动。
- Live Chat tab 不可关闭，签出后自动从 workspace tabs 移除。
- `/design-system` 独立展示设计规范与基础组件，不参与通话流程。

## 5. 全局布局与状态机

`BasicLayout` 当前包含：

- 顶部蓝色渐变 BANK 1 Header，恢复旧版主工作台视觉。
- 可展开/收起左侧系统菜单，默认收起，`collapsedWidth` 为 `48px`，展开宽度使用 `--aicc-layout-sider-width`。
- 左侧菜单支持 2 层级：展开态顶部显示折叠按钮与菜单搜索框，点击一级菜单在下方展开二级菜单；收起态仅显示一级图标，鼠标悬浮在一级图标时在右侧显示二级菜单浮层，鼠标移出浮层或点击菜单后浮层关闭。
- 当前侧栏菜单使用英文企业呼叫中心文案：Channel Simulation（PSTN、BankApp、WhatsApp）、Agent Center（Agent Profile、Service History）、Operations（Alert KPI Management、Floor Management）、Call Management、Reports。
- Agent Toolbar：Answer、Hold、Mute、Transfer、Hang Up、More；电话/视频呼入时可在动作按钮最左侧展示 incoming identification；More 菜单点击打开，包含 Outbound Call 与 Settings。
- Agent Profile Area：仍显示 Ready、Not Ready、AUX - Ibadah、AUX - Makan、Unsigned 等业务状态菜单；头像右下状态点使用 `effectiveAgentPresence`，由坐席状态和活跃客户互动共同决定。
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
- Sign In 后如果暂无电话、视频或文字客户接入，右上角状态点为绿色；Sign Out 为灰色。
- `BasicLayout` 计算 `effectiveAgentPresence`：`callStatus !== 'Idle'` 或 `activeLiveChatSessionIds.length > 0` 时为 busy 红色，覆盖 Ready/Talking/Hold/Mute/Incoming 等展示；Ready 且无互动为绿色；AUX / Not Ready / ACW 且无互动为黄色。
- Ready + Idle 时点击 `Channel Simulation > PSTN` 可触发电话弹屏。
- 话务条 incoming identification 只在 `Incoming`、`Talking`、`Hold`、`Mute` 时显示：PSTN 显示 `IVR 08123456789`，BankApp Voice / Video 显示 `BankID 00012345`；Hang Up 后随 `callStatus` 回 Idle 自动隐藏。识别标签、号码、timer label 与 timer value 使用统一 metadata 层级：灰色 label、黑色 700 数值、tabular nums、清晰 1px divider。
- 话务条 Settings 当前只配置显示模式，默认 `Icon + Text`；选择控件使用项目自定义 segmented button 风格，与 BankApp Customer type 控件保持一致；弹框只保留一行 `Toolbar display` + 横向选择控件。切换为 `Icon Only` 后 Answer/Hold/Mute/Transfer/Hang Up/Ready 等按钮隐藏文字但保留图标、`aria-label` 和 `title`，图标在该模式下放大到 14px。自动接听仍固定使用默认 3 秒，但不在 Settings 中展示。
- BankApp Demo 的 `Livechat` 路径会打开 Live Chat 并聚焦 BankApp 客户；`Voice Call` / `Video Call` 路径通过 store request id 触发现有坐席话务状态机，并可在 `Agent Workspace` 步骤切到对应坐席 workspace。
- WhatsApp Demo 默认走 Live Chat 路径并聚焦 WhatsApp 客户 `live-chat-001`；已签入后仍可通过固定 Live Chat tab 承载会话工作台。
- Live Chat 客户列表只展示 active sessions，并为每个 active customer 显示 `lastMessageTime · mm:ss`；BankApp / WhatsApp Live Chat 运行计时从入口接入时的 `00:00` 开始，不再用 mock `customer.accessDuration` 回推。SLA 仅用于 Live Chat，60 秒 warning、120 秒 breach，展开列表用左侧细 accent 与 duration 颜色表达，收起列表用渠道 icon 角标表达；warning 色使用更明确的 amber/yellow，避免偏深棕。
- Live Chat 新客户进入列表时会短闪约 5 秒；active 和 inactive 客户列表项使用一致的浅 amber 整行闪烁样式，overlay `inset: 0` 贴合客户列表项边界，避免出现中间小框。
- Live Chat 客户 unread badge 以“会话被打开/选中”为已读点，已读 session id 存在 `appStore.readLiveChatSessionIds` 中，避免切换 BankApp / WhatsApp Demo tab 后已读状态丢失；End Service、Sign Out、AUX 或关闭 Live Chat 会清理对应已读状态。
- `ConversationWorkspace` 的头部计时与客户列表、workspace tab 使用同一份 store runtime timing，避免三处计时不一致；头部计时会按 Live Chat SLA 状态变色：normal 灰色、warning amber、breach red。
- Incoming 支持手动 Answer，也支持按 `autoAnswerSeconds` 自动接听。
- Talking 可切换 Hold 或 Mute。
- Hold 和 Mute 有独立累计计时。
- Hang Up 后当前 `CallInteraction` 被标记为 `ended`，tab duration 停止并冻结；随后进入 After Call Work 逻辑：先 Not Ready，约 5 秒后回 Ready。
- 旧 ended call tab 被选中查看时，右上角状态点和话务条仍按当前坐席状态显示，不回放旧通话状态。
- Sign Out 会关闭所有 call tabs；AUX 会结束当前 active call 并保留 ended tab，同时清理 Live Chat active sessions。End Service、关闭 Live Chat tab、Sign Out、AUX 会清理对应 Live Chat active session timing。
- Unsigned 或 AUX 状态会重置 call 状态与计时，并清空 active live chat sessions。

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
- Sign In 后默认没有 active live chat session，页面展示 `No active conversation` 空态；不会预先显示 mock 客户。
- BankApp Demo Live Chat 路径触发后只加入 BankApp 客户 `live-chat-002`；WhatsApp Demo 触发后只加入 WhatsApp 客户 `live-chat-001`。
- Webchat mock 客户暂时隐藏，不进入 active session 列表，也不显示 Webchat 筛选项；后续新增 Webchat 客户入口时再启用。
- 客户列表默认收起；展开后顶部显示 ALL、WhatsApp、BankApp 图标筛选按钮，hover 显示渠道名；渠道为多选，ALL 代表当前启用渠道全选。
- 客户列表行用渠道图标替代客户头像，并移除行内渠道 tag 与 High 优先级 tag，以降低列表行高度。
- 客户列表行始终显示该 active session 的运行持续时间，即使当前只有一个 active customer，也保持 `lastMessageTime · mm:ss` 的固定规则。
- 客户列表支持收起/展开；收起后保留渠道图标与未读数，右侧仍保持 Customer Information、CRM、Assistant 三栏。
- 切换客户后，Customer Information 的客户姓名、渠道、静态渠道接入耗时、验证状态会随选中聊天会话更新；渠道接入耗时与渠道标签合并展示，不再额外显示独立时钟图标。
- Live Chat 的 CRM 工作区在 `CRM` 右侧新增固定不可关闭 `Conversation` tab，默认进入 Live Chat 时选中 Conversation。
- `Conversation` tab 顶部为浅色工具头，左侧按“渠道图标 -> 客户姓名 -> 无外框聊天计时”排列；渠道图标复用客户列表行 `live-chat-channel-icon--customer` 视觉重量，只显示图形，`title` / `aria-label` 显示渠道名；右侧仅显示轻量 `Transfer` 图标 + 文案，以及与相邻图标对齐的红色叉号结束按钮。
- 点击 `Conversation` 顶部 `Transfer` 会打开复用的 Transfer 弹框 conversation 变体：仅有 `Transfer Agent` / `Transfer Skill`；Agent 行默认显示 `Request Transfer`、`Request Conference` 和更多下箭头；下拉菜单提供 `Force Transfer`、`Force Conference`；Skill tab 保持话务条原 `Transfer` 动作。
- 点击 `End Service` 会打开二次确认框，确认后调用 `closeLiveChatSession(sessionId)` 从 active session 列表移除该客户；若没有其它 active sessions，Live Chat 回到空态且右上角状态点回到绿色。
- `Conversation` tab 不再使用内部深色 header；中部和底部发送区沿用现有浅色 workspace surface，仅通过边线区分层级。
- `Conversation` tab 中部展示客户、历史坐席和当前坐席的文字会话记录；切换左侧客户列表时聊天内容同步切换。消息时间移到气泡外上方；客户消息左侧只显示头像、时间和内容，不展示客户姓名或 `Customer` 字样；历史坐席消息左侧显示中性灰蓝气泡、坐席姓名和时间，不再展示 `Previous Agent`；当前坐席消息右侧只显示时间和浅 BANK 1 蓝气泡，不展示 `You`。
- `Conversation` tab 下方提供发送信息框，底部只保留表情、文件和 Send；发送区内部不再使用额外线框分割。发送后会在当前会话追加当前坐席消息，并更新客户列表最后消息。
- Live Chat WhatsApp 客户使用本地生成的女生头像；BankApp 与 Webchat 客户按未上传头像处理，显示姓名首字母默认头像。
- Customer Information 中 `Regular Customer` 不显示客户级别 badge，`Priority Customer` 仍显示为 `Priority`。
- Customer Information 邮箱行允许长邮箱换行，邮箱图标不再被压缩。
- Customer Information 邮箱 hover/focus 时会高亮并下划线提示可点击。
- Customer Information 的 access duration 语义保留为客户从渠道接入、排队、转坐席成功前的静态耗时；电话、语音、视频和 Live Chat 都在渠道标签中合并显示，例如 `PSTN · 05:23`、`BankApp · 02:11`、`WhatsApp · 00:48`。
- Customer Information 外呼申请状态按当前客户 key 隔离，Live Chat 切换客户时不会把一个客户的外呼申请状态带到其它客户。
- Webchat 的 Customer Information 渠道标识使用与客户列表 Webchat 图标一致的橙色系。
- 文字聊天渠道不显示 IVR Journey；`Call Flow Detail` 仅保留可用的非 IVR 内容。
- 内部 mock 仍使用 `Haloapps` channel key，界面展示统一为 `BankApp`，BankApp 图标与 Contact Management 面板中的 Mobile icon 风格保持一致。

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
- 当前包含 WhatsApp、Haloapps、Webchat 三个文字聊天会话；Haloapps 在用户可见 UI 中展示为 BankApp。
- 每个会话包含 `LiveChatSession` 类型字段：channel、customer、conversation、intent、lastMessage、lastMessageTime、priority、unreadCount。
- `conversation` 使用 `LiveChatConversationMessage[]`，区分 customer、历史 agent、当前 agent，用于 `Conversation` tab 的实时会话演示。
- WhatsApp 会话的客户头像使用 `public/avatars/whatsapp-customer-female.png`。
- BankApp 与 Webchat 会话的 `profile.avatarUrl` 为空，使用 `avatarInitials` 显示默认头像；两者 `customerType` 为 `Regular Customer`，因此不显示客户级别。

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
- Customer Simulator / BankApp Demo 工作台 tab，包含真实手机比例 Customer BankApp 舞台和轻量 AICC Process rail；不再使用独立厚重 Agent Desktop Outcome 面板。
- BankApp Demo 已同步坐席工作台查看策略：Voice、Video、Live Chat 都会在客户侧接通/聊天后进入 `Agent Workspace` 步骤并激活对应坐席 workspace；切回 BankApp Demo 后保持当前步骤，再点击下一步进入 `Service Closed`。
- BankApp / WhatsApp Demo 右侧 AICC Process 控制区已合并为同一行：BankApp 显示可点击 Channel、Customer Type、Next/Reset；WhatsApp 显示只读 `Channel: chat` 和 Next/Reset。
- BankApp / WhatsApp Demo 已从“左手机面板 + 右 AICC Process 面板”改为同一大画布：统一外框、背景和左右分区，手机 App 图片与 AICC Process 在同一客户接入演示容器内并排展示；顶部 `Customer Access Demo` 标题条和手机区右侧当前步骤说明已去除，当前步骤只在右侧 AICC Process 表达。
- PSTN / Voice Call 菜单点击触发电话来电逻辑。
- Video Call 菜单点击触发视频来电 tab，复用电话弹屏三栏内容。
- BankApp Demo 的入口、业务选择、业务确认截图已切换为脱敏版本：渠道选择、游客号码输入、客户信息录入、三渠道业务选择和三渠道业务确认均保留手机截图比例和大概样式，但只显示 BANK 1 或通用业务内容；Voice `Calling Agent` / `Connected` 直接使用用户提供的通话截图原图 `voice-calling.png` / `voice-connected.png`；Video `Calling Agent` 复用 `voice-calling.png`，Video `Connected` 运行时直接使用用户本轮提供的视频通话截图原图 `video-connected-new.png`；Live Chat 排队与聊天直接使用用户提供且已处理的 `livechat-queue.png` / `livechat-chat.png` 原附件；Voice / Video / Live Chat 最终 `Service Closed` 均使用用户提供的满意度评价截图 `service-closed.png`；步骤标题和 AICC Process rail 已按开发责任增加 `BANK1` / `Netinfo` 标识。
- 左侧菜单已调整为 `Channel Simulation > PSTN / BankApp / WhatsApp`；旧可见 `Video Call` 和 `Live Chat` 入口已移除，底层能力保留。
- 新增 `WhatsApp Demo` workspace tab，使用 WhatsApp 专用流程：Request Human Agent、Business Selection、Queue & Agent Chat、View Agent Workspace、Satisfaction Rating；默认 Live Chat 渠道并聚焦 WhatsApp mock 会话。
- WhatsApp Demo 已移除 `Customer Type` 控件；除 `View Agent Workspace` 显示 `Netinfo` 外，其它手机步骤标题和 AICC Process rail 步骤均显示 `Bank1` badge。
- WhatsApp Demo 与 BankApp Demo 的 AICC Process rail 均为渐进显示，只渲染当前已经到达的步骤，后续步骤点击 `Next Step` 后才显示。
- WhatsApp Demo 与 BankApp Demo 的 AICC Process rail 已改为中性编号点和细灰色箭头连接；蓝/绿视觉重点只保留给 `Bank1` / `Netinfo` 开发方 badge。
- BankApp Video 桌面共享演示流程已调整为 OpenEye 驱动：`Agent Workspace` 后新增 `Select Sharing Program` 与 `View Agent Screen Sharing` 两个 Netinfo 步骤；OpenEye 浮窗内点击 `桌面共享` 进入选择共享程序截图，点击 `确定` 后自动切回 BankApp Demo 并展示 `video-screen-sharing.png`。
- 新增 GitHub Actions CI，覆盖 PR 到 `main` 和 push 到 `main` / `codex/**` 的 lint/build 验证。
- BankApp Live Chat 路径可打开 Live Chat 并自动选中 BankApp 客户 Sari Amelia；Registered Customer 跳过个人信息页，Guest 才进入个人信息录入。
- BankApp Voice Call 路径可触发 `Incoming` 并打开 Inbound tab，Customer Information 渠道图标为 BankApp 移动端图标，文字显示 `BankApp`。
- BankApp Video Call 路径可触发 Video Call tab，Customer Information 渠道图标为 BankApp 移动端图标，文字显示 `BankApp`；普通 Channel Simulation 的 Video Call 仍显示 `Video Call` 渠道。
- Sign In 后自动显示固定不可关闭 Live Chat tab。
- Live Chat 页面复用 `InteractionWorkspace`，新增默认收起的客户文字聊天列表，支持 ALL、WhatsApp、BankApp 图标筛选和会话切换；Webchat mock 暂时隐藏，等待未来入口。
- Workspace tabs 已统一到 `workspace-tab-label` 结构，Home、BankApp Demo、WhatsApp Demo、Live Chat、PSTN、Voice Call、Video Call 的图标与文字间距一致；交互类 tab 保留 `(mm:ss)` 持续时间。
- PSTN、BankApp Voice、BankApp Video 已支持多通话实例 tab：Hang Up 后旧 tab 保留并冻结时长，新呼叫会创建新的 `call-n` tab，不再覆盖旧弹屏。
- BankApp / WhatsApp Live Chat 的 tab、客户列表和 Conversation header 运行计时现在从新接入 `00:00` 开始，并共享同一份 store timing；mock `accessDuration` 仅作为 Customer Information 的静态渠道接入耗时展示。
- Customer Information 的渠道标签已整合 access duration，显示为 `渠道 · 接入时长`，不再额外显示单独时钟图标。
- Live Chat SLA warning 色已调整为更明确的 amber/yellow，breach 红色逻辑保持不变。
- Live Chat 的 CRM 工作区新增固定不可关闭 `Conversation` tab，支持按客户联动历史会话、消息发送和结束服务确认关闭客户。
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
- `CustomerInformationPanel` 支持空头像首字母兜底、普通客户隐藏级别、长邮箱换行、固定邮箱图标宽度和邮箱 hover/focus 可点击高亮。
- `CustomerInformationCard` 的外呼申请状态按客户隔离，不再由当前卡片实例的单个状态影响所有切换后的客户。
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

截至 2026-05-25 02:10 +08:00，当前工作在 `codex/multi-inbound-interaction-tabs` 分支处理 `v0.6.0` 多 Inbound 弹屏与通话 tab 架构。PSTN、BankApp Voice、BankApp Video 现在使用多 `CallInteraction` 实例；Hang Up 后旧弹屏保留并冻结时长，新呼叫会创建新 tab。Live Chat 继续使用固定 tab + 多客户列表，不改为多个 workspace tabs。

本轮多通话弹屏架构：

- `appStore` 新增 `CallInteraction` 模型：`id`、`tabKey`、`kind`、`source`、`title`、`startedAt`、`endedAt`、`flashUntil`、`phase`。
- Store 以 `callInteractions` + `callInteractionOrder` 渲染多个通话 tab，并用 `currentCallInteractionId` 绑定当前话务条状态机。
- `AgentWorkspace` 按 `callInteractionOrder` 渲染动态 `call-n` tabs；running tab 实时计时，ended tab 使用 `endedAt` 冻结时长。
- 当前 active call tab 在 Hang Up 前不可关闭；Hang Up 后变为可关闭。
- `InboundPage` / `VideoCallPage` 改为接收 interaction source，旧 tab 的客户资料不会被新呼叫覆盖。
- OpenEye 浮窗和 BankApp Video desktop share 只绑定当前 active video interaction；ended video tab 不显示浮窗。

本轮多通话弹屏验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` at 1366x768：Sign In 后 Live Chat tab 无 duration。
- Browser smoke check `/`：PSTN Incoming 创建不可关闭 `PSTN (00:xx)` tab；Answer -> Hang Up 后 tab 保留、时长冻结并变为可关闭。
- Browser smoke check `/`：旧 PSTN tab 未关闭时再次触发 PSTN，会创建第二个 PSTN tab，不覆盖旧 tab。
- Browser smoke check `/`：BankApp Voice 创建 `Voice Call (00:xx)` tab，Hang Up 后变为可关闭。
- Browser smoke check `/`：BankApp Video 创建 `Video Call (00:xx)` tab，旧 Voice Call tab 保留，Answer 后 OpenEye 浮窗正常显示。
- Browser smoke check `/`：WhatsApp Demo 仍能进入 Live Chat，Webchat mock 仍不可见。
- Browser smoke check `/design-system`：页面正常加载。

截至 2026-05-25 01:31 +08:00，当前工作在 `codex/live-chat-timing-visual-cleanup` 分支处理 `v0.5.5` 后续 Live Chat 计时与 tab 视觉清理，目标发布 `v0.5.6`。本轮只清理 workspace tab label 间距、Live Chat 运行计时起点、Customer Information 渠道接入时长展示和 Live Chat SLA warning 色；不修改话务状态机，不做多 inbound tabs，不改变 BankApp/WhatsApp/Video 客户侧流程。

本轮 Live Chat 计时与 tab 视觉清理：

- `AgentWorkspace` 中 Home、BankApp Demo、WhatsApp Demo、Live Chat、PSTN / Voice Call、Video Call 统一使用 `WorkspaceTabLabel` 结构，修复 nested `span` 被通用 gap 样式影响导致图标和文字距离变宽的问题。
- BankApp / WhatsApp Live Chat session timing 从接入时 `00:00` 开始，不再根据 mock `customer.accessDuration` 回推。
- Live Chat 客户列表始终显示每个 active customer 的运行 duration，即使只有一个客户也显示，避免规则忽有忽无。
- `ConversationWorkspace` 头部、客户列表和 Live Chat tab 继续使用同一份 runtime timing。
- Customer Information 的 `accessDuration` 保留静态渠道接入耗时语义，合并到渠道标签内显示，例如 `PSTN · 05:23`、`BankApp · 02:11`、`WhatsApp · 00:48`；独立时钟图标与单独 duration 文本已移除。
- Live Chat warning SLA 色从偏深棕调整为更清晰的 amber/yellow，breach 红色保持不变。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` at 1366x768：Sign In 后 Live Chat tab 无 duration，Home 和 Live Chat tab 图标文字间距均为 4px。
- Browser smoke check `/`：PSTN Incoming 显示 `PSTN (00:xx)`，BankApp Voice 显示 `Voice Call (00:xx)`，BankApp Video 显示 `Video Call (00:xx)`，旧 `PSTN / Voice Call` 不再出现。
- Browser smoke check `/`：BankApp / WhatsApp Live Chat 均从 `00:00` 开始计时，客户列表和 Conversation header 同步增长，且单个 active customer 仍显示 duration。
- Browser smoke check `/`：Customer Information access strip 显示 `渠道 · 接入时长`，不再出现独立时钟时长。
- Browser smoke check `/`：End Service 后清理该 session timing，无 active sessions 时 Live Chat tab 恢复无 duration。
- Browser smoke check `/`：warning duration 色为 `#c77a00`，收起态 marker 色为 `#f5a400`。
- Browser smoke check `/design-system`：页面正常加载。

截至 2026-05-24 22:31 +08:00，当前工作在 `codex/toolbar-compact-visual-balance` 分支处理 `v0.5.3` 后续话务条视觉平衡，目标发布 `v0.5.4`。本轮只改话务条文字层级、Settings 布局和 `Icon Only` 图标尺寸，不修改话务状态机、Customer Information、外呼申请、BankApp/WhatsApp 客户侧流程、OpenEye 桌面共享或状态点机制。

本轮话务条文字层级、Settings 简化和 Icon Only 优化：

- `IVR` / `BankID` 标签不再使用蓝色和 800 字重，改为与 timer label 一致的灰色 600。
- `08123456789` / `00012345` 与右侧 timer value 使用相同黑色、700 字重和 tabular nums，降低“左重右轻、灰黑跳跃”的视觉差。
- Settings 弹框宽度收窄到 `420`，删除说明文案，只保留一行 `Toolbar display` + 自定义 segmented control。
- `AgentToolbar` 在 `toolbarDisplayMode === 'icon'` 时增加 `aicc-agent-toolbar--icon-only` class。
- `Icon Only` 模式下 `.aicc-toolbar-button` 固定为 29px 方形按钮、padding 归零，按钮和 More 图标放大到 14px；默认 `Icon + Text` 模式不受影响。

本轮话务条文字层级、Settings 简化和 Icon Only 验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` at 1366x768：Sign In 后 More > Settings 可打开；Settings 只显示一行 `Toolbar display` + `Icon + Text` / `Icon Only`，没有说明文案。
- Browser smoke check `/`：切换 `Icon Only` 后 toolbar 增加 `aicc-agent-toolbar--icon-only`，按钮宽度 29px，按钮图标和 More 图标均为 14px。
- Browser smoke check `/`：PSTN Incoming 显示 `IVR 08123456789`；identification label 与 timer label 的计算样式一致，identification value 与 timer value 的计算样式一致。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`。

截至 2026-05-24 22:07 +08:00，当前工作在 `codex/toolbar-visual-polish` 分支处理 `v0.5.2` 后续话务条视觉细节，目标发布 `v0.5.3`。本轮只改话务条 divider、Settings Toolbar display 控件和 More 菜单触发方式，不修改话务状态机、Customer Information、外呼申请、BankApp/WhatsApp 客户侧流程、OpenEye 桌面共享或状态点机制。

本轮话务条视觉细节优化：

- `aicc-agent-toolbar__identification` 右侧 divider 和 timer 左侧 divider 统一使用 `rgba(86, 122, 166, 0.52)`，仍为 1px，提升可见度但不加重话务条。
- `IVR` / `BankID` 标签保持 800 字重，接入号码显式固定为 700 字重和 tabular nums，避免号码抢占操作按钮视觉优先级。
- `ToolbarSettingsModal` 从 Ant Design `Segmented` 改为项目自定义 `.aicc-segmented-control` 按钮组，视觉参考 BankApp Customer type：白底、细边框、浅蓝选中态、hover/focus 与系统一致。
- More Dropdown 明确设置为 click trigger，使 Settings 入口符合点击操作预期。

本轮话务条视觉细节验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/` at 1366x768：Sign In 后 More 点击可打开菜单，Settings 可打开。
- Browser smoke check `/`：Settings 只显示 Toolbar display，`Icon + Text` / `Icon Only` 是自定义 segmented buttons，`Icon Only` 确认后按钮文字隐藏且图标、`aria-label` 保留。
- Browser smoke check `/`：PSTN Incoming 中 `IVR 08123456789` 位于 Answer 左侧，使用纯文本和更清晰 divider。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`。

截至 2026-05-24 19:48 +08:00，当前工作在 `codex/toolbar-identification-display-mode` 分支处理 `v0.5.1` 后续话务条优化，目标发布 `v0.5.2`。本轮继续只改话务条和 Settings，不修改 Customer Information、外呼申请、BankApp/WhatsApp 客户侧流程、OpenEye 桌面共享或状态点机制。

本轮话务条 identification 与显示模式优化：

- Incoming identification 从独立浅色 pill 改为无背景纯文本，去掉冒号，显示为 `IVR 08123456789` / `BankID 00012345`。
- 识别信息固定放在动作按钮组最左侧：Incoming 时在 Answer 左侧，Talking/Hold/Mute 时在 Hold 左侧；右侧用竖线和按钮区分。
- More 菜单重新开放 `Settings`。
- Settings 弹框不再展示自动接听/振铃时长设置，只显示 `Toolbar display` 的 `Icon + Text` / `Icon Only` 选项。
- 默认 `Icon + Text` 保持既有按钮文字；`Icon Only` 隐藏 Answer、Hold、Mute、Transfer、Hang Up、Ready/Not Ready 的可见文字，但保留图标、`aria-label` 和 `title`。
- `autoAnswerSeconds` 仍保留默认 3 秒逻辑，不在 UI 中配置。

本轮话务条 identification 与显示模式验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Sign In 后 More > Settings 可打开；弹框只显示 Toolbar display，不显示 Automatically answer / ringing / seconds。
- Browser smoke check `/`：默认 `Icon + Text` 下 Answer/Ready 保持文字；切换 `Icon Only` 后按钮文字隐藏，图标、`aria-label`、`title` 保留。
- Browser smoke check `/`：PSTN Incoming 显示 `IVR 08123456789` 在 Answer 左侧；Talking 显示在 Hold 左侧；无背景、无冒号，右侧只有分隔线。
- Browser smoke check `/`：BankApp Voice / Video 首项显示 `BankID 00012345`，Hang Up 后 identification 隐藏；BankApp Video 的 OpenEye `Desktop Share` 仍可见。
- Browser smoke check `/`：BankApp Live Chat 和 WhatsApp Demo Live Chat 均不显示 IVR/BankID。
- Browser layout check `/` at 1366x768：话务条不遮挡 BANK 1 logo 或右侧 profile/actions。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`。

截至 2026-05-24 19:16 +08:00，当前工作在 `codex/customer-demo-incoming-identification` 分支处理客户远程演示版话务条 incoming identification。该分支从 `main@v0.5.0` 拉出，目标发布 `v0.5.1`；本轮只新增话务条识别信息，不修改 Customer Information 卡片、外呼申请、Contact Management、BankApp/WhatsApp 客户侧流程或状态点机制。

本轮话务条 incoming identification：

- `BasicLayout` 根据现有 `activeCallChannel`、`inboundPopupSource`、`videoCallPopupSource` 计算 `callIdentification`。
- PSTN / IVR 呼入在 `Incoming`、`Talking`、`Hold`、`Mute` 显示 `IVR: 08123456789`。
- BankApp Voice / Video 呼入在同一通话状态显示 `BankID: 00012345`，使用脱敏 BankID 文案，不出现 BCAID。
- 普通 hidden standard Video Call、Live Chat、WhatsApp 文字会话、Ready、ACW 和 Sign In 空闲状态不显示 identification。
- `AgentToolbar` 新增可选 `callIdentification` 展示 prop，使用浅色 pill 展示在 Answer 或 Hold 右侧；不改变话务状态机、自动接听、Hold/Mute/Transfer/Hang Up 或 `v0.5.0` presence 状态点机制。
- 话务条最大宽度从 `min(54vw, 620px)` 调整为 `min(64vw, 760px)`，用于容纳识别号；1366px 浏览器边界检查确认不遮挡 BANK 1 logo 或右侧 profile/actions。

本轮话务条 incoming identification 验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Sign In 后无通话时不显示 identification。
- Browser smoke check `/`：`Channel Simulation > PSTN` Incoming / Talking 显示 `IVR: 08123456789`，Hang Up 后隐藏。
- Browser smoke check `/`：BankApp Voice 激活 `PSTN / Voice Call` 后显示 `BankID: 00012345`，Hang Up 后隐藏。
- Browser smoke check `/`：BankApp Video 激活 `Video Call` 后显示 `BankID: 00012345`，OpenEye `Desktop Share` 仍可见，Hang Up 后隐藏。
- Browser smoke check `/`：BankApp Live Chat 和 WhatsApp Demo Live Chat 均不显示 IVR/BankID。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`。

截至 2026-05-24 17:57 +08:00，当前工作在 `codex/customer-demo-optimization` 分支处理客户远程演示版状态机制优化。上一阶段 `v0.4.1` 已冻结 WhatsApp / BankApp demo detail、BankApp Video 桌面共享等成果；本阶段目标为 `v0.5.0`，只改话务条状态点和 Live Chat 接入规则，不夹带 BankApp / WhatsApp / Video 新功能。

本轮客户远程演示状态机制优化：

- `appStore` 新增 `activeLiveChatSessionIds`、`closeLiveChatSession(sessionId)` 和 `clearLiveChatSessions()`，文字客户是否接入由 active session 列表决定。
- `requestLiveChatWorkspace(sessionId?, activate?)` 只有在传入 session id 时才加入 active list；BankApp Live Chat 加入 `live-chat-002`，WhatsApp 加入 `live-chat-001`。
- `LiveChatPage` 不再默认展示全部 `liveChatSessions`，只显示 active session；Sign In 后固定 Live Chat tab 为空态。
- `LiveChatCustomerList` 当前只启用 WhatsApp 与 BankApp 两个筛选项；Webchat mock 保留在数据里，但暂不显示客户或筛选入口。
- `BasicLayout` 计算 `effectiveAgentPresence` 并传给 `AgentProfileArea`：Unsigned 灰色，Ready 且无互动绿色，有电话/视频/文字客户接入红色，AUX / Not Ready / ACW 且无互动黄色。
- 电话/视频从 `Incoming` 即算客户接入；Hang Up 后进入 ACW 时无客户互动，因此状态点转黄色，自动回 Ready 后转绿色。

本轮客户远程演示状态机制验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Sign In 后状态点为绿色，Home 旁有固定 Live Chat tab，Live Chat 页面展示 `No active conversation`。
- Browser smoke check `/`：`Channel Simulation > PSTN` 进入 Incoming 后状态点为红色；Answer 后仍为红色；Hang Up 后 ACW 为黄色，约 5 秒后回 Ready 绿色。
- Browser smoke check `/`：BankApp Live Chat 触发后 Live Chat 只显示 Sari Amelia，状态点红色，Webchat 不可见；确认 End Service 后回空态且状态点绿色。
- Browser smoke check `/`：WhatsApp Demo 触发后 Live Chat 只显示 Dimas Abimanyu，状态点红色，Sari/Webchat 不可见；确认 End Service 后回空态且状态点绿色。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`。

本轮 BankApp Video 桌面共享流程修正：

- `public/screenshots/openeye-share-selection.png` 和 `public/screenshots/bankapp/video-screen-sharing.png` 已从用户原始附件直接解码落盘，分别用于 OpenEye 选择共享程序和 BankApp 客户侧查看坐席共享画面；不再使用生成/绘制版本。
- `BankAppDemoStep` 新增 `share-select` 与 `screen-sharing`；BankApp Video 在 `Agent Workspace` 后追加 `Select Sharing Program` 和 `View Agent Screen Sharing` 两个 Netinfo 步骤，Voice、Live Chat、WhatsApp 步骤不变。
- OpenEye 浮窗仅在 `bankapp-video` 来源下显示半透明英文 `Desktop Share` 按钮；点击后切换为选择共享程序截图，点击 `确定` 后激活共享、切回 BankApp Demo 并展示客户侧共享画面。
- 旧的 BankApp Video connected 页内 `Screen share / Start / Stop` 覆盖控件已移除，共享入口只保留在 OpenEye。
- `appStore` 新增 BankApp Video 共享选择/确认/重置状态；Hang Up、关闭 Video Call tab、非 BankApp Video 呼叫、Reset BankApp Demo 和签出/AUX 会清理共享状态。

本轮 BankApp Video 桌面共享流程验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Video Registered 到 `Agent Workspace` 后激活 `Video Call` tab，OpenEye 出现 `Desktop Share` 按钮。
- Browser smoke check `/`：点击 `Desktop Share` 后 OpenEye 显示选择共享程序截图和可点击 `确定` 热区。
- Browser smoke check `/`：点击 `确定` 后自动切回 `BankApp Demo`，手机区显示 `BankApp agent screen sharing`，AICC Process rail 显示 `Select Sharing Program` 和 `View Agent Screen Sharing` 两个 Netinfo 步骤。
- Browser smoke check `/`：复查后 OpenEye 共享入口可见文案为 `Desktop Share`，背景为半透明深色；OpenEye 选择程序图与 BankApp 客户侧共享图均加载用户原始附件资源。
- Browser smoke check `/`：共享画面后点击 `Next Step` 进入 `Service Closed`，Reset 后回到 `Choose Channel` 且不再显示共享画面。
- Browser smoke check `/design-system`：页面正常加载。

本轮 BankApp Video Calling / Connected 截图替换：

- 从当前 Codex session 中提取用户本轮提供的 Video connected 附件原图，覆盖 `public/screenshots/bankapp/video-connected.png`，并复制为 `public/screenshots/bankapp/video-connected-new.png` 供页面运行时引用。
- BankApp Demo 的 Video `Calling Agent` 步骤改为直接复用 Voice `Calling Agent` 图片 `public/screenshots/bankapp/voice-calling.png`。
- BankApp Demo 的 Video `Connected` 步骤通过 `bankAppScreenshotSources.videoConnected` 引用 `/screenshots/bankapp/video-connected-new.png`，避免旧 dev server 或浏览器缓存继续显示同名旧图。
- 旧的 Video `Connected` 页面内 screen share Start/Stop 演示控件已在 13:48 调整中移除；桌面共享入口改由 OpenEye 浮窗承担。
- Voice、Live Chat、WhatsApp 路径不改变。

本轮 BankApp Video Calling / Connected 截图替换验证：

- Local image check：`video-connected-new.png` 已确认来自用户附件，尺寸为 `750x1624`；Video Calling 复用的 `voice-calling.png` 尺寸为 `747x1624`。
- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning，并出现一次插件耗时提示。
- Browser smoke check `/`：BankApp Video Registered 的 `Calling Agent` 引用 `/screenshots/bankapp/voice-calling.png`，`Connected` 引用 `/screenshots/bankapp/video-connected-new.png`。
- Browser smoke check `/`：BankApp Video 切回 BankApp Demo 后仍显示新的 connected 截图，再下一步进入 `Service Closed` 并引用 `/screenshots/bankapp/service-closed.png`。
- Browser smoke check `/`：BankApp Video Guest 仍保留 `Input Phone Number` 分支，后续 `Calling Agent` / `Connected` 使用指定 Video 截图。
- Browser smoke check `/`：BankApp Voice 仍引用 `/screenshots/bankapp/voice-calling.png` 与 `/screenshots/bankapp/voice-connected.png`，BankApp Chat 仍引用 `/screenshots/bankapp/livechat-queue.png` 与 `/screenshots/bankapp/livechat-chat.png`。
- Browser smoke check `/design-system`：页面正常加载。

本轮 BankApp Voice 通话截图替换：

- 从当前 Codex session 中提取用户本轮提供的两张 Voice 通话附件原图，落盘为 `public/screenshots/bankapp/voice-calling.png` 和 `public/screenshots/bankapp/voice-connected.png`。
- `src/mock/bankapp.ts` 新增 `voiceCalling` / `voiceConnected` 截图路径。
- BankApp Demo 的 Voice `Calling Agent` 步骤直接显示 `voice-calling.png`，Voice `Connected` 步骤直接显示 `voice-connected.png`，不再由前端绘制这两个通话画面。
- Voice `Agent Workspace` 返回状态继续复用 `Connected` 渲染，因此从 `PSTN / Voice Call` 切回 BankApp Demo 时仍保持新的 connected 截图。
- Video `Calling Agent` 仍保留现有前端生成画面，Video `Connected` 仍使用 `video-connected.png`；Live Chat 路径不变。

本轮 BankApp Voice 通话截图替换验证：

- Local image check：`voice-calling.png` 与 `voice-connected.png` 已确认来自用户附件，尺寸均为 `747x1624`。
- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Voice Registered 的 `Calling Agent` 引用 `/screenshots/bankapp/voice-calling.png`，`Connected` 引用 `/screenshots/bankapp/voice-connected.png`。
- Browser smoke check `/`：BankApp Voice `Agent Workspace` 会激活 `PSTN / Voice Call`，切回 BankApp Demo 后仍显示新的 connected 截图，再下一步进入 `Service Closed` 并引用 `/screenshots/bankapp/service-closed.png`。
- Browser smoke check `/`：BankApp Voice Guest 仍保留 `Input Phone Number` 分支，后续 `Calling Agent` / `Connected` 使用同两张新 Voice 截图。
- Browser smoke check `/`：BankApp Video 仍引用 `/screenshots/bankapp/video-connected.png`，BankApp Chat 仍引用 `/screenshots/bankapp/livechat-queue.png` 与 `/screenshots/bankapp/livechat-chat.png`。
- Browser smoke check `/design-system`：页面正常加载。

本轮 WhatsApp Demo 浏览器评论修正：

- WhatsApp Demo 右侧 AICC Process 顶部只读 Channel 值从 `WhatsApp` 改为小写 `chat`。
- 该修正只影响右侧只读控件显示，不改变 WhatsApp Demo tab、左侧菜单、截图资源、Live Chat 会话渠道或坐席侧 WhatsApp 客户资料。

本轮 WhatsApp Demo 浏览器评论修正验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：WhatsApp Demo 右侧只读 Channel 显示为 `chat`。
- Browser smoke check `/design-system`：页面正常加载。

本轮 BankApp / WhatsApp Demo 顶部信息减负：

- BankApp / WhatsApp Demo 已删除统一画布顶部 `Customer Access Demo` 标题整块。
- 手机区标题行保留 `Customer BankApp` / `Customer WhatsApp`，删除右上角当前步骤名称和 `Bank1` / `Netinfo` badge。
- `bankapp-demo__stage` 保持统一外框、背景、阴影和左右浅分隔线，但改为单内容行网格，不再预留跨列标题行。
- 当前步骤、开发方 badge、Next/Reset 和 Completed 终态只由右侧 AICC Process 表达，避免手机区重复展示。

本轮 BankApp / WhatsApp Demo 顶部信息减负验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Demo 无顶部 `Customer Access Demo`，手机区右上角不再显示步骤名称或 badge；Channel / Customer Type 切换正常。
- Browser smoke check `/`：WhatsApp Demo 无顶部 `Customer Access Demo`，手机区右上角不再显示步骤名称或 badge；第三步切到 Live Chat 后返回保活，并可进入禁用 `Completed` 终态。
- Browser smoke check `/design-system`：页面正常加载。

本轮 BankApp / WhatsApp Demo 统一画布布局优化：

- `bankapp-demo__stage` 改为单一大容器，承担整体边框、圆角、背景和阴影。
- `bankapp-demo__phone-panel` 与 `bankapp-process` 去除独立卡片边框和背景，改为同一画布内的 App Preview 区与 AICC Process 区。
- 手机区与流程区之间使用轻量分隔线，画布最大宽度和左侧预览列已收紧，避免宽屏下手机与流程区距离过大。
- BankApp 和 WhatsApp 共用该布局；WhatsApp 继续保持原截图比例和资源，不新增、不重绘截图。
- 窄屏下仍在同一个大容器内上下排列，AICC Process 改为顶部浅分隔线。

本轮 BankApp / WhatsApp Demo 统一画布布局验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Demo 手机和 AICC Process 位于同一个统一画布内，Channel / Customer Type 仍可选中并保持正确 `aria-pressed` 状态。
- Browser smoke check `/`：WhatsApp Demo 使用同一统一画布布局；第三步切到 Live Chat 后返回 WhatsApp Demo 保持 `View Agent Workspace`，继续下一步可进入禁用 `Completed` 终态。
- Browser smoke check `/design-system`：页面正常加载，未发现本轮布局改动影响设计系统页。

本轮 BankApp / WhatsApp Demo 右侧流程区优化：

- BankApp Demo 右侧控制条改为同一行展示 `Channel`、`Customer Type`、`Next Step / Reset`；`Channel` 是可点击分段控件，切换 Voice / Video / Chat 时会重置流程到起点并同步后续路径。
- BankApp Demo 的 `Channel` 和 `Customer Type` 分段控件已改为 `role="group"` 容器与 `aria-pressed` 按钮，不再用 `<label>` 包裹多个按钮；hover 使用中性浅色，selected 才使用蓝色选中态，避免 Voice / Video / Chat 悬浮或选中状态串扰。
- WhatsApp Demo 右侧控制条改为同一行展示只读 `Channel: chat` 与 `Next Step / Reset`；继续不显示 `Customer Type`。
- BankApp / WhatsApp Demo 到达最后一步后，`Next Step` 会变为禁用的 `Completed` 按钮，`Reset` 仍作为唯一重新开始入口。
- BankApp / WhatsApp Demo 的步骤 rail 改为中性编号 marker 和细灰色箭头连接，当前步骤用边框、轻背景和字重强调，不再用蓝/绿状态图标，避免与 `Bank1` / `Netinfo` badge 混淆。
- WhatsApp Demo 的第四步 `View Agent Workspace` badge 从 `Bank1` 改为 `Netinfo`；其它 WhatsApp 步骤仍为 `Bank1`。

本轮 BankApp / WhatsApp Demo 右侧流程区验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Demo 右侧同区展示 Channel、Customer Type、Next/Reset，右侧 Channel 切换到 Video 后流程重置到 `Choose Channel`。
- Browser smoke check `/`：BankApp Demo 最后一步显示禁用 `Completed`，`Reset` 保持可见；流程 rail 显示中性编号步骤。
- Browser smoke check `/`：WhatsApp Demo 右侧只显示 `Channel: chat` 与操作按钮，不显示 `Customer Type`。
- Browser smoke check `/`：WhatsApp Demo 第四步 `View Agent Workspace` 显示 `Netinfo` badge。
- Browser smoke check `/`：WhatsApp Demo 最后一步显示禁用 `Completed`。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`，`UI Design System` 页面内容可见。

本轮 WhatsApp Demo 修改状态：

- `public/screenshots/whatsapp/` 新增 4 张用户本轮提供的脱敏 WhatsApp 截图：`chat-request.png`、`business-selection.png`、`agent-chat.png`、`satisfaction-rating.png`。
- `src/mock/bankapp.ts` 新增 `whatsAppScreenshotSources`，避免 WhatsApp Demo 继续引用 BankApp 截图资产。
- `BankAppDemoPage` 在 `variant="whatsapp"` 时使用独立五步流程：进入客服聊天并要求转坐席、业务选择、排队并接入坐席沟通、查看坐席 Live Chat 工作台、服务结束满意度评价。
- WhatsApp Demo 的 AICC Process 控制区不再显示 `Customer Type`，只保留 `Next Step` 与 `Reset`。
- WhatsApp Demo 手机当前步骤标题与右侧流程 rail 的每一步 badge 均显示 `Bank1`。
- WhatsApp Demo 的 AICC Process rail 只显示已经到达的步骤，后续步骤点击 `Next Step` 后才显示。
- WhatsApp Demo 在 `Queue & Agent Chat` 后点击 `Next Step` 会先进入 `View Agent Workspace`，并调用 `requestLiveChatWorkspace('live-chat-001', true)` 切到固定 Live Chat tab，坐席工作台接入渠道为 WhatsApp。
- `AgentWorkspace` 保持 WhatsApp Demo tab 挂载；从 Live Chat 切回 WhatsApp Demo 时当前步骤不刷新，仍停留在 `View Agent Workspace`，再点击 `Next Step` 才进入 `Satisfaction Rating`。

本轮 WhatsApp Demo 验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：`Channel Simulation > WhatsApp` 可打开 `WhatsApp Demo` tab。
- Browser smoke check `/`：WhatsApp Demo 不再出现 `Customer Type`。
- Browser smoke check `/`：初始只显示 `Request Human Agent`，后续步骤不会提前出现在 AICC Process rail；点击 `Next Step` 后才逐步显示 `Business Selection`、`Queue & Agent Chat`、`View Agent Workspace`、`Satisfaction Rating`。
- Browser smoke check `/`：截图步骤分别引用 `/screenshots/whatsapp/chat-request.png`、`business-selection.png`、`agent-chat.png`、`satisfaction-rating.png`。
- Browser smoke check `/`：第三步后点击 `Next Step` 会切到 `Live Chat` tab，Customer Information / Conversation 使用 WhatsApp 客户会话。
- Browser smoke check `/`：切回 `WhatsApp Demo` 后仍停留在 `View Agent Workspace`，未重置到第一步，也未提前进入满意度评价；再点 `Next Step` 后进入 `Satisfaction Rating`。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`，`UI Design System` 页面内容可见。

本轮 BankApp Demo 同步坐席工作台策略：

- BankApp Demo 的 Voice / Video / Live Chat 三条路径都新增 `Agent Workspace` 中间步骤，位于 Voice/Video 的 `Connected` 或 Live Chat 的 `Chat Page` 之后、`Service Closed` 之前。
- `Agent Workspace` 步骤按 BankApp 现有开发责任口径显示 `Netinfo` badge；`Customer Type` 继续保留，Registered / Guest 分支不变。
- BankApp Demo 的 AICC Process rail 改为只显示已到达步骤，后续步骤点击 `Next Step` 后才出现。
- `AgentWorkspace` 保持 BankApp Demo tab 挂载；从坐席工作台切回 BankApp Demo 时当前步骤不刷新，仍停留在 `Agent Workspace`，再点击 `Next Step` 才进入 `Service Closed`。
- `requestBankAppVoiceCall(activate?)` / `requestBankAppVideoCall(activate?)` 新增激活语义，并由 `BasicLayout` 在处理 BankApp request id 时传给 `triggerVoiceInboundCall()` / `triggerVideoInboundCall()`。
- BankApp Live Chat 在 `Chat Page` 后点击 `Next Step` 会激活 `Live Chat` tab 并聚焦 BankApp 会话；Voice 会激活 `PSTN / Voice Call` tab 且来源为 `bankapp-voice`；Video 会激活 `Video Call` tab 且来源为 `bankapp-video`。

本轮 BankApp Demo 验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：BankApp Voice Registered 在 `Connected` 后点击 `Next Step` 会切到 `PSTN / Voice Call`，切回 BankApp Demo 后仍停留在 `Agent Workspace`，再下一步进入 `Service Closed`。
- Browser smoke check `/`：BankApp Voice Guest 仍保留 `Input Phone Number` 分支，且流程 rail 只显示 `Choose Channel` 与当前到达的号码步骤。
- Browser smoke check `/`：BankApp Video 在 `Connected` 后点击 `Next Step` 会切到 `Video Call`，切回 BankApp Demo 后仍停留在 `Agent Workspace` 并保留视频接通画面，再下一步进入 `Service Closed`。
- Browser smoke check `/`：BankApp Live Chat 在 `Chat Page` 后点击 `Next Step` 会切到 `Live Chat` 并聚焦 BankApp 客户，切回 BankApp Demo 后仍停留在 `Agent Workspace`，再下一步进入 `Service Closed`。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`，`UI Design System` 页面内容可见。

本轮 BankApp 客户接入演示状态：

- `Customer Simulator > BankApp` 左侧菜单入口和可关闭 `BankApp Demo` workspace tab。
- `BankAppDemoPage` 已从三栏信息面板简化为“Customer BankApp 手机主导 + AICC Process rail 联动”的演示舞台。
- 手机模拟器按客户截图比例显示，并改为按面板高度放大，基本撑满左侧手机展示区；BankApp 页面顶部标题条已删除。
- 顶部控制区已取消；`Customer Type`、`Next Step`、`Reset` 移入 `AICC Process` 面板同一行；`Language` 控制已去除。
- 独立 `Agent Desktop Outcome` 大面板已移除；坐席侧结果通过真实 `PSTN / Voice Call`、`Video Call`、`Live Chat / Conversation` workspace tab 跳转体现。
- BankApp 右侧 AICC Process rail 的每个步骤显示开发方 badge：`Choose Channel`、`Input Phone Number`、`Personal Information`、`Service Closed` 显示 `BANK1`；`Select Business`、`Confirm Business`、`Calling Agent`、`Connected`、`Chat Page`、`Agent Workspace` 显示 `Netinfo`。手机区标题行不再重复当前步骤和开发方 badge。
- BankApp demo 状态类型与 mock：`customerType`、`language`、联系方式 `voice | video | livechat`、业务类型 `mobile-login | card-issue | transaction-dispute | account-info`、演示步骤和动态技能组。
- 渠道选择页引用脱敏图 `channel-selection-sanitized.png`，页面内只保留 `Voice Call`、`Video Call`、`Live Chat` 三个清晰入口且入口文字已放大，其它客户系统特征弱化；Voice/Video/Livechat 通过重新校准后的透明热区点击进入流程。
- 游客号码输入页使用脱敏图 `voice-phone-number-sanitized.png`；客户信息录入页使用脱敏图 `text-login-sanitized.png`。
- `Select Business` 页面按渠道引用三张脱敏图：`voice-business-selection-sanitized.png`、`video-business-selection-sanitized.png`、`livechat-business-selection-sanitized.png`，并保留透明业务热区。
- `Confirm Business` 页面按渠道引用三张脱敏图：`voice-business-confirm-sanitized.png`、`video-business-confirm-sanitized.png`、`livechat-business-confirm-sanitized.png`，并保留 No / Yes 透明热区。
- Video 的 `Calling Agent` 步骤直接复用 Voice `Calling Agent` 原图 `public/screenshots/bankapp/voice-calling.png`；Video connected 步骤运行时引用 `public/screenshots/bankapp/video-connected-new.png`，该文件是用户本轮提供的视频通话截图原图，用新文件名规避浏览器同名资源缓存，不绘制、不脱敏。
- Live Chat 的 `Connecting to Agent` / 排队步骤直接引用用户已处理附件 `public/screenshots/bankapp/livechat-queue.png`，`Chat Page` 步骤直接引用用户已处理附件 `public/screenshots/bankapp/livechat-chat.png`，不再绘制或二次脱敏。
- Voice 的 `Calling Agent` 直接引用用户提供的通话截图原图 `public/screenshots/bankapp/voice-calling.png`，Voice 的 `Connected` 直接引用用户提供的通话截图原图 `public/screenshots/bankapp/voice-connected.png`，不再由前端组件生成这两个 Voice 通话画面；Voice / Video / Live Chat 的最后一步 `Service Closed` 统一引用用户提供的满意度评价附件 `public/screenshots/bankapp/service-closed.png`。
- Live Chat 路径联动 `requestLiveChatWorkspace('live-chat-002', true)`，在 `Agent Workspace` 步骤激活 Live Chat 并聚焦 BankApp 客户；Registered Customer 直接进入业务选择，Guest 才显示 `Personal Information`。
- Voice Call 路径通过 `requestBankAppVoiceCall(true)` 触发现有语音话务状态机，Inbound 使用 `bankAppVoiceCustomer` 和 `BankApp` 渠道展示，并在 `Agent Workspace` 步骤激活 `PSTN / Voice Call`。
- Video Call 路径通过 `requestBankAppVideoCall(true)` 触发现有视频话务状态机，Video Call workspace 使用 `bankAppVideoCustomer` 和 `BankApp` 渠道展示，并在 `Agent Workspace` 步骤激活 `Video Call`；普通 Channel Simulation 的 Video Call 使用独立 `standard` 来源和 `Video Call` 渠道展示。
- Internal Chat mock 中残留的 `Haloapps` 可见文案改为 `BankApp`。
- 明确未脱敏或旧版原始 Haloapps 设计截图已迁出仓库目录，不再保留在 `public/screenshots/bankapp/`；BankApp Demo 入口和业务页引用脱敏截图，用户已处理的通话/聊天/评价附件仍作为演示必需图保留并需在发布前复核可分享性。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：`Customer Simulator > BankApp` 可打开 `BankApp Demo` tab，已删除页面顶部 `Customer Simulator / BankApp Service Entry` 标题条。
- Browser smoke check `/`：`Language` 控制和 AICC header 的 `Registered Customer / EN` 已去除；`Customer Type` 与 `Next Step` / `Reset` 已移动到 AICC Process 面板。
- Browser smoke check `/`：AICC Process summary 中的 `Business`、`Skill`、`Phone` 已去除，仅保留当前渠道摘要和流程 rail。
- Browser smoke check `/`：渠道选择页使用脱敏图，顶部显示 `BANK 1`，未显示原 `haloBCA` 品牌，Voice/Video/Livechat 透明热区仍可分别进入正确流程。
- Browser smoke check `/`：手机框按截图比例放大，基本撑满左侧面板。
- Browser smoke check `/`：Guest + Voice 热区进入 `Input Phone Number` 脱敏号码录入页；Livechat 热区进入 `Personal Information` 脱敏客户信息页。
- Browser smoke check `/`：Voice / Video / Livechat 三条渠道均进入对应 `*-business-selection-sanitized.png` 业务选择脱敏图。
- Browser smoke check `/`：Voice / Video / Livechat 三条渠道均进入对应 `*-business-confirm-sanitized.png` 业务确认脱敏图，确认热区可继续推进。
- Browser smoke check `/`：Registered Voice 路径跳过 `Input Phone Number`，进入 `Select Business`。
- Browser smoke check `/`：Guest Voice 路径显示 `Input Phone Number`，再进入业务选择。
- Browser smoke check `/`：Registered Live Chat 直接进入 `Select Business`，不显示 `Personal Information`；Guest Live Chat 显示 `Personal Information`。
- Browser smoke check `/`：Video Call 的 `Calling Agent` 步骤引用 `/screenshots/bankapp/voice-calling.png`，`Connected` 步骤引用 `/screenshots/bankapp/video-connected-new.png`。
- Local image check：`public/screenshots/bankapp/video-connected-new.png` 已确认是用户本轮提供的视频通话截图原图。
- Browser smoke check `/`：BankApp Video 进入 `Connected` 后可见 `img[alt="BankApp connected video call"][src="/screenshots/bankapp/video-connected-new.png"]`，页面仍停留在 BankApp Demo。
- Browser smoke check `/`：步骤标题和 AICC Process rail 显示开发方 badge；Registered Voice 中 `Choose Channel` / `Service Closed` 为 `BANK1`，`Select Business` / `Confirm Business` / `Calling Agent` / `Connected` 为 `Netinfo`。
- Browser smoke check `/`：Guest Voice 中 `Input Phone Number` 为 `BANK1`；Guest Live Chat 中 `Personal Information` 为 `BANK1`。
- Browser smoke check `/`：Livechat 的 `Connecting to Agent` 步骤引用 `/screenshots/bankapp/livechat-queue.png`。
- Browser smoke check `/`：Livechat 的 `Chat Page` 步骤引用 `/screenshots/bankapp/livechat-chat.png`。
- Browser smoke check `/`：Voice / Video / Livechat 三条渠道都会先进入 `Agent Workspace`，再点击 `Next Step` 后进入 `Service Closed`，并引用 `/screenshots/bankapp/service-closed.png`。
- Browser smoke check `/`：BankApp voice/video/livechat 触发坐席工作台时会激活对应 workspace；切回 `BankApp Demo` 后仍停留在 `Agent Workspace`，便于继续演示客户侧满意度评价终态。
- Browser smoke check `/`：Voice Call 路径在坐席 `Ready` / `Idle` 时可打开 `PSTN / Voice Call`，Customer Information 显示 `mobile BankApp`。
- Browser smoke check `/`：BankApp Video Call 路径在坐席 `Ready` / `Idle` 时可打开 `Video Call`，Customer Information 显示 `mobile BankApp`。
- Browser smoke check `/`：普通 `Channel Simulation > Video Call` 仍显示 `video-camera Video Call`，不被 BankApp 视频来源影响。
- Browser smoke check `/`：Livechat 路径进入组件化聊天页后可打开 Live Chat，并聚焦 BankApp 客户 Sari Amelia 的 Conversation。
- Browser smoke check `/`：`Reset` 可恢复 Customer Type、BankApp 手机模拟器和 AICC rail 到初始状态。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`，`UI Design System` 页面内容可见。

截至 2026-05-22 18:28 +08:00，当前工作在 `codex/live-chat-detail` 分支继续优化 Live Chat 详情页。`main` 未合并、未推送，客户正式环境不更新。

当前 `git status --short --branch` 主要状态：

```text
## codex/live-chat-detail...origin/codex/live-chat-detail
M .codex-backup/key-prompts.md
M DEV_LOG.md
M PROJECT_CONTEXT.md
M src/components/CustomerInformationPanel.tsx
M src/mock/inbound.ts
M src/pages/inbound/InteractionWorkspace.tsx
M src/pages/inbound/LiveChatPage.tsx
M src/layouts/components/TransferModal.tsx
M src/pages/inbound/components/CustomerInformationCard.tsx
M src/pages/inbound/components/ChannelTag.tsx
M src/pages/inbound/components/CrmPanel.tsx
M src/pages/inbound/components/ContactManagementModal.tsx
M src/pages/inbound/components/LiveChatCustomerList.tsx
M src/pages/inbound/components/contactManagementData.ts
M src/styles/index.less
M src/types/inbound.ts
?? src/pages/inbound/components/ConversationWorkspace.tsx
?? .codex-backup/context-snapshot-2026-05-22-0102.md
?? .codex-backup/context-snapshot-2026-05-22-0128.md
?? .codex-backup/context-snapshot-2026-05-22-1145.md
?? .codex-backup/context-snapshot-2026-05-22-1158.md
?? .codex-backup/context-snapshot-2026-05-22-1209.md
?? .codex-backup/context-snapshot-2026-05-22-1219.md
?? .codex-backup/context-snapshot-2026-05-22-1253.md
?? .codex-backup/context-snapshot-2026-05-22-1310.md
?? .codex-backup/context-snapshot-2026-05-22-1552.md
?? .codex-backup/context-snapshot-2026-05-22-1620.md
?? .codex-backup/context-snapshot-2026-05-22-1650.md
?? .codex-backup/context-snapshot-2026-05-22-1717.md
?? .codex-backup/context-snapshot-2026-05-22-1733.md
?? .codex-backup/context-snapshot-2026-05-22-1748.md
?? .codex-backup/context-snapshot-2026-05-22-1828.md
?? .codex-backup/current-todo-2026-05-22-0102.md
?? .codex-backup/current-todo-2026-05-22-0128.md
?? .codex-backup/current-todo-2026-05-22-1145.md
?? .codex-backup/current-todo-2026-05-22-1158.md
?? .codex-backup/current-todo-2026-05-22-1209.md
?? .codex-backup/current-todo-2026-05-22-1219.md
?? .codex-backup/current-todo-2026-05-22-1253.md
?? .codex-backup/current-todo-2026-05-22-1310.md
?? .codex-backup/current-todo-2026-05-22-1552.md
?? .codex-backup/current-todo-2026-05-22-1620.md
?? .codex-backup/current-todo-2026-05-22-1650.md
?? .codex-backup/current-todo-2026-05-22-1717.md
?? .codex-backup/current-todo-2026-05-22-1733.md
?? .codex-backup/current-todo-2026-05-22-1748.md
?? .codex-backup/current-todo-2026-05-22-1828.md
?? .codex-backup/page-state-2026-05-22-0102.md
?? .codex-backup/page-state-2026-05-22-0128.md
?? .codex-backup/page-state-2026-05-22-1145.md
?? .codex-backup/page-state-2026-05-22-1158.md
?? .codex-backup/page-state-2026-05-22-1209.md
?? .codex-backup/page-state-2026-05-22-1219.md
?? .codex-backup/page-state-2026-05-22-1253.md
?? .codex-backup/page-state-2026-05-22-1310.md
?? .codex-backup/page-state-2026-05-22-1552.md
?? .codex-backup/page-state-2026-05-22-1620.md
?? .codex-backup/page-state-2026-05-22-1650.md
?? .codex-backup/page-state-2026-05-22-1717.md
?? .codex-backup/page-state-2026-05-22-1733.md
?? .codex-backup/page-state-2026-05-22-1748.md
?? .codex-backup/page-state-2026-05-22-1828.md
?? public/avatars/
```

本轮 Customer Information 卡片调整：

- 恢复邮箱 hover/focus 可点击标识：邮箱文字在悬浮或键盘聚焦时变为主蓝色并显示下划线。
- 外呼申请状态从单个 `outboundRequestStatus` 调整为按 `accessChannel + CIS + phoneNumber` 组成的客户 key 存储；Live Chat 切换客户后，申请中或已批准状态只属于发起申请的客户。
- WhatsApp Live Chat 会话的客户头像改为本地生成的女生客户头像 `public/avatars/whatsapp-customer-female.png`，不影响 PSTN 默认客户头像。
- BankApp 和 Webchat Live Chat 客户按未上传头像处理，`CustomerInformationPanel` 对空 `avatarUrl` 使用 `avatarInitials` 显示默认头像。
- `CustomerInformationPanel` 对 `Regular Customer` 不渲染客户级别；`Priority Customer` 仍显示 `Priority`，其它非空客户类型继续显示原值。
- Customer Information 邮箱按钮改为图标 + 可换行文本结构，长邮箱可换行且邮箱图标保持固定尺寸。
- Webchat 的 `ChannelTag` 样式改为橙色系，与 Live Chat 客户列表 Webchat 图标保持一致。

本轮 Conversation 页签新增：

- `src/pages/inbound/components/ConversationWorkspace.tsx` 新增实时对话工作区，作为 Live Chat CRM 面板里的固定 `Conversation` tab 内容。
- `src/pages/inbound/components/CrmPanel.tsx` 支持在 `CRM` tab 右侧插入不可关闭的 `Conversation` tab；该 tab 仅在 Live Chat 传入 conversation 配置时出现。
- `src/pages/inbound/InteractionWorkspace.tsx` 支持传入 Live Chat conversation 配置，并在 Live Chat 默认选中 `Conversation` tab；PSTN / Voice Call 与 Video Call 仍默认选中 `CRM`。
- `src/pages/inbound/LiveChatPage.tsx` 新增会话消息、客户关闭和发送消息的前端演示状态；关闭当前客户后会从列表移除并切换到下一个可用客户。
- `src/types/inbound.ts` 新增 `LiveChatConversationMessage`，`LiveChatSession` 新增 `conversation` 字段。
- `src/mock/inbound.ts` 为 WhatsApp、BankApp、Webchat 三个 Live Chat 客户补充客户与历史坐席会话记录。
- `src/styles/index.less` 新增 Conversation 页签、消息气泡、发送框、结束服务确认和无会话空态样式。

本轮 Conversation 二次精简：

- 仅调整 `ConversationWorkspace.tsx` 与 `src/styles/index.less` 中 `.live-chat-conversation*` 相关样式。
- Conversation 顶部左侧展示客户姓名、无外框本地递增聊天计时和渠道标签；右侧展示无边框常规字重的 Transfer/Invite 文本按钮和红色叉号结束按钮。
- Transfer、Invite、End Service 从底部发送区移回顶部工具条；底部发送区只保留消息输入、表情、附件和 Send。
- 消息区改为气泡外上方显示时间：客户消息只显示时间；历史坐席消息显示坐席姓名和时间；当前坐席消息只显示时间，不再显示 `You`。
- 客户/历史坐席仍在左侧，当前坐席仍在右侧；历史坐席使用中性灰蓝交接记录样式，当前坐席使用浅 BANK 1 蓝气泡。
- 保留消息区自动滚动到底部的 DOM 同步，避免发送后的当前坐席消息被发送框遮挡或显示不完整。
- 本轮未修改客户列表、Customer Information、CRM 截图、Assistant、渠道筛选或其它 Conversation 以外 UI。

本轮 Conversation 顶部三次调整：

- 仅调整 `ConversationWorkspace.tsx` 的顶部工具条和 `src/styles/index.less` 中 Conversation header 相关样式，不修改中部消息区、底部发送区、客户列表、Customer Information、CRM 或 Assistant。
- 顶部左侧顺序改为“渠道图标 -> 客户姓名 -> 计时”。渠道图标复用客户列表同款 `live-chat-channel-icon` 与 WhatsApp / BankApp / Webchat modifier，只显示图标，鼠标悬浮和辅助读屏使用渠道名。
- 顶部右侧 `Transfer` / `Invite` 恢复 `SwapOutlined` / `UserAddOutlined` 图标，保持无边框、低强调、常规字重的 icon + text 按钮。
- 结束服务按钮由圆圈叉改为 `CloseOutlined` 单独叉号，尺寸放大、红色显示，不显示文字，并保留 `aria-label`、`title` 和二次确认弹窗。

本轮 Conversation 顶部视觉校准：

- 仅调整 `ConversationWorkspace.tsx` 顶部渠道图标 class，以及 `src/styles/index.less` 中 Conversation header actions / End Service 相关样式。
- Conversation 顶部渠道图标额外复用客户列表行同款 `live-chat-channel-icon--customer`，让图标尺寸和视觉重量与客户列表客户行保持一致；未新增或覆盖第二套渠道颜色。
- `Transfer` / `Invite` hover/focus 从局部硬编码 `#eef6ff` / `--aicc-primary-strong` 改为系统 token `--aicc-hover` / `--aicc-primary`，避免 hover 蓝色比 Conversation tab 选中态更重。
- End Service 叉号从 `18px` 调整为 `16px`，按钮盒统一回 `28px`，恢复浅红 hover/focus 背景块，确保与旁边两个操作图标对齐且保留危险操作语义。

本轮 Conversation Transfer 弹框组件化：

- `src/layouts/components/TransferModal.tsx` 增加 `variant?: 'call' | 'conversation'`，默认 `call`，确保话务条 Transfer 弹框保持三页签和原按钮不变。
- `conversation` 变体隐藏 `Transfer Number` tab，只显示 `Transfer Agent` 与 `Transfer Skill`。
- `Transfer Agent` 行操作在 conversation 变体中先实现为 `Request Transfer`、`Force Transfer`、`Request Invite`、`Force Invite`；后续已在 18:49 收纳为两个主操作加更多菜单。
- `ConversationWorkspace` 顶部 `Transfer` 按钮接入 `<TransferModal variant="conversation" />`；顶部 `Invite` 按钮本轮仍保持展示按钮。
- `src/styles/index.less` 增加 Transfer 行动作换行样式，避免四个动作按钮挤压表格。

本轮 Conversation Transfer Agent 操作收纳：

- `TransferModal` 的 `conversation` 变体新增专用 Agent 行动作：默认展示 `Request Transfer`、`Request Conference` 和下箭头，更多菜单提供 `Force Transfer`、`Force Conference`。
- Conversation Transfer 弹框内将邀请语义统一到 `Conference`，不再使用 `Request Invite` / `Force Invite`；话务条 `call` 变体仍保留原 `Consult` / `Transfer` / `Conference`。
- `Transfer Skill` 页签保持原搜索、表格和 `Transfer` 按钮；`Transfer Number` 仍只在话务条 call 变体中显示。
- `src/styles/index.less` 新增单行 `.aicc-transfer-agent-actions` 与小箭头按钮样式，避免 Agent 表格行因长按钮换行导致行高过大。

本轮 Conversation Invite 移除与话务条 Transfer 回归修复：

- Conversation 顶部右侧移除 `Invite` 按钮与 `UserAddOutlined` 引用，仅保留 `Transfer` 与 End Service 叉号。
- 修复话务条 `TransferModal` call 变体被 `.aicc-transfer-row-actions` 的 `wrap` 影响而出现三按钮换行的问题。
- 通用 `rowActions` 改回单行布局，call 变体 Action 列宽调整为可容纳 `Consult` / `Transfer` / `Conference` 三个按钮；conversation 变体继续使用专用收纳动作。

本轮 Live Chat 客户列表调整：

- `LiveChatPage` 新增渠道过滤状态，客户列表默认收起。
- `LiveChatCustomerList` 顶部改为 ALL、WhatsApp、BankApp、Webchat 四个图标筛选按钮，hover 显示文字；渠道支持多选，ALL 只有三渠道全选时高亮。
- 客户列表行由客户头像改为渠道图标，移除行内渠道 tag 与 High tag，降低列表高度。
- 收起态保持窄栏展示：上方为简洁箭头与 2x2 渠道筛选图标，下方保留渠道图标和未读数。
- 客户列表面板采用更蓝的浅 BANK 1 蓝色调，与右侧白色工作区拉开视觉层级；未选中的筛选图标置灰，选中后恢复渠道色。
- 普通客户行去掉背景色块，改为透明底与分隔线；只有 active 行使用白色背景强调当前会话。
- 顶部渠道筛选按钮取消外层边框和外层选中框，点击区域放大，状态只通过图标自身颜色与透明度表达。
- 顶部收起/展开按钮取消边框，默认弱化，面板 header 悬浮或按钮悬浮时才明显显示。
- ALL 筛选改为双态：全选时点击 ALL 会取消全部渠道，非全选时点击 ALL 会恢复全部渠道。
- 客户列表 active 行改为整行浅色选中，不再有左侧主色线或额外框；收起态客户列表列宽从 66px 收窄到 56px。
- 客户列表 active 行背景进一步调浅，并铺满整个客户列表面板宽度，不再受列表容器左右 padding 限制。
- 客户列表 hover 行与 selected 行背景再次调亮，选中和悬浮效果比上一版更浅白、更轻。
- 客户列表未读数 badge 去掉 Ant Design 默认白色外描边。
- Webchat 渠道图标改为橙色系，避免与 WhatsApp 绿色重复。
- `ChannelTag` 将 `Haloapps` / `Haloapps Video` 的可见标签显示为 `BankApp`，并对 `Haloapps` 使用 Mobile icon。
- Contact Management 面板中的 `Bankapp` 文案统一为 `BankApp`。

上一轮业务改动：

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
- Browser smoke check `/`：签入后出现不可关闭 `Live Chat` tab；默认客户列表为收起态，顶部可见 ALL、WhatsApp、BankApp、Webchat 图标筛选和展开箭头。
- Browser smoke check `/`：展开客户列表后，客户行显示渠道图标、未读数、客户名、时间和最后消息；不再显示行内渠道 tag 或 High tag。
- Browser smoke check `/`：点击 BankApp 筛选后仅显示 Sari Amelia，会同步更新 Customer Information，并确认 DOM 中不再出现 Haloapps 可见文案。
- Browser smoke check `/`：默认 ALL 与三个渠道均为高亮；取消 Webchat 后 ALL 取消高亮、Webchat 置灰且 Rafi 从列表消失；点击 ALL 后恢复全渠道高亮和完整列表。
- Browser visual check `/`：客户列表面板为更蓝的浅蓝色调，普通行透明底加分隔线，顶部筛选按钮无外层边框，收起按钮无边框且默认弱化。
- Browser smoke check `/`：点击 ALL 可取消全部渠道并显示空列表；再次点击 ALL 恢复全部渠道；收起态列宽更窄且仍可显示图标和未读数。
- Browser visual check `/`：active 客户行背景更浅，并横向铺满客户列表面板宽度。
- Browser visual check `/`：selected 行与 hover 行背景再次调亮，其它客户列表面板效果保持不变。
- Browser smoke/visual check `/`：Customer Information WhatsApp 客户显示新女生头像且保留 `Priority`；BankApp 与 Webchat 客户显示 `SA` / `RF` 默认头像并不显示客户级别。
- Browser smoke/visual check `/`：Customer Information 邮箱图标保持固定尺寸；BankApp/Webchat 邮箱在窄卡片内正常显示；Webchat 渠道标识为橙色系。
- Browser smoke check `/`：Live Chat 页面可签入并加载 Customer Information；邮箱按钮仍在 DOM 中作为可点击按钮呈现。
- Browser smoke check `/`：签入并打开 Live Chat 后，CRM 工作区默认选中固定 `Conversation` tab，tab 无关闭按钮。
- Browser smoke check `/`：展开客户列表并点击 Sari Amelia 后，Conversation 顶部客户名、历史会话和输入框均同步切换为 Sari Amelia。
- Browser smoke check `/`：在 Sari Amelia Conversation 中发送消息后，消息追加为 Current Agent，客户列表最后消息与时间同步更新。
- Browser smoke check `/`：点击 `End Service` 后出现二次确认框；确认后 Sari Amelia 从客户列表移除并自动切换到 Rafi Firmansyah。
- Browser smoke check `/`：Conversation 顶部左侧显示“WhatsApp 图标 -> Dimas Abimanyu Prabowo -> 计时”，渠道图标在 DOM 中具备 `WhatsApp` 可访问名称；右侧 Transfer/Invite 显示图标 + 文字，结束服务为 `CloseOutlined` 叉号按钮。
- Browser smoke check `/`：Conversation 顶部视觉校准后仍显示渠道图标、Transfer/Invite 图标与 End Service close 图标；End Service 点击仍打开确认弹窗。
- Browser smoke check `/`：Conversation 顶部 `Transfer` 打开弹框；弹框无 `Transfer Number` tab；Agent 行默认显示 `Request Transfer`、`Request Conference` 和更多下箭头，不再出现 `Request Invite`；下拉菜单显示 `Force Transfer`、`Force Conference`，点击动作后弹框关闭。
- Browser smoke check `/`：Conversation Transfer Skill tab 可见按钮仍为 `Transfer`，未显示 request/force Agent 动作。
- Browser smoke check `/`：PSTN / Voice Call 进入通话后，话务条 Transfer 弹框仍保留 `Transfer Agent`、`Transfer Skill`、`Transfer Number` 三页签，并保留同一行 `Consult`、`Transfer`、`Conference` 原动作。
- Browser smoke check `/`：Conversation 顶部 header 不再显示 `Invite`，仅保留 `Transfer` 与 End Service。
- Browser smoke check `/`：Conversation 消息时间位于气泡外上方；客户消息不再显示客户姓名或 `Customer` 字样；历史坐席显示姓名和时间；当前坐席不再显示 `You`。
- Browser smoke check `/`：End Service 点击后仍打开二次确认弹窗；本轮未确认关闭客户，以避免在顶部视觉复查时改变当前会话状态。
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
- 左侧菜单当前已有 `Channel Simulation > PSTN` 电话来电模拟入口；其他菜单仍主要负责展示和选中态，后续若新增页面，需要再明确路由、权限和菜单选中规则。
- `PSTN / Voice Call` 触发来电后仍保留既有 `autoAnswerSeconds` 自动接听倒计时；如演示需要必须手动 Answer，需另行停用自动接听。
- `Video Call` 当前为演示型弹屏和截图浮窗，不接真实 OpenEye 协议、不实现真实音视频能力。
- `Live Chat` 当前为演示型固定工作台与静态 mock 会话，不接真实 WhatsApp / BankApp / Webchat 消息网关，也不实现真实消息发送；默认空态，只有 BankApp / WhatsApp 客户侧入口会加入 active session，Webchat 暂时隐藏。
- Live Chat tab/list/header 的运行计时与 Customer Information 的静态渠道接入耗时是两类不同时间：前者从坐席接入后 `00:00` 开始，后者表示客户在渠道、排队和转坐席成功前的耗时。
- `BankApp Demo` 当前为客户侧前端模拟，不接真实 BankApp、真实消息网关、真实语音/视频协议或真实 AICC 路由服务。
- BankApp Voice / Video 触发仍依赖坐席处于 `Ready` 且当前话务为 `Idle`；如果坐席未签入、未 Ready 或已有通话，客户侧会显示已进入服务步骤但坐席侧不会打开新通话。
- BankApp 入口、业务选择、业务确认截图来自客户提供素材的脱敏重绘版本；明显未脱敏或旧版原始截图已迁出仓库目录，避免后续误提交；`voice-calling.png`、`voice-connected.png`、`video-connected-new.png`、`video-screen-sharing.png`、`openeye-share-selection.png`、`livechat-queue.png`、`livechat-chat.png`、`service-closed.png` 当前为项目内客户侧演示图片资源，其中 Voice Calling/Connected、Video Calling 复用图、Video connected、Video screen sharing、OpenEye share selection、Live Chat 排队/聊天和 Service Closed 均为用户附件原图或处理后附件，发布前仍需确认可分享性。
- WhatsApp Demo 当前 4 张截图来自用户本轮提供的脱敏附件并已落入 `public/screenshots/whatsapp/`；流程另包含一步 `View Agent Workspace`，会切到真实 Live Chat 坐席工作台；发布公开环境前仍需确认截图授权与脱敏口径。
- BankApp 演示触发 voice/video/livechat 坐席页时会先进入 `Agent Workspace` 步骤并激活对应 workspace tab；切回 BankApp Demo 后状态保持，再点击下一步显示客户侧 `Service Closed`。
- `Conversation` tab 的发送、Transfer、End Service 均为前端演示状态；Transfer 弹框 action 点击只关闭弹框，不接真实转移/会议流程；发送消息只存在于当前页面内存，刷新后恢复 mock 初始值。End Service 会关闭当前 active session，但不进入电话 ACW 或工单关闭流程。
- Live Chat 扩展为四列布局，当前客户列表默认收起；仍需在目标演示分辨率下复查展开态是否会压缩三栏内容。
- 当前仍只支持同一时间一路 active call；多通话 tab 解决的是旧弹屏保留和新呼叫新开 tab，不支持两路电话或视频同时通话。
- 关闭 Video Call tab 只隐藏 workspace 与 OpenEye 浮窗，不自动 Hang Up；Hang Up 会同步隐藏 OpenEye 浮窗。
- 菜单搜索当前只在展开态显示，收起菜单时会清空搜索条件，避免影响收起态图标列表。
- 收起态二级菜单浮层当前通过 CSS hover 打开，并通过 `closedFlyoutKey` 控制点击后关闭；如后续增加键盘导航，需要再补充键盘触发规则。
- 本轮已重新运行 `npm run lint` 和 `npm run build`，均通过；build 仍有 Vite chunk size warning。
- 当前项目没有自动化测试体系。
- 历史 build 出现过 Vite chunk size warning，但不影响运行。
- `codex-recovered-context.md` 是 UTF-8 中文文件，PowerShell 非 UTF-8 读取时可能显示乱码；应使用 `Get-Content -Raw -Encoding UTF8 codex-recovered-context.md`。
- `DEPLOY.md` 同样应按 UTF-8 读取。
- 不要继续投入时间修复 Codex sidebar/cache/sqlite/session_index，当前策略是把上下文落入项目文件。
- 本轮已使用 Browser smoke check 验证 `/` 的 BankApp 脱敏截图引用、三处渠道热区、右侧 Channel / Customer Type / 操作按钮同区展示、Completed 结束态、三渠道业务选择图、三渠道业务确认图、Guest Voice 号码录入图、Video connected 原附件图片页、OpenEye 桌面共享按钮、选择共享程序截图、确认后回到 BankApp 共享画面、Live Chat 客户信息条件步骤、Live Chat 排队/聊天原附件图片页、三渠道 `Agent Workspace` 切换与返回保活、三渠道 `Service Closed` 满意度评价图片页、BankApp voice/video/livechat 坐席渠道显示、WhatsApp 第四步 `Netinfo` badge 和 `/design-system` 正常加载。

## 12. TODO

P0：

- 在目标演示分辨率下复查 BankApp / WhatsApp Demo 统一画布布局和顶部减负效果，确认手机区和 AICC Process 区在领导评审屏幕上足够像同一个客户接入演示内容，且没有文本挤压或重叠。
- 在目标演示分辨率下复查 BankApp / WhatsApp Demo 右侧同一行控制条，确认 Channel、Customer Type、Next/Reset 和 Completed 状态不换行到难以扫描。
- 在目标演示分辨率下复查 BankApp Demo 三渠道 `Agent Workspace` 步骤：Voice/Video/Live Chat 切到坐席页、切回保活、再下一步进入 `Service Closed`。
- 在目标演示分辨率下复查 WhatsApp Demo 五步流程：四张截图不裁切关键内容，第三步后切到 Live Chat，切回 WhatsApp Demo 后状态不刷新。
- 在目标演示分辨率下复查三张直接使用的客户侧附件图：`livechat-queue.png`、`livechat-chat.png`、`service-closed.png`，确认在手机框内不裁切关键内容。
- 在目标演示分辨率下复查 `video-connected-new.png` 附件原图，确认在手机框内不裁切通话按钮和右上角小窗。
- 在目标演示分辨率下复查 BankApp Video 桌面共享新增步骤，确认 OpenEye `桌面共享` 按钮、选择共享程序截图和 BankApp 客户侧共享画面与演示附件视觉一致。
- 在目标演示分辨率下复查 Live Chat 默认收起态、展开态与渠道过滤交互，确认客户列表不会让 Customer Information、CRM、Assistant 三栏不可用。
- 在目标演示分辨率下复查 Conversation tab 的顶部轻量操作区、历史消息区和发送框，确认不会压缩 CRM/Assistant 三栏到不可用。
- 在目标演示分辨率下复查客户远程演示路径：Sign In 空 Live Chat、PSTN 红/黄/绿状态点、BankApp/WhatsApp 文字接入与 End Service 回空态。
- 在目标演示分辨率下复查 v0.6.0 多通话 tab：旧 ended tab 保留登记、新 PSTN/BankApp Voice/BankApp Video 新开 tab、active tab 不可关闭、ended tab 可关闭。
- 在目标演示分辨率下复查左侧菜单展开态是否不会压缩 Inbound 三栏到不可用宽度。
- 确认 Video Call 演示是否接受“关闭 tab 不自动 Hang Up”的行为；如需关闭页签即挂断，后续应统一调整 tab 与话务状态机关系。
- 重新打开浏览器后检查 `/` 主 Workspace 是否恢复蓝色渐变 Header、旧版背景、Customer Information 卡片和话务条风格。
- 重新打开浏览器后检查 CRM/Assistant 区域是否完整等比显示客户截图，而不是 fallback、裁切或变形。
- 确认 Inbound 三栏布局在目标演示分辨率下不溢出。
- 确认 Ticketing / Next Best Action / Quick Action 能正确打开和关闭 CRM 动态 tab。
- 确认 Contact Management 弹窗相关入口和数据状态。
- 若客户后续要求 Webchat 接入，再新增 Webchat 客户侧入口并把 Webchat mock session 加回 active session 与筛选项。

P1：

- 确认最终语言策略：全英文、全印尼语，或英文 UI + 印尼语业务数据。
- 明确顶部是否还需要独立会议/协作入口；当前 Conversation header 已移除 `Invite`，Transfer 弹框内已统一使用 `Conference` 语义。
- 如后续重新处理 Modal/Dialog，必须先明确新的设计方向，避免再次影响主 Workspace 视觉体系。
- 如演示必须使用真实系统图，补充已脱敏 BANK 1 CRM/Assistant 截图，再恢复图片加载策略。
- `v0.6.0` 完成后 push `codex/multi-inbound-interaction-tabs`，合入 `main`，打 tag `v0.6.0`，并确认 Vercel production 绑定的 `main` 可用于客户演示。

P2：

- 后续新增 Online Chat、Video Call、Dashboard、Admin、Supervisor 页面时复用已恢复的主 Workspace 视觉体系。
- 考虑补充 Playwright smoke test。
- 如客户后续要求真正多路同时通话，需要在 `v0.6.x` 或新主版本中进一步拆分话务条状态机；当前 `v0.6.0` 仍保持单 active call。
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


