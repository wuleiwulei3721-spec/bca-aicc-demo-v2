# BANK 1 AICC Demo V2 - 长期开发上下文

最后更新：2026-05-23 19:40 +08:00
项目路径：`D:\03projects\bca-aicc-demo-v2`  
当前目标：`codex/video-screenshare-demo` 已实现 `v0.4.0` Video / BankApp Video 桌面共享演示，并补齐 GitHub CI；后续 `v0.5.0` 等待客户话务条和电话弹屏优化内容。

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
当前分支：`codex/video-screenshare-demo`
当前 HEAD：以 `git rev-parse HEAD` 为准；该分支用于 BankApp 客户接入演示集成，未合并或发布到 `main`
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
- `src/pages/AgentWorkspace.tsx`：Home tab 与 Inbound tab 容器。
- `src/pages/bankapp/BankAppDemoPage.tsx`：BankApp 客户侧模拟器，采用真实手机比例的客户端舞台和轻量 AICC Process rail，坐席侧结果通过真实 workspace tab 跳转体现。
- `src/pages/inbound/InteractionWorkspace.tsx`：电话与视频弹屏共用的三栏工作台。
- `src/pages/inbound/InboundPage.tsx`：PSTN / Voice Call 电话弹屏 wrapper。
- `src/pages/inbound/VideoCallPage.tsx`：Video Call 弹屏 wrapper，复用三栏工作台并叠加 OpenEye 浮窗。
- `src/pages/inbound/LiveChatPage.tsx`：Live Chat 固定页签页面，复用三栏工作台并增加文字聊天客户列表。
- `src/pages/inbound/components/LiveChatCustomerList.tsx`：WhatsApp / BankApp / Webchat 客户聊天列表，默认收起，支持 ALL 与渠道图标筛选，可收起展开。
- `src/pages/DesignSystem.tsx`：设计系统展示页。
- `src/store/appStore.ts`：workspace tab、BankApp demo tab、WhatsApp demo tab、Live Chat 聚焦、inbound popup 和 demo-only screen share 全局状态。
- `src/mock/bankapp.ts`：BankApp 联系方式、业务类型、客户身份/语言驱动的技能路由和截图素材路径配置。
- `src/mock/inbound.ts`：Inbound 演示数据。
- `src/types/bankapp.ts`：BankApp demo 联系方式、业务类型和步骤类型。
- `src/types/inbound.ts`：Inbound 业务类型。
- `src/styles/index.less`：全局样式与页面样式主文件。
- `.github/workflows/ci.yml`：GitHub Actions 最小 CI，PR 到 `main` 或 push 到 `main` / `codex/**` 时运行 `npm ci`、`npm run lint`、`npm run build`。

## 4. 路由与页面关系

当前路由：

- `/` -> `BasicLayout` -> `AgentWorkspace`
- `/design-system` -> `BasicLayout` -> `DesignSystem`
- `*` -> 重定向到 `/`

页面关系：

