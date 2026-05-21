# BANK 1 AICC Demo V2 - 长期开发上下文

最后更新：2026-05-21 12:22 +08:00  
项目路径：`D:\03projects\bca-aicc-demo-v2`  
当前目标：主 Workspace 视觉已恢复；CRM 与 Assistant 区域已恢复客户截图优先加载，并采用面板内完整等比显示，保留 `BANK 1` 品牌替换。

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
当前 HEAD：`1d9d9cb update browser title`  
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
- `src/layouts/BasicLayout.tsx`：全局 Header、收起侧栏、坐席工具条、内部聊天入口和主内容出口。
- `src/pages/AgentWorkspace.tsx`：Home tab 与 Inbound tab 容器。
- `src/pages/inbound/InboundPage.tsx`：Inbound 三栏工作台。
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
- 当坐席处于 Ready 且无通话时，系统模拟 2 秒后进入 Incoming 状态，并调用 `requestInboundPopup()`。
- `requestInboundPopup()` 会打开 Inbound tab，并切换 active workspace tab 到 `inbound`。
- Inbound tab 可关闭，关闭后回到 Home tab。
- `/design-system` 独立展示设计规范与基础组件，不参与通话流程。

## 5. 全局布局与状态机

`BasicLayout` 当前包含：

- 顶部蓝色渐变 BANK 1 Header，恢复旧版主工作台视觉。
- 收起侧栏，`collapsedWidth` 为 `48px`。
- 侧栏菜单项：Desktop、Inbound、Voice。
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

- Ready + Idle 时可触发 Inbound。
- Incoming 支持手动 Answer，也支持按 `autoAnswerSeconds` 自动接听。
- Talking 可切换 Hold 或 Mute。
- Hold 和 Mute 有独立累计计时。
- Hang Up 后进入 After Call Work 逻辑：先 Not Ready，约 5 秒后回 Ready。
- Unsigned 或 AUX 状态会重置 call 状态与计时。

## 6. Inbound 工作台

入口文件：`src/pages/inbound/InboundPage.tsx`

Inbound 是当前最核心演示页面，采用三栏结构：

- Left：客户资料与业务卡片。
- Center：CRM workspace。
- Right：Assistant 与连接状态。

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
- Home / Inbound 工作台 tabs。
- 模拟 Inbound 来电触发逻辑。
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

截至 2026-05-21 12:22 +08:00，工作区仍有未提交改动，来源于之前的业务开发、上下文机制建设和本轮视觉/品牌优化。本轮已调整 CRM/Assistant 截图显示方式为面板内完整等比包含；主 Workspace 旧版视觉和 `BANK 1` 品牌替换继续保留。

```text
src/components/BaseModal.tsx
src/components/CustomerInformationPanel.tsx
src/layouts/BasicLayout.tsx
src/layouts/components/AgentToolbar.tsx
src/layouts/components/InternalChatModal.tsx
src/layouts/components/OutboundCallModal.tsx
src/layouts/components/ToolbarSettingsModal.tsx
src/layouts/components/TransferModal.tsx
src/mock/inbound.ts
src/pages/inbound/InboundPage.tsx
src/pages/inbound/components/AssistantPanel.tsx
src/pages/inbound/components/CallFlowDetailModal.tsx
src/pages/inbound/components/CrmPanel.tsx
src/pages/inbound/components/CustomerInformationCard.tsx
src/pages/inbound/components/CustomerVerificationModal.tsx
src/pages/inbound/components/LeftColumn.tsx
src/pages/inbound/components/NextBestActionCard.tsx
src/pages/inbound/components/QuickActionCard.tsx
src/pages/inbound/components/SendEmailModal.tsx
src/pages/inbound/components/TicketingHistoryCard.tsx
src/styles/index.less
src/styles/tokens.less
src/types/inbound.ts
```

当前 tracked diff 统计：

```text
26 files changed, 1643 insertions(+), 342 deletions(-)
```

当前未跟踪文件/目录包括：

```text
.codex-backup/
DEV_LOG.md
PROJECT_CONTEXT.md
codex-recovered-context.md
public/screenshots/
src/pages/inbound/components/ContactManagementModal.tsx
src/pages/inbound/components/contactManagementData.ts
AGENTS.md
```

业务改动主题：

- 本轮保留：BANK 1 品牌替换，移除旧品牌可见文案。
- 本轮纠偏：主 Workspace 视觉回退到视觉重构前稳定版本，包括蓝色渐变 Header、旧版应用背景、Customer Information 高亮卡片、主页面卡片和话务条样式。
- 本轮修复：恢复 CRM/Assistant 截图资源与图片优先加载逻辑，资源路径为 `public/screenshots/crm-workspace.jpg` 和 `public/screenshots/assistant-workspace.jpg`。
- 本轮优化：CRM/Assistant 截图改为 `contain` 等比完整显示，不再裁切或撑大所在面板。
- Modal/Dialog 本轮不继续调整，仍保留上一轮已有代码状态，后续如需处理应另起明确需求。
- 本轮新增：CRM/Assistant 改为代码内 BANK 1 fallback，公开截图资源不再使用。
- 印尼语业务数据与业务话术扩展。
- CRM workspace tabs 与 CRM 动态业务 tab 详情页。
- CRM/Assistant fallback。
- Contact Management 相关弹窗和数据。
- Inbound 三栏样式扩展与弹窗样式优化。
- 通用组件、Modal、Toolbar 与 token 细节调整。

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
- 本轮已重新运行 `npm run lint` 和 `npm run build`，均通过；build 仍有 Vite chunk size warning。
- 当前项目没有自动化测试体系。
- 历史 build 出现过 Vite chunk size warning，但不影响运行。
- `codex-recovered-context.md` 是 UTF-8 中文文件，PowerShell 非 UTF-8 读取时可能显示乱码；应使用 `Get-Content -Raw -Encoding UTF8 codex-recovered-context.md`。
- `DEPLOY.md` 同样应按 UTF-8 读取。
- 不要继续投入时间修复 Codex sidebar/cache/sqlite/session_index，当前策略是把上下文落入项目文件。
- 本轮尝试使用 in-app browser 检查 `/`，但当前没有可用的 Codex browser pane；已通过静态图片 URL 200、本地 HTTP 200、lint 和 build 做验证。后续仍建议重新打开浏览器后检查 `/` 和 Inbound 主工作台。

## 12. TODO

P0：

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


