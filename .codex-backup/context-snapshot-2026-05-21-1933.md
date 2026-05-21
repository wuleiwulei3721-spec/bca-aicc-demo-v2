# Context Snapshot - 2026-05-21 19:33 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统。本轮继续在 `codex/videocall-popup` 分支细化 Video Call 演示体验。

## 本次修改

- OpenEye 截图浮窗不再随 Video Call tab 立即显示。
- Video Call 触发 Incoming 后，Answer 按钮亮起，但 OpenEye 截图仍隐藏。
- 视频通话接通进入 Talking/Hold/Mute 后，OpenEye 截图显示。
- Hang Up、关闭 Video Call tab 或非视频通话状态会隐藏 OpenEye 截图。
- Haloapps 视频渠道打开 `Call Flow Detail` 时不显示 `IVR Journey`。
- Home tab 去掉固定最小宽度，标签宽度随内容适配并居中。

## 关键文件

- `src/layouts/BasicLayout.tsx`
- `src/store/appStore.ts`
- `src/pages/inbound/VideoCallPage.tsx`
- `src/pages/inbound/components/CallFlowDetailModal.tsx`
- `src/pages/inbound/components/CustomerInformationCard.tsx`
- `src/styles/index.less`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/`：Video Call Incoming 阶段 OpenEye 不显示；Answer 后 OpenEye 显示；Haloapps Call Flow Detail 不显示 IVR Journey；Hang Up 后 OpenEye 隐藏。
- Browser smoke check `/design-system`：页面正常加载。

## 风险

- OpenEye 仍为截图模拟，不接真实客户端协议和音视频能力。
- 关闭 Video Call tab 不自动 Hang Up，只隐藏 workspace 与 OpenEye 浮窗，保持与现有 Inbound tab 关闭策略一致。
