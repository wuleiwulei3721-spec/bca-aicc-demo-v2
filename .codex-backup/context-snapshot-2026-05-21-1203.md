# Context Snapshot - 2026-05-21 12:03 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统，核心是企业级客服坐席工作台。当前重点仍是 Inbound 电话来电弹屏、CRM workspace、AI Assistant、客户资料、工单、下一步行动建议、坐席状态机和话务工具条。

## 本次修改

- 按用户纠偏要求恢复主 Workspace 视觉到本次 Workspace 视觉重构之前的稳定版本。
- 保留 `BANK 1` 品牌替换，不恢复旧品牌字样或 Logo。
- 恢复顶部蓝色渐变 Header、旧版浅色应用背景、旧版 Customer Information 高亮卡片、主页面业务卡片层级和 Agent Toolbar 半透明话务条。
- `/design-system` 色彩展示恢复旧版 Gradient Blue、Background、Card Background 等 token 口径，保留 `BANK 1 AICC`。
- 本轮没有继续优化或重构 Modal/Dialog；相关代码状态暂不作为本轮目标。

## 关键文件

- `src/styles/tokens.less`
- `src/styles/index.less`
- `src/pages/DesignSystem.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite chunk size warning。
- `http://127.0.0.1:5175/`：HTTP 200。
- `rg` 检查旧品牌可见文案：未发现旧品牌残留。
- in-app browser 当前没有可用 pane，未完成截图级可视验收。

## 风险

- 当前工作区仍有较多历史未提交改动，不能用破坏性 Git 命令整体回滚。
- Modal/Dialog 暂停处理，仍保留上一轮已有样式状态；后续若继续调整，需要单独明确目标。
- 需要后续重新打开浏览器检查 `/` 和 Inbound 主工作台视觉。
