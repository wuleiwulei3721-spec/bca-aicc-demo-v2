# BANK 1 AICC Demo V2 - 开发日志

最后更新：2026-05-21 15:55 +08:00
项目路径：`D:\03projects\bca-aicc-demo-v2`

## 记录规则

每次重要修改都要新增日志，至少记录：

- 修改时间。
- 修改页面或文件。
- 修改原因。
- 修改结果。
- 回滚说明。
- 当前风险点。

重要修改包括：完成页面、完成需求、修改架构、修改接口、修改 mock 数据结构、修改关键 prompt、修复关键 bug、调整部署或恢复机制。

## 日志

### 2026-05-21 15:55 +08:00 - 优化侧栏电话图标与收起态浮层关闭

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1555.md`
- `.codex-backup/current-todo-2026-05-21-1555.md`
- `.codex-backup/page-state-2026-05-21-1555.md`

修改原因：

- 用户要求电话图标水平翻转。
- 用户要求收起状态下鼠标移出二级菜单浮层时，或点击菜单后，浮层不继续显示。

修改结果：

- 仅侧栏 `Call Management` 的电话图标增加 `aicc-sider__menu-phone-icon` class，并通过 CSS `scaleX(-1)` 水平翻转。
- 收起态二级菜单浮层改为 hover 打开，并在点击一级/二级菜单后通过 `closedFlyoutKey` 抑制当前浮层显示。
- 鼠标移出当前一级菜单与浮层区域后，关闭抑制状态重置，后续再次悬浮可正常打开。

回滚说明：

- 如需回滚本轮细化，移除 `aicc-sider__menu-phone-icon` class/CSS，并恢复 `.aicc-sider__flyout` 的展示规则及 `closedFlyoutKey` 相关逻辑。

当前风险点：

- 本轮只处理鼠标交互关闭逻辑，未新增完整键盘导航行为。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 已通过本地浏览器 smoke check `/`，确认页面可加载、侧栏默认收起、`Call Management` 菜单项存在。

### 2026-05-21 15:39 +08:00 - 细化左侧菜单搜索、英文文案和视觉密度

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1539.md`
- `.codex-backup/current-todo-2026-05-21-1539.md`
- `.codex-backup/page-state-2026-05-21-1539.md`

修改原因：

- 用户要求展开态顶部不要只有独立收起按钮，需要在按钮旁增加菜单搜索。
- 用户要求系统菜单使用英文企业级呼叫中心规范文案。
- 用户要求菜单图标、文字大小、行高和间距贴合当前系统密度，不要与整体风格割裂。

修改结果：

- 展开态侧栏顶部改为紧凑的 Collapse 按钮 + `Search menu` 输入框。
- 收起态不显示搜索框，并在收起时清空搜索条件。
- 菜单文案调整为 Channel Simulation、Agent Center、Operations、Call Management、Reports 等英文用语。
- 菜单主项高度、子项高度、图标尺寸、字体和间距已整体压缩，贴近现有工作台密度。

回滚说明：

- 如需回滚本轮细化，可恢复 `BasicLayout` 中搜索相关 state、过滤逻辑和英文菜单文案，并恢复 `index.less` 中 `.aicc-sider__toggle`、`.aicc-sider__search`、菜单行高和图标尺寸相关样式。

当前风险点：

- 菜单搜索只过滤当前静态菜单项，不涉及路由或权限。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 已通过本地浏览器检查 `/`：展开态搜索可过滤 `Live Chat`，收起态搜索隐藏。
- 已通过本地浏览器检查 `/design-system`：页面可访问，未发现菜单调整影响页面主体。

