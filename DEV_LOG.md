# BANK 1 AICC Demo V2 - 开发日志

最后更新：2026-06-25 16:40 +08:00
项目路径：`D:\03projects\bca-aicc-demo-v2`

## 记录规则

DEV_LOG.md 是当前活跃开发日志和历史归档入口，不再作为完整历史大文件使用。新 Codex 会话默认只阅读本文件顶部规则、Archive Index 和最近活跃记录；排查历史问题时再用关键词检索归档文件。

重要修改应新增日志，优先记录：

- 修改时间。
- 修改页面、文件或模块。
- 修改原因。
- 修改结果。
- 回滚说明。
- 当前风险点。

需要记录的修改包括：重要功能、版本、部署、架构变化、接口或 mock 数据结构变化、业务规则变化、关键 bug 修复、上下文恢复、知识库维护机制变化。

普通字体、图标、颜色、间距、文案等低风险微调，不需要写成长篇日志；如果会影响客户演示或长期规则，再记录。

## Archive Index

- `DEV_LOG.md`: active log from 2026-06-16 to current.
- `docs/archive/dev-log/DEV_LOG_2026-06-01_to_2026-06-15.md`: archived records from 2026-06-01 to 2026-06-15.
- `docs/archive/dev-log/DEV_LOG_2026-05.md`: archived records from 2026-05.

Historical entries are preserved in archive files without content rewrites. Use `rg` across `DEV_LOG.md` and `docs/archive/dev-log/` when investigating older context.
## 日志

### 2026-06-25 16:40 +08:00 - Busy Reason 默认启用 AUX 列表调整

修改页面或文件：

- `src/mock/busyReasons.ts`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 用户要求将 Busy Reason Management 中启用数据配置为指定 AUX List。

修改结果：

- BR001-BR011 已按顺序配置为 Break、Coaching/Meeting、Prayer、Toilet、Others、Callback Finrisk、Callback Misinform、Sick/Problem Non System、Routine Job、Problem System、Special Assignment。
- 这些记录均保持 `Active`，会出现在坐席头像菜单的 AUX 选项中。
- BR012 及之后扩展项保持 `Disabled`，不影响 AUX 菜单。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留 Vite chunk size 提示。

回滚说明：

- 如需回滚，可恢复 `src/mock/busyReasons.ts` 中 BR001-BR011 的默认名称、备注、状态和更新时间。

当前风险点：

- Busy Reason store 为本地前端状态；刷新页面会回到当前 mock 默认列表。

### 2026-06-25 10:12 +08:00 - 新增 Common Number Management 与 Transfer IVR

修改页面或文件：

- `src/pages/call-management/CommonNumberManagementPage.tsx`
- `src/types/commonNumber.ts`
- `src/mock/commonNumbers.ts`
- `src/store/callManagementStore.ts`
- `src/layouts/components/TransferModal.tsx`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/pages/call-management/index.ts`
- `src/types/index.ts`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户要求在 `Call Management` 下新增常用号码管理菜单，用于维护坐席语音服务中可转接的 IVR 号码。
- 用户要求在语音呼叫转接弹窗的 `Transfer Number` 后新增 `Transfer IVR`，仅展示启用状态的常用号码并提供转移按钮。

修改结果：

- 新增 `Call Management > Common Number Management` 菜单和 `/call-management/common-numbers` 路由。
- 新增 Common Number 类型、默认 mock 数据和 `callManagementStore` CRUD 能力。
- 管理页支持按 Name / Number / Status 查询；列表包含 No.、Name、Number、Status、Remark、Actions；支持 Add、Edit、Delete。
- Name 和 Number 在当前 demo session 内按 trim + lowercase 唯一；Number 仅必填，不做严格电话格式限制。
- Call Transfer modal 在 call variant 下新增 `Transfer IVR` 页签，只展示 `Active` 常用号码，列表包含 Name、Number、Remark、Action。
- Conversation transfer variant 不显示 `Transfer Number` 或 `Transfer IVR`。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留 Vite chunk size 提示。
- HTTP smoke 已通过：`/call-management/common-numbers`、`/call-management/common-phrases`、`/` 均返回 200。
- UI smoke 已尝试；本地浏览器 / CDP 调试端口连接失败，未能完成新增 / 编辑 / 删除和 Transfer modal 交互验证。

回滚说明：

- 如需回滚本功能，移除新增页面、类型、mock、store 字段和路由菜单项，并恢复 `TransferModal.tsx` 的 call variant 页签为 `Transfer Agent` / `Transfer Skill` / `Transfer Number`。

当前风险点：

- 当前为前端 demo store 行为，不接真实后端；刷新后恢复默认常用号码数据。
- `Transfer IVR` 点击 Transfer 仍沿用当前 transfer demo 行为，仅关闭弹窗，不发送真实 IVR 转接事件。

### 2026-06-25 09:36 +08:00 - Working Time Plan 英文展示名修正

修改页面或文件：

- `src/mock/routingConfiguration.ts`
- `DEV_LOG.md`

修改原因：

- 用户反馈 `Routing Config > Channels` 中 Phone Business Config 的 `Exception Working Time Plan` 下拉仍显示中文 `输入有误-中文`，需要改为英文。
- 该字段通过 `exceptionWorkTimePlanCode` 引用 `Working Time Plans` 数据源，因此应从工作时间计划源数据同步修正。

修改结果：

- 将 `WTP_3_WRONG_INPUT_ZH` 的 `planName` 从 `输入有误-中文` 改为 `Input error - Chinese`。
- `Channels` 页面仍按同一 plan code 引用该计划，工作时间管理列表和渠道业务配置下拉会显示同一英文名称。

验证：

- `rg` 已确认相关源码中不再保留 `输入有误` 展示值。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- HTTP smoke 已确认本地 `/routing-config/working-time-plans` 返回 200；Browser 插件连接超时，未完成截图级可视化 smoke。

回滚说明：

- 如需回滚，将 `src/mock/routingConfiguration.ts` 中 `WTP_3_WRONG_INPUT_ZH.planName` 恢复为 `输入有误-中文`。

当前风险点：

- 当前修改仅影响默认 mock / store 初始数据；如果浏览器中已有旧 demo session 状态，需要刷新或重置 Routing Config store 才会看到最新默认值。

### 2026-06-24 11:00 +08:00 - Common Link 接入共享右侧面板

修改页面或文件：

- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/styles/index.less`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 用户要求来电弹屏右侧“常用链接”从 `Call Management > Common Link Management` 数据读取，展示网站名和地址，点击后浏览器新开页面打开地址。
- 用户确认这是共享右侧组件能力，语音、视频、文字工作台都应使用。

