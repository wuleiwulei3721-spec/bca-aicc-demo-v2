# Context Snapshot - 2026-05-21 10:42 +08:00

## 项目目标

`bca-aicc-demo-v2` 是银行 AICC 前端演示系统，核心是 BANK 1 风格的坐席工作台 demo。当前重点是 Inbound 来电弹屏、CRM workspace、AI Assistant、客户资料、工单、下一步行动建议、坐席状态机和话务工具条。

## 本次上下文变化

- 新增 `AGENTS.md`，将项目级 AI 开发规则固化到仓库根目录。
- 更新 `PROJECT_CONTEXT.md`，要求所有新会话先读取 `AGENTS.md`。
- 更新 `DEV_LOG.md`，记录本次规则创建。
- 更新 `.codex-backup/key-prompts.md`，补充项目级 AI 开发规则 prompt。
- 新增本次 snapshot、TODO 和 page-state 备份。

## 技术栈

- React `19.2.6`
- TypeScript `~6.0.2`
- Vite `8.0.12`
- Ant Design `6.4.2`
- React Router DOM `7.15.1`
- Zustand `5.0.13`
- Less `4.6.4`
- ESLint `10.3.0`

## 当前页面结构

- `/` -> `BasicLayout` -> `AgentWorkspace`
- `/design-system` -> `BasicLayout` -> `DesignSystem`
- `*` -> 重定向到 `/`

Inbound 是核心页面：

- Left：Customer Information、Customer Journey、Ticketing History、Next Best Action、Quick Action。
- Center：CRM workspace，支持固定 CRM tab 和动态业务 tabs。
- Right：Assistant 与 Connection 状态。

## 当前工作区状态

当前分支：`main`，跟踪 `origin/main`。

工作区已有未提交业务改动，主要涉及：

- 通用组件和 Modal 细节。
- `BasicLayout`、Agent Toolbar 和多个业务弹窗。
- Inbound 页面、CRM、Assistant、客户信息、业务卡片。
- `src/mock/inbound.ts` 与 `src/types/inbound.ts`。
- `src/styles/index.less` 和 `src/styles/tokens.less`。
- 新增 Contact Management 相关文件。
- 新增 `publiccode-based BANK 1 CRM fallback` 和 `publiccode-based BANK 1 Assistant fallback`。

本次任务只新增和更新文档、备份文件，不修改业务源码。

## 风险

- 未提交业务改动较多，需要避免误回滚。
- 本轮未运行 `npm run lint` 或 `npm run build`。
- 本轮未做浏览器验证。
- 截图资源已存在，但需要在 UI 中确认加载和布局效果。

## 恢复规则

后续任何新会话必须先读：

1. `AGENTS.md`
2. `PROJECT_CONTEXT.md`
3. `DEV_LOG.md`
4. `.codex-backup/` 最新 snapshot、TODO、page-state

如果 session/sidebar/history 丢失，应优先扫描 rollout session 并更新 `PROJECT_CONTEXT.md`，不要从零分析项目。



