# BANK 1 AICC Demo V2 - 长期开发上下文

最后更新：2026-06-09 11:50 +08:00
项目路径：`D:\03projects\bca-aicc-demo-v2`  
当前目标：在 `main` 上完善客户可见 Call Management、坐席 AUX 体验与登录/签入演示链路；Customer Verification Assist 已按 `Verification Channel Type + Business Type` 加载规则和题库，并加入 BankApp/HaloApp PIN 验证演示链路；本轮根据客户反馈恢复右上角 AUX 直接下拉选择，新增客户可见 `Busy Reason Management`，将 AUX 下拉调整为分类标题 + 纯文字原因项，新增 `/login`、demo LDAP auth、登录后媒体技能签入选择，已把系统级 `Log Out` 拆成右上角独立红色电源按钮并调小到与状态下拉按钮同尺寸，登录页左侧图改为本地视觉资产，BANK 1 固定到页面左上角，登录账号/密码口径改为 `888888 / 888888`，验证码改为 6 位且点击验证码本身刷新，并简化 Transfer / Outbound 弹框坐席状态展示。

本轮已完成：PSTN、BankApp Voice 等 Customer Information 的 `Verify` 弹窗可根据渠道类型和启用业务类型动态加载规则；坐席可切换本次业务类型并重置答题进度；`Correct / Wrong / Skip` 会按一次验证会话累计结果，必问题计入总答对数，`Skip` 不计错也不计对，错答达到规则上限后失败。弹窗已简化为坐席操作优先的紧凑版，不展示标准答案或答案来源；坐席误点后可直接改同一题状态，不需要重新问或重置整次验证。规则区进一步收敛为 `Need N correct` 加 Mandatory / Dynamic / Static 等彩色达成块，顶部不再显示长统计串。BankApp/HaloApp 入口支持 `Send PIN Verification`，客户侧 BankApp Demo 自动弹出 4 位 PIN 页面并在提交后把坐席侧渠道类型切为 `HaloApp Registered` 规则。`Call Management` 已开放客户可见入口，包含 `Verification Rules`、`Text Channel Settings` 与 `Busy Reason Management`；AUX 已从弹窗确认恢复为头像菜单直接下拉，启用原因按客户截图原文显示，菜单中 `AUX` 只作为不可点击分类标题，原因项不维护也不显示独立图标。登录页已按 BANK 1 mock 风格新增：demo 账号和密码均为 `888888`、EXT 可选、随机 6 位 PIN/captcha；点击验证码图片本身会刷新验证码，不再显示独立刷新按钮；登录成功进入工作台但坐席仍为 `Unsigned`，右上角下拉以 `Sign In` 分组选择 `Voice only`、`Digital only` 或 `Voice + Digital`，并按所选模式轻量拦截不匹配的 voice/video 或 live chat handoff；系统级 `Log Out` 已移到头像状态下拉右侧的红色电源按钮，按钮尺寸与下拉按钮一致；登录页左侧插画已改为 `/screenshots/login-illustration.svg` 本地图片资源，BANK 1 固定在页面左上角。Transfer / Outbound 弹框中的 Agent tab 已去掉 Status 查询条件，坐席列表 Status 统一展示为 `Ready`。

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
当前分支：`main`
当前 HEAD：以 `git rev-parse HEAD` 为准；当前客户 Production 口径保留：登录页、主工作台、Channel Simulation、BankApp、WhatsApp、PSTN、Voice/Video handoff、正式 Live Chat、Call Management 下的验证规则/文字渠道配置/示忙原因管理和 Design System 可用；`Routing Config` 菜单及其直达 URL 继续屏蔽。本轮新增客户身份验证动态题库、BankApp/HaloApp PIN 演示能力、Call Management 的验证规则与示忙原因前端配置页，以及 demo LDAP 登录与媒体技能签入选择。
部署目标：Vercel Production 静态部署，产物目录 `dist`  
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
- Dayjs `1.11.21`
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
- `src/routes.tsx`：定义 `/login` 公共登录页；`/`、`/design-system`、`/call-management/verification-rules`、`/call-management/text-channel-settings`、`/call-management/busy-reasons` 等业务路由通过 auth guard 保护；`/routing-config/*` 继续重定向回 `/`。
- `src/components/AuthRouteGuards.tsx`：公共登录路由与业务路由认证守卫；未登录访问业务路由重定向 `/login`，已登录访问 `/login` 重定向 `/`。
- `src/layouts/BasicLayout.tsx`：全局 Header、可展开/收起左侧菜单、坐席工具条、通话接入阻塞顶部提示、内部聊天入口和主内容出口。
- `src/pages/LoginPage.tsx`：BANK 1 登录页，包含 User Name、Password、EXT、PIN/captcha 和 demo LDAP 错误提示；成功后写入 auth session 并进入 `/`；左侧视觉使用 `/screenshots/login-illustration.svg` 本地资源，BANK 1 logo 固定在页面左上角。
- `src/pages/AgentWorkspace.tsx`：Home tab 与工作区交互 tab 容器，负责 Demo tabs、正式 `Live Chat` 固定 tab、多个 PSTN / Voice Call / Video Call 通话实例 tab 的页签名称、最长服务计时、短闪提示和 Live Chat 总未读 badge。
- `src/pages/bankapp/BankAppDemoPage.tsx`：BankApp 客户侧模拟器，采用真实手机比例的客户端舞台和轻量 AICC Process rail；Voice / Video handoff 会在已有未挂断通话时显示 inline warning，坐席侧结果通过真实 workspace tab 跳转体现；本轮新增坐席触发的 4 位 PIN 输入页和 PIN verified 状态展示。
- `src/pages/inbound/InteractionWorkspace.tsx`：电话、视频与 Live Chat 弹屏共用的三栏工作台；维护当前工作台实例内的客户身份刷新展示数据，刷新成功后只更新当前实例的 Customer Information、Customer Journey 与 Ticketing History，不写入全局 store；支持由弹屏 wrapper 显式传入 `showIvrJourney`，控制客户卡片 `Menu` 最后菜单提示与 Call Flow Detail 的 IVR Journey 展示。
- `src/pages/inbound/InboundPage.tsx`：PSTN / Voice Call 电话弹屏 wrapper；PSTN 初始使用未识别客户和空 Journey / Ticketing，BankApp Voice 保持已识别客户。
- `src/pages/inbound/VideoCallPage.tsx`：Video Call 弹屏 wrapper，复用三栏工作台并叠加 OpenEye 浮窗。
- `src/pages/inbound/LiveChatPage.tsx`：旧版 Live Chat 页面源码，当前不再作为正式 tab 渲染，保留作回滚参考。
- `src/pages/inbound/LiveChat2Page.tsx`：正式 `Live Chat` 弹屏页面，继续使用 `liveChat2*` store、mock 和组件实现客户列表、Conversation、Message Record 与 Quick Replies；Customer Information 使用 `activeSession.customer.accessDuration` 的静态接入耗时，不再用服务中 `elapsedSeconds` 覆盖；Current 与 History 视图各自选择客户，Current 清空时显示当前无客户空态，不再自动展示 History 客户。
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`：正式 `Live Chat` 客户列表，包含收起/展开、渠道筛选、排序、Current/History 文字 tab、未读、未回复计时、星标和关闭结束会话；客户行使用两行 grid 对齐且不再展示转接图标，收起态保留 SLA 左侧色条并在渠道头像内展示只读星标；Current / History 列表为空时在展开态显示轻量空态提示。
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`：正式 `Live Chat` Conversation tab 内容，包含消息记录、快捷回复、引用、撤回、Transfer、End/Close 和发送消息演示。
- `src/pages/inbound/components/CustomerInformationCard.tsx`：客户卡片、身份刷新、最后 IVR 菜单提示和 Customer Verification Assist 入口；本轮按渠道类型和业务类型选择验证规则，并把 BankApp PIN 状态接入验证弹窗。
- `src/pages/inbound/components/CustomerVerificationModal.tsx`：动态身份验证助手弹窗；展示验证渠道类型、业务类型、紧凑规则进度、PIN 验证入口、分组题库和自动通过/失败结果；坐席 UI 不展示标准答案或答案来源。
- `src/mock/inbound.ts`：Inbound mock 数据；本轮新增 `verificationBusinessTypes` 和 `verificationRules`，覆盖 `Phone + Perbankan`、`HaloApp Registered + Perbankan`、`Phone + Kartu Kredit`、`HaloApp Registered + Kartu Kredit`、`HaloApp Registered + Paylater`。
- `src/store/appStore.ts`：workspace tab、话务、Live Chat 和 demo 全局状态；本轮新增 `bankAppPinVerificationStatus`、request id 与 PIN 请求/完成/重置动作，并把 `verificationRules` 放入前端 demo store，供配置页和坐席验证弹窗共用；同时新增 `agentServiceMode`、voice/video readiness 与 digital readiness，支持登录后媒体技能签入和轻量拦截。
- `src/store/authStore.ts`：demo auth session store；调用 mock LDAP，成功后只把 session/profile/role/CRM SSO metadata 写入 `sessionStorage`，不保存密码。
- `src/pages/call-management/RoutingConfigurationPage.tsx`：旧路由配置入口兼容组件，重定向到 `/routing-config/route-elements`。
- `src/pages/call-management/VerificationRulesPage.tsx`：Call Management 下的验证规则配置页，按 `Verification Channel Type + Business Type` 展示规则，支持 View/Edit 配置阈值、题目分组、错答上限、layering 和启停状态；不展示标准答案或答案来源，保存到前端 demo store。
- `src/pages/call-management/BusyReasonManagementPage.tsx`：Call Management 下的示忙原因配置页，客户 UI 为英文但示忙原因名称按 BCA 截图原文保留；当前预置 20 条，前 9 条启用，后 11 条 Extension 禁用备用，只支持编辑。
- `src/pages/routing-config/RoutingConfigCrudPage.tsx`：Routing Config 普通主数据页复用的本地 CRUD 容器，提供 Search / Add / View / Edit / Delete 弹窗表单。
- `src/pages/routing-config/RoutingConfigDataPages.tsx`：Routing Config 主数据独立配置页，覆盖 Route Elements、VDN、Sites、Channels、Media Service Rule Plans、Business Types、Site Access Volume、Access Accounts、Working Time Plans、Skill Queues；Channels 已支持按媒体引用服务规则方案，Media Service Rule Plans 当前完整维护 Text 媒体服务规则；Working Time Plans 已改为印尼单国家自定义排班编辑器，包含 Basic Info、Work Schedule、Ramadan Work Schedule、Holiday Schedule、Special Working Plan，Skill Queues 未选择方案时展示 `Default 24x7`。
- `src/pages/routing-config/SkillRoutingRulesPage.tsx`：独立技能路由规则页，支持按启用路由要素多选查询、规则列表要素拆列、批量新增拆分预览、重复组合勾选覆盖、规则查看/编辑/删除。
- `src/pages/routing-config/RoutingConfigStatusBadge.tsx`：Routing Config 状态 badge 组件，避免页面组件导出非组件函数触发 Fast Refresh lint。
- `src/pages/call-management/TextChannelSettingsPage.tsx`：数据呼叫管理下的文字渠道配置页，包含 Service Rules、Customer Timeout & Messages、Channel Queue Alerts 三组配置。
- `src/pages/inbound/components/LiveChatCustomerList.tsx`：WhatsApp / BankApp 客户聊天列表，默认收起，支持 ALL 与渠道图标筛选、会话运行持续时间、SLA 状态、短闪提示，可收起展开；Webchat mock 暂时隐藏。
- `src/pages/inbound/components/CustomerInformationCard.tsx`：Inbound 左栏客户信息卡容器，包含客户验证、联系信息维护、呼出申请、Call Flow、Send Email，以及右上角客户身份刷新浮层；身份刷新图标和原编辑联系方式图标必须同时显示在卡片右上角，Customer ID 浮层使用 `bottom` placement，hover 背景内图标必须居中；语音/IVR 类渠道在底部第二行以 `Menu` 短标签展示最后一级菜单，从现有 `callFlowDetail.ivrJourney` 取最后一级菜单，并在 title / aria 中保留 `Last IVR menu` 完整语义。
- `src/pages/inbound/components/ChannelTag.tsx`：统一渠道标签，Customer Information 中可合并展示静态渠道接入耗时，例如 `PSTN · 05:23`、`BankApp · 02:11`。
- `src/pages/DesignSystem.tsx`：设计系统展示页。
- `src/store/appStore.ts`：workspace tab、BankApp demo tab、WhatsApp demo tab、Live Chat 聚焦/已读状态、多 `CallInteraction` 通话实例、voice/video handoff readiness、interaction timing 和 demo-only screen share 全局状态；`createLiveChat2HandoffSession()` 会保留来源 session 的 `customer.accessDuration`，不把客户卡片接入时长重置或改成服务时长；`setLiveChatTabOpen(true)` 在干净签入周期内预设 `livechat2-001` 和客户主动挂机的 `livechat2-005` 作为 Current 演示客户。
- `src/store/callManagementStore.ts`：客户分支 Call Management 前端 demo store，提供示忙原因列表给右上角 AUX 下拉和 `Busy Reason Management` 页面共用；编辑后立即影响 AUX 下拉，刷新后恢复 mock 默认值。
- `src/hooks/useNow.ts`：前端运行时每秒 tick hook，用于 workspace tab 和 Live Chat 列表计时刷新。
- `src/mock/bankapp.ts`：BankApp 联系方式、业务类型、客户身份/语言驱动的技能路由和截图素材路径配置。
- `src/mock/inbound.ts`：Inbound 演示数据；包含未识别 PSTN 初始客户、身份刷新演示 ID `00000078987` 和 `lookupCustomerIdentityRefresh()` mock 查询 helper。
- `src/mock/routingConfiguration.ts`：路由配置页默认 mock，包含 route factor、自编码 VDN/站点/渠道/渠道媒体/业务类型/接入账号/接入入口/结构化工作时间方案/技能队列/路由规则。
- `src/mock/busyReasons.ts`：客户分支示忙原因 mock，按 BCA 截图原文预置 `Break`、`Istirahat`、`Job Routine`、`Keagamaan`、`Keperluan Pribadi`、`Meeting/Coaching`、`Special Assignment`、`Toilet`、`Yoga` 9 条启用原因；`Extension 1-11` 禁用备用；`AUX` 与 `Aux New Updated` 不作为业务原因。
- `src/mock/auth.ts`：demo LDAP 认证 mock，账号和密码固定为 `888888 / 888888`，返回坐席 profile、角色权限和 CRM SSO-ready metadata；错误消息模拟 LDAP 返回后由 AICC 展示。
- `src/mock/textChannelSettings.ts`：文字渠道配置页默认 mock，包含并发人数、自动回复、Webchat 撤回、客户超时话术、渠道排队阈值和通知对象。
- `src/types/bankapp.ts`：BankApp demo 联系方式、业务类型和步骤类型。
- `src/types/inbound.ts`：Inbound 业务类型，包含客户身份刷新结果类型 `CustomerIdentityRefreshResult`。
- `src/types/busyReason.ts`：客户分支示忙原因类型，供 AUX 下拉、Busy Reason Management 页面和 store 使用。
- `src/types/auth.ts`：登录、角色、auth session、CRM SSO context 与 `AgentServiceMode` 类型。
- `src/types/routingConfiguration.ts`：路由配置页专用类型，覆盖 route factor、channel_media、site_access_ratio、working_time_plan、skill_queue、routing_rule 和 routing_rule_index 等结构。
- `src/store/routingConfigStore.ts`：Routing Config 前端 demo 本地状态 store，刷新后恢复 mock；普通 CRUD、渠道媒体规则方案、Channel + Media 规则绑定和技能路由规则共用。
- `src/types/textChannelSettings.ts`：文字渠道配置页专用类型，渠道 code 为 `haloapp | webchat | whatsapp`，避免与现有 `AccessChannel` 耦合。
- `src/utils/duration.ts`：共享持续时间解析、格式化、elapsed 计算和 Live Chat SLA 阈值工具。
- `src/styles/index.less`：全局样式与页面样式主文件，包含 workspace tab、Live Chat 客户列表、Conversation 和 SLA 视觉状态。
- `src/styles/tokens.less`：全局 CSS token；Live Chat SLA warning / breach 使用独立 token，当前为 `#f59e0b` / `#f04438`。
- `.github/workflows/ci.yml`：GitHub Actions 最小 CI，PR 到 `main` 或 push 到 `main` / `codex/**` 时运行 `npm ci`、`npm run lint`、`npm run build`。

## 4. 路由与页面关系

当前路由：

- `/login` -> `LoginPage`；未登录可访问，已登录重定向到 `/`
- `/` -> `BasicLayout` -> `AgentWorkspace`
- `/design-system` -> `BasicLayout` -> `DesignSystem`
- `/call-management` -> `BasicLayout` -> 重定向到 `/call-management/verification-rules`
- `/call-management/verification-rules` -> `BasicLayout` -> `VerificationRulesPage`
- `/call-management/text-channel-settings` -> `BasicLayout` -> `TextChannelSettingsPage`
- `/call-management/busy-reasons` -> `BasicLayout` -> `BusyReasonManagementPage`
- `/call-management/*` -> `BasicLayout` -> 重定向到 `/call-management/verification-rules`
- `/routing-config` -> `BasicLayout` -> 重定向到 `/`
- `/routing-config/*` -> `BasicLayout` -> 重定向到 `/`
- `*` -> 重定向到 `/`

页面关系：

