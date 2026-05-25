# Context Snapshot - 2026-05-25 13:17 +08:00

项目：BANK 1 AICC Demo V2  
路径：`D:\03projects\bca-aicc-demo-v2`  
当前分支：`codex/call-handoff-ready-feedback`  
目标版本：`v0.6.4`

## 当前状态

- `main@v0.6.3` 已具备通话接入阻塞提示。
- 本轮将阻塞提示升级为 Ready-aware：坐席必须 Ready + Idle + 无未结束 call，才能接入新的电话、BankApp Voice 或 BankApp Video。
- Answer 黄色按钮保持深色文字和图标，不改白色。

## 本轮关键修改

- `appStore` 新增 `VoiceVideoHandoffReadiness`：`available`、`active-call`、`not-ready`，并提供 `setVoiceVideoHandoffReadiness()`。
- `BasicLayout` 计算 readiness 并同步到 store；PSTN / voice / video 入口按 readiness 显示不同顶部 warning。
- `BankAppDemoPage` 在 Voice / Video handoff 前读取 readiness，`active-call` 和 `not-ready` 都会阻止 request 和 `agent-workspace` 跳转，并显示对应 inline warning。
- Live Chat 路径不受 voice/video readiness 限制影响。

## 验证状态

- `npm run lint` 通过。
- `npm run build` 通过；仍保留既有 Vite/Rolldown chunk size warning。
- Browser smoke check `/`：
  - PSTN Incoming 未挂机时再次点击 PSTN，不新增 tab，顶部提示包含 hang up + Ready。
  - PSTN Hang Up 后 ACW/Not Ready 阶段点击 PSTN，不新增 tab，顶部提示 Agent is not Ready。
  - PSTN 未挂机时 BankApp Voice / Video `Next Step` 均显示 hang up + Ready inline warning，且不创建对应 call tab。
  - PSTN Hang Up 后 ACW/Not Ready 阶段 BankApp Video `Next Step` 显示 Agent must be Ready。
  - 自动回 Ready 后 BankApp Video 可正常创建 `Video Call` tab。
  - Incoming 状态下 Answer 按钮仍为黄色背景、深色文字和深色图标。
- Browser smoke check `/design-system` 正常加载。

## 风险

- 当前仍只支持一路 active voice/video call；本轮不改变该限制。
- `voiceVideoHandoffReadiness` 由 `BasicLayout` 同步到 store；当前所有相关页面都运行在 `BasicLayout` 内，符合现有架构。