### 2026-05-21 15:20 +08:00 - 构建左侧系统菜单

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/store/appStore.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/context-snapshot-2026-05-21-1520.md`
- `.codex-backup/current-todo-2026-05-21-1520.md`
- `.codex-backup/page-state-2026-05-21-1520.md`

修改原因：

- 用户要求左侧菜单默认收起，可通过顶部按钮展开/收起。
- 展开态需要显示一级菜单图标和文字，并支持点击一级菜单展开二级菜单。
- 收起态只显示一级图标，悬浮图标时在右侧显示二级菜单选择层。

修改结果：

- `BasicLayout` 的左侧菜单改为项目内自绘菜单结构，保留 Ant Design 图标和现有 `Sider` 容器。
- 菜单已配置为：测试菜单、个人中心、运营管理、呼叫管理、报表；其中前三项包含二级菜单。
- `appStore.collapsed` 默认值改为 `true`，确保进入系统时左侧菜单处于收起状态。
- `index.less` 新增侧栏顶部按钮、展开态二级菜单、收起态图标居中和右侧悬浮菜单样式。

回滚说明：

- 如需回滚本轮菜单，可恢复 `src/layouts/BasicLayout.tsx` 中旧的 Ant Design `Menu` 配置，恢复 `src/store/appStore.ts` 中 `collapsed` 默认值，并删除本轮新增的 `.aicc-sider__*` 菜单样式。

当前风险点：

- 菜单点击目前只维护本地选中态，不绑定业务路由或渠道模拟逻辑。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 已通过本地浏览器检查 `/` 与 `/design-system`，展开态和二级菜单交互正常；收起态浮层支持 hover/focus，自动化侧以 focus 路径确认浮层可见。

### 2026-05-21 12:22 +08:00 - CRM/Assistant 截图完整等比适配面板

修改页面或文件：

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/*`

修改原因：

- 用户要求 CRM 和 Assistant 两张截图完整放入对应框架内。
- 图片不能拉伸或撑大页面布局，也不能变形或显示不完整。

修改结果：

- `.inbound-system-shot > img` 从裁切式显示调整为 `object-fit: contain`。
- 图片保持 `width: 100%`、`height: 100%`，由固定面板约束，不参与撑大页面布局。
- 图片 `object-position` 调整为 `top center`，优先从顶部完整展示。

回滚说明：

- 如需恢复裁切铺满效果，将 `.inbound-system-shot > img` 改回 `object-fit: cover`。
- 当前不建议回滚，因为完整截图展示是本轮明确要求。

当前风险点：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 两个图片 URL 均返回 HTTP 200，且构建产物 `dist/screenshots/` 中包含两张图片。
- in-app browser 当前没有可用 pane，未完成截图级页面验收。

### 2026-05-21 12:15 +08:00 - 恢复 CRM/Assistant 客户截图加载

修改页面或文件：