- 除 `/login` 外，当前业务路由都需要 demo auth session；未登录访问 `/`、`/design-system`、`/call-management/*` 会重定向到 `/login`。
- 登录页模拟 AICC 调用 BCA LDAP：`888888 / 888888` 且 6 位 PIN/captcha 正确时返回用户、角色权限与 CRM SSO metadata；失败时展示 mock LDAP 错误并停留登录页；EXT 可选且只作为 session metadata；点击验证码图片本身刷新 PIN，不显示独立刷新按钮。
- 登录成功只代表系统认证通过，坐席状态仍为 `Unsigned`；右上角头像下拉显示 `Sign In` 分组，下面以纯文字选择 `Voice only`、`Digital only`、`Voice + Digital`，选择后才进入坐席 Ready 状态。
- 签入后右上角第二行显示 `PBK BSB | {mode}`，下拉顶部显示当前签入模式；`Sign Out` 只退出媒体坐席状态并保留系统登录；系统级 `Log Out` 使用右上角独立红色电源按钮，清除 auth session 并回到 `/login`。
- 媒体技能采用轻量拦截而不是隐藏菜单：`Digital only` 阻止 PSTN / BankApp Voice / BankApp Video handoff；`Voice only` 阻止 WhatsApp / BankApp Live Chat handoff 并在客户侧流程显示明确 warning；`Voice + Digital` 允许现有全部演示流程。
- `BasicLayout` 是所有页面的壳，包含顶部 Header、坐席状态、话务工具条、侧栏和内容区。
- `AgentWorkspace` 默认显示 Home tab。
- 客户演示版显示 `Call Management` 一级菜单，二级包含 `Verification Rules`、`Text Channel Settings` 和 `Busy Reason Management`；`Routing Config` 继续不在菜单展示，直接访问 `/routing-config/*` 仍回到 `/`。
- `Call Management > Verification Rules` 是前端 demo 配置页，和坐席侧 Customer Verification Assist 读取同一份 `verificationRules` store；当前不接后端持久化，刷新后恢复 mock 默认规则。
- `Call Management > Busy Reason Management` 是前端 demo 配置页，和右上角坐席 AUX 下拉读取同一份 `busyReasons` store；当前不接后端持久化，刷新后恢复 mock 默认原因。
- 点击左侧 `Channel Simulation > BankApp` 会打开可关闭的 `BankApp Demo` tab，用于演示客户在 BankApp 内选择文字、语音或视频服务后进入 AICC；BankApp Demo tab 在切到坐席工作台时保持挂载，返回后不会重置当前步骤。
- 点击左侧 `Channel Simulation > WhatsApp` 会打开可关闭的 `WhatsApp Demo` tab；当前使用用户提供的脱敏 WhatsApp 原图，并在第三步后切到 Live Chat 坐席工作台查看 WhatsApp 接入会话。
- 坐席点击右上角 `Sign In` 后，`Live Chat` tab 会固定插入 Home tab 旁边，`closable: false`，用于承载实时文字聊天工作台。
- 当坐席处于 Ready 且无通话时，点击左侧 `Channel Simulation > PSTN` 进入 Incoming 并打开电话弹屏 tab；如果已有未挂断电话、语音或视频通话，PSTN 入口不会新建 tab，而是在 Header / 话务条下方显示短暂提示 `Active call in progress. Please hang up and wait until the agent is Ready before accepting another voice or video interaction.`；如果没有未挂断通话但坐席处于 Not Ready / ACW / AUX / Unsigned，则提示 `Agent is not Ready. Please switch to Ready before accepting another voice or video interaction.`。
- `Video Call` 与 `Live Chat` 已从左侧可见菜单移除；底层 workspace、store 和页面能力保留，供 BankApp Video、WhatsApp/BankApp chat 和后续调试复用。
- `createCallInteraction(kind, source?, activate?)` 会创建独立通话实例 tab；tab key 使用稳定递增格式 `call-1`、`call-2`、`call-3`，不会覆盖旧通话弹屏。
- PSTN 创建 `voice/pstn` 实例，tab 显示 `PSTN (mm:ss)`；BankApp Voice 创建 `voice/bankapp-voice` 实例，tab 显示 `Voice Call (mm:ss)`；BankApp Video 创建 `video/bankapp-video` 实例，tab 显示 `Video Call (mm:ss)`。
- PSTN 电话弹屏初始显示 `Unidentified Customer`、空 Customer Journey 和空 Ticketing History；坐席点击 Customer Information 右上角身份刷新图标，点击 `Paste` 自动填入演示 ID `00000078987`，点击 `Confirm` 后假装 CRM 查询成功并刷新当前工作台左栏三张卡片。身份刷新图标与原编辑联系方式图标都在 Customer Information 右上角展示，不能相互覆盖或被裁剪；图标必须位于 hover 背景正中；Customer ID 浮层不能进入左侧菜单范围。语音/IVR 类 Customer Information 底部第一行仍展示渠道、接入时长、验证状态和 Verify；第二行展示 `Menu` 与最后一级 IVR 菜单，点击渠道图标仍打开完整 Call Flow Detail。
- Customer Information 的 `Verify` 入口现在打开 Customer Verification Assist：默认业务类型来自当前客户/入口 mock，坐席可改本次业务类型，修改后题库和进度重置；系统按 `Verification Channel Type + Business Type` 找到 enabled 规则，Exact match 不存在时可 fallback 到 `Phone + Business Type`，但 `HaloApp Unregistered` 必须先完成 PIN。答题状态只在本次弹窗会话内累计，`Correct / Wrong / Skip` 分别计入答对、错答和跳过，`Skip` 不触发错答累计；已答题目可直接改选，最终点击 `Apply Verified` 或 `Apply Failed` 前不锁定题目操作。顶部只显示渠道、业务类型和状态 badge；规则区用 `Need N correct` 与 Mandatory / Dynamic / Static 等彩色块展示达成情况，详细 notes 放问号提示。标准答案和答案来源保留在 mock/type 中供内部讨论，但不在坐席 UI 展示。
- BankApp/HaloApp Voice 客户接入后，验证弹窗顶部显示 `Send PIN Verification`；点击后 BankApp Demo 手机页展示 4 位 PIN 输入页，客户提交后 store 标记为 `PIN Verified`，同一坐席通话再打开验证弹窗会按 `HaloApp Registered` 规则加载题库。Demo UI 仍显示 `BankApp/BANK App`，客户讲解时说明真实客户 APP 是 `HaloApp`。
- `requestBankAppVoiceCall(activate?)` / `requestBankAppVideoCall(activate?)` 会通过 request id 触发 `BasicLayout` 话务状态机，并携带是否激活坐席工作台的语义；BankApp Demo 在 Voice / Video 的 `Connected -> Agent Workspace` handoff 前会读取 store 中的 `voiceVideoHandoffReadiness`，如有未挂断通话则阻止跳转并显示 `Please hang up the current call and wait until the agent is Ready before routing this interaction to Agent Workspace.`，如坐席不是 Ready 则显示 `Agent must be Ready before routing this interaction to Agent Workspace.`。
- `bankAppVideoShareState` / `isScreenShareActive` 表示 demo-only 桌面共享状态；BankApp Video 的桌面共享入口已移到坐席侧 OpenEye 浮窗，点击 `桌面共享` 后显示选择共享程序截图，点击 `确定` 后切回 BankApp Demo 展示客户侧共享画面；Hang Up、关闭 Video Call tab、新普通视频呼叫、Reset BankApp Demo 会清理该状态。
- `requestLiveChatWorkspace(sessionId?, activate?)` 会打开固定 Live Chat tab；旧会话 id 会映射到新版 `liveChat2*` 状态并聚焦对应客户：`live-chat-001 -> livechat2-001`、`live-chat-002 -> livechat2-002`、`live-chat-003 -> livechat2-003`，未知 id fallback 到首个非历史 livechat2 会话。`activate` 默认为 `true`，BankApp 演示可传 `false` 在后台准备文字坐席页。
- 2026-05-29 17:42 后，`requestLiveChatWorkspace` 每次从 WhatsApp / BankApp Demo handoff 都会基于对应 livechat2 mock 模板创建新的会话实例，例如 `livechat2-001-handoff-1`；这样重复从 demo 跳入会表现为新客户接入，而不是回到旧客户行。
- 正式 Live Chat 的 Customer Information 渠道标签中的 `accessDuration` 只表示客户从渠道接入到转人工成功前的耗时；接入坐席后必须保持固定。服务中持续计时只出现在 workspace tab、Live Chat 客户列表、Conversation header、SLA / 未回复计时等服务时长 UI。
- `requestLiveChat2Workspace(sessionIds, options?)` 作为兼容入口仍存在，但也会打开正式 `Live Chat` tab，不再创建单独 `livechat2` tab；`liveChat2*` 状态独立保存排序、星标、草稿、已读、未回复计时、结束态、历史列表和消息覆盖，Sign Out / AUX 会通过 `clearLiveChat2Sessions()` 清理。
- Workspace 交互页签现在统一使用同一套 label 结构和样式，图标与文字间距保持普通 tab 的 4px；PSTN 电话呼入为 `PSTN (mm:ss)`，BankApp Voice 为 `Voice Call (mm:ss)`，BankApp Video 为 `Video Call (mm:ss)`，Live Chat 有 active session 时显示最长会话运行时长 `Live Chat (mm:ss)`，右上角显示当前未读总数且大于 99 显示 `99+`。
- 新通话交互进入且当前不在该 tab 时，workspace tab 会轻微短闪约 5 秒；Live Chat tab key 仍保持 `live-chat`，只要有新 active session 进入就会短闪，即使当前已停留在 Live Chat tab；Live Chat 的短闪作用在整个 tab item 背景范围，不只包住 label 文本；通话 tab key 改为动态 `call-n`。
- 当前正在通话的 call tab 不可关闭；Hang Up 后该 tab 保留、duration 冻结并变为可关闭。旧 ended tab 用于坐席继续登记，不代表仍有客户互动。
- Live Chat tab 不可关闭，签出后自动从 workspace tabs 移除。
- `/design-system` 独立展示设计规范与基础组件，不参与通话流程。

## 5. 全局布局与状态机

`BasicLayout` 当前包含：

- 顶部蓝色渐变 BANK 1 Header，恢复旧版主工作台视觉。
- 可展开/收起左侧系统菜单，默认收起，`collapsedWidth` 为 `48px`，展开宽度使用 `--aicc-layout-sider-width`。
- 左侧菜单支持 2 层级：展开态顶部显示折叠按钮与菜单搜索框，点击一级菜单在下方展开二级菜单；收起态仅显示一级图标，鼠标悬浮在一级图标时在右侧显示二级菜单浮层，鼠标移出浮层或点击菜单后浮层关闭。
- 当前侧栏菜单使用英文企业呼叫中心文案：Channel Simulation（PSTN、BankApp、WhatsApp）、Call Management（Verification Rules、Text Channel Settings、Busy Reason Management）、Agent Center（Agent Profile、Service History）、Operations（Alert KPI Management、Floor Management）、Reports。客户预览版继续不展示 `Routing Config`。
- Agent Toolbar：Answer、Hold、Mute、Transfer、Hang Up、More；电话/视频呼入时可在动作按钮最左侧展示 incoming identification；More 菜单点击打开，包含 Outbound Call 与 Settings。
- Agent Profile Area：Signed out 时菜单显示 `Sign In` 分组与三个纯文字服务模式；Signed in 后菜单显示当前服务模式、不可点击 `AUX` 分组标题、启用示忙原因和媒体 `Sign Out`。系统级 `Log Out` 已独立为 Header 右侧红色电源按钮，按钮尺寸与状态下拉按钮一致。示忙原因不显示独立图标，点击原因后立即切换为 `AUX - {reasonName}`，不再打开 `Select AUX Reason` 弹框。头像右下状态点使用 `effectiveAgentPresence`，由坐席状态和活跃客户互动共同决定。
- Notifications 和 Internal Chat 入口。
- Internal Chat Modal。

坐席状态类型：