- `BasicLayout` 是所有页面的壳，包含顶部 Header、坐席状态、话务工具条、侧栏和内容区。
- `AgentWorkspace` 默认显示 Home tab。
- 点击左侧 `Channel Simulation > BankApp` 会打开可关闭的 `BankApp Demo` tab，用于演示客户在 BankApp 内选择文字、语音或视频服务后进入 AICC。
- 点击左侧 `Channel Simulation > WhatsApp` 会打开可关闭的 `WhatsApp Demo` tab，初版复用 BankApp 客户侧流程壳并默认聚焦 WhatsApp Live Chat 会话。
- 坐席点击右上角 `Sign In` 后，`Live Chat` tab 会固定插入 Home tab 旁边，`closable: false`，用于承载实时文字聊天工作台。
- 当坐席处于 Ready 且无通话时，点击左侧 `Channel Simulation > PSTN` 进入 Incoming 并打开电话弹屏 tab。
- `Video Call` 与 `Live Chat` 已从左侧可见菜单移除；底层 workspace、store 和页面能力保留，供 BankApp Video、WhatsApp/BankApp chat 和后续调试复用。
- `requestInboundPopup(source?, activate?)` 会打开 Inbound tab；`activate` 默认为 `true`，BankApp 演示可传 `false` 在后台准备电话弹屏但保持 BankApp Demo 当前激活页。
- `requestInboundPopup('bankapp-voice')` 会打开 Inbound tab，并以 BankApp 客户资料展示语音接入。
- `requestVideoCallPopup(source?, activate?)` 会打开 Video Call tab；`activate` 默认为 `true`，BankApp 演示可传 `false` 在后台准备视频弹屏但保持 BankApp Demo 当前激活页。
- `isScreenShareActive` 表示 demo-only 桌面共享状态；BankApp Video connected 页可开启/停止，Video Call 的 OpenEye 浮窗会同步显示共享预览；Hang Up、关闭 Video Call tab、新普通视频呼叫、Reset BankApp Demo 会清理该状态。
- `requestLiveChatWorkspace(sessionId?, activate?)` 会打开固定 Live Chat tab；传入 BankApp 会话 id 时会聚焦对应客户，`activate` 默认为 `true`，BankApp 演示可传 `false` 在后台准备文字坐席页，`setLiveChatTabOpen(false)` 会在签出时移除该 tab。
- Inbound tab 可关闭，关闭后回到 Home tab。
- Live Chat tab 不可关闭，签出后自动从 workspace tabs 移除。
- Video Call tab 可关闭，关闭后隐藏 OpenEye 独立客户端截图浮窗。
- `/design-system` 独立展示设计规范与基础组件，不参与通话流程。

## 5. 全局布局与状态机

`BasicLayout` 当前包含：

