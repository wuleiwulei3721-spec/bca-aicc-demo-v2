# BANK 1 AICC Demo V2 - 开发日志

最后更新：2026-07-14 09:48 +08:00
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
