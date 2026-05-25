# Context Snapshot - 2026-05-25 12:53 +08:00

项目：BANK 1 AICC Demo V2  
路径：`D:\03projects\bca-aicc-demo-v2`  
当前分支：`codex/call-handoff-blocking-feedback`  
目标版本：`v0.6.3`

## 当前状态

- `main@v0.6.2` 已作为 Live Chat 闪烁范围与 SLA 颜色优化基线。
- 本轮只补充电话 / BankApp Voice / BankApp Video 在已有未挂断通话时的可见阻塞提示。
- 保持现有限制：同一时间只有一路未挂断 voice/video call 控制话务条；不新增多路同时 active call。

## 本轮关键修改

- `BasicLayout` 增加 `callHandoffNotice`：当 PSTN / voice / video 入口被当前未结束 `CallInteraction` 阻塞时，在 Header / 话务条下方显示短暂 warning。
- `BankAppDemoPage` 在 Voice / Video 的 `Connected -> Agent Workspace` 前检查当前未结束通话；阻塞时显示 inline warning，不触发 store request，不进入 `agent-workspace`。
- `index.less` 新增 `.aicc-call-handoff-warning` 与 `.bankapp-process__handoff-warning` 样式，保持轻量 amber warning，不使用 modal。
- Live Chat 路径不受阻塞逻辑影响。

## 验证状态

- `npm run lint` 通过。
- `npm run build` 通过；仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：
  - Sign In -> PSTN Incoming 后再次点击 PSTN，不新增 tab，并显示顶部 active call warning。
  - PSTN 未挂机时 BankApp Voice `Connected -> Next Step` 显示 inline warning，未创建 `Voice Call` tab。
  - Hang Up 当前 PSTN 并自动回 Ready 后，BankApp Voice 可正常创建 `Voice Call` tab。
  - PSTN 未挂机时 BankApp Video `Connected -> Next Step` 显示 inline warning，未创建 `Video Call` tab。
- Browser smoke check `/design-system` 正常加载。

## 风险

- 本轮只是让现有限制可见，不支持多路同时通话。
- Not Ready / AUX / ACW 导致不能接入时仍没有专用提示；后续如客户关注，应单独补 `Agent is not Ready` 类提示，避免和未挂机提示混淆。