- 顶部蓝色渐变 BANK 1 Header，恢复旧版主工作台视觉。
- 可展开/收起左侧系统菜单，默认收起，`collapsedWidth` 为 `48px`，展开宽度使用 `--aicc-layout-sider-width`。
- 左侧菜单支持 2 层级：展开态顶部显示折叠按钮与菜单搜索框，点击一级菜单在下方展开二级菜单；收起态仅显示一级图标，鼠标悬浮在一级图标时在右侧显示二级菜单浮层，鼠标移出浮层或点击菜单后浮层关闭。
- 当前侧栏菜单使用英文企业呼叫中心文案：Channel Simulation（PSTN、BankApp、WhatsApp）、Agent Center（Agent Profile、Service History）、Operations（Alert KPI Management、Floor Management）、Call Management、Reports。
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
- Ready + Idle 时点击 `Channel Simulation > PSTN` 可触发电话弹屏。
- BankApp Demo 的 `Livechat` 路径会打开 Live Chat 并聚焦 BankApp 客户；`Voice Call` / `Video Call` 路径通过 store request id 触发现有坐席话务状态机。
- WhatsApp Demo 默认走 Live Chat 路径并聚焦 WhatsApp 客户 `live-chat-001`；已签入后仍可通过固定 Live Chat tab 承载会话工作台。
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
- 客户列表默认收起；展开后顶部显示 ALL、WhatsApp、BankApp、Webchat 四个图标筛选按钮，hover 显示渠道名；渠道为多选，ALL 代表三渠道全选。
- 客户列表行用渠道图标替代客户头像，并移除行内渠道 tag 与 High 优先级 tag，以降低列表行高度。
- 客户列表支持收起/展开；收起后保留渠道图标与未读数，右侧仍保持 Customer Information、CRM、Assistant 三栏。
- 切换客户后，Customer Information 的客户姓名、渠道、时长、验证状态会随选中聊天会话更新。
- Live Chat 的 CRM 工作区在 `CRM` 右侧新增固定不可关闭 `Conversation` tab，默认进入 Live Chat 时选中 Conversation。
- `Conversation` tab 顶部为浅色工具头，左侧按“渠道图标 -> 客户姓名 -> 无外框聊天计时”排列；渠道图标复用客户列表行 `live-chat-channel-icon--customer` 视觉重量，只显示图形，`title` / `aria-label` 显示渠道名；右侧仅显示轻量 `Transfer` 图标 + 文案，以及与相邻图标对齐的红色叉号结束按钮。
- 点击 `Conversation` 顶部 `Transfer` 会打开复用的 Transfer 弹框 conversation 变体：仅有 `Transfer Agent` / `Transfer Skill`；Agent 行默认显示 `Request Transfer`、`Request Conference` 和更多下箭头；下拉菜单提供 `Force Transfer`、`Force Conference`；Skill tab 保持话务条原 `Transfer` 动作。
- 点击 `End Service` 会打开二次确认框，确认后从当前 Live Chat 客户列表关闭该客户，并自动切到下一个可用客户。
- `Conversation` tab 不再使用内部深色 header；中部和底部发送区沿用现有浅色 workspace surface，仅通过边线区分层级。
- `Conversation` tab 中部展示客户、历史坐席和当前坐席的文字会话记录；切换左侧客户列表时聊天内容同步切换。消息时间移到气泡外上方；客户消息左侧只显示头像、时间和内容，不展示客户姓名或 `Customer` 字样；历史坐席消息左侧显示中性灰蓝气泡、坐席姓名和时间，不再展示 `Previous Agent`；当前坐席消息右侧只显示时间和浅 BANK 1 蓝气泡，不展示 `You`。
- `Conversation` tab 下方提供发送信息框，底部只保留表情、文件和 Send；发送区内部不再使用额外线框分割。发送后会在当前会话追加当前坐席消息，并更新客户列表最后消息。
- Live Chat WhatsApp 客户使用本地生成的女生头像；BankApp 与 Webchat 客户按未上传头像处理，显示姓名首字母默认头像。
- Customer Information 中 `Regular Customer` 不显示客户级别 badge，`Priority Customer` 仍显示为 `Priority`。
- Customer Information 邮箱行允许长邮箱换行，邮箱图标不再被压缩。
- Customer Information 邮箱 hover/focus 时会高亮并下划线提示可点击。
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
- PSTN / Voice Call 菜单点击触发电话来电逻辑。
- Video Call 菜单点击触发视频来电 tab，复用电话弹屏三栏内容。
- BankApp Demo 的入口、业务选择、业务确认截图已切换为脱敏版本：渠道选择、游客号码输入、客户信息录入、三渠道业务选择和三渠道业务确认均保留手机截图比例和大概样式，但只显示 BANK 1 或通用业务内容；Video connected 直接使用用户提供的视频通话截图原图 `video-connected.png`；Live Chat 排队与聊天直接使用用户提供且已处理的 `livechat-queue.png` / `livechat-chat.png` 原附件；Voice / Video / Live Chat 最终 `Service Closed` 均使用用户提供的满意度评价截图 `service-closed.png`；步骤标题和 AICC Process rail 已按开发责任增加 `BANK1` / `Netinfo` 标识。
- 左侧菜单已调整为 `Channel Simulation > PSTN / BankApp / WhatsApp`；旧可见 `Video Call` 和 `Live Chat` 入口已移除，底层能力保留。
- 新增 `WhatsApp Demo` workspace tab，复用 BankApp 客户侧流程壳，默认 Live Chat 渠道并聚焦 WhatsApp mock 会话。
- 新增 Video / BankApp Video 桌面共享演示状态：BankApp Video connected 页可 Start/Stop screen share，坐席侧 OpenEye 浮窗显示共享中的桌面预览层。
- 新增 GitHub Actions CI，覆盖 PR 到 `main` 和 push 到 `main` / `codex/**` 的 lint/build 验证。
- BankApp Live Chat 路径可打开 Live Chat 并自动选中 BankApp 客户 Sari Amelia；Registered Customer 跳过个人信息页，Guest 才进入个人信息录入。
- BankApp Voice Call 路径可触发 `Incoming` 并打开 Inbound tab，Customer Information 渠道图标为 BankApp 移动端图标，文字显示 `BankApp`。
- BankApp Video Call 路径可触发 Video Call tab，Customer Information 渠道图标为 BankApp 移动端图标，文字显示 `BankApp`；普通 Channel Simulation 的 Video Call 仍显示 `Video Call` 渠道。
- Sign In 后自动显示固定不可关闭 Live Chat tab。
- Live Chat 页面复用 `InteractionWorkspace`，新增默认收起的客户文字聊天列表，支持 ALL、WhatsApp、BankApp、Webchat 图标筛选和会话切换。
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

