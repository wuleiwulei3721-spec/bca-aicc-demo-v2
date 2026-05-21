# Codex Backup 目录说明

本目录用于保存可独立恢复的开发上下文，目标是不依赖 Codex sidebar、聊天历史、账号状态或 UI 缓存。

## 文件类型

- `context-snapshot-YYYY-MM-DD-HHMM.md`：阶段性项目上下文快照。
- `current-todo-YYYY-MM-DD-HHMM.md`：该时间点的 TODO 和优先级。
- `page-state-YYYY-MM-DD-HHMM.md`：该时间点页面、路由、交互和资源状态。
- `key-prompts.md`：关键 prompt 与需求口径。
- `session-restore-summary-*.md`：session 恢复摘要。
- `rollout-recovery-result-*.md`：rollout 恢复结果。

## 更新规则

每次重大修改后：

1. 更新根目录 `PROJECT_CONTEXT.md`。
2. 更新根目录 `DEV_LOG.md`。
3. 在本目录新增一组 snapshot/todo/page-state 文件。
4. 如修改了关键 prompt，更新 `key-prompts.md`。

不要在本目录保存密钥、token、账号密码、客户真实敏感数据或无法提交到仓库的私密信息。



