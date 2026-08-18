# BANK 1 AICC Demo V2 - 开发日志

最后更新：2026-08-15 12:34 +08:00
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

### 2026-08-15 17:41 +08:00 - Transfer Number consultation flow

Modified files or modules:

- `src/layouts/components/TransferModal.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`, `CURRENT_STATUS.md`, `DECISION_LOG.md`, `DEV_LOG.md`

Reason:

- The requested call-toolbar behavior requires external-number transfer to follow the same consultation-first flow as agent transfer.

Result:

- `Transfer Number` now requires `Consult` before `Transfer` or `Conference` becomes available.
- The consulted number is locked with other transfer targets until `Cancel Consult`, transfer, or conference completes.
- Number conference uses the existing conference lock on the toolbar. The deterministic `000` failure remains on the final transfer action.

Rollback:

- Restore the direct `Transfer` action in `TransferNumberTab` and remove the number consultation state from `AgentToolbar`.

Current risk:

- This remains a front-end-only consultation simulation without telephony signaling or real conference bridging.

### 2026-08-15 12:34 +08:00 - customer 生产发布

修改页面或文件：

- 生产部署 `https://netinfo-aicc-demo-v2.vercel.app`
- `DEV_LOG.md`

修改原因：

- 发布当前已合并并推送至 `main` 的 Routing Config 与工作台更新。

修改结果：

- 已部署提交 `e633475`（基于 `a5671f3` 功能发布提交）。
- 生产地址：`https://netinfo-aicc-demo-v2.vercel.app`
- Vercel Inspect：`https://vercel.com/wl-demo-s-projects/netinfo-aicc-demo-v2/35JwAPK8pytRghVHuEeGRNMgziHy`
- 部署命令：`vercel --prod --yes --build-env VITE_APP_VISIBILITY_PROFILE=customer`。
- 构建环境：`VITE_APP_VISIBILITY_PROFILE=customer`。

验证：

- 发布前 `npm run lint`、`npm run build` 通过；构建仅保留既有 large chunk warning。
- Vercel production build 通过；正式地址 HTTP 返回 `200`。

回滚说明：

- 在 Vercel 将 production alias 指回上一稳定部署，或将 `main` 回退至 `14a656d` 后重新部署。

当前风险点：

- 当前项目仍使用前端 mock 数据；生产环境不连接真实客户或路由后端。

### 2026-08-15 11:57 +08:00 - Channels 空业务配置提示与 Email Non-DM 媒体修正

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/mock/routingConfiguration.ts`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`DEV_LOG.md`

修改原因：

- 客户要求无可用业务配置的媒体显示既有信息提示，并确认 Email 媒体类型应为 Non-DM。

修改结果：

- Phone Voice 在不再有任何业务配置字段时显示 `No configuration available for this media type.` 信息提示，不再保留空的 `Access Configuration` 标题。
- Email Contact 与 Email Priority 的渠道类型、媒体页签、业务配置和渠道媒体绑定均改为 `NON_DM`；WhatsApp 保持 DM。

验证：

- `npm run lint`、`npm run build` 已通过；构建仅保留既有 large chunk warning。
- 本地浏览器烟测通过：Phone Voice Business Config 显示标准无配置提示；Email Contact 与 Email Priority 在渠道列表显示 `Non-DM`，Email Contact Business Config 的页签为 `Non-DM` 并显示既有 New Customer Alert 配置。

回滚说明：

- 恢复 Phone Voice 的空 Access Configuration 判断，并将 Email 相关媒体值改回 `TEXT` 即可回退。

当前风险点：

- 当前渠道配置是前端 mock；真实渠道和路由服务需同步使用 Email 的 Non-DM 媒体枚举。

### 2026-08-15 11:51 +08:00 - 移除 Channels 异常工作时间方案配置

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `DEV_LOG.md`

修改原因：

- 客户要求去除 Channels 业务配置中的 `Exception Working Time Plan` 参数配置。

修改结果：

- Phone Voice 的 `Access Configuration` 不再显示异常工作时间方案下拉和预览入口。
- `ChannelMediaBusinessConfig`、各媒体默认配置及 Phone mock 数据不再保留 `exceptionWorkTimePlanCode`。
- Routing Rules 中既有的工作时间方案选择和预览能力保持不变。

验证：

- `npm run lint`、`npm run build` 已通过；构建仅保留既有 large chunk warning。
- 本地浏览器烟测通过：`Routing Config > Channels > Phone > Business Config` 不再显示 `Exception Working Time Plan` 下拉或预览入口。

回滚说明：

- 恢复 `exceptionWorkTimePlanCode` 数据字段、Phone Voice mock 值及 Channels Business Config 的渲染字段即可回退。

当前风险点：

- 当前配置为前端 demo 内存数据；后端若仍依赖该字段，需同步移除对应契约。

### 2026-08-15 10:47 +08:00 - 非 Phone 语音和视频补齐精简排队配置

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`DEV_LOG.md`

修改原因：

- 客户要求非 Phone 渠道的 Voice / Video 业务配置提供与 DM 对齐的基础排队配置。

修改结果：

- 非 Phone Voice / Video 新增 `Queue Configuration`，包含非人工时间提示语、排队提示语、排队超时时长和排队超时提示语。
- `Long Queue Waiting Time (sec)` 与 `Long Queue Waiting Message` 仅保留在 DM；Phone Voice 不显示 Queue Configuration。

验证：

- `npm run lint`、`npm run build` 已通过；构建仅保留既有 large chunk warning。
- 本地浏览器烟测通过：`Routing Config > Channels > BankApp > Business Config` 的 Voice 与 Video 均显示四项 Queue Configuration，未显示长时间排队两项；Phone Voice 只显示既有 Access Configuration。

回滚说明：

- 将 Queue Configuration 显示条件恢复为仅 DM，即可移除非 Phone Voice / Video 的四项字段。

当前风险点：

- 当前配置为前端 demo 内存数据；真实路由引擎需按渠道和媒体类型分别接收对应字段。

### 2026-08-15 10:41 +08:00 - 移除 Channels 业务配置的 Webchat 撤回时限

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/types/routingConfiguration.ts`、`src/mock/routingConfiguration.ts`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- 客户要求在路由策略的 Channels 业务配置中去除撤回配置字段。

修改结果：

- 删除 Webchat DM 的 `Webchat Message Recall Limit (sec)` 编辑控件，以及 Channels 业务配置的类型和默认 mock 值。
- Live Chat 消息撤回交互与独立的 Media Service Rule Plan 保持不变，未纳入本次范围。

验证：

- `npm run lint`、`npm run build`、`git diff --check` 已通过；构建无错误。
- 本地浏览器烟测通过：登录后打开 `Routing Config > Channels > Webchat > Business Config > DM`，`Agent Service Configuration` 仅保留 Agent No Reply Warning / Breach，未显示撤回时限。

回滚说明：

- 恢复 Channels 业务配置类型、默认值和表单字段即可恢复该配置项。

当前风险点：

- 当前为前端 demo 配置；后端路由契约接入时不应再接收该 Channels 字段。

### 2026-08-14 15:51 +08:00 - Customer Journey 补齐数字渠道与 Interaction Log 详情复用

修改页面或文件：

- `src/pages/inbound/components/CustomerJourneyCard.tsx`
- `src/pages/call-management/CallRecordDetailModal.tsx`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/mock/inbound.ts`、`src/types/inbound.ts`、`src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`DEV_LOG.md`

修改原因：

- 客户要求 Customer Journey 补齐 Phone、BankApp、Webchat，数字渠道的行文案改为当前 interaction 首个 Ticket 的首个 Category，并复用 Interaction Log 的对应媒体详情弹框。

修改结果：

- Journey 新增 Phone、BankApp、Webchat mock 条目，并将 WhatsApp 条目关联到对应的 Interaction Log record。
- Phone、BankApp、Webchat、WhatsApp 行显示首个 Ticket 的全部 Category；缺少 Ticket 或 Category 时显示 `-`，过长文本按单行省略且不提供完整文本悬浮提示。Journey 行不显示成功/失败结果图标；Phone mock 使用较长的两个 Category 以覆盖省略状态，BankApp mock 无 Ticket，覆盖空状态。
- Interaction Log 的只读详情抽为共享组件；从 Journey 打开时按 Voice、Video、DM 保持同一回放、转写、对话、Ticket、Summary 和 Satisfaction 展示。
- Email 与 Social Media 详情仍保留既有 `Interaction Detail`，未纳入本次范围。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 已通过；构建仅保留既有 large chunk warning。
- 本地浏览器烟测通过：Email 共享弹屏的 Customer Journey 显示 Phone `Credit Card` 与 BankApp `Mobile Banking` 首 Ticket Category；点击 BankApp 行打开 `Interaction Log Detail - CR202607050002`，并显示对应 Video Recording Playback 与 Auto Transcript。

回滚说明：

- 移除 Journey 的 `callRecordId` 关联和共享详情组件调用，即可恢复旧的静态 Journey 详情路径。

当前风险点：

- 当前关联使用前端 mock Interaction Log record；真实接入时需由后端按客户和会话 ID 返回对应记录与 Ticket。

### 2026-08-13 17:48 +08:00 - 来电弹屏与邮件共享 CRM Ticket 登记

修改页面或文件：

- `src/components/TicketRegistrationDrawer.tsx`、`src/components/index.ts`
- `src/pages/inbound/InteractionWorkspace.tsx`、`src/pages/email/EmailPage.tsx`
- `src/types/email.ts`、`src/styles/index.less`、业务与状态文档

修改原因：

- 客户要求复用邮件 CRM 右上角 Ticket 入口，用于来电弹屏；字段调整为 Product、Category、Summary、Note，并支持连续 AI 草稿生成与多次 CRM 建单。

修改结果：

- 新增共享 Ticket 抽屉，Product / Category 为多选，Summary / Note 可编辑；打开和每次 `One-Click Generation` 都生成新的确定性 DEMO 草稿。
- PSTN、Voice、Video、Live Chat 和 Email CRM 右上角均复用该组件。Confirm 模拟 CRM 保存后保留抽屉、清空表单；来电类工作台立即在 Ticketing History 加入新的 CRM 编号。
- 按现有工作台规范重做抽屉：浅蓝标题区、信息提示、紧凑控件和固定操作页脚。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 large chunk warning。
- 本地浏览器烟测 `http://localhost:5173/`：PSTN 弹屏可打开 Ticket，四字段与生成草稿可见；Confirm 后抽屉保持打开、Summary 清空、CRM 保存提示和 Ticketing History 编号均出现；再次生成切换为新的 Product / Category 草稿。

回滚说明：

- 回退共享 Ticket 组件、InteractionWorkspace / Email 接入和关联样式即可恢复之前的 Email-only 简版 Ticket 抽屉。

当前风险：

- 当前为前端内存 CRM mock；真实 AI 生成、CRM 保存、审计、字段校验与跨会话持久化仍需后端契约。

2026-08-13 同日 Ticket 视觉与校验调整：去除 CRM Ticket 入口图标和抽屉 AI 提示；Product / Category 恢复为可见的平铺复选框，抽屉正文在内容超出时滚动。`One-Click Generation` 恢复为蓝色文字入口并使用星光图标。仅 Category 与 Summary 必填，错误显示在相应字段下方；Product / Note 可为空，CRM 保存反馈不显示工单编号。

2026-08-13 同日 Ticket 布局调整：标题改为 `Ticket Registration`，关闭按钮固定在标题栏右侧，抽屉正文改为纯白。Product / Category 从固定两列改为自然宽度的横向换行；生成入口改用实心四角星 `✦`，并保留打开抽屉即自动生成第一份可编辑草稿的行为。

2026-08-14 Ticket 收紧调整：标题改回 `Ticket` 并对齐现有工作台 15px 紧凑标题规格，关闭按钮同步缩小。一键生成入口移除加粗和悬浮样式。Cancel / Confirm 从表单内容移至 Drawer footer，表单主体独立滚动，操作按钮固定在底部。

2026-08-14 Ticket 标题对齐调整：Ticket 标题栏采用 Transfer / Outbound 弹框的浅蓝背景、主蓝标题和右侧关闭层级。Product、Category、Summary、Note 标签均设为加粗；One-Click Generation 保持普通字重。

2026-08-14 Ticket 反馈统一：Email Ticket 保存改用与电话、视频、文字弹屏相同的共享 `OperationNotice`，显示在话务条下方并自动消失；移除 Email 旧的 `Ticket saved` 状态徽标。邮件的非 Ticket 操作仍保留原有页面提示。

2026-08-14 Ticket 形态调整：按产品确认，Ticket 从右侧 Drawer 改为复用 Transfer / Outbound 的标准 `BaseModal`，并固定定位在页面右侧。保留标准浅蓝标题栏、遮罩、白色独立滚动正文和固定底部操作区；四字段、自动生成、连续保存和统一成功提示行为不变。已通过 PSTN 本地烟测：自动草稿可见，Confirm 后弹框保持打开、字段清空并新增 Ticketing History。

2026-08-14 Ticket 字段规模与校验调整：Product、Category、Summary、Note 全部改为必填。Product / Category 改为可搜索的多选下拉，所选项不折叠为 `+N` 且可自然撑高显示；适配大规模选项列表。Summary 限制为 250 字符并显示计数，Note 对齐 Summary 高度。右侧 Ticket Modal 补齐与 Transfer / Outbound 一致的圆角、边框和阴影。已通过 PSTN 烟测：搜索 `Loan` 后仅显示匹配项，选中后 Product 内同时完整展示 `Credit Card` 与 `Loan`，选项复选状态同步更新。

### 2026-08-14 15:20 +08:00 - Interaction Log Ticket 和 Summary 分离

修改文件：

- `src/types/callRecord.ts`、`src/mock/callRecords.ts`、`src/store/callManagementStore.ts`
- `src/pages/call-management/CallRecordQueryPage.tsx`、`src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`

修改原因：

- 客户明确每次通话服务可生成多个 Ticket，因此详情不能把 Ticket No.、业务类型与服务总结合并为单一 CWU 字段。

修改结果：

- 通话记录数据改为服务级单一 Summary 与 `tickets[]`；每个 Ticket 独立保存 ID 和 Category。
- Interaction Log 详情右侧 Ticket 使用一行一个 Ticket 的 ID / Category 表格，AI 自动生成的完整服务 Summary 单独显示在其下方。

验证：

- `npx tsc --noEmit --pretty false`、`npm run lint`、`npm run build`、`git diff --check` 已通过；构建仅有既有 large chunk warning。
- 本地浏览器烟测 `http://localhost:5173/call-management/call-record-query`：打开含两类 Ticket 的 `CR202607100006` Video 记录后，详情显示 `ID` / `Category` 表头、两条独立 Ticket 行、下方单一 Summary，以及原有 Satisfaction 面板。

回滚说明：

- 回退上述类型、mock、详情布局和样式文件即可恢复单一 Ticket No. / Business Type / Summary 的 CWU 结构。

当前风险：

- 当前 Ticket 与 AI Summary 均为前端 mock；真实 CRM 工单和摘要服务仍需要后端数据契约。

2026-08-14 同日 Interaction Log Ticket 视觉收紧：移除 Ticket 表格和表头；Ticket 改为与来电弹屏 Ticketing History 对齐的 CRM ID 徽标和 Category 标签。Ticket 条目之间及 Summary 前使用分隔线，Ticket 与单一服务 Summary 合并为一个内容滚动区，避免右侧出现多个并列滚动条。`CR202607100006` 提供两张 CRM Ticket mock，用于验证多 Ticket 分隔展示。

### 2026-08-13 16:00 +08:00 - 客户外呼 Callback AUX 门禁

修改页面或文件：

- `src/pages/call-management/BusyReasonManagementPage.tsx`、`src/mock/busyReasons.ts`、`src/store/callManagementStore.ts`
- `src/layouts/BasicLayout.tsx`、`src/layouts/components/OutboundCallModal.tsx`、`src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/hooks/useExternalOperationApproval.ts`、`src/utils/outboundApproval.ts`、相关类型与业务文档

修改原因：

- 客户确认客户号码外呼必须处于唯一指定 AUX，普通坐席需 TL/SPV 审批，TL/SPV 在同一 AUX 下可直接呼叫；坐席互呼仅限 TL/SPV。

修改结果：

- Busy Reason 增加列表级 `Support Outbound` 开关；默认将 `Callback Finrisk` 与 `Callback Misinform` 设为允许客户外呼的 AUX。
- Toolbar Call Number 与 Customer Information 电话外呼均要求任一允许外呼的 AUX，并保留每通外呼的 `Miss Information` / `Financial Risk` 选择。
- 审批不展示或绑定具体 AUX；两个允许外呼的 AUX 之间切换保留待审批/已批准资格，离开全部允许外呼的 AUX 或停用全部资格才取消。
- Call Agent 对所有角色只显示 TL/SPV，并要求处于允许外呼的 AUX；不使用客户外呼审批。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 large chunk warning。
- 本地服务可访问 `http://127.0.0.1:5173/`。浏览器烟测连接受宿主统计请求超时影响，未进入登录页。

回滚说明：

- 回退本记录涉及的类型、Busy Reason、外呼门禁与审批 scope 改动即可恢复原外呼流程。

当前风险：

- 当前为前端 DEMO 规则；真实 AICC 需由后端同步坐席状态、审批、权限和审计。

2026-08-13 同日规则更正：客户确认保留 `Callback Finrisk` 与 `Callback Misinform` 两条回拨 AUX，二者均可配置 `Support Outbound`。审批不绑定或展示具体 AUX；在两条均已启用的回拨 AUX 之间切换保留审批资格，只有离开全部允许外呼的 AUX 或停用最后的允许项才撤销。

2026-08-13 同日交互调整：`Support Outbound` 列表仅显示状态；设置开关移至 Busy Reason 编辑弹窗，与现有 Status 的管理方式一致。

2026-08-13 同日外呼顺序调整：普通坐席无需先切换外呼 AUX 即可提交 TL/SPV 审批；审批后必须进入允许外呼的 AUX 才能 Call。外呼 AUX 提示缩短为 `Switch to outbound AUX`。

### 2026-08-11 18:39 +08:00 - Call Flow Detail 按接入渠道区分 IVR 与业务菜单

修改页面或文件：

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/CallFlowDetailModal.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- 用户澄清仅 PSTN 电话接入 IVR；BankApp Voice、BankApp Video 及数字渠道均由客户在渠道端选择业务菜单，例如选择信用卡服务。

修改结果：

- PSTN 的 Call Flow Detail 保留 `IVR Journey`。
- 非 PSTN 渠道不再显示 IVR；改为 `Business Menu Selection Record`，展示客户选择的业务菜单。
- BankApp Voice / Video 将本次客户选择的业务菜单随来电请求传入坐席弹屏；Live Chat 使用会话菜单或业务意图作为记录。
- BankApp 演示默认业务菜单改为 `Credit Card`。Transfer History 始终显示：存在上游转接时保留既有记录，并追加当前坐席的进行中服务行；未结束的时长与转接时间显示 `-`。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 large chunk warning。
- 本地浏览器烟测已通过：PSTN 来电的 Call Flow Detail 仅显示 `IVR Journey` 和既有 Transfer History，IVR 节点及时间完整保留。
- BankApp Voice / Video 菜单字段由请求、`BasicLayout` 接入和 `CallInteraction` 存储链路传递，已由 TypeScript 构建验证。
- 默认 `Credit Card` 业务菜单与当前坐席进行中 Transfer History 行已通过本次 `npm run lint`、`npm run build` 校验。

回滚说明：

- 移除 BankApp 菜单字段传递，并将 InboundPage 的 IVR 判定恢复为原有非外呼条件，即可恢复旧展示。

当前风险点：

- 当前选择记录仍为前端 demo 内存数据；真实渠道接入时应由渠道网关提供菜单名称与选择时间。

### 2026-08-11 16:41 +08:00 - 话务条转坐席权限与外呼对齐

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- 用户确认话务条 `Transfer Agent` 的数据权限应与 Outbound Call > Call Agent 一致：普通 Agent 仅可见上级 SPV、TL，不展示普通坐席；其他角色不受限制。

修改结果：

- 语音和会话两类 Transfer Agent 弹窗统一按登录角色过滤：`agent` 仅显示标记为 SPV 或 TL 的目标，TL 及其他角色保持完整目标列表。
- 既有语音转接的 Ready 状态过滤、SPV/TL 排序、咨询转接与会议转接行为不变。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 large chunk warning。
- 本地浏览器烟测已通过：以 `888888 / 888888` 登录、签入并接听 PSTN 后，话务条 `Transfer > Transfer Agent` 仅显示 2 条目标：SPV Siti Rahmawati 与 TL Maya Lestari；普通坐席未渲染。TL 及其他角色仍保留既有 `all` 范围分支。

回滚说明：

- 将 `TransferModal` 的目标范围恢复为仅 conversation 变体按普通 Agent 过滤，即可恢复此前语音转接展示全部坐席的行为。

当前风险点：

- 当前权限仍为前端 mock 角色过滤；生产环境需要由后端依据组织层级和授权范围返回可转接坐席。

### 2026-08-11 09:45 +08:00 - 黑名单重复预览收紧弹窗宽度

修改页面或文件：

- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 黑名单重复预览的六列最小宽度总和超过 760px 弹窗的可用内容宽度，撑大了共享父容器，导致 Identifier 与 Reason 输入框越过弹窗右边界。

修改结果：

- 重复预览容器和表格限制为父容器宽度，表格六列改为更紧凑的最小宽度与比例；内容过长仍以表格内部滚动和单元格省略处理。

验证：

- `npm run lint`、`npm run build` 已通过；构建仅有既有 large chunk warning。
- 浏览器截图烟测已通过：两个渠道、两条重复数据时，Identifier、Reason、提示条和重复预览均保持在弹窗边界内。

回滚说明：

- 移除 Blacklist duplicate panel/table 的宽度约束并恢复原列宽即可回退。

### 2026-08-11 09:30 +08:00 - 黑名单移除有效期并补齐重复验证

修改页面或文件：

- `src/pages/call-management/BlacklistManagementPage.tsx`
- `src/types/blacklist.ts`
- `src/mock/blacklist.ts`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- Status 已可人工控制黑名单生效；未实现自动到期恢复且无编辑能力时，Validity Days 会造成不可恢复的状态冲突。用户同时要求黑名单补齐优先名单已有的重复预览与跳过保存行为。

修改结果：

- 移除 Validity Days 的类型、mock、列表列和批量新增字段。
- 非 Phone 渠道的 Restriction Policy 固定为 `Prohibit Transfer to Agent` 并在表单中禁用；Phone 保留策略选择。
- 重复预览统一显示 Channel、Country Code、Identifier、Restriction Policy、Status、Existing No.，保存时自动跳过重复项；Phone 按渠道、国家码、号码、策略匹配，非 Phone 按渠道、Identifier 匹配，Status 仅展示不参与匹配。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅有既有 large chunk warning。
- 浏览器烟测已通过：列表和 Batch Add 均不再显示 Validity Days；非 Phone Restriction Policy 默认 `Prohibit Transfer to Agent` 且禁用；输入既有 Bankapp Identifier 后，重复预览统一显示 Country Code `-`、Restriction Policy、Status 与 Existing No.

回滚说明：

- 恢复 Validity Days 字段与数据结构，并移除重复预览/跳过逻辑即可回退。

当前风险点：

- 黑名单仍为本地前端演示数据，刷新页面会重置。

### 2026-08-05 19:05 +08:00 - 客户资料卡外呼可用性收口

修改页面或文件：

- `src/components/CustomerInformationPanel.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`DECISION_LOG.md`、`PROJECT_CONTEXT.md`、`DEV_LOG.md`

修改结果：

- TL 客户资料卡的 `Call` 操作使用紧凑内容宽度，不再沿用普通 `Request Approval` 的宽按钮。
- Customer Information 只要号码非空即可发起外呼；KBV / CRM 身份状态继续控制其余 CRM 相关动作，但不再阻断外呼。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 通过；构建仅保留既有 bundle 大小提示。
- 浏览器烟测：未识别 PSTN 客户卡（CIS 为 `-`、号码为 `08123456789`）仍渲染 TL 外呼入口；其 `Call` 文案使用 56px 最小宽度且无最大宽度限制。

### 2026-08-05 18:55 +08:00 - Vercel 生产发布外呼 TL 审批演示

发布提交：

- `20f3411` - `feat: refine outbound TL approval demo`

发布命令：

- `npx vercel --prod --yes --scope wl-demo-s-projects --build-env VITE_APP_VISIBILITY_PROFILE=customer --build-env VITE_ENABLE_ADMIN_MENUS=true`

发布结果：

- Production deployment: `https://netinfo-aicc-demo-v2-2tggl3x8a-wl-demo-s-projects.vercel.app`
- Production alias: `https://netinfo-aicc-demo-v2.vercel.app`
- Vercel Inspect: `https://vercel.com/wl-demo-s-projects/netinfo-aicc-demo-v2/5nBAyxDnT3ikKUCUU8C4cVxWaeCy`
- 使用 `VITE_APP_VISIBILITY_PROFILE=customer`；本地维护模块保持隐藏。

验证：

- 发布前 `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 通过。
- 干净发布工作目录的 customer profile 构建与 Vercel production build 通过；仅保留既有 bundle 大小提示。

回滚说明：

- 在 Vercel 将正式 alias 切回上一条稳定生产部署，或重新部署前一已验证 Git 提交。

### 2026-08-05 09:45 +08:00 - TL 客户外呼 Reason 弹框直接 Call

修改页面或文件：

- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- TL 在 Customer Information 选择外呼 Reason 后不应再关闭弹框并回到客户卡片进行第二次操作。

修改结果：

- TL 的 Reason 弹框主操作统一为 `Call`；选定 Reason 后点击该按钮直接发起既有外呼事件，创建并进入新的 `Outbound Call` 客户弹屏工作区。
- Customer Information 卡片仅对普通 Agent 显示 `Request Approval`；TL 在相同位置直接显示 `Call`，随后在 Reason 弹框确认外呼。
- 普通 Agent 保持 `Request Approval` 与 TL 审批流程不变。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 通过；构建仅保留既有 bundle 大小提示。
- 浏览器烟测：使用 `666666 / 666666` 登录并进入 TL 的 Outbound Call，确认填入号码和 Reason 后只提供直接 `Call` 动作，不出现审批申请入口。Customer Information 的 TL 分支复用同一外呼事件，并由静态类型检查覆盖。

回滚说明：

- 恢复 TL 弹框主操作文案为 `Continue`，并移除直接调用外呼事件即可。

当前风险：

- 仍是本地 Demo 外呼模拟，不执行真实 CTI 建呼或客户号码反查。

### 2026-08-05 09:30 +08:00 - 外呼创建独立客户弹屏工作区

修改页面或文件：

- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentToolbar.tsx`、`src/layouts/components/OutboundCallModal.tsx`
- `src/pages/inbound/InboundPage.tsx`、`src/pages/inbound/components/CustomerInformationCard.tsx`
- `PROJECT_CONTEXT.md`、`BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户要求外呼接通时与来电处理一致，必须打开一个新的客户弹屏工作区，而不能只更新话务条状态。

修改结果：

- 外呼事件携带目标号码并创建 `outbound` 语音交互，生成并激活新的 `Outbound Call` 页签。
- 外呼客户弹屏展示 `Outbound Customer` 与所拨号码；话务条显示 `Outbound: {number}`，并立即进入 `Talking`。既有结束通话、ACW 和页签生命周期复用原语音交互逻辑。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build` 通过；构建仅保留既有 bundle 大小提示。
- 浏览器烟测：`666666 / 666666` 直接外呼 `081298700456` 后，话务条显示 `Outbound: 081298700456` 与 `Talking`，并激活新建的 `Outbound Call` 客户工作区；卡片显示 `Outbound Customer` 与所拨号码。

回滚说明：

- 恢复仅递增外呼请求 ID 的事件，并移除 `outbound` 交互来源与号码字段即可。

当前风险：

- 弹屏使用安全的匿名 `Outbound Customer` mock，不执行真实号码反查、CRM 匹配或 CTI 建呼。

### 2026-08-04 18:25 +08:00 - 工具栏外呼接入通话状态机

修改页面或文件：

- `src/layouts/components/OutboundCallModal.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- 工具栏的批准后 Call 仅关闭了 Outbound Modal，未触发话务条通话状态；Customer Information 的 hover Call 因复用申请按钮最小宽度而显得过宽。

修改结果：

- Call Number 和 Customer Information 统一发出既有 `requestCustomerOutboundCall` 事件，随后进入 `Talking` 状态。
- 绿色客户卡片 Call 使用紧凑内容宽度；Request Approval 保持较宽尺寸以完整显示申请文案。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build` 通过；构建仅保留既有 bundle 大小提示。
- Call Number 回调接入 Customer Information 已使用的 `requestCustomerOutboundCall` store action，后续由 `BasicLayout` 既有 effect 调用 `startTalkingCall`。

回滚说明：

- 移除 OutboundCallModal 的 `onCallNumber` 回调并恢复客户 Call 的共享最小宽度即可。

当前风险：

- 两个入口仍是前端 Demo 的同一外呼状态事件，不包含真实拨号、CTI 或号码校验。

### 2026-08-04 18:05 +08:00 - 审批窗口收口与客户号码悬浮操作

修改页面或文件：

