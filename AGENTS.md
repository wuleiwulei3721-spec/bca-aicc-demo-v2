# BANK 1 AICC Demo V2 - 项目级 AI 开发规则

适用范围：本文件位于仓库根目录，规则适用于当前项目全部目录与文件。未来所有 Codex 会话进入本项目后，必须先读取本文件，再读取 `PROJECT_CONTEXT.md` 和 `DEV_LOG.md`，然后才能开始修改。

本文件用于把项目开发规范固化到仓库内，避免规则只存在于 Codex sidebar、聊天历史、账号状态或 UI 缓存中。

## 1. 项目背景

### 当前项目用途

`bca-aicc-demo-v2` 是一个银行 AICC 前端演示系统，面向企业级客服坐席工作台场景。核心演示目标是 BANK 1 风格的 Inbound 电话来电弹屏、坐席状态机、话务工具条、CRM workspace、AI Assistant、客户资料、工单与下一步行动建议。

该项目不是 Vite 默认模板，而是已经多轮迭代的业务 demo。新增功能时应保持企业级银行客服系统的工作台气质：信息密度高、交互明确、视觉克制、适合演示和重复操作。

### 技术栈

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

### 页面结构

当前路由：

- `/` -> `BasicLayout` -> `AgentWorkspace`
- `/design-system` -> `BasicLayout` -> `DesignSystem`
- `*` -> 重定向到 `/`

关键结构：

- `src/App.tsx`：Ant Design `ConfigProvider` 与 `RouterProvider`。
- `src/routes.tsx`：路由定义。
- `src/layouts/BasicLayout.tsx`：全局 Header、侧栏、坐席状态、话务工具条、内部聊天入口和主内容出口。
- `src/pages/AgentWorkspace.tsx`：Home tab 与 Inbound tab 容器。
- `src/pages/inbound/InboundPage.tsx`：核心 Inbound 三栏工作台。
- `src/pages/inbound/components/*`：Inbound 页面卡片、CRM、Assistant、弹窗和业务组件。
- `src/pages/DesignSystem.tsx`：设计系统展示页。
- `src/components/*`：基础组件与兼容组件。
- `src/mock/*`：演示数据。
- `src/types/*`：业务类型。
- `src/store/appStore.ts`：workspace tab 与 inbound popup 全局状态。
- `src/styles/index.less`、`src/styles/tokens.less`、`src/styles/theme.ts`：全局样式、设计 token 与 Ant Design 主题。

Inbound 当前是核心页面，采用三栏：

- Left：Customer Information、Customer Journey、Ticketing History、Next Best Action、Quick Action。
- Center：CRM workspace，包含固定 CRM tab 和动态业务 tabs。
- Right：Assistant 与 Connection 状态。

### 当前开发方向

- 优先稳定 Inbound 工作台的演示体验。
- 优先复用 `/design-system` 已沉淀的基础组件、设计 token 和主题能力。
- 继续完善 CRM/Assistant 截图资源、fallback、弹窗和业务 tab 交互。
- 继续处理英文 UI 框架与印尼语业务内容的最终语言口径。
- 后续新增 Online Chat、Video Call、Dashboard、Admin、Supervisor 等页面时，必须基于现有设计系统扩展。
- 项目上下文、TODO、风险和恢复线索必须持续落盘，不依赖 Codex sidebar 历史。

## 2. 强制开发规则

### 新会话启动规则

任何新的 Codex 会话进入当前项目时，必须按顺序执行：

1. 阅读 `AGENTS.md`。
2. 阅读 `PROJECT_CONTEXT.md`。
3. 阅读 `DEV_LOG.md` 中最近记录。
4. 阅读 `.codex-backup/` 下最新一组 `context-snapshot-*`、`current-todo-*`、`page-state-*`。
5. 执行 `git status --short --branch`，确认工作区是否已有用户或历史会话留下的改动。
6. 再读取与当前任务相关的源码文件。

禁止在未恢复上述上下文前，从零假设项目结构或重建业务规则。

### 修改后的文档同步规则

以后每次发生以下任一实际修改，必须同步更新 `PROJECT_CONTEXT.md` 和 `DEV_LOG.md`：

- 修改页面。
- 修改组件。
- 修改接口、类型、mock 数据结构或服务契约。
- 修改 prompt、业务话术、演示口径或关键需求摘要。
- 完成功能。
- 修复 bug。
- 修改路由、状态机、全局状态、布局、设计 token、主题或部署配置。

