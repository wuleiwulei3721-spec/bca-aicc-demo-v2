# Context Snapshot - 2026-05-21 12:15 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统，核心是企业级客服坐席工作台。当前主 Workspace 视觉已回到旧版稳定样式，CRM 与 Assistant 区域应优先显示客户提供的截图资源。

## 本次修改

- 找回并恢复 CRM 与 Assistant 客户截图资源。
- 新增 `public/screenshots/crm-workspace.jpg`。
- 新增 `public/screenshots/assistant-workspace.jpg`。
- `CrmPanel` 恢复截图优先加载，失败时显示 BANK 1 CRM fallback。
- `AssistantPanel` 恢复截图优先加载，失败时显示 BANK 1 Assistant fallback。
- `.inbound-system-shot` 恢复为图片加载成功后显示截图，fallback 作为兜底。

## 关键文件

- `public/screenshots/crm-workspace.jpg`
- `public/screenshots/assistant-workspace.jpg`
- `src/pages/inbound/components/CrmPanel.tsx`
- `src/pages/inbound/components/AssistantPanel.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## 验证

- `http://127.0.0.1:5175/screenshots/crm-workspace.jpg`：HTTP 200，`image/jpeg`。
- `http://127.0.0.1:5175/screenshots/assistant-workspace.jpg`：HTTP 200，`image/jpeg`。
- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite chunk size warning。

## 风险

- 当前 Codex in-app browser pane 不可用，尚未完成截图级页面验收。
- 当前工作区仍有较多历史未提交改动，不能用破坏性 Git 命令整体回滚。