```ts
type AgentStatus =
  | 'Unsigned'
  | 'Ready'
  | 'Not Ready'
  | `AUX - ${string}`
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
- Ready + Idle 且没有未结束 `CallInteraction` 时点击 `Channel Simulation > PSTN` 可触发电话弹屏；`BasicLayout` 会计算并同步 `voiceVideoHandoffReadiness` 到 store，统一区分 `available`、`active-call` 和 `not-ready`。被阻塞时只显示轻量顶部 warning，不改变当前通话、不打开 modal、不新增 tab。
- 话务条 incoming identification 只在 `Incoming`、`Talking`、`Hold`、`Mute` 时显示：PSTN 显示 `IVR 08123456789`，BankApp Voice / Video 显示 `BankID 00012345`；Hang Up 后随 `callStatus` 回 Idle 自动隐藏。识别标签、号码、timer label 与 timer value 使用统一 metadata 层级：灰色 label、黑色 700 数值、tabular nums、清晰 1px divider。
- 话务条 Settings 当前只配置显示模式，默认 `Icon + Text`；选择控件使用项目自定义 segmented button 风格，与 BankApp Customer type 控件保持一致；弹框只保留一行 `Toolbar display` + 横向选择控件。切换为 `Icon Only` 后 Answer/Hold/Mute/Transfer/Hang Up/Ready 等按钮隐藏文字但保留图标、`aria-label` 和 `title`，图标在该模式下放大到 14px。自动接听仍固定使用默认 3 秒，但不在 Settings 中展示。
- BankApp Demo 的 `Livechat` 路径会打开 Live Chat 并聚焦 BankApp 客户；`Voice Call` / `Video Call` 路径通过 store request id 触发现有坐席话务状态机，并可在 `Agent Workspace` 步骤切到对应坐席 workspace。若 readiness 为 `active-call` 或 `not-ready`，Voice / Video handoff 会停留在当前 BankApp 步骤并显示对应 inline warning，Live Chat 路径不受该限制影响。
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
- Ticketing History 行内 CRM 编号与日期保持同一行，并作为右侧 meta 区整体右对齐；行尾箭头不再占用 grid 列，hover/focus 时以绝对定位覆盖在日期上方，避免默认状态日期被挤离最右侧。
- Next Best Action 支持打开 CRM 动态业务 tab；行尾 hover/focus 箭头与 Ticketing History 使用同一套绝对定位 overlay 效果，不再占用 grid 列或错位。
- Quick Action 支持打开 CRM 动态业务 tab。
- Customer Verification Assist 按验证渠道类型和业务类型动态加载题库与通过规则，支持必问题、动态题、静态题、错答上限、跳过和 HaloApp PIN 前置验证。
- Send Email Modal 已存在。
- Call Flow Detail Modal 已存在。

### Center CRM Panel

文件：`src/pages/inbound/components/CrmPanel.tsx`

当前状态：

- 固定 CRM tab，key 为 `crm`。
- 动态业务 tabs 来自 `CrmWorkspaceTab[]`。
- 动态 tab 可关闭。
- CRM、Conversation 和动态业务 tabs 统一使用 `inbound-crm-tab-label` label 结构，固定图标尺寸、文字 ellipsis 和 4px 图文间距。
- CRM tabs nav 已锁定单行固定高度；tab 文本过长使用 ellipsis，overflow 外层操作区和更多按钮均压缩为紧凑方形并居中，避免开多个 tab 后拉高中心区域或出现过宽更多按钮。
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
- 点击 `Conversation` 顶部 `Transfer` 会打开复用的 Transfer 弹框 conversation 变体：仅有 `Transfer Agent` / `Transfer Skill`；Agent 行默认只显示 `Transfer`、`Conference`；Skill tab 保持话务条原 `Transfer` 动作。
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
- Customer Verification Assist 题目以印尼语业务内容为主，外层控件仍为英文；标准答案和答案来源不在坐席侧展示。
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
- Customer Verification Assist 动态题库弹窗。
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

截至 2026-06-09 11:20 +08:00，本轮简化 Transfer / Outbound 坐席列表状态口径：

- `Transfer > Transfer Agent` 去掉 Status 查询条件，仅保留 Keyword 与 Skill Queue 查询。
- `Outbound Call > Call Agent` 去掉 Status 查询条件，仅保留 Keyword 与 Skill Queue 查询。
- `transferAgents` mock 中所有坐席状态统一为 `Ready`，因此两个弹框列表 Status 均展示 Ready。
- 验证：`npm run lint`、`npm run build` 通过；本地 Chrome CDP smoke check 已覆盖 `Outbound Call > Call Agent` 和通话态 `Transfer > Transfer Agent`，两个 tab 均不显示 `All status`，表格 6 行 Status 全部为 `Ready`。

截至 2026-06-09 10:52 +08:00，本轮根据客户反馈恢复 AUX 直接下拉并新增 `Call Management > Busy Reason Management`：

- 客户截图中的示忙原因是英文 + 印尼语混合，本轮按原文保留，不翻译。
- 右上角头像菜单在 signed-in 状态直接显示启用的示忙原因；点击 `Break`、`Istirahat` 等原因后立即切换为 `AUX - {reasonName}`，不再打开 `Select AUX Reason` 弹框。
- 截图前两项 `AUX`、`Aux New Updated` 不作为业务示忙原因；它们更像状态父项或临时测试项。
- `Busy Reason Management` 预置 20 条数据：前 9 条 `Break`、`Istirahat`、`Job Routine`、`Keagamaan`、`Keperluan Pribadi`、`Meeting/Coaching`、`Special Assignment`、`Toilet`、`Yoga` 为 Enabled；`Extension 1-11` 为 Disabled 备用；Default 全部为 No。
- `Call Management` 二级菜单现在包含 `Verification Rules`、`Text Channel Settings`、`Busy Reason Management`；`Routing Config` 继续隐藏并直达回首页。
- AUX 下拉已调整为 `AUX` 不可点击分组标题 + 纯文字原因项；不在 `Busy Reason Management` 增加图标字段，避免每个原因维护图标。
- 验证：`npm run lint`、`npm run build`、`git diff --check` 通过；本地 Chrome CDP smoke check 已覆盖 `/`、签出/签入 AUX 下拉、`Break` / `Keperluan Pribadi` 状态切换、`/call-management/busy-reasons` 20 条数据、编辑 BR001 Disabled / BR010 Enabled 后 AUX 下拉联动、`/call-management/verification-rules`、`/call-management/text-channel-settings` 和 `/routing-config/*` 回首页。
- 补充验证：本地 Chrome CDP smoke check 已确认 signed-in 菜单存在 `AUX` group title，group title role 为 `presentation` 且点击不切换状态，9 个原因项 icon count 为 0，点击 `Break` / `Keperluan Pribadi` 仍能切换对应 AUX 状态。

截至 2026-06-06 16:35 +08:00，本轮开放客户可见 `Call Management > Verification Rules`，并继续简化 Customer Verification Assist：

- `Call Management` 已恢复到左侧客户可见菜单，二级只包含 `Verification Rules` 和 `Text Channel Settings`。
- `/call-management` 默认跳转到 `/call-management/verification-rules`；`/call-management/text-channel-settings` 正常打开现有文字渠道配置页。
- `Routing Config` 继续不展示在左侧菜单，`/routing-config` 和 `/routing-config/*` 仍回到 `/`。
- `Verification Rules` 配置页按 `Verification Channel Type + Business Type` 展示规则，支持 View/Edit 修改阈值、题组 required count、错答上限、layering、启停和 Question Set；坐席 UI 和配置页都不展示标准答案或答案来源。
- `verificationRules` 已放入 `appStore` 前端 demo state，配置页保存会影响后续打开的验证弹窗；刷新浏览器后恢复 mock 默认值。
- Customer Verification Assist 顶部不再显示长统计串，规则区改为 `Need N correct` 加 Mandatory / Dynamic / Static 等彩色达成块，`Wrong x/y` 只作为弱提示。
- 验证：`npm run lint`、`npm run build` 均通过；Browser 已检查 Call Management 两个路由、`/call-management` 重定向、`/routing-config` 重定向和 `/design-system`。当前 Codex Browser 控制在 Sign In 下拉与截图上不稳定，完整 `Sign In -> PSTN -> Verify` 仍留作人工复查。

截至 2026-06-05 15:56 +08:00，本轮在客户安全分支实现 AUX 示忙原因选择弹框：

- 已从 `main` 创建 `codex/customer-aux-busy-reason-modal`，继续隐藏 `Call Management` 与 `Routing Config` 菜单和直达 URL。
- 已清理本地旧分支：`codex/customer-preview-hide-admin-menus`、`codex/fix-toolbar-chat-modals`、`codex/livechat2-popup`、`codex/local-livechat2-integrated`、`codex/modal-review-fixes`；未删除远端分支。
- 新增客户分支最小 Busy Reason 类型、mock 和 store，仅供右上角 AUX 弹框读取，不提供管理页面。
- 右上角头像状态菜单从多条 `AUX - Ibadah` / `AUX - Makan` 改为单个 `AUX` 入口；点击后打开 `Select AUX Reason` 弹框。
- AUX 弹框只显示启用原因：`Ibadah`、`Makan`；`Ibadah` 默认选中；`Training` 和 `Extension 1-7` 为禁用备用原因，不显示。
- 点击 `Confirm` 后通过现有状态机切换到 `AUX - {reasonName}`；`Cancel` 不改变状态；现有 AUX 清理通话和 Live Chat active sessions 的副作用不变。
- 验证：`npm run lint` 通过；`npm run build` 通过，仅保留既有 Vite chunk size warning。
- 浏览器验证：`/` 正常加载，左侧无 `Call Management` / `Routing Config`；签出菜单只显示 `Sign In`；签入菜单显示 `AUX` / `Sign Out`；AUX 弹框只显示启用原因；确认后状态变为 `AUX - Ibadah`；`/call-management/busy-reasons` 仍重定向回 `/`。

截至 2026-06-03 10:12 +08:00，本轮调整管理台通用页面顶部规范：

- `PageContainer` 顶部 header 从大块展示区收紧为紧凑管理台标题行。
- `.aicc-content` 顶部 padding 从 `12px` 收紧为 `8px`，降低全局页面进入内容前的空旷感。
- `.aicc-page-container__header` 最小高度从 `50px` 降为 `28px`，标题下方间距从 `18px` 降为 `10px`。
- 页面标题字号从 `20px` 降为 `16px`，行高从 `28px` 降为 `22px`，并保持 700 字重；标题层级低于 `BANK 1` Logo，不再接近 Logo 视觉权重。
- `PageContainer` body 间距从 `16px` 收紧为 `12px`，让查询区、表格和内容模块更贴近管理台密度。
- 该规范影响所有使用 `PageContainer` 的后台/配置页，包括 Routing Config、Text Channel Settings、Design System 等；Inbound 主工作台未使用页面标题，不受标题字号影响。

本轮验证：

- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning 和 plugin timing 提示。
- `npm run lint`：单独重跑通过；第一次与 build 并行执行时因资源占用超时。
- 重新启动 Vite dev server 到 `http://127.0.0.1:5174`，Browser `/routing-config/route-elements`：确认页面标题小于 Logo，顶部留白明显收紧，标题后直接进入查询卡片。

截至 2026-06-04 12:10 +08:00，本轮准备客户 Vercel Preview 发布，屏蔽未完成管理菜单：

- 从 `BasicLayout` 侧栏菜单移除 `Call Management` 与 `Routing Config` 两个一级菜单。
- 将 `/call-management`、`/call-management/*`、`/routing-config`、`/routing-config/*` 路由全部重定向到 `/`，避免客户通过旧 URL 直达未完成页面。
- 保留 `src/pages/call-management/*`、`src/pages/routing-config/*`、对应 mock、store 和类型文件，方便后续继续开发或恢复菜单。
- 当前发布目标是 Vercel Preview URL，不直接发布 Production。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有 Vite/Rolldown plugin timing 与 chunk size warning。
- Browser `http://127.0.0.1:5176/`：确认首页正常加载，展开侧栏后仅显示 Channel Simulation、Agent Center、Operations、Reports，不显示 `Call Management` 或 `Routing Config`。
- Browser `/design-system`：确认正常加载。
- Browser `/call-management/text-channel-settings` 与 `/routing-config/route-elements`：均重定向回 `/`，且未出现对应管理页内容。
- Browser smoke check：BankApp Demo、WhatsApp Demo、Sign In 后 Live Chat tab、Ready 状态下 PSTN 弹屏均可用。
- GitHub branch 已推送到 `origin/codex/customer-preview-hide-admin-menus`，commit `421aa72`。
- Vercel Preview deployment 已成功生成；每次 push 会生成新的 per-commit Preview URL，应以 GitHub deployment status / Vercel 最新部署记录为准。
- 远端 Preview 在未登录浏览器中会跳转到 Vercel login，说明当前 Preview 受 Vercel Deployment Protection 或访问控制影响；发给客户前需要在 Vercel 中关闭/配置 Preview 访问保护或提供可访问的分享方式。

截至 2026-06-04 12:29 +08:00，本轮将客户发布版本合入 `main`，准备 Production 发布：

- `main` 已通过 fast-forward 合入 `codex/customer-preview-hide-admin-menus`。
- Production 客户版本继续隐藏 `Call Management` 与 `Routing Config`，并保留 `/call-management/*`、`/routing-config/*` 直达重定向到 `/`。
- 未完成管理功能源码、mock、store 和类型仍保留在仓库中；本地继续开发应切回 `codex/text-channel-config-settings`。
- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite chunk size warning。
- 下一步推送 `main` 触发 Vercel Production。

截至 2026-06-04 11:16 +08:00，本轮继续修正 `Routing Config > Working Time Plans` Holiday / Special 排班行对齐：

- Holiday / Special 排班行中 `Holiday Name` / `Reason` 固定 240px 后过短，导致 `Start` 时间列相对 Work/Ramadan 行提前。
- 将 Holiday / Special grid 从 `150px 150px 240px 120px 120px 30px` 调整为 `150px 150px minmax(360px, 1fr) 120px 120px 30px`。
- 中间的 Holiday Name / Reason 列现在会吃掉剩余空间，保持 Start Date / End Date 为 150px、Start / End 为 120px，并让 `Start` 列与 Work/Ramadan 排班行对齐。
- 不改变字段、校验、保存逻辑或底部优先级提示。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- 源码扫描确认 Holiday / Special grid 已更新为 `minmax(360px, 1fr)`。

截至 2026-06-04 11:02 +08:00，本轮调整 `Routing Config > Working Time Plans` 提示文案与排班行宽：

- Working Time Plans 弹框底部提示只保留优先级：`Priority: Special Working Plan > Holiday Schedule > Ramadan Work Schedule > Work Schedule.`
- 移除 `Empty Skill Queue plan means Default 24x7.`，避免把 Skill Queue 未引用工作时间方案的默认规则放在工作时间方案维护页解释。
- `Default 24x7` 仍保留在 Skill Queues 的 Work Time Plan 空值展示中，本轮不全局改成 `Default 24/7`。
- Holiday / Special 排班行 grid 后续在 11:16 修正为 `150px 150px minmax(360px, 1fr) 120px 120px 30px`，让 Start 列与 Work/Ramadan 行对齐。
- 不改变字段、校验、保存逻辑或数据结构。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认页面正常渲染，列表页不出现 `Empty Skill Queue plan means Default 24x7`。
- 源码扫描确认弹框优先级提示已更新，旧文案不再存在。

截至 2026-06-04 10:38 +08:00，本轮调整 `Routing Config > Skill Routing Rules` Batch Add 重复规则区：

- Batch Add 弹框中原 `Generated Routing Rules Preview` 标题改为 `Duplicate Routing Rules`。
- 重复规则区提示文案改为：`The following route combinations already exist. Selected rows will update the existing skill queue to the current target queue; unselected rows will remain unchanged.`
- 重复规则表格数据源从 `batchPreviewRows` 改为 `duplicatePreviewRows`，该区域只展示已存在的重复路由组合。
- 新组合仍由原保存逻辑正常新增，不在重复规则表格中展示。
- 本轮不修改查询条件、主列表字段、Batch Add 保存逻辑或数据结构。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认页面正常渲染且 `Batch Add` 按钮存在。
- 源码扫描确认新标题、新提示文案和 `dataSource={duplicatePreviewRows}` 已生效，旧标题 `Generated Routing Rules Preview` 不再存在。

截至 2026-06-04 00:28 +08:00，本轮修正 `Routing Config > Skill Routing Rules` 工具栏布局：

- `Batch Add` 不再放在 `routing-config-page__filters--rules` 内，也不再紧挨 `Reset`。
- 规则页工具栏结构调整为普通管理台标准：左侧 `query-group` 包含路由要素筛选、Target Skill Queue、Status、Search、Reset；右侧独立 `add-action` 放置 `Batch Add`。
- 删除规则页此前的 `admin-toolbar--rules { display: block; }` 和 `filters--rules` 下的 Add 特殊覆盖，让规则页继承普通管理台右侧主操作位规则。
- 查询字段、表格列、Batch Add 弹框逻辑和数据结构均未改变。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认页面正常渲染，查询区仍显示 Search / Reset / Batch Add。

截至 2026-06-04 00:13 +08:00，本轮调整 `Routing Config > Site Access Volume` 查询条件：

- 查询区从 `Keyword + Status` 调整为 `Keyword + Media Type + Status`。
- `Keyword` 只匹配 Channel ID / Channel Code / Channel Name，不再承担媒体类型查询。
- `Media Type` 使用独立下拉，选项为 `All / Voice / Video / Text`，来源继续复用 `mediaOptions`。
- 筛选指定媒体后，列表只展示命中的媒体行；同一渠道的合并单元格 `rowSpan` 会按筛选后的媒体行数重新计算，避免筛选单个媒体时仍保留多行合并。
- 查询工具栏仍沿用管理台标准样式，Add 不改变。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/site-access-volume`：确认查询区显示 `Keyword / Media Type / Status`，页面正常渲染。

截至 2026-06-03 19:52 +08:00，本轮将 `Routing Config` 二级菜单、页面标题和弹框标题统一为英文：

- 左侧 `Routing Config` 二级菜单显示为 Route Elements、VDN、Access Sites、Channels、Media Service Rule Plans、Business Types、Skill Queues、Access Accounts、Site Access Volume、Skill Routing Rules、Working Time Plans。
- `RoutingConfigDataPages.tsx` 中所有 Routing Config 子页 `PageContainer` 标题已改为对应英文名称。
- `SkillRoutingRulesPage.tsx` 页面标题已改为 `Skill Routing Rules`。
- 普通 CRUD 弹框继续通过英文页面标题或 `entityName` 派生 `Add / Edit / View / Delete` 标题；自定义弹框标题保持现有英文文案。
- 本轮不改变路由 path、mock 数据、CRUD 字段、查询条件或管理台样式骨架。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`、`/routing-config/channels`、`/routing-config/media-service-rule-plans`、`/routing-config/skill-routing-rules`：确认页面主标题显示英文，未发现中文标题残留。

截至 2026-06-03 19:06 +08:00，本轮修复 `Channels` 与 `Media Service Rule Plans` 未完整继承管理台标准样式的问题：

- 根因：普通 `RoutingConfigCrudPage` 的内容包在 `<section className="routing-config-page">` 中，表格字号、表格 padding、分页字号、查询按钮高度和控件高度变量都依赖该作用域；两个自定义页此前缺少该根容器。
- `Channels` 与 `Media Service Rule Plans` 现已补回标准 `<section className="routing-config-page">` 包裹 `BaseCard compact`，让 `.routing-config-page .aicc-table ...` 等标准规则生效。
- `routing-config-crud-modal__sections` 增加 `--routing-config-control-height: 32px`，让复杂分区弹框内输入框、下拉框和数字输入框继续使用标准控件高度。
- 后续新增复杂自定义管理页必须满足：`PageContainer > section.routing-config-page > BaseCard compact > admin-toolbar + BaseTable`；不能只复制局部 class。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels`：确认存在 1 个 `.routing-config-page` 根容器，表格单元格、Search、Add 均在该作用域内，`Rule Plan` 列可见。
- Browser `/routing-config/media-service-rule-plans`：确认存在 1 个 `.routing-config-page` 根容器，表格单元格、Search、Add 均在该作用域内，`Key Rules` 不存在。

截至 2026-06-03 19:01 +08:00，本轮继续修正 `Channels` 与 `Media Service Rule Plans` 的管理台标准复用：

- 两个自定义页面的表格操作列改回 `routing-config-crud__row-actions`，使用与普通 CRUD 页一致的 24px 图标按钮样式。
- 两个自定义页面的 `BaseModal` 改回 `kind="detail"`，不再使用自定义 `footer` prop；`Cancel / Delete / Save` footer 放入弹框 body 末尾并使用标准 `routing-config-crud-modal__footer`。
- 删除弹框改回普通 CRUD 页一致的 `Alert` 提示结构；被引用不可删除时直接显示 `This record cannot be deleted.`。
- 新增/编辑校验提示从 error alert 收敛为 warning alert，与普通 CRUD 页一致。
- Channel 和 Media Service Rule Plan 的业务分区改用通用 `routing-config-crud-modal__sections / __section / __section-grid / __section-title`，不再保留 `routing-config-channel-modal__*` 或 `routing-config-media-rule-modal__grid/full/section` 这类页面专属布局类。
- 删除上一轮为了自定义查询栏临时新增的 `routing-config-page__admin-toolbar > label/button` CSS；查询栏只走 `routing-config-page__filter / __admin-actions / __add-action` 标准。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels`：确认查询栏、Rule Plan 列和 Add Channel 弹框可见，弹框含标准 Cancel / Save。
- Browser `/routing-config/media-service-rule-plans`：确认查询栏、列表字段和 Add Media Service Rule Plan 弹框可见，`Key Rules` 仍不存在。

截至 2026-06-03 18:45 +08:00，本轮修正 `Channels` 与 `Media Service Rule Plans` 的管理台查询栏样式：

- 两个自定义页面不再把查询字段和按钮直接放进 `routing-config-page__admin-toolbar`，避免被该容器的 `space-between` 拉出异常大间距。
- 查询栏 DOM 改回与 `RoutingConfigCrudPage` 一致：`query-group` 包含 `filters` 和 `admin-actions`，`Add` 使用独立 `add-action`。
- `Search` / `Reset` / `Add` 按钮改用统一 `variant`，继承其它管理页相同高度、宽度、字号和圆角。
- 两个页面的表格卡片改用 `BaseCard compact`，与普通 CRUD 页保持一致。
- `Media Service Rule Plans` 列表去掉 `Key Rules` 字段，保留 Plan ID、Plan Name、Media Type、Description、Updated Date、Updated By、Status、Actions。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels`：确认 Keyword、Media Type、Status、Search、Reset、Add、Rule Plan 均可见。
- Browser `/routing-config/media-service-rule-plans`：确认 Keyword、Media Type、Status、Search、Reset、Add 和列表字段可见，`Key Rules` 不再出现。

截至 2026-06-03 18:26 +08:00，本轮新增 `Routing Config > Media Service Rule Plans` 并调整 `Channels` 的渠道媒体规则引用：

- `Channels` 继续维护渠道主数据：Channel ID、Channel Name、Media Type、Max Concurrent Calls、Min Scan Interval、Status。
- `Channels` 列表新增 `Rule Plan` 摘要列；Text 媒体展示绑定的 Text 服务规则方案，Voice / Video 展示 `Reserved / Not configured`。
- `Channels` Add/Edit 弹框在媒体类型多选后展示 `Media Rule Plan Binding` 区；Text 行必须选择 Enabled Text rule plan，Voice / Video 暂时只展示预留状态。
- 新增 `Media Service Rule Plans` 二级菜单和路由 `/routing-config/media-service-rule-plans`，菜单位置在 `Channels` 后。
- 新增 `MediaServiceRulePlan`、`TextMediaQueueAlertRule`、`ChannelMediaRuleBinding` 类型，以及 mock/store 本地数据集合。
- 当前只完整支持 Text 媒体规则方案，包含 Basic Info、Capacity & Agent No Reply、Customer Timeout、Lifecycle Messages、Channel-specific Rules。
- Text 方案支持默认每坐席 3 客户、坐席 2 分钟未回复自动回复、1/2 分钟坐席侧提醒、客户 5 分钟未回复自动关闭、关闭前 1 分钟提醒、欢迎语、非工作时间话术、排队话术、分配成功问候、坐席主动结束语。
- Channel-specific Rules 支持 Haloapp / webchat / WhatsApp 排队阈值和通知对象；Webchat Recall Limit 只作为 Text 方案里的 webchat 专属字段配置。
- 所有当前 Text 渠道 mock 都已有 `Channel + Text` 绑定，避免 active Text 渠道缺少规则方案。
- 删除 Media Service Rule Plan 时会检查 `ChannelMediaRuleBinding` 引用；被渠道媒体引用时不允许删除。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels`：确认列表显示 `Rule Plan`、`Standard Text Service`、`Priority Text Service`；Add 弹框显示 `Media Rule Plan Binding`，Voice / Video 显示 `Reserved / Not configured`。
- Browser `/routing-config/media-service-rule-plans`：确认新页面可打开，列表显示两条 Text 服务方案；Add 弹框包含 Capacity & Agent No Reply、Customer Timeout、Lifecycle Messages、Channel-specific Rules、Webchat Recall Limit。

截至 2026-06-03 16:50 +08:00，本轮继续调整 `Routing Config > Working Time Plans` 弹框排班行样式：

- Work/Ramadan/Holiday/Special 的标题右侧按钮文案统一简化为 `Add`。
- Work/Ramadan/Holiday/Special 的多行排班继续只第一行显示字段名，后续行不重复显示字段名。
- 排班行不再使用每行外边框、卡片背景或横向分隔线，仅保留紧凑行间距。
- Holiday Schedule 不再展示 `Closed All Day` 开关，也不再展示 `Non-working Start / Non-working End` 文案；字段简化为 Start Date、End Date、Holiday Name、Start、End。
- Holiday Schedule 新增默认时间段为 `00:00-23:59`，用于表达原全天关闭口径；保存时仍把历史 `closedAllDay` 归一化为 false 并保证有时间段。
- Ramadan、Holiday、Special 的日期字段从浏览器原生 `input type="date"` 改为 AntD DatePicker，受 `ConfigProvider locale={enUS}` 控制，避免跟随系统语言显示中文日期控件。
- 新增直接依赖 `dayjs`，用于 DatePicker 值转换。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认 Add 弹框可打开，页面不再出现 `Add Row`、`Closed All Day`、`Non-working` 或原生 date input；编辑已有方案时有 6 个 AntD DatePicker，日期弹层显示 `Today` / `Select date`，未出现中文日期文案。

截至 2026-06-03 16:13 +08:00，本轮继续调整 `Routing Config > Working Time Plans`：

- 列表字段按用户口径调整为 Plan ID、Plan Name、Description、Updated Date、Updated By、Status、Actions。
- 列表不再展示 Work Schedule 和 Ramadan Period；这些详细排班只留在 View/Edit 弹框中维护。
- `WorkingTimePlan` 类型和 mock 新增 `updatedBy`；新增/编辑保存时默认写入 `Admin`，用于前端 demo 展示更新人。
- 弹框样式从上一轮紧凑表格式行回退为普通分区卡片和字段行；Work/Ramadan/Holiday/Special 的每行字段恢复独立 label，不再使用表头式 `Weekdays / Start / End` 网格。
- 本轮不改变 15:57 确认的业务规则：无 timezone、无真实 Default 24x7 记录、Skill Queue 空工作时间方案显示 Default 24x7、Ramadan Work Schedule 作为常规工作日日期段覆盖。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认列表无 Work Schedule / Ramadan Period 列，存在 Description / Updated By 列，Updated By 示例为 Admin；Add 弹框已打开并确认不再出现 `Weekdays Start End` 表头式录入。

截至 2026-06-03 15:57 +08:00，本轮调整 `Routing Config > Working Time Plans` 与 `Skill Queues` 的工作时间口径：

- 本项目当前按印尼单国家场景处理，`WorkingTimePlan` 类型、mock、查询区、列表和弹框均移除 `timezone`；后续如果扩展多国家/多时区，再把时区加回工作时间方案层。
- `Working Time Plans` 只维护自定义工作时间方案，不再维护真实 `Default 24x7` 方案记录；默认 mock 删除 `WTP_24X7`。
- `Skill Queues` 的 `Work Time Plan` 改为非必填；未选择方案时内部保存空字符串，列表、详情和弹框明确展示 `Default 24x7`。
- `WorkingTimePlan` 类型新增 `ramadanSchedule`，包含 `enabled`、`dateFrom`、`dateTo` 和 Ramadan 专属 `workSchedules`。
- Working Time Plans 列表改为 `Keyword / Status` 查询，字段为 Plan ID、Plan Name、Work Schedule、Ramadan Period、Updated Date、Status、Actions，不展示 Timezone、Schedule Mode、Created Date。
- Add/Edit/View 弹框按 `Basic Info / Work Schedule / Ramadan Work Schedule / Holiday Schedule / Special Working Plan` 分区；Ramadan 默认可见标题并由开关启用，启用后配置一个日期段和工作日时间，可一键 Copy from Work Schedule。
- 排班运行时口径更新为：未选择工作时间方案时直接 `Default 24x7`；选择方案后按 `Special Working Plan > Holiday Schedule > Ramadan Work Schedule > Work Schedule` 判断；已选择方案但不命中任何工作规则时视为非工作时间。
- 行录入从大卡片改为紧凑表格行，控件高度统一为 32px，减少线框和大面积背景。
- 校验规则为：自定义方案至少一条 Work Schedule；Ramadan 启用后必须填写日期段并至少一条 Ramadan 工作时间；日期起始不能晚于结束，时间起始必须早于结束；被技能队列引用的自定义方案不能直接删除。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/working-time-plans`：确认列表不再显示 Timezone / Schedule Mode / Default 24x7 真实记录，Add 弹框包含 Basic Info、Work Schedule、Ramadan Work Schedule、Holiday Schedule、Special Working Plan；启用 Ramadan 后显示 Start Date、End Date、Copy from Work Schedule。
- Browser `/routing-config/skill-queues`：确认列表和 Add 弹框均可见 `Default 24x7`，`Work Time Plan` 不再有必填星号，`Routing Method` 未回流。
- Browser 日志仍有既有 AntD deprecation warnings：`Alert.message`、`InputNumber.addonAfter`。

截至 2026-06-03 14:36 +08:00，本轮继续调整 `Routing Config > Skill Routing Rules` 查询工具栏：

- 确认当前空白来自规则页 `Batch Add` 区块的 `margin-left: auto`，该规则会在第一行给 Add 单独推开一块右侧空间。
- 规则页专用 `.routing-config-page__filters--rules .routing-config-page__add-action` 的 `margin-left` 改为 `0`，让 Batch Add 按 DOM 顺序自然排布，不再独占右侧空白。
- `Target Skill Queue` 查询框宽度从 `240px` 改为 `180px`，与其它查询框一致，避免比其它查询条件明显更宽。
- DOM 顺序保持 Access Site、Channel、Media Type、Language Type、Business Type、Target Skill Queue、Status、Search、Reset、Batch Add。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules` DOM 检查：确认 Target Skill Queue 在 Business Type 后，Status 在 Target Skill Queue 后，Search / Reset / Batch Add 在 Status 后。

截至 2026-06-03 13:38 +08:00，本轮继续调整 `Routing Config > Skill Routing Rules`：

- Edit 弹框中的 Status 从下拉框改为普通配置页一致的短胶囊 switch + Enabled/Disabled 文案。
- 技能路由规则查询工具栏改为单行流式布局：启用路由要素、Target Skill Queue、Status、Search、Reset 依次排列，Batch Add 在同一行有空间时靠右显示。
- 规则列表 Actions 列设置为 `fixed: 'right'`；横向滚动时只滚动非操作列，操作按钮保持可见。
- 通用 `RoutingConfigCrudPage` 之前已将普通 CRUD 操作列固定到右侧；本轮补齐 `SkillRoutingRulesPage` 这种手写表格。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown plugin timing 和 chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认列表仍为启用要素独立列，Actions 列存在。
- Browser Edit 弹框：确认 Status 为 switch，且不再出现 `combobox "Status"`。

截至 2026-06-03 13:32 +08:00，本轮继续调整 `Routing Config > Skill Routing Rules`：

- 主查询区中的启用路由要素筛选从单选 `All / Empty / value` 改为多选下拉；空选择表示不限制该要素，不再提供 `All` 或 `Empty` 选项。
- 主列表不再使用单个 `Elements` 合并列，改为按当前启用要素拆出 Access Site、Channel、Media Type、Language Type、Business Type 独立列，与 Batch Add 拆分预览表的保存结果更一致。
- 主列表列宽收紧，Target Skill Queue、Updated Date、Updated By、Status、Actions 保持紧凑展示。
- View/Edit 弹框去掉旧的要素卡片区，改为普通管理台两列表单：启用要素只读，Target Skill Queue 和 Status 按模式可编辑，Updated Date / Updated By 只读展示。
- Edit 弹框仍不展示 Priority 字段；DOM 中如出现 `Priority` 只来自技能队列名称 `Card Emergency Priority`。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认主列表出现 Access Site、Channel、Media Type、Language Type、Business Type 独立列，无 Elements / Route Conditions / Effective From 列。
- Browser 启用要素筛选下拉：确认包含 Jakarta / Surabaya 等实际选项，不包含 All / Empty。
- Browser Edit 弹框：确认使用标准字段布局，包含启用要素、Target Skill Queue、Status、Updated Date、Updated By，且没有 Priority 编辑字段。

截至 2026-06-03 13:21 +08:00，本轮继续调整 `Routing Config > Skill Routing Rules`：

- 主查询区删除 `Keyword / Rule ID` 搜索，改为动态展示当前启用路由要素筛选项：Access Site、Channel、Media Type、Language Type、Business Type。
- 查询区继续保留 Target Skill Queue 和 Status，Status 只显示 All / Enabled / Disabled；空路由要素可通过 Empty 选项筛选，列表与详情不显示 `ANY`。
- 主列表列调整为 Rule ID、Elements、Target Skill Queue、Updated Date、Updated By、Status、Actions，移除 Priority 和 Effective From 主列。
- `RoutingRule` 类型和默认 mock 新增 `updatedAt`、`updatedBy`；Batch Add 新增/覆盖和单行编辑保存时同步更新时间与默认更新人 `Admin`。
- Batch Add 下方表改为 Generated Routing Rules Preview，展示本次拆分生成/覆盖的规则行；重复行默认勾选，取消勾选则保留原技能队列，新行默认保存。
- Batch Add 预览表新增 Status 列，压缩选择列和要素列，避免表格内容超出弹框。
- View/Edit 弹框仍针对单条拆分规则；Edit 只允许修改 Target Skill Queue 和 Status，不再展示 Priority 输入。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认 Keyword 消失，启用路由要素筛选、Updated Date、Updated By 出现，Route Conditions / Published Routing Rule Index 不再出现。
- Browser Batch Add：确认 Generated Routing Rules Preview、覆盖提示、Original Skill Queue、Target Skill Queue、Status 出现，且无 `ANY` 文案。
- Browser Edit 弹框：确认编辑内容只包含 Target Skill Queue 和 Status；DOM 中的 `Priority` 来源是目标技能队列名称 `Card Emergency Priority`，不是字段。

截至 2026-06-03 13:03 +08:00，本轮继续调整 `Routing Config > Skill Routing Rules`：

- Batch Add 路由要素不再提供 `ANY` 选项；用户可清空某个要素，多选值为空时按空字符串保存。
- 组合生成、重复判断、规则 key 生成和新增规则保存都使用空字符串表示“不限定该路由要素”，不再自动转成 `ANY`。
- 规则列表、View/Edit 条件区、重复表格遇到空值时显示为空，不显示 `ANY`。
- 默认 mock routingRules 中原 `factorValueCode: 'ANY'` 改为空字符串。
- `Duplicate Route Combinations` 标题下新增英文轻量说明：`Duplicate route combinations found. Checked rows will update the existing skill queue to the selected target queue; unchecked rows will keep their current configuration.`

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules` Batch Add：确认弹框无 `ANY` 文案，重复提示文案出现，重复行和全选仍正常。
- Browser Batch Add：点击一个已选要素的删除按钮后，字段可保持空白，弹框仍正常且不显示 `ANY`。

截至 2026-06-03 12:54 +08:00，本轮继续调整 `Routing Config > Skill Routing Rules` Batch Add 弹框：

- Batch Add 默认示例改为 3 个站点重复组合，默认选择 Jakarta Site、Surabaya Site、Singapore DR Site，方便展示多行重复数据。
- 默认 mock 路由规则新增 2 条 WhatsApp / Text / Indonesian / General Service 的 Surabaya 和 Singapore DR 站点规则，使重复组合表格默认出现多行。
- 路由要素多选下拉只显示元素名称，不再显示括号内元素 ID。
- 技能队列下拉和重复表格中的技能队列只显示技能名称，不再显示括号内技能 ID。
- 重复组合表格表头增加全选 checkbox，支持一次勾选或取消全部重复行。
- Batch Add 弹框字段标签列从 160px 收紧到 104px，并降低普通字段标签字重，缩短标签与输入框距离；仅分块标题保持加粗。
- 重复组合表格列宽进一步压缩并取消横向 scroll，避免表格内容超出弹框。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules` Batch Add：确认表头全选存在，重复示例包含 Jakarta / Surabaya / Singapore DR 三个站点，下拉和技能名称不显示括号编码，Route Elements / Target Routing 分区仍正常。
- Browser 截图复查尝试因 browser 截图命令超时未完成；DOM 检查和前序可视截图已确认关键结构。

截至 2026-06-03 12:26 +08:00，本轮调整 `Routing Config > Skill Routing Rules`：

- 主页面保留 `PageContainer` 标题 `技能路由规则配置`，删除表格卡片上的重复标题，避免查询区上方再次显示菜单名称。
- 删除底部 `Published Routing Rule Index` 展示区及相关展开状态和运行时索引表格 UI；底层规则数据和匹配逻辑不受影响。
- Batch Add 弹框改为分区结构：`Route Elements` 和 `Target Routing`。
- 启用路由要素在 Batch Add 弹框中改为一行一个多选下拉，当前默认 5 个要素为 Access Site、Channel、Media Type、Language Type、Business Type。
- Batch Add 不再展示 Priority 输入、Overwrite checkbox、组合数量摘要、重复数量摘要和目标队列摘要；新增和覆盖仍使用内部默认 priority `70`。
- 重复组合提示改为下方紧凑表格，列包括勾选框、所有启用要素值、Original Skill Queue、Target Skill Queue。
- 重复组合默认全部勾选；取消某行后保存不会覆盖该重复规则。
- 如果本次只有重复组合且全部取消勾选，保存不执行变更，并在弹框内显示 `No routing rule changes selected.`。
- 现有主列表和 Edit 弹框中的 Priority 本轮保留，避免扩大数据字段范围。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认页面标题只出现一次，不再显示 `Published Routing Rule Index`。
- Browser Batch Add：确认 Route Elements / Target Routing 分区存在，5 个要素逐行展示，Overwrite 和摘要卡片已移除。
- Browser Batch Add 重复表格：确认重复组合默认勾选，取消勾选后保存显示 `No routing rule changes selected.` 且弹框保持打开。

截至 2026-06-03 12:08 +08:00，本轮调整 `Routing Config > Skill Queues`：

- `SkillQueue` 类型和默认 mock 数据新增 `vdnCode`，用于表示技能队列所属 VDN。
- 技能队列查询区调整为 `Keyword + VDN + Status`，其中 `VDN` 位于 `Status` 前，选项来自 `VDN配置` 主数据。
- 技能队列列表在 `Skill Name` 后新增 `VDN` 列，展示 VDN 名称而不是编码。
- Add/Edit/View 弹框新增必填 `VDN` 单选下拉，默认选择第一个可用 VDN；保存时校验不能为空。
- `VDN配置` 删除保护补充检查技能队列引用；被技能队列使用的 VDN 不能直接删除。
- 本次仅为技能队列主数据维护增加所属 VDN 字段，不改变 `Route Elements` 默认不展示 VDN 的口径，也不把 VDN 重新加入 `Skill Routing Rules` 启用路由要素。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning 和 plugin timing 提示。
- Browser `/routing-config/skill-queues`：确认查询区包含 `Keyword / VDN / Status`，列表在 Skill Name 后显示 VDN 名称，Add 弹框包含必填 VDN 下拉并默认显示 `Retail Inbound VDN`。
- Browser `/routing-config/skill-queues`：最终刷新确认 VDN 查询、VDN 列、`Retail Inbound VDN` 和 `Card Emergency VDN` 均正常显示。

截至 2026-06-03 12:02 +08:00，本轮调整 `Routing Config > Route Elements` 与 `Skill Routing Rules`：

- `Route Elements` 默认数据按用户最新口径调整为 8 个要素，列表顺序固定为：Access Site、Channel、Media Type、Country、Language Type、Business Type、Access Account、Access Entry。
- `Country`、`Access Account`、`Access Entry` 默认禁用；其它默认启用。
- `VDN` 不再作为默认 Route Element 展示；`VDN配置` 菜单和 VDN 主数据仍保留。
- Route Elements 页面数据按 `displayOrder` 排序展示，新增要素默认 `displayOrder = 99`，不会插入到默认 8 个要素前面。
- 默认 `routingRules.conditions` 已移除 `factorCode: '10'` 的 VDN 条件，避免默认规则引用已不展示的路由要素。
- `Skill Routing Rules` 继续只使用 `enabled === true && status === 'Active'` 的要素；因此 Batch Add、Route Conditions、View/Edit 条件区和 Published Routing Rule Index 均不展示禁用要素，也不展示 VDN。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：确认顺序为 Access Site、Channel、Media Type、Country、Language Type、Business Type、Access Account、Access Entry；Country / Access Account / Access Entry 为 Disabled；不显示 VDN。
- Browser `/routing-config/skill-routing-rules`：确认 Route Conditions、Batch Add 弹框、Published Routing Rule Index 展开后只展示启用要素，不展示 Country / Access Account / Access Entry / VDN。

截至 2026-06-03 11:39 +08:00，本轮调整 `Routing Config > Skill Routing Rules`：

- 页面保留技能路由规则的专用业务逻辑：启用路由要素组合、`ANY`、批量生成、重复检测、覆盖保存、运行时索引。
- 主页面改为管理台标准结构：`Keyword + Target Skill Queue + Status` 查询区、`Search / Reset` 操作、右侧独立 `Batch Add` 按钮、分页表格。
- `Keyword` 匹配 `Rule ID`、route factor value、route factor label、target queue code 和 target queue name。
- 规则列表不再把每个启用要素拆成独立列，改为 `Route Conditions` 紧凑 chips 汇总列，减少横向滚动。
- 规则列表字段为 `Rule ID`、`Route Conditions`、`Target Skill Queue`、`Priority`、`Effective From`、`Status`、`Actions`。
- `Batch Add Routing Rules` 不再常驻页面顶部，改为点击 `Batch Add` 打开专用弹框。
- Batch Add 弹框保留所有启用路由要素多选、`Target Skill Queue`、`Priority`、`Overwrite duplicate route combinations`、组合数量、重复数量和重复组合提示。
- 重复组合且未勾选覆盖时保存会被阻止；勾选覆盖后沿用当前 demo 逻辑更新重复规则并新增非重复规则。
- View/Edit/Delete 弹框保留规则约束：Route Conditions 只读，Edit 只能改目标技能队列、优先级和状态。
- `Published Routing Rule Index` 改为默认折叠的次级卡片，展开后展示现有运行时索引表。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-routing-rules`：确认查询区、Batch Add 按钮、Route Conditions 列、Status 列、默认折叠的 Published Routing Rule Index。
- Browser Batch Add：确认弹框包含启用要素多选、覆盖复选框、组合/重复摘要；重复且未覆盖时阻止保存。
- Browser Edit：确认 Route Conditions 只读，目标队列、优先级、状态可编辑。
- Browser Published Routing Rule Index：确认默认折叠，点击后可展开并显示索引表。

截至 2026-06-03 11:00 +08:00，本轮继续调整 `Routing Config > Access Accounts`：

- 列表去掉 `Key Config` 字段；该字段对业务维护价值不高，完整渠道差异配置仍放在 View/Edit 弹框内查看。
- 列表保留并确保展示 `Status` 字段。
- Mock 中补齐除 Phone 外的所有渠道账号示例：Haloapp、webchat、WhatsApp、Email、Instagram、LinkedIn、Facebook、X、Tik Tok、YouTube、AppStore、playstore。
- 每个渠道示例仍使用结构化 `extensionConfig`，不保存真实密钥原文。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/access-accounts`：确认列表有 `Status` 列、没有 `Key Config` 列、12 个非电话渠道示例均可见、无 Phone 账号示例。
- Browser Add 弹框：确认动态字段仍正常，未回退到 `Channel-specific Config` 文本域。

截至 2026-06-03 10:45 +08:00，本轮调整 `Routing Config > Access Accounts`：

- 页面继续使用账号数据列表维护方式，不采用按渠道卡片分组，方便搜索、分页、状态筛选和多账号维护。
- 查询区改为 `Keyword + Channel + Status`；Keyword 同时匹配 `Account ID`、`Account Name`、`External Account ID`、`Channel Code` 和 Channel Name。
- 列表字段为 `Account ID`、`Account Name`、`Channel`、`External Account ID`、`Secret Ref`、`Status`、`Actions`。
- `Phone` 不出现在 Access Accounts 的 Channel 下拉中；`Phone` 仍保留在 Channels 页面，作为电话接入渠道配置。
- 新增/编辑弹框的通用必填字段为 `Account ID`、`Account Name`、`Channel`、`External Account ID`、`Secret Ref`、`Status`。
- `Channel-specific Config` 自由文本域不再展示；`AccessAccount.extensionConfig` 从字符串调整为结构化对象。
- Channel 变更时动态展示该渠道必要字段，例如 Haloapp 展示 `Tenant ID`、`App ID`、`Webhook URL`、`Signature Secret Ref`；Email 展示 mailbox、IMAP、SMTP 和 auth secret reference 字段。
- 账号页不维护机器人/人工入口 ID、支持媒体类型等非账号属性；这些应由渠道、入口或路由策略相关页面承载。
- 密钥、token、private key、password 不保存原文，只保存 `Secret Ref` 或渠道专属的 secret reference 字段。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning 和 plugin timing 提示。
- Browser `/routing-config/access-accounts`：确认页面可打开，查询区包含 Keyword / Channel / Status，列表字段可正常展示。
- Browser Add 弹框：确认默认 Haloapp 动态字段出现，无 `Channel-specific Config`、支持媒体类型、机器人/人工入口字段。
- Browser Channel 下拉：确认没有 `Phone` 选项；切换到 `webchat` 后弹框显示 `Widget ID`、`Allowed Domain` 等 Webchat 字段。

截至 2026-06-03 01:22 +08:00，本轮调整 `Routing Config` 二级菜单顺序和名称：

- 路由路径保持不变，避免旧链接失效。
- 左侧 `Routing Config` 二级菜单按以下顺序显示：
  1. `路由要素配置`
  2. `VDN配置`
  3. `接入站点配置`
  4. `渠道配置`
  5. `业务类型配置`
  6. `技能队列配置`
  7. `接入账号配置`
  8. `站点接入量配置`
  9. `技能路由规则配置`
  10. `工作时间方案配置`
- 对应页面左上角标题同步改为同名中文，符合“页面左上角只显示当前菜单名称”的统一规则。
- `Skill Routing Rules` 独立页面的 PageContainer 标题和列表卡片标题同步为 `技能路由规则配置`。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：展开左侧导航后确认 10 个二级菜单按指定中文顺序展示。

截至 2026-06-03 01:05 +08:00，本轮继续调整 `Routing Config > Skill Queues`：

- Keyword 查询不再匹配状态，只匹配 `Skill ID`、`Platform Skill ID`、`Skill Name`；状态仍保留独立 `Status` 下拉筛选。
- Keyword placeholder 改为 `Skill ID / Platform Skill ID / Skill Name`。
- Skill Queues 表格列宽收窄，并移除该页强制 `tableScrollX`，避免在可用空间充足时仍出现横向滚动条。
- Add/Edit/View 弹框移除 `Queue Prompts` 字段；保存时仍保留已有 `prompts` 数据或新增默认 prompt，避免破坏底层 mock 结构。
- CRUD 弹框中的普通输入框、下拉框、带单位数字输入框高度统一为同一管理台控件高度。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-queues`：确认 Keyword placeholder 不含 Status，列表无 `Queue Prompts` / `Routing Method`。
- Browser `/routing-config/skill-queues`：确认 Add 弹框无 `Queue Prompts`，仍显示 `Work Time Plan`、`Supports Video`、`Max Queue Size`、`Queue Timeout`、只读 `Assigned Agents` 和 `Status`。

截至 2026-06-03 00:54 +08:00，本轮调整 `Routing Config > Skill Queues`：

- 查询区改为 `Keyword + Status`；Keyword 同时匹配 `Skill ID`、`Platform Skill ID`、`Skill Name`。
- 列表 `Work Time` 改为 `Work Time Plan`，展示工作时间方案名称；未选择自定义方案时展示 `Default 24x7`，不直接显示方案编码。
- 列表新增 `Supports Video` 字段，展示 `Yes / No`。
- `Max Queue Size` 列表展示带单位 `items`；`Queue Timeout` 列表展示带单位 `sec`。
- 新增默认值调整为 `Max Queue Size = 60 items`、`Queue Timeout = 100 sec`、`Supports Video = No`。
- `Max Queue Size` 范围校验为 `1-60000`；`Queue Timeout` 范围校验为 `0-10000`。
- 弹框大部分可维护字段标记必填；`Platform Skill ID` 纳入保存校验，`Work Time Plan` 不必填，空值表示 `Default 24x7`。
- 弹框去掉 `Routing Method` 字段，并从 `SkillQueue` 类型和 mock 数据中移除 `routingMethod`。
- 弹框保留 `Assigned Agents`，但作为禁用只读字段展示，不允许新增/编辑时输入。
- `SkillQueue` 类型和 mock 数据新增 `supportsVideo: boolean`。
- 通用 `RoutingConfigCrudPage` 增加数字字段 `min/max/addonAfter` 和全程 `readOnly` 字段能力，供技能队列和后续管理台页面复用。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/skill-queues`：确认列表表头包含 `Work Time Plan`、`Max Queue Size`、`Queue Timeout`、`Supports Video`、`Agents`、`Status`，无 `Routing Method`。
- Browser `/routing-config/skill-queues`：确认列表工作时间显示方案名称，最大排队和超时显示 `items/sec` 单位，视频支持显示 `Yes/No`。
- Browser `/routing-config/skill-queues`：确认 Add 弹框默认 `Max Queue Size = 60 items`、`Queue Timeout = 100 sec`、`Supports Video = No`，`Assigned Agents` 为 disabled，只读显示。

截至 2026-06-03 00:34 +08:00，本轮继续调整 `Routing Config > Site Access Volume`：

- Site Access Volume 从通用单记录 CRUD 改为自定义管理页，保留相同管理台 toolbar、表格、分页、状态 badge、弹框和操作按钮规范。
- 列表从渠道一行摘要改为每个 `Channel + Media Type` 一行，但同一渠道的 `Channel ID`、`Channel Name`、`Status`、`Actions` 使用合并单元格展示。
- 列表列调整为 `Channel ID`、`Channel Name`、`Media Type`、`Site Configuration`、`Status`、`Actions`。
- 列表不再显示 `Ratio Group ID`、`Site Ratios` 和 `Total`；`Total` 仅保留在新增/编辑弹框里作为录入时即时辅助提示。
- Haloapp 在列表中展示为三行媒体数据：Voice、Video、Text；渠道、状态和操作只在合并后的渠道单元格中显示一次。
- `Site Configuration` 按当前媒体拼接站点比例，例如 `Jakarta Site 34% | Surabaya Site 33% | Singapore DR Site 33%`，站点增多时自然换行。
- View/Edit/Delete 现在按 channel-level 操作；Delete 会删除该渠道下所有媒体的接入量比例组，并在确认文案中说明是 channel-level delete。
- mock 中补齐 Haloapp Voice / Video 默认比例组，使默认列表即可体现 Haloapp 的三媒体配置。
- 新增弹框先选择 `Channel`，再按该渠道在 Channels 中配置的 `mediaTypes` 自动展开多个媒体分组。
- 新增弹框顶部 `Channel` / `Status` 控件改为固定宽度，不再横向撑满弹框。
- 媒体分组标题只显示媒体名，例如 `Voice`、`Video`、`Text`，不再重复显示已选渠道。
- 每个媒体分组按纵向行列出 Sites 菜单中的所有站点；站点行只显示站点名称，不再重复显示站点编码。
- 站点比例输入框增加 `%` 后缀，录入值仍保持数字。
- 弹框内站点名称和比例输入框改为紧凑两列，避免站点名与比例输入距离过远。
- Add 弹框中已存在接入量配置的渠道置灰禁选；新增默认选择第一个未配置渠道，后续调整已有渠道走 Edit。
- 每个 `Channel + Media Type` 下所有站点比例合计必须为 100%，保存前逐媒体校验。
- 新增时一次保存该渠道下所有媒体比例组；例如 Haloapp 会保存 Voice、Video、Text 三条 `channel + media` 比例记录。
- 查看、编辑、删除在列表上按渠道维度操作；底层仍保存为多条 `Channel + Media Type` 比例组。
- 去除 `Business Override`、`Language Override` UI 字段，并从 `SiteAccessRatioGroup` 类型中移除 `businessTypeCode`、`languageCode`。
- 旧 textarea 比例输入方式被替换为站点矩阵输入；`project/business/language` 覆盖逻辑不再出现在该页面。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/site-access-volume`：确认列表无 `Total` / `Site Ratios` / `Ratio Group ID` 列，表头为 `Channel ID`、`Channel Name`、`Media Type`、`Site Configuration`、`Status`、`Actions`。
- Browser `/routing-config/site-access-volume`：确认 Haloapp 展示为 Voice、Video、Text 三行，渠道、状态和操作单元格合并展示。
- Browser `/routing-config/site-access-volume`：确认 `Site Configuration` 按媒体拼接展示 `Jakarta Site xx% | Surabaya Site xx% | Singapore DR Site xx%`。
- Browser `/routing-config/site-access-volume`：Add 弹框可打开，默认渠道切到未配置的 webchat，新增打开时不提前展示校验错误。
- Browser `/routing-config/site-access-volume`：代码层确认 Add 下拉中已配置渠道会置灰禁选；浏览器 DOM 已确认默认值不再落到已配置渠道。
- Browser `/routing-config/site-access-volume`：通过可见坐标切换到 Haloapp，确认 Add 弹框展示 Voice、Video、Text 三个媒体分组；每组站点纵向展示、只显示站点名称，比例输入框带 `%` 后缀。
- Browser 插件对 `InputNumber` 的填值/重输存在虚拟剪贴板限制，未完成错误比例保存阻止的自动化复测；代码中的逐媒体 100% 校验逻辑本轮未改动，仍建议人工复查一次。

截至 2026-06-02 22:46 +08:00，本轮调整 `Routing Config > Business Types`：

- Business Types 查询区改为 `Keyword + Status`。
- `Keyword` 匹配 `Business Type ID` 和 `Business Name`，placeholder 为 `Business Type ID / Name`。
- 列表去掉 `Project` 列，仅显示 `Business Type ID`、`Business Name`、`Status` 和操作列。
- 新增/编辑弹框也隐藏 `Project Code`，`projectCode` 仍作为内部默认 `BANK1` 保留，避免影响项目范围唯一性。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/business-types`：确认查询区有 `Business Type ID / Name` 和 `Status`，列表无 `Project` 列。
- Browser `/routing-config/business-types`：Add 弹框包含 `Business Type ID`、`Business Name`、`Status`，不显示 `Project Code`，新增打开时不提前展示校验错误。

截至 2026-06-02 22:37 +08:00，本轮精简 `Routing Config` 菜单与路由：

- 从左侧 `Routing Config` 二级菜单删除 `Channel Media`、`Media Types`、`Languages`、`Access Entries`。
- 删除对应路由：`/routing-config/channel-media`、`/routing-config/media-types`、`/routing-config/languages`、`/routing-config/access-entries`，直接访问旧 URL 走现有 fallback 回 `/`。
- 删除对应页面组件导出：`ChannelMediaPage`、`MediaTypesPage`、`LanguagesPage`、`AccessEntriesPage`。
- 保留底层 `mediaTypes`、`languageTypes`、`channelMediaSettings`、`accessEntries` mock/store 数据，继续供 Channels、Site Access Volume、Skill Routing Rules 和内部 mock 关系使用。
- 保留 `Access Accounts` 菜单，用账号列表维护同一数字渠道下的多个官方账号；`Phone` 不作为接入账号渠道出现。
- `Access Accounts` 的渠道差异字段已从自由文本 `Channel-specific Config` 调整为按 Channel 动态展示的结构化字段；列表不展示 `Key Config`，只展示账号主数据和状态。
- `Channels` 删除保护不再因为隐藏的 `Channel Media` 数据阻止删除；`Access Accounts` 删除保护不再因为隐藏的 `Access Entries` 数据阻止删除。
- `VDN` 删除保护也不再因为隐藏的 `Access Entries` 数据阻止删除，只保留 routing rules 依赖保护，避免不可见页面数据卡住用户操作。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels`：确认页面仍可用，旧菜单文字 `Channel Media`、`Media Types`、`Languages`、`Access Entries` 不再出现在快照中。
- Browser `/routing-config/access-accounts`：确认 Access Accounts 页面可打开。
- Browser `/routing-config/route-elements`、`/routing-config/skill-routing-rules`：确认保留页面仍可打开并显示关键内容。
- Browser 旧 URL：`/routing-config/channel-media`、`/routing-config/media-types`、`/routing-config/languages`、`/routing-config/access-entries` 均回到 `/`，不再进入旧页面。

截至 2026-06-02 22:04 +08:00，本轮调整 `Routing Config > Channels`：

- Channels 列表字段改为 `Channel ID`、`Channel Name`、`Media Type`、`Max Concurrent Calls`、`Min Scan Interval (s)`、`Status`。
- 页面可见 `Channel ID` 新增为非序列数字编码字段，内部仍保留 `channelCode` 作为路由规则、接入账号、接入入口等引用键，避免扩大引用迁移风险。
- Channels mock 补齐 13 个渠道：Phone、Haloapp、webchat、WhatsApp、Email、Instagram、LinkedIn、Facebook、X、Tik Tok、YouTube、AppStore、playstore。
- 媒体类型按用户口径配置：Phone 仅 Voice；Haloapp 和 webchat 包含 Voice / Video / Text；其它渠道仅 Text。
- 默认 `Max Concurrent Calls` 为 50，`Min Scan Interval Seconds` 为 30。
- `RoutingConfigCrudPage` 新增 `multiSelect` 字段和筛选能力；Channels 新增/编辑弹框的 `Media Type` 使用多选下拉，查询区为 `Keyword + Media Type + Status`。
- Channels `Keyword` 匹配 `Channel ID` 和 `Channel Name`；`Media Type` 查询为多选；`Status` 仍为 `All / Enabled / Disabled`。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/channels`：确认页面可见 `Channel ID / Name`、`Media Type`、`Channel ID`、`Max Concurrent Calls`、`Min Scan Interval (s)`、Phone、Haloapp、Tik Tok、playstore 和底部分页。
- Browser `/routing-config/channels`：Add 弹框可打开，包含 Channel ID、Channel Name、Media Type、Max Concurrent Calls、Min Scan Interval Seconds、Save，默认值 50 / 30，新增打开时不提前展示校验错误。
- Browser 文本输入验证受 in-app browser 虚拟剪贴板限制影响，未完成实际输入过滤操作；代码层和页面渲染检查已通过。

截至 2026-06-02 21:52 +08:00，本轮调整 `Routing Config > Route Elements` 查询条件：

- Route Elements 查询区由 `Element ID`、`Element Name`、`Status` 三个条件改为 `Keyword + Status`。
- Route Elements `Keyword` 支持对 `Element ID` 和 `Element Name` 做多字段模糊搜索，placeholder 为 `Element ID / Name`。
- `Status` 继续使用 `All / Enabled / Disabled` 下拉，复用普通配置页状态筛选选项。
- Route Elements、VDN、Sites 当前都采用 `Keyword + Status` 查询结构。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：确认查询区只有 `Keyword` 和 `Status`，不存在单独的 `Element ID` / `Element Name` 查询框；placeholder 为 `Element ID / Name`。

截至 2026-06-02 21:47 +08:00，本轮调整 `Routing Config > Sites` 与 VDN / Sites 查询条件：

- Sites 页移除顶部 timezone 提示，不再显示页内提示条。
- Sites 页移除 `Country Code` / `Country` UI 字段：列表、弹框、校验和搜索字段均不再展示国家 ID；内部 `countryCode` 仍保留默认值，避免影响 mock 数据结构和潜在引用。
- Sites 新增/编辑弹框实体名改为单数 `Site`，标题显示 `Add Site`。
- VDN 与 Sites 查询区统一为 `Keyword + Status`：Keyword 做多字段模糊搜索，Status 用 `All / Enabled / Disabled` 下拉。
- VDN Keyword 匹配 `VDN ID`、`VDN Name`、`Platform VDN ID`；Sites Keyword 匹配 `Site ID`、`Site Name`。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/vdn`：确认查询区包含 `Keyword`、`Status`，Keyword placeholder 为 `VDN ID / Name / Platform ID`。
- Browser `/routing-config/sites`：确认无顶部 timezone 提示，无 `Country` 字段；列表列为 `Site ID`、`Site Name`、`Owner`、`Owner Phone`、`Address`、`Status`；Add 弹框为 `Add Site` 且无 Country 字段。

截至 2026-06-02 21:23 +08:00，本轮调整 `Routing Config > VDN` 管理页：

- `Platform VDN ID` 在新增/编辑弹框中改为必填，并纳入保存校验。
- VDN 弹框字段顺序调整为 `VDN ID`、`VDN Name`、`Platform VDN ID`、`Status`、`Description`，避免 textarea 把第二行高度撑高后让状态控件错位。
- `RoutingConfigCrudPage` 字段配置新增 `fullWidth` 能力，VDN `Description` 独占整行，输入框可横向拉宽。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning 和 plugin timing 提示。
- Browser `/routing-config/vdn`：Add 弹框可打开，`Platform VDN ID*` 显示必填星号；空保存时提示 `Platform VDN ID is required.`；字段顺序为 `Platform VDN ID` 与 `Status` 同行，`Description` 在后。

截至 2026-06-02 20:04 +08:00，本轮补齐 `Routing Config` 管理台按钮尺寸统一：

- `src/styles/index.less` 将共享 CRUD 弹框 footer 按钮纳入同一套管理台按钮规则。
- 外部查询区 `Search` / `Reset` 与弹框 `Cancel` / `Save` / `Delete` 均按 82px 宽、32px 高、12px 字号和同一圆角展示。
- 该样式通过 `RoutingConfigCrudPage` 共享，Route Elements、VDN 等普通配置页弹框都会继承。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：Add 弹框可正常打开，`Cancel` / `Save` 正常出现。

截至 2026-06-02 20:01 +08:00，本轮统一 `Routing Config` 页面顶部：

- `RoutingConfigCrudPage` 不再向 `PageContainer` 传 `description` 和 `eyebrow`，普通配置页左上角只显示菜单名称。
- `SkillRoutingRulesPage` 也移除 `Routing Config` eyebrow 和说明文案，只保留 `Skill Routing Rules` 页面标题。
- 页面标题右侧不再承载普通 CRUD 的 `Add`，`Add` 已统一放在表格上方工具栏右侧。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`、`/routing-config/vdn`、`/routing-config/skill-routing-rules`：确认顶部只有页面标题，没有 `Routing Config` eyebrow，也没有说明文案。

截至 2026-06-02 19:54 +08:00，本轮统一 `Routing Config` 普通配置页管理台工具栏：

- `RoutingConfigCrudPage` 不再让无自定义筛选的页面把 `Add` 放在页面标题右侧；普通配置页也统一在表格上方显示 `Keyword` 搜索、`Search`、`Reset` 和右侧 `Add`。
- 新增 `searchDraft`，普通 Keyword 搜索改为点击 `Search` 后应用，点击 `Reset` 清空并恢复全部数据，行为与管理台查询表单一致。
- `routing-config-page` 新增统一控件高度变量 `--routing-config-control-height: 32px`。
- 查询输入框、SearchInput、下拉框、Search/Reset/Add 按钮统一 32px 高度，避免按钮比输入框高。
- VDN 等普通配置页继承该工具栏样式，作为后续管理台配置菜单统一标准。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：确认 Element ID、Element Name、Status、Search、Reset、Add、表格均正常展示。
- Browser `/routing-config/vdn`：确认已改为 `Keyword`、Search、Reset、右侧 Add 的统一工具栏；表格正常展示。
- Browser 输入框写入验证受当前插件虚拟剪贴板限制未完成，但代码层 `SearchInput` 使用 `onPressEnter`、Search/Reset 按钮绑定已通过 lint/build。

截至 2026-06-02 19:50 +08:00，本轮统一 `Routing Config` 普通配置页状态展示：

- `RoutingConfigStatusBadge` 将内部 `Active` 映射为页面展示 `Enabled`，`Disabled` 仍显示 `Disabled`；badge 改为小尺寸 dot 风格，避免重图标。
- `RoutingConfigCrudPage` 的 `statusSwitch` 字段在新增/编辑中显示短胶囊 switch + 当前状态文本；查看详情时显示同一套状态 badge，不再显示纯文本。
- `Route Elements` 列表从 AntD `Tag` 改为统一 `RoutingConfigStatusBadge`。
- VDN、Sites、Channels、Media Types、Languages、Business Types、Site Access Volume、Access Accounts、Access Entries、Working Time Plans、Skill Queues、Channel Media 等普通 CRUD 页的状态编辑控件从 `select Active/Disabled` 改为短胶囊 switch。
- 搜索筛选仍使用 `All / Enabled / Disabled`，内部 value 继续使用 `Active / Disabled`，避免扩大类型、mock 和 store 改动。
- Skill Routing Rules 继续使用 `RoutingConfigStatusBadge`；`Draft`、`Replaced` 仍按生命周期状态展示，不被强制改为 Enabled/Disabled。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：列表、详情、新增弹框状态均显示 `Enabled/Disabled` 语义；新增状态为短 switch + 文本。
- Browser `/routing-config/vdn`：列表、详情、新增弹框状态均显示 `Enabled/Disabled` 语义；新增状态为短 switch + 文本，不再出现 `Active`。

截至 2026-06-02 19:40 +08:00，本轮微调 `Routing Config > Route Elements` 查询操作：

- `Search` 按钮从 secondary 改为 primary，与 `Add` 一样使用有背景色的主按钮样式。
- `Reset` 保持 secondary，维持查询区主次操作区分。
- 原有 `Add` 独立靠右、Search/Reset 固定宽度、短胶囊状态开关和弹框顶部标题栏背景修正保持不变。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：确认查询条件、Search、Reset、Add、表格和分页仍正常展示。

截至 2026-06-02 19:36 +08:00，本轮纠正 `Routing Config > Route Elements` 弹框背景调整：

- 用户澄清“不要把背景色去掉”指的是弹框顶部标题所在区域，不是底部 footer。
- 已移除 19:18 加到 CRUD 弹框 footer 的浅色背景、上边线和负 margin，footer 回到普通按钮区。
- 已恢复 `routing-config-crud-modal` 顶部标题栏浅蓝渐变背景；标题文字继续保持黑色。
- `Add` 独立靠右、Search/Reset 与 Cancel/Save 固定宽度、短胶囊状态开关等其它调整保留。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：Add 弹框可正常打开，字段、状态开关、Cancel/Save 和底部分页仍正常。

截至 2026-06-02 19:18 +08:00，本轮继续微调 `Routing Config > Route Elements` 管理台样式：

- `Add` 按钮从查询操作组中拆出，独立靠右；左侧查询条件只跟随 `Search` / `Reset`。
- `Search` / `Reset` 与 CRUD 弹框中的 `Cancel` / `Save` 等操作按钮使用统一固定宽度，提升管理台操作区一致性。
- 19:18 曾误将背景反馈理解为底部 footer 并恢复 footer 背景；19:36 已按用户澄清纠正为恢复顶部标题栏背景，footer 不额外加背景色。
- 状态开关改为固定 34px x 18px 短胶囊样式，checked 使用 BANK 1 primary blue，避免过宽的 On/Off 控件。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：确认英文标题、查询条件、右侧 Add、精简表头、底部分页、Add 弹框初始无错误、Save 后小型校验提示。

截至 2026-06-02 19:11 +08:00，本轮继续调整 `Routing Config > Route Elements`：

- 页面文案从中文改回英文：`Route Element Configuration`、`Element ID`、`Element Name`、`Status`、`Search`、`Reset`、`Add`。
- 搜索和重置按钮移动到查询条件旁边；状态下拉框宽度与输入框统一为 200px。
- 列表底部启用分页，默认每页 20 条，支持 10 / 20 / 50 / 100，并在底部分页区展示总数。
- 收紧 `Routing Config` CRUD 表格字号、单元格 padding 和行操作按钮尺寸，使其更接近来电弹屏等工作台页面密度。
- CRUD 弹框标题颜色改为黑色；移除额外白底/输入框式只读背景；状态开关进一步缩短。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：英文标题、英文查询条件、搜索/重置/新增、精简表头、底部分页、Add 弹框初始无错误、Save 后英文校验提示均通过。

截至 2026-06-02 19:03 +08:00，本轮优化首个菜单 `Routing Config > Route Elements`：

- `Route Elements` 页面标题改为 `路由要素配置`，移除页面 eyebrow 和冗长说明，只保留管理台维护页需要的信息。
- 查询区改为横向管理台表单，字段为 `要素ID`、`要素名称`、`状态`，`搜索`、`重置`、`新增` 在同一行展示，避免单个超长搜索框。
- 列表字段精简为 `要素ID`、`要素名称`、`状态`、`操作`，移除 Source Entity、Display Order、Required、Allow ANY 等技术字段。
- 新增/编辑/查看弹框只展示 `要素ID`、`要素名称`、`状态`；状态使用短开关，查看态字段白底显示。
- 通用 `RoutingConfigCrudPage` 增加 filters、submitAttempted、statusSwitch 和轻量校验提示能力；本轮先应用到 Route Elements，其它页面继续保持现状。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/routing-config/route-elements`：确认页面标题、查询栏、精简字段、隐藏技术列、新增弹框初始无错误提示。

截至 2026-06-02 18:37 +08:00，本轮拆分 Routing Config 并补齐 CRUD：

- 新增一级菜单 `Routing Config`，二级菜单进入 Route Elements、VDN、Sites、Channels、Channel Media、Media Types、Languages、Business Types、Site Access Volume、Access Accounts、Access Entries、Working Time Plans、Skill Queues、Skill Routing Rules。
- `/call-management/routing-configuration` 改为兼容重定向到 `/routing-config/route-elements`；`Call Management` 下只保留 `Text Channel Settings`。
- 新增 `src/pages/routing-config/*` 页面和 `routingConfigStore`，普通配置页统一提供 Search / Add / View / Edit / Delete，本地 demo 状态刷新后恢复 mock。
- Sites 页从类型、mock 和页面移除 `timezone`；当前印尼单国家场景下 Working Time Plans 也不维护 `timezone`，技能队列未选择工作时间方案时显示 `Default 24x7`。
- 删除操作增加引用保护：被路由规则、站点接入比例、接入入口、技能队列等引用的主数据不能直接删除，只能先移除依赖或禁用。
- Skill Routing Rules 拆为独立页面，保留批量新增、组合预览、重复组合展示、覆盖更新目标队列/优先级、未覆盖时阻止保存；规则编辑只允许改目标技能队列、优先级和状态。
- 保留 `route_factor` 抽象、`channel_media` 拆分、`routing_rule_condition` 和 `routing_rule_index` 思路；Channel Media 作为独立二级配置页承载渠道 + 媒体配置。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- 本地 Vite 服务运行在 `http://127.0.0.1:5174/`；5173 已被旧服务占用。
- Browser smoke check 通过：`/`、`/design-system`、`/routing-config/route-elements`、`/routing-config/sites`、`/routing-config/channels`、`/routing-config/skill-routing-rules`、`/call-management/text-channel-settings` 均能渲染；`/call-management/routing-configuration` 成功重定向到 `/routing-config/route-elements`。
- Browser 交互检查通过：Sites 搜索、Add 弹窗、被引用删除保护；Skill Routing Rules 重复组合预览和未勾选覆盖时阻止保存。

截至 2026-05-29 19:23 +08:00，本轮热修：

- 修复 `LiveChat2Page` 使用 `formatDuration(activeSession.elapsedSeconds)` 但未从 `../../utils/duration` 导入 `formatDuration` 导致的 runtime error。
- 用户截图中的 `Unexpected Application Error! formatDuration is not defined` 已定位为该漏导入问题。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning 和插件耗时提示。
- Browser `/`：页面可加载，不再出现 `Unexpected Application Error` 或 `formatDuration is not defined`。
- Browser `/design-system`：页面可加载，不再出现 runtime error。

截至 2026-05-29 18:02 +08:00，本轮继续修正正式 `Live Chat` 替换后的客户列表与 tabs 细节：

- WhatsApp / BankApp Demo 每次 handoff 创建的新文字客户，`serviceStartedAt` 和运行时 timing 都从当前时刻开始，客户信息区 access duration 也用运行时 `elapsedSeconds` 展示，避免从 mock 时长接入。
- Live Chat 客户列表默认星标统一为灰色 `No flag`；不再读取 mock 中 yellow/red/blue 的初始关注色，仍保留用户 hover 后手动改星标颜色的能力。
- 当前会话行在 no flag 状态下，第二行最新消息跨满整行；灰星标改为悬浮浮层，不再占用消息列宽。
- Assistant 右侧 tabs label 改回扁平 icon + text + optional close 结构，移除上轮造成额外间距的嵌套 span 规则。
- CRM 与 Assistant tabs 的 more operations 区域从上轮偏宽的 26-28px 收紧到 18px，并降低层级，让最后一个页签 close 按钮更容易点击。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Sign In 后固定 `Live Chat` tab 可见；当前 in-app browser 仍未稳定完成点击进入 Live Chat 细节页面的自动化复查。
- Browser `/design-system`：正常加载，`UI Design System` 与 `Color System` 可见。

截至 2026-05-29 17:42 +08:00，本轮修正正式 `Live Chat` 替换后的 6 个手工评审问题：

- 坐席主动点击 `End Service` 并二次确认后，会追加系统结束语并直接关闭该会话到 History，不再停留 ended 状态等待二次 `Close`；客户主动结束/超时结束仍保留 `Close` 行为。
- Ticketing History 打开的 CRM 动态页签 label 改为 `CRM000145` 这类 CRM ID，详情内容仍保留业务类型和参考信息。
- Assistant 右侧 tab label 统一用同一套 icon + text 结构，`Assistant`、`Connection`、`Quick Replies`、`Message Record` 间距一致；CRM 与 Assistant tabs 均给更多按钮预留右侧空间，降低遮挡最后一个 close 按钮的风险。
- 发送引用消息时不再把正文拼成 `Replying to "..."`；`quotedMessage` 作为结构化字段保存，消息气泡上方用浅灰引用块和左侧色条展示被引用内容。
- Demo 再次 handoff 会生成新的 livechat2 session instance，新的 active session 拥有独立 id、timing、unread、draft、messages 和 focus，不再跳回原客户。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Sign In 后固定 `Live Chat` tab 可见；本轮 in-app browser 未稳定完成 `Live Chat` tab 切换后的细节自动化复查，仍需人工点检 6 个评审项。
- Browser `/design-system`：正常加载，`UI Design System` 与基础章节可见。

截至 2026-05-29 16:27 +08:00，本轮将新版 livechat2 弹屏替换为正式 `Live Chat`：

- `AgentWorkspace` 保持正式 tab key `live-chat` 和 label `Live Chat`，但渲染新版 `LiveChat2Page`；独立 `livechat2` tab 不再渲染。
- `Live Chat` tab 右上角新增当前 active 服务会话的未读总数 badge，已读和 ended/history 会话不计入，大于 99 显示 `99+`；最长服务时长和新接入短闪继续沿用新版计时。
- `requestLiveChatWorkspace` 保持旧入口契约，内部把旧 `live-chat-001/002/003` 映射到 `livechat2-001/002/003`，保留 WhatsApp Demo / BankApp Demo 的原跳转流程。
- 左侧 `Channel Simulation` 已移除临时 `livechat2` 菜单入口；旧 `LiveChatPage` 源码暂不删除，作为本地回滚参考。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- `git diff --check`：通过，仅有 CRLF 提示。
- Browser `/`：可 Sign In，正式 `Live Chat` tab 可打开并渲染新版 Live Chat workspace，页面中没有可见 `livechat2` 文案。
- Browser `/design-system`：正常加载。

截至 2026-05-29 15:39 +08:00，本轮微调 `livechat2` 右侧 `Quick Replies` 面板：

- `My Phrases` 标题右侧 hover 加号改为与下方分类操作按钮一致的 22px 小按钮口径：同样的边框、字号、图标 line-height 和居中方式。
- `My Phrases` / `Public Phrases` section 折叠箭头与分类 group 折叠箭头统一使用系统卡片口径：默认 `var(--aicc-text-tertiary)`，hover / focus 时变为 `var(--aicc-primary)`。
- 本轮只改 Quick Replies 样式，不改数据模型、CRUD 逻辑、`/` 浮层同步、旧 `Live Chat` 或弹框。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- `git diff --check`：通过，仅有 CRLF 提示。
- 实际 `livechat2` Quick Replies 视觉仍需在页面中人工复查。

截至 2026-05-29 15:31 +08:00，本轮优化 `livechat2` 右侧 `Quick Replies` 面板：

- 去除 `My Phrases` / `Public Phrases` 标题和分组标题中的所有可见计数。
- Section 标题仍可点击展开/收起；新增分组标题也可点击展开/收起，默认展开。
- My Phrases 的添加分组按钮从独立行移到 section 标题右侧，hover / focus 时显示加号。
- phrase 文本不再省略为 `...`，改为完整换行展示；code 也允许按需换行，避免窄面板截断。
- My phrase 的 Insert/Edit/Delete 操作改为 hover / focus 时浮在语句右上方，不再占用右侧固定列宽。
- 本轮只改 `LiveChat2QuickRepliesPanel` 和相关样式，不改旧 `Live Chat`、弹框、电话/视频工作台或 quick reply 数据模型。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning，并出现插件耗时提示。
- Browser smoke check：`/` 与 `/design-system` 均可正常加载。
- Browser livechat2 点击链路：当前 in-app browser DOM 未暴露 `livechat2` 菜单入口，实际 Quick Replies 视觉仍需人工复查。

截至 2026-05-29 13:17 +08:00，本轮新增 `livechat2` 右侧 `Quick Replies` tab：

- 右侧 Assistant 区在 `Assistant`、`Connection` 后新增固定 `Quick Replies` tab；`Message Record` 仍为可关闭动态 tab。
- quick replies 数据从 Conversation 组件内抽为 livechat2 专用数据模型，`LiveChat2Page` 持有本次演示内的 `quickReplyGroups` state。
- Conversation 输入框 `/` 浮层和右侧 `Quick Replies` tab 共用同一份 phrases；右侧 My Phrases 新增/编辑/删除后，`/` 结果即时同步。
- `Quick Replies` tab 顶部支持按 code 和 phrase 文本搜索；`My Phrases` 在上、`Public Phrases` 在下，两个区块默认展开并可收起。
- `My Phrases` 支持添加分组、重命名分组、删除分组、添加/编辑/删除组内 phrase；删除分组会删除组内所有 phrase。
- `Public Phrases` 只读展示，点击语句仍可带入当前聊天输入框。
- 点击右侧语句会写入当前 active livechat2 session 的 draft，并触发 Conversation textarea 聚焦，光标移动到语句末尾。
- 本轮只改 livechat2 页面、右侧 tab 扩展和样式，不改旧 `Live Chat`、弹框、电话/视频工作台、真实后端或 localStorage。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser smoke check：`/` 与 `/design-system` 均可正常加载。
- Browser livechat2 点击链路：当前 in-app browser DOM 未暴露 `livechat2` 菜单入口，实际 `Quick Replies` tab 与 CRUD / 插入交互仍需人工复查。

截至 2026-05-29 12:25 +08:00，本轮补齐 `livechat2` quick replies 键盘交互：

- 输入 `/` 打开快捷回复后默认选中第一条候选。
- `ArrowDown` / `ArrowUp` 可在候选中循环切换选中项；鼠标悬浮候选也会同步当前选中项。
- quick reply 浮层打开时按 `Enter` 会将当前选中语句带入 textarea，不会发送消息；插入后焦点保留在输入框，光标移动到带入语句末尾。
- quick reply 浮层未打开时，`Enter` 仍保持原发送消息行为。
- 本轮只改 `livechat2` conversation composer 交互和 quick reply 选中态样式，不改旧 `Live Chat`、弹框、mock 数据或 store。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser smoke check：`/` 与 `/design-system` 均可正常加载。
- Browser livechat2 点击链路：当前 in-app browser DOM 未暴露 `livechat2` 菜单入口，slash 键盘交互仍需在实际页面人工复查。

截至 2026-05-29 12:04 +08:00，本轮修复 `livechat2` 输入区 quick replies：

- 输入 `/` 后出现的快捷回复悬浮层从 composer 内部上移到输入区正上方，不再覆盖 textarea 输入内容。
- quick replies 增加最大高度和内部纵向滚动，避免快捷回复数量较多时挤压输入区或溢出底部。
- 本轮只改 `livechat2` composer 样式，不修改 quick replies 数据、发送逻辑、旧 `Live Chat` 或弹框。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser smoke check：`/` 与 `/design-system` 均可正常加载；`livechat2` slash 悬浮层仍需在实际菜单路径下人工复查。

截至 2026-05-28 23:26 +08:00，本轮微调 `livechat2` 右侧 `Message Record`：

- 收紧 `Message Record` 页签内 icon 与文字的间距，并清除 AntD icon 默认 margin，避免 icon 和文字分离感过强。
- 搜索框 placeholder 字号下调到 11px，与右侧紧凑查询区密度一致。
- `Locate` 按钮只在点击 `Search` 后的搜索结果态显示；点击 `Locate` 后恢复连续记录态，不再在连续记录里显示定位按钮。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser livechat2 点击链路：当前 in-app browser 可见 DOM 未暴露左侧 `livechat2` 菜单项，需人工复查页签间距、placeholder 字号和 Locate 显示时机。

截至 2026-05-28 23:16 +08:00，本轮继续精简 `livechat2` 右侧 `Message Record`：

- Composer 历史消息图标改为双态按钮：未打开时点击打开右侧 `Message Record` 页签，已打开时再次点击关闭并回到 `Connection`。
- 右侧 extra tab label 调整为 icon + text + 紧凑关闭按钮结构，间距更接近 `Assistant` / `Connection`，并为右侧 more 操作留出稳定宽度。
- `Message Record` 面板删除重复 header、标题和内部关闭按钮，只保留页签级关闭。
- 搜索区改为一行布局：日期范围选择控件、消息内容搜索框、`Search` 按钮和紧凑结果数。
- 日期范围使用 AntD `RangePicker`，默认近 7 天；保留点击 `Search` 后执行过滤、倒序结果、高亮和 `Locate` 定位原文能力。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser livechat2 点击链路：当前 in-app browser 可见 DOM 未暴露左侧 `livechat2` 菜单项，需人工复查 Message Record 双态按钮、页签关闭和一行搜索区视觉。

截至 2026-05-28 23:01 +08:00，本轮优化 `livechat2` 右侧 `Message Record`：

- `Message Record` 顶部改为近 7 天默认日期范围、消息内容搜索框和 `Search` 按钮；修改条件不立即刷新，点击 `Search` 或按 Enter 后执行。
- 搜索结果基于当前客户可见消息记录，按日期范围与消息内容过滤，并按发送时间倒序展示。
- 结果行展示发送人、消息内容和发送时间；匹配关键字继续高亮。
- 结果行 hover / focus 时显示 `Locate` 按钮；点击后重置搜索条件，并让中间 Conversation 定位到对应原消息且短暂高亮。
- 定位请求使用 `messageId + requestId`，支持重复定位同一条消息。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 plugin timings 与 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser livechat2 点击链路：当前 in-app browser 可见 DOM 未暴露左侧 `livechat2` 菜单项，需人工复查 Message Record 搜索与 Locate 定位交互。

截至 2026-05-28 20:10 +08:00，本轮调整 `livechat2` 历史消息记录展示位置：

- Composer 工具栏中的 `Message Record` 图标点击后，不再在 Conversation 中间区域打开内嵌侧栏。
- 右侧 Assistant 区现在支持扩展页签，`Message Record` 会在 `Assistant` / `Connection` 后方作为新 tab 打开，并可通过 tab 关闭按钮或记录面板内关闭按钮关闭。
- `Message Record` tab 展示当前选中客户的历史消息记录，继续保留时间范围下拉、搜索和欢迎语过滤逻辑。
- 新增 `liveChat2MessageUtils.ts` 承载可见消息过滤 helper，避免组件文件导出普通函数触发 React Fast Refresh lint 规则。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser livechat2 点击链路：当前 in-app browser 可见 DOM 未暴露左侧菜单项，临时桌面 viewport 后仍只能看到 Home tab，需人工复查 `Channel Simulation > livechat2` 入口和右侧 `Message Record` tab 交互。

截至 2026-05-28 19:56 +08:00，本轮精简 `livechat2` Conversation 输入区：

- Composer 工具栏移除图片上传图标按钮。
- 底部输入区现在只保留表情、文件、历史消息三个图标，以及右侧 Send。
- 本轮不移除消息列表里已有图片消息的渲染支持，只是不再展示图片上传入口。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。

截至 2026-05-28 19:36 +08:00，本轮优化 `livechat2` Conversation 消息展示：

- `Message Record` 入口从消息区顶部移到 composer 工具栏，放在文件发送图标旁边，使用图标按钮并在打开记录面板时高亮。
- Conversation 消息区不再显示 `Click to load more` 或 `No more records`，历史消息和当前消息直接进入滚动区域。
- 坐席端过滤客户端欢迎语系统消息，例如 `Welcome. If you do not reply...` 不再显示在 Conversation 或 Message Record 中。
- 已撤回消息不再显示 `Quote` 按钮；当前坐席已撤回消息显示 `Re-edit`，点击后将原消息内容带回输入框并聚焦。
- 本轮不修改消息 mock 结构、不修改 store 撤回状态，只调整 Conversation 渲染和交互。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。

截至 2026-05-28 19:26 +08:00，本轮扩展 Transfer Skill 表格：

- `Transfer Skill` 页签在 `Skill Name` 后新增 `Agents` 和 `Ready` 两列。
- `Agents` 从现有 `transferAgents` 按 `skillName` 统计该技能下坐席总数，表示签入该技能的坐席数量。
- `Ready` 从同一份坐席数据统计状态为 `Ready` 的坐席数量，表示该技能队列空闲人数。
- 本轮不新增重复 mock 字段，不修改 TypeScript 数据结构；统计由现有坐席 mock 派生，避免两份数据不一致。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。

截至 2026-05-28 19:24 +08:00，本轮按用户反馈精简 Transfer 弹框：

- Conversation 版本 `Transfer Agent` 行内更多按钮已移除，不再展示 `Force Transfer` / `Force Conference` 下拉入口。
- 行内动作只保留 `Transfer` 和 `Conference` 两个按钮。
- Conversation 动作列宽从 198px 进一步收窄到 180px，匹配两个按钮。
- 移除 `TransferModal.tsx` 中未使用的 Dropdown / DownOutlined / MenuProps 相关代码，并删除 more 按钮样式。
- 本轮不修改通话工具条 Transfer 弹框的 `Consult` / `Transfer` / `Conference` 行内动作。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。

截至 2026-05-28 19:17 +08:00，本轮继续微调 Transfer 弹框：

- Conversation 版本 `Transfer Agent` 表格动作列从 262px 收窄为 198px，匹配短按钮文案，避免其它表头被挤压换行。
- Conversation 行内主按钮从旧 112px 宽度收窄为 80px，适配 `Transfer` / `Conference`。
- Transfer 弹框表头强制不换行；conversation 行内按钮补齐 `inline-flex`、`box-sizing` 和行高，避免按钮边框被裁切。
- 本轮只修改 `TransferModal.tsx` 与 `src/styles/index.less`，不修改动作逻辑。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。

截至 2026-05-28 19:12 +08:00，本轮微调 Transfer 弹框：

- Conversation 版本 `Transfer Agent` 表格行内两个主按钮从 `Request Transfer` / `Request Conference` 改为 `Transfer` / `Conference`。
- 19:24 后更多按钮与 `Force Transfer` / `Force Conference` 下拉入口已移除。
- 本轮只修改 `TransferModal.tsx` 的显示文案，不修改弹框动作逻辑、旧 Live Chat、livechat2 store 或 mock。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。

截至 2026-05-28 19:00 +08:00，本轮修正 `livechat2` 时长口径与 ended 提示：

- `requestLiveChat2Workspace` 支持 `initialElapsedSeconds`，打开 livechat2 时按 mock `customer.accessDuration` 初始化服务时长，active 服务不再从 `00:00` 开始。
- `BasicLayout` 从 mock 解析 `accessDuration` 后传入 store；store 初始化 timing 时以 `now - initialElapsedSeconds` 作为 `startedAt`。
- `LiveChat2Page` 将 active 未回复秒数限制为不超过当前服务时长，避免展示上出现坐席未回复时长长于服务时长。
- `livechat2-005` customer-ended mock 的服务时长改为 `02:53`，系统结束消息统一为 `This user has ended the session.`。
- Conversation header 不再显示 customer/timeout ended 的完整文字提示；结束原因只保留在对话系统消息中，header 仍通过灰态头像和 `Close` 表达待关闭状态。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser `/`：`livechat2` 菜单文字存在于 DOM，但当前自动化判断该入口不可见，未完成菜单点击后的细节复查，需人工确认时长与 ended 提示。

截至 2026-05-28 18:49 +08:00，本轮微调 `livechat2` conversation header：

- active 会话的未回复计时不再显示可见 `Unanswered` 文案，改为告警图标 + `mm:ss`，通过 `title` / `aria-label` 保留完整语义。
- `End Service` 按钮增加专属危险 hover/focus 状态：浅红背景 + 深红文字，避免被通用主色 hover 覆盖。
- 本轮只修改 `LiveChat2ConversationWorkspace.tsx` 与 `src/styles/index.less`，不修改旧 `Live Chat`、mock、store 或弹框。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。

截至 2026-05-28 18:34 +08:00，本轮按用户方案调整 `livechat2` conversation 顶部与结束状态：

- `livechat2` conversation 顶部改为渠道图标 + 客户名 + 服务时长，移除客户名旁边的 `intent` 业务类型文案。
- Header 右侧 active 会话只保留 `Transfer` 和 `End Service`；ended 会话只显示 `Close`。
- `Message Record` 从 header 右侧移到消息区顶部的紧凑按钮，记录面板功能保留。
- `LiveChat2SessionView` 增加 `endReason`，`requestLiveChat2Workspace` 支持 `initialSessionStatuses`，避免 ended mock 被初始化为 active。
- 新增非历史 Haloapps mock 会话 `livechat2-005`，状态为 customer ended，用于展示客户主动结束：列表头像灰掉、右侧只有 `Close`；2026-05-28 19:00 后完整结束文案只保留在对话系统消息中。
- customer / timeout ended 会话在 conversation header 显示对应提示；坐席主动结束仍沿用现有固定系统结束语。
- 本轮不实现真实 timeout 自动结束计时器，不接 Call Management 配置页。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser `/`：当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成 `Channel Simulation > livechat2` 自动化点击验证，需人工复查 active/ended header、Close、Message Record 入口和 mock customer ended 会话。

截至 2026-05-28 18:13 +08:00，本轮修复 `livechat2` History 行最新消息宽度：

- History 会话的最新消息行新增 `livechat2-session-card__message--full-row` modifier。
- History 最新消息样式改为 `grid-column: 1 / -1`，让第二行跨过右侧结束时间列，占满客户卡片内容区。
- 第一行保持客户名在左、挂断图标 + 时间在右。
- 当前服务列表不改，继续保留第二行右侧星标 / Close 操作区。
- 本轮不修改旧 `Live Chat`、store 数据结构、mock、弹框或 livechat2 其它交互。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser `/`：当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成 `Channel Simulation > livechat2` 自动化点击验证，需人工复查 History 第二行消息满宽效果。

截至 2026-05-28 18:08 +08:00，本轮按用户澄清微调 `livechat2` 历史结束时间展示：

- 历史列表结束时间不再常显 `Ended` 文案，只显示挂断图标 + 具体时间。
- 当天历史显示为挂断图标 + `HH:mm:ss`；非当天历史显示为挂断图标 + `MM-DD HH:mm:ss`。
- `aria-label` / `title` 仍保留完整语义 `Ended ${time}`，用于可访问性和悬浮提示。
- 图标与时间使用浅灰、紧凑、tabular nums 样式，减少右侧占宽，缓解最新消息宽度被压缩的问题。
- 当前服务列表、收起态、旧 `Live Chat`、store 数据结构和 mock 不变。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser `/`：当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成 `Channel Simulation > livechat2` 自动化点击验证，需人工复查 History 行右侧图标 + 时间展示。

截至 2026-05-28 18:00 +08:00，本轮按用户确认补充 `livechat2` 历史列表结束时间：

- `LiveChat2SessionView` 新增 `endTimeDisplay`，只用于历史列表展示。
- 历史会话结束时间优先使用真实 `endedAt`；初始 mock 历史会话没有 `endedAt` 时，使用 `lastMessageAt` 作为结束时间兜底。
- 当天历史显示 `Ended HH:mm:ss`；非当天历史显示 `Ended MM-DD HH:mm:ss`。
- 展开态历史客户行第一行右侧展示结束时间，颜色为浅灰，不使用 warning / breach 状态色。
- 当前服务列表、当前 selected 会话输入框、收起态客户头像列表均不显示该结束时间。
- 本轮不修改旧 `Live Chat`、store 数据结构、mock、弹框或 livechat2 其它交互。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser `/`：当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成 `Channel Simulation > livechat2` 自动化点击验证，需人工复查历史列表结束时间展示。

截至 2026-05-28 16:42 +08:00，本轮按用户反馈继续微调 `livechat2` 页签和历史会话收起态：

- `livechat2` tab 只读取当前 active livechat2 客户的 timing，显示当前服务客户中最长服务时长。
- 当前没有 active livechat2 服务客户时，`livechat2` tab 不再显示 ended/history 会话时长。
- `livechat2` tab 不再传入 SLA state，页签时间不随服务时长进入 warning / breach 颜色。
- 历史会话在客户列表面板收起状态下不再渲染头像内星标；当前服务会话的收起态星标保留。
- 本轮不修改旧 `Live Chat`、电话/视频 tab、store 数据结构、mock、弹框或客户列表其它交互。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser `/`：当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成 `Channel Simulation > livechat2` 自动化点击验证，需人工复查 tab 计时不变色、无 active 时不显示时长，以及历史会话收起态无星标。

截至 2026-05-28 16:20 +08:00，本轮补齐 `livechat2` workspace tab 的计时与闪烁：

- `livechat2` tab 现在读取 `activeLiveChat2SessionIds` 与 `liveChat2SessionTimings`，显示当前正在服务客户中服务时间最长的一位，格式沿用 `WorkspaceTabLabel` 的 `(mm:ss)`。
- 如果当前没有 active 但仍有 ended 未关闭的 livechat2 会话，tab 会使用该 ended 会话的 `endedAt` 冻结显示最长服务时长，避免继续增长。
- 新接入 livechat2 客户会通过 `flashUntil` 触发 `workspace-tab-label--tab-flash`，与现有 Live Chat tab 的多客户接入提示保持一致。
- `livechat2` tab SLA 颜色沿用正在服务客户的最长运行态计算，不影响旧 `Live Chat`、电话/视频 tab、store 数据结构、客户列表或弹框逻辑。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，Home tab 正常。
- Browser `/design-system`：页面可加载，Design System 文本可见。
- Browser `/`：当前 in-app browser 仍未暴露可点击的左侧 livechat2 入口节点，未完成 `Channel Simulation > livechat2` 自动化点击验证，需人工复查 tab 计时和新接入闪烁。

截至 2026-05-28 16:06 +08:00，本轮继续按用户反馈收敛 `livechat2` 客户列表：

- Current / History 从图标-only tab 改回居中文字 tab，保留计数但降低视觉干扰，继续居中显示。
- 客户行右侧去除转接图标，只保留星标与 ended 状态 Close，减少第二行工具噪音。
- 顶部渠道筛选中的 `ALL` 标识改为 `var(--aicc-primary-strong)`，非选中态也保持系统主题深蓝色。
- 本轮不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：页面可加载，标题为 `BANK 1 AICC Demo`，Home tab 正常。
- Browser `/design-system`：页面可加载，标题为 `BANK 1 AICC Demo`，Design System 文本可见。
- Browser `/`：自动化可检测到隐藏的 `livechat2` 文本，但当前 in-app browser 没有暴露侧栏入口的可点击可见节点，未完成 `Channel Simulation > livechat2` 菜单点击验证，需人工复查。

截至 2026-05-28 15:48 +08:00，本轮继续按用户确认的方案精简 `livechat2` 客户列表：

- Current / History 改为居中图标-only tab，分别使用消息图标和历史图标，并保留 `aria-label` / `title` 与计数 badge。
- 排序按钮保留在 tab 行右侧固定位置，但默认透明隐藏，悬浮或聚焦整行时显示，避免常态界面过花。
- 客户卡片改为两行 grid：第一行客户名 + 未回复计时，第二行最新消息 + 转接/星标/Close 工具。
- 星标下拉改为 hover 触发，去掉下拉箭头；灰色未关注星标默认隐藏，客户行 hover/focus 时显示空心灰星。
- 收起态头像内星标去掉白色圆形背景，仅保留星标本体并加轻量白色描边阴影。
- 本轮不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning；本轮额外出现插件耗时提示，不影响构建结果。
- Browser `/design-system`：页面可加载，标题为 `BANK 1 AICC Demo`。
- Browser `/`：页面可加载；自动化可数到侧栏和 `livechat2` 按钮，但当前 in-app browser 仍报告侧栏按钮无可点击 bounding box，未完成 `Channel Simulation > livechat2` 菜单点击验证，需人工复查。

截至 2026-05-28 01:28 +08:00，本轮继续按用户反馈微调 `livechat2` 客户列表：

- 收起态不再使用头像左下角 SLA 小圆点，warning / breach 继续沿用展开态的左侧色条。
- 收起态星标移入渠道头像右下角，并略微放大，只展示不支持点击。
- 展开态 Current / History 改为参考 Assistant tab 的轻量下划线样式。
- 排序按钮取消边框和白底，图标由复杂排序图换成更简洁的菜单图标。
- 本轮不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载并可 Sign In；受当前 in-app browser 中侧栏按钮无可点击 bounding box/后续 CDP timeout 影响，本轮未完成 `livechat2` 菜单入口的自动化点击验证，需人工在当前页面复查。
- Browser `/design-system`：页面可加载，标题为 `BANK 1 AICC Demo`。

截至 2026-05-28 00:54 +08:00，本轮按用户反馈调整 `livechat2` 客户列表：

- 删除 `Serving` 工具行和新接入总数图标，将 Current / History 改为简洁 tab 行，并把排序改为右侧小图标下拉菜单。
- 客户卡片删除最新消息发送时间，只保留客户名、最后消息或草稿提醒。
- 未回复计时去掉时钟图标，只显示时间文本；warning / breach 客户行恢复旧 Live Chat 的左侧色条。
- 收起态恢复 warning / breach 提示，并在渠道头像右下角显示只读星标小标记；星标下拉面板只显示颜色星标图标。
- 转接图标与星标控件合并到右侧同一行。
- 展开态面板第一列收窄到接近旧 Live Chat 宽度；收起态渠道筛选间距、badge 尺寸和横向溢出处理已优化。
- 本轮不修改旧 `Live Chat`、store、mock、路由或弹框逻辑。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。

截至 2026-05-28 00:19 +08:00，本轮将 `codex/modal-review-fixes` 的弹框评审提交 `5917330 fix: refine review modal controls` 合并到 `codex/livechat2-popup`：

- 当前工作区已切回 `codex/livechat2-popup`，后续可继续调试 `livechat2`。
- 合并保留 `livechat2` 菜单、tab、store、mock、页面组件、客户列表收起/展开、渠道筛选和 Current/History 左右切换。
- 合并带入 Transfer / Outbound / Internal Chat 最新弹框评审改动，包括坐席技能队列与状态筛选、列表状态列、号码页控件对齐和 Internal Chat composer 回退。
- `PROJECT_CONTEXT.md` 以 livechat2 分支上下文为基线，`DEV_LOG.md` 保留弹框评审记录并补回 livechat2 记录。
- 本轮未 push 到 GitHub。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。

截至 2026-05-27 02:07 +08:00，当前继续在 `codex/fix-toolbar-chat-modals` 分支回调 Modal 视觉。用户指出上一轮全白收敛后出现内容区贴边、标题栏蓝色背景消失、整体白花花且 Search 按钮仍与输入框和其它按钮不统一；本轮采用用户选择的“浅蓝标题栏”方向。

本轮 Modal 视觉回调：

- `.aicc-modal` 恢复浅蓝标题栏，使用 `#f8fbff -> #eef6ff` 轻渐变与清晰底部分隔线，标题改用 `var(--aicc-primary-strong)`。
- `.aicc-modal` body 使用单层 `var(--aicc-surface-l3)` 灰蓝底，`.aicc-modal-section` 恢复白色内容面、12px padding、轻边框和圆角，解决文字与背景边紧贴的问题。
- Modal tabs 保持导航职责，使用 10px 下边距、12px 字号和紧凑 padding，避免再变成独立浅蓝容器。
- Transfer / Outbound toolbar 控件统一到 `var(--aicc-modal-button-height)` 即 30px；Search 固定 88px 宽，Outbound Call 固定 76px 宽，避免按钮比输入框高或过厚。
- Transfer 行内 `Consult` / `Transfer` / `Conference` 小按钮统一为 82px x 28px；Conversation 场景的主按钮当前只显示 `Transfer` / `Conference`。
- Internal Chat 继续保持单个白色工作区，左侧列表使用轻灰蓝背景，消息区和 composer 保持清晰分区，不增加多层背景框。
- `/design-system` Modal preview 同步恢复浅蓝标题栏和灰蓝 body，保持展示与真实弹框一致。
- 本轮不修改 `BaseModal` React 结构、不修改 Transfer / Outbound tab 数量、mock 数据、store、路由或话务状态机。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：Internal Chat 可打开，弹框使用浅蓝标题栏、单一白色聊天工作区和轻灰蓝列表/消息区。
- Browser `/`：签入后触发 PSTN 并打开 Transfer；`Transfer Agent` / `Transfer Skill` / `Transfer Number` 三个 tab 存在，`Transfer Number` 无 `Cancel`。
- Browser `/`：Transfer 弹框恢复内容 padding，Search 与搜索框视觉等高，行内动作按钮尺寸统一。
- Browser `/`：`More > Outbound Call` 可打开；`Call Number` 仍为 `Phone Number` 输入框 + `Call` 单行布局，无 `Cancel`、无旧 footer。
- Browser `/design-system`：页面正常加载，`UI Design System`、Modal system、Table system 均存在。

截至 2026-05-27 01:47 +08:00，当前继续在 `codex/fix-toolbar-chat-modals` 分支收敛 Modal 样式系统。用户指出 Transfer 弹框仍有多层接近浅蓝背景，Search 按钮与搜索框高度不齐，整体不够简洁专业；本轮允许调整通用 modal/table/tabs 样式。

本轮 Modal 样式系统收敛：

- `.aicc-modal` 主体改为白色内容面，Header / Body 不再使用浅蓝渐变或浅蓝底色，只保留轻量灰色分隔线。
- `.aicc-modal-section` 不再生成额外浅蓝背景、内阴影或圆角容器，避免 Transfer / Outbound 的 tab 内容区出现多层相近颜色。
- Modal tabs 只承担导航，使用白底、蓝色 active underline 和轻量间距，不再像一层独立浅蓝容器。
- Transfer / Outbound 搜索行统一搜索框和 Search / Call 按钮高度为 32px，按钮去掉额外阴影，宽度按内容紧凑显示。
- Transfer / Outbound 表格改为白底 + 浅灰 header + 清晰行分隔线，hover 色从浅蓝收敛到浅灰。
- Transfer 行内 `Consult` / `Transfer` / `Conference` 小按钮统一为 80px x 28px，减少同一弹框内按钮尺寸跳变。
- `/design-system` 的 Modal preview surface 同步改为白色内容面和轻量灰色分隔，避免设计系统继续展示旧浅蓝层级。
- 本轮不修改 `BaseModal` React 结构、不修改 Transfer / Outbound tab 数量、mock 数据、store、路由或话务状态机。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：Outbound Call 弹框可打开，Call Number 页仍为输入框 + Call 按钮。
- Browser smoke check `/`：Internal Chat 弹框仍可打开，保留 Agent Sessions、消息列表和 composer 结构。
- Browser smoke check `/design-system`：页面正常加载，`UI Design System`、Modal preview 和 Table preview 均存在。

截至 2026-05-26 11:32 +08:00，当前工作在 `codex/fix-toolbar-chat-modals` 分支修复用户指出的三个弹框回归：话务条 Transfer 的 `Transfer Number` 页、话务条 More > Outbound Call 的 `Call Number` 页，以及 Header 内部聊天弹框视觉。

本轮话务条与内部聊天弹框修复：

- `Transfer Number` 页移除多余 `Cancel`，只保留 `Transfer` 与 `Conference`，保持与 Transfer Agent / Transfer Skill 不出现底部取消按钮的口径一致。
- `Outbound Call > Call Number` 页改回单行布局：`Phone Number` 输入框后直接跟 `Call` 按钮；移除底部 footer 和 `Cancel`。
- `Internal Chat` 弹框保留现有会话结构，只调整 `.aicc-internal-chat*` 样式：主背景回到白灰层级，减少淡蓝大背景和多层框，消息区参考 Live Chat Conversation 的清晰气泡、白色头部和简洁 composer。
- 本轮不修改 `BaseModal` 全局结构，不修改 Transfer / Outbound 的 tab 数量、mock 数据、话务状态机、store、路由或 Inbound 主流程。

本轮验证：

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning 和 plugin timings 提示。
- Browser smoke check `/`：签入后触发 PSTN，进入通话并打开话务条 `Transfer`；`Transfer Number` 页 `Cancel` 数量为 0，`Transfer` 与 `Conference` 各 1 个。
- Browser smoke check `/`：话务条 `More > Outbound Call` 打开后，`Call Number` 页 `Cancel` 数量为 0，输入框 1 个，右侧 `Call` 按钮 1 个，旧 `.aicc-outbound-number__actions` footer 不再出现。
- Browser visual check `/`：打开 `Internal Chat` 后，弹框为白灰主导，左侧会话列表、右侧消息区和 composer 结构清晰，不再呈现大面积浑浊淡蓝背景或多层内框。
- Browser smoke check `/design-system`：页面正常加载，标题为 `BANK 1 AICC Demo`，`UI Design System` 文本可见。

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
- `Transfer Agent` 行操作在 conversation 变体中先实现为 `Request Transfer`、`Force Transfer`、`Request Invite`、`Force Invite`；后续已在 18:49 收纳为两个主操作加更多菜单，在 19:12 将主按钮文案改为 `Transfer` / `Conference`，并在 19:24 移除更多按钮。
- `ConversationWorkspace` 顶部 `Transfer` 按钮接入 `<TransferModal variant="conversation" />`；顶部 `Invite` 按钮本轮仍保持展示按钮。
- `src/styles/index.less` 增加 Transfer 行动作换行样式，避免四个动作按钮挤压表格。

本轮 Conversation Transfer Agent 操作收纳：

- `TransferModal` 的 `conversation` 变体专用 Agent 行动作当前只展示 `Transfer`、`Conference`，不再显示更多按钮或 Force 下拉。
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
- Browser smoke check `/`：Conversation 顶部 `Transfer` 打开弹框；弹框无 `Transfer Number` tab；Agent 行当前应只显示 `Transfer`、`Conference`，不再出现 `Request Invite` 或 Force 下拉。
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

- Customer Verification Assist 当前是前端 demo mock，不接真实 CRM / Card Link / CardPack / Base24 / HaloApp 登录态接口；mock 中暂时保留标准答案和候选来源作为内部讨论材料，但坐席侧 UI 默认不展示，生产环境答案来源与匹配方式仍需客户确认。
- `Call Management > Verification Rules` 当前只保存到前端 demo store，不接真实后端持久化；坐席侧验证弹窗会读取配置页保存后的同一份规则，但刷新浏览器后恢复 mock 默认值。
- HaloApp PIN 当前只模拟客户侧 4 位 PIN 输入和坐席侧 `PIN Verified` 状态；PIN 成功后是否等同于 `HaloApp Registered`、是否仍需要问题验证、是否对 WhatsApp / Webchat / Video 等已认证入口也减免题数，都需要客户确认。
- 动态题库目前优先覆盖 `Phone + Perbankan`、`HaloApp Registered + Perbankan`、`Phone + Kartu Kredit`、`HaloApp Registered + Kartu Kredit`、`HaloApp Registered + Paylater`；其它渠道或业务类型会显示无规则/待确认状态，不应误认为生产规则完整。
- 错答 3 次后的生产处置、验证记录落库字段、业务类型由坐席修改时是否必须记录原因、`Berurut` 是否必须严格按顺序提问、ATO/add-on/O1-O5/KBB/BBP 等特殊场景触发条件仍是客户待确认项。
- 正式 Live Chat 本轮新增默认 Current 演示客户：`livechat2-001` 为服务中客户，`livechat2-005` 为客户主动挂机待坐席关闭；这是前端 demo seed，不接真实文字渠道队列。坐席在同一签入周期内关闭所有 Current 客户后不会自动回补默认客户，需新路由接入或重新签入后才会再次出现默认场景。
- 本轮已将 Modal 从全白贴边状态回调为浅蓝标题栏、灰蓝 body 和白色内容面；已通过 Browser 检查 Transfer / Outbound / Internal Chat，但仍建议用户在当前本地页面做最终视觉确认。
- Browser 截图输出在 Codex app 中偶发出现重复画面拼接，但 DOM 与交互检查正常，实际页面可直接在 in-app browser 中查看。
- 本轮话务条 Transfer / Outbound 和 Internal Chat 弹框回归已通过本地 lint/build 与 Browser smoke check；仍建议在客户目标演示分辨率下人工复查 Internal Chat 视觉是否符合客户截图口径。
- CRM/Assistant 当前使用客户提供的截图资源，组件保留代码 fallback；如截图资源丢失，页面会自动显示 fallback。
- 左侧菜单当前已有 `Channel Simulation > PSTN` 电话来电模拟入口；其他菜单仍主要负责展示和选中态，后续若新增页面，需要再明确路由、权限和菜单选中规则。
- `PSTN / Voice Call` 触发来电后仍保留既有 `autoAnswerSeconds` 自动接听倒计时；如演示需要必须手动 Answer，需另行停用自动接听。
- `Video Call` 当前为演示型弹屏和截图浮窗，不接真实 OpenEye 协议、不实现真实音视频能力。
- `Live Chat` 当前使用新版 livechat2 实现作为正式弹屏，但仍是演示型固定工作台与静态 mock 会话，不接真实 WhatsApp / BankApp / Webchat 消息网关、文件库、拼写检查、截图插件、敏感词服务或后台配置；消息记录、快捷回复、引用、撤回、排序、渠道筛选、收起/展开、星标、结束/关闭和历史用户均为前端模拟。
- `Routing Config` 当前是前端架构 demo，不接真实配置服务；普通 CRUD 与批量新增/覆盖路由规则只在当前前端 store 中生效，刷新后恢复 mock 默认值。
- `Text Channel Settings` 当前是数据呼叫管理下的前端配置 demo，不接真实后台配置服务；`Save Draft` / `Publish` 只更新页面本地状态，刷新后恢复 mock 默认值。
- `livechat2` 分支基于本地弹框修复 commit，尚未 push 到 GitHub；如后续要让客户查看，需要先决定弹框分支是否也要合入或重新整理分支链。
- Live Chat tab/list/header 的运行计时与 Customer Information 的静态渠道接入耗时是两类不同时间：前者按 mock 服务时长初始化后继续运行，后者表示客户在渠道、排队和转坐席成功前的耗时。
- `BankApp Demo` 当前为客户侧前端模拟，不接真实 BankApp、真实消息网关、真实语音/视频协议或真实 AICC 路由服务。
- BankApp Voice / Video 触发仍依赖坐席处于 `Ready` 且当前话务为 `Idle`；如果坐席未签入、未 Ready 或已有通话，客户侧会显示已进入服务步骤但坐席侧不会打开新通话。
- BankApp 入口、业务选择、业务确认截图来自客户提供素材的脱敏重绘版本；明显未脱敏或旧版原始截图已迁出仓库目录，避免后续误提交；`voice-calling.png`、`voice-connected.png`、`video-connected-new.png`、`video-screen-sharing.png`、`openeye-share-selection.png`、`livechat-queue.png`、`livechat-chat.png`、`service-closed.png` 当前为项目内客户侧演示图片资源，其中 Voice Calling/Connected、Video Calling 复用图、Video connected、Video screen sharing、OpenEye share selection、Live Chat 排队/聊天和 Service Closed 均为用户附件原图或处理后附件，发布前仍需确认可分享性。
- WhatsApp Demo 当前 4 张截图来自用户本轮提供的脱敏附件并已落入 `public/screenshots/whatsapp/`；流程另包含一步 `View Agent Workspace`，会切到真实 Live Chat 坐席工作台；发布公开环境前仍需确认截图授权与脱敏口径。
- BankApp 演示触发 voice/video/livechat 坐席页时会先进入 `Agent Workspace` 步骤并激活对应 workspace tab；切回 BankApp Demo 后状态保持，再点击下一步显示客户侧 `Service Closed`。
- `Conversation` tab 的发送、Transfer、End Service 均为前端演示状态；Transfer 弹框 action 点击只关闭弹框，不接真实转移/会议流程；发送消息只存在于当前页面内存，刷新后恢复 mock 初始值。End Service 会关闭当前 active session，但不进入电话 ACW 或工单关闭流程。
- Live Chat 扩展为四列布局，当前客户列表默认收起；仍需在目标演示分辨率下复查展开态是否会压缩三栏内容。
- 当前仍只支持同一时间一路 active call；多通话 tab 解决的是旧弹屏保留和新呼叫新开 tab，不支持两路电话或视频同时通话。v0.6.4 已为 PSTN、BankApp Voice、BankApp Video 的 active-call 与 not-ready 两类阻塞补充可见提示，避免演示时误以为点击无响应。
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

- 客户确认 Customer Verification Assist 规则：`Berurut` 是否严格顺序、HaloApp PIN 成功后是否等同 `HaloApp Registered`、已认证入口减免范围、IVR/HaloApp 传入业务类型是否允许坐席修改以及是否要记录原因。
- 客户确认验证答案来源和坐席可见性：生产答案来自 CRM、Card Link、CardPack、Base24、HaloApp 登录态接口还是 AICC 静态配置；坐席是否允许看到标准答案，或只显示问题并由后端返回匹配结果。
- 客户确认验证失败和审计：错答 3 次后禁止继续服务、允许重试、转主管、建工单还是结束服务；验证记录是否落库以及字段范围。
- 客户确认特殊场景：ATO、add-on、O1-O3/O4-O5、mbl d、KBB、BBP 的触发条件，以及 Paylater 是沿用 Perbankan 还是独立规则。
- 人工复查 Customer Verification Assist：PSTN `Verify` 默认 `Phone + Perbankan`，顶部只显示 `Channel Type`、`Business Type` 和轻量状态 badge，不显示 `Correct/Wrong/Skip/In Progress` 长统计串；规则区显示 `Need 5 correct` 与 Mandatory / Dynamic / Static 彩色达成块，`Wrong 0/3` 为弱提示；题目行不展示标准答案或来源；答对 1 mandatory + 2 dynamic + 2 static 后可 `Apply Verified`；同一次会话错答 3 次后可 `Apply Failed`；`Skip` 不增加错答；误点后可直接把同一题改为其它状态；切换业务类型后进度和题库重置。
- 人工复查 `Call Management > Verification Rules`：左侧菜单可见 `Call Management`，二级包含 `Verification Rules` 和 `Text Channel Settings`；`/call-management` 默认进入验证规则页；列表字段为 Channel Type、Business Type、Required Rule、Question Set、Max Wrong、Layering、Status、Actions；View/Edit 弹窗不展示标准答案或来源；编辑 `Phone + Perbankan` 的 required count 后，重新打开 PSTN 验证弹窗能看到新规则。
- 人工复查 BankApp/HaloApp PIN 验证：BankApp Voice 接入后验证弹窗先显示 `HaloApp Unregistered` 和 `Send PIN Verification`；发送后客户侧 BankApp Demo 出现 4 位 PIN 输入页；提交后坐席侧重新打开验证弹窗应显示 `HaloApp Registered` 并加载对应业务题库。
- 人工复查正式 Live Chat 当前客户清空空态：Sign In 后打开 Live Chat，Current 默认显示两个客户，其中 `livechat2-005` 为客户主动挂机并显示 `Close`；关闭已挂机客户、再 End Service / Close 剩余服务中客户后，Current 计数为 0，右侧显示 `No current Live Chat customers`，不再渲染旧 Customer Information / Conversation / Assistant 客户上下文；切换 History 后仍可查看已关闭客户。
- 人工复查正式 Live Chat Current 清空后的新 route 恢复：从 WhatsApp 或 BankApp Demo route 新文字客户后，Current 应恢复显示新客户并渲染工作台。
- 人工复查客户身份刷新：PSTN 初始显示 `Unidentified Customer`；Customer Journey / Ticketing History 显示未加载空态；Customer Information 右上角同时显示身份刷新图标和原编辑联系方式图标；两个图标在 hover 背景中居中；Customer ID 浮层不进入左侧菜单范围；点击 `Paste` 自动填入 `00000078987`；错误 ID 不关闭浮层并提示；正确 ID `Confirm` 后刷新 Customer Information、Customer Journey 和 Ticketing History。
- 人工复查客户卡片 `Menu` 最后菜单提示：PSTN / BankApp Voice 等语音/IVR 类渠道在 Customer Information 底部第二行显示短标签 `Menu` 和最后一级 IVR 菜单，第一行渠道/接入时长/验证/Verify 不被挤压；点击渠道图标仍打开完整 Call Flow Detail；Live Chat 和 Video 不显示该提示。
- 人工复查客户 AUX / Sign In 下拉：签出状态头像菜单只显示 `Sign In` 分组和 `Voice only`、`Digital only`、`Voice + Digital` 三个纯文字选项；签入后直接显示当前模式、`AUX` 分组、9 个启用原因和 `Sign Out`；系统级 `Log Out` 只在 Header 右侧红色按钮中出现；点击原因后状态计时区立即显示 `AUX - {reasonName}`，不再出现 `Select AUX Reason` 弹框。
- 人工复查客户可见管理入口：左侧菜单显示 `Call Management`，不显示 `Routing Config`；`/call-management/verification-rules`、`/call-management/text-channel-settings` 与 `/call-management/busy-reasons` 正常打开，`/routing-config/*` 仍回到 `/`。
- 人工复查 `Routing Config > Route Elements`：英文标题、查询栏、独立靠右 Add、列表字段、短胶囊状态开关、弹框顶部标题栏背景、无额外 footer 背景、统一按钮宽度/高度和保存后校验提示符合管理台数据维护规范。
- 人工复查 `Routing Config` 普通 CRUD 页状态展示：列表和详情统一为 `Enabled/Disabled` badge，新增/编辑统一为短 switch + 状态文本，不再混用 `Active`。
- 人工复查 `Routing Config` 普通 CRUD 页工具栏：输入框、下拉框、Search/Reset/Add 按钮高度一致，普通页面统一使用 Keyword + Search/Reset + 右侧 Add。
- 人工复查 `Routing Config` 所有二级页面：左上角只显示英文当前菜单名称，不显示 eyebrow、说明文案或标题右侧操作；新增/编辑/查看/删除弹框标题也使用英文。
- 人工复查 `Routing Config > Route Elements`：查询条件为 `Keyword + Status`，Keyword 支持 Element ID / Element Name 多字段模糊搜索。
- 人工复查 `Routing Config > VDN`：Platform VDN ID 必填，Description 独占整行且宽度合适，Status 与 Platform VDN ID 同行。
- 人工复查 `Routing Config > VDN` 与 `Routing Config > Sites`：查询条件为 `Keyword + Status`，Keyword 分别支持 ID/Name/Platform ID 或 Site ID/Site Name 多字段模糊搜索。
- 人工复查 `Routing Config > Sites`：无顶部提示、无 Country/Country Code 字段，新增弹框标题为 `Add Site`。
- 人工复查 `Routing Config > Channels`：列表字段为 Channel ID、Channel Name、Media Type、Max Concurrent Calls、Min Scan Interval、Status；Channel ID 为数字；媒体类型多选符合 Phone=Voice、Haloapp/webchat=Voice/Video/Text、其它渠道=Text；查询区为 Keyword、Media Type、Status。
- 人工复查 `Routing Config > Business Types`：查询条件为 Keyword + Status，Keyword 支持 Business Type ID / Name；列表和弹框都不显示 Project / Project Code。
- 人工复查 `Routing Config > Site Access Volume`：查询区为 `Keyword + Media Type + Status`，Media Type 独立下拉筛选；列表无 `Total` / `Site Ratios` / `Ratio Group ID` 列，Haloapp 以 Voice / Video / Text 三行展示且渠道相关列合并单元格，`Site Configuration` 拼接站点比例；仍需人工复查错误比例保存时同一 Channel + Media 下合计必须 100% 的阻止提示。
- 人工复查 `Routing Config` 新一级菜单：展开态和收起态 flyout 均可进入 Route Elements、VDN、Sites、Channels、Business Types、Site Access Volume、Access Accounts、Working Time Plans、Skill Queues、Skill Routing Rules。
- 人工复查 `Routing Config` 精简结果：Channel Media、Media Types、Languages、Access Entries 不再出现在菜单中，旧 URL 不再进入旧页面。
- 人工复查 `Routing Config > Access Accounts`：账号列表支持 Keyword / Channel / Status 查询；Channel 下拉不包含 Phone；新增/编辑弹框按渠道动态展示结构化字段且不再显示 `Channel-specific Config` 文本域。
- 人工复查 `Routing Config` 各 CRUD 页：Search / Add / View / Edit / Delete 弹窗、状态字段、引用删除保护、本地保存提示符合演示口径。
- 人工复查 `Routing Config > Sites` 和 `Working Time Plans` 均不再显示 timezone；`Working Time Plans` 不显示真实 `Default 24x7` 记录，支持 Basic Info / Work Schedule / Ramadan Work Schedule / Holiday Schedule / Special Working Plan 分区维护；弹框底部只显示优先级提示，不解释 Skill Queue 空工作时间方案；Holiday Name / Reason 列使用剩余空间，Holiday/Special 的 Start 时间列应与 Work/Ramadan 行 Start 列对齐；`Skill Queues` 未选择工作时间方案时显示 `Default 24x7`。
- 人工复查 `Routing Config > Skill Routing Rules`：查询区按启用路由要素多选 + Target Skill Queue + Status 展示且要素下拉无 All/Empty；Search/Reset 属于左侧查询操作组，`Batch Add` 作为右侧独立主操作按钮；列表为 Rule ID + 启用要素独立列 + Target Skill Queue / Updated Date / Updated By / Status；Batch Add 的 `Duplicate Routing Rules` 只展示重复规则，勾选覆盖原技能队列，取消勾选保留原配置，新组合保存时仍正常新增。
- 人工复查所有 Routing Config 横向滚动表格：Actions / 操作列应固定在右侧，横向滚动只作用于非操作列。
- 人工复查 `Call Management` 只保留客户可见配置入口 `Verification Rules` 与 `Text Channel Settings`；旧 `/call-management/routing-configuration` 不作为客户入口展示，应重定向到当前可见配置页或首页而不是进入隐藏 Routing Config。
- 人工复查 `Call Management > Text Channel Settings`：三页签、默认服务人数 3、坐席未回复 2 分钟自动回复、Webchat 撤回 2 分钟、客户未回复 5 分钟自动关闭、关闭前 1 分钟提醒、队列阈值 10、Save Draft / Publish 本地提示均符合演示口径。
- 人工复查正式 `Live Chat` tab：右上角总未读数 badge 应聚合当前 active 服务会话，已读/ended/history 不计入，大于 99 显示 `99+`。
- 人工复查正式 `Live Chat` 替换：Sign In 后 tab label 仍是 `Live Chat`，空态不再出现可见 `livechat2` 文案。
- 人工复查旧跳转流程：WhatsApp Demo 应进入正式 `Live Chat` 并聚焦 `livechat2-001`；BankApp Live Chat 应进入正式 `Live Chat` 并聚焦 `livechat2-002`。
- 人工复查左侧菜单：`Channel Simulation` 下只保留 PSTN、BankApp、WhatsApp，不再显示临时 `livechat2` 入口。
- 人工复查 `Quick Replies`：My/Public 和分组标题不再显示计数，phrase 不再出现 `...`，长语句完整换行。
- 人工复查 `Quick Replies`：My/Public section 和每个分类分组标题都可点击收起/展开。
- 人工复查 `Quick Replies`：My Phrases 添加分组入口应在标题右侧 hover 显示加号，不再单独占一行。
- 人工复查 `Quick Replies`：My phrase 的 Insert/Edit/Delete 操作应只在 hover / focus 时浮在语句上方，不应在未悬浮时预留右侧空白。
- 人工复查 `livechat2` 右侧 `Quick Replies` tab：tab 应固定显示在 `Connection` 后，`Message Record` 打开后追加在其后且仍可关闭。
- 人工复查 `Quick Replies`：搜索可按 code 和文本过滤，`My Phrases` / `Public Phrases` 默认展开且可收起。
- 人工复查 `Quick Replies`：My 分组可添加、重命名、删除；删除分组同步删除组内 phrase；My phrase 可添加、编辑、删除。
- 人工复查 `Quick Replies`：Public phrase 只读无增删改操作；点击 My/Public phrase 都可带入当前聊天输入框并把光标放到语句末尾。
- 人工复查 `Quick Replies` 与 `/` 浮层同步：右侧维护 My phrase 后，输入 `/` 的候选结果应即时反映新增/编辑/删除结果。
- 人工复查 `livechat2` 输入区：输入 `/` 后 quick replies 默认选中第一项，上下箭头可循环切换，按 Enter 将当前选中语句带入输入框且光标在语句末尾。
- 人工复查 `livechat2` 输入区：在 textarea 输入 `/` 后 quick replies 应显示在输入框正上方，不遮挡正在输入的内容，列表较长时内部滚动。
- 人工复查 `Message Record`：页签 icon 与文字间距应更贴近；搜索框 placeholder 字号应更小；搜索结果态才显示 `Locate`，定位后恢复连续记录态不显示定位按钮。
- 人工复查 `Message Record`：Composer 历史消息图标应为双态按钮，打开后再次点击应关闭右侧记录页签并回到 `Connection`。
- 人工复查右侧页签：`Message Record` 页签 icon / text / close 间距应与前面页签协调，more 图标不遮挡关闭按钮。
- 人工复查 `Message Record` 搜索区：面板内无重复标题和关闭按钮，日期范围、搜索框、Search、结果数应尽量一行展示。
- 人工复查 `Message Record`：默认近 7 天日期范围、输入关键字后点击 `Search` 才刷新结果、结果按时间倒序展示、匹配文字高亮。
- 人工复查 `Message Record`：hover / focus 结果行显示 `Locate`，点击后重置搜索条件并定位到中间对应聊天消息，重复定位同一条消息也应重新高亮。
- 人工复查 `livechat2` conversation 顶部：active 会话应显示渠道图标 + 名字 + 服务时长，不显示 intent/业务类型；右侧只有 `Transfer` 和 `End Service`。
- 人工复查 `livechat2-005` customer ended mock：列表头像灰掉，Conversation 顶部显示用户主动结束提示，右侧只有 `Close`，点击后进入 History。
- 人工复查 `Message Record`：点击 composer 中历史消息图标后，应在右侧 `Connection` 旁新增可关闭 tab，记录面板不再挤占 Conversation 中间消息区。
- 人工复查 `livechat2` History：历史行第二行最新消息应跨满整行，不再被右侧挂断图标 + 时间压缩；当前列表的星标/Close 行不回归。
- 人工复查 `livechat2` 历史列表展开态：历史客户行右侧应显示挂断图标 + 时间，不再显示可见 `Ended` 文案；悬浮仍能看到完整 `Ended ...` 提示。
- 人工复查 `livechat2` 历史列表展开态：今天用图标 + `HH:mm:ss`，非今天用图标 + `MM-DD HH:mm:ss`；当前列表和收起态不显示结束时间。
- 人工复查正式 `Live Chat` workspace tab：当前有服务客户时显示最长服务时长且不变色；当前没有服务客户时不显示时长；新客户接入时仍短闪。
- 人工复查 `livechat2` 客户列表收起态：历史会话头像内不显示星标，当前服务会话的星标仍按颜色展示。
- 人工复查正式 `Live Chat` workspace tab：打开多个客户后 tab 应显示最长服务时长，例如 `Live Chat (00:xx)`；新客户接入时 tab 应短闪。
- 人工复查正式 `Live Chat` Customer Information 渠道接入时长：从 WhatsApp 或 BankApp Demo route 新客户后，客户卡片里的渠道接入时长应保持 mock 中的静态值，不随服务秒数增长；workspace tab、客户列表、Conversation header 和 SLA / 未回复计时仍继续按服务时长运行。
- 在目标演示分辨率下人工复查本轮 `livechat2` 客户列表：Current / History 应恢复为居中文字 tab，客户行不再显示转接图标，顶部 ALL 渠道标识应使用系统主题深蓝色。
- 在目标演示分辨率下人工复查本轮 `livechat2` 客户列表：行 hover 才显示排序按钮、客户名与计时对齐、最新消息与星标对齐、灰色星标默认隐藏、收起态星标无白色圆底。
- 在目标演示分辨率下人工复查本轮 `livechat2` 客户列表：Assistant 风格 Current / History tab、右侧无边框排序图标、无最新消息时间、无时钟图标、展开/收起态 SLA 左侧色条、头像内只读星标和无横向滚动条。
- 在 `codex/livechat2-popup` 上继续复查：新版客户列表已挂到正式 `Live Chat` tab，客户列表收起/展开、渠道筛选、Current/History 切换不回退。
- 在 `codex/livechat2-popup` 上复查合并后的弹框：Transfer / Outbound Agent 查询栏、`Transfer Number`、`Call Number`、Internal Chat composer 应继承 `codex/modal-review-fixes` 的最新效果。
- 在当前本地页面最终人工确认 Modal 回调视觉：Transfer / Outbound / Internal Chat 应为浅蓝标题栏、灰蓝 body、白色内容面、内容不贴边，Search / Call 与输入框高度一致，行内动作按钮尺寸统一。
- 在客户目标演示分辨率下复查本轮弹框 hotfix：`Transfer Number` 无 `Cancel`，`Outbound Call > Call Number` 为输入框 + `Call` 单行布局，`Internal Chat` 视觉清晰且不回到浑浊淡蓝背景。
- 在目标演示分辨率下复查 v0.6.8 hotfix：Next Best Action hover/focus 箭头应浮在行最右侧，不占位、不错位，点击仍打开 CRM 动态 tab。
- 在目标演示分辨率下复查 v0.6.7 hotfix：Ticketing History 日期默认状态应贴到行内容最右侧并与 Customer Journey 日期列对齐，hover 箭头只覆盖不占位。
- 在目标演示分辨率下复查 v0.6.6 hotfix：Ticketing History 编号/日期必须同一行右对齐，CRM tabs 更多按钮必须窄且图标居中。
- 在目标演示分辨率下复查 v0.6.5 弹屏视觉：Ticketing History 编号/日期右对齐、CRM tab nav 多标签时高度稳定、更多按钮紧凑且动态 tab 开关不回归。
- 在目标演示分辨率下复查 BankApp / WhatsApp Demo 统一画布布局和顶部减负效果，确认手机区和 AICC Process 区在领导评审屏幕上足够像同一个客户接入演示内容，且没有文本挤压或重叠。
- 在目标演示分辨率下复查 BankApp / WhatsApp Demo 右侧同一行控制条，确认 Channel、Customer Type、Next/Reset 和 Completed 状态不换行到难以扫描。
- 在目标演示分辨率下复查 BankApp Demo 三渠道 `Agent Workspace` 步骤：Voice/Video/Live Chat 切到坐席页、切回保活、再下一步进入 `Service Closed`。
- 在目标演示分辨率下复查 WhatsApp Demo 五步流程：四张截图不裁切关键内容，第三步后切到 Live Chat，切回 WhatsApp Demo 后状态不刷新。
- 在目标演示分辨率下复查三张直接使用的客户侧附件图：`livechat-queue.png`、`livechat-chat.png`、`service-closed.png`，确认在手机框内不裁切关键内容。
- 在目标演示分辨率下复查 `video-connected-new.png` 附件原图，确认在手机框内不裁切通话按钮和右上角小窗。
- 在目标演示分辨率下复查 BankApp Video 桌面共享新增步骤，确认 OpenEye `桌面共享` 按钮、选择共享程序截图和 BankApp 客户侧共享画面与演示附件视觉一致。
- 在目标演示分辨率下复查 Live Chat 默认收起态、展开态与渠道过滤交互，确认客户列表不会让 Customer Information、CRM、Assistant 三栏不可用。
- 在目标演示分辨率下复查 Conversation tab 的顶部轻量操作区、历史消息区和发送框，确认不会压缩 CRM/Assistant 三栏到不可用。
- 在目标演示分辨率下复查 `livechat2` 客户列表收起/展开、渠道筛选、Current/History 左右切换、消息记录侧栏和快捷回复浮层，确认四列布局不压缩 Customer Information、Conversation 和 Assistant。
- 继续人工调试 `livechat2` 的排序、星标、End/Close、Transfer、消息记录搜索和快捷回复交互，决定是否替换旧 `Live Chat`。
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