`PROJECT_CONTEXT.md` 至少要更新：

- 最后更新时间。
- 当前开发状态。
- 页面结构或模块职责变化。
- 已完成模块。
- 已知风险。
- TODO。

`DEV_LOG.md` 至少要新增：

- 修改时间。
- 修改页面或文件。
- 修改原因。
- 修改结果。
- 回滚说明。
- 当前风险点。

如果只是只读分析、运行命令或回答问题，没有修改项目文件，可以不更新这两个文件，但最终回答必须说明未修改文件。

### 开发约束

- 不要覆盖或回滚用户已有改动，除非用户明确要求。
- 业务页面优先使用现有设计系统组件和 Less token。
- 新增接口或 mock 字段时，必须同步更新对应 TypeScript 类型。
- 新增页面时，必须确认路由、布局、状态入口、样式作用域和设计系统复用关系。
- 修改 Inbound 相关逻辑时，必须关注 `BasicLayout` 状态机、`appStore`、`AgentWorkspace`、`InboundPage` 和子组件之间的联动。
- 修改 prompt 或业务话术时，必须同步更新 `.codex-backup/key-prompts.md` 或对应恢复摘要。
- 不要在仓库、备份目录或日志中保存密钥、token、账号密码、真实客户敏感数据。

## 3. 自动备份规则

每次重大修改后，必须在 `.codex-backup/` 下新增一组备份文件：

```text
.codex-backup/context-snapshot-YYYY-MM-DD-HHMM.md
.codex-backup/current-todo-YYYY-MM-DD-HHMM.md
.codex-backup/page-state-YYYY-MM-DD-HHMM.md
```

重大修改包括但不限于：

- 完成一个页面、工作流或核心交互。
- 大幅修改组件结构、布局、全局样式、设计 token 或主题。
- 修改路由、状态机、store、接口类型、mock 数据结构。
- 修改关键 prompt、演示口径、业务规则或上下文恢复机制。
- 修复影响主流程的 bug。
- 完成一次可交付需求。

备份内容要求：

- `context-snapshot-*`：记录项目目标、技术栈、当前状态、关键文件、最近修改和风险。
- `current-todo-*`：记录 P0/P1/P2 TODO，明确哪些是阻塞项。
- `page-state-*`：记录路由、页面、核心交互、资源状态和验证状态。

如涉及 prompt、恢复策略或关键需求变化，还必须同步更新：

- `.codex-backup/key-prompts.md`
- 或新增 `session-restore-summary-*` / `rollout-recovery-result-*`

## 4. 会话恢复规则

如果出现以下情况：

- session、sidebar 或 history 丢失。
- 更换 Codex 账号。
- Codex UI 异常。
- 当前聊天上下文缺失或被压缩。

必须优先执行恢复流程：

1. 阅读 `AGENTS.md`、`PROJECT_CONTEXT.md`、`DEV_LOG.md`。
2. 阅读 `.codex-backup/` 最新备份。
3. 扫描 Codex session rollout 文件，而不是重新从零分析项目。
4. 将恢复出的有效上下文写回 `PROJECT_CONTEXT.md`。
5. 在 `DEV_LOG.md` 记录恢复来源、恢复结果、风险和回滚说明。

可优先检查的位置：

```text
$env:CODEX_HOME\sessions\
$env:USERPROFILE\.codex\sessions\
项目内 .codex\sessions\（如果存在）
```

恢复时优先查找与 `D:\03projects\bca-aicc-demo-v2`、`bca-aicc-demo-v2`、`BANK 1 AICC`、`Inbound`、`AgentWorkspace`、`PROJECT_CONTEXT.md`、`DEV_LOG.md` 相关的 rollout 记录。

禁止在已有恢复材料可用时重新从零推断项目背景。

## 5. 输出规范

每次重大修改后的最终回复必须总结：

- 修改内容。
- 影响范围。
- 风险点。
- TODO。
- 已运行的验证命令；如果未运行，也必须说明。

如果修改了页面或前端交互，应尽量执行：

```bash
npm run lint
npm run build
```

需要浏览器验证时，应检查：

- `/`
- `/design-system`
- 受影响的页面、弹窗或交互路径。

如果本轮只修改文档，可以不运行前端构建，但最终回复必须说明原因。


