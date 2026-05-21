# Context Snapshot - 2026-05-21 15:39 +08:00

## 项目目标

`bca-aicc-demo-v2` 是 BANK 1 银行 AICC 前端演示系统。当前主 Workspace 保持旧版稳定视觉，本轮只细化左侧系统菜单，避免影响 Inbound、Design System 和现有 AICC 话务工作台逻辑。

## 本次修改

- 展开态侧栏顶部从单独折叠按钮改为紧凑工具行：Collapse 按钮 + `Search menu` 输入框。
- 收起态继续只显示 Expand 按钮和一级菜单图标，不显示搜索框。
- 收起时会清空搜索条件，避免过滤状态影响收起图标列表。
- 菜单文案统一改为英文企业呼叫中心口径。
- 菜单行高、图标尺寸、字体和间距已压缩，贴近当前系统信息密度。

## 菜单结构

- Channel Simulation：PSTN / Voice、Live Chat、Video Call。
- Agent Center：Agent Profile、Service History。
- Operations：Alert KPI Management、Floor Management。
- Call Management：暂不配置二级菜单。
- Reports：暂不配置二级菜单。

## 关键文件

- `src/layouts/BasicLayout.tsx`
- `src/styles/index.less`
- `PROJECT_CONTEXT.md`
- `DEV_LOG.md`

## 验证

- `npm run lint`：通过。
- `npm run build`：通过，保留既有 Vite chunk size warning。
- Browser 检查 `/`：默认收起正常；展开后搜索框可过滤到 `Live Chat`；收起后搜索框隐藏。
- Browser 检查 `/design-system`：页面可访问，主体内容未被菜单调整影响。

## 风险

- 菜单搜索只处理当前静态菜单项，不绑定权限、路由或真实渠道模拟流程。
- 展开菜单会占用 `220px` 左侧宽度，仍需在最终演示分辨率下复查 Inbound 三栏宽度。