修改结果：

- 共享右侧面板内置 `Connection` 占位页签改为用户可见的 `Common Links`。
- `Common Links` 从 `callManagementStore.commonLinkEntries` 读取当前 demo session 的 Common Link 数据。
- 每条链接仅展示 Website Name 和 Website URL，整行可点击，并通过 `target="_blank"` / `rel="noreferrer"` 新开浏览器页面。
- 当当前 demo session 的 Common Link 全部删除时，右侧显示紧凑空态。
- Live Chat 的 `Quick Replies` 和 `Message Record` 额外页签仍沿用原有追加逻辑。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- 使用本地 Edge headless/CDP smoke 验证通过：PSTN 工作台右侧展示 3 条默认 Common Link，点击链接会新开页面；Live Chat 右侧同样展示 Common Links 且 Quick Replies 保持存在；`Common Link Management` 新增、编辑、删除的链接会在同一 demo session 的共享右侧面板中同步反映。

回滚说明：

- 如需回滚，恢复 `AssistantPanel.tsx` 中硬编码的 `ConnectionSystemArea`，并将 `src/styles/index.less` 中 `inbound-common-links-system*` 样式恢复为原 `inbound-connection-system*`。

当前风险点：

- Common Link 数据仍是前端 demo store 行为，刷新后恢复默认 mock 数据；点击外部示例域名是否可访问取决于浏览器和网络环境。

### 2026-06-23 18:19 +08:00 - 调整 Live Chat 客户列表星标与未回复进度条

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 客户反馈 Live Chat 左侧客户列表星标功能暂时作用不大，要求隐藏。
- 客户希望未回复 1 分钟黄色提醒、2 分钟红色提醒的状态以横向进度条方式呈现，并在收起列表状态下也能看到提醒进度。

修改结果：

- Live Chat 2 客户列表不再显示星标按钮、星标菜单或收起态头像角标；底层星标兼容状态暂不删除。
- 当前会话在未回复时显示横向进度条，以红色 breach 阈值作为 100%；未到 warning 阈值为绿色，达到 warning 阈值转黄色，达到 breach 阈值转红色。
- 收起态客户列表同样显示短进度条。
- 旧的黄色/红色左侧竖条提醒移除，避免与新进度条重复表达。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- Browser 插件连接 in-app browser 超时；本地 Edge/CDP fallback 受环境权限限制未完成截图级 smoke。已通过代码级检查确认星标入口相关 JSX/CSS 被移除，进度条 JSX/CSS 已接入展开和收起状态。

回滚说明：

- 如需恢复星标 UI，回退 `LiveChat2CustomerPanel.tsx` 中星标 Dropdown / 头像角标相关 JSX 和 `src/styles/index.less` 中 star 样式。
- 如需恢复旧 SLA 视觉，回退 `livechat2-session-card--warning / --breach` 竖条样式并移除 `livechat2-session-card__sla-progress` 相关 JSX / CSS。

当前风险点：

- 进度条阈值当前跟随前端常量 `LIVE_CHAT_SLA_WARNING_SECONDS` / `LIVE_CHAT_SLA_BREACH_SECONDS`；如后续要从配置页面读取阈值，需要再接入配置源。

### 2026-06-22 22:05 +08:00 - 新增 Common Link Management 并修正公共常用语 Add

修改页面或文件：

- `src/pages/call-management/CommonPhraseManagementPage.tsx`
- `src/pages/call-management/CommonLinkManagementPage.tsx`
- `src/types/commonLink.ts`
- `src/mock/commonLinks.ts`
- `src/store/callManagementStore.ts`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/pages/call-management/index.ts`
- `src/types/index.ts`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户反馈 `Common Phrase Management` 的 Add 按钮被禁用。
- 用户要求在 `Call Management` 下新增常用链接管理菜单，采用管理台统一风格，围绕网站名称、网站地址、备注字段维护。

修改结果：

- `Common Phrase Management` 在 `All Categories` 视图下也可以点击 Add；新增弹窗默认选择第一个分类，并允许在弹窗中切换分类。
- 新增 `Call Management > Common Link Management` 菜单和 `/call-management/common-links` 路由。
- 新增常用链接类型、默认 mock 数据和 `callManagementStore` CRUD 能力。
- 页面支持按 Website Name / Website URL 查询；列表包含 No.、Website Name、Website URL、Remark、Actions；支持 Add、Edit、Delete。
- Website Name 和 Website URL 在当前 demo session 内按 trim + lowercase 唯一；Website URL 要求以 `http://` 或 `https://` 开头。

验证：

- 后续仍需在完成本轮改动后运行 `npm run lint`、`npm run build` 和页面 smoke。

回滚说明：

- 如需回滚 Common Link Management，移除新增页面、类型、mock、store 字段和路由菜单项。
- 如需恢复公共常用语旧交互，回退 `CommonPhraseManagementPage.tsx` 中 Add 的默认分类逻辑和弹窗分类 Select。

当前风险点：

- 当前为前端 demo store 行为，不接真实后端；刷新后恢复默认常用链接数据。
- Common Link Management 目前只维护链接清单，尚未接入 Live Chat 或其它工作区的插入/打开入口。

### 2026-06-22 21:40 +08:00 - 新增 Sensitive Word Management 与发送前拦截

修改页面或文件：