- `src/pages/TlOutboundApprovalPage.tsx`
- `src/components/CustomerInformationPanel.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`DESIGN_SYSTEM.md`、`DEV_LOG.md`

修改原因：

- 客户要求 TL 处理完全部审批后关闭窗口；客户信息卡号码操作不能挤压号码或截断按钮文字；结果 Note 不能影响 Outbound 和 Reason 的首行布局。

修改结果：

- 最后一项批准或拒绝后，TL 页面无条件尝试关闭窗口；存在队列时继续显示下一项。
- Customer Information 的 Request Approval、Requesting 和 Call 均仅在号码行悬浮或键盘聚焦时显示，按钮宽度可完整展示文案，且不再有浏览器原生 hover 提示。
- 结果 Modal 的首行固定显示 Outbound、号码与 Reason，Note 固定为下一行并允许仅备注内容自然换行。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build` 通过；构建仅保留既有 bundle 大小提示。
- 静态检查确认 TL 以“当前项之外是否还有下一项”判断关闭，不会把最后一个模拟项误计入队列；客户号码操作使用 scoped hover/focus 选择器。

回滚说明：

- 恢复 TL 的 opener 判断、客户号码常驻操作状态与 Note 同行布局即可。

当前风险：

- 浏览器只允许脚本关闭由脚本打开的窗口；用户手工直接访问 TL 路由时，浏览器可能阻止 `window.close()`，但审批流程已结束并隐藏 Modal。

### 2026-08-04 17:40 +08:00 - 审批结果信息行与纯白内容区

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `src/components/CustomerInformationPanel.tsx`
- `src/styles/index.less`
- `DESIGN_SYSTEM.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- 客户要求审批结果的 Note 不单独占据一行；客户资料卡审批通过后的操作名称统一为 `Call`，并消除坐席结果与客户外呼 Reason 弹框的灰白嵌套背景。

修改结果：

- 审批结果按 `Outbound + 号码 + Reason + Note` 同行展示，备注只有在空间不足时才自然换行。
- 客户资料卡批准后的绿色操作改为 `Call`；坐席结果与 Customer Information `Outbound Reason` Modal 均保持浅蓝标题和纯白内容区。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build` 通过；构建仅保留既有 bundle 大小提示。
- 采用已验证的 scoped Modal 样式，不影响 TL 审批、工具栏 Outbound、Transfer 或 Internal Chat 的既有外观。

回滚说明：

- 恢复 Note 的独立区块、`Outbound` 按钮文案及对应 Modal 内容背景即可。

当前风险：

- 长备注会按可用宽度换行，未在结果弹框中额外截断，避免丢失 TL 留言。

### 2026-08-04 17:15 +08:00 - 外呼审批跨工作续留并移除超时

修改页面或文件：

- `src/types/outboundApproval.ts`
- `src/utils/outboundApproval.ts`、`src/hooks/useExternalOperationApproval.ts`
- `src/store/authStore.ts`
- `src/layouts/components/OutboundCallModal.tsx`、`src/layouts/components/AgentToolbar.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`、`src/pages/TlOutboundApprovalPage.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户确认坐席在审批期间可能需要关闭外呼面板处理来话，申请不能因此消失；同时取消两分钟审批倒计时和自动超时，以收敛 Demo 流程。

修改结果：

- 关闭工具栏外呼或客户资料卡相关面板不再释放待审或未使用授权；两个入口均显示 `Requesting...`。号码或 Reason 变更才会使旧申请失效，执行外呼仍单次消耗，Log Out 会清理待审和未使用授权。
- 删除审批 `expiresAt`、`expired` 状态、TL 倒计时和超时结果；TL 请求保持待审，直到 Approve、Reject 或坐席登出。队列仍在首笔待审五秒后模拟一笔后续申请。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 均通过；构建仅保留既有 bundle 大小提示。
- 浏览器烟测：`888888 / 888888` 发起外呼审批后显示 `Requesting...`；关闭并重开 Outbound Call 后待审状态保留；Log Out 后返回 Login。TL 页面代码确认无倒计时或自动超时路径。

回滚说明：

- 恢复审批模型的过期字段和定时器，并恢复外呼面板关闭时的释放副作用即可。

当前风险：

- 无后台 SLA 或超期处理时，真实生产系统仍需由审批工作台、通知和审计服务处理长期未决申请；本 Demo 只保留人工决定或登出清理。

### 2026-08-04 16:45 +08:00 - 坐席审批结果提示收敛

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`DEV_LOG.md`

修改原因：

- 客户要求坐席侧审批结果去除冗余 `TL` 标识，内容与 TL 审批面板采用一致的简洁信息结构；备注独立换行显示，结果不能自动消失。

修改结果：

- 结果标题统一为 `Approval Granted`、`Approval Rejected` 或 `Approval Timed Out`。
- 内容按 `Outbound`、号码、Reason 标签和可选 `Note` 分层，长备注可换行；右下角 `BaseModal` 仅在坐席主动关闭后消失。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 均通过；构建仅保留既有 bundle 大小提示。

回滚说明：

- 恢复 `AgentToolbar` 的旧描述文本与五秒定时器即可。

当前风险：

- 这是前端 Demo 的同浏览器结果提示，不代表后台审批留痕或跨设备通知能力。

### 2026-08-04 16:20 +08:00 - TL 审批延迟队列演示

修改页面或文件：

- `src/pages/TlOutboundApprovalPage.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`DEV_LOG.md`

修改原因：

- 客户要求审批队列符合实际到达顺序：第一笔先单独审批，五秒后才模拟下一笔排队；每笔倒计时都必须从自身创建时开始计算两分钟。

修改结果：

- 初始审批只显示当前一笔。若五秒后仍待审，TL 页面才创建本地模拟后续项；标题显示 `N more pending`，不显示总数或重复正文提示。
- 模拟后续项拥有独立两分钟超时；首笔在五秒内被处理且 TL 窗口关闭时，不会创建后续项。TL 说明保留 `Outbound {number}` 与独立 Reason 标签，不显示 Customer ID。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 均通过；构建仅保留既有 bundle 大小提示。

回滚说明：

- 移除延迟 follow-up effect 并恢复单笔审批窗口关闭逻辑即可。

当前风险：

- 后续项仅用于 TL 页面演示，不是实际坐席申请或后端审批队列。

### 2026-08-03 15:52 +08:00 - Live Chat Conversation 提醒计时去重

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- 客户确认 Conversation 标题栏无需重复展示未回复提醒时间，左侧客户列表已有该提醒；标题栏仅保留会话总服务时长。

修改结果：

- 移除了 Conversation 标题栏的橙色未回复提醒图标与计时。
- 左侧客户列表的 SLA 提醒时间和未回复进度条保持不变，Conversation 标题栏继续显示总服务时长。

验证：

- `npm run lint`、`npm run build` 和 `git diff --check` 已通过；构建仅有既有 large chunk warning。
- 浏览器烟测已确认 Conversation 标题仅显示总服务时长，左侧客户列表仍显示未回复提醒时间和 SLA 进度条。

回滚说明：

- 恢复 Conversation 标题栏的 `livechat2-conversation__unanswered` 节点及样式即可回退。

当前风险点：

- 当前 SLA 提醒仍为前端本地计时；真实渠道应由服务端事件和 SLA 规则提供一致的时间基准。

### 2026-08-03 10:28 +08:00 - Customer Production Release

修改页面或文件：

- Vercel production deployment for commit `07adbc6`
- `DEV_LOG.md`

修改原因：

- 发布已提交并推送至 `main` 的客户演示更新。

修改结果：

- 生产地址：https://netinfo-aicc-demo-v2.vercel.app
- 部署命令：`vercel deploy --prod --yes --build-env VITE_APP_VISIBILITY_PROFILE=customer`
- 使用客户可见构建配置 `VITE_APP_VISIBILITY_PROFILE=customer`，本地维护模块保持隐藏。
- 发布前 `npm run lint`、`npm run build` 与 `git diff --check` 均通过；构建仅保留既有的大包体告警。

回滚说明：

- 在 Vercel 项目中回滚至前一个生产部署，或使用 `vercel rollback` 指向上一生产版本。

当前风险点：

- 当前项目仍为前端 mock 演示，刷新会重置大部分内存状态；构建仍存在既有的大包体告警。

### 2026-08-01 16:45 +08:00 - HaloApp PIN 失败原因提示

修改页面或文件：

- `src/components/CustomerInformationPanel.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`DEV_LOG.md`

修改原因：

- HaloApp 已登录客户在 Live Chat 弹屏的 PIN 验证失败后，需要让坐席可通过悬浮失败状态图标查看失败原因。

修改结果：

- PIN 入口仍仅对已登录的 BankApp 文本 / Live Chat 客户显示。
- PIN 失败状态悬浮显示 `PIN input is incorrect.`；第三次失败锁定时，置灰的 `PIN` 按钮悬浮提示已达到验证次数上限。
- Tooltip 触发容器保留客户信息访问条原有的右对齐布局，失败徽标与 `PIN` 按钮维持靠右排列。

回滚说明：

- 移除客户信息卡片的失败原因 Tooltip 传参和渲染即可恢复原仅显示 `Failed` 的状态。

当前风险点：

- 失败原因仍是前端模拟回调文案；接入实际 BCA PIN 服务后应使用其受控错误码映射，避免暴露敏感验证细节。

### 2026-08-01 10:58 +08:00 - Global Control 数字媒体与 Live Chat 容量命名澄清

修改页面或文件：

- `src/types/globalControlConfiguration.ts`
- `src/mock/globalControlConfiguration.ts`
- `src/pages/call-management/GlobalControlConfigurationPage.tsx`
- `src/store/appStore.ts`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户澄清最大服务数覆盖全部数字媒体（私信与非私信），而结束会话保留仅适用于 Live Chat 弹屏的 Current 列表。

修改结果：

- `DM Media Capacity` 更名为 `Digital Media Capacity`，服务数参数更名为 `Max Digital Media Services`，结束会话参数更名为 `Max Live Chat Ended Session Retention`。
- 配置字段同步更名为 `maxDigitalMediaServices` 与 `maxLiveChatEndedSessionRetention`；默认值和已有容量行为保持不变。
- 社媒与邮件不使用 Live Chat Current / History 的结束会话保留机制。

验证：

- `npm run lint`、`npm run build` 和 `git diff --check` 已通过；构建仅有既有 large chunk warning。
- 浏览器烟测已确认 `Digital Media Capacity` 及两项新命名显示正确，默认值保持为 3 和 10，单位均为 `items`。

回滚说明：

- 恢复原参数显示名及对应的配置字段名即可回退；数值与容量行为无需迁移。

当前风险点：

- 数字媒体最大服务数当前由已接入的 Live Chat 工作区消费；社媒与邮件尚未接入统一的活动服务计数模型。

### 2026-08-01 09:53 +08:00 - 渠道管理排队配置补齐

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`DEV_LOG.md`

修改原因：

- 客户要求补齐 Routing Config > Channels > Business Config 中当前 Demo 缺少的排队位置动态提示、长时间排队与秒级超时配置。

修改结果：

- 保留既有非人工服务时间、排队与超时提示语，排队提示语新增 `{queuePosition}` 可插入动态参数。
- 新增长时间排队时长（默认 `180` 秒，`0` 表示不触发）及安抚提示语。
- 新增排队超时时长（默认 `360` 秒，范围 `0` 至 `60000`）及输入校验。

回滚说明：

- 移除新增字段、默认值、校验和排队配置控件即可恢复原三项提示语配置。

当前风险点：

- 当前仅保存为前端内存 mock 配置；真实排队引擎接入时仍需实现参数替换与实际触发逻辑。

### 2026-07-31 16:36 +08:00 - Global Control DM 结束会话保留配置

修改页面或文件：

- `src/types/globalControlConfiguration.ts`
- `src/mock/globalControlConfiguration.ts`
- `src/pages/call-management/GlobalControlConfigurationPage.tsx`
- `src/store/appStore.ts`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户要求将 Live Chat 最大结束服务保留数配置化，并放在 Global Control 的 DM Media Capacity 中，默认值为 10。

修改结果：

- 新增必填字段 `Max DM Ended Session Retention`，单位为 items，默认值为 10，最小值为 1。
- Live Chat 的服务中容量和结束会话保留容量分别读取 `Max DM Media Services` 与新字段；保存或重置后，超出新保留上限的最早结束会话立即移入 History。
- 下调服务中容量不会强制结束既有服务，只限制后续新接入。

验证：

- `npm run lint`、`npm run build` 和 `git diff --check` 已通过；构建仅有既有 large chunk warning。
- 浏览器烟测已确认 `DM Media Capacity` 中的新字段带必填标识与 `items` 单位，默认值为 10；保存后显示成功提示。

回滚说明：

- 移除 Global Control 新字段和 Store 的配置读取，将 Live Chat 容量恢复为固定默认值即可回退。

当前风险点：

- 当前配置仅在前端内存中生效；刷新页面后会恢复 mock 默认值，真实环境需要由后端保存并向渠道路由同步。

### 2026-07-31 16:18 +08:00 - Live Chat Current 服务与最近结束会话分层

修改页面或文件：

- `src/store/appStore.ts`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户要求 Current 在最多三路正在服务会话之外，保留最近结束的十个会话以便继续编辑 CRM；End Service 不应直接进入 History。

修改结果：

- Store 将服务中、Current 最近结束保留和 History 分离。结束会话退出服务计数后留在 Current；Close 才转入 History；第十一条结束会话会淘汰结束时间最早的保留会话至 History。
- Current 保持统一列表并沿用既有排序。History 的 CRM 页面不新增提示或限制。
- 所有 Live Chat 接入入口限制为三路服务中会话；容量已满时 BankApp/Webchat/WhatsApp 客户停留在模拟队列并显示容量提示。

验证：

- `npm run lint`、`npm run build` 和 `git diff --check` 已通过；构建仅有既有 large chunk warning。
- 浏览器烟测确认默认 Current 同时展示服务中和已结束保留会话；End Service 后会话仍在 Current 并显示 Close；Close 后 Current 数量减少、History 数量增加。

回滚说明：

- 移除 `liveChat2RecentClosedSessionIds` 及容量处理，并恢复 End Service 后直接调用 Close 的旧流程即可回退。

当前风险点：

- 当前为前端 mock 队列和 CRM 连接；真实渠道网关需要提供队列容量、结束事件及 CRM 会话绑定接口。

### 2026-07-31 15:48 +08:00 - Live Chat typing removal and transfer scope

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/layouts/components/TransferModal.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- 客户要求移除 Live Chat 来电弹屏中的客户正在输入展示；普通坐席的 Live Chat 转坐席不得选择普通坐席。

修改结果：

- 移除了 Webchat 静态 `Customer is typing` 指示器及其样式。
- Live Chat 转坐席中，普通 Agent 仅显示 SPV、TL；TL 和其他角色保留全部坐席目标。语音转接范围不变。

验证：

- `npm run lint`、`npm run build` 和 `git diff --check` 已通过；构建仅有既有 large chunk warning。
- 浏览器烟测已确认普通 Agent (`888888`) 的 Live Chat 转接列表为 2 名（SPV、TL），TL (`666666`) 的列表为完整 6 名，并确认当前会话没有 `Customer is typing` 提示。

回滚说明：

- 恢复 Live Chat typing 节点与样式，并移除 `TransferModal` 的 conversation 角色过滤即可回退。

当前风险点：

- 当前角色与转接目标均为前端 mock；真实接入时需要由权限与组织层级服务返回目标范围。

### 2026-07-31 15:17 +08:00 - 保持 ACW 中的 Pre-AUX 倒计时

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`DEV_LOG.md`

修改原因：

- 客户确认：ACW 期间若 Live Chat 仍在服务，选择 AUX 显示 Pre-AUX 正确；但原实现清除了 ACW 标记，导致计时无法在到期后自动进入 AUX。首次 Ready 锁定按钮的 hover 反馈也不应暗示可点击。

修改结果：

- Pre-AUX 在 ACW 中保留原始倒计时起点，到期后自动进入所选 AUX，不会因 Live Chat 仍在服务而永久停留在 Pre-AUX。
- 禁用的 Ready 维持禁用态视觉，不再在 hover 时切换为默认按钮样式。

验证：

- 已运行 `npm run lint`、`npm run build` 和 `git diff --check`，均通过；构建仅有既有 large chunk warning。
- Browser smoke 已确认 ACW 中选择 Busy Reason 后状态显示为 `Pre-AUX - Break`；浏览器自动化客户端在等待完整倒计时期间受到自身网络遥测超时影响，完整的 Pre-AUX 到 AUX 视觉回归仍需在正常浏览器会话中补验。

回滚说明：

- 删除 `preserveAfterCallWork` 选项及其原始计时差值计算，即可恢复此前进入 Pre-AUX 时取消 ACW 的行为。

当前风险点：

- ACW 与 Live Chat 并行状态仍为前端会话内模拟，后端 CTI / 数字渠道事件需要真实集成后再校验。

### 2026-07-31 14:45 +08:00 - 恢复首次签入话务条状态按钮

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户澄清：不是移除话务条的 Ready / Not Ready 按钮，而是默认 Not Ready 的首次签入只能先切换到 Ready；出现 Voice 或 Video Incoming 弹屏后，才恢复该按钮的双向切换。

修改结果：

- 恢复话务条 Ready / Not Ready 按钮。默认 Not Ready 签入时，首次切至 Ready 后按钮保持可见但禁用；PSTN、BankApp Voice 或 BankApp Video Incoming 弹屏后，本次签入会话恢复 Ready / Not Ready 双向切换。
- 默认 Ready 签入不受首次限制；文字渠道及首次切换时创建的默认 Live Chat 会话不解除限制。
- 已运行 `npm run lint`、`npm run build` 和 `git diff --check`，均通过。浏览器烟测确认默认 Not Ready 签入、首次 Ready 禁用、默认 Live Chat 不解锁、PSTN Incoming 后解锁及 Ready -> Not Ready -> Ready 往返切换。

回滚说明：

- 如需恢复无首次限制的旧行为，删除 `BasicLayout` 中的首次切换锁定状态及 `AgentToolbar` 的 disabled 传参即可；不影响 Pre-AUX、AUX、ACW 或交接就绪状态逻辑。

当前风险点：

- 当前规则为前端 session 内状态；刷新、Sign Out 或下一次 Sign In 会重新开始首次签入限制。

### 2026-07-30 16:20 +08:00 - KBV HaloApp 登录状态规则

修改页面或文件：

- `src/types/verificationRuleV2.ts`、`src/utils/verificationRuleV2.ts`、`src/mock/verificationRuleV2.ts`
- `src/pages/call-management/VerificationRuleV2Page.tsx`
- `src/mock/inbound.ts`、`src/pages/inbound/components/CustomerInformationCard.tsx`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户确认 HaloApp Voice 的首次登录状态应作为 KBV 规则条件；仅 Perbankan 和 Kartu Kredit对已登录/未登录采用不同正确题数，其余技能维持同一套配置。

修改结果：

- 管理台为全部含 HaloApp 的规则提供 `Same for Both`、`Logged In`、`Not Logged In` 单选字段、列表/查询展示、Copy 操作和启用规则重叠拦截。
- Perbankan 与 Kartu Kredit各保留 HaloApp 已登录 3 题专用规则；未登录规则分别为 5/4 题，并与相同配置的 Phone 合并为多渠道规则。其他 HaloApp 规则显式为 `Same for Both`。
- HaloApp Voice 的 mock 客户数据携带首次 `registered / guest` 状态，坐席 KBV 自动匹配且不向坐席暴露状态编辑入口。
- 管理台 Customer Verification Preview 设为只读：隐藏每题 Correct/Wrong/Skip 与验证结果操作，仅保留 Close；实际坐席 KBV 操作不变。

验证：

- `npm run lint`、`npm run build`、规则解析检查已通过；构建仅有既有 large chunk warning。
- 浏览器确认 Verification Rules 的登录状态字段、列表、Copy 深拷贝表单和启用规则重叠拦截；Registered HaloApp Voice 可进入 KBV 工作台。

回滚说明：

- 移除 KBV 规则登录状态字段、两条 Phone/HaloApp 未登录合并配置、管理台列/筛选/Copy 和坐席初始条件传递即可回滚。

当前风险：

- 当前为前端 mock；HaloApp 登录状态仅在首次来话提供。若未来接入可信的通话中登录状态回调，需另行确认是否重置或重新执行 KBV。

### 2026-07-29 17:05 +08:00 - 渠道新客户提示音

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/config/newCustomerAlertSounds.ts`
- `public/audio/new-customer-alerts/`
- `src/types/routingConfiguration.ts`、`src/mock/routingConfiguration.ts`
- `src/store/appStore.ts`、`src/layouts/BasicLayout.tsx`、`src/layouts/components/AgentProfileArea.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`

修改原因：

- 支持 DM 和 Non-DM 渠道按渠道/媒体配置新客户接入提示音，同时保持 Voice、Video 的 OpenEye 振铃和坐席 Settings 中系统声音总开关的既有含义。

修改结果：

- Business Config 中的 DM、Non-DM 页签提供固定五项音频名称下拉与试听按钮；Voice、Video 不显示该配置。
- 所选文件名保存在渠道媒体业务配置中；新 DM/Non-DM 交互进入工作区时仅播放一次，并受 `System prompt sound` 开关控制；未配置时静默。
- 已加入五个可公开加载的本地 WAV 演示音，当前用于前端演示。
- `npm run lint`、`npm run build` 和 Channels 弹窗浏览器冒烟均通过。

回滚说明：

- 移除 `newCustomerAlertSound` 字段、提示音静态资源、Business Config 控件与 `newCustomerAlert` 播放逻辑即可恢复原行为。

当前风险：

- 当前五个文件是演示提示音；客户最终验收前需替换为 BCA 批准的音频文件，并保持既有文件名或同步更新固定选项。

### 2026-07-29 16:20 +08:00 - 话务条接入标识

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `BUSINESS_RULES.md`、`PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`DEV_LOG.md`

修改原因：

- 客户要求话务条按渠道和登录状态显示接入标识。

修改结果：

- PSTN 语音显示 `IVR: 08123456789`（当前 demo ANI）。HaloApp 语音和视频的已登录用户显示 BCAID 编号 `HaloApp: 00012345`，未登录用户显示 `HaloApp: Guest`。
- 已在业务规则中锁定 Webchat 语音/视频后续接入时的对应显示：已登录 `Webchat: {BCAID}`、未登录 `Webchat: Guest-0001`。当前 Webchat demo 仅支持 DM，不会渲染语音/视频话务条。

回滚说明：

- 恢复 `BasicLayout` 的话务条标识映射，并删除本日志及对应文档规则即可回退。

当前风险：

- 当前为前端 mock 标识；真实 ANI、BCAID 和访客 ID 应由 CTI / 渠道网关在接入事件中传入。

### 2026-07-28 16:34 +08:00 - Call Management 登录日志查询

修改页面或文件：

- `src/pages/call-management/LoginLogQueryPage.tsx`
- `src/types/loginLog.ts`、`src/mock/loginLogs.ts`、`src/store/callManagementStore.ts`
- `src/pages/LoginPage.tsx`、`src/layouts/BasicLayout.tsx`
- `src/config/workspacePageTabs.tsx`、`src/pages/call-management/index.ts`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DEV_LOG.md`

修改原因：

- 用户要求在 Call Management 的 Interaction Log 后新增登录日志查询，用于审阅用户的系统登录和登出时间。

修改结果：

- 新增 `Login Log` 菜单、可关闭工作台页签和 `/call-management/login-log` 兼容路由。
- 查询条件包含合并的 Employee ID / Name Keyword、Time Range、Operation 和 `Log Out Type`；列表按 Employee ID、Employee Name、Operation、Log Out Type、Time 展示并按时间倒序排序。
- Login 行的 Log Out Type 显示 `-`；手动登出记录为 User，无操作超时自动登出记录为 System。当前 demo 提供最近七个自然日的 19 条 mock 记录，并在运行期间追加实际登录、手动登出和超时登出事件。所有日志 Employee ID / Name 对齐 Employee Profile：Budi Kartika 为 `EMP-10027`，Maya Santoso 为 `EMP-10108`；登录日志不再使用 CTI 标识 `AICC1088` 作为 Employee ID。

验证：

- `npx tsc --noEmit --pretty false`、`npm run lint`、`npm run build`、`git diff --check` 已通过；构建仅有既有 large chunk warning。
- 浏览器确认 Login Log 位于 Interaction Log 后，默认 Time Range 覆盖最近七个自然日，显示 19 条记录并按 Time 倒序排列；查询显示 Keyword、Time Range、Operation、Log Out Type 和五个列表字段。Login 行的 Log Out Type 显示 `-`，Log Out 行分别显示 `User` 或 `System`。单页流程确认手动登出写入 `Log Out / User`、重新登录写入 Login，`EMP-10027` Keyword 查询可筛出对应记录；以 TL 账号登录确认实时 Login 记录为 `EMP-10108 / Maya Santoso`。

回滚说明：

- 移除 Login Log 页面、类型/mock/store 字段、登录/登出事件写入和工作台页签定义即可回滚。

当前风险：

- 当前为前端内存 demo；刷新恢复 mock 数据。浏览器关闭、网络断开与真实心跳超时须由服务端或 CTI 平台记录，当前仅以 seeded System 记录展示。

### 2026-07-28 12:06 +08:00 - Interaction Log 满意度评分

修改页面或文件：

- `src/types/callRecord.ts`
- `src/mock/callRecords.ts`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户要求移除 Interaction Log 的挂机原因，增加可筛选的 `Rating Score`，并在详情中查看满意度评分和可选反馈。

修改结果：

- 查询和列表移除 `End Reason`，新增 `Rating Score`，支持 `1` 至 `5` 分筛选。
- 详情右栏改为独立的上下卡片：上方 CWU，下方 Satisfaction；Ticket No. 位于 CWU 标题右侧，评分使用星级与单个数字，字段标签使用标题式大小写，反馈未填写时显示 `-`。
- PSTN 评分与反馈显示 `-`，因为满意度通过独立的周期性外呼/邮件触达，不能绑定单次通话；BankApp、Webchat、WhatsApp mock 记录保存评分和可选反馈。

回滚说明：

- 移除评分字段、筛选、详情 Satisfaction 区并恢复 End Reason 查询与列表列即可回退。

当前风险：

- 当前满意度为前端 mock。真实接入时应由渠道满意度回调按 interaction ID 写入，PSTN 的周期性调研不得错误关联到单次通话。

### 2026-07-28 11:31 +08:00 - 常用语跨分类批量移动优化

修改页面或文件：

- `src/pages/call-management/CommonPhraseManagementPage.tsx`
- `src/store/callManagementStore.ts`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 用户确认仅在左侧选择 `All Categories` 且勾选的常用语跨多个分类时，移动目标分类应允许选择全部分类；其他选择方式保持当前分类不可作为目标的规则。

修改结果：

- 新增跨分类选择判断；仅该条件下，移动分类下拉不再禁用已选记录所属的分类。
- 移动保存时自动保留本来已属于目标分类的记录，仅更新其余记录的 `categoryId`；结果提示显示实际移动数量。
- 单一分类或非跨分类勾选仍禁用其所属分类，避免无效移动。

验证：

- `git diff --check` 通过。
- `npm run lint`、`npm run build` 通过；构建仅保留既有 chunk size warning。
- Common Phrase 页面浏览器冒烟通过关键开放条件：`All Categories` 下全选跨 `Verification` / `Security` 的记录后，Move to Category 启用，且两个分类均显示为可选目标。
- 浏览器自动化在后续点击 Ant Design 下拉选项时超时；未影响已验证的可选状态。保存时的跳过语义由 `moveCommonPhraseEntries` 条件更新和 TypeScript 构建覆盖。

回滚说明：

- 恢复 `moveCategoryOptions` 对所有已选来源分类的禁用判断，并将 `moveCommonPhraseEntries` 恢复为直接更新全部已选记录即可。

当前风险点：

- 当前为前端内存 demo；真实后端批量移动接口应采用同样的“目标分类相同则跳过”语义，并返回实际更新数量。

### 2026-07-24 17:12 +08:00 - Social Media 渠道工作区整合

修改页面或文件：

- `src/pages/social-media/*`、`public/social-media-assets/*`
- `src/layouts/BasicLayout.tsx`、`src/pages/AgentWorkspace.tsx`、`src/store/appStore.ts`、`src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 用户确认将同事在独立仓库 `Rh3in/bca-aicc-demo-v2@5ca52fd` 完成的社媒渠道接入当前客户演示，入口位于 `Channel Simulation > Email` 后。

修改结果：

- 新增 `Social Media` 并列菜单和可关闭工作区标签，标签可复用，关闭回到 Home。
- 选择性导入社媒队列、筛选、回复 SLA、帖子详情、CRM 预览、CWU 原型、Reviews 本地回复和所需资源；未合并同事仓库的全局样式、无关改动或 BCA 可见品牌内容。
- 当前范围保持为前端 mock，不扩展 Live Chat 会话、异常服务结束原因或 Interaction Log 查询。

验证：

- `npm run lint`、`npm run build`、`git diff --check` 通过；构建仅保留既有 large chunk warning。
- 本地服务 `http://127.0.0.1:5180/` 返回 200，并完成登录页渲染检查。Codex 浏览器在登录后的工作区导航按钮未响应，菜单展开和页签交互仍需在常规浏览器中人工确认。

提交与发布：