- `public/screenshots/crm-workspace.jpg`
- `public/screenshots/assistant-workspace.jpg`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/*`

修改原因：

- 用户指出 CRM 和 Assistant 区域应显示之前客户提供的截图，而不是代码 fallback。
- 之前截图资源目录为空，组件也被改成了直接渲染 fallback，导致图片不再显示。

修改结果：

- 已从本机客户资料目录找回 CRM 与 Assistant 截图，并复制到 `public/screenshots/`，使用不含旧品牌的资源文件名。
- `CrmPanel` 恢复为截图优先加载：`/screenshots/crm-workspace.jpg`。
- `AssistantPanel` 恢复为截图优先加载：`/screenshots/assistant-workspace.jpg`。
- 图片加载失败时仍显示 BANK 1 代码 fallback，避免空白。
- `.inbound-system-shot` 恢复为图片加载成功后显示截图，保持原有截图优先逻辑。

回滚说明：

- 如需回滚本次修复，删除两张 `public/screenshots/*.jpg` 并恢复 `CrmPanel.tsx`、`AssistantPanel.tsx`、`src/styles/index.less` 中本次图片加载逻辑。
- 不建议回滚截图优先加载，因为这是当前 CRM/Assistant 的明确展示要求。

当前风险点：

- 两个静态图片 URL 均返回 HTTP 200。
- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- in-app browser 当前没有可用 pane，未完成截图级页面验收。

### 2026-05-21 12:03 +08:00 - 恢复主 Workspace 旧版视觉并保留 BANK 1

修改页面或文件：

- `src/styles/tokens.less`
- `src/styles/index.less`
- `src/pages/DesignSystem.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/*`

修改原因：

- 用户确认上一轮 Workspace 视觉重构方向错误，要求先恢复主页面原有稳定视觉。
- 本轮必须保留旧品牌到 `BANK 1` 的品牌替换，不还原旧品牌。
- 本轮明确不继续调整 Modal/Dialog。

修改结果：

- 顶部 Header 恢复旧版蓝色渐变、白色品牌文字和蓝色工作台阴影。
- App/Workspace 主背景恢复旧版浅色体系，移除主内容区新增的灰蓝大面层、边框和内阴影。
- Customer Information、Ticketing History、Next Best Action、Customer Journey 等主页面卡片恢复旧版白底/浅蓝高亮层级。
- Agent Toolbar 恢复旧版半透明话务条和深蓝 active/selected 状态。
- Design System 色彩展示恢复旧版 Gradient Blue、Background、Card Background 等 token 口径，保留 `BANK 1 AICC` 文案。
- Modal/Dialog 未作为本轮目标继续优化。

回滚说明：

- 如需回滚本次纠偏，仅恢复 `src/styles/tokens.less`、`src/styles/index.less`、`src/pages/DesignSystem.tsx` 中 2026-05-21 12:03 的主视觉回退内容。
- 不要回滚 `BANK 1` 品牌替换，除非用户明确取消保密要求。

当前风险点：

- `npm run lint` 通过。
- `npm run build` 通过，仍保留既有 Vite chunk size warning。
- 本地 `http://127.0.0.1:5175/` 返回 HTTP 200；in-app browser 当前没有可用 pane，未完成截图级可视验收。

### 2026-05-21 11:43 +08:00 - BANK 1 品牌替换与 Workspace Surface Hierarchy

修改页面或文件：

- `index.html`
- `public/favicon.svg`
- `src/layouts/BasicLayout.tsx`
- `src/pages/DesignSystem.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/components/SendEmailModal.tsx`
- `src/mock/inbound.ts`
- `src/styles/tokens.less`
- `src/styles/theme.ts`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/*`

修改原因：

- 用户要求系统可见品牌从旧品牌统一替换为 `BANK 1`。
- 用户要求重新建立 Enterprise Workspace Surface Hierarchy，明确 App Background、Workspace、Card、Modal、Header / Active Surface 的层级。
- 当前 Modal 像独立页面，需要改为轻量企业工作台浮层。

修改结果：

- Header、Browser Title、metadata、Design System、CRM fallback、Assistant fallback、mock 文案和邮件模板已统一为 `BANK 1`。
- `src`、`index.html`、`public` 已无旧品牌可见文案残留。
- 全局 token 新增 L0-L4 surface 语义，并同步 Ant Design theme。
- Header 从重蓝色块改为浅色 L4 active surface。
- `.aicc-content` 形成 L1 Workspace Surface，卡片与 CRM/Assistant 面板形成 L2 Surface。
- Modal 改为 L3 浅灰蓝浮层，header 高度降低，header/body/section 层级更清晰。
- CRM/Assistant 不再加载公开截图，改为代码内 BANK 1 fallback，避免旧品牌截图显示。

回滚说明：

- 若需回滚视觉层级，恢复 `src/styles/tokens.less`、`src/styles/theme.ts`、`src/styles/index.less`。
- 若需回滚品牌替换，恢复上述业务组件、mock 和 metadata 文件，但需重新评估保密要求。
- 若需重新使用真实截图，必须先提供已脱敏的 BANK 1 截图资源，再恢复图片加载逻辑。

当前风险点：

- 浏览器已检查 `/`、`/design-system` 和签入后自动打开的 Inbound DOM；in-app browser pane 在后续 modal 点击验证时不可用，Modal 仍建议继续做一次可视检查。
- 当前仍缺少自动化测试。
- `npm run build` 通过，但 Vite 仍提示 chunk size warning。

### 2026-05-21 10:42 +08:00 - 建立项目级 AI 开发规则

修改页面或文件：

- 新增 `AGENTS.md`
- 更新 `PROJECT_CONTEXT.md`
- 更新 `DEV_LOG.md`
- 更新 `.codex-backup/key-prompts.md`
- 新增 `.codex-backup/context-snapshot-2026-05-21-1042.md`
- 新增 `.codex-backup/current-todo-2026-05-21-1042.md`
- 新增 `.codex-backup/page-state-2026-05-21-1042.md`

修改原因：

- 用户要求为当前项目建立项目级 AI 开发规则，让未来所有 Codex 会话自动继承项目开发规范，而不是只依赖当前聊天上下文或 Codex sidebar 历史。

修改结果：

- `AGENTS.md` 已定义项目背景、技术栈、页面结构、当前开发方向、强制文档同步规则、自动备份规则、会话恢复规则、新会话启动规则和重大修改后的输出规范。
- `PROJECT_CONTEXT.md` 已更新为先读取 `AGENTS.md`，并刷新了当前工作区状态、截图资源状态、TODO 和回滚说明。
- `.codex-backup/` 已新增本次 context snapshot、当前 TODO 和页面状态备份。
- `.codex-backup/key-prompts.md` 已补充本次项目级规则 prompt。

回滚说明：

- 本次没有修改业务源码。
- 如需回滚本次规则创建，删除 `AGENTS.md`，删除 2026-05-21 10:42 的三份备份文件，并恢复 `PROJECT_CONTEXT.md`、`DEV_LOG.md`、`.codex-backup/key-prompts.md` 中本次新增内容。

当前风险点：

- 当前业务源码已有较多未提交改动，本次文档任务未运行 `npm run lint` 或 `npm run build`。
- 本次未启动浏览器验证页面，截图资源虽已存在但未在 UI 中重新验收。

### 2026-05-20 19:18 +08:00 - 建立长期开发上下文管理机制

修改页面或文件：

- 新增 `PROJECT_CONTEXT.md`
- 新增 `DEV_LOG.md`
- 新增 `.codex-backup/README.md`
- 新增 `.codex-backup/context-snapshot-2026-05-20-1918.md`
- 新增 `.codex-backup/current-todo-2026-05-20-1918.md`
- 新增 `.codex-backup/page-state-2026-05-20-1918.md`
- 新增 `.codex-backup/key-prompts.md`
- 新增 `.codex-backup/session-restore-summary-2026-05-20.md`
- 新增 `.codex-backup/rollout-recovery-result-2026-05-20.md`

修改原因：

- 用户要求建立长期开发上下文管理机制，避免 sidebar 丢失、session 消失、切换账号或 Codex UI bug 导致开发上下文丢失。

修改结果：

- 当前项目上下文、页面关系、技术栈、已完成模块、TODO、已知风险和关键 prompt 已落入项目文件。
- `.codex-backup/` 已保存第一版 context snapshot、当前 TODO、页面状态、恢复摘要和 rollout 恢复结果。
- 以后重大修改后应同步更新 `PROJECT_CONTEXT.md`、`DEV_LOG.md` 和 `.codex-backup/`。

回滚说明：

- 本次仅新增文档与备份目录，没有修改业务源码。
- 如需回滚本次机制，删除上述新增文件和 `.codex-backup/` 即可。

当前风险点：

- 当前业务源码已有未提交改动，本次未运行 `npm run lint` 或 `npm run build`。
- 需要后续确认新增文档是否纳入 Git 提交。

### 2026-05-20 - 从 rollout/session 历史恢复上下文

修改页面或文件：

- 新增 `codex-recovered-context.md`

修改原因：

- 之前尝试恢复 Codex sidebar/cache/session 可见性，后来停止修复 UI/cache，转为从 rollout session 文件中提取项目上下文。

修改结果：

- 已识别 13 个与 `bca-aicc-demo-v2` 相关的历史 rollout session。
- 恢复了项目演进脉络、页面结构、已完成功能、当前 dirty changes、TODO 与继续开发建议。

回滚说明：

- `codex-recovered-context.md` 是恢复材料，可保留作为来源文档。
- 如删除该文件，应确保 `PROJECT_CONTEXT.md` 和 `.codex-backup/` 已完整承接其中内容。

当前风险点：

- 文件为 UTF-8 中文，PowerShell 非 UTF-8 读取时可能乱码。

### 2026-05-19 - CRM workspace tabs、截图预留与印尼语业务内容

修改页面或文件：

- `src/mock/inbound.ts`
- `src/pages/inbound/InboundPage.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/LeftColumn.tsx`
- `src/pages/inbound/components/NextBestActionCard.tsx`
- `src/pages/inbound/components/QuickActionCard.tsx`
- `src/pages/inbound/components/TicketingHistoryCard.tsx`
- `src/styles/index.less`
- `src/types/inbound.ts`

修改原因：

- Demo Enhancement & Localization。
- 将部分业务内容切换为印尼语。
- 将 CRM 与 Assistant 区域改为真实截图优先、fallback 兜底。
- 将 CRM 中心区从单一链接状态升级为 workspace tabs。

修改结果：

- 新增 `CrmWorkspaceTab` 类型。
- Ticketing / Next Best Action / Quick Action 可打开动态 CRM 业务 tab。
- CRM 固定 tab 优先加载 `code-based BANK 1 CRM fallback`，缺失时显示 fallback。
- Assistant tab 优先加载 `code-based BANK 1 Assistant fallback`，缺失时显示 fallback。
- 新增 Connection 状态面板。

回滚说明：

- 可按文件粒度回滚上述 10 个业务文件，但必须先确认用户是否仍需要当前改动。

当前风险点：

- 当前 `public/screenshots/` 不存在，两个截图资源尚未补充。
- 这些业务改动当前仍未提交。
- 本轮尚未重新执行 lint/build。

### 2026-05-19 - 修改浏览器标题和 metadata

修改页面或文件：

- `index.html`

修改原因：

- 将浏览器标题和 metadata 调整为 `BANK 1 AICC Demo`。

修改结果：

- 当前浏览器标题与演示品牌口径对齐。

回滚说明：

- 如需回滚，恢复 `index.html` 中 title 和 metadata 文案。

当前风险点：

- 无已知技术风险。

### 2026-05-19 - 建立 UI Design System

修改页面或文件：

- `src/pages/DesignSystem.tsx`
- `src/components/*`
- `src/styles/*`

修改原因：

- 为后续 Online Chat、Video Call、Dashboard、Admin、Supervisor 等页面建立统一组件与视觉规范。

修改结果：

- 新增 `/design-system` 页面。
- 建立 Base 组件体系，包括 BaseButton、BaseCard、BaseModal、BaseTable、BaseTabs、StatusBadge、ToolbarButton、SearchInput、TimelineFlow、CustomerInformationPanel。
- 旧 AppButton/AppCard/AppTable 兼容代理到新 Base 组件。

回滚说明：

- 不建议整体回滚。后续页面应复用该设计系统。

当前风险点：

- 大规模样式调整后需要持续通过浏览器验证页面无重叠和溢出。

### 2026-05-19 - GitHub 与 Vercel 部署配置

修改页面或文件：

- `DEPLOY.md`
- `vercel.json`
- Git remote `origin`

修改原因：

- 为项目部署到 Vercel 做配置。

修改结果：

- GitHub remote：`https://github.com/wuleiwulei3721-spec/bca-aicc-demo-v2.git`
- `vercel.json` 将路由重写到 `index.html`，避免 React Router 刷新 404。
- `DEPLOY.md` 记录 Vercel 推荐配置。

回滚说明：

- 如不使用 Vercel，可删除或修改 `vercel.json`。

当前风险点：

- `DEPLOY.md` 为 UTF-8 中文，读取时需注意编码。

### 2026-05-16 至 2026-05-18 - Inbound 工作台与 AICC 交互

修改页面或文件：

- `src/layouts/BasicLayout.tsx`
- `src/layouts/components/*`
- `src/pages/AgentWorkspace.tsx`
- `src/pages/inbound/*`
- `src/mock/*`
- `src/types/*`
- `src/styles/index.less`

修改原因：

- 构建银行 AICC 坐席工作台 demo。
- 实现 Inbound 电话来电弹屏、坐席状态机、话务状态机、客户资料、业务卡片和辅助弹窗。

修改结果：

- 完成 Home / Inbound tabs。
- 完成 Inbound 三栏布局。
- 完成 Customer Information、Customer Verification、Customer Journey、Ticketing History、Next Best Action、Quick Action。
- 完成 Transfer、Outbound Call、Internal Chat、Toolbar Settings、Call Flow Detail、Send Email 等弹窗。
- 完成 Ready、Incoming、Talking、Hold、Mute、Hang Up 和 ACW 状态流转。

回滚说明：

- 这是当前 demo 的主体，不建议整体回滚。
- 若需回滚单个交互，应先确认 `BasicLayout` 状态机、store 和 Inbound 页面之间的联动关系。

当前风险点：

- 页面交互多，缺少自动化测试，需要靠 lint/build 和浏览器 smoke check 验证。

### 2026-05-16 - 工程初始化与基础布局

修改页面或文件：

- Vite React TypeScript 工程文件。
- `src/App.tsx`
- `src/main.tsx`
- `src/routes.tsx`
- 基础 layout、store、styles、components、mock、types。

修改原因：

- 创建企业级前端 demo 工程骨架。

修改结果：

- 项目技术栈确定为 React + TypeScript + Vite + Ant Design + React Router + Zustand + Less。
- 建立基本目录结构、主题和路由。

回滚说明：

- 这是项目基础，不建议回滚。

当前风险点：

- README 仍偏 Vite 模板说明，后续可改为项目说明。