- `src/pages/call-management/SensitiveWordManagementPage.tsx`
- `src/types/sensitiveWord.ts`
- `src/mock/sensitiveWords.ts`
- `src/store/callManagementStore.ts`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/pages/call-management/index.ts`
- `src/types/index.ts`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户要求在 `Call Management` 中新增敏感词管理菜单，用于维护坐席回复消息发送前的自动检测词表。
- 命中敏感词时，系统需要禁止发送并提示坐席修改。

修改结果：

- 新增 `Call Management > Sensitive Word Management` 菜单和 `/call-management/sensitive-words` 路由。
- 新增敏感词类型、默认 mock 数据和 `callManagementStore` CRUD / 匹配查询能力。
- 敏感词分类作为固定数据字典，不在菜单中维护；当前示例分类包括 Security Credential、Personal Data Exposure、Regulatory or Compliance Risk、Profanity / Offensive Language、Harassment / Discriminatory Language。
- 页面支持按 Sensitive Word、Category 查询；列表包含 No.、Sensitive Word、Category、Remark、Actions；支持 Add、Edit、Delete。
- Live Chat 坐席发送回复前会按 trim + lowercase 的 contains 规则检测敏感词；命中后不发送，保留草稿，并在 composer 上方显示命中词和分类提示。

验证：

- `npm run lint` 已通过。
- 后续仍需在完成本轮改动后运行 `npm run build` 和页面 smoke。

回滚说明：

- 如需回滚本功能，移除新增页面、类型、mock、store 字段和路由菜单项，并恢复 `LiveChat2Page` 直接调用 `sendLiveChat2Message`。
- 如只需隐藏入口，可先移除 `BasicLayout` 菜单项和 `/call-management/sensitive-words` 路由，保留底层 store/mock 以便后续恢复。

当前风险点：

- 当前为前端 demo store 行为，不接真实后端；刷新后恢复默认敏感词数据。
- 敏感词匹配是简单 contains 规则，不包含分词、词形变化、多语言归一化、白名单或审核日志。

### 2026-06-22 18:19 +08:00 - 新增 Common Phrase Management

修改页面或文件：

- `src/pages/call-management/CommonPhraseManagementPage.tsx`
- `src/types/commonPhrase.ts`
- `src/mock/commonPhrases.ts`
- `src/store/callManagementStore.ts`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/liveChat2QuickReplies.ts`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-22-1819.md`
- `.codex-backup/current-todo-2026-06-22-1819.md`
- `.codex-backup/page-state-2026-06-22-1819.md`

修改原因：

- 用户要求在 `Call Management` 中新增公共常用语管理菜单，用于维护文字弹屏右侧 `Quick Replies > Public Phrases` 的分类和常用语。
- 用户确认该菜单只维护公共常用语；坐席个人 `My Phrases` 不纳入管理台。

修改结果：

- 新增 `Call Management > Common Phrase Management` 菜单和 `/call-management/common-phrases` 路由。
- 新增公共常用语分类与常用语类型、默认 mock 数据和 `callManagementStore` CRUD / 移动能力。
- 页面采用左右结构：左侧分类搜索、新增、重命名、删除；右侧按 Shortcut Code / Common Phrase 查询，支持 Add、Move to Category、行内 Edit / Delete。
- 快捷代码在公共常用语范围内按 trim + lowercase 全局唯一；分类名称按 trim + lowercase 唯一。
- 删除分类需要确认，确认后级联删除该分类下所有常用语。
- `LiveChat2Page` 的 Public Phrases 改为从 `callManagementStore` 读取；My Phrases 继续使用原本的本地 state 和弹屏内编辑能力。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm.cmd run lint` 已通过。
- `npm.cmd run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- HTTP smoke 已通过：`/`、`/call-management/common-phrases`、`/call-management/priority-list`、`/call-management/blacklist` 均返回 200。
- Browser 插件未暴露可调用工具，Node REPL fallback 缺少 `playwright` 模块，因此未完成截图级浏览器自动化验证。

回滚说明：

- 如需回滚本功能，移除新增页面、类型、mock、store 字段和路由菜单项，并恢复 `LiveChat2Page` 直接使用 `defaultLiveChat2QuickReplyGroups` 中的 public 数据。
- 如只需隐藏入口，可先移除 `BasicLayout` 菜单项和 `/call-management/common-phrases` 路由，保留底层 store/mock 以便后续恢复。

当前风险点：

- 当前仍是前端 demo store 行为，不接真实后端；刷新后恢复默认公共常用语数据。
- 需要在客户演示前人工验证管理台修改后 Live Chat 右侧 Public Phrases 同步变化。

### 2026-06-18 15:11 +08:00 - 开发日志归档与知识库维护规则优化

修改页面或文件：

- `AGENTS.md`
- `DEV_LOG.md`
- `docs/archive/dev-log/DEV_LOG_2026-05.md`
- `docs/archive/dev-log/DEV_LOG_2026-06-01_to_2026-06-15.md`

修改原因：

- 当前 `DEV_LOG.md` 已积累 277 条历史记录，文件体量约 623KB，不适合作为新 Codex 会话的默认启动阅读材料。
- 用户希望切换账号、团队成员或新会话后，项目仍能低成本恢复上下文，并由 Codex 自动判断和维护项目知识库。

修改结果：

- `AGENTS.md` 已更新为统一入口规范，采用 Level 1 / Level 2 分层读取策略。
- `AGENTS.md` 已明确项目知识库各文件职责，并采用分级自动更新机制：事实型更新自动维护，高影响不确定决策才询问产品经理。
- `DEV_LOG.md` 已改为当前活跃日志和历史归档入口，只保留 2026-06-16 至当前的活跃记录。
- 2026-05 历史记录已迁移到 `docs/archive/dev-log/DEV_LOG_2026-05.md`。
- 2026-06-01 至 2026-06-15 历史记录已迁移到 `docs/archive/dev-log/DEV_LOG_2026-06-01_to_2026-06-15.md`。

回滚说明：

- 如需回滚日志归档，可将两个归档文件中的记录按日期顺序合并回 `DEV_LOG.md` 的 `## 日志` 下，并删除 `Archive Index`。
- 如需回滚入口规则，可恢复 `AGENTS.md` 到上一版启动阅读和文档同步规则。