- 提交 `355dd9b feat: integrate social media workspace` 已快进到 `main` 并推送至 `origin/main`。
- 使用 `npx vercel --prod --yes --scope wl-demo-s-projects --build-env VITE_APP_VISIBILITY_PROFILE=customer --build-env VITE_ENABLE_ADMIN_MENUS=true` 发布已提交的干净工作区。
- Vercel Inspect：`https://vercel.com/wl-demo-s-projects/netinfo-aicc-demo-v2/DR3Ah17b7pqkMcUB3M1H9ipSpSvr`。
- Production deployment：`https://netinfo-aicc-demo-v2-7x6z3w3va-wl-demo-s-projects.vercel.app`，正式 alias：`https://netinfo-aicc-demo-v2.vercel.app`。
- 线上浏览器登录烟测和 HTTP 检查通过：正式 alias 首页与 `/social-media-assets/post-card-bg.png` 均返回 200。Codex 浏览器在登录后未响应导航按钮，Social Media 菜单展开与页签交互仍需客户浏览器人工确认。

回滚说明：

- 移除 `customer-social-media` 菜单项、Social Media workspace store/tab wiring、`src/pages/social-media/*`、`public/social-media-assets/*` 和 `.social-media-*` 样式块即可回退，不影响 Email 或其他渠道。

当前风险：

- 社媒数据、回复、CWU 与 SLA 均为本地前端状态；没有真实渠道 API、审核、路由、审计、持久化、服务结束或记录查询集成。


### 2026-07-24 14:04 +08:00 - Email 客户入口开放

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 用户确认 Email 工作台可以向客户环境开放，并要求提交当前完整工作区后发布。

修改结果：

- 移除 `Channel Simulation > Email` 的 `localOnly` 标记，Email 现在在 customer 与 local visibility profile 中均位于 WhatsApp 下方。
- Transferred Call、Employee Management、Design System 等既有 local-only 模块保持隐藏规则不变。
- Email Record Inquiry、Template Deploy、真实邮箱后端和 Email 验证规则仍不属于当前客户工作台范围。

验证：

- `npx tsc --noEmit --pretty false`、`npm run lint`、customer profile `npm run build`、`git diff --check` 均通过；构建仅保留既有 large chunk warning。
- customer profile 生产产物浏览器烟测确认 Email 菜单数量为 1，位于 WhatsApp 下方，Transferred Call 数量为 0；Employee Management 与 Design System 保持隐藏。
- Email 工作台可打开，邮箱栏和 `CRM / Email` 可见，关闭 Email 页签后回到 Home。

提交与发布：

- 提交 `3e30d06 feat: release customer workspace updates` 已推送至 `origin/main`。
- 使用 `vercel --prod --yes --scope wl-demo-s-projects --build-env VITE_APP_VISIBILITY_PROFILE=customer --build-env VITE_ENABLE_ADMIN_MENUS=true` 发布已提交的干净工作区。
- Vercel Inspect：`https://vercel.com/wl-demo-s-projects/netinfo-aicc-demo-v2/APMgiPYtrGD6U8tiffx3Gqcg6yJ2`。
- Production deployment：`https://netinfo-aicc-demo-v2-opdqw5rhs-wl-demo-s-projects.vercel.app`，正式 alias：`https://netinfo-aicc-demo-v2.vercel.app`。
- 线上登录烟测确认 Email 菜单和工作台均可用，`CRM / Email` 正常；Transferred Call、Employee Management、Design System 继续隐藏。

回滚说明：

- 在 `customer-email` 菜单项恢复 `localOnly: true` 并恢复对应客户可见知识库描述，即可重新隐藏客户入口。
- 如需整体回滚本次发布，可将 Vercel production alias 切回上一版 deployment，并在 Git 中提交对应的反向修改。

当前风险：

- Email 仍为前端 mock，客户环境中所有邮件状态在刷新或关闭页签后重置；真实邮箱、SMTP、路由、附件、审计与 CWU 后端未接入。

### 2026-07-24 13:22 +08:00 - Email 处理状态与邮箱导航视觉修正

修改页面或文件：

- `src/pages/email/EmailPage.tsx`、`src/types/email.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 用户确认 Ignore 后邮件应进入 Trash，Forward 完成后不应出现在 Inbox、Sent、Drafts、Trash 任一文件夹；同时要求 Email 的共享客户栏保持其他弹屏的固定宽度，并按原始 UI 图修正邮箱文件夹与搜索区视觉。

修改结果：

- Ignore 现在记录 AD / Spam / Sales Email 原因、停止 SLA，并将邮件移至 Trash；Recover 清除忽略标记并返回原文件夹。
- Forward 发送后删除原邮件且不创建 Sent 项；先保存为 Draft 再发送时同时删除原邮件和转发草稿。
- Email 共享客户上下文列固定为 280px。Inbox、Sent、Drafts、Trash 改为设计图取色的实心圆形图标和白色图标，搜索区改为带前置图标的单输入框与独立 Refresh 按钮。

验证：

- `npx tsc --noEmit --pretty false`、`npm run lint`、`npm run build`、`git diff --check` 均通过；构建仅保留既有 large chunk warning。
- 浏览器逐步验证 Ignore Spam 后 Inbox 由 3 减为 2、Trash 由 1 增为 2并显示 `No reply: Spam`。
- 浏览器逐步验证直接 Forward 后原邮件从四个文件夹消失且 Sent 不增加；保存 Forward Draft 后再次发送也会清除原邮件和草稿且 Sent 不增加。
- 1366x768、1440x900、1920x1080 下客户栏均为 280px，页面无横向溢出；四个图标颜色分别为 `#00B578`、`#39B0FF`、`#FF8200`、`#EF4444`。

回滚说明：

- 恢复 `ignoreEmail` 与 `sendComposeDraft` 的旧文件夹更新逻辑，移除 `forwardSourceMessageId`，并恢复 Email 网格、文件夹和搜索区旧样式即可回退。

当前风险：

- Email 仍为 local-only 前端 mock；文件夹状态、转发移除与 Recover 只在当前前端会话中有效。

### 2026-07-24 11:38 +08:00 - 系统登出服务阻断分层提示

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`DEV_LOG.md`

修改原因：

- 用户反馈坐席已切换为 Not Ready 但仍有客户服务时，继续显示状态切换提示无法反映实际阻断原因。

修改结果：

- 顶栏系统 Log Out 现在优先识别进行中的通话、Live Chat 或 Live Chat 2 服务，并显示 `Active Service in Progress` 和完成或关闭服务的提示。
- 仅在没有进行中服务时，Ready 与 Pre-AUX 才显示切换至 Not Ready 或 AUX 的提示；Unsigned、Not Ready、AUX 继续进入二次确认。
- 话务条 Sign Out 维持原有服务阻断提示和语义；无操作自动登出配置与计时范围未改动。

回滚说明：

- 移除 `handleLogout` 中的服务优先判断，并恢复对应业务规则记录即可回退。

当前风险：

- 当前仍为前端 Demo，进行中服务仅由本地通话状态与 Live Chat / Live Chat 2 活跃会话判断。

### 2026-07-24 10:11 +08:00 - Email 本地入口与共享工作台统一

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/email/EmailPage.tsx`、`src/mock/email.ts`
- `src/pages/inbound/components/CrmPanel.tsx`、`src/pages/inbound/components/LeftColumn.tsx`、`src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 用户要求仅在本地环境恢复 `Channel Simulation > Email`，并让 Email 客户上下文和 `CRM / Email` 页签与 Live Chat / Inbound 工作台完全一致；CRM 必须复用 Live Chat 当前截图。

修改结果：

- Email 菜单恢复在 WhatsApp 下方并标记为 local-only；customer profile 保持隐藏。现有唯一可关闭 Email 页签、复用和 Home 回退行为保持不变。
- Email 直接复用共享 `LeftColumn` 的 Customer Information、Customer Journey、Ticketing History、Next Best Action 和 Quick Action。Customer Information 显示 Email 接入且不显示未确认的 Verify；点击客户邮箱打开 Email 自有编辑器。
- Email 中间工作区改为共享 `CrmPanel`，固定显示 `CRM / Email`，默认激活 Email。CRM 使用 Live Chat 同一 `/screenshots/crm-workspace.jpg`；Ticket、NBA、Quick Action 使用标准可关闭 CRM 业务页签。
- 删除 Email 自建 CRM、客户栏和重复页签样式；补全匿名 Email mock 的 CRM 联系方式，保留全部邮件、线程、SLA 和 CWU 本地交互。

验证：

- `npx tsc --noEmit --pretty false`、`npm run lint`、`npm run build`、`git diff --check` 均通过；构建仅保留既有 large chunk warning。
- local 浏览器确认 Email 位于 WhatsApp 下方；customer profile 确认 Email 菜单数量为 0。打开、重复复用、关闭回 Home、重开状态重置均通过。
- 浏览器确认五个共享客户组件、Email 接入、无 Verify、`CRM / Email` 顺序、默认 Email、CRM 截图加载、动态 CRM 页签及关闭回退。
- Reply/Send、Save Draft、Ignore Spam、Trash Recover、搜索、CWU 生成与确认均通过；1366x768、1440x900、1920x1080 下页面与 Email 容器无横向溢出。

回滚说明：

- 移除 `customer-email` local-only 菜单和点击处理，恢复 Email 自建 Customer Column、CRM/页签及对应样式，并撤销共享组件可选参数即可回退。

当前风险：

- Email 仍是 local-only 前端 mock，不连接真实邮箱、SMTP、模板、附件或 CWU 后端；customer profile 暂未开放。
- 浏览器控制台仍有既有 Ant Design `maskClosable` 弃用提示，与本次 Email 改动无关。

### 2026-07-23 18:57 +08:00 - 系统登出与无操作超时

修改页面或文件：

- `src/hooks/useIdleLogout.ts`
- `src/layouts/BasicLayout.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`

修改原因：

- 用户定义系统登出规则：坐席状态必须先切换为 Not Ready 或 AUX 才能手动登出；无操作超时仅对 Unsigned、Not Ready 和 AUX 生效，并使用全局控制的 30 / 10 分钟配置。

修改结果：

- 统一手动确认和自动到期的系统登出出口，清理坐席服务状态、认证会话并跳转登录页。
- Ready 与 Pre-AUX 的顶栏 Log Out 显示状态切换提示；Unsigned、Not Ready 和 AUX 显示二次确认。
- 新增当前窗口无操作监控，窗口活动、提醒关闭或 Continue Working 会重新计时；到达预警阈值显示 Session Expiring，到达总时长自动登出。

验证：

- `npx tsc --noEmit`、`npm run lint`、`npm run build`、`git diff --check` 已通过；构建仅有既有 large chunk warning。
- 浏览器确认 Unsigned Log Out 显示二次确认，Ready Log Out 显示 Not Ready/AUX 状态切换提示。默认 30 / 10 分钟周期未在冒烟会话中等待至到期，计时边界与回调经代码检查确认。

回滚说明：

- 移除 `useIdleLogout`、恢复 BasicLayout 原有顶栏 Log Out 处理和项目规则记录即可回滚。

当前风险：

- 当前仅监控单个浏览器窗口；不包含服务端会话失效、多标签同步或真实认证撤销。

### 2026-07-23 17:02 +08:00 - TL 外呼直拨与审批队列演示

修改页面或文件：

- `src/mock/auth.ts`、`src/mock/transfer.ts`、`src/mock/chat.ts`、`src/types/auth.ts`
- `src/layouts/BasicLayout.tsx`、`src/layouts/components/AgentProfileArea.tsx`、`src/layouts/components/AgentToolbar.tsx`、`src/layouts/components/OutboundCallModal.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`、`src/pages/TlOutboundApprovalPage.tsx`
- `src/hooks/useExternalOperationApproval.ts`、`src/utils/outboundApproval.ts`、`src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户要求避免使用其领导姓名，TL 改为女性身份；只有普通坐席外呼需要申请。TL 审批需用蒙层锁定静态底图、展示两笔及以上申请的队列效果，并消除主体灰白套层。

修改结果：

- `666666 / 666666` 现为 TL Maya Lestari 并使用女性头像。TL 外呼号码和客户电话仍需选择 Reason，但直接解锁 Call/Outbound；普通 Agent 保持审批规则。
- 多个普通 Agent 申请复用一个 TL 窗口，按创建时间 FIFO 处理；标题显示进度、正文展示下一笔摘要。TL Modal 使用轻量蒙层和统一白色主体，Call Number 输入框为白色无图标，Call 按钮也不再使用图标。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 均通过；构建仅保留既有 bundle 大小提示。
- 浏览器烟测：`666666 / 666666` 显示 `TL - Maya Lestari`；Call Number 无 Request Approval，填写号码和 `Miss Information` 后 Call 可用；号码输入框为白色 32px 无图标。普通 Agent 仍显示 Request Approval。
- 单笔真实审批会在 TL 页面显示 `1 of 2` 和下一笔摘要；处理首笔后切换至本地模拟的第二笔，不会关闭窗口。输入框申请中仍保持白色，TL Modal 的内容区域和容器均使用白色背景。

回滚说明：

- 恢复每笔申请的独立窗口名、普通/ TL 统一审批分支和原 TL mock 身份即可回退。

当前风险：

- 队列仍为浏览器本地模拟，真实系统需要后端的审批领取、并发锁和审计记录。

### 2026-07-23 16:18 +08:00 - TL 审批居中与 Call Agent 可见范围

修改页面或文件：

- `src/pages/TlOutboundApprovalPage.tsx`
- `src/layouts/BasicLayout.tsx`、`src/layouts/components/AgentToolbar.tsx`、`src/layouts/components/OutboundCallModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户要求 TL 审批浮层改为居中；Call Number 表单去除号码图标并与原因、操作按钮对齐；普通坐席 Call Agent 仅展示直属上级 SPV 和 TL。

修改结果：

- TL 审批沿用标准 `BaseModal` 居中行为。Call Number 使用无前缀的简洁输入框，号码、Reason、审批和 Call 控件统一为 32px 高、8px 间距。
- `888888 / 888888` 的 Call Agent 筛选为 SPV/TL；TL 及后续非普通 Agent 角色保持完整列表。此限制只影响 Call Agent，不影响 Transfer Agent、Skill、IVR 或 Transfer Number 的既有规则。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 均通过；构建仅保留既有 bundle 大小提示。
- 浏览器烟测：Call Number 的号码、Reason、Request Approval、Call 外框均为 32px；普通 Agent Call Agent 显示 2 位 SPV/TL，TL 显示完整 6 位坐席。

回滚说明：

- 移除 `callAgentScope` 过滤并恢复 TL Modal 的固定定位样式，即可回到此前 Demo 行为。

当前风险：

- 角色范围为前端 Demo 映射，真实系统仍需由组织层级和后端权限服务提供可见人员范围。

### 2026-07-23 15:43 +08:00 - 客户资料卡外呼 Reason 与审批范围统一

修改页面或文件：

- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/layouts/components/OutboundCallModal.tsx`
- `src/hooks/useExternalOperationApproval.ts`
- `src/types/outboundApproval.ts`、`src/utils/outboundApproval.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户确认 `Miss Information` / `Financial Risk` 不只适用于工具栏外呼，也必须适用于 Customer Information 客户电话外呼；号码和 Reason 共同决定一次 TL 审批授权。

修改结果：

- Customer Information 的 Request Approval 保持紧凑卡片操作，点击后打开标准 `BaseModal`，选择必填 Reason 后才创建申请。
- 工具栏和客户资料卡复用同一组 Reason 值。审批 hook、查找、释放和消耗均比较 Reason，旧的无 Reason 授权不能被复用；TL 对两类申请均显示 Reason。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build` 均通过；构建仅保留现有 bundle 大小提示。
- 浏览器烟测：工具栏 `Outbound Call > Call Number` 在仅填写号码时保持禁用，选择 `Miss Information` 后申请按钮可用；客户资料卡完成 KBV 后确认悬停电话号码显示的 `Request Approval` 入口仍存在于 DOM，且该入口接入紧凑 Reason Modal。

回滚说明：

- 移除资料卡 Reason modal 和 scope 的 `outboundReason` 匹配，即可恢复仅工具栏要求 Reason 的旧 Demo 流程。

当前风险：

- Reason 仍为前端固定 mock 字典；真实系统需由业务配置、权限和审计模型定义可选值与留痕要求。

### 2026-07-23 15:28 +08:00 - Interaction Log 呼叫类型查询

修改页面或文件：

- `src/types/callRecord.ts`
- `src/mock/callRecords.ts`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户要求在 Interaction Log 中识别从转移或三方接入当前坐席的记录，供主管检查座席转移电话的频率。

修改结果：

- 列表在 `Media` 后新增 `Call Type`，显示 `Customer`、`Transfer`、`Conference`。
- 查询条件新增 `Call Type`，默认 `All Call Types`；Search 和 Reset 与其他筛选条件一致。
- 30 条 mock 记录补充呼叫类型，当前日期数据覆盖三种类型，并保留多条 `Transfer` / `Conference` 供筛选演示。

回滚说明：

- 移除 `callType` 类型字段、mock 值、列表列与查询条件即可恢复原始 Interaction Log 结构。

当前风险：

- 当前类型为前端 mock 口径。真实接入时需由呼叫平台明确提供转接和三方会议事件，不能仅由结束原因推断。

### 2026-07-23 15:05 +08:00 - 未识别 PSTN 客户卡最小化展示

修改页面或文件：

- `src/mock/inbound.ts`
- `src/components/CustomerInformationPanel.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`DEV_LOG.md`

修改原因：

- 客户反馈未识别来电仍显示未加载邮件、客户号和 Special Handling，造成座席在尚未确认身份前看到过多无效信息与入口。

修改结果：

- 未识别 PSTN 显示匿名来电号码 `08123456789`，Email 与 CIS 统一显示 `-`；邮件不再是可点击操作。
- 仅合法数字 CRM CIS 代表已识别客户。未识别与 Guest 均隐藏 Special Handling、全渠道联系方式、客户号码外呼和邮件发送；KBV、来电渠道、状态和 Call Flow Detail 保留。
- KBV 通过后 CRM 返回有效 CIS 时，识别客户的 CRM 联系方式、Special Handling、邮件和外呼入口恢复显示。

验证：

- `npx tsc --noEmit`、`npm run lint`、`npm run build` 通过；构建仅保留既有 large chunk warning。
- customer 浏览器烟测：全新 PSTN 会话只显示 `Unidentified Customer`、`08123456789`、Email / CIS `-`、来电渠道和 KBV，没有 Special Handling、联系人查看、邮件或客户外呼入口；KBV 4/4 后 CRM 刷新为 Dimas，`Verified` 保持，Special Handling、联系人查看和可点击邮件恢复显示。测试页与开发服务保持运行。

回滚说明：

- 还原未识别 mock 字段及 CRM CIS 条件渲染即可恢复原先所有客户卡均显示 CRM 动作的表现。

当前风险：

- 合法 CIS 当前以至少六位数字的前端 DEMO 格式判断；真实 CRM 接入时应替换为后端明确的身份加载状态，而不是依赖客户端格式。

### 2026-07-23 14:30 +08:00 - 联系方式查看弹窗左右列表与共享图标

修改页面或文件：

- `src/pages/inbound/components/ContactChannelIcon.tsx`
- `src/pages/inbound/components/ContactManagementModal.tsx`
- `src/pages/inbound/components/CustomerContactDetailsModal.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/mock/inbound.ts`、`src/styles/index.less`
- `CURRENT_STATUS.md`、`DESIGN_SYSTEM.md`、`BUSINESS_RULES.md`、`DEV_LOG.md`

修改原因：

- 客户反馈查看入口图标过于瘪小，查看弹窗的卡片网格不如旧编辑弹窗简洁，同时要求渠道图标直接复用旧实现，并明确需要单条、多条和无数据的 CRM 联系方式样本。

修改结果：

- 查看入口改为 `IdcardOutlined`，tooltip 保持 `All Contact Details`。
- 新增共享 `ContactChannelIcon`，查看和本地旧编辑弹窗复用完全相同的渠道图标、色彩与 Play Store 图形。
- 查看弹窗改为固定左侧渠道、右侧纵向联系方式的分隔列表；不再有渠道卡片、输入、增删改或保存操作。
- Dimas mock 覆盖 Phone / Email 多值、多个单值渠道和 Facebook、TikTok、YouTube、Play Store 空值；未识别客户仍无 CRM 联系方式。

验证：

- `npx tsc --noEmit`、`npm run lint`、`npm run build` 通过；构建仅保留既有 large chunk warning。
- customer 浏览器烟测：未识别 PSTN 只显示 `IdcardOutlined` 查看入口，弹窗 12 个渠道均为 `-` 且不含编辑控件；完成 KBV 4/4 后，CRM 刷新为 Dimas 并保持 `Verified`，查看弹窗正确显示多条 Phone / Email、单值渠道和空值渠道。
- local 维护配置：查看入口与旧铅笔在 `VITE_APP_VISIBILITY_PROFILE=local` 和 `VITE_ENABLE_CONTACT_EDIT=true` 时并列显示；浏览器测试页与开发服务均保持运行，不再在测试完成时自动清理。

回滚说明：

- 移除共享图标组件并恢复查看弹窗原有卡片栅格及 `ContactsOutlined` 即可回退；旧本地编辑功能不依赖查看弹窗的数据流。

当前风险：

- CRM 联系方式仍是前端结构化 mock。真实 CRM 集成仍须确认渠道归属、零到多值字段映射、数据权限与刷新契约。

### 2026-07-23 12:30 +08:00 - CRM 全渠道联系方式只读查看

修改页面或文件：

- `src/types/inbound.ts`、`src/mock/inbound.ts`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CustomerContactDetailsModal.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DESIGN_SYSTEM.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 之前仅隐藏铅笔入口并未满足客户的“查看所有 CRM 联系方式”需求；客户需要在 Customer Information 标题栏查看每个渠道可有零至多条的完整只读联系方式。

修改结果：

- Customer Information 标题栏新增 `All Contact Details` 图标。客户版只显示查看入口；本地维护环境在显式开关打开时仍可在其旁使用旧铅笔 DEMO。
- 新增独立只读弹窗，按 Communication Channels、Social Media、App Store Channels 显示 12 个渠道。每个渠道以 CRM 多值文本纵向展示，无值时显示 `-`；弹窗只有 Close 操作。
- `CustomerProfile` 新增结构化 CRM 联系方式字段。未识别 PSTN 不提供联系方式；有效 CIS 刷新会连同对应客户的 CRM 联系方式写入左栏 profile。

验证：

- `npx tsc --noEmit` 通过。
- `npm run lint`、`npm run build` 和 customer/local 浏览器烟测待本次实现完成后执行。

回滚说明：

- 移除 `CustomerContactDetailsModal`、标题栏查看入口和 `crmContacts` mock 字段即可回退到无客户联系方式查看的前一版本；本地旧编辑 DEMO 不受此新增查看能力影响。

当前风险：

- 联系方式仍为前端结构化 mock；真实 CRM 需按同一渠道到多值契约返回数据，并确认 iframe origin、认证与数据权限。

### 2026-07-23 12:12 +08:00 - 双账号 TL 转号码权限与外呼原因

修改页面或文件：

- `src/mock/auth.ts`、`src/types/auth.ts`
- `src/layouts/BasicLayout.tsx`、`src/layouts/components/AgentToolbar.tsx`
- `src/layouts/components/OutboundCallModal.tsx`
- `src/types/outboundApproval.ts`、`src/utils/outboundApproval.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户要求以不同 Demo 登录账号演示普通坐席与 TL 的 `Transfer Number` 权限；同时确认坐席发起工具栏外部号码外呼时必须选择业务原因。

修改结果：

- 新增 `666666 / 666666` TL 账号，登录后显示 `TL - Rangga Aditya` 并通过 `transfer:external-number` 显示直接可用的 Transfer Number；`888888 / 888888` 保持普通 Agent 并隐藏该标签。
- 工具栏 Outbound Call Number 新增必填 Reason 下拉选项 `Miss Information`、`Financial Risk`。原因随审批记录同步给 TL；修改号码或原因会要求重新申请审批。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 已通过；构建仅保留既有 large chunk warning。
- 浏览器烟测：`888888 / 888888` 显示 `Agent - Budi Kartika`，Outbound Call Number 未选原因时 Request Approval 不可用；选择 `Miss Information` 并输入新号码后 Request Approval 可用。`666666 / 666666` 显示 `TL - Rangga Aditya`，Transfer modal 出现 Transfer Number，输入号码后可直接 Transfer，并显示成功反馈及进入 Not Ready / ACW。

回滚说明：

- 移除 TL mock 账号和权限传递即可恢复单 Agent 登录；移除 outbound reason 字段、Select 和审批匹配字段即可恢复原外呼审批流程。

当前风险：

- 两组账号和权限均是前端 Demo mock；不构成真实 LDAP、岗位、权限审计或后端授权实现。

### 2026-07-23 11:49 +08:00 - 普通坐席隐藏 Transfer Number

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/types/outboundApproval.ts`
- `src/utils/outboundApproval.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户确认 `Transfer Number` 仅对 TL 及以上角色展示，普通坐席不应看到该标签；高权限号码转移不需要再走 TL 审批。

修改结果：

- 当前普通坐席 Demo 的 Transfer modal 仅显示 `Transfer Agent`、`Transfer Skill` 和 `Transfer IVR`；`Transfer Number` 默认隐藏。
- 增加明确的 `canTransferToNumber` 能力入口供未来 TL-and-above 角色映射使用。启用后，该页仅保留号码输入与直接可用的 `Transfer`，不再渲染 `Request Approval` 或创建审批记录。
- 外呼审批模型收窄为工具栏外呼号码和客户资料卡客户号码两个入口。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build`、`git diff --check` 已通过；构建仅保留既有 large chunk warning。
- 浏览器烟测：普通 Agent 登录、签入、Ready、PSTN 接通后打开 Transfer modal，标签栏仅显示 `Transfer Agent`、`Transfer Skill`、`Transfer IVR`，未显示 `Transfer Number`。

回滚说明：

- 将 `canTransferToNumber` 默认值改回可见，并恢复 Transfer Number 的审批钩子和审批类型即可。

当前风险：

- 当前前端 Demo 尚未建立真实岗位权限模型；TL-and-above 能力通过组件显式属性预留，接入真实角色时须由后端权限结果驱动。

### 2026-07-23 11:12 +08:00 - CRM 只读联系方式与本地编辑开关

修改页面或文件：

- `src/config/featureFlags.ts`
- `src/config/moduleVisibility.ts`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `.env.example`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `PROJECT_CONTEXT.md`
- `DECISION_LOG.md`

修改原因：

- 客户确认 Customer Information 仅展示 CRM 获取的联系方式，座席不支持编辑；同时需要保留旧 Contact Management DEMO 供未来维护或需求确认时查看。

修改结果：

- 客户版不再渲染 Customer Information 铅笔按钮、Contact Management modal 或其本地编辑状态；电话和邮箱继续只来自当前 CRM-backed profile。
- 新增 `VITE_ENABLE_CONTACT_EDIT=false` 默认开关。只有 `VITE_APP_VISIBILITY_PROFILE=local` 且开关为 `true` 时，维护环境才会挂载旧的本地 Contact Management DEMO。
- 文档明确该开关不是客户部署能力；未来客户编辑必须先确认 CRM 写回、权限、审计、字段归属、校验和失败处理。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build` 通过；构建仅保留既有 large chunk warning。
- customer 浏览器烟测：即使设置 `VITE_ENABLE_CONTACT_EDIT=true`，Customer Information 仍没有 Edit contact 按钮。
- local 浏览器烟测：`VITE_APP_VISIBILITY_PROFILE=local` 且 `VITE_ENABLE_CONTACT_EDIT=true` 时，Edit contact 按钮显示并可打开旧 Contact Management DEMO。

回滚说明：

- 移除 contact-edit feature flag 和 local-only 条件渲染，即可恢复客户卡上的旧本地编辑入口。

当前风险：

- 旧编辑 DEMO 仍是前端本地 mock，不得作为 CRM 写回能力或客户版功能启用。

### 2026-07-23 10:59 +08:00 - CRM 刷新反馈与 KBV 条件稳定性

修改页面或文件：

- `src/components/OperationNotice.tsx`
- `src/components/index.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/pages/inbound/components/LeftColumn.tsx`
- `src/styles/index.less`
- `DESIGN_SYSTEM.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`

修改原因：

- 客户确认 CRM 刷新成功后不需要额外提示，避免遮挡话务条；并反馈再次打开 KBV 后 Segment / Skill 不应因 CRM 刷新而变化。

修改结果：

- 成功 CRM 刷新改为静默更新左栏可见资料；失败复用位于话务条下方、四秒自动隐藏的共享 `OperationNotice` banner。
- Transfer banner 提取为可复用 `OperationNotice`，Design System 明确：可见状态已足以说明成功时不提示，操作失败使用共享 banner，不使用页面私有 toast 样式。
- 当前通话首次 KBV 的 Segment、Skill、Scenario 成为稳定上下文；座席在 KBV 面板调整后的条件会在同一通话再次打开时保留，CRM 资料刷新不再重算这些条件。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build` 通过；构建仅保留既有 large chunk warning。
- 浏览器烟测：未识别 PSTN 客户完成 KBV 4/4 并触发 CRM 刷新后，客户卡更新为 Priority/Dimas；重新打开 KBV 仍显示首次条件 `Layanan Reguler`、`Kartu Kredit` 和 `Default`，成功刷新没有 toast。

回滚说明：

