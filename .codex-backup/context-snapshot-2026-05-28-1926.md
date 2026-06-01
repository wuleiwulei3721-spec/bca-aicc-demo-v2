# Context Snapshot - 2026-05-28 19:26 +08:00

项目：`bca-aicc-demo-v2`
分支：`codex/livechat2-popup`
目标：继续本地调试并行 `livechat2` 来电弹屏方案，不替换旧 `Live Chat`，不 push 到 GitHub。

## 本轮状态

- Transfer 弹框 `Transfer Skill` 页签新增两列：`Agents`、`Ready`。
- `Agents` 从现有 `transferAgents` 按技能名称统计坐席总数。
- `Ready` 从同一技能队列中统计状态为 `Ready` 的坐席数量。
- 本轮没有新增 `TransferSkill` mock 字段或类型字段，统计从坐席 mock 派生。

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，仍保留既有 Vite/Rolldown chunk size warning。
- Browser `/`：可加载 Home tab。
- Browser `/design-system`：可加载 Design System。

## 风险

- 需要人工复查 Transfer Skill 表格新增列后的弹框密度和列宽。