当前风险点：

- 本次仅修改 Markdown 文档，未运行 `npm run lint` 或 `npm run build`。
- 历史记录是按日期标题机械迁移，后续排查历史问题时需要同时检索 `DEV_LOG.md` 和 `docs/archive/dev-log/`。

### 2026-06-18 11:02 +08:00 - 项目知识库与交接文档整合

修改页面或文件：

- `PROJECT_CONTEXT.md`
- `DESIGN_SYSTEM.md`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `AGENTS.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-18-1102.md`
- `.codex-backup/current-todo-2026-06-18-1102.md`
- `.codex-backup/page-state-2026-06-18-1102.md`

修改原因：

- 用户要求仅新增/整理文档，不开发功能、不修改代码、UI 或配置。
- 当前项目后续可能由其他账号或成员继续维护，需要基于实际代码和已实现功能生成完整项目知识库与交接文档。

修改结果：

- 根目录已形成交接文档集：项目上下文、设计系统、业务规则、当前状态、当前 TODO 和未来 Codex 会话规则。
- `PROJECT_CONTEXT.md` 与 `AGENTS.md` 已按用户确认的“整合覆盖”策略改为当前交接版。
- `.codex-backup/` 已新增本次文档交接 snapshot、TODO 和 page-state。

回滚说明：

- 本次仅涉及 Markdown 文档。
- 如需回滚，可恢复上述文档到上一版本，并删除本次新增的四个根目录交接文档与三份 `.codex-backup/2026-06-18-1102` 备份文件。

当前风险点：

- 本次未运行 `npm run lint` 或 `npm run build`，原因是未修改任何运行时代码、UI、样式或配置。
- 文档内容基于当前源码、mock、路由、备份和已有实现整理；后续如果继续修改业务行为，需要同步更新这些交接文档。

### 2026-06-17 18:57 +08:00 - Priority List 查询匹配规则与示例数据调整

修改页面或文件：

- `src/pages/call-management/PriorityListManagementPage.tsx`
- `src/mock/priorityList.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-17-1857.md`
- `.codex-backup/current-todo-2026-06-17-1857.md`
- `.codex-backup/page-state-2026-06-17-1857.md`

修改原因：

- 用户补充 `Priority List Management` 查询条件也需要支持按匹配规则筛选。
- 用户补充示例数据中邮箱域名类的 `@` 开头配置应展示为模糊匹配，便于客户理解域名包含匹配的配置方式。

修改结果：

- `Priority List Management` 查询区新增 `Match Rule` 筛选条件，默认空值表示 All Match Rules。
- 查询逻辑新增按 `entry.matchRule` 过滤，继续与 Channel、Identifier 条件组合生效。
- 默认优先名单 mock 中 `@ojk.co.id`、`@bi.go.id` 改为 `Partial Match`；普通手机号、Bank ID、社媒账号和完整邮箱地址继续为 `Exact Match`。
- 新增/保存逻辑不改，仍由用户在 Batch Add 弹框选择 `Exact Match` 或 `Partial Match`，不恢复自动邮箱域名判断。
- `Blacklist Management` 未做业务调整。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- 后续已运行 `npm.cmd run lint`、`npm.cmd run build` 和 HTTP smoke，结果记录在本轮最终回复。

回滚说明：

- 如需移除查询筛选，删除 `PriorityListFilters.matchRule`、查询区 `Match Rule` 字段和 `filteredEntries` 中的 `matchRuleMatched` 判断即可。
- 如需让示例数据全部回到精准匹配，删除 `partialMatchSeedIdentifiers` / `getSeedMatchRule`，并把 mock 中 `matchRule` 固定为 `exact_match` 即可。

当前风险点：

- `Partial Match` 是包含匹配口径，真实后端匹配需要按同样语义落地；前端当前只做配置展示和 demo store。

### 2026-06-17 18:50 +08:00 - Priority List Match Rule 简化

修改页面或文件：

- `src/pages/call-management/PriorityListManagementPage.tsx`
- `src/types/priorityList.ts`
- `src/mock/priorityList.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-17-1850.md`
- `.codex-backup/current-todo-2026-06-17-1850.md`
- `.codex-backup/page-state-2026-06-17-1850.md`

修改原因：

- 客户和同事反馈优先名单配置不应继续让用户理解邮箱域名等特殊自动规则，应统一为客户更容易理解的精准匹配和模糊匹配。
- 用户确认“模糊匹配”按包含关系处理，即客户标识包含配置值即可命中。

修改结果：

- `PriorityListMatchRule` 简化为 `exact_match` 与 `partial_match`。
- `Priority List Management` 的 Batch Add 弹框在 `Identifier` 后新增 `Match Rule` 下拉，默认 `Exact Match`；同一批次内所有选中 Channel 和所有 Identifier 使用同一个 Match Rule。
- 列表继续展示 `Match Rule`，展示文案为 `Exact Match` / `Partial Match`。
- 不再自动判断邮箱域名，不再使用或展示 `Email Domain Match`；默认 priority list mock 数据全部为 `Exact Match`。
- 重复判断继续按 `Channel + normalized Identifier + Match Rule`，因此相同 Channel + Identifier 但不同 Match Rule 可以分别存在。
- `Identifier` tooltip 改为解释 `Exact Match` 等于客户标识必须完全等于配置值，`Partial Match` 等于客户标识包含配置值。
- `Blacklist Management` 未做业务调整。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm.cmd run lint` 已通过。
- `npm.cmd run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- HTTP smoke 已通过：`/call-management/priority-list`、`/call-management/blacklist` 均返回 200。
- `git diff --check` 无实际 whitespace error；仅有既有 Windows LF/CRLF warning。
- 目标文件扫描确认不再包含 `email_domain_match`、`Email Domain Match`、`getPriorityListMatchRule`、`emailDomain`。

回滚说明：

