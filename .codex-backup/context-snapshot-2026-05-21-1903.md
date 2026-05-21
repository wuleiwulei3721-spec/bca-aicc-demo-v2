# Context Snapshot - 2026-05-21 19:03 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统。本轮继续在 `codex/videocall-popup` 分支开发 Video Call 来电弹屏，并保持 `main` 不直接修改。

## 本次修改

- 新增 `InteractionWorkspace`，让 PSTN/Voice 电话弹屏和 Video Call 弹屏共用三栏工作台、CRM tabs、Assistant 与左侧业务卡片。
- `InboundPage` 改为电话弹屏 wrapper；新增 `VideoCallPage` 作为视频弹屏 wrapper。
- `appStore` 新增 Video Call tab open/close/request 状态。
- `AgentWorkspace` 新增可关闭的 `Video Call` tab。
- `BasicLayout` 新增 `triggerVideoInboundCall()`，点击 `Channel Simulation > Video Call` 且坐席 Ready/Idle 时进入 Incoming，并打开 Video Call tab。
- `AccessChannel` 新增 `Haloapps Video`，Customer Information 显示 `Haloapps` + 视频图标。
- 用户提供的 OpenEye 截图已复制为 `public/screenshots/openeye-video-call.png`。
- 新增 `OpenEyeVideoWindow`，截图以 fixed 高层级浮在 AICC 系统最上层，支持拖动，不添加额外可见标题或说明文案。

## 关键文件

- `src/pages/inbound/InteractionWorkspace.tsx`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/pages/inbound/components/OpenEyeVideoWindow.tsx`
- `src/store/appStore.ts`
- `src/layouts/BasicLayout.tsx`
- `src/pages/AgentWorkspace.tsx`
- `public/screenshots/openeye-video-call.png`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/`：Sign In 后点击 `Video Call` 可打开 Video Call tab，Answer 可用，Customer Information 显示 `Haloapps` + 视频图标，OpenEye 截图浮窗显示且可拖动，关闭 Video Call tab 后浮窗消失。
- Browser smoke check `/`：PSTN/Voice 仍可触发 Inbound 电话弹屏，OpenEye 浮窗不会出现。
- Browser smoke check `/design-system`：页面正常加载。

## 风险

- OpenEye 为截图模拟，不接真实协议和音视频能力。
- 关闭 Video Call tab 不自动 Hang Up，保持与现有 Inbound tab 关闭行为一致；如演示需要 tab 关闭即挂断，应后续统一调整。
- Incoming 自动接听倒计时仍保留。