- 删除共享 `OperationNotice` 并恢复原转移 banner；移除工作区 KBV 条件缓存即可回退。

当前风险：

- KBV 条件缓存仅覆盖当前前端交互，刷新页面或开始新的客户交互后会按新交互重新建立。

### 2026-07-23 10:51 +08:00 - 移除旧服务模式接入拦截

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/store/appStore.ts`
- `src/mock/auth.ts`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 客户发现语音/视频接入仍显示 `Current sign-in mode is Digital only`。该提示来自已移除的坐席自主服务模式选择逻辑，与当前固定全渠道 Demo 能力冲突。

修改结果：

- 移除 Voice only / Digital only 不匹配状态及其在 Header、BankApp、WhatsApp、Webchat handoff 中的提示分支。
- 语音、视频和文字渠道现在只受 `Ready` 状态及当前活跃服务保护；签入仍内部固定为全渠道兼容值。
- DEC-006 标记为已被 DEC-036 取代，避免后续恢复已废弃的服务模式决策。

回滚说明：

- 若未来确认按绑定技能区分媒体资格，应建立正式的员工技能媒体能力模型，再在接入判断中使用该模型；不要恢复旧的坐席手选服务模式。

当前风险：

- 当前 Demo 尚未读取真实绑定技能；所有演示账号仍按全渠道能力处理。

### 2026-07-23 10:32 +08:00 - KBV 通过后 CRM CIS 刷新客户信息

修改页面或文件：

- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/utils/crmCustomerIdentity.ts`
- `src/mock/inbound.ts`
- `BUSINESS_RULES.md`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DECISION_LOG.md`

修改原因：

- 客户要求取消座席手动输入 Customer ID 的刷新方式，改为座席完成 KBV 并点击 `Apply Verified` 后，由 AICC 通过 CRM `postMessage` 获取 CIS 并刷新左侧客户信息。

修改结果：

- 删除 Customer Information 标题栏的刷新图标、Customer ID 粘贴/输入 popover 和对应样式。
- KBV 状态上移至 `InteractionWorkspace` 管理；`Apply Verified` 先保留 `Verified`，再发出包含版本与关联 ID 的 CRM CIS 请求。
- 截图式 CRM 增加无可见控件的同源 DEMO bridge，返回 CIS 后一次更新客户 profile、Journey 和 Ticketing History；成功提示资料已从 CRM 更新。
- AICC 忽略错误 origin、错误消息、错误关联 ID、空 CIS；未知 CIS 或超时不覆盖当前资料并提示失败。`Apply Failed`、未满足 KBV、Clear All 和 PIN 均不会触发 CRM CIS 请求。

验证：

- `npm run lint` 通过。
- `npm run build` 通过；仅保留既有 large chunk warning。
- 浏览器烟测：以未识别 PSTN 客户完成 Mandatory 1/1 和 Static 3/3 后点击 `Apply Verified 4/4`；左栏自动刷新为 CRM CIS 对应的 Dimas 资料、Journey 和 Ticket，状态保持 `Verified`，且仅剩 Edit contact 标题栏动作并显示 CRM 更新成功反馈。

回滚说明：

- 还原 Customer Information 卡的手动刷新入口，并移除 CRM CIS bridge 与工作区消息监听即可回退到原 DEMO 行为。

当前风险：

- 当前仅为同源前端 DEMO 消息桥接；真实 CRM iframe、可信 origin allowlist、认证、审计和 CIS/customer-data API 仍需在后端集成阶段确认。

### 2026-07-23 10:14 +08:00 - 异常挂机原因默认 DM 与条件下拉入口

修改页面或文件：

- `src/mock/sessionEndReasons.ts`
- `src/layouts/components/AgentToolbar.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `BUSINESS_RULES.md`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `DECISION_LOG.md`

修改原因：

- 客户确认默认异常挂机原因只保留两条 DM 配置；Voice 和 Video 仍可由管理台后续配置，但不预置异常原因。

修改结果：

- 移除 `Hening & Tidak Ada Respons` 默认记录；`Problem Teknis` 改为仅适用 DM，保留既有 ID；`Nasabah Tidak Ada Respons Lebih Lanjut` 保持 DM。
- Voice、Video、DM 只有当前媒体存在启用的异常原因时才展示挂机/结束服务的小三角；无可用原因时使用完整圆角的正常主按钮。
- 正常语音/视频挂机仍一键结束；正常文字会话仍保留确认弹框；异常原因选择仍直接结束、不二次确认。
- 管理台仍允许配置 Voice、Video、DM；新增并启用 Voice 原因后，PSTN 坐席侧即时恢复异常原因小三角。

验证：

- `npm run lint`、`npm run build` 通过；构建仅有既有 large chunk warning。
- 浏览器烟测确认管理台初始仅两条 DM、PSTN/Video 无匹配原因时无小三角、删除全部 DM 原因后 End Service 仍可打开确认框、启用 Voice 原因后 PSTN 小三角恢复。

回滚说明：

- 恢复原有默认 mock 数据，并还原 AgentToolbar 与 LiveChat 会话工作区的始终显示 split button 渲染即可回滚。

当前风险：

- 原因配置仅保存于当前前端 demo 会话；刷新页面后会回到默认两条 DM 原因。

### 2026-07-22 17:58 +08:00 - Busy Reason Productivity Type 分类

修改页面或文件：

- `src/pages/call-management/BusyReasonManagementPage.tsx`
- `src/types/busyReason.ts`
- `src/mock/busyReasons.ts`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`

修改原因：

- 客户要求为 AUX 原因增加生产性分类，以支持未来坐席状态统计和报表统计区分。

修改结果：

- 新增 `Productivity Type`，固定为 `Productive` 和 `Non-Productive`。
- 查询使用含 All 的下拉筛选；列表列位于 Busy Reason 后；编辑弹窗使用直接可见的两项单选按钮。
- 按客户提供映射初始化 11 个启用 AUX 原因；禁用的 Extension 3-11 统一初始化为 `Non-Productive`。
- 当前交付仅维护配置，不改变 AUX 状态流或新增报表逻辑。

验证：

- `npm run lint`、`npx tsc --noEmit`、`npm run build` 通过；构建仅有既有 large chunk warning。
- 浏览器冒烟确认 Productivity Type 查询下拉、紧跟 Busy Reason 的列表列、附件初始映射，以及编辑弹窗中的两项直接单选。

回滚说明：

- 移除 `productivityType` 类型、mock 字段、管理页查询/列表/编辑控件和对应文档即可回滚。

当前风险：

- Productivity Type 当前仅保存在前端本地 Busy Reason 配置中，实际坐席状态统计与报表消费仍是后续范围。

### 2026-07-22 17:28 +08:00 - 转移工作流客户生产发布

修改页面或文件：

- 客户生产环境 `https://netinfo-aicc-demo-v2.vercel.app`
- `DEV_LOG.md`

修改原因：

- 发布已完成的 TL 外呼审批和语音转移体验优化，并确保仅用于本地演示的 `Transferred Call` 不进入客户环境。

修改结果：

- 提交 `b717add feat: refine transfer workflow and approvals` 已推送至 `origin/main`。
- 使用 `vercel --prod --yes --scope wl-demo-s-projects --build-env VITE_APP_VISIBILITY_PROFILE=customer --build-env VITE_ENABLE_ADMIN_MENUS=true` 完成客户环境部署并绑定正式域名。
- 客户环境按 `localOnly` 规则隐藏 `Channel Simulation > Transferred Call`；该预览仍保留在本地演示环境。

验证：

- 客户环境构建通过；仅出现既有 large chunk warning。
- 生产浏览器冒烟确认 `Channel Simulation` 仅显示 `PSTN`、`BankApp`、`Webchat`、`WhatsApp`，未显示 `Transferred Call`。

回滚说明：

- 可在 Vercel 控制台或 CLI 将正式域名重新指向上一条部署记录。

当前风险：

- 该项目仍为前端 Demo；转移、TL 审批和接收坐席预览均使用本地模拟状态，不连接真实 CTI 或审批服务。

### 2026-07-22 16:25 +08:00 - 自动登出超时与提醒英文口径收敛

修改页面或文件：

- `src/pages/call-management/GlobalControlConfigurationPage.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`

修改原因：

- 用户确认原 `Early Warning Duration` 无法表达“距系统自动登出还有多久时提醒”的实际含义。

修改结果：

- 配置标签改为 `System Idle Log-out Timeout` 与 `Auto Log-out Warning Lead Time`。
- 校验提示同步明确提醒时间必须小于系统无操作自动登出时长。

验证：

- `npm run lint`、`npm run build`、`npx tsc --noEmit` 通过；构建仅有既有 large chunk warning。
- 浏览器冒烟确认全局控制页面显示 `System Idle Log-out Timeout` 与 `Auto Log-out Warning Lead Time`。

回滚说明：

- 恢复原字段标签和校验文案即可回滚。

当前风险：

- 当前 demo 仍未模拟空闲超时后的实际提醒弹窗或自动系统登出动作。

### 2026-07-22 16:00 +08:00 - 全局控制自动登出时长语义修正

修改页面或文件：

- `src/pages/call-management/GlobalControlConfigurationPage.tsx`
- `src/types/globalControlConfiguration.ts`
- `src/mock/globalControlConfiguration.ts`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`

修改原因：

- 用户确认 `Auto Sign-out Duration` 描述有误：Sign Out 属于坐席话务条操作，系统非活跃时长配置应表达为自动登出。

修改结果：

- 全局控制页面、校验提示和配置字段统一改为 `Auto Log-out Duration` / `idleAutoLogOutMinutes`。
- 明确该配置是系统会话设置，不改变坐席话务条 Sign Out、ACW 或状态机行为。

验证：

- `npm run lint`、`npm run build`、`npx tsc --noEmit` 通过；构建仅有既有 large chunk warning。
- 浏览器冒烟确认 Inactivity Control 显示 `Auto Log-out Duration`，话务条的 Sign Out 仍为独立操作。

回滚说明：

- 恢复原 `idleAutoSignOutMinutes` 字段及 `Auto Sign-out Duration` 文案即可回滚。

当前风险：

- 当前前端 demo 仅保存该系统登出配置，尚未模拟空闲超时后的自动系统登出动作。

### 2026-07-22 14:18 +08:00 - TL 审批正文与坐席结果浮层统一组件修正

修改页面或文件：

- `src/pages/TlOutboundApprovalPage.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DECISION_LOG.md`、`DESIGN_SYSTEM.md`、`DEV_LOG.md`

修改原因：

- 客户确认 TL 标题浅蓝风格正确，但要求去除审批正文浅蓝背景、让倒计时更贴近右侧；同时反馈坐席审批结果仍显示为没有项目样式的默认通知。

修改结果：

- TL 审批继续使用标准浅蓝标题；仅本审批正文覆盖为白色，并缩小标题右侧预留空间，使倒计时对齐到右侧。
- 坐席审批结果不再依赖全局 `notification` 样式挂载，改为复用非遮罩、右下角定位的 `BaseModal`，带统一标题、边框、圆角、阴影、关闭按钮和通过/拒绝/超时状态色；备注继续显示并在五秒后自动消失。

验证：

- `npm run lint`、`npm run build`、`git diff --check` 已通过；构建仅保留既有 bundle size warning。
- 浏览器烟测确认 TL dashboard 在本地页面完整显示 BANK 1 顶部、左侧导航和底部图表，未出现裁切或横向溢出。

回滚说明：

- 可移除 TL 的正文白色覆盖和坐席结果 `BaseModal`，恢复至此前的全局通知实现。

当前风险：

- TL 审批仍是同浏览器前端模拟，不含真实身份、权限、审计与跨设备消息服务。

### 2026-07-22 14:04 +08:00 - TL 审批恢复标准浅蓝弹框与坐席提示样式

修改页面或文件：

- `src/pages/TlOutboundApprovalPage.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`DECISION_LOG.md`、`DESIGN_SYSTEM.md`、`DEV_LOG.md`

修改原因：

- 客户反馈上一轮将 TL 标准浅蓝标题和浅色主体错误覆盖为白色，且坐席 notification 的 CSS class 未稳定命中实际节点，导致审批结果提示没有系统样式。

修改结果：

- TL 审批重新使用共享 `outbound` Modal 的浅蓝标题与浅色主体，去除局部白色 Header / Body 覆盖；保留 `Approval`、右侧倒计时、小头像和右下角定位。
- 坐席 notification 保留语义 class，并通过 Ant Design 官方 `styles` 槽位直接写入项目颜色、边框、圆角、阴影、标题、描述和关闭按钮样式，按通过/拒绝/超时展示对应状态色。

验证：

- `npm run lint`、`npm run build`、`git diff --check` 已通过；构建仅保留既有 bundle size warning。

回滚说明：

- 恢复 TL Modal 的局部白色覆盖与旧 notification class-only 写法即可。

当前风险：

- 跨窗口 TL 审批仍需演示前人工点验；真实审批的身份、权限、审计与跨设备消息服务不在当前前端 Demo 范围。

### 2026-07-22 13:12 +08:00 - TL 审批备注回传与右下角标准弹框

修改页面或文件：

- `src/utils/outboundApproval.ts`
- `src/pages/TlOutboundApprovalPage.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`DECISION_LOG.md`、`DEV_LOG.md`

修改原因：

- 客户反馈 TL 同意时备注未显示在坐席提示中，TL 弹框没有稳定固定在右下角，且当前蓝色变体与坐席通知没有正确复用系统样式。

修改结果：

- `approveExternalOperationApproval` 现在接收并保存可选 `reviewNote`；同意和不同意均会向坐席提示显示 `Note: {内容}`。
- TL 弹框移除内联容器渲染，使用标准 portal 和 root class 固定在视口右下角；头部显示 `Approval` 与右对齐倒计时，正文使用 28px 头像和紧凑页脚。
- 坐席通知改用 Ant Design `notification.classNames` 的 root、title、description、close 语义槽位，项目 CSS 可以稳定命中相应节点。

验证：

- `npm run lint`、`npm run build`、`git diff --check` 已通过；构建仅保留既有 bundle size warning。
- 浏览器截图确认完整 TL dashboard 在 1366×768 和 1440×900 均无裁切或溢出。原生 `window.open` 弹窗仍需在演示前完成最终 Approve / Reject 跨窗口手动点验。

回滚说明：

- 恢复同意方法无备注参数、旧 Modal 容器定位和旧 notification class 写法即可。

当前风险：

- TL 审批仍是同浏览器前端模拟，不含真实身份、权限、审计与跨设备消息服务。

### 2026-07-22 12:43 +08:00 - TL 审批界面组件对齐与信息精简

修改页面或文件：

- `public/screenshots/tl-approval-dashboard.png`
- `src/pages/TlOutboundApprovalPage.tsx`
- `src/types/outboundApproval.ts`
- `src/utils/outboundApproval.ts`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`、`DESIGN_SYSTEM.md`

修改原因：

- 客户指出原 TL 页面误用了裁切的 dashboard 截图，审批卡片没有复用系统 Modal 风格且内容过多；坐席右下角通知也需要与系统 token 对齐。

修改结果：

- 使用客户提供的完整 TL dashboard 截图作为独立静态资源，并以 `object-fit: contain` 完整显示 BANK 1 头部、左侧导航和页面边缘。
- TL 审批浮层改用现有 `BaseModal` 的 `outbound` 变体，仅保留坐席头像/姓名、申请说明、倒计时、无标签的 `Add note (optional)` 输入和 Approve / Reject。
- 原 `rejectionReason` 更名为可同时用于同意和拒绝的 `reviewNote`，坐席 5 秒通知会显示该备注。
- 超时后仅隐藏 TL 审批浮层，不再显示 `Approval Closed` 结果卡；坐席通知继续使用 Ant Design notification，并以项目 token 统一边框、圆角、颜色、字体与阴影。

验证：

- `npm run lint`、`npm run build`、`git diff --check` 已通过；构建仅保留既有 bundle size warning。
- 本地浏览器已确认完整 TL dashboard 截图按比例显示，BANK 1 头部、左侧导航和底部图表均未裁切。受控浏览器无法接管 `window.open` 创建的原生 TL 弹窗，因此 Approve / Reject 的跨窗口最终点击仍建议在演示前手动点验。

回滚说明：

- 移除完整 dashboard 静态资源与 TL 页面/通知的组件样式覆盖，并将审批记录的 `reviewNote` 恢复为旧拒绝原因字段即可。

当前风险：

- 该功能仍是同浏览器前端模拟；真实 TL 审批需要独立的身份、权限、审计和跨设备消息服务。

### 2026-07-22 11:31 +08:00 - 语音转移体验收敛与接收坐席预览

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/store/appStore.ts`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/LeftColumn.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`PROJECT_CONTEXT.md`、`DESIGN_SYSTEM.md`、`DECISION_LOG.md`

修改原因：

- 客户确认转号码无需展示接通中的取消态；失败后应保留弹框以便再次转移。同时需避免转移提示覆盖话务条，并用最小视觉反馈说明接收坐席收到的是转移来电。

修改结果：

- 转坐席表 Actions 列固定为 248px，并收紧单元格内边距；SPV / TL 标识列扩至 52px，三个按钮保持 4px 间距且最长组合无大块空白、不遮挡标识。
- 转技能、转 IVR、转号码和三方接入结果统一改为英文页头下方提示，四秒自动消失；三方禁用转移仅保留英文原生 title。
- 已审批转号码立即完成；号码以 `000` 结尾时确定性模拟失败，保留号码、审批结果和弹框以支持重试。
- 新增仅本地可见的 `Channel Simulation > Transferred Call`。它创建带来源坐席信息的新 PSTN interaction，并在渠道时长后展示带间距、垂直居中的绿色弧形转移箭头；不新增共享可编辑弹屏，不改变原坐席 ACW/CWU，也不占用 KBV 空间。
- 转号码页签明确将输入、审批和 Transfer 控件统一为 30px 高；审批和 Transfer 按钮分别收紧为 104px、76px，避免沿用外呼审批的宽按钮样式。

验证：

- `npx tsc --noEmit`、`npm run lint`、`npm run build`、`git diff --check` 已通过；构建仅保留既有 bundle size warning。
- 浏览器烟测已确认 `Transferred Call` 预览、来源坐席标记、完整的转坐席 Actions 按钮、咨询状态，以及三方通话中禁用 Transfer 的英文原生 title。外部号码的跨窗口 TL 审批回传仍保留为演示前人工点验项。
- 本地 `local` profile 保留 `Transferred Call` 用于演示预览；`VITE_APP_VISIBILITY_PROFILE=customer npm run build` 已通过，客户发布配置会过滤该菜单入口。

回滚说明：

- 移除转移反馈 state、Transferred Call 菜单和 `transferContext` 字段，并恢复转号码的旧接通模拟即可。

当前风险：

- 转移、接收坐席弹屏、TL 审批与失败条件均为本地前端 Demo 行为，不连接真实电话、IVR、路由或审批后端。

### 2026-07-22 11:09 +08:00 - 外部号码 TL 审批模拟

修改页面或文件：

- `src/types/outboundApproval.ts`
- `src/utils/outboundApproval.ts`
- `src/hooks/useExternalOperationApproval.ts`
- `src/pages/TlOutboundApprovalPage.tsx`
- `src/routes.tsx`
- `src/layouts/components/OutboundCallModal.tsx`
- `src/layouts/components/TransferModal.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`BUSINESS_RULES.md`、`DECISION_LOG.md`

修改原因：

- 客户要求外呼号码、转移外部号码和客户资料卡客户号码均由 TL 审批后才能执行；原客户卡片 3 秒自动通过无法直观展示 TL 审批角色。

修改结果：

- 新增统一审批记录，按操作类型和精确号码单次授权，包含坐席头像/名称、客户 ID、申请时间、固定 2 分钟失效时间、审批状态和可选拒绝原因。
- 坐席点击申请时同步打开独立 TL 模拟窗口；窗口使用 `home-tl.png` 静态底图、顶部模拟提示和右下角审批卡片，提供 Approve、Reject 和可选原因输入。
- 使用同源 `BroadcastChannel` 和 `localStorage` 在 TL 与坐席窗口同步审批；同意后只解锁对应 Call / Transfer / Outbound，执行后消耗授权，关闭原弹框或修改号码会释放授权。
- 同意、拒绝或超时均向坐席右下角显示可手动关闭且 5 秒自动消失的通知；超时自动标记为未通过。浏览器拦截 TL 弹窗时取消申请并提示坐席允许弹窗后重试。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 bundle size warning。
- 本地浏览器烟测确认外呼号码输入后 Call 保持禁用、Request Approval 可用，点击后坐席状态变为 `Requesting...`。受控浏览器未暴露原生 popup 句柄，TL 按钮回传与转移/客户卡完整跨窗口人工点验仍建议在客户演示前执行。

回滚说明：

- 移除 TL 路由、审批类型/同步模块和三个入口的审批钩子，并将 Call Number、Transfer Number、Customer Information 恢复为原直接操作逻辑即可。

当前风险：

- 当前审批仅限同一浏览器的前端 Demo；不含真实 TL 身份、持久审计、并发审批分配、权限控制或跨设备消息服务。

### 2026-07-22 10:12 +08:00 - 转技能、转号码与转 IVR 转移状态

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 客户确认转技能、转 IVR 应为释放转；转号码应先模拟接通，允许坐席在接通前取消，再完成成功转。另需移除三方禁用转移时突兀的黑底 Tooltip，并修复咨询操作列按钮被截断的问题。

修改结果：

- Transfer Agent 操作列扩展并压缩非关键列，完整显示 Cancel Consult、Transfer、Conference。
- 三方通话中的 Transfer 仅保留英文原生 title `Transfer unavailable during conference`，不再使用黑底 Tooltip。
- Transfer Skill、Transfer IVR 点击后直接关闭弹框、释放当前通话并进入 ACW；分别提示 `已转移至技能：XX`、`已转移至IVR：XX`。
- Transfer Number 点击后在 1.2 秒内显示红色 Cancel Transfer；取消后恢复输入，模拟接通成功后关闭弹框、释放当前通话并提示 `已转移至号码：XX`。

回滚说明：

- 恢复技能、号码、IVR 页签的直接关闭回调，删除号码接通状态和工具栏对应回调即可。

当前风险：

- 接通、转移和接收坐席的新通话流水仍为前端演示，不连接真实电话、IVR 或路由后端。

### 2026-07-22 09:56 +08:00 - 语音转坐席咨询与 ACW 流程

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 客户确认转坐席前需支持咨询、成功转移后当前坐席按普通挂机进入 ACW 并填写自身 CWU；接收坐席对应新的通话流水、CWU 和工单，不与原坐席共享可编辑弹屏。

修改结果：

- 语音 `Transfer Agent` 只显示 Ready 坐席，SPV / TL 排在普通坐席之前。
- 默认仅 Consult 可用；咨询后所选按钮改为红色 Cancel Consult，其他坐席不能再发起咨询，所选坐席才可 Transfer 或 Conference。
- Transfer 复用普通 Hang Up / ACW 流程并提示转移目标；Conference 关闭弹框后禁用话务条 Transfer，并提供“三方通话中不可转移”提示。
- 未新增 Connecting / Consulting 标识、接收坐席弹屏或真实后端转接。Interaction Log 的 End Reason 暂继续使用 Normal，未来是否新增 Transferred 待确认。

回滚说明：

- 移除 TransferModal 的咨询状态回调，并恢复 AgentToolbar 中转移行操作的直接关闭行为即可。

当前风险：

- 接收坐席的新通话流水和弹屏尚未在单坐席 Demo 中具象化，当前只模拟原坐席的结束、ACW 和提示。

### 2026-07-21 20:57 +08:00 - 统一 Not Ready 的 AUX 入口

修改页面或文件：

- `src/layouts/components/AgentProfileArea.tsx`
- `src/layouts/BasicLayout.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 手动切换到 Not Ready 与话后整理自动进入 Not Ready 属于同一不可接听状态，不应因进入路径不同而出现不同的 AUX 入口。

修改结果：

- 所有 Not Ready 状态均在 Ready 下方展示现有 Busy Reason 的 AUX 原因。
- 手动 Not Ready 选择 AUX 后进入现有 AUX 状态；ACW 中选择 AUX 仍会取消自动回 Ready 计时并保留 CRM 编辑上下文。
- Pre-AUX、通话中预置 AUX 与 Sign Out 守卫保持不变。

回滚说明：

- 恢复 Not Ready 菜单对 After Call Work 的条件判断，并重新传入 `isAfterCallWork` 即可回退。

当前风险：

- Busy Reason 仍为前端 mock 配置，刷新页面会恢复其默认启用状态。

### 2026-07-21 20:44 +08:00 - 语音/视频历史弹屏与 ACW-AUX CRM 编辑流程

修改页面或文件：

- `src/mock/globalControlConfiguration.ts`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 客户确认语音/视频新进线只保留最新弹屏与 CRM 连接；座席需能在话后整理期间转 AUX，延长历史 CRM 编辑时间。

修改结果：

- Global Control 的 Auto Cancel ACW mock 默认值调整为 10 秒，实际 ACW 倒计时读取挂断时已保存的配置值。
- ACW 的 Not Ready 下拉菜单在 Ready 下方展示现有 Busy Reason 的 AUX 原因；选择后取消 ACW 倒计时，已结束通话 Tab 保留至座席回 Ready 或下一次语音/视频进线。
- 新 PSTN、BankApp Voice 或 BankApp Video 会话创建时，自动清理所有已结束的语音/视频 Tab；其嵌入式 CRM 随 Tab 卸载，仅最新会话保留 CRM 编辑入口。
- Live Chat、频道模拟和管理页 Tab 未受此清理逻辑影响。

回滚说明：

- 恢复 Global Control 默认 5 秒、固定 ACW 计时、ACW Not Ready 菜单，以及 `createCallInteraction` 对已结束 interaction 的保留逻辑即可回退。

当前风险：

- CRM 仍为前端嵌入式 Demo；Tab 关闭即代表 CRM 连接断开，未模拟真实 CRM SSO 或未保存编辑提示。

### 2026-07-21 19:17 +08:00 - Working Time Plans 移除 ID 字段

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`

修改原因：

- 用户要求在 Working Time Plans 配置中去掉 ID 字段。

修改结果：

- 查询、列表、Add / Edit / View 弹窗和关联预览均不再展示 Plan ID。
- 新增方案由前端自动生成不冲突的内部 `planCode`，编辑、删除和 Skill Queue 关联继续以该内部键稳定工作。

验证：

- `npm run lint` 和 `npm run build` 通过；构建仅有既有 large chunk warning。
- 浏览器冒烟确认查询、列表和 Add 弹窗均不再展示 Plan ID。

回滚说明：

- 恢复 Plan ID 的页面字段、关键词范围、列表列及原有手动编码校验即可回滚。

当前风险：

- `planCode` 仍为前端本地数据键；刷新页面会恢复 mock 数据与既有方案关联。

### 2026-07-21 19:09 +08:00 - 移除话务条 Mute 控件

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/types/agent.ts`
- `src/components/StatusBadge.tsx`
- `src/pages/DesignSystem.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 客户确认坐席话务条不需要 Mute 操作。

修改结果：

- 移除 Mute 按钮、Mute 通话状态、计时和切换逻辑。
- 话务条在通话中仅保留 Hold、Transfer 和 Hang Up；Answer 与 Ready / Not Ready 行为不变。
- 设计系统示例和当前业务、验收规则同步移除 Mute。

回滚说明：

- 如需重新提供静音能力，恢复 `CallStatus`、计时状态、话务条按钮及对应业务规则后再验证通话状态转换。

当前风险：

- 当前 Demo 不模拟静音；真实话务平台若需要静音，应由后续接口能力和坐席权限重新定义。

### 2026-07-21 17:12 +08:00 - Customer 生产发布

发布提交：

- `3c1f937 feat: deliver agent status and workspace updates`

发布命令与环境：

- `vercel --prod --yes --scope wl-demo-s-projects --build-env VITE_APP_VISIBILITY_PROFILE=customer --build-env VITE_ENABLE_ADMIN_MENUS=true`
- `VITE_APP_VISIBILITY_PROFILE=customer`
- `VITE_ENABLE_ADMIN_MENUS=true`

发布结果：

- Production URL: `https://netinfo-aicc-demo-v2.vercel.app`
- Inspect URL: `https://vercel.com/wl-demo-s-projects/netinfo-aicc-demo-v2/B7nzhmxZigGR4qH9gpTdx8zD4odi`
- Vercel 生产构建通过；仅保留既有 bundle size warning。
- 已在生产地址使用演示账号登录并确认工作台可加载。Email 已在发布前从 Channel Simulation 菜单定义和点击处理移除，当前客户环境无 Email 工作台入口。

回滚说明：

- 如需回滚本次发布，在 Vercel 将生产 alias 指回上一稳定部署，或将 `main` 回退到前一已验证提交后重新部署。

当前风险：

- Email 页面实现仍在源码中但暂未开放；恢复入口前需完成其余功能并重新完成客户验收。