- 如需恢复邮箱域名自动匹配，需要把 `PriorityListMatchRule` 恢复为包含 `email_domain_match`，并恢复页面与 mock 中按渠道和 Identifier 派生规则的逻辑。
- 如需移除用户可选匹配规则，删除 Batch Add 弹框中的 `Match Rule` 字段，并将新增记录固定写入 `exact_match` 即可。

当前风险点：

- 前端当前只维护 demo store 和配置展示；真实排队优先匹配需要后端执行层按同一语义实现：`Exact Match` 为等值匹配，`Partial Match` 为包含匹配。
- `Partial Match` 对短字符串可能扩大命中范围，演示时需要提示客户谨慎配置过短的值。

### 2026-06-16 19:20 +08:00 - 移除客户卡片 Menu 并默认开放 Routing Config

修改页面或文件：

- `.env.example`
- `src/config/featureFlags.ts`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1920.md`
- `.codex-backup/current-todo-2026-06-16-1920.md`
- `.codex-backup/page-state-2026-06-16-1920.md`

修改原因：

- 用户确认业务菜单已移动到顶部话务条 `Skill`，`Customer Information` 卡片底部不再需要重复展示 `Menu`。
- 客户已开始询问渠道策略，需要默认开放 `Routing Config` 整体菜单给客户查看，但保留后续可关闭开关。
- 用户补充 `Webchat Message Recall Limit (sec)` 只对 Webchat 渠道有效，其它渠道不应展示该字段。
- 用户补充 Phone 渠道没有账号配置，Channels 列表中的 `Accounts` 按钮应置灰不可点击。

修改结果：

- `CustomerInformationCard` 不再传入 `accessRouteHintNode`，客户卡片底部不再显示 `Menu` 与最新菜单名；内部 `routeMenuName` 继续用于 V2 Verification 默认 Skill Queue 映射。
- `VITE_ENABLE_ADMIN_MENUS` 改为默认开放；仅显式配置为 `false` 时隐藏 `Routing Config` 菜单并阻止 `/routing-config/*` 直达。
- `.env.example` 默认值改为 `VITE_ENABLE_ADMIN_MENUS=true`，并说明可设置为 `false` 隐藏。
- `Routing Config > Channels` 中 Phone 渠道 `Accounts` 按钮置灰，点击不会打开账号管理弹框。
- `Business Config` 中 `Webchat Message Recall Limit (sec)` 仅在 `WEBCHAT + TEXT` 下展示。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- HTTP smoke 已通过：`/`、`/routing-config/channels`、`/routing-config/skill-routing-rules`、`/routing-config/business-types`、`/design-system` 均返回 200。
- `git diff --check` 无实际 whitespace error；仅有既有 Windows LF/CRLF warning。
- 新增行敏感词扫描无命中。
- Browser 插件连接 in-app browser 超时，未完成截图/DOM 级浏览器验证。

回滚说明：

- 如需回滚客户卡片 `Menu`，恢复 `CustomerInformationCard` 的 `accessRouteHintNode` 渲染与 `ApartmentOutlined` import 即可。
- 如需再次隐藏 `Routing Config`，无需代码回滚，发布环境设置 `VITE_ENABLE_ADMIN_MENUS=false` 即可；如需代码默认隐藏，则恢复 `featureFlags` 为仅 `true` 开放并将 `.env.example` 改回 `false`。
- 如需恢复所有文字渠道的 recall 字段，移除 `isWebchatText` 条件即可。
- 如需让 Phone 可维护账号，移除 `canManageChannelAccounts` 对 `PHONE` 的限制即可。

当前风险点：

- 截图级浏览器验证仍建议在客户演示前人工复查，重点是 `/routing-config/channels` 中 Phone 账号按钮置灰、Webchat 业务配置展示 recall 字段，以及其它文字渠道不展示该字段。

### 2026-06-16 17:05 +08:00 - Skill 标签按客户原文大小写

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1705.md`
- `.codex-backup/current-todo-2026-06-16-1705.md`
- `.codex-backup/page-state-2026-06-16-1705.md`

修改原因：

- 用户确认客户截图写法是 `Skill`，界面应尊重客户原文大小写，不应改为全大写 `SKILL`。
- 用户询问截图中的 `e.g.` 含义；本轮解释为 “for example / 例如”，不是需要显示在 UI 中的文案。

修改结果：

- 顶部话务条识别区第二行标签改回 `Skill`。
- tooltip / aria title 中同步使用 `Skill`。
- 自适应两列对齐布局不变：号码和业务菜单名称仍从同一 value 列起始位置对齐。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- HTTP smoke 已通过：`/` 与 `/design-system` 均返回 200。

回滚说明：

- 如需回滚，仅将 `AgentToolbar` 中可见标签和 call context title 的 `Skill` 改回 `SKILL`；不涉及状态模型或样式回滚。

当前风险点：

- 仍建议目标演示分辨率人工确认两列自适应宽度和右侧 Header 操作间距。

### 2026-06-16 16:59 +08:00 - 顶部识别区标签与 value 对齐

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1659.md`
- `.codex-backup/current-todo-2026-06-16-1659.md`
- `.codex-backup/page-state-2026-06-16-1659.md`

修改原因：

- 用户确认当前两行识别区仍有两个视觉问题：`IVR` 与 `Skill` 标签样式不一致，且固定宽度导致号码和业务菜单名称后面出现一大块空白。

修改结果：

- 顶部识别区第二行标签从 `Skill` 改为 `SKILL`，与 `IVR` 标签保持同一字样风格。
- 识别区改为自适应宽度 grid：左列为标签，右列为 value，号码与业务菜单名称从同一列起始位置对齐。
- 移除识别区固定 196px 宽度，保留最大宽度与 value 省略，避免长业务名挤压右侧 Header 操作。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- HTTP smoke 已通过：`/` 与 `/design-system` 均返回 200。
- `git diff --check` 无实际 whitespace error；仅有既有 Windows LF/CRLF warning。

回滚说明：

- 如需回滚，仅恢复 `.aicc-agent-toolbar__identification` 为固定宽度 flex 两行样式，并将第二行可见标签恢复为 `Skill`。

当前风险点：

- 仍建议在目标演示分辨率人工确认自适应宽度下不会遮挡 Header 右侧消息按钮。

### 2026-06-16 16:46 +08:00 - 顶部 Skill 识别区改为两行

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1646.md`
- `.codex-backup/current-todo-2026-06-16-1646.md`
- `.codex-backup/page-state-2026-06-16-1646.md`

修改原因：

- 用户发现上一版将 `IVR/BankID` 与 `Skill` 横向拼接后，顶部话务条长度可能遮挡 Header 右侧消息按钮。
- 需要保留 ringing 时立即展示 Skill，同时避免继续横向扩张。

修改结果：

- `AgentToolbar` 的 call context 从横向两段改为识别区内部上下两行：第一行显示 `IVR/BankID + value`，第二行显示 `Skill + Credit card activation`。
- 话务按钮、Ready 状态、计时器和 more 按钮仍保持单行。
- `.aicc-agent-toolbar` 不再扩大到 `72vw / 960px`，回到原有安全宽度；识别区固定约 196px 并对长文本省略。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- HTTP smoke 已通过：`/` 与 `/design-system` 均返回 200。
- `git diff --check` 无实际 whitespace error；仅有既有 Windows LF/CRLF warning。
- 本轮尝试使用本机 Edge CDP 做几何检查，但 Node CDP 脚本被 Windows permission error 阻断；截图级浏览器验证未完成，仍建议客户演示前在目标分辨率人工确认消息按钮不被遮挡。

回滚说明：

- 如需回滚，仅恢复 `AgentToolbar` 中 call context 的横向 item class，并恢复 `.aicc-agent-toolbar__identification` 横向 `inline-flex` 样式；不影响 `CallInteraction.skillDisplayName` 数据模型。

当前风险点：

- 仍需人工视觉确认两行识别区在目标演示分辨率下不会显得过挤。
- 当前 Skill 文案仍为 demo 默认值，尚未接入来源菜单动态映射。

### 2026-06-16 16:02 +08:00 - Inbound ringing 顶部 Skill 展示

修改页面或文件：

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1602.md`
- `.codex-backup/current-todo-2026-06-16-1602.md`
- `.codex-backup/page-state-2026-06-16-1602.md`

修改原因：

- 客户在现有原型截图中标注要求坐席收到来电的 ringing pop-up 立即显示 `Skill`，示例为 `Skill: Credit card activation`。
- 该信息应与顶部话务条的 `IVR/BankID` 接入标识同生命周期展示，而不是主要放在 `Customer Information` 下方。

修改结果：

- `CallInteraction` 新增 `skillDisplayName`，当前 demo 来电统一写入 `Credit card activation`。
- `BasicLayout` 在非 Idle 的当前通话中读取 `skillDisplayName` 并传给 `AgentToolbar`。
- `AgentToolbar` 将接入标识渲染为紧凑 call context：`IVR 08123456789 | Skill Credit card activation` 或 `BankID 00012345 | Skill Credit card activation`。
- 顶部话务条宽度和识别区样式已调整，Skill 长文本会省略，避免挤压 Header 右侧操作。
- `Customer Information` 中现有 `Menu` 提示保留为辅助信息，不再作为本需求主要展示点。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- HTTP smoke 已通过：`/` 与 `/design-system` 均返回 200。
- Browser 插件连接 in-app browser 两次超时，且本地未安装 Playwright/Puppeteer，因此本轮未完成 DOM/截图级浏览器交互验证。

回滚说明：

- 如需回滚，移除 `CallInteraction.skillDisplayName`、恢复 `AgentToolbar` 单一 `callIdentification` 渲染，并恢复 `.aicc-agent-toolbar` 与 `.aicc-agent-toolbar__identification` 的旧样式即可。

当前风险点：

- 当前 Skill 文案为 demo 默认值，尚未按 IVR/Haloapp 实际菜单或 BankApp 选项动态映射。
- 仍建议客户演示前人工打开 `/`，确认 Incoming、Talking、Hold、Mute 和 Hang Up 后的顶部话务条显示/隐藏符合预期。

### 2026-06-16 14:36 +08:00 - 合并 V2 为正式 Verification Rules 菜单

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1436.md`
- `.codex-backup/current-todo-2026-06-16-1436.md`
- `.codex-backup/page-state-2026-06-16-1436.md`

修改原因：

- 用户确认新版场景化 `Verification Rule V2` 已成为正式方案，旧版 `Verification Rules` 不应继续作为客户菜单入口展示。

修改结果：

- 左侧 `Call Management` 下只保留一个 `Verification Rules` 菜单。
- `/call-management/verification-rules` 改为渲染 `VerificationRuleV2Page`。
- `/call-management/verification-rule-v2` 改为重定向到 `/call-management/verification-rules`。
- 旧 `VerificationRulesPage` 源码保留，但不再由菜单或路由引用。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- `src/` 客户可见旧品牌敏感词扫描无匹配。
- HTTP smoke 已通过：`/`、`/call-management`、`/call-management/verification-rules`、`/call-management/verification-rule-v2`、`/design-system` 均返回 200。
- 源码检查确认 `src/` 客户可见文案不再包含 `Verification Rule V2`。
- `git diff --check` 无实际 whitespace error；仅有既有 Windows LF/CRLF warning。

回滚说明：

- 如需回滚，恢复 `BasicLayout` 中 `Verification Rule V2` 菜单项、恢复 `/call-management/verification-rules` 指向旧 `VerificationRulesPage`，并恢复 `/call-management/verification-rule-v2` 指向 `VerificationRuleV2Page`。

当前风险点：

- Node 环境缺少 Playwright 模块，本轮未完成 DOM 级浏览器检查；仍建议人工确认客户演示环境中旧书签 `/call-management/verification-rule-v2` 会跳转到新版正式路径，且侧栏选中态仍正确。

### 2026-06-16 14:18 +08:00 - Personal Loan 坐席提示与 Agent Hint 样式

修改页面或文件：

- `src/mock/verificationRuleV2.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1418.md`
- `.codex-backup/current-todo-2026-06-16-1418.md`
- `.codex-backup/page-state-2026-06-16-1418.md`

修改原因：

- 用户确认 `Personal Loan` 原文中“错答 3 次后 CCO 不能继续处理申请/请求”应作为坐席备注展示，同时 `Max Wrong = 3` 继续保留为系统规则。
- 用户希望坐席提示更明显，但不想使用红色造成错误感。

修改结果：

- `Personal Loan` 默认场景新增原文 `Agent Hint`：`Jika Nasabah salah menjawab 3 kali pertanyaan verifikasi maka CCO tidak bisa lanjut proses permohonan / permintaan nasabah`。
- `Personal Loan` 仍保持 7 道候选题、必对 5、`Max Wrong = 3`。
- V2 坐席侧和 Preview 的 Agent Hint 改为更明显的浅蓝信息条：浅蓝底、深蓝字、清晰蓝色边框。
- Paylater 口径记录为当前 demo 先按“可沿用 Perbankan”处理，保持 `Max Wrong = 3`；独立内部规则待客户确认。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- `src/` 客户可见旧品牌敏感词扫描无匹配。
- HTTP smoke 已通过：`/`、`/call-management/verification-rule-v2`、`/design-system` 均返回 200。
- `git diff --check` 无实际 whitespace error；仅有既有 Windows LF/CRLF warning。

回滚说明：

- 如需回滚，移除 `Personal Loan` 默认 scenario 的 `agentHint`，并恢复 `.inbound-verification-workflow__hint` 的旧浅色样式。

当前风险点：

- 命令级验证已通过；仍建议人工在 Preview 中确认长原文提示换行后不挤压题目列表，且浅蓝信息条不会过度抢占视觉焦点。

### 2026-06-16 14:02 +08:00 - 修正 KlikBank Bisnis 组织客户场景题库

修改页面或文件：

- `src/mock/verificationRuleV2.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1402.md`
- `.codex-backup/current-todo-2026-06-16-1402.md`
- `.codex-backup/page-state-2026-06-16-1402.md`

修改原因：

- 用户发现 `KlikBank Bisnis` 的 `O1-O3` 只显示 3 道题，指出 `Pertanyaan 1-3 wajib ditanyakan di awal` 应是给坐席的提示语。
- 复查后确认之前把“答对 3 个问题”误建成“只展示 3 个问题”，混淆了候选题集和通过阈值。

修改结果：

- `O1-O3` 与 `O4-O5` 现在展示同一套完整组织客户候选题。
- `O1-O3` 必对数保持 3：Mandatory 1 + Dynamic 2 + Static 0。
- `O4-O5` 必对数保持 5：Mandatory 1 + Dynamic 2 + Static 2。
- 两个场景都新增 `Agent Hint: Please ask questions 1-3 first.`。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- `src/` 客户可见旧品牌敏感词扫描无匹配。
- HTTP smoke 已通过：`/`、`/call-management/verification-rule-v2`、`/design-system` 均返回 200。
- `git diff --check` 无实际 whitespace error；仅有既有 Windows LF/CRLF warning。

回滚说明：

- 如需回滚，移除 `O1-O3` 的 Static 候选题块，并删除两个场景的 Agent Hint。

当前风险点：

- 命令级验证已通过；仍建议人工在 V2 Preview 或坐席弹框中确认 `O1-O3` 展示完整题目列表，且规则条只要求 3 个正确。

### 2026-06-16 12:02 +08:00 - V2 Customer Verification 手动失败提交

修改页面或文件：

- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1202.md`
- `.codex-backup/current-todo-2026-06-16-1202.md`
- `.codex-backup/page-state-2026-06-16-1202.md`

修改原因：

- 用户指出 `Max Wrong = No Limit` 时系统不会自动进入失败态，导致坐席无法点击验证失败。
- 需要将“自动失败阈值”和“坐席手动提交失败”分开，避免隐藏判断过多。

修改结果：

- `CustomerVerificationV2Modal` footer 固定展示 `Apply Failed` 与 `Apply Verified`。
- 有可用 KBV 规则时，`Apply Failed` 始终可点击，用于坐席手动提交验证失败。
- `Apply Verified` 仍只在满足当前场景通过条件时可点击。
- 无可用规则时两个最终提交按钮均不可用，避免把配置缺失记为客户验证失败。
- `Max Wrong = No Limit` 只表示不自动按错答次数失败，不影响手动失败提交。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- `src/` 客户可见旧品牌敏感词扫描无匹配。
- HTTP smoke 已通过：`/`、`/call-management/verification-rule-v2`、`/design-system` 均返回 200。
- `git diff --check` 无实际 whitespace error；仅有既有 Windows LF/CRLF warning。

回滚说明：

- 如需回滚，恢复 footer 按 `evaluation.failed` 条件切换 `Apply Failed / Apply Verified` 的旧渲染方式。

当前风险点：

- 命令级验证已通过；仍建议人工确认按钮并排展示在当前弹框宽度下不拥挤，且坐席不会误解 `Apply Failed` 为自动失败状态。

### 2026-06-16 11:40 +08:00 - V2 默认规则与坐席提示边界修正

修改页面或文件：

- `src/types/verificationRuleV2.ts`
- `src/utils/verificationRuleV2.ts`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`
- `.codex-backup/context-snapshot-2026-06-16-1140.md`
- `.codex-backup/current-todo-2026-06-16-1140.md`
- `.codex-backup/page-state-2026-06-16-1140.md`

修改原因：

- 用户明确指出 `Perbankan default is used...` 误把系统回退说明放到了配置给坐席看的提示话术位置。
- Perbankan 默认应只用于上游未传 Skill 或客户身份时的初始条件；上游已有值但未配置规则时应直接提示未配置，不应自动回退。

修改结果：

- `VerificationV2RuleMatchType` 简化为 `exact | none`。
- `findVerificationV2RuleMatch` 改为只做 `Channel + Skill Queue + Customer Segment` 精确匹配。
- `CustomerVerificationV2Modal` 删除 Perbankan fallback 提示和未配置规则提示话术区。
- `Agent Hint` 区域现在只展示当前 Scenario 配置的坐席提示。
- 未命中规则时仅通过 `No KBV Rule Available` 与问题列表空状态表达未配置。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- `src/` 客户可见旧品牌敏感词扫描无匹配。
- HTTP smoke 已通过：`/`、`/call-management/verification-rule-v2`、`/design-system` 均返回 200。
- `git diff --check` 无实际 whitespace error；仅有既有 Windows LF/CRLF warning。

回滚说明：

- 如需回滚，恢复 `perbankan-default` match type、`findVerificationV2RuleMatch` 中的默认技能回退分支，以及 `CustomerVerificationV2Modal` 的 fallback 文案渲染。

当前风险点：

- 命令级验证已通过；仍建议在浏览器中手动确认已传入但未配置的 Skill Queue 不再回退 Perbankan，Preview 也只显示当前规则结果。

### 2026-06-16 11:34 +08:00 - V2 Prio/Soli 技能匹配修复

修改页面或文件：

- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/utils/verificationRuleV2.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-16-1134.md`
- `.codex-backup/current-todo-2026-06-16-1134.md`
- `.codex-backup/page-state-2026-06-16-1134.md`

修改原因：

- 用户发现 `Prio Soli Perbankan` 技能中出现 `Selected Skill Queue has no configured KBV rule. Perbankan default is used; agent can switch Skill Queue.`。
- 根因不是 V2 规则缺失，而是坐席弹框初始 `customerSegment` 固定为 `regular`，导致 `SQ_PRIO_SOLI_PERBANKAN + priority/solitaire` 规则无法精确命中。

修改结果：

- `CustomerInformationCard` 新增客户资料 `customerType` 到 V2 Customer Segment 的映射，打开验证弹框时不再固定使用 `regular`。
- `getDefaultVerificationV2SkillQueueCode` 增加 `Prio/Soli/Prioritas/Solitaire` 菜单关键词识别，优先映射 `Prio Soli Kartu Kredit`，否则映射 `Prio Soli Perbankan`。
- `Prio Soli Perbankan` 在客户级别为 Priority 或 Solitaire 时应命中自身规则，不再错误回退到 Perbankan 默认规则。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- HTTP smoke 已通过：`/`、`/call-management/verification-rule-v2`、`/design-system` 均返回 200。
- `src/` 客户可见旧品牌敏感词扫描无匹配。

回滚说明：

- 如需回滚，移除 `CustomerInformationCard` 中的 customerType -> V2 segment 映射，恢复 `customerSegment: 'regular'`，并移除 `getDefaultVerificationV2SkillQueueCode` 中 Prio/Soli 关键词映射。

当前风险点：

- 本轮已做命令级验证，但未做截图级浏览器复查；建议手动用 Priority 或 Solitaire 客户打开 `Prio Soli Perbankan` 验证弹框确认不再显示默认回退提示。

### 2026-06-16 11:29 +08:00 - Priority List 批量维护逐渠道保存

修改页面或文件：

- `src/pages/call-management/PriorityListManagementPage.tsx`
- `src/types/priorityList.ts`
- `src/mock/priorityList.ts`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-06-16-1129.md`
- `.codex-backup/current-todo-2026-06-16-1129.md`
- `.codex-backup/page-state-2026-06-16-1129.md`

修改原因：

- 用户确认优先名单不需要同时保留单个新增和批量新增，页面只保留批量维护入口。
- 多渠道一条记录会让 `Match Rule` 语义变得模糊，客户期望保存后按渠道分别查看。

修改结果：

- `PriorityListEntry` 从 `channels: string[]` 调整为单渠道 `channel: string`。
- `Priority List Management` 移除 `Add` 按钮，仅保留 `Batch Add` 和 `Delete`。
- 保存时按 `选中 Channel x Identifier` 展开为多条列表记录，每条记录只包含一个 Channel。
- `Match Rule` 改为按 Channel 与 Identifier 共同派生：仅 `Webchat`、`Email Contact`、`Email Priority` 遇到规范邮箱域名格式时显示 `Email Domain Match`，其它组合均显示 `Exact Match`。
- 默认 mock 按客户示例拆为逐渠道记录，社媒和 Email/Webchat 示例均按批量维护结果展开。
- 重复过滤继续按 `Channel + normalized Identifier + Match Rule` 自动跳过，重复预览继续展示 `Existing No.`。

验证：

- `npx tsc --noEmit --pretty false` 已通过。
- `npm.cmd run lint` 已通过。
- `npm.cmd run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning 和 plugin timing 提示。
- HTTP smoke 已通过：`/call-management/priority-list` 返回 200，`/call-management/blacklist` 返回 200。
- `git diff --check` 已通过；仅有既有 Windows LF/CRLF warning。

回滚说明：

- 如需回滚，恢复 `PriorityListEntry.channels` 数组模型，恢复 Priority List 页面中的 `Add` 按钮和按多渠道 tag 展示的列表列，并恢复旧 mock 数据。

当前风险点：

- 当前工具未提供可用 in-app Browser 操作入口，未做截图级浏览器复查。
- Phone 等非 Email/Webchat 渠道输入邮箱域名类字符串会按精确匹配保存，这是本轮确认的非阻断策略。

### 2026-06-16 11:24 +08:00 - V2 问题行 hover 背景增强

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

修改原因：

- 用户反馈 Customer Verification 中问题行鼠标悬浮背景色不够明显，希望恢复到之前更明显的浅蓝色。

修改结果：

- 将 `.inbound-verification-list__row:hover` 和 `:focus-within` 背景色从 `#f7fbff` 调整为 `#f3f8ff`。
- 只影响 V2 坐席侧和 Preview 共用的 Customer Verification 问题列表行反馈。

验证：

- 本轮为单点 CSS 视觉调整，未运行完整构建。

回滚说明：

- 如需回滚，将该 hover/focus 背景色恢复为 `#f7fbff`。

当前风险点：

- 未做截图级验证；建议人工打开 Preview 或坐席侧 Verify 弹框确认 hover 视觉强度。
