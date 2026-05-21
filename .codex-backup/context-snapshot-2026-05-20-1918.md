# Context Snapshot - 2026-05-20 19:18 +08:00

项目：`D:\03projects\bca-aicc-demo-v2`  
仓库：`https://github.com/wuleiwulei3721-spec/bca-aicc-demo-v2.git`  
分支：`main`  
HEAD：`1d9d9cb update browser title`

## 当前定位

这是一个银行 AICC 前端演示项目，核心是 BANK 1 风格坐席工作台。当前重点页面是 Inbound 电话来电弹屏，包含客户资料、业务历史、CRM 工作区、Agent Assistant 和话务状态机。

## 技术栈

- React 19
- TypeScript 6
- Vite 8
- Ant Design 6
- React Router 7
- Zustand 5
- Less

## 当前路由

- `/`：坐席工作台，默认 Home tab，来电后打开 Inbound tab。
- `/design-system`：统一 UI Design System。
- 其他路径：重定向到 `/`。

## 当前核心模块

- `BasicLayout`：Header、侧栏、坐席状态、话务工具条、内部聊天。
- `AgentWorkspace`：Home / Inbound tabs。
- `InboundPage`：三栏工作台。
- `LeftColumn`：客户资料、Journey、Ticket、NBA、Quick Action。
- `CrmPanel`：固定 CRM tab + 动态业务 tabs。
- `AssistantPanel`：Assistant tab + Connection tab。
- `DesignSystem`：组件与视觉规范。

## 当前业务状态

- 客户为 `Dimas Abimanyu Prabowo`。
- 部分业务内容已本地化为印尼语。
- CRM 与 Assistant 均为截图优先，fallback 兜底。
- 当前缺少真实截图资源：
  - `publiccode-based BANK 1 CRM fallback`
  - `publiccode-based BANK 1 Assistant fallback`

## 当前 Git 状态

当前有未提交业务改动，集中在 10 个文件：

```text
src/mock/inbound.ts
src/pages/inbound/InboundPage.tsx
src/pages/inbound/components/AssistantPanel.tsx
src/pages/inbound/components/CrmPanel.tsx
src/pages/inbound/components/LeftColumn.tsx
src/pages/inbound/components/NextBestActionCard.tsx
src/pages/inbound/components/QuickActionCard.tsx
src/pages/inbound/components/TicketingHistoryCard.tsx
src/styles/index.less
src/types/inbound.ts
```

diff 统计：

```text
10 files changed, 987 insertions(+), 95 deletions(-)
```

本次新增上下文机制文件，不修改业务源码。

## 恢复入口

如果 Codex 历史丢失，从以下文件恢复：

1. `PROJECT_CONTEXT.md`
2. `DEV_LOG.md`
3. `.codex-backup/context-snapshot-2026-05-20-1918.md`
4. `.codex-backup/current-todo-2026-05-20-1918.md`
5. `.codex-backup/page-state-2026-05-20-1918.md`
6. `codex-recovered-context.md`



