# Context Snapshot - 2026-05-27 22:56 +08:00

项目：BANK 1 AICC Demo V2  
路径：`D:\03projects\bca-aicc-demo-v2`  
当前分支：`codex/modal-review-fixes`

## 当前状态

- 当前分支是弹框评审发布线，从 `codex/fix-toolbar-chat-modals` 创建。
- 本分支包含昨天弹框样式优化，不包含 `codex/livechat2-popup` 的 livechat2 commits。
- 本轮只调整 Transfer / Outbound 弹框、transfer mock/type 和通用弹框样式。
- 本轮未 push 到 GitHub。

## 本轮关键修改

- `Transfer Agent` 与 `Outbound Call > Call Agent` 查询栏新增 `Skill Queue`、`Status` 筛选。
- `TransferAgent` 类型新增 `skillName`、`status`；mock 坐席数据补齐技能名称与状态。
- Agent 列表新增 `Skill Name`、`Status` 列，并用紧凑状态 tag 展示 `Ready`、`Talking`、`Not Ready`。
- `Transfer Number` 页改为一行：号码输入框 + `Transfer` + `Conference`。
- 弹框输入框、SearchInput、Select、Search / Call 按钮和行内动作按钮收紧，修复输入文字与 placeholder 偏下。
- `PROJECT_CONTEXT.md` 与 `DEV_LOG.md` 已同步更新。

## 验证状态

- `npm run lint`：通过。
- `npm run build`：通过，仍有既有 Vite/Rolldown chunk size warning。
- `git diff --check`：通过，仅提示 LF/CRLF 转换。
- Browser `http://127.0.0.1:5174/`：主页面可加载，Internal Chat 弹框可通过可见 DOM 打开。
- Browser `http://127.0.0.1:5174/design-system`：正常加载。
- diff 文件名检查无 `livechat2` / `LiveChat2` 匹配。

## 风险

- Codex in-app browser 对隐藏侧栏/话务工具条点击不稳定，Transfer / Outbound 深层弹框仍需用户在本地浏览器中最终人工复查。
- 发布前必须确认只发布 `codex/modal-review-fixes`，不要 push `codex/livechat2-popup`。