### 2026-07-21 17:05 +08:00 - 暂停 Email 渠道入口

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `PROJECT_CONTEXT.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 产品经理确认 Email 渠道尚未完成，当前客户演示不能开放该入口。

修改结果：

- 从 Channel Simulation 菜单和其点击处理移除 Email，客户无法打开 Email 工作台。
- Email 页面、mock、类型和工作台状态暂时保留在代码库，完成后恢复菜单入口即可继续开发和验证。
- 知识库明确标记 Email 为暂时隐藏且未开放的范围。

回滚说明：

- Email 工作台完成并验收后，恢复 `customer-email` 菜单项及对应 `requestEmailWorkspace` 点击处理。

当前风险：

- Email 仍是未完成的前端 Demo，不应通过隐藏状态、直接 store 调用或后续新增入口绕过验收后再向客户开放。

### 2026-07-21 16:43 +08:00 - 转号码页签移除三方操作

修改页面或文件：

- `src/layouts/components/TransferModal.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 用户要求在话务条转移弹框的 `Transfer Number` 页签中移除三方操作。

修改结果：

- `Transfer Number` 仅保留号码输入和 `Transfer` 按钮。
- 同步收窄该页签的表单栅格，避免删除按钮后留下空白操作位。
- 坐席、技能及会话转移场景的现有 Consult / Transfer / Conference 规则不变。

回滚说明：

- 在 `TransferNumberTab` 恢复 `Conference` 按钮，并将表单栅格恢复为三列即可。

当前风险：

- 转移操作仍为前端演示，点击按钮只关闭弹框，不发送真实转移或会议请求。

### 2026-07-21 14:04 +08:00 - Interaction Log 第三方 QM 窗口预览优化

修改页面或文件：

- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 客户确认 QM 详情应呈现为第三方系统自己的窗口，不能叠加 BANK 1 标题栏或第二个关闭按钮；第三方顶栏中的其他功能仅作静态演示。

修改结果：

- 预览外层移除标题、默认关闭 X 和底部区域，窗口按原图 `1695:1297` 比例在视口中完整等比展示。
- 原图完整保留；下载、收藏、编辑、设置等第三方顶栏图标不模拟交互。
- 原图右上角 X 对应透明热区关闭预览；遮罩和 Esc 不会关闭窗口。

回滚说明：

- 如需恢复 BANK 1 标准弹框，移除关闭热区并恢复 QM 预览的标题、默认关闭按钮和滚动样式。

当前风险：

- 此交互仅用于静态 Demo。未来统一登录接入后必须替换为真实第三方页面和其原生工具栏行为。

### 2026-07-21 10:33 +08:00 - Interaction Log 第三方 QM 详情预览

修改页面或文件：

- `public/screenshots/interaction-log/qm-detail.png`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 质检由第三方公司执行。客户确认有分数的 `QM Score` 需要可进入第三方质检详情查看，并确认使用对方提供的原始详情截图作为 Demo 预览。

修改结果：

- 原始第三方详情图复制到 Interaction Log 静态资源目录，保留原图内容和水印。
- 有数值的 `QM Score` 显示为蓝色可点击文本；空分数显示 `-` 且不提供交互。
- 点击数值分数打开 `QM Detail - {Record No.}` 图片弹框；弹框不提供底部按钮，使用右上角 X 关闭，遮罩点击不会误关。
- 当前仅展示静态预览，不模拟第三方的播放、搜索、申诉或确认等操作；未来统一登录对接后替换为真实第三方详情页。

回滚说明：

- 如需回滚，移除 QM Score 点击状态、预览弹框和相关样式，并删除 `public/screenshots/interaction-log/qm-detail.png`。

当前风险：

- 原图包含第三方界面水印和 BCA POC 标识，已按用户确认原样用于 Demo；正式第三方对接时需改为统一登录后的真实详情跳转。

### 2026-07-21 10:26 +08:00 - Busy Reason 移除默认配置

修改页面或文件：

