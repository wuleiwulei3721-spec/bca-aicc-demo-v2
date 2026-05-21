# Context Snapshot - 2026-05-21 12:22 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统。当前主 Workspace 视觉已回到旧版稳定样式，CRM 与 Assistant 区域优先显示客户截图，并要求截图完整等比适配面板。

## 本次修改

- CRM/Assistant 截图显示方式从裁切铺满调整为完整等比包含。
- `.inbound-system-shot > img` 使用 `object-fit: contain` 和 `object-position: top center`。
- 面板仍约束图片为 `width: 100%`、`height: 100%`，图片不会撑大页面或改变布局。

## 关键文件

- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`
- `.codex-backup/key-prompts.md`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite chunk size warning。
- CRM 图片 URL：HTTP 200，`image/jpeg`。
- Assistant 图片 URL：HTTP 200，`image/jpeg`。
- `dist/screenshots/` 中包含两张截图。

## 风险

- 当前 Codex in-app browser pane 不可用，尚未完成截图级页面验收。
- `contain` 会保留完整图片，面板比例不同于图片比例时会出现留白，这是为避免裁切和变形的预期结果。