截至 2026-05-23 19:39 +08:00，`main` 已本地快进到 `v0.3.1`，当前工作在 `codex/video-screenshare-demo` 分支实现 `v0.4.0` Video screen share。远端推送与 GitHub PR 仍需在本轮最终验证后执行。

本轮 BankApp 客户接入演示状态：

- `Customer Simulator > BankApp` 左侧菜单入口和可关闭 `BankApp Demo` workspace tab。
- `BankAppDemoPage` 已从三栏信息面板简化为“Customer BankApp 手机主导 + AICC Process rail 联动”的演示舞台。
- 手机模拟器按客户截图比例显示，并改为按面板高度放大，基本撑满左侧手机展示区；BankApp 页面顶部标题条已删除。
- 顶部控制区已取消；`Customer Type`、`Next Step`、`Reset` 移入 `AICC Process` 面板同一行；`Language` 控制已去除。
- 独立 `Agent Desktop Outcome` 大面板已移除；坐席侧结果通过真实 `PSTN / Voice Call`、`Video Call`、`Live Chat / Conversation` workspace tab 跳转体现。
- BankApp 手机当前步骤标题和右侧 AICC Process rail 的每个步骤都显示开发方 badge：`Choose Channel`、`Input Phone Number`、`Personal Information`、`Service Closed` 显示 `BANK1`；`Select Business`、`Confirm Business`、`Calling Agent`、`Connected`、`Chat Page` 显示 `Netinfo`。
- BankApp demo 状态类型与 mock：`customerType`、`language`、联系方式 `voice | video | livechat`、业务类型 `mobile-login | card-issue | transaction-dispute | account-info`、演示步骤和动态技能组。
- 渠道选择页引用脱敏图 `channel-selection-sanitized.png`，页面内只保留 `Voice Call`、`Video Call`、`Live Chat` 三个清晰入口且入口文字已放大，其它客户系统特征弱化；Voice/Video/Livechat 通过重新校准后的透明热区点击进入流程。
- 游客号码输入页使用脱敏图 `voice-phone-number-sanitized.png`；客户信息录入页使用脱敏图 `text-login-sanitized.png`。
- `Select Business` 页面按渠道引用三张脱敏图：`voice-business-selection-sanitized.png`、`video-business-selection-sanitized.png`、`livechat-business-selection-sanitized.png`，并保留透明业务热区。
- `Confirm Business` 页面按渠道引用三张脱敏图：`voice-business-confirm-sanitized.png`、`video-business-confirm-sanitized.png`、`livechat-business-confirm-sanitized.png`，并保留 No / Yes 透明热区。
- Video connected 步骤引用 `public/screenshots/bankapp/video-connected.png`，该文件已替换为用户本轮提供的视频通话截图原图，不绘制、不脱敏。
- Live Chat 的 `Connecting to Agent` / 排队步骤直接引用用户已处理附件 `public/screenshots/bankapp/livechat-queue.png`，`Chat Page` 步骤直接引用用户已处理附件 `public/screenshots/bankapp/livechat-chat.png`，不再绘制或二次脱敏。
- Voice 的 `Calling Agent` 继续由前端组件生成；Voice / Video / Live Chat 的最后一步 `Service Closed` 统一引用用户提供的满意度评价附件 `public/screenshots/bankapp/service-closed.png`。
- Live Chat 路径联动 `requestLiveChatWorkspace('live-chat-002', false)`，后台打开 Live Chat 并聚焦 BankApp 客户，同时 BankApp Demo 保持当前激活页以继续展示 `Service Closed`；Registered Customer 直接进入业务选择，Guest 才显示 `Personal Information`。
- Voice Call 路径通过 `bankAppVoiceCallRequestId` 触发现有语音话务状态机，Inbound 使用 `bankAppVoiceCustomer` 和 `BankApp` 渠道展示；BankApp 演示路径会在后台打开电话弹屏，不抢走 BankApp 手机最终评价页。
- Video Call 路径通过 `bankAppVideoCallRequestId` 触发现有视频话务状态机，Video Call workspace 使用 `bankAppVideoCustomer` 和 `BankApp` 渠道展示；BankApp 演示路径会在后台打开视频弹屏，不抢走 BankApp 手机最终评价页；普通 Channel Simulation 的 Video Call 使用独立 `standard` 来源和 `Video Call` 渠道展示。
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
- Browser smoke check `/`：Video Call 的 `Connected` 步骤引用 `/screenshots/bankapp/video-connected.png`。
- Local image check：`public/screenshots/bankapp/video-connected.png` 已确认是用户本轮提供的视频通话截图原图。
- Browser smoke check `/`：BankApp Video 进入 `Connected` 后可见 `img[alt="BankApp connected video call"][src*="video-connected.png"]`，页面仍停留在 BankApp Demo。
- Browser smoke check `/`：步骤标题和 AICC Process rail 显示开发方 badge；Registered Voice 中 `Choose Channel` / `Service Closed` 为 `BANK1`，`Select Business` / `Confirm Business` / `Calling Agent` / `Connected` 为 `Netinfo`。
- Browser smoke check `/`：Guest Voice 中 `Input Phone Number` 为 `BANK1`；Guest Live Chat 中 `Personal Information` 为 `BANK1`。
- Browser smoke check `/`：Livechat 的 `Connecting to Agent` 步骤引用 `/screenshots/bankapp/livechat-queue.png`。
- Browser smoke check `/`：Livechat 的 `Chat Page` 步骤引用 `/screenshots/bankapp/livechat-chat.png`。
- Browser smoke check `/`：Voice / Video / Livechat 三条渠道点击 `Next Step` 后都可进入 `Service Closed`，并引用 `/screenshots/bankapp/service-closed.png`。
- Browser smoke check `/`：BankApp voice/video/livechat 触发坐席工作台时保持 `BankApp Demo` 当前页可见，便于展示客户侧满意度评价终态。
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
- 左侧菜单当前已有 `PSTN / Voice Call` 电话来电模拟入口；其他菜单仍主要负责展示和选中态，后续若新增页面，需要再明确路由、权限和菜单选中规则。
- `PSTN / Voice Call` 触发来电后仍保留既有 `autoAnswerSeconds` 自动接听倒计时；如演示需要必须手动 Answer，需另行停用自动接听。
- `Video Call` 当前为演示型弹屏和截图浮窗，不接真实 OpenEye 协议、不实现真实音视频能力。
- `Live Chat` 当前为演示型固定工作台与静态 mock 会话，不接真实 WhatsApp / BankApp / Webchat 消息网关，也不实现真实消息发送。
- `BankApp Demo` 当前为客户侧前端模拟，不接真实 BankApp、真实消息网关、真实语音/视频协议或真实 AICC 路由服务。
- BankApp Voice / Video 触发仍依赖坐席处于 `Ready` 且当前话务为 `Idle`；如果坐席未签入、未 Ready 或已有通话，客户侧会显示已进入服务步骤但坐席侧不会打开新通话。
- BankApp 入口、业务选择、业务确认截图来自客户提供素材的脱敏重绘版本；明显未脱敏或旧版原始截图已迁出仓库目录，避免后续误提交；`video-connected.png`、`livechat-queue.png`、`livechat-chat.png`、`service-closed.png` 当前为项目内客户侧演示图片资源，其中 Video connected、Live Chat 排队/聊天和 Service Closed 均为用户附件原图或处理后附件，发布前仍需确认可分享性。
- BankApp 演示触发 voice/video/livechat 坐席页时会后台打开对应 workspace tab，并保持当前 BankApp Demo 激活页显示客户侧 `Service Closed`；这是为了演示客户侧完整闭环，不代表真实系统不会切换坐席工作台。
- `Conversation` tab 的发送、Transfer、End Service 均为前端演示状态；Transfer 弹框 action 点击只关闭弹框，不接真实转移/会议流程；发送消息只存在于当前页面内存，刷新后恢复 mock 初始值。
- Live Chat 扩展为四列布局，当前客户列表默认收起；仍需在目标演示分辨率下复查展开态是否会压缩三栏内容。
- 关闭 Video Call tab 只隐藏 workspace 与 OpenEye 浮窗，不自动 Hang Up；Hang Up 会同步隐藏 OpenEye 浮窗。
- 菜单搜索当前只在展开态显示，收起菜单时会清空搜索条件，避免影响收起态图标列表。
- 收起态二级菜单浮层当前通过 CSS hover 打开，并通过 `closedFlyoutKey` 控制点击后关闭；如后续增加键盘导航，需要再补充键盘触发规则。
- 本轮已重新运行 `npm run lint` 和 `npm run build`，均通过；build 仍有 Vite chunk size warning。
- 当前项目没有自动化测试体系。
- 历史 build 出现过 Vite chunk size warning，但不影响运行。
- `codex-recovered-context.md` 是 UTF-8 中文文件，PowerShell 非 UTF-8 读取时可能显示乱码；应使用 `Get-Content -Raw -Encoding UTF8 codex-recovered-context.md`。
- `DEPLOY.md` 同样应按 UTF-8 读取。
- 不要继续投入时间修复 Codex sidebar/cache/sqlite/session_index，当前策略是把上下文落入项目文件。
- 本轮已使用 Browser smoke check 验证 `/` 的 BankApp 脱敏截图引用、三处渠道热区、三渠道业务选择图、三渠道业务确认图、Guest Voice 号码录入图、Video connected 原附件图片页、Live Chat 客户信息条件步骤、Live Chat 排队/聊天原附件图片页、三渠道 `Service Closed` 满意度评价图片页、BankApp voice/video 坐席渠道显示和 `/design-system` 正常加载。

