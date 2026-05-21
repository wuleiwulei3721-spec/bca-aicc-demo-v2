# Context Snapshot - 2026-05-21 22:12 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统。当前工作在 `codex/videocall-popup` 分支，本轮按浏览器 diff comments 做文案和菜单顺序调整，不改变通话触发逻辑。

## 本次修改

- `Channel Simulation > PSTN / Voice` 改为 `PSTN / Voice Call`。
- Channel Simulation 子菜单顺序调整为：`PSTN / Voice Call`、`Video Call`、`Live Chat`。
- 电话弹屏 workspace tab label 从 `Inbound` 改为 `PSTN / Voice Call`。

## 关键文件

- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite chunk size warning。
- Browser check `/`：菜单顺序为 `PSTN / Voice Call`、`Video Call`、`Live Chat`；点击 `PSTN / Voice Call` 后 tab 文案显示为 `PSTN / Voice Call`。

## 风险

- 本轮只改显示文案和菜单顺序，未调整路由、store 或通话状态机。
- `PSTN / Voice Call` 仍沿用内部 `inbound` key 和 `requestInboundPopup()`，只是对用户展示为电话渠道。
