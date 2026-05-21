# Context Snapshot - 2026-05-21 18:01 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统。本轮在不直接修改 `main` 的前提下，创建 `codex/videocall-popup` 分支，先完成 PSTN/Voice 电话来电触发方式改造。Video Call 弹屏页面仍等待后续详细需求。

## 本次修改

- 从干净 `main` 创建并切换到 `codex/videocall-popup`。
- 移除 `BasicLayout` 中 Ready + Idle 后 2 秒自动模拟来电逻辑。
- 新增 `triggerVoiceInboundCall()`，仅在坐席 `Ready` 且 `callStatus === 'Idle'` 时触发。
- 点击左侧 `Channel Simulation > PSTN / Voice` 后进入 `Incoming`，打开 Inbound tab，并使话务条 Answer 按钮亮起。
- 保留 Answer、Talking、Hold、Mute、Hang Up、After Call Work 与 `autoAnswerSeconds` 自动接听倒计时。
- `Video Call` 菜单本轮不绑定弹屏功能。

## 关键文件

- `src/layouts/BasicLayout.tsx`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite chunk size warning。
- Browser smoke check `/`：Sign In 后等待超过 2 秒不会自动弹 Inbound；点击 `PSTN / Voice` 后 Answer 可用且 Inbound tab 打开；进入 Talking 后可 Hang Up，并按既有 ACW 流程从 Not Ready 回 Ready。
- Browser smoke check `/design-system`：页面正常加载。

## 风险

- 自动接听倒计时仍保留；如演示必须要求手动点击 Answer，需要后续调整 Incoming 自动接听逻辑。
- Video Call 页面与视频弹屏未实现，需等待详细需求。
- 当前没有专门的自动化测试覆盖话务状态机，主要依赖 lint/build 与浏览器 smoke check。