## 12. TODO

P0：

- 在目标演示分辨率下复查 BankApp Demo 手机模拟器与 AICC Process 两块布局，确认左侧手机高度、右侧步骤 rail 和控制按钮不压缩或重叠。
- 在目标演示分辨率下复查三张直接使用的客户侧附件图：`livechat-queue.png`、`livechat-chat.png`、`service-closed.png`，确认在手机框内不裁切关键内容。
- 在目标演示分辨率下复查 `video-connected.png` 附件原图，确认在手机框内不裁切通话按钮和右上角小窗。
- 在目标演示分辨率下复查 Live Chat 默认收起态、展开态与渠道过滤交互，确认客户列表不会让 Customer Information、CRM、Assistant 三栏不可用。
- 在目标演示分辨率下复查 Conversation tab 的顶部轻量操作区、历史消息区和发送框，确认不会压缩 CRM/Assistant 三栏到不可用。
- 在目标演示分辨率下复查左侧菜单展开态是否不会压缩 Inbound 三栏到不可用宽度。
- 确认 Video Call 演示是否接受“关闭 tab 不自动 Hang Up”的行为；如需关闭页签即挂断，后续应统一调整 tab 与话务状态机关系。
- 重新打开浏览器后检查 `/` 主 Workspace 是否恢复蓝色渐变 Header、旧版背景、Customer Information 卡片和话务条风格。
- 重新打开浏览器后检查 CRM/Assistant 区域是否完整等比显示客户截图，而不是 fallback、裁切或变形。
- 确认 Inbound 三栏布局在目标演示分辨率下不溢出。
- 确认 Ticketing / Next Best Action / Quick Action 能正确打开和关闭 CRM 动态 tab。
- 确认 Contact Management 弹窗相关入口和数据状态。
- 确认 `End Service` 关闭客户后的业务口径：是否只关闭文字会话，还是还需要同步 ACW / 工单 / 坐席状态。

P1：

- 确认最终语言策略：全英文、全印尼语，或英文 UI + 印尼语业务数据。
- 明确顶部是否还需要独立会议/协作入口；当前 Conversation header 已移除 `Invite`，Transfer 弹框内已统一使用 `Conference` 语义。
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