- `src/pages/call-management/BusyReasonManagementPage.tsx`
- `src/types/busyReason.ts`
- `src/mock/busyReasons.ts`
- `src/store/callManagementStore.ts`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`

修改原因：

- 用户要求在 Busy Reason 管理中移除默认配置，覆盖查询条件、列表和编辑框。

修改结果：

- 移除 Default 查询条件、列表列和编辑开关。
- 删除 Busy Reason 的 `isDefault` 数据字段及保存时的唯一默认原因约束。
- 保留 Keyword、Status、原因名称、状态和备注的现有维护能力。

验证：

- `npm run lint` 和 `npm run build` 通过；构建仅有既有 large chunk warning。
- 浏览器冒烟确认查询栏、表格和 Edit Busy Reason 弹窗均不再展示 Default 配置。

回滚说明：

- 恢复 Busy Reason 的 `isDefault` 类型、mock 字段、store 归一化逻辑和管理页控件即可回滚。

当前风险：

- Busy Reason 仍为前端本地 mock 状态，刷新页面会恢复默认列表。

### 2026-07-18 12:19 +08:00 - Email 渠道可交互工作台

修改页面或文件：

- `src/pages/email/*`
- `src/mock/email.ts`
- `src/types/email.ts`
- `src/types/inbound.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/store/appStore.ts`
- `src/styles/index.less`
- 项目知识库文档

修改原因：

- 用户要求在 Channel Simulation 的 WhatsApp 下方新增 Email 入口，并通过可关闭的 Email 页签演示邮件渠道接入后的坐席交互。
- 参考设计图包含旧版完整应用壳、固定分辨率和旧品牌内容，直接裁剪做热区会产生双层导航、缩放模糊和点击坐标风险，因此改为按当前 BANK 1 设计系统代码化重建。

修改结果：

- 新增可打开、复用、关闭并回退 Home 的 Email 工作台页签。
- 实现 Inbox、Sent、Drafts、Trash、搜索、选择、已读、SLA、线程记录和匿名 mock 数据。
- 实现 Reply / Forward 编辑器、内置模板、Save Draft、Edit Draft、Send、Ignore 原因和 Trash Recover 的本地状态联动。
- 实现复用客户上下文卡片、BANK 1-safe 代码化 CRM、CWU Business Type / Summary / One-Click Generation / Confirm。
- Email 不展示未确认的验证入口；Email Record Inquiry 和 Email Template Deploy 保留为独立后续范围。
- 未复制邮件设计图到 `public`，新增客户可见内容使用 BANK 1 和匿名数据。

验证：

- `npm run lint`、`npx tsc --noEmit --pretty false`、`npm run build` 通过；构建仅有既有 large chunk warning。
- `git diff --check` 通过，仅有既有 Windows LF / CRLF warning。
- 浏览器验证通过：菜单位置、页签打开/复用/关闭、Reply/Send、Draft、Ignore、Recover、CRM、CWU 和关闭重开后的状态重置。
- 1366x768、1440x900、1920x1080 的 DOM 布局度量均无浏览器页面横向溢出；1366x768 截图检查无文字重叠。
- 修复 Ant Design Drawer `width` 弃用提示后，浏览器控制台未产生新的 warning/error。

回滚说明：

- 删除 `src/pages/email/*`、`src/mock/email.ts`、`src/types/email.ts`，移除 Email 菜单/页签/appStore 状态、`AccessChannel` 的 Email 值和 Email 专用样式，再恢复本次知识库记录即可回滚。

当前风险：

- 当前仅为前端本地 mock，不连接真实邮箱、SMTP、附件、路由、权限、审计、模板、邮件记录查询或 CWU 后端。
- Email 验证规则、正式 SLA 阈值、Ignore 后端语义、邮件模板和记录查询仍需产品/客户后续确认。

### 2026-07-16 17:16 +08:00 - Live Chat 客户列表隐藏渠道过滤并合并收起操作

修改页面或文件：

- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 当前 Live Chat 仅有 WhatsApp、BankApp、Webchat 三个渠道，且坐席通常同时处理的会话数量较少，渠道过滤入口会增加操作负担。
- 用户要求将收起 / 展开按钮放到排序按钮旁边，保持列表控制集中。

修改结果：

- Live Chat 客户列表隐藏渠道过滤组件，Current / History 直接展示三种渠道的会话。
- 排序与收起 / 展开按钮合并到 Current / History 行右侧；列表收起后仍保留排序和展开入口。
- 同步项目上下文、当前状态、待办、设计系统和开发日志。

验证：

- `npm run lint`、`npm run build`、`npx tsc --noEmit --pretty false` 已通过。
- `git diff --check` 已通过；仅有既有 Windows LF / CRLF warning。
- 本地开发服务返回 HTTP 200；浏览器冒烟检查因浏览器插件运行时的 `process` 初始化冲突未能执行。

回滚说明：

- 恢复 `LiveChat2Page` 和 `LiveChat2CustomerPanel` 的渠道筛选状态、组件入口及原有样式即可回滚；同步恢复项目文档中的渠道过滤说明。

当前风险：

- 渠道筛选交互暂时不再对坐席可见；如未来渠道数量或并行会话数量增加，需要重新评估是否恢复该入口。

### 2026-07-14 09:48 +08:00 - 生产发布流程保护规则

修改页面或文件：

- `AGENTS.md`
- `DEV_LOG.md`

修改原因：

- 生产发布应默认走提交后的正式发布流程，避免 Vercel 生产环境发布了本地未提交快照，但 Git 仓库没有对应 commit 的情况。
- 用户明确要求把该规则写入项目文件，保证后续 Codex 升级、重装或新会话后仍按同一发布纪律执行。

修改结果：

- `AGENTS.md` 新增 `Production Deployment Rules`。
- 规则明确：生产发布默认流程为检查 Git 状态、验证、commit、push，再部署已提交版本。
- 规则明确：如果发布前存在未提交或未跟踪文件，必须先停止并询问用户是先 commit/push、仍然发布 dirty workspace，还是取消发布。
- 规则明确：不能把 `use current workspace` 之类的计划假设解释为跳过 commit / push 的授权。
- 规则保留 customer profile 发布要求，避免 `Employee Management` 和 `Design System` 进入客户生产环境。

回滚说明：

- 如需调整发布流程，可修改 `AGENTS.md` 第 17 节；不涉及运行时代码回滚。

当前风险：

- 当前工作区仍存在此前已发布但未提交的功能改动，需要后续单独整理 commit / push，使 Git 与生产环境重新一致。

### 2026-07-10 16:25 +08:00 - Vercel 生产发布 customer profile

修改页面或文件：

- `.gitignore`
- `.vercel/project.json`（本地生成，已被 `.gitignore` 忽略）
- `CURRENT_STATUS.md`
- `DEV_LOG.md`

修改原因：

- 用户要求将当前工作区发布到现有 Vercel 生产项目，并确保发布版隐藏 `Employee Management` 和 `Design System`。

修改结果：

- 通过 `vercel link --yes --project netinfo-aicc-demo-v2 --scope wl-demo-s-projects` 链接现有 Vercel 项目。
- 通过 `vercel --prod --yes --scope wl-demo-s-projects --build-env VITE_APP_VISIBILITY_PROFILE=customer --build-env VITE_ENABLE_ADMIN_MENUS=true` 完成生产发布。
- 生产 URL 已 alias 到 `https://netinfo-aicc-demo-v2.vercel.app`。
- Vercel inspect URL: `https://vercel.com/wl-demo-s-projects/netinfo-aicc-demo-v2/2Nh4VRRBcG9t4A7N9YqfGhdT95qP`。
- 发布前 `npm run lint`、`npm run build` 通过；build 仍只有既有 large chunk warning。
- 发布后 smoke 通过：生产菜单显示 `AI`、`Call Management`、`Routing Config`；隐藏 `Employee Management`、`Design System`；`/employee-management/employee-profiles` 和 `/design-system` 均回到 `/`；`AI > Quality Manage` 和 `AI > AI Assist Config` 外链参数正确；`Call Management > Blacklist` 可打开 workspace tab。

回滚说明：

- 如需回滚线上版本，可在 Vercel 控制台或 CLI 中将 production alias 切回上一版 deployment。
- 如需重新发布，保持 `VITE_APP_VISIBILITY_PROFILE=customer`，避免 local-only 菜单进入客户环境。

当前风险：

- `Quality Manage` 和 `AI Assist Config` 仍是示例占位外链；当前只保证新开标签和 URL 参数正确。

### 2026-07-10 16:10 +08:00 - AI 菜单分组和外链子菜单

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 用户确认 `Quality Manage` 应是 `AI` 一级菜单下的二级菜单，不应作为独立顶级菜单。
- 用户要求 `AI` 使用 AI 图标，并在同组下增加 `AI Assist Config` 外链入口。

修改结果：

- 移除顶级 `Quality Manage` 菜单，新增 `AI` 顶级菜单，位置保持在 `Monitoring` 和 `Call Management` 之间。
- `AI` 使用 `RobotOutlined` 图标。
- `AI` 下新增两个二级外链菜单：`Quality Manage` 打开 `https://www.QualityManage.example/`，`AI Assist Config` 打开 `https://www.AIAssistConfig.example/`。
- 子菜单外链复用现有 `window.open(..., '_blank', 'noopener,noreferrer')` 行为，不创建路由或 workspace tab，不改变当前工作台 URL。
- 知识库同步记录 AI 外链分组的当前事实。

回滚说明：

- 如需回滚，可移除 `aiMenuChildren`、`AI` side menu item、`RobotOutlined` import 和 child-level external URL 处理，并恢复顶级 `Quality Manage` 外链菜单。

当前风险：

- 两个外链地址都是示例占位域名，当前只验证点击参数和新开标签行为，不验证目标站点可访问性。

### 2026-07-10 15:37 +08:00 - Workspace Tab 去图标与 Quality Manage 外链入口

修改页面或文件：

- `src/pages/AgentWorkspace.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/config/workspacePageTabs.tsx`
- `src/pages/call-management/*ManagementPage.tsx`
- `src/pages/employee-management/EmployeeProfileManagementPage.tsx`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户希望顶部 workspace tab 更简洁，只保留 `Home` 图标，其余 tab 不再显示图标。
- 用户确认管理页命名去掉 `Management`，并将 `Session End Reason Management` 改为 `Abnormal End Reasons`。
- 用户要求在 `Monitoring` 下方新增同级菜单 `Quality Manage`，点击新开浏览器到 `https://www.QualityManage.example/`。

修改结果：

- `WorkspaceTabLabel` 支持无图标渲染；除 Home 外的 Monitor、渠道模拟、Live Chat、通话和管理页 tab 都只显示文本、时长、badge 和关闭按钮。
- Call Management、Employee Management 相关 workspace tab、左侧菜单和 `AdminPage` 标题同步采用短名称：Blacklist、Priority List、Common Phrase、Common Link、Common Number、Sensitive Word、Busy Reason、Abnormal End Reasons、Employee Profile。
- `BasicLayout` 在 `Monitoring` 与 `Call Management` 之间新增 `Quality Manage` 顶级外链菜单，使用 `AuditOutlined`，点击后 `window.open` 新浏览器标签，不创建路由或 workspace tab。
- 知识库同步记录当前菜单命名、外链入口和 workspace tab 图标规则。

回滚说明：

- 如需回滚 tab 图标，恢复 `AgentWorkspace` 中非 Home tab 的 icon 传入和对应 icon imports。
- 如需恢复长名称，将 `workspacePageTabs` labels、各管理页 `AdminPage` title 和文档口径改回 `* Management`。
- 如需移除 Quality Manage，删除 `BasicLayout` 中的 `quality-manage` side menu item、`AuditOutlined` import 和外链处理逻辑。

当前风险：

- `Quality Manage` 是外部占位 URL，当前只负责打开新浏览器标签，不检查目标站点是否可访问。
- 细节弹窗文案如 `Add Session End Reason` / `Edit Session End Reason` 按本次计划暂未同步改名。

### 2026-07-10 15:10 +08:00 - 管理台页面改为工作台 Tab 打开

修改页面或文件：

- `src/config/workspacePageTabs.tsx`
- `src/components/WorkspacePageRouteOpener.tsx`
- `src/store/appStore.ts`
- `src/pages/AgentWorkspace.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `DESIGN_SYSTEM.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户确认管理台页面不应替换整个 `AgentWorkspace`，否则坐席打开配置页后无法切回弹屏、通话或 Live Chat tab。
- 需要让左侧菜单中的管理页面对齐 Monitor 类工作台 tab 行为，同时保留直达 URL 兼容入口和 local-only 可见性规则。

修改结果：

- 新增统一 workspace page tab registry，集中维护菜单 key、tab key、路由、图标、可见性和页面组件。
- `useAppStore` 增加 `workspacePageTabOrder`、`openWorkspacePageTab`、`closeWorkspacePageTab`，用稳定 `page:*` key 防止重复打开。
- `AgentWorkspace` 渲染 Call Management、Routing Config、local-only Employee Management、local-only Design System 页面 tab；tab 可关闭，关闭当前页后回退到相邻 tab 或 Home。
- `BasicLayout` 左侧管理菜单点击改为打开或复用 workspace page tab，并导航回 `/`，不再让管理页长期占满 `Outlet`。
- `routes.tsx` 保留注册管理页 URL：直达 `/call-management/*`、`/routing-config/*`、local-only `/employee-management/*` 和 `/design-system` 时打开对应 tab 后回到 `/`；不可见模块继续按 visibility profile 隐藏和拦截。
- 已运行 `npm run lint`、`npm run build`。本地浏览器冒烟验证通过：管理页 tab 打开/复用/关闭、直达 URL 桥接、PSTN tab 与管理页 tab 共存切换、customer/local visibility profile 行为。

回滚说明：

- 如需回滚，可移除 `workspacePageTabs` registry 和 `WorkspacePageRouteOpener`，恢复 `BasicLayout` 通过路由直接导航管理页，恢复 `routes.tsx` 中管理页直接 element 配置，并删除 store / `AgentWorkspace` 的 `workspacePageTabOrder` 相关状态与渲染。

当前风险：

- 管理页 tab 关闭会卸载页面局部 UI 状态；已保存到 store 的 mock 数据仍保留。后续新增管理页必须注册到 workspace page tab registry，避免重新出现全页替换工作台。

### 2026-07-10 14:53 +08:00 - Interaction Log QM Score 和详情布局统一

修改页面或文件：

- `src/types/callRecord.ts`
- `src/mock/callRecords.ts`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户确认列表评分应显示为 `QM Score`，且字段名也要改为 `qmScore`。
- 用户确认三类详情框采用统一信息架构：右侧为 CWU，中间为对话/转写；只有语音和视频有左侧媒体回放区。

修改结果：

- Interaction Log 列表表头改为 `QM Score`，类型和 mock 数据字段改为 `qmScore`。
- Voice 详情改为左侧媒体栏上方 `Voice Recording Playback`、下方 `Screen Recording Playback`，中间 `Auto Transcript`，右侧 CWU。
- Video 详情改为左侧 `Video Recording Playback`，中间 `Auto Transcript`，右侧 CWU。
- DM 详情保留两栏：左侧 `Conversation`，右侧 CWU，不展示空媒体列。
- 详情面板标题和 CWU 标题统一为同一层级和分隔线样式。

回滚说明：

- 如需回滚，恢复旧评分字段名和旧评分表头，并将 Voice / Video / DM 详情 JSX 与样式还原到本次修改前的分支布局。

当前风险：

- 需浏览器检查 Voice / Video / DM 三种详情在目标演示分辨率下的列宽、滚动高度和 CWU 可读性。

### 2026-07-10 14:08 +08:00 - 当前路由父菜单允许手动收起

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 用户发现打开 `Blacklist Management` 等子页面后，其所属的 `Call Management` 父菜单无法收起；原因是当前路由父菜单在每次渲染时被强制加入展开列表。

修改结果：

- 当前路由进入时仍会自动打开对应父菜单，保留直接访问路由后的菜单定位能力。
- 父菜单展开状态不再在渲染阶段强制覆盖；用户手动点击当前父菜单后可以正常收起。
- 设计系统同步记录“路由进入可自动展开，但当前父菜单可手动收起”的 Shell 交互规则。

回滚说明：

- 如需恢复旧行为，可移除 `routeParentMenuKey` 路由进入 effect，并恢复 `effectiveOpenMenuKeys` 在渲染阶段按当前 route 强制补齐父菜单的逻辑。

当前风险：

- 需浏览器检查直接进入管理页、点击父菜单收起、切换到其他管理页后父菜单自动展开的组合行为。

### 2026-07-10 11:49 +08:00 - Interaction Log Voice 录屏静态帧修正

修改页面或文件：

- `public/screenshots/interaction-log/pstn-active-call-screen.png`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户指出 Voice 详情 `Screen Recording Playback` 的截图截错，应展示 PSTN 正在通话的来电弹屏界面，而不是文字会话坐席截图。

修改结果：

- 使用本地 demo 登录、签入 `Voice + Digital`、触发 PSTN 并等待进入 Talking 状态后截取 1440×826 坐席工作台静态帧。
- Voice `Screen Recording Playback` 改为引用 `public/screenshots/interaction-log/pstn-active-call-screen.png`。
- 知识库同步将 Voice 录屏说明明确为 PSTN active-call agent desktop frame。

回滚说明：

- 如需回滚，可将 `SCREEN_RECORDING_REPLAY_SRC` 恢复为旧截图路径，并删除新增 `public/screenshots/interaction-log/pstn-active-call-screen.png`。

当前风险：

- 仍建议在目标演示分辨率下人工打开 Interaction Log Voice 详情确认录屏图片缩放和三栏比例。

### 2026-07-10 11:21 +08:00 - Interaction Log 数据和 Voice 详情二次调整

修改页面或文件：

- `src/mock/callRecords.ts`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户反馈 Interaction Log 数据偏少，Voice 的 `Screen Recording Playback` 应为坐席屏幕录屏而不是音频条，并要求视频标题从 `Video Replay` 改为 `Video Recording Playback`。

修改结果：

- Interaction Log mock 记录扩充到 30 条，其中 12 条使用当天动态时间，覆盖 Voice / Video / DM / WhatsApp，并包含不同结束人、结束原因、Queue 空值和 QM Score 空值。
- Voice 详情改为三栏：左侧宽屏坐席屏幕录屏画面和播放条，中间语音回放与 Auto Transcript，右侧窄版只读 CWU。
- Screen Recording 使用现有 1440×826 坐席工作台截图资源，不生成新图，不展示客户视频画面。
- Video 详情标题改为 `Video Recording Playback`，继续使用既有 OpenEye 回放图，不新增录屏区。
- 知识库同步记录 30 条数据、Voice 三栏录屏布局和视频标题口径。

回滚说明：

- 如需回滚，删除新增 call records，恢复 Voice 详情为单内容列布局，移除 `SCREEN_RECORDING_REPLAY_SRC` 和 screen replay 样式，并将视频标题改回 `Video Replay`。

当前风险：

- 需浏览器检查 1320px 详情弹框在目标演示分辨率下的三栏比例、录屏截图裁切和 CWU 窄列可读性。

### 2026-07-10 11:13 +08:00 - 左侧菜单滚动范围修复

修改页面或文件：

- `src/styles/index.less`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 菜单项增多后，左侧菜单高度撑开了整体页面，导致浏览器页面滚动；用户确认应仅左侧菜单列表滚动，左侧顶部折叠按钮和菜单搜索固定。

修改结果：

- 认证后的 `BasicLayout` 外壳固定在一屏工作台高度，`aicc-body` 阻止菜单溢出带动页面滚动。
- Sider 子容器改为纵向 flex，高度继承父容器；展开态菜单列表成为独立纵向滚动区。
- 折叠按钮和 `Search menu` 保持在左侧顶部固定区域；收起态 flyout 仍保留可见溢出行为。
- 设计系统同步记录左侧菜单滚动归属规则。

回滚说明：

- 如需回滚，移除 `aicc-app-shell` / `aicc-body` 的视口锁定和展开态 `.aicc-sider__menu` 的内部滚动规则，并恢复 Sider children 为非 flex 布局。

当前风险：

- 需浏览器检查展开多个菜单分组、搜索结果和收起态 flyout，确认滚动归属和弹出菜单不被裁剪。

### 2026-07-10 10:03 +08:00 - Interaction Log 客户标注调整

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/types/callRecord.ts`
- `src/mock/callRecords.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户确认按客户标注将 `Call Record Query` 显示名称改为 `Interaction Log`，默认查询当天，新增列表 `QM Score`，删除 CWU 编辑入口，并为语音记录增加坐席屏幕录屏回放区。

修改结果：

- 左侧菜单、页面标题和详情弹框标题显示 `Interaction Log`；路由仍保持 `/call-management/call-record-query`。
- Date Range 默认值和 Reset 后范围改为当天 `00:00:00 - 23:59:59`。
- 列表新增普通文本 `QM Score`，Actions 只保留 View，Actions 列仍固定右侧，列表横向宽度按新增列重新收紧。
- 语音详情显示 `Voice Recording Playback`、`Screen Recording Playback`、`Auto Transcript`；视频详情继续使用既有 OpenEye 回放图且不新增录屏区；DM 仍使用对话气泡。
- CWU 在详情中只读展示 Ticket No.、Business Type、Summary，不再显示 Edit CWU 弹框入口。
- 知识库同步记录 Interaction Log 当前范围、默认日期、QM Score、语音录屏回放和只读 CWU 规则。

回滚说明：

- 如需恢复旧编辑行为，需要还原 `CallRecordQueryPage` 的编辑 state / handler / modal、Actions 铅笔按钮和对应样式，并把 Date Range 默认值改回最近 7 天。

当前风险：

- 仍需浏览器检查客户标注项的视觉对齐和详情弹框布局，尤其是宽屏下列表横向滚动长度与 Actions 固定列表现。

### 2026-07-09 12:43 +08:00 - Monitoring Home 默认项调整为 Home-Agent

修改页面或文件：

- `src/mock/monitoring.ts`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DEV_LOG.md`

修改原因：

- 用户要求将 `Home-OM` 菜单显示名称改为 `Home-Agent`，放在 `Home-TL` 上方，并作为登录后默认 Home 页签展示内容。

修改结果：

- `Home-Agent` 菜单项现在位于 Monitoring 子菜单 Home 组最前面。
- 默认 Home 页签展示 `Home-Agent` 对应截图。
- 内部图片文件和 view key 保持 `home-om`，避免不必要的资产重命名；客户可见文案已改为 `Home-Agent`。
- 相关项目事实文档和手工验收项已同步更新。

回滚说明：

- 如需回滚，将 `defaultMonitoringHomeViewKey` 改回 `home-tl`，并把 `home-om` 的 label / alt 改回 `Home-OM`。

当前风险：

- 需浏览器检查 Monitoring 子菜单顺序和默认 Home 截图。

### 2026-07-09 11:48 +08:00 - 删除左侧占位菜单

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `DEV_LOG.md`

修改原因：

- 用户确认 `Agent Center`、`Operations`、`Reports` 是早期左侧空菜单时放置的示意菜单；现在已有实际业务菜单，应直接删除，不做隐藏保留。

修改结果：

- 左侧菜单移除 `Agent Center`、`Operations`、`Reports` 三个占位入口。
- 未修改登录权限、路由守卫、真实业务模块或 Monitoring 菜单。

回滚说明：

- 如需恢复，可在 `allSideMenuItems` 中重新加入对应占位菜单对象并恢复相关 icon import。

当前风险：

- 需浏览器检查左侧菜单展开态和收起态没有残留占位入口。

### 2026-07-09 11:24 +08:00 - 新增 Monitoring 静态截图页签

修改页面或文件：

- `src/mock/monitoring.ts`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/styles/index.less`
- `public/screenshots/monitoring/*`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DEV_LOG.md`

修改原因：

- 客户提供 Home / Monitor 相关 UI 图，希望放入现有 demo 中展示。
- 用户确认这些图作为静态截图 demo，不新增 TL / SPV / OM 真实角色权限或监控交互。

修改结果：

- 从客户原图裁剪生成 `Home-TL`、`Home-SPV`、`Home-OM`、`Monitor-TL`、`Monitor-OM` 五张内容图。
- 左侧菜单新增与 `Channel Simulation` 平级的 `Monitoring` 模块。
- `Monitoring > Home-*` 会切回固定 Home 页签并替换截图。
- `Monitoring > Monitor-*` 会打开或复用可关闭的 Monitor 页签并替换截图。
- Home 图中的渠道 tab 和 Monitor-TL 图中的 Prompt 弹框按用户确认保留为截图主体内容。
- 相关项目事实文档和手工验收项已同步更新。

回滚说明：

- 如需回滚，删除 `public/screenshots/monitoring/`、`src/mock/monitoring.ts`，移除 store 中 Monitoring 状态/action、BasicLayout Monitoring 菜单、AgentWorkspace Monitor 页签/截图渲染和本次样式/文档记录即可。

当前风险：

- 需浏览器检查不同菜单项切换、Monitor 页签关闭后重开、长图滚动和 5 张裁剪图在 demo 分辨率下的清晰度。

### 2026-07-08 11:30 +08:00 - Routing Config Skill Queues 增加 Access Code

修改页面或文件：

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 用户要求在 Routing Config > Skill Queues 中，在 VDN 后增加必填字段 `Access Code`。

修改结果：

- `SkillQueue` 数据模型增加 `accessCode`。
- Skill Queues mock 数据为现有技能队列生成示例 Access Code。
- Skill Queues Keyword 查询支持 `Access Code`；不单独提供 `Access Code` 查询项。
- Skill Queues 列表在 `VDN` 后增加 `Access Code` 列。
- Skill Queues Add / Edit / View 表单在 `VDN` 后增加必填 `Access Code` 字段，并加入 required 校验。
- 相关项目事实文档已同步更新。
- `CURRENT_TODO.md` 已补充对应手工验证项。

回滚说明：

- 如需回滚，移除 `SkillQueue.accessCode`、mock 默认值、Skill Queues 页面 Keyword 匹配/列/表单/校验和本次文档记录即可。

当前风险：

- 需浏览器检查 `/routing-config/skill-queues` 的 Keyword 查询、列表、Add / Edit / View 弹框字段顺序和必填校验。

### 2026-07-07 19:20 +08:00 - Call Record Query CWU 编辑框只读工单号

修改页面或文件：

- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户确认 CWU 编辑弹框不需要显示客户名称。
- 用户确认 Ticket No. / 工单编号应为只读，不允许编辑。

修改结果：

- 移除 CWU 编辑弹框顶部客户名称 meta。
- Ticket No. 改为只读展示样式。
- 保存 CWU 时保留原 Ticket No.，只更新 Business Type 和 Summary。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需恢复可编辑工单编号，可把只读展示改回 Input，并恢复保存逻辑读取草稿 ticketNo。

当前风险：

- 当前仍为本地 demo 保存，不连接真实 CWU 工单系统。

### 2026-07-07 19:18 +08:00 - Call Record Query 列表横向宽度收紧

修改页面或文件：

- `src/pages/call-management/CallRecordQueryPage.tsx`
- `DEV_LOG.md`

修改原因：

- 用户指出列表字段空白较多，横向滚动条不应被过大的总宽度拉长。
- 用户确认不是硬去掉横向滚动，而是收紧列宽；内容多展示不下时横向滚动仍正常。
- 用户确认不能影响操作列固定规则。

修改结果：

- `Record No.` 不再固定左侧。
- 多个列表列宽收紧，`horizontalScroll` 从 2252 调整为 1860。
- `Actions` 保持固定右侧。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需恢复原宽度，可将列宽和 `horizontalScroll` 调回此前配置。

当前风险：

- 不同浏览器宽度下仍需人工查看列表横向滚动体感是否合适。

### 2026-07-07 19:12 +08:00 - Call Record Query 使用产品提供的视频回放图

修改页面或文件：

- `public/screenshots/haloapp-v18/openeye-video-replay.png`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户明确要求直接使用产品提供的 `openeye-video-replay.png`，不再由代码裁切、遮罩或生成图片。
- 用户要求右侧小结标题显示为 `CWU`，与左侧 `Video Replay` 标题对齐，标题下使用横线区分内容。
- 用户要求 CWU 下方三个字段之间不要再加横线，业务类型标签不要加粗。

修改结果：

- 从 `D:\03projects\BCA AICC\需求文档\Haloapps\Haloapps截图\脱敏（新）\openeye-video-replay.png` 复制图片到项目 public 资产目录。
- Call Record Query 视频回放直接引用 `/screenshots/haloapp-v18/openeye-video-replay.png`。
- 删除通话记录视频回放区域的 CSS 遮罩和图片位移处理。
- 右侧 summary 面板新增 `CWU` 标题，标题下有分隔线，字段区取消字段间分隔线。
- Business Type 标签改为普通字重。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需回滚，可恢复上一版 `OPEN_EYE_REPLAY_SRC` 路径及 `call-record-query__openeye-replay` 遮罩样式。

当前风险：

- 当前视频回放图片是静态 demo 资产，不连接真实 OpenEye 回放文件。

### 2026-07-07 19:02 +08:00 - Call Record Query 详情视觉纠偏

修改页面或文件：

- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户指出视频截图仍露出顶部通话信息和底部通话按钮，不符合“只保留两个视频画面”的要求。
- 用户指出视频回放底部没有和转写框对齐，整体高度不协调。
- 用户指出右侧 CWU Registration 标题和 24 小时说明不需要，字段字号过大且不符合系统规范。

修改结果：

- 视频回放继续使用 OpenEye 截图资产，但通过遮罩隐藏顶部号码 / 信号 / 时长和底部通话按钮，只保留双视频画面。
- 视频列宽调整为 300px，并让播放器区域填满内容高度，使视频底部与右侧转写框对齐。
- 右侧 CWU 删除标题和 24 小时说明，只保留 Ticket No.、Business Type、Summary 三个字段。
- CWU 字段样式恢复到系统尺度：12px label、14px 内容、细分隔线和 13px 业务类型标签。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需回滚，可恢复 18:54 版本的 OpenEye 截图裁切和 CWU 大字号样式。

当前风险：

- 当前仍为前端视觉模拟，未连接真实 OpenEye 回放文件。

### 2026-07-07 18:54 +08:00 - Call Record Query 视频回放对齐和截图替换

修改页面或文件：

- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户要求详情内容区去掉渠道 / 媒体小字。
- 用户要求 `Video Replay` 和 `Auto Transcript` 作为左右两列标题横向对齐，视频画面和转写内容框也顶部对齐。
- 用户要求视频回放使用附件所示 OpenEye 截图效果，不再使用 CSS 生成的人像画面。

修改结果：

- Video 详情移除上方独立渠道 / 媒体说明，改为左右两列标题与内容对齐。
- Video 回放改为使用 `/screenshots/haloapp-v18/openeye-video-call-optimized.jpg`，通过 CSS 裁切隐藏蓝色标题栏和底部通话按钮，仅展示双视频画面。
- Voice / DM 详情保留主标题，但去掉渠道 / 媒体副标题。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需回滚，可恢复 `call-record-query__openeye-pane` CSS 生成画面，并恢复内容区顶部渠道 / 媒体副标题。

当前风险：

- 当前回放仍为前端截图裁切模拟，不连接真实 OpenEye 回放文件。

### 2026-07-07 18:44 +08:00 - Call Record Query 媒体回放样式二次调整

修改页面或文件：

- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户确认语音详情不需要波形区域，只保留播放/暂停、进度条和时长。
- 用户确认视频详情应使用 OpenEye 风格竖向回放画面，但只展示两个视频画面，不展示通话按钮、文字或图标。
- 用户要求去掉 `Generated from service recording` 说明文字。
- 用户要求 CWU Registration 保持 Ticket No.、Business Type、Summary 三个字段，并强化标题与内容层级。

修改结果：

- Voice 详情移除波形块，仅保留紧凑播放控制条和转写内容。
- Video 详情改为左侧 OpenEye 风格竖向双画面回放、右侧转写内容的左右布局，回放底部保留播放控制条。
- 转写标题只保留 `Auto Transcript`。
- CWU Registration 字段标题、字段值和业务类型标签字号/间距调整为更清晰的层级。
- 知识库中 Call Record Query 视频回放口径从“中性回放”更新为“OpenEye 风格竖屏双画面回放”。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需恢复上一版，可重新加入 `call-record-query__audio-waveform` 语音波形结构，并把视频回放布局改回单列中性画面。

当前风险：

- 当前视频回放仍是前端视觉模拟，不连接真实 OpenEye 回放或媒体文件。

### 2026-07-07 18:31 +08:00 - Call Record Query 详情页和 CWU 展示调整

修改页面或文件：

- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/types/callRecord.ts`
- `src/mock/callRecords.ts`
- `src/store/callManagementStore.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户确认列表需要补 `Queue`，无队列值显示 `-`。
- 用户确认列表时间改为 `Service Time`，展示开始时间和结束时间。
- 用户确认详情页暂不加入 CRM 或客户详情卡片。
- 用户确认视频回放不能套用 OpenEye 蓝色画面，语音/视频只需要最简单的播放、暂停、进度和时长效果。
- 用户确认右侧小结按 CWU Registration 设计，只保留 Ticket No.、Business Type 多选和 Summary。

修改结果：

- Call Record Query 列表新增 `Queue`，并将时间列调整为 `Service Time`。
- 详情左侧改为媒体内容区：语音显示音频波形和播放条，视频显示中性黑灰回放画面和播放条，DM / 转写内容使用聊天气泡展示。
- 详情右侧移除客户/服务信息宫格，仅展示 CWU Registration。
- CWU 编辑弹框改为 Ticket No.、Business Type 多选、Summary 描述，并在本地保存到 mock store。
- mock 数据新增 CWU summary 结构，并保留一个空 Queue 样例用于展示 `-`。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- `http://127.0.0.1:5174/call-management/call-record-query` 返回 200。
- in-app Browser 插件两次连接超时，未完成浏览器截图烟测。

回滚说明：

- 如需恢复旧详情，需要还原 `CallRecordQueryPage` 的服务信息宫格、旧票据小结字段和对应样式，并把 `CallRecordSummary` 改回旧字段。

当前风险：

- 当前语音/视频仍为前端 demo 播放控件，不连接真实录音、视频文件或媒体服务。

### 2026-07-07 18:02 +08:00 - Call Record Query 小结字段和结束人筛选收敛

修改页面或文件：

- `src/types/callRecord.ts`
- `src/mock/callRecords.ts`
- `src/store/callManagementStore.ts`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 用户确认查询条件需要在 End Reason 前增加 `Ended By`。
- 用户确认列表中的 `Ended By` 和 `End Reason` 使用普通文字，不用状态标签。
- 用户确认通话小结默认必填，不需要 Summary Status 和 Summary Time。
- 用户确认员工 ID 不需要 `EMP-` 前缀。

修改结果：

- Call Record Query 查询条件新增 `Ended By`。
- 列表移除 Summary Status 和 Summary Time，`Ended By` / `End Reason` 改为普通文本列。
- 详情弹框和编辑弹框去掉小结状态、提交时间、最近提交时间展示。
- `CallRecord` 类型和 mock 删除 `summaryStatus`、`summarySubmittedAt` 字段。
- 保存通话小结时只更新 summary 内容，不再写小结状态或时间。
- 通话记录 mock 的 Agent ID 从 `EMP-10027` 改为 `10027`。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- 静态搜索确认 `CallRecordQueryPage`、`callRecords` mock、`callRecord` 类型和 call management store 中不再包含 `summaryStatus`、`summarySubmittedAt`、`CallRecordSummaryStatus` 或 `EMP-`。

回滚说明：

- 如需恢复小结状态，需重新在 `CallRecord` 类型、mock、store 和页面筛选/列表/详情中加入 `summaryStatus` 和 `summarySubmittedAt`。

当前风险：

- 当前仍为前端 demo 规则；真实后台如果强制返回小结提交状态，需要后续映射但不建议直接暴露到当前列表。

### 2026-07-07 17:49 +08:00 - Call Record Query 接入 Ended By / Contact 字段口径

修改页面或文件：

- `src/types/callRecord.ts`
- `src/mock/callRecords.ts`
- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/store/appStore.ts`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户确认 `Counterparty` 对客服记录不够准确，应改为客户侧联系标识。
- 用户确认客户侧正常结束不需要按渠道区分 hang up / ended session，列表已有 Channel / Media 字段。
- 用户确认结束生命周期应拆成 `Ended By` 和 `End Reason`，系统异常断联也应作为 System ended 的具体原因，而不是混入客户超时。

修改结果：

- Call Record Query 类型和 mock 将 `counterparty` 改为 `contact`，新增 `endedBy`。
- 列表和详情展示 `Contact`、`Ended By`、`End Reason`。
- `End Reason` 从旧的 `Completed / Transferred / Customer Ended` 改为 `Normal`、坐席异常原因和系统原因。
- Phone / WhatsApp 的 Contact 使用号码，BankApp 和登录 Webchat 使用 BankID，Guest Webchat 使用 `guest-7118` 这类访客 ID。
- 客户正常结束和坐席正常结束都使用 `End Reason = Normal`；系统超时使用 `Customer Timeout`，系统异常可用 `Connection Lost`、`System Error`、`Channel Gateway Error`。
- Live Chat 本地结束状态同步补齐客户正常结束和系统超时的 `endReasonName`，便于后续记录查询或真实数据接入复用。
- 修复 Call Record Query 详情弹框只读 View 误依赖编辑草稿状态，以及未定义 `canEditSelectedRecord` 的回归。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- 本地 dev server 使用 `http://127.0.0.1:5174/`。
- HTTP 检查 `/call-management/call-record-query` 返回 200。
- 静态源码检查确认页面包含 `Contact` / `Ended By`，且通话记录页面和 mock 不再包含旧 `Counterparty` / `counterparty` 字段。
- Codex in-app Browser 连接超时，未完成可视化点击烟测；需在浏览器中手工确认页面视觉和弹框交互。

回滚说明：

- 如需回滚本次字段口径，恢复 `CallRecord` 的 `counterparty` 字段、旧 `CallRecordEndReason` 枚举和页面列定义，并撤回 `appStore` 中客户/系统结束的 `endReasonName` 补齐。

当前风险：

- 仍为前端 mock 记录；真实系统需后续明确后台记录表的 `endedBy`、`endReason`、`contact` 字段来源。

### 2026-07-07 17:35 +08:00 - Session End Reason 媒体标签样式和 Video 口径澄清

修改页面或文件：

- `src/pages/call-management/SessionEndReasonManagementPage.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`
- `PROJECT_CONTEXT.md`
- `CURRENT_TODO.md`
- `DECISION_LOG.md`

修改原因：

- 用户反馈 Session End Reason Management 的 Applicable Media 标签在表格里挨得太近并出现视觉重叠。
- 用户指出客户附件只明确写了 Voice Calls 和 Digital Channels，没有单独写 Video，需要澄清当前 demo 保留 Video 的依据。

修改结果：

- Applicable Media 从 Ant Design `Tag` 改为本页专用 inline-flex 标签，固定高度、内边距和间距，避免表格中重叠。
- 文档澄清：Video 当前作为同步通话对 Voice 的 demo 扩展保留，不是客户附件单独明示项；后续需要客户确认是否保留。

验证：

- 待本次小修后运行 lint/build。

回滚说明：

- 如客户确认 Video 不需要，移除默认异常原因中的 `Video` 适用媒体，并调整文档中 Video 扩展说明。

### 2026-07-07 17:22 +08:00 - 新增 Session End Reason Management 和坐席侧异常结束原因

修改页面或文件：

- `src/types/sessionEndReason.ts`
- `src/mock/sessionEndReasons.ts`
- `src/store/callManagementStore.ts`
- `src/store/appStore.ts`
- `src/pages/call-management/SessionEndReasonManagementPage.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/pages/inbound/components/LiveChat2CustomerPanel.tsx`
- `src/routes.tsx`
- `src/pages/call-management/index.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户确认坐席侧 Hang Up / End Service 需要支持选择异常结束原因，Voice / Video / DM 纳入当前范围，Social Media / Non-DM 暂不做。
- 正常结束继续走原主按钮行为；文字 End Service 正常结束保留二次确认，异常原因从小三角选择后直接结束。

修改结果：

- 新增 `SessionEndMediaType`、`SessionEndReasonEntry`、`ServiceEndedBy` 等类型和默认异常原因 mock。
- 新增 `/call-management/session-end-reasons` 页面，菜单位于 Busy Reason Management 后、Call Record Query 前，支持 Keyword / Applicable Media / Status 查询，以及 Add / Edit / Delete。
- AgentToolbar 的 Hang Up 改为 split button：主按钮正常挂机，小三角展示当前 Voice / Video 可用 Active 异常原因并直接挂机。
- Live Chat 2 的 End Service 改为 split button：主按钮保留确认弹框，小三角展示 DM 可用 Active 异常原因并直接结束进入 History。
- `useAppStore` 记录坐席结束元数据：正常结束 `endReasonName = Normal`，异常结束记录所选原因；客户结束和系统超时记录 `endedBy` 来源。
- Call Record Query 本次未接入新 endedBy / endReasonName 字段，按用户计划等待当前 WIP 稳定后单独处理。后续已在 2026-07-07 17:49 记录中完成接入。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- 本地 dev server 使用 `http://127.0.0.1:5174/`；5173 当时已有服务占用。
- Codex in-app Browser 连接超时，改用本机 Chrome + Playwright 脚本完成 smoke。
- Smoke 覆盖：Session End Reason Management 路由、默认数据、新增；PSTN 通话 Hang Up 异常原因菜单；Live Chat End Service 正常确认弹框和异常原因菜单。

回滚说明：

- 如需回滚，移除 `SessionEndReasonManagementPage`、`sessionEndReasons` mock/type、call management store 中的 session end reason state/actions、路由/菜单项、AgentToolbar 与 LiveChat2 split button 改动，并恢复 `markCallInteractionEnded` / `endLiveChat2Session` 的旧签名。

当前风险：

- 结束原因是前端 demo 本地状态，刷新后恢复默认 mock。
- Call Record Query 后续还需单独接入 `endedBy` 和具体 `endReasonName`，详情页布局不应被本次规则影响。后续已在 2026-07-07 17:49 记录中完成接入。

### 2026-07-07 16:53 +08:00 - Call Record Query 字段口径和管理台控件对齐

修改页面或文件：

- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/types/callRecord.ts`
- `src/mock/callRecords.ts`
- `src/store/callManagementStore.ts`
- `src/styles/index.less`
- `DESIGN_SYSTEM.md`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户指出 Call Record Query 的 Keyword / Date Range 控件对齐、媒体类型、状态字段、小结字段、列表字段拆分、媒体图标和 View/Edit Summary 交互不符合已确认规范或不够清晰。

修改结果：

- 管理台查询控件统一样式补齐 Input、Select、RangePicker 的 32px 高度和垂直居中规则。
- Call Record Query 媒体类型显示从 `Text` 调整为 `DM`，与 Routing Config 已确认展示口径一致。
- `Service Status` 调整为 `End Reason`，用于表达本次服务结束原因。
- 小结口径调整为 `Summary Status`（Submitted / Not Submitted）和 `Summary Time`（首次提交或最后更新时间）。
- 列表去掉 Media 图标，保持管理台表格风格统一。
- Customer / Agent 双行单元格拆分为 Customer Name / Customer ID / Agent Name / Agent ID 独立列。
- View 操作改为只读详情；Edit Summary 改为独立小结编辑弹框。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如需回滚，恢复 `CallRecordQueryPage` 的旧列定义、旧 summary status 字段和旧详情内编辑入口，并移除本次管理台 RangePicker 统一样式补充。

当前风险：

- 仍需在可用浏览器环境手工检查视觉对齐和弹框交互；当前本机浏览器自动化环境此前存在 CDP / in-app Browser 连接限制。

### 2026-07-07 15:57 +08:00 - Call Management 新增 Call Record Query

修改页面或文件：

- `src/pages/call-management/CallRecordQueryPage.tsx`
- `src/mock/callRecords.ts`
- `src/types/callRecord.ts`
- `src/store/callManagementStore.ts`
- `src/routes.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户要求在 Call Management 最下方新增“通话记录查询”，前端菜单显示 `Call Record Query`。
- 本次范围只包含电话、语音、视频、普通文字会话；不包含 Email 和 Social Media。
- 当前 demo 没有权限体系，先按当前坐席视角展示记录。

修改结果：

- 新增 `/call-management/call-record-query` 页面和侧边栏菜单项。
- 新增当前坐席的 Phone、BankApp Voice、BankApp Video、BankApp、Webchat、WhatsApp mock 记录。
- 最近几条 mock 记录按运行时相对时间生成，保证演示时存在 24 小时内可编辑小结的数据。
- 页面支持 Keyword、Channel、Media Type、End Reason、Summary Status、Date Range 查询，默认最近 7 天。
- 列表展示核心服务记录字段，避免引入旧系统截图中的质检、复核、机器人、录音文件名、挂断方等废字段。
- 详情弹框采用左侧服务内容、右侧客户/服务信息和 Ticket Summary 的布局。
- Voice / Video 记录展示 mock 回放和系统转写；DM 记录展示对话记录。
- 24 小时内记录可本地编辑 Ticket Summary，超过 24 小时只读。
- 知识库同步记录 Email流水查询 和 Social Media查询 是独立未来范围，不并入本次 Call Record Query。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- HTTP 检查 `/call-management/call-record-query` 返回 200。
- 静态范围检查确认 `CallRecordQueryPage` 和 `callRecords` mock 未引入 Email / Social Media 数据。
- 浏览器交互烟测未完成：Codex in-app Browser 初始化超时，本机 Chrome / Edge 独立 CDP 会话启动受环境限制。

回滚说明：

- 如需回滚，移除 `CallRecordQueryPage`、`callRecords` mock/type、store 中的 `callRecords` 和 `updateCallRecordSummary`，并删除路由、菜单和样式中的 `call-record-query` 引用。

当前风险：

- 当前仅为前端 mock 数据，不连接真实通话、录音、视频、转写、工单或权限后端。
- 真实权限规则、Email流水查询、Social Media查询需要后续独立设计和实现。
- 仍需在可用浏览器环境手工检查菜单展开、筛选、详情弹框和 24 小时小结编辑交互。

### 2026-07-06 17:15 +08:00 - Routing Config 媒体类型 Text 展示文案改为 DM

修改页面或文件：

- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/pages/call-management/GlobalControlConfigurationPage.tsx`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 用户要求媒体类型四个选项改为 Voice、Video、DM、Non-DM，原 Text 改成 DM，使其与 Non-DM 对照更清晰。

修改结果：

- Routing Config 媒体类型 `Text` 展示名改为 `DM`。
- Channels、Skill Routing Rules、Site Access Volume、Media Service Rule Plans 等依赖媒体类型数据源的查询条件、表格、选择器、业务配置页签同步显示 `DM`。
- 少数手写提示文案同步从 `Text` 改为 `DM`，包括 Media Service Rule Plans 校验提示和 Global Control Configuration 的 DM media capacity 文案。
- 项目事实文档已同步记录 Routing Config 媒体类型展示口径为 Voice / Video / DM / Non-DM。

回滚说明：

- 如需恢复旧展示名，将本次 `DM` 展示文案改回 `Text` 即可。

当前风险：

- 需浏览器检查 Routing Config 相关页面，确认媒体类型查询条件、表格、配置页签均显示为 `DM` / `Non-DM`。

### 2026-07-02 17:56 +08:00 - main 恢复本地 Employee Management 并默认隐藏

修改页面或文件：

- `.env.example`
- `src/config/moduleVisibility.ts`
- `src/layouts/BasicLayout.tsx`
- `src/routes.tsx`
- `src/pages/employee-management/*`
- `src/mock/employeeManagement.ts`
- `src/store/employeeManagementStore.ts`
- `src/types/employeeManagement.ts`
- `src/pages/index.ts`
- `src/store/index.ts`
- `src/types/index.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 用户确认不再通过单独员工管理分支隔离功能，而是统一放在 `main`，客户发布仍以 `main` 为准。
- Employee Management 暂时只给本地维护查看，不能在客户发布环境显示。
- 之前本地 `codex/employee-management` 分支容易造成误切和误解，需要删除并把可见性控制落到代码里。

修改结果：

- 删除本地 `codex/employee-management` 分支，当前工作统一回到 `main`。
- 新增 `VITE_APP_VISIBILITY_PROFILE=customer|local`；默认 customer，客户构建隐藏 local-only 模块。
- `VITE_APP_VISIBILITY_PROFILE=local` 时显示 Employee Management 和 Design System。
- Customer/default profile 下隐藏 Employee Management 菜单，并拦截 `/employee-management/*` 直达路由返回 `/`。
- 恢复 Employee Profile Management 页面、员工 mock、store、type 和 admin 样式。
- Employee Profile Management mock employee profiles expanded to 10 records, with employee skill settings aligned to existing Routing Config `SQ_*` skill queue codes.
- 本地 `.env.local` 保持 `VITE_APP_VISIBILITY_PROFILE=local`，该文件已由 `.gitignore` 排除，不会提交给客户环境。

验证：

- `npm run lint` 已通过。
- `npx tsc --noEmit` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- Chrome CDP 冒烟已通过：`VITE_APP_VISIBILITY_PROFILE=customer` 时菜单不显示 Employee Management / Design System，直达 `/employee-management/employee-profiles` 重定向到 `/`。
- Chrome CDP 冒烟已通过：本地 `VITE_APP_VISIBILITY_PROFILE=local` 时菜单显示 Employee Management / Design System，`/employee-management/employee-profiles` 可打开 Employee Profile Management。

回滚说明：

- 如需完全移除 Employee Management，可删除 `src/pages/employee-management/*`、employee mock/store/type 文件，并移除 `moduleVisibility`、路由、菜单、导出入口和样式中的相关引用。
- 如只需隐藏，无需回滚代码，保持客户环境 `VITE_APP_VISIBILITY_PROFILE=customer` 或不设置该变量即可。

当前风险点：

- Employee Management 当前是本地前端 mock 数据，不连接真实 LDAP / HR / 权限 / 坐席技能后端。
- 统一 visibility profile 当前覆盖模块级入口；如后续要按子菜单精细控制，需要继续拆分配置粒度。

### 2026-07-02 15:23 +08:00 - Channels Agent Service 阈值颜色圆点

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/styles/index.less`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 用户确认在 Channels Business Config 的 `Agent Service Configuration` 中，为 `Agent No Reply Warning (sec)` 和 `Agent No Reply Breach (sec)` 增加颜色圆点，帮助客户区分预警和超时阈值。
- 颜色需要与 Live Chat 中的 SLA warning / breach 颜色值保持一致。

修改结果：

- 保留既有字段名不变：`Agent No Reply Warning (sec)`、`Agent No Reply Breach (sec)`。
- 两个字段 label 前新增状态圆点：warning 使用 `--aicc-livechat-sla-warning`，breach 使用 `--aicc-livechat-sla-breach`。
- 同步记录 Routing Config 业务规则、当前状态和设计系统颜色复用规则。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- Chrome CDP 冒烟已通过：WhatsApp Business Config 中 `Agent No Reply Warning (sec)` 和 `Agent No Reply Breach (sec)` 字段名保持不变；warning 圆点颜色为 `rgb(245, 158, 11)`，breach 圆点颜色为 `rgb(240, 68, 56)`，均与 Live Chat SLA 颜色变量解析值一致。

回滚说明：

- 如需回滚，可移除 `renderBusinessNumberField` 的 severity 圆点渲染和对应 `.routing-config-channel-business__sla-*` 样式。

当前风险点：

- 该调整仅改变视觉标识，不改变业务字段、默认值或配置保存结构。

### 2026-07-02 15:14 +08:00 - Channels 媒体类型编辑下拉显示全量选项

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DEV_LOG.md`

修改原因：

- 用户指出 Channels > Edit Channel 弹框中的 `Media Type` 下拉应显示全部四个媒体类型，而不是只显示当前 Channel Type 的已支持媒体列表。
- 当前渠道已选媒体类型才是默认值，并用于决定 Business Config 弹框中显示哪些媒体页签。

修改结果：

- Edit Channel 的 `Media Type` 多选下拉改为使用全局 `mediaOptions`，显示 Voice、Video、Text、Non-DM。
- 移除保存时“Media Type must be supported by the Channel Type.” 的限制校验。
- 仍保留当前渠道 `mediaTypes` 作为默认已选值；选择变化后继续通过 `normalizeChannelBusinessConfig` 生成对应 Business Config tab。
- 同步记录 Routing Config 业务规则和当前状态。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- Chrome CDP 冒烟已通过：X 渠道 Edit Channel 默认已选 Text / Non-DM，Media Type 下拉显示 Voice、Video、Text、Non-DM 四个选项。

回滚说明：

- 如需回滚，可将 Edit Channel `Media Type` options 改回 Channel Type 的 `supportedMediaTypes`，并恢复 unsupported media validation。

当前风险点：

- Channel Type 的 `supportedMediaTypes` 仍保留在 mock 数据中用于类型默认能力说明；当前编辑弹框不再把它作为强限制。

### 2026-07-02 14:59 +08:00 - Routing Config 新增 Non-DM 媒体类型并清理 main 分支污染

修改页面或文件：

- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 客户要求在现有 Voice、Video、Text 之后新增 Non-DM 媒体类型，用于社媒评论、回复、提及和应用商店评论场景。
- Routing Config 中所有依赖媒体类型数据源的选项需要同步包含 Non-DM。
- AppStore / PlayStore 只应保留 Non-DM 媒体。
- 当前 main 工作区曾误带入本地 Employee Management 变更，需要清理并保留恢复备份。

修改结果：

- `MediaTypeCode` 扩展为 `VOICE | VIDEO | TEXT | NON_DM`，媒体类型 mock 增加 `Non-DM`。
- Instagram、LinkedIn、Facebook、X、Tik Tok、YouTube 支持 `TEXT + NON_DM`。
- AppStore、PlayStore 改为仅支持 `NON_DM`。
- 新增社媒和应用商店 `*_NON_DM` channel media settings。
- 新增 `MSRP_NON_DM_STANDARD` 媒体服务规则计划，并让渠道媒体规则绑定自动生成 Text / Non-DM 绑定。
- Channels Business Config 弹框中 Non-DM 作为媒体页签展示，但当前不放配置内容。
- Media Service Rule Plans 的媒体类型选项增加 Non-DM，并使用英文媒体标签。
- main 工作区中的 Employee Management / visibility profile 相关代码、入口和知识库残留已清理；恢复包位于 `.codex-backup/employee-management-rescue-2026-07-02-144414/`。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- Chrome CDP 冒烟已通过：Channels 表格和媒体筛选包含 Non-DM；Instagram Business Config 显示 Text / Non-DM 页签，Text 页签中 `Queue Configuration` 位于 `Access Configuration` 后，Non-DM 页签为空；Phone Voice Business Config 不显示 `Queue Configuration`。
- 数据级验证已通过：社媒渠道为 `TEXT + NON_DM`，AppStore / PlayStore 为 only `NON_DM`，旧 `APPSTORE_TEXT` / `PLAYSTORE_TEXT` 不再存在。

回滚说明：

- 如需移除 Non-DM，可从 `MediaTypeCode`、`mediaTypes`、社媒/AppStore/PlayStore mock 数据、channel media settings、media service rule plan 和 Business Config 空页签逻辑中移除 `NON_DM`。
- 如需恢复误入 main 的 Employee Management 内容，可参考 `.codex-backup/employee-management-rescue-2026-07-02-144414/` 中的备份 diff 和文件副本。

当前风险点：

- Non-DM Business Config 目前按客户要求仅提供空页签；后续配置字段待产品确认。
- 社媒 Text + Non-DM 与 AppStore / PlayStore only Non-DM 目前是前端 mock 数据，没有真实渠道后端约束。

### 2026-06-29 16:25 +08:00 - 坐席个人设置入口与提示音开关

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/components/AgentProfileArea.tsx`
- `src/layouts/components/AgentSettingsModal.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 客户要求暂时隐藏话务条 More 菜单中的 Settings 入口。
- 客户要求在签入 / 签出菜单下方增加独立 Settings 区域，当前用于坐席自行开关系统提示声音，后续可继续扩展坐席个人配置。

修改结果：

- 话务条 More 菜单当前只保留 Outbound Call，原 Toolbar Settings 入口不再展示。
- Agent Profile 下拉菜单在签入 / 签出 / AUX 操作下方增加 divider 和 Settings 入口。
- 新增 Agent Settings 弹框，当前包含 `System prompt sound` 开关，状态保存在当前前端会话组件 state 中。
- 更新项目上下文、当前状态、设计系统文档中的相关描述。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite chunk size warning。
- 本地 dev server `http://127.0.0.1:5173/` HTTP 检查返回 200；Codex in-app browser 自动化连接超时，未完成截图式 smoke check。

回滚说明：

- 如需恢复旧入口，可在 `AgentToolbar.tsx` More 菜单重新加入 Settings 菜单项并接回 `ToolbarSettingsModal`。
- 如需移除新入口，可从 `AgentProfileArea.tsx` 删除 `agent-settings` 菜单项和 `AgentSettingsModal` 挂载。

当前风险点：

- 系统提示音开关当前仅完成坐席侧偏好 UI，不绑定真实声音播放逻辑；后续如接入真实音频提醒，需要将该偏好传入实际提示音触发点或持久化到后端。

### 2026-06-29 09:54 +08:00 - Haloapp Demo 文字渠道流程与截图展示修正

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/mock/bankapp.ts`
- `src/types/bankapp.ts`
- `src/styles/index.less`
- `public/screenshots/haloapp-v18/*`
- `DEV_LOG.md`

修改原因：

- 继续修正 Haloapp demo 图片清晰度和流程顺序问题，优先处理 BankApp 文字渠道右侧步骤内容。
- 客户提供 `D:\03projects\BCA AICC\需求文档\Haloapps\Haloapps截图\脱敏（新）` 下的文字媒体清晰脱敏截图，需要替换旧的 Word 嵌入低清图。
- 文字媒体流程需按登录用户 / 游客区分，客户可见描述统一使用 `BANK` 脱敏，不再出现 BCA。

修改结果：

- BankApp Live Chat / 文字渠道右侧流程改为完整展示全部步骤，并用 pending / active / complete 状态区分流程顺序。
- 登录用户文字流程为：选择 Live Chat、确认联系 Bank 客服、传递客户身份并排队、坐席接入成功、文字聊天、坐席发起 PIN、客户输入 PIN 并返回结果、服务结束与满意度评价。
- 游客文字流程为：选择 Live Chat、输入姓名 / 电话 / 邮箱、确认联系 Bank 客服、传递游客信息并排队、坐席接入成功、文字聊天、服务结束与满意度评价；游客不显示 PIN 步骤。
- 文字渠道新增 `pin-request` / `pin-input` 专用 demo step，避免继续复用视频 `screen-sharing` step 表达 PIN 流程。
- 文字渠道使用简短脱敏步骤文案，步骤 owner 标签仅表示当前步骤展示的图片 / 页面提供方；文字客户端页标 `BANK`，坐席弹屏标 `Netinfo`，保留原有两套标签样式。
- 文字客户端图替换为清晰脱敏版：联系方式选择、游客信息、确认联系客服、排队分配、文字聊天、PIN 输入、满意度评价。
- 文字客户端清晰图恢复填满手机屏显示，避免顶部 / 底部留白导致视觉忽大忽小。
- `Reset` 仅把当前流程回到第一步，不再重置 Channel 和 Customer Type。
- 登录用户 PIN 发起步骤会切回 Live Chat 坐席弹屏；PIN 输入页底部 `Simulate Failed` / `Accept` 使用透明热区分别模拟失败和成功。
- BankApp 联系方式选择页移除不准确透明热区，改为仅通过右侧 Channel 控件切换，避免截图按钮位置与热区错位。
- 登录用户第 6 步 PIN 发起改为激活既有 Live Chat 当前客户会话，不再在左侧手机区域显示坐席页面，也不再创建新的客户接入。
- 新增客户提供的 `4文字-转坐席成功.png` 脱敏截图，并用于文字渠道“坐席接入成功 / 跳转 Live Chat 弹屏”步骤的左侧客户端画面；后续文字聊天步骤仍使用聊天截图。
- 登录用户第 6 步进入 PIN Verification 时立即切到既有 Live Chat 客户；坐席点击 PIN 后自动切回 BankApp Demo，并让左侧流程与手机画面进入第 7 步 PIN 输入 / 返回结果，避免返回 demo 后仍停留在上一步。
- 语音 / 视频渠道接入客户新增脱敏清晰图：游客信息、菜单选择、语音排队、语音通话、视频排队、视频通话、视频结束共享、坐席侧 OpenEye 通话与共享画面。
- 语音 / 视频渠道右侧流程说明简化为步骤描述，owner 标签沿用文字渠道规则：客户端截图标 `BANK`，坐席工作区 / OpenEye 弹屏标 `Netinfo`，说明文字不重复写 owner。
- 重新按需求文档 `1.1.整体接入流程（改）` 纠偏语音 / 视频步骤：语音补充问题验证步骤，视频拆分客户发起屏幕共享与坐席查看共享画面；语音 / 视频坐席接入触发点从接通后改为排队后。
- 修正语音 / 视频截图未撑满问题：菜单确认、业务菜单、问题验证、共享查看等截图步骤纳入全屏截图渲染，不再额外叠加手机状态栏占用高度。
- 语音渠道体验修正：业务步骤改为“选择咨询业务”，去掉单独确认菜单步骤；排队转坐席成功后直接进入通话中并打开已有语音坐席弹屏；进入问题验证步骤时聚焦已有语音通话弹屏，不再重新发起接入。
- 修复语音问题验证步骤被 active-call readiness 拦截的问题：优先聚焦已有通话 tab，只有不存在当前通话时才走新接入兜底。
- 视频渠道同步规避语音同类问题：去掉单独确认菜单步骤；排队转坐席成功后直接进入视频通话并打开已有视频坐席弹屏；进入坐席查看共享画面时聚焦已有视频通话弹屏，不触发新进线。
- 视频屏幕共享细化：客户侧视频通话图改为透明热区覆盖第一排第三个共享按钮，Next Step 进入共享时也同步触发共享并聚焦已有视频弹屏；坐席侧保留原视频 OpenEye，同时额外弹出更大的共享画面 OpenEye。
- 视频共享流程进一步合并：视频通话已连接与客户发起屏幕共享合并为同一步，通过客户侧透明热区或 Next Step 触发共享后直接进入坐席查看共享画面；客户侧结束共享仅展示状态不再可点击；共享 OpenEye 窗口放大到 760px 以匹配视频 OpenEye 标题栏视觉高度。
- 视频共享合并步骤文案修正为“Video Call & Start Screen Share”，说明明确客户在该步发起屏幕共享；共享 OpenEye 初始位置改为居中，避免遮挡右上角视频通话 OpenEye。
- 修复 WhatsApp 转坐席被语音 / 视频通用跳转逻辑误伤的问题：WhatsApp 从 `chat` 进入 `agent-workspace` 时重新触发已有 Live Chat 工作区打开。

验证：

- `npx tsc --noEmit` 已通过。
- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite chunk size warning。
- 本地 dev server `http://127.0.0.1:5173/` 可访问；Codex in-app browser 自动化连接超时，未完成截图式 smoke check。

回滚说明：

- 如需回滚，可恢复 `BankAppDemoPage.tsx` 中 `visibleProcessSteps` 为当前步骤切片，并移除文字渠道专用 `getProcessDescription` 分支。
- 文字客户端清晰图可回滚到旧的 `public/screenshots/haloapp-v18/` 文件版本；`pin-request` / `pin-input` 可从 `BankAppDemoStep` 中移除并恢复旧 sequence。

当前风险点：

- 文字媒体已按 1.1 章节梳理并替换清晰图；仍建议客户演示前人工点通一次 Registered / Guest 两条流程确认截图热点位置与流程说明。
- 语音 / 视频流程尚未按新粒度重新梳理，本轮仅保证不主动重排语音 / 视频步骤。

### 2026-06-27 19:20 +08:00 - Haloapp V1.8 客户端职责边界与视频共享方向调整

修改页面或文件：

- `public/screenshots/haloapp-v18/*`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/mock/bankapp.ts`
- `src/types/bankapp.ts`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/pages/inbound/components/OpenEyeVideoWindow.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/AgentToolbar.tsx`
- `src/store/appStore.ts`
- `src/styles/index.less`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `PROJECT_CONTEXT.md`
- `CURRENT_TODO.md`
- `DECISION_LOG.md`

修改原因：

- 客户确认 Haloapp 文字客户端页面由 BCA 提供，Netinfo 只对接收发消息和坐席侧处理。
- 语音客户端需保留 Keypad，用于客户被转至 IVR 后输入按键。
- 视频客户端无 Keypad、无转移；桌面共享由客户在视频界面发起，坐席端仅查看。

修改结果：

- 从 `Haloapp及视频弹屏需求说明书V1.8.docx` 的“整体接入流程（改）”表格提取新图，落到 `public/screenshots/haloapp-v18/`。
- BankApp Demo 改用 V1.8 新截图；文字和 PIN 客户端页面标记为 BCA-owned read-only client reference。
- PIN 仍由坐席从 Customer Information 发起，但客户侧页面表现为 BCA 提供并返回验证结果给 Netinfo。
- 视频共享移除坐席端 OpenEye 发起/选择程序流程，改为客户侧 `Desktop Share` / `Stop Sharing` 触发，坐席浮窗只查看共享画面。
- 视频通话期间 header toolbar 不再显示 Transfer；语音通话仍保留 Transfer / Transfer IVR 和客户侧 Keypad。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite chunk size warning。

回滚说明：

- 如需回滚，可恢复 `src/mock/bankapp.ts` 旧截图路径、`BankAppDemoPage` 的旧 screen-share/select flow、`OpenEyeVideoWindow` 的 Desktop Share 按钮，以及 `AgentToolbar` 的无条件 Transfer 显示。

当前风险点：

- 新截图来自 V1.8 Word 文档嵌入图，仍建议客户演示前人工确认图像清晰度和步骤命名。
- 当前仍是前端 demo；SDK、消息、PIN、视频和满意度评价均未接真实后端。

### 2026-06-26 00:00 +08:00 - Customer Verification 改为右侧窄版 Tab

修改页面或文件：

- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/pages/inbound/components/LeftColumn.tsx`
- `src/styles/index.less`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 客户反馈原 Customer Verification 居中弹框会覆盖 CRM，真实通话场景中坐席需要一边查看 CRM 资料，一边询问客户并在验证界面标记结果。

修改结果：

- Customer Information 的 Verify 入口现在打开右侧固定 `Verification` tab，与 `Assistant`、`Common Links` 同级。
- Verification tab 使用窄版纵向布局，保留 Customer Segment、Skill、Scenario、Need correct、Wrong count、问题列表、Correct/Wrong/Skip 和 Apply Verified/Failed。
- 中心 CRM workspace 不再被验证界面遮挡；管理页的 Customer Verification Preview 继续使用原 modal 形态。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留 Vite chunk size 提示。
- 本地 dev server `http://127.0.0.1:5173` 可访问；Codex in-app browser 自动化连接连续超时，未完成截图式 smoke check。

回滚说明：

- 如需回滚，可恢复 `CustomerInformationCard` 中的 `BaseModal` 验证入口，并移除 `InteractionWorkspace` 与 `AssistantPanel` 的 Verification tab wiring 以及 compact 样式。

当前风险点：

- 右侧窄版可用性仍建议在客户演示分辨率下人工复核，尤其是长问题、多 scenario 和 Live Chat 四栏布局。

### 2026-06-26 00:00 +08:00 - Customer Verification 右侧 Tab 二次压缩优化

修改页面或文件：

- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户确认右侧 Verification tab 已可见，但反馈条件区、回答进度和问题列表仍占用过多高度，需要更贴合右侧窄面板的坐席操作台布局。

修改结果：

- Verification tab 现在可关闭，关闭后回到 `Assistant`。
- 条件区默认收起为一行摘要，可展开编辑 Customer Segment、Skill、Scenario。
- 问题按 block/group 分组展示，同类名称只出现一次；问题文本可换行，Correct/Wrong/Skip 操作按钮固定在问题右侧。
- Need correct、Correct count、Wrong count、分组进度和 Apply 操作移到底部 sticky 区域，便于与 CRM 对照时保持操作可见。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留 Vite chunk size 提示。

回滚说明：

- 如需回滚，可恢复 compact 模式中按单题平铺的列表结构，并移除 Verification tab close 回调。

当前风险点：

- 右侧条件展开后三个 select 会根据宽度自动换行；仍建议在客户演示屏幕下人工确认长 Skill / Scenario 名称是否足够清晰。

### 2026-06-26 00:00 +08:00 - Customer Verification 右侧 Tab Clean 版精简

修改页面或文件：

- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户反馈右侧 Verification tab 已明显改善，但条件折叠、分类胶囊色、分组卡片边框和底部总数字样仍显复杂，希望在有限空间内进一步清晰、简洁、便于阅读操作。

修改结果：

- 条件区改为固定常驻紧凑 select，不再使用展开/收起和外层边框。
- 分类标题去掉彩色胶囊和背景，仅用主题深色文字显示。
- 问题分类去卡片化，改为轻量分组标题、浅分隔线和问题行列表。
- 底部状态去掉 `Need X correct` 和 `Correct X` 总述，仅保留每类要求进度和总错误数量。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留 Vite chunk size 提示。

回滚说明：

- 如需回滚，可恢复 compact 条件折叠区域、分组卡片样式和底部完整进度文案。

当前风险点：

- 条件区常驻显示后若 Skill / Scenario 文本很长，会依靠 Select 自身截断和自动换行；仍建议在客户演示数据下人工检查。

### 2026-06-26 00:00 +08:00 - Customer Verification 底部操作按钮进度合并

修改页面或文件：

- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户提出每类正确数已在分类标题右侧展示，底部可进一步省空间，将正确总数和错误上限进度合并到操作按钮文案中。

修改结果：

- 底部独立进度行已移除。
- `Apply Failed` 在存在 Max Wrong 时显示为 `Apply Failed x/y`；无错误上限时保持 `Apply Failed`，避免误解为错 1 个即失败。
- `Apply Verified` 显示为 `Apply Verified correct/required`。
- 按钮启用和验证业务逻辑保持不变。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留 Vite chunk size 提示。

回滚说明：

- 如需回滚，可恢复 compact footer 中独立进度行和原按钮文案。

当前风险点：

- 右侧宽度较窄时按钮文案可能自动换行；建议在客户演示分辨率下确认按钮行可读性。

### 2026-06-26 00:00 +08:00 - Customer Verification 分组统计口径优化

修改页面或文件：

- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户指出分组标题右侧统计应表达业务要求进度，而不是已答数量/总题数；否则容易与 Correct 按钮状态或替代题计入口径产生误解。同时希望查询条件和问题列表之间保持清晰但轻量的分隔。

修改结果：

- 分组标题统计改为 `当前计入正确数 / 要求正确数`。
- 替代题计入被替代分组时显示 `ALT +n` 标识。
- 分组统计默认灰色，进行中使用主题色，达标后显示绿色。
- 顶部条件区与问题区之间增加轻量分隔线，不增加额外外框。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留 Vite chunk size 提示。

回滚说明：

- 如需回滚，可恢复分组标题按正确题数/组内题数显示，并移除 compact 条件区下方分隔线。

当前风险点：

- 替代题标识依赖当前 V2 requirement evaluation 的 altUsed 计算；后续如客户调整 Alternative 计入规则，需要同步更新标题统计。

### 2026-06-26 00:00 +08:00 - Customer Verification Clean 版视觉细化

修改页面或文件：

- `src/pages/inbound/components/CustomerVerificationV2Modal.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户反馈查询条件与问题区的横线较硬，希望改成浅背景块；分类统计与分类名称距离过近且视觉权重偏高。

修改结果：

- 查询条件区改为浅蓝背景块，不再使用横线分隔。
- 分类统计改为括号形式，例如 `STATIC (1/2 ALT +1)`。
- 分类统计默认灰色、不加粗、不变蓝；仅满足要求后变绿色。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留 Vite chunk size 提示。

回滚说明：

- 如需回滚，可恢复条件区横线分隔和原统计强调样式。

当前风险点：

- 浅背景块与下方问题区的分隔依赖留白和背景差异；仍建议在客户演示分辨率下人工确认层次感。

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

### 2026-06-27 11:28 +08:00 - Live Chat tab 未回复 SLA 聚合提醒

修改页面或文件：

- `src/pages/AgentWorkspace.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `DESIGN_SYSTEM.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 客户希望坐席切换到其他弹屏或菜单时，仍能在 Live Chat 页签上看到有多少客户处于坐席未回复提醒状态。

修改结果：

- Live Chat 页签继续显示当前服务客户中的最长服务时长和未读消息数量。
- 页签新增未回复 SLA 聚合 badge：橙色显示 warning 客户数，红色显示 breach 客户数。
- 聚合口径为 active、非历史、未结束且存在 unansweredSince 的 Live Chat 会话；坐席发送回复或结束服务后不再计入。
- badge 使用 `99+` 封顶，并通过 title 展示 warning / breach 数量说明。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite/Rolldown chunk size warning。
- 本地 dev server `http://127.0.0.1:5173/` HTTP 检查返回 200。

回滚说明：

- 如需回滚，移除 `AgentWorkspace` 中 `liveChatUnansweredAlertCounts` 聚合和 `WorkspaceTabLabel` 的 SLA badge 渲染，并删除对应 `.workspace-tab-label__sla-alert*` 样式。

当前风险点：

- in-app browser 控制连续超时，尚未完成截图级复查；建议打开数字坐席工作台观察 Live Chat tab 在 warning / breach 计数变化时的宽度和视觉效果。

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

### 2026-06-27 18:30 +08:00 - 客户卡片验证入口按渠道区分 KBV / PIN

修改页面或文件：

- `src/components/CustomerInformationPanel.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/store/appStore.ts`
- `src/types/inbound.ts`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DECISION_LOG.md`

修改原因：

- 客户确认验证方式需按渠道区分：语音使用问题验证，按钮短名使用 `KBV`；已登录 BankApp 文字场景使用 `PIN`；WhatsApp、BankApp 视频等不显示验证按钮。
- PIN 验证无需占用右侧 Verification 面板，应直接通过客户卡片状态显示等待与结果，并联动客户侧 BankApp PIN 页面。

修改结果：

- Customer Information 卡片改为按渠道显示验证动作：语音显示 `KBV`，BankApp text / Live Chat 显示 `PIN`，其他渠道隐藏验证按钮。
- `PIN` 点击后触发现有 BankApp Demo 客户侧 secure PIN 页面，客户卡片状态显示 `Verifying`。
- BankApp PIN mock 支持提交成功或模拟失败；失败后可重新发起，最多 3 次，第三次失败后按钮禁用并显示失败状态。
- KBV 仍使用当前 Customer Verification V2 右侧 tab；PIN 不再打开右侧验证面板。
- Webchat PIN 暂不实现，等待独立 Webchat 客户侧 demo 后再接入。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite / Rolldown large chunk warning。

回滚说明：

- 如需回滚，移除 Customer Information 的渠道判断和 PIN attempt 状态，恢复单一 `Verify` 按钮与 BankApp PIN mock 的全局 sent / verified 状态。

当前风险点：

- PIN attempt 状态当前为 BankApp demo 全局状态；如未来同时处理多个 BankApp text 会话，需要改为按 customer/session key 存储。

### 2026-06-27 18:45 +08:00 - PIN 失败状态与 BankApp 客户端场景修正

修改页面或文件：

- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `DEV_LOG.md`

修改原因：

- 用户测试 HaloApp Voice call 客户端 PIN 验证失败后，坐席侧仍显示未验证，容易误解失败结果没有回传。
- PIN 验证应表达为已登录 BankApp text / Live Chat 场景，不应让客户侧停留在 Voice call 画面。

修改结果：

- PIN mock 返回失败后，坐席客户卡片显示 `Failed`；未满 3 次时 `PIN` 按钮仍可再次发起，第三次失败后禁用。
- BankApp 客户端收到 PIN 请求时，渲染层临时展示为 registered Live Chat 场景并显示 secure PIN 页，避免 Voice call 画面与 PIN 验证混在一起。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite / Rolldown large chunk warning。

回滚说明：

- 如需回滚，将 PIN failed 状态映射回 `Unverified`，并移除 BankApp Demo 中 PIN 请求时的 effective Chat 场景覆盖。

当前风险点：

- 该修正仍沿用全局 BankApp PIN mock 状态；多会话 PIN 需要后续按会话隔离。

### 2026-06-27 19:05 +08:00 - BankApp Voice / Video 渠道与 PIN 场景隔离

修改页面或文件：

- `src/mock/inbound.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DEV_LOG.md`

修改原因：

- 用户确认场景矩阵：HaloApp / BankApp Voice 无论已登录还是未登录都走 KBV；PIN 只用于已登录 BankApp text / Live Chat。
- 原 mock 中 BankApp Voice / Video 的 `accessChannel` 都写成 `BankApp`，导致客户卡片把 Voice / Video 误判为 text PIN 场景。

修改结果：

- BankApp Voice mock customer 的 `accessChannel` 改为 `BankApp Voice`，坐席侧显示 `KBV`。
- BankApp Video mock customer 的 `accessChannel` 改为 `BankApp Video`，坐席侧不显示验证按钮。
- BankApp 客户端收到 PIN 请求时，控制栏也显示为 Chat / Registered，避免 Voice 选择状态与 PIN 页混在一起。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite / Rolldown large chunk warning。

回滚说明：

- 如需回滚，将两个 mock customer 的 `accessChannel` 恢复为 `BankApp`，并恢复 BankApp Demo 控制栏使用原始 contact/customer type。

当前风险点：

- Webchat PIN 仍按确认结果暂不实现。

### 2026-06-27 19:25 +08:00 - BankApp Text Registered / Guest PIN 隔离

修改页面或文件：

- `src/types/inbound.ts`
- `src/store/appStore.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/inbound/LiveChat2Page.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/mock/inbound.ts`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DEV_LOG.md`

修改原因：

- 用户发现 BankApp Demo 选择 Chat Guest 后，坐席侧仍可发送 PIN，并且客户侧 PIN 请求会跳转显示为 Registered。
- 根因是 Live Chat handoff 固定使用 registered BankApp mock session，坐席客户卡只按 `accessChannel === BankApp` 判断 PIN，没有区分 registered / guest。

修改结果：

- LiveChat2 session 增加 `bankAppLoginStatus`，BankApp Demo handoff 时传入当前 `registered` / `guest`。
- Guest BankApp text handoff 会覆盖客户资料为 Guest，并把 login status 传到 Customer Information。
- Customer Information 只有 BankApp text 且 `bankAppLoginStatus === registered` 时显示 `PIN`；guest 不显示验证按钮。
- 现有默认 BankApp text mock session 标记为 registered，保持原有可演示 PIN 的默认会话。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite / Rolldown large chunk warning。

回滚说明：

- 如需回滚，移除 `bankAppLoginStatus` 字段和 handoff 参数，恢复 Customer Information 仅按 `BankApp` accessChannel 显示 PIN。

当前风险点：

- PIN attempt 状态仍是全局 BankApp mock 状态；如后续允许多个 registered BankApp text 会话并行发 PIN，应继续按 session key 隔离 attempts。

### 2026-06-27 19:35 +08:00 - BankApp Login Status 透传修正

修改页面或文件：

- `src/pages/inbound/InteractionWorkspace.tsx`
- `DEV_LOG.md`

修改原因：

- 用户发现 BankApp Chat registered / guest 都不显示 PIN。
- 根因是 `LiveChat2Page` 已将 `bankAppLoginStatus` 放到 customer 上，但 `InteractionWorkspace` 重新组装 `sourceCustomer` / `displayCustomer` 时漏掉该字段，导致 Customer Information 无法识别 registered。

修改结果：

- `InteractionWorkspace` 在 source customer、display customer、identity refresh 后客户资料中保留 `bankAppLoginStatus`。
- BankApp Chat registered 可显示 PIN；guest 仍不显示验证按钮。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仍只有既有 Vite / Rolldown large chunk warning。

回滚说明：

- 如需回滚，移除 `InteractionWorkspace` 中 `bankAppLoginStatus` 的透传。

当前风险点：

- 仍建议浏览器手工点一次 BankApp Demo 的 Chat Registered / Guest handoff，确认坐席卡片按钮分别为 `PIN` / 无验证按钮。

### 2026-06-29 17:55 +08:00 - Webchat Text 客户侧 Demo 与 PIN 接入

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/webchat/WebchatDemoPage.tsx`
- `src/pages/webchat/index.ts`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/store/appStore.ts`
- `src/mock/bankapp.ts`
- `src/mock/inbound.ts`
- `public/screenshots/webchat/*`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户要求在 BankApp 菜单下方新增 Webchat 介入 demo。
- Webchat 当前只实现文字媒体；客户仍区分 Registered / Guest。
- Registered Webchat 客户应直接排队，不选择媒体、不填写信息、不选择菜单。
- Guest Webchat 客户先展示联系方式 / 业务选择截图，再进入排队。
- 转坐席后必须作为新的 Webchat 客户进入 Live Chat，不能误用 BankApp 或 WhatsApp。
- Webchat PIN 演示默认客户 BankApp 已登录，流程文案需标明 `(customer BankApp is logged in)`，并继续打开 Haloapp PIN 输入页。

修改结果：

- Channel Simulation 菜单在 BankApp 下方新增 Webchat。
- Agent Workspace 新增 `Webchat Demo` tab，复用 BankApp demo 框架的 `webchat` variant。
- Webchat Registered 流程从 queue 起步；Guest 流程包含 Webchat contact/business screenshot、queue、agent chat、PIN、satisfaction。
- Webchat handoff 使用 `live-chat-003` / `livechat2-003`，坐席侧显示 Webchat 新客户并打开 Live Chat。
- Customer Information 对 Webchat text session 显示 `PIN`；点击后打开 Webchat Demo 中的 Haloapp PIN 输入页。
- Webchat 脱敏截图复制到 `public/screenshots/webchat/` 并接入页面。
- 知识库同步更新 Webchat Demo 状态、业务规则、待验证清单和长期决策。

验证：

- `npm run lint` 已通过。
- `npx tsc --noEmit` 已通过。
- `npm run build` 已通过；仍只有既有 Vite / Rolldown large chunk warning。
- 本地 dev server `http://127.0.0.1:5173/` 返回 HTTP 200。
- in-app browser 自动化连接连续超时；项目未安装 Playwright，因此未完成浏览器点击级烟测。

回滚说明：

- 如需回滚，移除 Webchat menu/tab/store 状态、新 `src/pages/webchat/*` 文件、`webchatScreenshotSources`、Webchat PIN 分支，并删除 `public/screenshots/webchat/`。

当前风险点：

- PIN attempt 状态仍沿用全局 BankApp / Haloapp mock 状态；如果后续并行多个 text session 发 PIN，需要按 session key 隔离。
- Webchat voice / video 当前未实现，只记录为未来扩展。
- 仍建议客户演示前手工点一次 Webchat Registered / Guest 到 Live Chat 和 PIN 页面。

### 2026-06-29 18:25 +08:00 - Webchat Handoff 步骤与 PIN 暂隐藏

修改页面或文件：

- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/store/appStore.ts`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 用户确认 Webchat PIN 暂不展示；转坐席步骤仍应保留以表达坐席接入。
- Webchat PIN 规则仍需再向客户确认，当前 demo 先隐藏客户侧 PIN 步骤和坐席侧 PIN 按钮。

修改结果：

- Webchat Registered 流程保留为 `Queue Routing -> Agent Workspace -> Text Chat -> Satisfaction Rating`。
- Webchat Guest 流程保留为 `Guest Information -> Queue Routing -> Agent Workspace -> Text Chat -> Satisfaction Rating`。
- Webchat queue handoff 打开 Live Chat 并接入新的 Webchat 客户。
- Customer Information 对 Webchat 不再显示 `PIN`。
- Webchat handoff 不再写入 `bankAppLoginStatus: registered`。
- 知识库同步改回 Webchat PIN 暂隐藏 / 待客户确认。

验证：

- `npm run lint` 已通过。
- `npx tsc --noEmit` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。

回滚说明：

- 如客户确认 Webchat PIN 需要展示，可恢复 Webchat step sequence 中的 `pin-request` / `pin-input`，恢复 Customer Information 的 Webchat PIN 判断，并在 handoff 时重新设置 Webchat 的登录上下文。

当前风险点：

- Webchat PIN 是否最终需要展示仍待客户确认。

### 2026-06-29 20:53 +08:00 - 多渠道游客客户信息展示规则

修改页面或文件：

- `src/mock/inbound.ts`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/VideoCallPage.tsx`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 用户确认游客客户信息应按客户侧输入来源区分。
- BankApp / Webchat 文字游客会输入姓名、电话、邮箱，因此坐席侧应保留这三项，但客户 ID / CIS 显示 `-`。
- BankApp voice / video 游客只输入号码，因此坐席侧应生成 `Guest-06290001` 类名称，保留号码，其余不可用字段显示 `-`。

修改结果：

- Live Chat handoff 对 BankApp / Webchat 文字游客生成游客资料，保留姓名、电话、邮箱，CIS 为 `-`。
- BankApp voice / video handoff 现在会透传 Registered / Guest 类型到 call interaction。
- Inbound Voice / Video workspace 按 call interaction 的 customer type 选择 registered 或 guest mock customer。
- BankApp voice guest 使用 `Guest-06290001`，BankApp video guest 使用 `Guest-06290002`，邮箱与 CIS 均为 `-`。
- 文档补充游客客户信息展示规则，并修正 Webchat PIN 暂隐藏后的 Customer Information 状态说明。

验证：

- `npx tsc --noEmit` 已通过。
- `npm run lint` / `npm run build` 待本轮最终验证。

回滚说明：

- 如需回滚，可移除 `bankAppCustomerType` 在 call interaction 中的透传，删除 voice/video guest mock，并恢复 Live Chat handoff 的 BankApp guest profile 覆盖逻辑。

当前风险点：

- `Guest-06290001` 编号目前是前端固定演示编号；如果客户要求真实排队序号或当天递增，需要后续接入统一编号规则。

### 2026-06-29 21:17 +08:00 - 客户侧 Demo 图片压缩与裂图防护

修改页面或文件：

- `public/screenshots/haloapp-v18/*`
- `public/screenshots/webchat/*`
- `src/mock/bankapp.ts`
- `src/pages/bankapp/BankAppDemoPage.tsx`
- `src/pages/inbound/components/OpenEyeVideoWindow.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 发布后客户侧 Demo 图片首次加载较慢，并出现过图片裂图。
- 新增 Haloapp / Webchat 脱敏截图原图总量约 5.7MB，部分单图接近 800KB，且实际展示尺寸远小于原图。

修改结果：

- 为 Haloapp / Webchat 客户侧截图生成 `-optimized.jpg` 轻量版本。
- 公开发布资源中移除原始大图，相关截图总量降至约 1.56MB。
- BankApp / Webchat Demo 引用改为 optimized 资源。
- OpenEye 浮窗截图引用同步改为 optimized 资源。
- 客户侧 Demo 图片增加预加载，减少步骤切换时的等待。
- 客户侧 Demo 图片增加加载失败 fallback，避免浏览器默认裂图图标占满手机框。

验证：

- 已确认源码引用的 32 个 screenshot 路径均存在。
- `npx tsc --noEmit` 已通过。
- `npm run lint` / `npm run build` 待本轮最终验证。

回滚说明：

- 如需回滚，可恢复 `src/mock/bankapp.ts` 与 `OpenEyeVideoWindow.tsx` 中的原始 PNG/JPEG 引用，并恢复被删除的原始截图资源。

当前风险点：

- 轻量 JPEG 已按当前 Demo 展示尺寸压缩；如果客户需要放大检查截图细节，可临时恢复单张原始图或按该截图单独提高输出质量。

### 2026-06-30 11:39 +08:00 - Webchat 坐席侧 Typing 状态展示

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 客户要求 Webchat 接入后，坐席能看到客户正在输入 typing 状态。
- 当前 Webchat Demo 客户侧为截图流程，不做真实输入事件联动；按 demo 目标改为坐席侧静态状态展示。

修改结果：

- Live Chat 当前 Webchat 会话在坐席输入框上方显示 `Customer is typing` 状态和动态三点。
- BankApp / WhatsApp 会话不显示 typing。
- History / Ended / read-only 会话不显示 typing。
- 该状态不连接 Webchat Demo 图片或客户侧真实输入事件。
- 知识库同步记录 typing 展示规则。

验证：

- `npm run lint` 已通过。
- `npx tsc --noEmit` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- Headless Chrome 冒烟已通过：Webchat 当前会话显示 `Customer is typing`，切到 BankApp 会话不显示，Webchat End Service 后不显示。

回滚说明：

- 如需回滚，移除 `LiveChat2ConversationWorkspace` 中 `shouldShowTypingIndicator` 和 typing indicator 节点，并删除对应 `.livechat2-typing-*` 样式。

当前风险点：

- typing 当前为静态 demo 状态；如后续客户要求真实输入事件，需要接入 Webchat channel gateway 或 mock event source。

### 2026-06-30 12:38 +08:00 - Webchat Typing 悬浮展示优化

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 当前 typing indicator 放在 composer 内部，会撑高坐席输入区。
- 用户指出未来真实 typing 出现 / 消失时会造成输入框区域跳动，需要改成更稳定的展示方式。

修改结果：

- Webchat typing indicator 移到 composer shell 的绝对定位浮层中，贴在输入框上方显示。
- composer 高度不再因为 typing 状态变化而变化。
- 消息区底部增加安全留白，避免悬浮提示遮挡最后一条消息。
- BankApp / WhatsApp / History / Ended 的显示条件不变。

验证：

- `npm run lint` 已通过。
- `npx tsc --noEmit` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- Headless Chrome 冒烟已通过：Webchat 当前会话显示浮层 typing，BankApp 会话不显示，Webchat End Service 后不显示。
- Headless Chrome 尺寸检查已通过：typing 显示、Quick Replies 打开、切换 BankApp、End Service 后 composer 高度均保持 116px。

回滚说明：

- 如需回滚，可将 typing indicator 放回 `.livechat2-composer` 内部，并移除 `.livechat2-composer-shell` 与消息区底部留白调整。

当前风险点：

- typing 当前仍是静态 demo 状态；如果后续接入真实 typing 事件，需要复测浮层出现 / 消失和 Quick Replies 弹层同时出现时的层级。

### 2026-06-30 12:52 +08:00 - Webchat Typing 点号动画简化

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户希望 typing 动效更简洁，不使用三个小点上下跳动的波浪动画。

修改结果：

- Webchat typing indicator 的动效改为文本点号宽度循环，按 `.` / `..` / `...` 节奏展示。
- 悬浮位置和不撑高 composer 的规则保持不变。

验证：

- `npm run lint` 已通过。
- `npx tsc --noEmit` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- Headless Chrome 冒烟已通过：typing 文案为 `Customer is typing...`，点号使用 `livechat2-typing-dots` 动画，composer 高度保持 116px。

回滚说明：

- 如需回滚，可恢复三个 `<i />` 小圆点及原 `livechat2-typing-dot` keyframes。

当前风险点：

- 当前点号使用宽度裁切动画；如需完全无动画，可改为静态 `...`。

### 2026-06-30 13:02 +08:00 - Webchat Typing 固定点位循环

修改页面或文件：

- `src/pages/inbound/components/LiveChat2ConversationWorkspace.tsx`
- `src/styles/index.less`
- `DEV_LOG.md`

修改原因：

- 用户反馈宽度裁切动画实际观感只明显看到 2 个点 / 3 个点，且浮层宽度不应变化。

修改结果：

- typing 点号改为 3 个固定点位，容器宽度固定为 `3ch`。
- 点号按 0 / 1 / 2 / 3 个可见状态循环，浮层宽度不再随动画变化。

验证：

- `npm run lint` 已通过。
- `npx tsc --noEmit` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- Headless Chrome 冒烟已通过：点号 DOM 为 3 个固定 span，点号区域宽度固定，composer 高度保持 116px。

回滚说明：

- 如需回滚，可恢复为单个文本 `...` 和宽度裁切动画。

当前风险点：

- 当前为 CSS 显隐动画；如果客户希望节奏更快或更慢，只需调整动画时长。

### 2026-07-01 00:00 +08:00 - 渠道管理文字渠道排队配置

修改页面或文件：

- `src/pages/routing-config/RoutingConfigDataPages.tsx`
- `src/types/routingConfiguration.ts`
- `src/mock/routingConfiguration.ts`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 客户要求在 Routing Config > Channels > Business Config 中，仅针对文字媒体增加进入人工前的排队话术配置。
- 客户确认 demo 系统 UI 与默认配置内容使用英文，排队提示语不支持预计等待时长动态参数。

修改结果：

- Text Business Config 在 `Access Configuration` 后新增 `Queue Configuration` 区块。
- 新增 `Outside Service Hours Message`、`Queue Waiting Message`、`Queue Timeout Message` 三个英文配置项。
- 默认值分别为 `Sorry, we are currently outside service hours.`、`All agents are currently busy. Please wait.`、`All agents are currently busy. Please try again later.`。
- Queue Waiting Message 不提供 `{estimatedWaitMinutes}` 变量插入。
- Voice / Video Business Config 不展示该配置块。
- 同步更新 Routing Config 类型、mock 默认值和知识库记录。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- `http://127.0.0.1:5173/routing-config/channels` HTTP 检查返回 200。
- Headless Chrome CDP 冒烟已通过：WhatsApp Text Business Config 显示 `Queue Configuration` 且位于 `Access Configuration` 和 `Agent Opening / Ending Configuration` 之间；三个默认英文值均写入 textarea；Queue Configuration 内没有变量插入下拉；BankApp Voice / Video tab 不显示该区块，Text tab 显示该区块。

回滚说明：

- 如需回滚，移除 `ChannelMediaBusinessConfig` 中三个 queue 字段、渠道默认配置和 mock 默认值，并删除 Channels Business Config 中的 `Queue Configuration` 渲染块。

当前风险点：

- 当前为前端 demo 配置项，不连接真实工作时间、排队队列或路由引擎；如后续接入后端，需要定义字段映射和实际触发点。

### 2026-07-02 18:24 +08:00 - Customer Information Special Handling 弹框

修改页面或文件：

- `src/components/CustomerInformationPanel.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`
- `CURRENT_STATUS.md`
- `BUSINESS_RULES.md`
- `DEV_LOG.md`

修改原因：

- 同事附件要求在客户卡片客户类型下方增加 `Special Handling` 按钮，点击后查看特殊处理信息弹框。

修改结果：

- 所有 Customer Information 卡片头像/客户类型区域下方显示 `Special Handling`。
- 点击按钮打开只读 `Special handling information` 弹框。
- 弹框按附件示例展示 `Customer Profile` / `Handling` 表格，数据为 `Orang Kaya` / `Jangan ditanya dulunya`。
- 当前为静态前端 demo，不调用真实客户 API，不支持编辑或保存。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 Vite/Rolldown chunk size warning。
- 用户在页面查看后确认功能可见，并反馈按钮换行与表头文字层级问题；已调整按钮为单行小字号，表头文字改为普通深色。

回滚说明：

- 如需回滚，移除 `CustomerInformationPanel` 的 Special Handling 入口、`CustomerInformationCard` 中的弹框状态和 `BaseModal` 内容，并删除对应样式。

当前风险点：

- 后续如接真实客户 API，需要在当前弹框入口后替换静态表格数据，并补充加载、失败和空状态策略。

### 2026-07-21 14:46 +08:00 - 简化坐席签入并接入默认状态配置

修改页面或文件：

- `src/layouts/components/AgentProfileArea.tsx`
- `src/layouts/BasicLayout.tsx`
- `src/store/callManagementStore.ts`
- `src/pages/call-management/GlobalControlConfigurationPage.tsx`
- `src/mock/globalControlConfiguration.ts`
- `PROJECT_CONTEXT.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `BUSINESS_RULES.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 客户要求坐席不再选择 Voice only / Digital only / Voice + Digital，点击 Sign In 后由系统完成能力选择。
- 客户要求 Sign In 后的默认状态使用 Global Control Configuration 的 `Status after Sign-in`，默认值改为 Not Ready。

修改结果：

- 未签入个人菜单仅保留 `Sign In`，签入后不再显示服务模式。
- 当前演示账号在内部保留原 Voice + Digital 等效能力；本次未新增 Employee Profile 绑定技能与媒体能力映射。
- Global Control Configuration 保存和 Reset to Default 现在更新共享内存配置，后续签入按已保存的 Ready / Not Ready 初始化；默认值为 Not Ready。
- Not Ready 签入不创建 Live Chat 当前会话，首次切换 Ready 时才打开并填充默认 Live Chat 演示会话。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 bundle size warning。
- 本地浏览器烟测 `http://127.0.0.1:5173/` 已通过：未签入菜单仅显示 Sign In；默认签入显示 Not Ready 且不打开 Live Chat；切换 Ready 后出现 Live Chat 和 2 个默认会话；保存 Status after Sign-in = Ready 后下一次签入显示 Ready；Reset to Default 后字段恢复 Not Ready。

回滚说明：

- 如需回滚，恢复 AgentProfileArea 的服务模式菜单、BasicLayout 的模式参数签入路径，并将 Global Control Configuration 恢复为页面局部状态和默认 Ready。

当前风险点：

- 绑定技能尚未提供 Voice / Text 媒体能力字段；未来接入真实技能路由时需替换当前隐藏的固定全渠道能力。

### 2026-07-21 15:10 +08:00 - 坐席状态菜单矩阵与状态展示

修改页面或文件：

- `src/layouts/components/AgentProfileArea.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DESIGN_SYSTEM.md`
- `DEV_LOG.md`

修改原因：

- 客户明确坐席个人菜单应按 Unsigned、Not Ready、Ready、Pre-AUX、AUX 的实际状态展示，移除无业务意义的 `Signed in` 项。
- 客户要求在团队名称后直接展示当前状态，便于在不打开菜单时辨识坐席可服务状态。

修改结果：

- Unsigned 显示 Sign In / Settings；Not Ready 显示当前状态 / Ready / Sign Out / Settings；Ready 显示当前状态 / AUX 原因 / Settings；Pre-AUX 隐藏 Sign Out；AUX 恢复 Sign Out。
- 团队行显示 `PBK BSB | {status}`；AUX 和 Pre-AUX 在展示层使用冒号格式，内部状态值及自动转 AUX 逻辑不变。
- 当前演示仍按语音与文字同时签入，完整话务条保持显示；未扩展未来仅文字坐席的技能能力模型。

验证：

- `npm run lint` 已通过。
- `npx tsc --noEmit` 已通过。
- `npm run build` 已通过；仅保留既有 bundle size warning。
- 本地浏览器烟测确认团队行显示 `PBK BSB | Unsigned`。当前浏览器自动化会话未能展开 Ant Design 下拉层；完整 Unsigned / Not Ready / Ready / Pre-AUX / AUX 菜单流仍建议在客户演示前手工点验。

回滚说明：

- 如需回滚，恢复 AgentProfileArea 的原通用签入菜单和团队行仅显示团队名称。

当前风险点：

- 当前状态菜单规则为前端演示状态机；真实多渠道坐席权限仍需以后端技能绑定为准。

### 2026-07-21 16:35 +08:00 - 顶栏操作区溢出防护

修改页面或文件：

- `src/layouts/components/AgentProfileArea.tsx`
- `src/styles/index.less`
- `DESIGN_SYSTEM.md`
- `CURRENT_STATUS.md`
- `DEV_LOG.md`

修改原因：

- 长 Pre-AUX / AUX 原因会扩展个人资料宽度，与居中的话务条重叠，并挤压通知、内部聊天和退出操作。

修改结果：

- Header 改为品牌、话务条、右侧操作区三列布局，话务条不再以绝对定位覆盖个人资料。
- 个人资料姓名与团队/状态各自使用更紧凑的固定宽度、单行省略；不再通过悬浮提示展开完整文本，使头像菜单保持靠近右侧原有位置。
- 960px 以下的话务条切换为图标优先，隐藏按钮文字与通话标识，保留可点击按钮、现有 title 和右侧操作区。
- 下拉菜单首项保留为只读状态文本，省去 `Current status` 前缀以减少菜单占用空间。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅保留既有 bundle size warning。
- 本地浏览器截图已检查 711px、960px、1366px：品牌与右侧通知、内部聊天、个人资料、退出操作区不重叠。
- 当前浏览器自动化会话无法经 Ant Design 个人下拉层构造长 Pre-AUX 状态；该状态下的最终像素检查仍建议在客户演示前手工点验。

回滚说明：

- 如需回滚，恢复 Header 的 flex/绝对话务条布局，并移除个人资料固定宽度与文本截断。

当前风险点：

- 极窄移动端不属于当前坐席桌面演示目标；仍需以目标客户演示分辨率验证活跃通话下的所有话务按钮。

### 2026-07-29 14:38 +08:00 - 坐席状态改为个人菜单单向切换

修改页面或文件：

- `src/layouts/components/AgentToolbar.tsx`
- `src/layouts/BasicLayout.tsx`
- `BUSINESS_RULES.md`
- `DESIGN_SYSTEM.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DECISION_LOG.md`
- `DEV_LOG.md`

修改原因：

- 客户要求坐席签入后以 Not Ready 起始，切换到 Ready 后不能再手工切回 Not Ready，只能选择 AUX。

修改结果：

- 移除话务条的 Ready / Not Ready 双向切换按钮。
- 右侧个人菜单仍在 Not Ready、Pre-AUX 和 AUX 状态提供 Ready；Ready 状态只提供 AUX 原因，不提供 Not Ready。
- 首次从 Not Ready 切换到 Ready 的默认 Live Chat 页签和会话初始化，改由个人菜单状态转换保留。
- Pre-AUX 在电话/视频通话结束时不再绕过 ACW：先转为 Not Ready 并完成当前 ACW 倒计时，再自动进入预设的 AUX 原因；Pre-AUX 期间选择 Ready 会取消预设。工具条和个人资料仍显示 Not Ready，保持既有演示文案。
- 工具条计时在状态开始时间切换时立即重置刷新基准，并由 1 秒全局节拍改为 250ms 校准，避免 ACW 前两秒停留过久而使 10 秒配置视觉上缩短。
- 默认 Live Chat 演示会话仍视为服务，Ready 时选择 AUX 会进入 Pre-AUX。Pre-AUX 通话挂机后的 ACW 期间，工具条显示 Not Ready，右上角个人资料保留 Pre-AUX 原因；ACW 结束后自动进入对应 AUX。

验证：

- `git diff --check`、`npm run lint`、`npm run build` 已通过；构建仅有既有 large chunk warning。
- `git diff --check`、`npm run lint`、`npm run build` 已通过；构建仅有既有 large chunk warning。
- PSTN 浏览器烟测已通过：通话中选择 `Break` 显示 `Pre-AUX: Break`；挂机后右上角继续显示 `Pre-AUX: Break`，工具条显示 `Not Ready 00:00`；约 10 秒 ACW 后显示 `AUX: Break`。Pre-AUX 中选择 Ready 会立即取消预设并恢复 Ready。
- ACW 计时采样已通过：挂机后 `00:00`、`00:01`、`00:02` 分别出现在 0、1.1、2.1 秒，前两秒不再因旧的全局 1 秒刷新节拍而滞后。

回滚说明：

- 恢复 `AgentToolbar` 的 Ready / Not Ready 按钮与 `BasicLayout` 的双向切换回调，即可恢复旧行为。

当前风险点：

- 当前状态流仍为前端 demo 状态机；真实生产坐席状态切换需要 CTI / 路由后端确认。

### 2026-07-29 15:13 +08:00 - 黑名单仅保留批量新增

修改页面或文件：

- `src/pages/call-management/BlacklistManagementPage.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DEV_LOG.md`

修改原因：

- 用户要求在 Call Management > Blacklist 移除单个新增入口，只保留批量添加功能。

修改结果：

- 工具栏仅保留 `Batch Add` 与批量删除操作。
- 新增弹窗固定为 `Batch Add Blacklist`，号码输入固定使用分号分隔的多行文本框。
- 移除单个新增模式及其表单分支；批量新增、重复去重、有效期、备注和删除逻辑保持不变。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅有既有 large chunk warning。
- 浏览器烟测已通过：`/call-management/blacklist` 工具栏仅显示一个 `Batch Add` 新增入口，不存在精确名为 `Add` 的单个新增按钮；点击后弹出 `Batch Add Blacklist`，号码输入为分号分隔的多行文本框。

回滚说明：

- 恢复黑名单页单个新增按钮和 `single` 弹窗分支即可恢复旧交互。

当前风险点：

- 黑名单仍为本地前端演示数据，刷新页面会重置。

### 2026-08-01 11:13 +08:00 - 黑名单批量新增支持状态选择

修改页面或文件：

- `src/pages/call-management/BlacklistManagementPage.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DEV_LOG.md`

修改原因：

- 用户要求黑名单新增弹窗也提供状态字段，并默认启用。

修改结果：

- `Batch Add Blacklist` 在 Restriction Policy 后提供 Status 开关，默认显示 Enabled。
- 保存时每条由本次批量新增生成的记录均采用该开关所选状态，不再固定写入 Enabled。
- 列表现有的 Status 开关和状态筛选保持不变。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅有既有 large chunk warning。
- 浏览器烟测已通过：新增弹窗默认显示已启用；切换为 Disabled 并保存后，新建 Bankapp 记录在列表中显示 Disabled。

回滚说明：

- 移除 Batch Add 的 Status 字段并将保存状态恢复固定为 `Active`，即可回退。

当前风险点：

- 黑名单仍为本地前端演示数据，刷新页面会重置。

### 2026-08-01 11:20 +08:00 - 黑名单列表独立显示国家码

修改页面或文件：

- `src/pages/call-management/BlacklistManagementPage.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DEV_LOG.md`

修改原因：

- 用户要求黑名单列表显示 Country Code 字段，且非 Phone 渠道固定显示 `-`。

修改结果：

- 列表在 Channel 后新增 Country Code 列。
- Phone 记录显示保存的国家码，其他渠道显示 `-`；Phone Identifier 仅显示实际号码，避免重复国家码。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅有既有 large chunk warning。
- 浏览器烟测已通过：Phone 记录的 Country Code 显示 `062` 且 Identifier 仅显示实际号码；WhatsApp 与 Bankapp 记录的 Country Code 显示 `-`。

回滚说明：

- 移除 Country Code 列并恢复 Phone Identifier 拼接展示即可回退。

当前风险点：

- 黑名单仍为本地前端演示数据，刷新页面会重置。

### 2026-07-31 14:29 +08:00 - 黑名单状态列改为直观开关

修改页面或文件：

- `src/pages/call-management/BlacklistManagementPage.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `CURRENT_TODO.md`
- `DEV_LOG.md`

修改原因：

- 客户要求移除黑名单行尾的启用/禁用按钮，改为直接在 Status 栏展示并操作状态。

修改结果：

- 删除 Actions 列及 Enable / Disable 按钮。
- Status 列改为紧凑开关加 Enabled / Disabled 文案，切换后立即更新当前演示状态并保留成功反馈和状态筛选。
- 该客户确认的 Blacklist 例外允许状态开关出现在列表中；其他管理页仍遵循既有开关位于表单/弹窗内的规则。

验证：

- `npm run lint`、`npm run build` 已通过；构建仅有既有 large chunk warning。
- Browser smoke 已通过：Blacklist 表格不再显示 Actions 列；Status 单元格同时显示开关与 Enabled / Disabled 文案，点击原 Disabled Phone 记录的开关后立即变为 Enabled 并显示成功反馈。

回滚说明：

- 恢复 StatusBadge 与固定右侧 Actions 列中的 Enable / Disable 按钮即可回退。

当前风险点：

- 黑名单状态仍为本地前端演示状态，刷新页面会重置。

### 2026-07-30 18:48 +08:00 - 黑名单状态、Phone 专用录入与 Reason 对齐

修改页面或文件：

- `src/pages/call-management/BlacklistManagementPage.tsx`
- `src/pages/call-management/PriorityListManagementPage.tsx`
- `src/types/blacklist.ts`、`src/types/priorityList.ts`
- `src/mock/blacklist.ts`、`src/mock/priorityList.ts`
- `src/store/callManagementStore.ts`
- `BUSINESS_RULES.md`、`CURRENT_STATUS.md`、`CURRENT_TODO.md`、`DEV_LOG.md`

修改原因：

- 客户确认黑名单需要逐条启用/禁用，Phone 需要国家码和实际号码分开录入，且黑名单与优先名单的 Remark 统一改为必填 Reason。

修改结果：

- 黑名单新增 Status 筛选、StatusBadge 与逐条 Enable / Disable 操作；新记录默认 Enabled，禁用记录保留在管理列表中。
- Phone 是独立批量模式，国家码默认 `062` 且可修改；Phone 与其他渠道不能同批，实际电话号码按原样保存。非 Phone 维持多渠道 Identifier 批量新增。
- 黑名单与优先名单的类型、mock、表格、弹窗、校验与保存字段统一从 `remark` 改为必填 `reason`。

验证：

- `npm run lint`、`npm run build` 已通过；构建仅有既有 large chunk warning。
- Browser smoke 已通过：Blacklist 显示 Status / Reason 列、逐条 Enable 后显示成功反馈、Enabled 筛选可用；Phone 默认 `062` 可改为 `063`，两个实际号码新增为两条独立 Phone 记录，其他渠道选项处于禁用状态。
- Browser smoke 已通过：Priority List 显示 Reason 列和必填字段；空提交同时提示 Channel、Identifier 和 Reason 必填。

回滚说明：

- 恢复黑名单的无状态单一 Identifier 数据模型和两个页面的 `remark` 字段即可回退。

当前风险点：

- 黑名单状态目前只在管理页生效；当前前端演示尚未在来话、转接或客户流程中消费黑名单规则。

### 2026-07-29 22:15 +08:00 - Customer Production Release

修改页面或文件：

- Release commit `1dea72b` (`feat: update agent status and management demo`)
- `DEV_LOG.md`

修改原因：

- 发布当前工作区的全部已验证改动到客户可见生产环境。

修改结果：

- 已将 release commit 推送至 `origin/main`。
- 使用 `vercel --prod --yes --build-env VITE_APP_VISIBILITY_PROFILE=customer --build-env VITE_ENABLE_ADMIN_MENUS=true` 部署生产版本。
- 生产 URL：`https://netinfo-aicc-demo-v2.vercel.app`
- Vercel deployment URL：`https://netinfo-aicc-demo-v2-ovb2t4vhr-wl-demo-s-projects.vercel.app`

验证：

- `npm run lint`、`npm run build`、`git diff --check` 已通过；构建仅有既有 large chunk warning。
- 生产 URL 返回 HTTP 200，页面标题为 `BANK 1 AICC Demo`。
- 浏览器烟测通过：登录页正常加载；客户可见配置下侧栏仅显示 Channel Simulation、Monitoring、AI、Call Management 和 Routing Config，Employee Management 与 Design System 未暴露。

回滚说明：

- 在 Vercel 将生产别名回退到前一个成功部署，或重新部署此前的 Git commit `9645a8e`。

当前风险点：

- 仍保留既有 Vite large chunk warning；当前发布为前端 mock demo，不包含后端持久化或真实渠道集成。

### 2026-07-29 15:38 +08:00 - 黑名单必填字段与 Identifier 术语对齐

修改页面或文件：

- `src/pages/call-management/BlacklistManagementPage.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DEV_LOG.md`

修改原因：

- 用户要求黑名单批量新增的渠道下拉框明确为必填，并将限制号码字段名称与 Priority List 统一为 `Identifier`。

修改结果：

- Channel 多选下拉框使用共享必填字段样式，显示必填标识并保留至少选择一个已启用渠道的校验。
- 列表列名、查询字段、弹窗字段、校验提示和成功提示统一使用 `Identifier`；内部数据字段保持兼容。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅有既有 large chunk warning。
- 浏览器烟测已通过：列表、查询和弹窗均显示 `Identifier`；Channel 与 Identifier 均显示必填标识，空提交会提示选择至少一个已启用渠道及输入 Identifier。

回滚说明：

- 恢复黑名单页原有标签和普通表单字段即可回退显示文案与必填样式。

当前风险点：

- 黑名单仍为本地前端演示数据，刷新页面会重置。

### 2026-07-29 15:32 +08:00 - 黑名单批量新增支持多选渠道

修改页面或文件：

- `src/pages/call-management/BlacklistManagementPage.tsx`
- `BUSINESS_RULES.md`
- `CURRENT_STATUS.md`
- `DEV_LOG.md`

修改原因：

- 用户要求 Call Management > Blacklist 的批量新增渠道支持多选。

修改结果：

- `Batch Add Blacklist` 的 Channel 改为多选控件，不预选渠道并保留必填校验。
- 保存时按所选渠道与去重后的受限号码生成组合记录；记录编号连续递增。
- 现有单渠道筛选、记录字段、有效期、备注和批量删除逻辑保持不变。

验证：

- `npm run lint` 已通过。
- `npm run build` 已通过；仅有既有 large chunk warning。
- 浏览器烟测已通过：在 `Batch Add Blacklist` 同时选择 `Bankapp` 和 `Webchat`，输入两个分号分隔号码后页面提示新增 4 条，并正确生成四个 Channel + Restricted Number 组合记录。

回滚说明：

- 将渠道字段恢复为单选并按号码单层创建记录，即可恢复原行为。

当前风险点：

- 黑名单仍为本地前端演示数据，刷新页面会重置。
